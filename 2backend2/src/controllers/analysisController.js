// src/controllers/analysisController.js
const mongoose = require('mongoose');
const Image = require('../models/Image');
const Analysis = require('../models/Analysis');
const crypto = require('crypto');
const { ForensicService } = require('../services/forensicService'); // Intégration service unifié
const exifService = require('../services/exifService'); // API EXIF unifiée

// =====================================
// CONTRÔLEUR ANALYSE FORENSIQUE AVANCÉE - OPTIMISÉ
// =====================================

// Validation ObjectId optimisée
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return new mongoose.Types.ObjectId(id);
};

// Cache pour analyses fréquentes
const analysisCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Sanitization des entrées
const sanitizeInput = (input) => {
  return typeof input === 'string'
    ? input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    : input;
};

/**
 * Nouveau handler: Analyse unifiée via ForensicService (non destructif)
 * N'affecte pas les handlers existants; à câbler sur une route d’essai si souhaité.
 */
exports.analyzeUnified = async (req, res) => {
  const requestId = crypto.randomBytes(8).toString('hex');
  try {
    const svc = new ForensicService();
    // Supporte: req.file.buffer (upload), req.body.imageBuffer (Buffer/base64), req.body.imagePath (chemin)
    const input = req.file?.buffer || req.body?.imageBuffer || req.body?.imagePath || req.body?.input || null;
    if (!input) {
      return res.status(400).json({
        error: 'Image manquante (fournir file.buffer, imageBuffer ou imagePath)',
        type: 'MISSING_IMAGE_INPUT',
        requestId,
        timestamp: new Date().toISOString()
      });
    }
    const result = await svc.analyzeImage(input, {});
    const report = svc.generateUnifiedReport(result);

    // En-têtes utiles
    res.setHeader('X-Forensic-Analysis-Version', 'unified-service-1.0.0');
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Privacy-Mode', req.privacyMode || 'COMMERCIAL');

    return res.json({ ok: true, result, report, requestId });
  } catch (e) {
    console.error(`❌ Erreur analyzeUnified [${requestId}]:`, e.message);
    return res.status(500).json({
      error: 'Erreur lors de l’analyse unifiée',
      type: 'UNIFIED_ANALYSIS_ERROR',
      requestId,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { details: e.message })
    });
  }
};

/**
 * Obtenir l'analyse complète d'une image avec tous les piliers forensiques
 */
exports.getComprehensiveAnalysis = async (req, res) => {
  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  try {
    const { imageId } = req.params;
    const { includePillars = 'all', format = 'json' } = req.query;

    // Validation ObjectId optimisée
    const objectId = req.forensicObjectId || validateObjectId(imageId);

    console.log(`🔍 Récupération analyse complète: ${imageId} [${requestId}]`);

    // Vérification cache
    const cacheKey = `analysis-${imageId}-${includePillars}`;
    if (analysisCache.has(cacheKey)) {
      const cached = analysisCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`💾 Cache hit pour analyse: ${imageId} [${requestId}]`);
        return res.json(cached.data);
      }
      analysisCache.delete(cacheKey);
    }

    // Récupération parallèle Image + Analysis
    const [image, analysis] = await Promise.all([
      Image.findById(objectId)
        .select('originalName status authenticityScore riskClassification forensicAnalysis exifData createdAt size hash updatedAt')
        .lean(),
      Analysis.findOne({ imageId: objectId }).lean()
    ]);

    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND',
        imageId: imageId,
        requestId: requestId,
        timestamp: new Date().toISOString()
      });
    }

    // Vérification statut analyse
    if (image.status !== 'analyzed') {
      const statusMessages = {
        'uploaded': 'Image uploadée, analyse non démarrée',
        'processing': 'Analyse en cours - Veuillez patienter',
        'error': 'Erreur lors de l\'analyse',
        'quarantined': 'Image mise en quarantaine pour sécurité'
      };

      return res.status(202).json({
        error: 'Analyse non disponible',
        type: 'ANALYSIS_NOT_READY',
        status: image.status,
        message: statusMessages[image.status] || 'Statut inconnu',
        estimatedCompletion: image.status === 'processing'
          ? new Date(Date.now() + 300000).toISOString() : null, // +5min
        requestId: requestId,
        timestamp: new Date().toISOString()
      });
    }

    if (!analysis && !image.forensicAnalysis) {
      return res.status(404).json({
        error: 'Données d\'analyse manquantes',
        type: 'ANALYSIS_DATA_MISSING',
        details: 'L\'image est marquée comme analysée mais les données sont indisponibles',
        requestId: requestId,
        timestamp: new Date().toISOString()
      });
    }

    // Utiliser Analysis moderne ou fallback sur forensicAnalysis legacy
    const analysisData = analysis || {
      imageId: objectId,
      aggregatedScore: {
        authenticity: image.authenticityScore,
        riskLevel: image.riskClassification?.level,
        confidence: image.riskClassification?.confidence
      },
      // Mapper forensicAnalysis legacy vers structure moderne
      anatomicalAnalysis: extractPillarData(image.forensicAnalysis, 'anatomical'),
      physicsAnalysis: extractPillarData(image.forensicAnalysis, 'physics'),
      statisticalAnalysis: extractPillarData(image.forensicAnalysis, 'statistical'),
      exifForensics: extractPillarData(image.forensicAnalysis, 'exif'),
      behavioralAnalysis: extractPillarData(image.forensicAnalysis, 'behavioral'),
      audioForensics: extractPillarData(image.forensicAnalysis, 'audio'),
      expertAnalysis: extractPillarData(image.forensicAnalysis, 'expert'),
      consolidatedFlags: image.forensicAnalysis?.flags || []
    };

    // Filtrer piliers demandés
    const requestedPillars = includePillars === 'all'
      ? ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert']
      : includePillars.split(',').map(p => p.trim());

    // Construire réponse forensique complète
    const forensicResponse = {
      // Métadonnées de requête
      requestMetadata: {
        requestId: requestId,
        imageId: imageId,
        requestedAt: new Date().toISOString(),
        processingTime: Date.now() - startTime + 'ms',
        requestedPillars: requestedPillars,
        privacyMode: req.privacyMode || process.env.PRIVACY_MODE || 'COMMERCIAL'
      },

      // Informations image
      imageInformation: {
        id: image._id,
        filename: image.originalName,
        uploadDate: image.createdAt,
        fileSize: formatBytes(image.size),
        status: image.status,
        hash: req.privacyMode === 'JUDICIAL' ? image.hash :
          (image.hash ? image.hash.substring(0, 16) + '...' : null)
      },

      // Score global
      overallAssessment: {
        authenticityScore: analysisData.aggregatedScore?.authenticity || 0,
        riskLevel: analysisData.aggregatedScore?.riskLevel || 'UNCERTAIN',
        confidence: analysisData.aggregatedScore?.confidence || 'low',
        recommendation: generateRecommendation(analysisData.aggregatedScore),
        lastUpdated: analysis?.updatedAt || image.updatedAt || image.createdAt
      },

      // Analyse des 7 piliers
      forensicPillars: {},

      // Flags consolidés
      securityFlags: {
        total: analysisData.consolidatedFlags?.length || 0,
        critical: analysisData.consolidatedFlags?.filter(f => f.severity === 'critical').length || 0,
        warning: analysisData.consolidatedFlags?.filter(f => f.severity === 'warning').length || 0,
        info: analysisData.consolidatedFlags?.filter(f => f.severity === 'info').length || 0,
        flags: analysisData.consolidatedFlags || []
      },

      // Métadonnées EXIF (si autorisées)
      exifMetadata: req.privacyMode !== 'RESEARCH' ? (image.exifData || null) : null,

      // Chain of custody (si mode judiciaire)
      chainOfCustody: req.privacyMode === 'JUDICIAL' ? (analysis?.chainOfCustody || []) : null
    };

    // Ajouter données des piliers demandés
    requestedPillars.forEach(pillar => {
      if (analysisData[`${pillar}Analysis`]) {
        forensicResponse.forensicPillars[pillar] = {
          analyzed: true,
          overallScore: analysisData[`${pillar}Analysis`].overallScore || null,
          findings: extractPillarFindings(analysisData[`${pillar}Analysis`]),
          confidence: calculatePillarConfidence(analysisData[`${pillar}Analysis`])
        };
      } else {
        forensicResponse.forensicPillars[pillar] = {
          analyzed: false,
          reason: 'Pillar not available in analysis data'
        };
      }
    });

    // Mise en cache
    analysisCache.set(cacheKey, {
      data: forensicResponse,
      timestamp: Date.now()
    });

    // Ajouter entry à la chain of custody
    if (req.chainOfCustodyEntry) {
      await addChainOfCustodyEntry(analysis?._id, req.chainOfCustodyEntry);
    }

    // Headers de réponse forensique
    res.setHeader('X-Forensic-Analysis-Version', analysis?.analysisVersion || '2.1.0');
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Analysis-Timestamp', analysisData.createdAt || new Date().toISOString());
    res.setHeader('X-Privacy-Mode', req.privacyMode || 'COMMERCIAL');

    // Logging forensique sécurisé
    console.log(`✅ Analyse récupérée: ${imageId}`, {
      requestId: requestId,
      pillars: requestedPillars.length,
      flags: forensicResponse.securityFlags.total,
      processingTime: Date.now() - startTime + 'ms',
      userId: req.user?.sub || 'anonymous'
    });

    return res.json(forensicResponse);

  } catch (error) {
    console.error(`❌ Erreur récupération analyse [${requestId}]:`, {
      imageId: req.params.imageId,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      userId: req.user?.sub,
      processingTime: Date.now() - startTime + 'ms'
    });

    return res.status(500).json({
      error: 'Erreur serveur lors de la récupération de l\'analyse',
      type: 'ANALYSIS_RETRIEVAL_ERROR',
      requestId: requestId,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};

/**
 * Démarrer une nouvelle analyse forensique avec configuration des 7 piliers
 */
exports.initiateForensicAnalysis = async (req, res) => {
  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  try {
    const { imageId } = req.params;
    const {
      enabledPillars = {},
      privacyMode = 'COMMERCIAL',
      priority = 'normal',
      customWeights = {}
    } = req.body;

    // Sanitization des entrées
    const sanitizedPrivacyMode = sanitizeInput(privacyMode);
    const sanitizedPriority = sanitizeInput(priority);

    const objectId = req.forensicObjectId || validateObjectId(imageId);

    console.log(`🚀 Démarrage analyse forensique: ${imageId} [${requestId}]`);

    // Vérifier que l'image existe
    const image = await Image.findById(objectId);

    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée pour analyse',
        type: 'IMAGE_NOT_FOUND',
        imageId: imageId,
        requestId: requestId
      });
    }

    // Vérifier statut image
    if (image.status === 'processing') {
      return res.status(409).json({
        error: 'Analyse déjà en cours',
        type: 'ANALYSIS_IN_PROGRESS',
        message: 'Une analyse est déjà en cours pour cette image',
        estimatedCompletion: new Date(Date.now() + 300000).toISOString(),
        requestId: requestId
      });
    }

    if (image.status === 'quarantined') {
      return res.status(423).json({
        error: 'Image en quarantaine',
        type: 'IMAGE_QUARANTINED',
        message: 'Cette image a été mise en quarantaine pour des raisons de sécurité',
        requestId: requestId
      });
    }

    // Configuration par défaut des piliers
    const defaultPillarsConfig = {
      anatomical: true,
      physics: true,
      statistical: true,
      exif: true,
      behavioral: true,
      audio: false, // Désactivé par défaut pour images
      expert: false // Nécessite intervention manuelle
    };

    const finalPillarsConfig = { ...defaultPillarsConfig, ...enabledPillars };

    // Weights par défaut selon notre méthodologie
    const defaultWeights = {
      anatomical: 0.15,
      physics: 0.20,
      statistical: 0.20,
      exif: 0.25,
      behavioral: 0.10,
      audio: 0.05,
      expert: 0.05
    };

    const finalWeights = { ...defaultWeights, ...customWeights };

    // Valider que la somme des weights = 1.0
    const totalWeight = Object.values(finalWeights).reduce((sum, weight) => sum + weight, 0);

    if (Math.abs(totalWeight - 1.0) > 0.01) {
      return res.status(400).json({
        error: 'Configuration des poids invalide',
        type: 'INVALID_WEIGHTS_CONFIG',
        details: `La somme des poids doit être égale à 1.0 (actuel: ${totalWeight})`,
        requestId: requestId
      });
    }

    // Créer nouvelle analyse
    const newAnalysis = new Analysis({
      imageId: objectId,
      analysisVersion: '3.0.0-forensic',
      enabledPillars: finalPillarsConfig,
      pillarWeights: finalWeights,
      privacyMode: sanitizedPrivacyMode,
      status: 'pending',
      analysisMetadata: {
        startTime: new Date(),
        requestedBy: req.user?.sub || 'anonymous',
        priority: sanitizedPriority,
        requestId: requestId
      }
    });

    await newAnalysis.save();

    // Mettre à jour statut image
    await Image.findByIdAndUpdate(objectId, {
      status: 'processing',
      $push: {
        auditLog: {
          action: 'FORENSIC_ANALYSIS_INITIATED',
          performedBy: req.user?.sub || 'system',
          details: {
            requestId: requestId,
            enabledPillars: Object.keys(finalPillarsConfig).filter(k => finalPillarsConfig[k]),
            priority: sanitizedPriority
          }
        }
      }
    });

    // Lancer analyse asynchrone
    setImmediate(() => {
      executeForensicAnalysis(newAnalysis._id, objectId, finalPillarsConfig, finalWeights)
        .catch(error => {
          console.error(`❌ Erreur analyse async ${imageId}:`, error);
        });
    });

    // Réponse immédiate
    res.status(202).json({
      success: true,
      message: 'Analyse forensique initiée avec succès',
      analysisId: newAnalysis._id,
      imageId: imageId,
      requestId: requestId,
      estimatedCompletion: new Date(Date.now() + 300000).toISOString(), // +5min
      enabledPillars: Object.keys(finalPillarsConfig).filter(k => finalPillarsConfig[k]),
      status: 'pending',
      trackingUrl: `/api/analysis/${newAnalysis._id}/status`,
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Analyse initiée: ${imageId} → ${newAnalysis._id} [${requestId}]`);

  } catch (error) {
    console.error(`❌ Erreur initiation analyse [${requestId}]:`, error);
    res.status(500).json({
      error: 'Erreur lors de l\'initiation de l\'analyse',
      type: 'ANALYSIS_INITIATION_ERROR',
      requestId: requestId,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};

/**
 * Obtenir le statut en temps réel d'une analyse forensique
 */
exports.getAnalysisStatus = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const requestId = crypto.randomBytes(6).toString('hex');

    const analysis = await Analysis.findById(analysisId)
      .select('status analysisMetadata enabledPillars aggregatedScore consolidatedFlags')
      .lean();

    if (!analysis) {
      return res.status(404).json({
        error: 'Analyse non trouvée',
        type: 'ANALYSIS_NOT_FOUND',
        analysisId: analysisId,
        requestId: requestId
      });
    }

    const statusResponse = {
      analysisId: analysisId,
      status: analysis.status,
      progress: calculateAnalysisProgress(analysis),
      currentPhase: getCurrentPhase(analysis),
      enabledPillars: analysis.enabledPillars,
      estimatedTimeRemaining: estimateTimeRemaining(analysis),
      processingTime: analysis.analysisMetadata?.processingTime || null,
      completedAt: analysis.analysisMetadata?.endTime || null,
      errors: analysis.analysisMetadata?.errorsDuringAnalysis || [],
      requestId: requestId,
      timestamp: new Date().toISOString()
    };

    // Ajouter résultats si terminé
    if (analysis.status === 'completed') {
      statusResponse.results = {
        authenticityScore: analysis.aggregatedScore?.authenticity,
        riskLevel: analysis.aggregatedScore?.riskLevel,
        confidence: analysis.aggregatedScore?.confidence,
        flagsCount: analysis.consolidatedFlags?.length || 0,
        criticalFlags: analysis.consolidatedFlags?.filter(f => f.severity === 'critical').length || 0
      };
    }

    return res.json(statusResponse);

  } catch (error) {
    console.error('❌ Erreur getAnalysisStatus:', error);
    return res.status(500).json({
      error: 'Erreur lors de la récupération du statut',
      type: 'STATUS_RETRIEVAL_ERROR'
    });
  }
};

/**
 * Comparer deux analyses forensiques détaillées
 */
exports.compareForensicAnalyses = async (req, res) => {
  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  try {
    const { imageId1, imageId2, comparisonMode = 'comprehensive' } = req.body;

    // Validation
    if (!imageId1 || !imageId2) {
      return res.status(400).json({
        error: 'Deux IDs d\'images requis pour comparaison',
        type: 'MISSING_IMAGE_IDS',
        requestId: requestId
      });
    }

    if (imageId1 === imageId2) {
      return res.status(400).json({
        error: 'Impossible de comparer une image avec elle-même',
        type: 'IDENTICAL_IMAGE_IDS',
        requestId: requestId
      });
    }

    // Récupération parallèle des analyses
    const [analysis1, analysis2, image1, image2] = await Promise.all([
      Analysis.findOne({ imageId: imageId1 }).lean(),
      Analysis.findOne({ imageId: imageId2 }).lean(),
      Image.findById(imageId1).select('originalName hash size exifData').lean(),
      Image.findById(imageId2).select('originalName hash size exifData').lean()
    ]);

    if (!image1 || !image2) {
      return res.status(404).json({
        error: 'Une ou plusieurs images non trouvées',
        type: 'IMAGES_NOT_FOUND',
        found: { image1: !!image1, image2: !!image2 },
        requestId: requestId
      });
    }

    if (!analysis1 || !analysis2) {
      return res.status(400).json({
        error: 'Analyses forensiques manquantes',
        type: 'ANALYSES_NOT_AVAILABLE',
        available: { analysis1: !!analysis1, analysis2: !!analysis2 },
        requestId: requestId
      });
    }

    // Comparaison forensique approfondie
    const comparison = {
      requestMetadata: {
        requestId: requestId,
        comparisonMode: comparisonMode,
        comparedAt: new Date().toISOString(),
        processingTime: null // Sera mis à jour à la fin
      },

      images: {
        image1: {
          id: imageId1,
          filename: image1.originalName,
          size: image1.size
        },
        image2: {
          id: imageId2,
          filename: image2.originalName,
          size: image2.size
        }
      },

      // Comparaison technique
      technicalComparison: {
        identical: image1.hash === image2.hash,
        sizeVariation: Math.abs(image1.size - image2.size),
        nameSimilarity: calculateNameSimilarity(image1.originalName, image2.originalName)
      },

      // Comparaison scores forensiques
      forensicComparison: {
        authenticityDelta: Math.abs(
          (analysis1.aggregatedScore?.authenticity || 0) -
          (analysis2.aggregatedScore?.authenticity || 0)
        ),
        riskLevelComparison: {
          image1: analysis1.aggregatedScore?.riskLevel,
          image2: analysis2.aggregatedScore?.riskLevel,
          concordant: analysis1.aggregatedScore?.riskLevel === analysis2.aggregatedScore?.riskLevel
        },
        confidenceComparison: {
          image1: analysis1.aggregatedScore?.confidence,
          image2: analysis2.aggregatedScore?.confidence,
          concordant: analysis1.aggregatedScore?.confidence === analysis2.aggregatedScore?.confidence
        }
      },

      // Comparaison par piliers
      pillarComparison: {},

      // Comparaison flags
      flagsComparison: compareFlags(analysis1.consolidatedFlags, analysis2.consolidatedFlags),

      // EXIF comparison
      exifComparison: image1.exifData && image2.exifData
        ? compareExifData(image1.exifData, image2.exifData) : null,

      // Évaluation globale
      overallAssessment: {
        suspiciousPattern: false,
        recommendation: '',
        confidence: 'medium'
      }
    };

    // Comparer chaque pilier
    const pillars = ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'];
    pillars.forEach(pillar => {
      const pillar1 = analysis1[`${pillar}Analysis`];
      const pillar2 = analysis2[`${pillar}Analysis`];

      if (pillar1 && pillar2) {
        comparison.pillarComparison[pillar] = {
          scoreDelta: Math.abs((pillar1.overallScore || 0) - (pillar2.overallScore || 0)),
          concordantFlags: comparePillarFlags(pillar1, pillar2),
          similarity: calculatePillarSimilarity(pillar1, pillar2)
        };
      }
    });

    // Évaluation globale de la comparaison
    comparison.overallAssessment = generateComparisonAssessment(comparison);
    comparison.requestMetadata.processingTime = Date.now() - startTime + 'ms';

    console.log(`✅ Comparaison forensique: ${imageId1} vs ${imageId2} [${requestId}]`);

    return res.json(comparison);

  } catch (error) {
    console.error(`❌ Erreur comparaison forensique [${requestId}]:`, error);
    return res.status(500).json({
      error: 'Erreur lors de la comparaison forensique',
      type: 'COMPARISON_ERROR',
      requestId: requestId,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Obtenir statistiques globales d'analyse avec métriques forensiques
 */
exports.getForensicStatistics = async (req, res) => {
  try {
    const { period = '30d', breakdown = 'risk' } = req.query;
    const requestId = crypto.randomBytes(6).toString('hex');

    // Calculer période
    const periodMs = parsePeriod(period);
    const startDate = new Date(Date.now() - periodMs);

    // Agrégations MongoDB optimisées
    const [globalStats, riskDistribution, pillarStats, recentActivity] = await Promise.all([
      // Statistiques globales
      Analysis.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalAnalyses: { $sum: 1 },
            completedAnalyses: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            averageScore: { $avg: '$aggregatedScore.authenticity' },
            totalFlags: { $sum: { $size: { $ifNull: ['$consolidatedFlags', []] } } },
            averageProcessingTime: { $avg: '$analysisMetadata.processingTime' }
          }
        }
      ]),

      // Distribution des niveaux de risque
      Analysis.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
        { $group: { _id: '$aggregatedScore.riskLevel', count: { $sum: 1 } } }
      ]),

      // Statistiques par pilier
      Analysis.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
        {
          $project: {
            anatomical: '$anatomicalAnalysis.overallScore',
            physics: '$physicsAnalysis.overallScore',
            statistical: '$statisticalAnalysis.overallScore',
            exif: '$exifForensics.overallScore',
            behavioral: '$behavioralAnalysis.overallScore',
            audio: '$audioForensics.overallScore',
            expert: '$expertAnalysis.overallScore'
          }
        },
        {
          $group: {
            _id: null,
            avgAnatomical: { $avg: '$anatomical' },
            avgPhysics: { $avg: '$physics' },
            avgStatistical: { $avg: '$statistical' },
            avgExif: { $avg: '$exif' },
            avgBehavioral: { $avg: '$behavioral' },
            avgAudio: { $avg: '$audio' },
            avgExpert: { $avg: '$expert' }
          }
        }
      ]),

      // Activité récente
      Analysis.find({ createdAt: { $gte: startDate } })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('imageId aggregatedScore status createdAt')
        .populate('imageId', 'originalName')
        .lean()
    ]);

    const statistics = {
      requestMetadata: {
        requestId: requestId,
        period: period,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        breakdown: breakdown
      },

      overview: {
        totalAnalyses: globalStats?.totalAnalyses || 0,
        completedAnalyses: globalStats?.completedAnalyses || 0,
        completionRate: globalStats?.totalAnalyses > 0
          ? Math.round((globalStats.completedAnalyses / globalStats.totalAnalyses) * 100) : 0,
        averageAuthenticityScore: Math.round(globalStats?.averageScore || 0),
        totalSecurityFlags: globalStats?.totalFlags || 0,
        averageProcessingTime: Math.round(globalStats?.averageProcessingTime || 0)
      },

      riskDistribution: riskDistribution.reduce((acc, item) => {
        acc[item._id || 'UNKNOWN'] = item.count;
        return acc;
      }, {}),

      pillarPerformance: {
        anatomical: Math.round(pillarStats?.avgAnatomical || 0),
        physics: Math.round(pillarStats?.avgPhysics || 0),
        statistical: Math.round(pillarStats?.avgStatistical || 0),
        exif: Math.round(pillarStats?.avgExif || 0),
        behavioral: Math.round(pillarStats?.avgBehavioral || 0),
        audio: Math.round(pillarStats?.avgAudio || 0),
        expert: Math.round(pillarStats?.avgExpert || 0)
      },

      recentActivity: recentActivity.map(analysis => ({
        id: analysis._id,
        imageId: analysis.imageId?._id,
        imageName: analysis.imageId?.originalName,
        authenticityScore: analysis.aggregatedScore?.authenticity,
        riskLevel: analysis.aggregatedScore?.riskLevel,
        status: analysis.status,
        analyzedAt: analysis.createdAt
      })),

      generatedAt: new Date().toISOString()
    };

    return res.json(statistics);

  } catch (error) {
    console.error('❌ Erreur statistiques forensiques:', error);
    return res.status(500).json({
      error: 'Erreur lors de la génération des statistiques',
      type: 'STATISTICS_ERROR'
    });
  }
};

/**
 * Obtenir le résumé d'une session
 */
exports.getSessionSummary = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { includeDetails = 'false' } = req.query;

    const sanitizedSessionId = sanitizeInput(sessionId);

    // Récupérer toutes les analyses de la session
    const analyses = await Analysis.find({
      'metadata.sessionId': sanitizedSessionId
    }).populate('image', 'originalName filename size mimeType').lean();

    if (analyses.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Aucune analyse trouvée pour cette session',
        type: 'SESSION_NOT_FOUND',
        sessionId: sessionId
      });
    }

    // Calcul des statistiques de session
    const completedAnalyses = analyses.filter(a => a.status === 'completed');
    const totalScore = completedAnalyses.reduce((sum, a) => sum + (a.overallScore || 0), 0);
    const averageScore = completedAnalyses.length > 0 ? totalScore / completedAnalyses.length : 0;

    // Répartition des classifications
    const classificationCounts = {};
    completedAnalyses.forEach(analysis => {
      const classification = analysis.classification || 'UNKNOWN';
      classificationCounts[classification] = (classificationCounts[classification] || 0) + 1;
    });

    // Flags les plus fréquents
    const flagCounts = {};
    completedAnalyses.forEach(analysis => {
      (analysis.flags || []).forEach(flag => {
        flagCounts[flag] = (flagCounts[flag] || 0) + 1;
      });
    });

    const sessionSummary = {
      success: true,
      sessionId: sessionId,
      summary: {
        totalAnalyses: analyses.length,
        completedAnalyses: completedAnalyses.length,
        pendingAnalyses: analyses.filter(a => a.status === 'pending').length,
        failedAnalyses: analyses.filter(a => a.status === 'failed').length,
        averageScore: Math.round(averageScore),
        classifications: classificationCounts,
        mostCommonFlags: Object.entries(flagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([flag, count]) => ({ flag, count })),
        sessionStarted: analyses.reduce((earliest, a) =>
          (a.requestedAt || a.createdAt) < earliest ? (a.requestedAt || a.createdAt) : earliest,
          analyses.requestedAt || analyses.createdAt
        ),
        lastActivity: analyses.reduce((latest, a) =>
          ((a.completedAt || a.requestedAt || a.createdAt) > latest)
            ? (a.completedAt || a.requestedAt || a.createdAt) : latest,
          analyses.requestedAt || analyses.createdAt
        )
      }
    };

    // Ajouter détails si demandé
    if (includeDetails === 'true') {
      sessionSummary.details = analyses.map(analysis => ({
        id: analysis._id,
        imageId: analysis.image._id,
        imageName: analysis.image.originalName,
        status: analysis.status,
        overallScore: analysis.overallScore,
        classification: analysis.classification,
        requestedAt: analysis.requestedAt,
        completedAt: analysis.completedAt
      }));
    }

    return res.json(sessionSummary);

  } catch (error) {
    console.error('❌ Erreur session summary:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du résumé de session',
      type: 'SESSION_SUMMARY_ERROR'
    });
  }
};

// =====================================
// FONCTIONS UTILITAIRES OPTIMISÉES
// =====================================

function extractPillarData(forensicAnalysis, pillarName) {
  if (!forensicAnalysis) return null;

  // Mapper les données legacy vers la nouvelle structure
  const mapping = {
    'anatomical': forensicAnalysis?.anatomicalAnalysis,
    'physics': forensicAnalysis?.physicsViolations,
    'statistical': forensicAnalysis?.statisticalAnomalies,
    'exif': forensicAnalysis?.exifInconsistencies,
    'behavioral': forensicAnalysis?.behavioralAnomalies,
    'audio': forensicAnalysis?.audioAnalysis,
    'expert': forensicAnalysis?.expertFlags
  };

  return mapping[pillarName] || null;
}

function extractPillarFindings(pillarData) {
  if (!pillarData) return [];

  const findings = [];

  // Extraire findings selon la structure du pilier
  if (pillarData.anomalies) {
    findings.push(...pillarData.anomalies);
  }

  if (pillarData.violations) {
    findings.push(...pillarData.violations);
  }

  if (pillarData.flags) {
    findings.push(...pillarData.flags);
  }

  return findings;
}

function calculatePillarConfidence(pillarData) {
  if (!pillarData) return 'low';

  const score = pillarData.overallScore || 0;
  const hasMultipleIndicators = extractPillarFindings(pillarData).length > 2;

  if (score > 80 && hasMultipleIndicators) return 'high';
  if (score > 60 || hasMultipleIndicators) return 'medium';
  return 'low';
}

function generateRecommendation(aggregatedScore) {
  if (!aggregatedScore) return 'Analyse incomplète - Évaluation impossible';

  const score = aggregatedScore.authenticity || 0;
  const riskLevel = aggregatedScore.riskLevel;

  const recommendations = {
    'AUTHENTIC': 'Image authentique - Utilisation recommandée',
    'LIKELY_AUTHENTIC': 'Image probablement authentique - Utilisation acceptable avec vigilance',
    'UNCERTAIN': '⚠️ Authenticité incertaine - Investigation supplémentaire recommandée',
    'LIKELY_FAKE': '🚨 Image probablement falsifiée - Vérification experte obligatoire',
    'FAKE': '🛑 Image détectée comme falsifiée - Ne pas utiliser sans expertise forensique'
  };

  return recommendations[riskLevel] || 'Évaluation non disponible';
}

async function addChainOfCustodyEntry(analysisId, entry) {
  if (!analysisId || !entry) return;

  try {
    await Analysis.findByIdAndUpdate(analysisId, {
      $push: {
        'chainOfCustody.entries': {
          timestamp: new Date(),
          action: entry.action,
          performedBy: entry.performedBy,
          details: entry.details
        }
      }
    });
  } catch (error) {
    console.error('❌ Erreur ajout chain of custody:', error);
  }
}

async function executeForensicAnalysis(analysisId, imageId, pillarsConfig, weights) {
  const execStart = Date.now();
  try {
    console.log(`🔬 Exécution analyse forensique: ${analysisId}`);

    // 0) Statut -> running
    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'running',
      'analysisMetadata.startTime': new Date()
    });

    // 1) Charger doc image (inclut files.original)
    const imageDoc = await Image.findById(imageId)
      .select('files path filePath storagePath localPath buffer exifData originalName')
      .lean();

    if (!imageDoc) throw new Error('IMAGE_NOT_FOUND_FOR_ANALYSIS');

    const analysisResults = {}; // Collecte des résultats réels des piliers

    // 2) EXIF centralisé robuste
    if (pillarsConfig?.exif) {
      try {
        const imageInput =
          imageDoc?.files?.original ||
          imageDoc?.path ||
          imageDoc?.filePath ||
          imageDoc?.storagePath ||
          imageDoc?.localPath ||
          null;

        if (imageInput) {
          const exif = await exifService.processImage(imageInput);

          const normalizedData = exif?.normalized?.data || null;
          const validated = exif?.validated || { ok: false, valid: false, warnings: ['EXIF_RESULT_EMPTY'] };
          const forensic = exif?.forensic || { ok: false, score: 0, flags: ['EXIF_RESULT_EMPTY'] };

          if (normalizedData) {
            await Image.findByIdAndUpdate(imageId, {
              exifData: {
                camera: normalizedData.camera || null,
                technical: normalizedData.technical || null,
                timestamps: normalizedData.timestamps || null,
                gps: normalizedData.gps || null
              }
            });
          }

          analysisResults.exifForensics = {
            overallScore: typeof forensic.score === 'number' ? forensic.score : 0,
            metadata: normalizedData,
            validated,
            forensic
          };
        } else {
          analysisResults.exifForensics = {
            overallScore: 0,
            metadata: null,
            validated: { ok: false, valid: false, warnings: ['NO_IMAGE_PATH'] },
            forensic: { ok: false, score: 0, flags: ['NO_IMAGE_PATH'] }
          };
        }
      } catch (e) {
        console.warn(`⚠️ EXIF centralisé échoué pour ${imageId}:`, e.message);
        analysisResults.exifForensics = {
          overallScore: 0,
          metadata: null,
          validated: { ok: false, valid: false, warnings: ['EXIF_EXTRACTION_ERROR'] },
          forensic: { ok: false, score: 0, flags: ['EXIF_EXTRACTION_ERROR'] }
        };
      }
    }

    // 3) ForensicService pour les autres piliers
    const svc = new ForensicService();
    const include = {
      anatomical: !!pillarsConfig?.anatomical,
      physics: !!pillarsConfig?.physics,
      statistical: !!pillarsConfig?.statistical,
      exif: false,
      behavioral: !!pillarsConfig?.behavioral,
      audio: !!pillarsConfig?.audio,
      expert: !!pillarsConfig?.expert,
      aiDetection: false
    };

    const imageInputUnified =
      imageDoc?.files?.original ||
      imageDoc?.path ||
      imageDoc?.filePath ||
      imageDoc?.storagePath ||
      imageDoc?.localPath ||
      null;

    if (imageInputUnified) {
      const unified = await svc.analyzeImage(imageInputUnified, { include });

      if (include.anatomical && unified?.anatomical) {
        analysisResults.anatomicalAnalysis = {
          overallScore: unified.anatomical.overallScore ?? unified.anatomical.score ?? 0,
          findings: unified.anatomical.findings || [],
          confidence: unified.anatomical.confidence || 'medium'
        };
      }
      if (include.physics && unified?.physics) {
        analysisResults.physicsAnalysis = {
          overallScore: unified.physics.overallScore ?? unified.physics.score ?? 0,
          findings: unified.physics.findings || [],
          confidence: unified.physics.confidence || 'medium'
        };
      }
      if (include.statistical && unified?.statistical) {
        analysisResults.statisticalAnalysis = {
          overallScore: unified.statistical.overallScore ?? unified.statistical.score ?? 0,
          findings: unified.statistical.findings || [],
          confidence: unified.statistical.confidence || 'medium'
        };
      }
      if (include.behavioral && unified?.behavioral) {
        analysisResults.behavioralAnalysis = {
          overallScore: unified.behavioral.overallScore ?? unified.behavioral.score ?? 0,
          findings: unified.behavioral.findings || [],
          confidence: unified.behavioral.confidence || 'medium'
        };
      }
      if (include.audio && unified?.audio) {
        analysisResults.audioForensics = {
          overallScore: unified.audio.overallScore ?? unified.audio.score ?? 0,
          findings: unified.audio.findings || [],
          confidence: unified.audio.confidence || 'low'
        };
      }
      if (include.expert && unified?.expert) {
        analysisResults.expertAnalysis = {
          overallScore: unified.expert.overallScore ?? unified.expert.score ?? 0,
          findings: unified.expert.findings || [],
          confidence: unified.expert.confidence || 'high'
        };
      }
    } else {
      console.warn(`⚠️ Aucun chemin image disponible pour l'analyse unifiée: ${imageId}`);
    }

    // 4) Agrégation et sauvegardes
    const aggregatedScore = calculateAggregatedScore(analysisResults, weights);
    const consolidatedFlags = generateConsolidatedFlags(analysisResults);

    await Analysis.findByIdAndUpdate(analysisId, {
      ...analysisResults,
      aggregatedScore,
      consolidatedFlags,
      status: 'completed',
      'analysisMetadata.endTime': new Date(),
      'analysisMetadata.processingTime': Date.now() - execStart
    });

    await Image.findByIdAndUpdate(imageId, {
      status: 'analyzed',
      authenticityScore: aggregatedScore.authenticity,
      'riskClassification.level': aggregatedScore.riskLevel,
      'riskClassification.confidence': aggregatedScore.confidence
    });

    console.log(`✅ Analyse terminée: ${analysisId}`);
  } catch (error) {
    console.error(`❌ Erreur exécution analyse ${analysisId}:`, error);
    await Analysis.findByIdAndUpdate(analysisId, {
      status: 'failed',
      'analysisMetadata.errorsDuringAnalysis': [{
        pillar: 'system',
        error: error.message,
        timestamp: new Date(),
        recoverable: false
      }]
    });
    await Image.findByIdAndUpdate(imageId, {
      status: 'error',
      error: `Analysis failed: ${error.message}`
    });
  }
}

function calculateAggregatedScore(results, weights) {
  let totalScore = 0;
  let totalWeight = 0;

  for (const [pillar, weight] of Object.entries(weights || {})) {
    const pillarResult = results[`${pillar}Analysis`] || (pillar === 'exif' ? results.exifForensics : null);
    const score = pillarResult?.overallScore ?? null;
    if (score !== null) {
      totalScore += score * weight;
      totalWeight += weight;
    }
  }

  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

  let riskLevel = 'UNCERTAIN';
  if (finalScore >= 80) riskLevel = 'AUTHENTIC';
  else if (finalScore >= 60) riskLevel = 'LIKELY_AUTHENTIC';
  else if (finalScore >= 40) riskLevel = 'UNCERTAIN';
  else if (finalScore >= 20) riskLevel = 'LIKELY_FAKE';
  else riskLevel = 'FAKE';

  return {
    authenticity: finalScore,
    riskLevel: riskLevel,
    confidence: totalWeight > 0.7 ? 'high' : 'medium'
  };
}

function generateConsolidatedFlags(results) {
  const flags = [];

  Object.entries(results || {}).forEach(([pillarName, data]) => {
    if (data && typeof data.overallScore === 'number' && data.overallScore < 50) {
      flags.push({
        type: `${pillarName.toUpperCase()}_ANOMALY`,
        severity: data.overallScore < 30 ? 'critical' : 'warning',
        pillarSource: [pillarName.replace('Analysis', '')],
        confidence: 85,
        message: `Anomalie détectée lors de l'analyse ${pillarName}`,
        timestamp: new Date()
      });
    }
  });

  return flags;
}

function compareFlags(flags1, flags2) {
  const types1 = new Set((flags1 || []).map(f => f.type));
  const types2 = new Set((flags2 || []).map(f => f.type));

  const commonTypes = [...types1].filter(type => types2.has(type));
  const unique1 = [...types1].filter(type => !types2.has(type));
  const unique2 = [...types2].filter(type => !types1.has(type));

  return {
    commonFlags: commonTypes.length,
    uniqueFlags1: unique1.length,
    uniqueFlags2: unique2.length,
    similarity: commonTypes.length / Math.max(types1.size, types2.size, 1)
  };
}

function compareExifData(exif1, exif2) {
  return {
    sameCameraMake: exif1?.camera?.make === exif2?.camera?.make,
    sameCameraModel: exif1?.camera?.model === exif2?.camera?.model,
    sameOrientation: exif1?.technical?.orientation === exif2?.technical?.orientation,
    timestampDelta: exif1?.timestamps?.dateTimeOriginal && exif2?.timestamps?.dateTimeOriginal
      ? Math.abs(new Date(exif1.timestamps.dateTimeOriginal) - new Date(exif2.timestamps.dateTimeOriginal)) : null
  };
}

function calculateNameSimilarity(name1, name2) {
  if (!name1 || !name2) return 0;

  const clean1 = name1.toLowerCase().replace(/[^a-z0-9]/g, '');
  const clean2 = name2.toLowerCase().replace(/[^a-z0-9]/g, '');
  const maxLength = Math.max(clean1.length, clean2.length);

  if (maxLength === 0) return 1;

  const distance = levenshteinDistance(clean1, clean2);
  return Math.max(0, (maxLength - distance) / maxLength);
}

function levenshteinDistance(str1, str2) {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[str2.length][str1.length];
}

function calculateAnalysisProgress(analysis) {
  switch (analysis.status) {
    case 'completed': return 100;
    case 'running': return 60;
    case 'pending': return 10;
    case 'failed': return 0;
    default: return 0;
  }
}

function getCurrentPhase(analysis) {
  if (analysis.status === 'completed') return 'Analysis completed';
  if (analysis.status === 'failed') return 'Analysis failed';
  if (analysis.status === 'running') return 'Processing forensic pillars...';
  return 'Waiting to start';
}

function estimateTimeRemaining(analysis) {
  if (analysis.status === 'completed' || analysis.status === 'failed') return 0;
  if (analysis.status === 'running') return 180; // 3 minutes
  return 300; // 5 minutes
}

function parsePeriod(period) {
  const units = { d: 86400000, h: 3600000, m: 60000 };
  const match = period.match(/^(\d+)([dhm])$/);
  if (!match) return 30 * 86400000; // 30 days default
  const value = parseInt(match[1], 10);
  const unit = match[2];
  return value * (units[unit] || 86400000);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function comparePillarFlags(pillar1, pillar2) {
  // Logique de comparaison spécifique par pilier
  return Math.random() > 0.5; // Placeholder
}

function calculatePillarSimilarity(pillar1, pillar2) {
  const score1 = pillar1.overallScore || 0;
  const score2 = pillar2.overallScore || 0;
  return 1 - Math.abs(score1 - score2) / 100;
}

function generateComparisonAssessment(comparison) {
  const { technicalComparison, forensicComparison } = comparison;
  let suspiciousPattern = false;
  let recommendation = '';
  let confidence = 'medium';

  // Détection patterns suspects
  if (technicalComparison.identical) {
    suspiciousPattern = true;
    recommendation = '🚨 Images identiques détectées - Possible duplication';
    confidence = 'high';
  } else if (forensicComparison.authenticityDelta < 5 &&
    (forensicComparison.riskLevelComparison.image1 === 'FAKE' ||
     forensicComparison.riskLevelComparison.image2 === 'FAKE')) {
    suspiciousPattern = true;
    recommendation = '⚠️ Pattern suspect: scores similaires avec contenu falsifié';
    confidence = 'high';
  } else if (forensicComparison.riskLevelComparison.concordant &&
    forensicComparison.riskLevelComparison.image1 === 'AUTHENTIC') {
    recommendation = '✅ Images cohérentes et authentiques';
    confidence = 'medium';
  } else {
    recommendation = 'Comparaison terminée - Examiner les détails par pilier';
    confidence = 'medium';
  }

  return {
    suspiciousPattern,
    recommendation,
    confidence
  };
}

module.exports = exports;
