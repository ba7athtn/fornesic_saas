// src/controllers/imageController.js
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const mongoose = require('mongoose');
const Image = require('../models/Image');
const Analysis = require('../models/Analysis');
const { forensicUpload } = require('../middleware/upload');

// Services centralisés
const exifService = require('../services/exifService'); // EXIF unifié
const { ForensicService } = require('../services/forensicService'); // Service forensique unifié réel
const { performQuickForensicAnalysis } = require('../services/forensicAnalyzer');
const { createThumbnail } = require('../services/imageProcessor');
const { addAnalysisJob } = require('../services/analysisQueue');

// LAZY LOADING pour modules lourds
const getHeavyAnalyzer = () => require('../services/heavyAnalyzer');

// =====================================
// CONTRÔLEUR IMAGES FORENSIQUES AVANCÉE - OPTIMISÉ
// =====================================

// Validation ObjectId optimisée
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return new mongoose.Types.ObjectId(id);
};

// Cache pour images fréquemment consultées
const imageCache = new Map();
const IMAGE_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

// Sanitization des entrées
const sanitizeInput = (input) => {
  return typeof input === 'string'
    ? input.replace(/[<>"'&]/g, '')
    : input;
};

// Génération thumbnail optimisée (fallback si service indisponible)
const generateThumbnailFallback = async (inputPath, outputPath, options = {}) => {
  try {
    const { width = 300, height = 300, quality = 85 } = options;

    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({
        quality: quality,
        progressive: true
      })
      .toFile(outputPath);

    console.log(`✅ Thumbnail généré (fallback): ${path.basename(outputPath)}`);
    return outputPath;

  } catch (error) {
    console.error('❌ Erreur génération thumbnail fallback:', error);
    throw error;
  }
};

// FONCTION UTILITAIRE - Calcul entropie simple
const calculateSimpleEntropy = (buffer) => {
  const frequency = new Array(256).fill(0);
  const length = Math.min(buffer.length, 10000); // Analyser max 10KB pour la vitesse

  for (let i = 0; i < length; i++) {
    frequency[buffer[i]]++;
  }

  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (frequency[i] > 0) {
      const probability = frequency[i] / length;
      entropy -= probability * Math.log2(probability);
    }
  }

  return entropy / 8; // Normaliser entre 0 et 1
};

// Normalisation des flags pour respecter le schéma Mongoose
const normalizeFlags = (flags) => {
  if (!Array.isArray(flags)) return [];
  return flags.map((f) => {
    if (typeof f === 'string') return { code: f, severity: 'info', pillar: null };
    if (f && typeof f === 'object') return f;
    return { code: String(f), severity: 'info', pillar: null };
  });
};

// ANALYSE FORENSIQUE RAPIDE LOCALE (WRAPPER RÉEL)
const performQuickForensicAnalysisLocal = async (filePath, imageData) => {
  try {
    console.log(`🔍 Analyse forensique réelle (wrapper local): ${path.basename(filePath)}`);

    const analysis = {
      timestamp: new Date(),
      version: '3.0.0-unified-wrapper',
      pillars: {},
      overallScore: 0,
      flags: [],
      recommendations: []
    };

    // 1) EXIF via service centralisé
    let exifScore = 0;
    try {
      const exif = await exifService.processImage(filePath);
      const n = exif?.normalized?.data || {};
      const software = n?.technical?.software || null;
      const hasBasicExif = !!(n?.camera?.make || n?.camera?.model || n?.timestamps?.dateTimeOriginal);

      analysis.pillars.exif = {
        score: typeof exif?.forensic?.score === 'number' ? exif.forensic.score : (hasBasicExif ? 70 : 50),
        confidence: hasBasicExif ? 'high' : 'medium',
        details: {
          hasExif: hasBasicExif,
          camera: n?.camera?.make || 'Inconnu',
          model: n?.camera?.model || 'Inconnu',
          software: software || 'Inconnu',
          dateTime: n?.timestamps?.dateTimeOriginal || null
        },
        flags: (exif?.forensic?.flags || [])
      };
      exifScore = analysis.pillars.exif.score;
    } catch (e) {
      analysis.pillars.exif = {
        score: 50,
        confidence: 'low',
        details: { error: 'Erreur EXIF (centralisé)' },
        flags: ['EXIF_EXTRACTION_ERROR']
      };
      exifScore = 50;
    }

    // 2) Piliers unifiés via ForensicService
    const svc = new ForensicService();
    const include = {
      anatomical: true,
      physics: true,
      statistical: true,
      exif: false,       // déjà traité ci‑dessus
      behavioral: true,
      audio: false,      // off par défaut pour les images
      expert: false,     // intervention humaine normalement
      aiDetection: false // éviter bind lourds sur test rapide
    };

    const unified = await svc.analyzeImage(filePath, { include });

    if (unified?.anatomical) {
      analysis.pillars.anatomical = {
        score: unified.anatomical.overallScore ?? unified.anatomical.score ?? 0,
        confidence: unified.anatomical.confidence || 'medium',
        details: unified.anatomical.details || {}
      };
    }
    if (unified?.physics) {
      analysis.pillars.physics = {
        score: unified.physics.overallScore ?? unified.physics.score ?? 0,
        confidence: unified.physics.confidence || 'medium',
        details: unified.physics.details || {}
      };
    }
    if (unified?.statistical) {
      analysis.pillars.statistical = {
        score: unified.statistical.overallScore ?? unified.statistical.score ?? 0,
        confidence: unified.statistical.confidence || 'medium',
        details: unified.statistical.details || {}
      };
    }
    if (unified?.behavioral) {
      analysis.pillars.behavioral = {
        score: unified.behavioral.overallScore ?? unified.behavioral.score ?? 0,
        confidence: unified.behavioral.confidence || 'medium',
        details: unified.behavioral.details || {}
      };
    }

    // 3) Agrégats et classification (moyenne simple des piliers présents)
    const present = Object.values(analysis.pillars).filter(p => typeof p?.score === 'number');
    const sum = present.reduce((a, p) => a + (p.score || 0), 0);
    analysis.overallScore = present.length ? Math.round(sum / present.length) : 0;

    analysis.classification = analysis.overallScore >= 80 ? 'AUTHENTIC' :
                              analysis.overallScore >= 60 ? 'LIKELY_AUTHENTIC' :
                              analysis.overallScore >= 40 ? 'UNCERTAIN' :
                              analysis.overallScore >= 20 ? 'LIKELY_FAKE' : 'FAKE';

    // Recommandations basées sur le score
    if (analysis.overallScore < 60) {
      analysis.recommendations.push('Analyse approfondie recommandée');
    }

    console.log(`✅ Analyse forensique (réelle) terminée: ${analysis.overallScore}% (${analysis.classification})`);
    return analysis;

  } catch (error) {
    console.error('❌ Erreur analyse forensique (wrapper):', error);
    return {
      timestamp: new Date(),
      version: '3.0.0-error',
      pillars: {},
      overallScore: 0,
      classification: 'ERROR',
      flags: ['Erreur durant l\'analyse'],
      error: error.message
    };
  }
};

// =====================================
// CONTRÔLEUR UPLOAD FORENSIQUE PRINCIPAL
// =====================================

/**
 * @desc Upload forensique optimisé avec analyse rapide
 * @route POST /api/images/upload
 * @access Public/Private
 */
const uploadForensicImage = async (req, res) => {
  const processingId = crypto.randomBytes(8).toString('hex');
  const startTimestamp = Date.now();

  try {
    console.log(`📤 Upload forensique initié [${processingId}]`);

    // Validation fichier
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier fourni',
        type: 'NO_FILE_PROVIDED',
        details: 'Veuillez sélectionner une image à analyser'
      });
    }

    const file = req.file;
    console.log(`🔐 Calcul empreinte forensique [${processingId}]`);

    // Calcul empreintes cryptographiques
    const buffer = await fs.readFile(file.path);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const md5 = crypto.createHash('md5').update(buffer).digest('hex');

    console.log(`✅ Empreintes calculées [${processingId}]: { sha256: '${hash.substring(0, 16)}...', fileSize: ${buffer.length} }`);

    // Extraction EXIF préliminaire (centralisée)
    console.log(`📊 Extraction EXIF préliminaire [${processingId}]`);
    let exifData = {};
    try {
      const exif = await exifService.processImage(file?.path || file?.buffer);
      const normalized = exif?.normalized?.data || {};
      exifData = {
        camera: normalized.camera || null,
        technical: normalized.technical || null,
        timestamps: normalized.timestamps || null,
        gps: normalized.gps || null
      };
      console.log(`📊 EXIF normalisé (centralisé): ${Object.keys(normalized).length} sections`);
    } catch (exifError) {
      console.warn(`⚠️ Erreur EXIF (centralisé) [${processingId}]:`, exifError.message);
    }

    // Génération nom unique sécurisé
    const timestamp = Date.now();
    const randomSuffix = crypto.randomBytes(8).toString('hex');
    const sanitizedName = sanitizeInput(file.originalname);
    const extension = path.extname(sanitizedName);
    const baseName = path.basename(sanitizedName, extension);
    const uniqueFilename = `${baseName}_${timestamp}_${randomSuffix}${extension}`;

    // Chemins finaux
    const finalDir = './uploads/processed';
    const thumbnailDir = './uploads/thumbnails';
    const finalPath = path.join(finalDir, uniqueFilename);
    const thumbnailPath = path.join(thumbnailDir, `thumb_${uniqueFilename.replace(extension, '.jpg')}`);

    // Assurer existence dossiers
    await fs.mkdir(finalDir, { recursive: true });
    await fs.mkdir(thumbnailDir, { recursive: true });

    // Déplacer fichier vers destination finale
    await fs.rename(file.path, finalPath);

    // Création entrée MongoDB
    console.log(`💾 Création entrée forensique [${processingId}]`);
    const newImage = new Image({
      originalName: sanitizedName,
      filename: uniqueFilename,
      mimeType: file.mimetype,
      size: file.size,
      hash: hash,
      md5: md5,

      // Chemins fichiers
      files: {
        original: finalPath,
        processed: finalPath,
        thumbnail: null // Sera mis à jour après génération
      },

      // Métadonnées
      metadata: {
        width: 0,
        height: 0,
        format: path.extname(sanitizedName).substring(1).toLowerCase(),
        colorSpace: 'unknown',
        hasTransparency: false
      },

      // EXIF centralisé (uniformisé)
      exifData: exifData,

      // Statut initial
      status: 'uploaded',
      uploadedAt: new Date(),
      uploadedBy: req.user?.sub || 'anonymous',

      // Session
      sessionId: req.headers['x-session-id'] || 'anonymous',

      // Audit
      auditLog: [{
        action: 'IMAGE_UPLOADED',
        performedBy: req.user?.sub || 'anonymous',
        timestamp: new Date(),
        details: {
          originalName: sanitizedName,
          fileSize: file.size,
          mimeType: file.mimetype,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        }
      }],

      // Sécurité
      quarantine: {
        status: 'none',
        reason: null,
        quarantinedAt: null
      },

      // Analyse (sera mise à jour)
      forensicAnalysis: {
        status: 'pending',
        startedAt: null,
        completedAt: null,
        version: '3.0.0-quick',
        pillars: {},
        overallScore: null,
        classification: null,
        flags: [],
        recommendations: []
      }
    });

    const savedImage = await newImage.save();
    console.log(`✅ Image sauvée: ${savedImage._id} [${processingId}]`);

    // GÉNÉRATION THUMBNAIL EN ARRIÈRE-PLAN (non-bloquant)
    setImmediate(async () => {
      try {
        // Essayer le service imageProcessor d'abord
        try {
          await createThumbnail(finalPath, thumbnailDir, `thumb_${uniqueFilename.replace(extension, '.jpg')}`);
        } catch (serviceError) {
          // Fallback vers fonction locale
          console.warn(`⚠️ Service thumbnail indisponible, utilisation fallback [${processingId}]`);
          await generateThumbnailFallback(finalPath, thumbnailPath);
        }

        await Image.findByIdAndUpdate(savedImage._id, {
          'files.thumbnail': thumbnailPath
        });
        console.log(`✅ Thumbnail généré: ${savedImage._id}`);
      } catch (thumbError) {
        console.error(`❌ Erreur thumbnail [${processingId}]:`, thumbError.message);
      }
    });

    // ANALYSE FORENSIQUE RAPIDE EN ARRIÈRE-PLAN (non-bloquant)
    setImmediate(async () => {
      try {
        const metadata = await sharp(finalPath).metadata();

        // Mettre à jour métadonnées
        await Image.findByIdAndUpdate(savedImage._id, {
          'metadata.width': metadata.width,
          'metadata.height': metadata.height,
          'metadata.format': metadata.format,
          'metadata.colorSpace': metadata.space || 'unknown',
          'metadata.hasTransparency': metadata.hasAlpha || false,
          'forensicAnalysis.status': 'analyzing',
          'forensicAnalysis.startedAt': new Date(),
          'status': 'analyzing'
        });

        // Analyse forensique via service, fallback wrapper réel
        let analysis;
        try {
          analysis = await performQuickForensicAnalysis(finalPath, metadata);
        } catch (serviceError) {
          console.warn(`⚠️ Service forensic indisponible, wrapper unifié [${processingId}]`, serviceError?.message);
          analysis = await performQuickForensicAnalysisLocal(finalPath, metadata);
        }

        // Préparer les résultats pour persistance (flags normalisés)
        const dbAnalysis = {
          status: 'completed',
          completedAt: new Date(),
          version: analysis.version,
          pillars: analysis.pillars || {},
          overallScore: analysis.overallScore ?? null,
          classification: analysis.classification || null,
          flags: normalizeFlags(analysis.flags || []),
          recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : []
        };

        // Mettre à jour avec résultats d'analyse (notation pointée)
        await Image.findByIdAndUpdate(
          savedImage._id,
          {
            $set: {
              'forensicAnalysis.status': dbAnalysis.status,
              'forensicAnalysis.completedAt': dbAnalysis.completedAt,
              'forensicAnalysis.version': dbAnalysis.version,
              'forensicAnalysis.pillars': dbAnalysis.pillars,
              'forensicAnalysis.overallScore': dbAnalysis.overallScore,
              'forensicAnalysis.classification': dbAnalysis.classification,
              'forensicAnalysis.flags': dbAnalysis.flags,
              'forensicAnalysis.recommendations': dbAnalysis.recommendations,
              'authenticityScore': dbAnalysis.overallScore,
              'classification': dbAnalysis.classification,
              'status': 'analyzed'
            }
          },
          { new: false }
        );

        console.log(`✅ Analyse forensique terminée: ${savedImage._id} (${dbAnalysis.overallScore}%)`);

        // AJOUTER ANALYSE LOURDE EN QUEUE (si disponible)
        try {
          await addAnalysisJob(savedImage._id, finalPath);
          console.log(`📋 Job analyse lourde ajouté à la queue: ${savedImage._id}`);
        } catch (queueError) {
          console.warn(`⚠️ Queue indisponible [${processingId}]:`, queueError.message);
        }

      } catch (analysisError) {
        console.error(`❌ Erreur analyse [${processingId}]:`, analysisError.message);
        await Image.findByIdAndUpdate(savedImage._id, {
          'forensicAnalysis.status': 'failed',
          'forensicAnalysis.error': analysisError.message,
          'status': 'failed'
        });
      }
    });

    // RÉPONSE IMMÉDIATE (retourne aussi le payload pour uploadMultiple)
    const payload = {
      success: true,
      message: 'Image uploadée avec succès, analyse en cours',
      image: {
        id: savedImage._id,
        originalName: sanitizedName,
        filename: uniqueFilename,
        size: file.size,
        mimeType: file.mimetype,
        hash: hash.substring(0, 32),
        status: 'uploaded',
        analysisStatus: 'pending',
        uploadedAt: savedImage.uploadedAt,
        sessionId: savedImage.sessionId
      },
      processing: {
        id: processingId,
        estimatedTime: '5-15 seconds',
        statusUrl: `/api/images/${savedImage._id}/status`
      },
      nextSteps: [
        'Analyse forensique automatique en cours',
        'Génération thumbnail en cours',
        'Utilisez statusUrl pour suivre le progrès'
      ]
    };
    res.status(201).json(payload);
    console.log(`✅ Upload terminé: ${savedImage._id} [${processingId}] - ${Date.now() - startTimestamp}ms`);
    return payload;

  } catch (error) {
    console.error(`❌ Erreur upload forensique [${processingId}]:`, error);

    // Nettoyage en cas d'erreur
    if (req.file && fsSync.existsSync(req.file.path)) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('❌ Erreur nettoyage fichier:', cleanupError);
      }
    }

    const errPayload = {
      error: 'Erreur lors de l\'upload forensique',
      type: 'UPLOAD_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne',
      processingId: processingId,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errPayload);
    return errPayload;
  }
};

// =====================================
// CONTRÔLEUR UPLOAD MULTIPLE
// =====================================

const uploadMultipleForensicImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'Aucun fichier fourni',
        type: 'NO_FILES_PROVIDED'
      });
    }

    const results = [];
    const errors = [];

    for (const file of req.files) {
      try {
        // Simuler req.file pour réutiliser la logique d'upload simple
        const mockReq = { ...req, file: file };
        const mockRes = {
          status: () => ({ json: (data) => data }),
          json: (data) => data
        };

        const result = await uploadForensicImage(mockReq, mockRes);
        results.push(result);
      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `${results.length} images uploadées avec succès`,
      uploaded: results.length,
      failed: errors.length,
      results: results,
      errors: errors
    });

  } catch (error) {
    console.error('❌ Erreur upload multiple:', error);
    res.status(500).json({
      error: 'Erreur upload multiple',
      details: error.message
    });
  }
};

// =====================================
// CONTRÔLEUR DÉTAILS IMAGE
// =====================================

const getForensicImageDetails = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { includeExif = 'false', includeAuditLog = 'false' } = req.query;

    // Vérifier cache
    const cacheKey = `details_${imageId}_${includeExif}_${includeAuditLog}`;
    if (imageCache.has(cacheKey)) {
      const cached = imageCache.get(cacheKey);
      if (Date.now() - cached.timestamp < IMAGE_CACHE_TTL) {
        console.log(`📋 Détails image depuis cache: ${imageId}`);
        return res.json(cached.data);
      }
      imageCache.delete(cacheKey);
    }

    const objectId = validateObjectId(imageId);

    // Construction de la projection (uniformisée exifData)
    let projection = '-__v';
    if (includeExif !== 'true') {
      projection += ' -exifData';
    }
    if (includeAuditLog !== 'true' || !req.user?.roles?.includes('admin')) {
      projection += ' -auditLog';
    }

    const image = await Image.findById(objectId, projection)
      .populate({
        path: 'forensicAnalysis.relatedImages',
        select: 'originalName filename',
        strictPopulate: false
      })
      .lean();

    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND',
        imageId: imageId
      });
    }

    // Données de réponse
    const response = {
      success: true,
      image: image,
      metadata: {
        requestedAt: new Date().toISOString(),
        includesExif: includeExif === 'true',
        includesAuditLog: includeAuditLog === 'true' && req.user?.roles?.includes('admin'),
        cacheStatus: 'fresh'
      }
    };

    // Mettre en cache
    imageCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    console.log(`✅ Détails image récupérés: ${imageId}`);
    res.json(response);

  } catch (error) {
    console.error('❌ Erreur détails image:', error);
    res.status(500).json({
      error: 'Erreur récupération détails image',
      type: 'DETAILS_ERROR',
      details: error.message
    });
  }
};

// =====================================
// CONTRÔLEUR STATUT IMAGE
// =====================================

const getImageStatus = async (req, res) => {
  try {
    const { imageId } = req.params;
    const objectId = validateObjectId(imageId);

    const image = await Image.findById(objectId)
      .select('status authenticityScore classification forensicAnalysis.completedAt forensicAnalysis.status updatedAt')
      .lean();

    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND'
      });
    }

    // Dérivation fiable de l'état d'analyse
    const completed =
      !!image?.forensicAnalysis?.completedAt ||
      image?.status === 'analyzed' ||
      typeof image?.authenticityScore === 'number';

    const analysisStatus =
      completed ? 'completed' :
      ((image?.status === 'analyzing' || image?.forensicAnalysis?.status === 'analyzing') ? 'analyzing' : 'pending');

    res.json({
      success: true,
      imageId,
      status: image.status,
      analysisStatus,
      analysisCompleted: completed,
      authenticityScore: image.authenticityScore ?? null,
      classification: image.classification ?? null,
      lastUpdate: image?.forensicAnalysis?.completedAt || image?.updatedAt || new Date(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur statut image:', error);
    res.status(500).json({
      error: 'Erreur récupération statut',
      details: error.message
    });
  }
};
// =====================================
// CONTRÔLEUR LISTE IMAGES
// =====================================

const listForensicImages = async (req, res) => {
  const requestId = crypto.randomBytes(6).toString('hex');

  try {
    const {
      page = 1,
      limit = 50,
      sessionId,
      status,
      riskLevel,
      minScore,
      maxScore,
      dateFrom,
      dateTo,
      hasFlags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    console.log(`📋 Liste forensique demandée [${requestId}]: {
  page: ${page},
  limit: ${limit},
  filters: { sessionId: ${sessionId}, status: ${status}, riskLevel: ${riskLevel} }
}`);

    // Validation et limitation
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Construction du filtre
    const filter = {};

    // Filtres utilisateur ou anonyme
    if (req.user) {
      filter.uploadedBy = req.user.sub;
    } else {
      // Pour utilisateurs anonymes, filtrer par session si fournie
      if (sessionId) {
        filter.sessionId = sanitizeInput(sessionId);
      }
    }

    if (status) filter.status = status;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (minScore) filter.authenticityScore = { $gte: parseInt(minScore) };
    if (maxScore) {
      filter.authenticityScore = { ...filter.authenticityScore, $lte: parseInt(maxScore) };
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    if (hasFlags === 'true') {
      filter['forensicAnalysis.flags.0'] = { $exists: true };
    }

    if (search) {
      filter.$or = [
        { originalName: { $regex: sanitizeInput(search), $options: 'i' } },
        { filename: { $regex: sanitizeInput(search), $options: 'i' } }
      ];
    }

    // Construction du tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Requête avec projection optimisée
    const projection = {
      originalName: 1,
      filename: 1,
      mimeType: 1,
      size: 1,
      status: 1,
      authenticityScore: 1,
      classification: 1,
      createdAt: 1,
      uploadedAt: 1,
      'forensicAnalysis.status': 1,
      'forensicAnalysis.flags': 1,
      'files.thumbnail': 1,
      'metadata.width': 1,
      'metadata.height': 1
    };

    const [images, totalCount] = await Promise.all([
      Image.find(filter, projection)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Image.countDocuments(filter)
    ]);

    console.log(`✅ Liste forensique générée [${requestId}]: ${images.length}/${totalCount} résultats`);

    res.json({
      success: true,
      data: images,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum),
        hasNext: skip + limitNum < totalCount,
        hasPrev: pageNum > 1
      },
      filters: {
        sessionId,
        status,
        riskLevel,
        minScore,
        maxScore,
        dateFrom,
        dateTo,
        hasFlags,
        search
      },
      metadata: {
        requestId,
        generatedAt: new Date().toISOString(),
        authenticated: !!req.user
      }
    });

  } catch (error) {
    console.error(`❌ Erreur liste images [${requestId}]:`, error);
    res.status(500).json({
      error: 'Erreur récupération liste images',
      type: 'LIST_ERROR',
      requestId,
      details: error.message
    });
  }
};

// =====================================
// CONTRÔLEUR SUPPRESSION
// =====================================

const deleteForensicImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { reason, secure = 'false' } = req.query;

    const objectId = validateObjectId(imageId);
    const image = await Image.findById(objectId);

    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND'
      });
    }

    // Suppression des fichiers
    const filesToDelete = [
      image.files?.original,
      image.files?.processed,
      image.files?.thumbnail
    ].filter(Boolean);

    for (const filePath of filesToDelete) {
      try {
        if (fsSync.existsSync(filePath)) {
          if (secure === 'true') {
            // Suppression sécurisée (écraser puis supprimer)
            const buffer = Buffer.alloc(1024, 0);
            await fs.writeFile(filePath, buffer);
          }
          await fs.unlink(filePath);
        }
      } catch (fileError) {
        console.error(`⚠️ Erreur suppression fichier ${filePath}:`, fileError);
      }
    }

    // Suppression de la base de données
    await Image.findByIdAndDelete(objectId);

    console.log(`✅ Image supprimée: ${imageId} par ${req.user?.sub} - Raison: ${reason || 'Non spécifiée'}`);

    res.json({
      success: true,
      message: 'Image supprimée avec succès',
      deletedAt: new Date().toISOString(),
      secureDelete: secure === 'true',
      reason: reason || null
    });

  } catch (error) {
    console.error('❌ Erreur suppression image:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression',
      details: error.message
    });
  }
};

// =====================================
// EXPORTS
// =====================================

module.exports = {
  uploadForensicImage,
  uploadMultipleForensicImages,
  getForensicImageDetails,
  listForensicImages,
  deleteForensicImage,
  getImageStatus,

  // Utilitaires
  validateObjectId,
  generateThumbnailFallback,
  performQuickForensicAnalysisLocal
};
