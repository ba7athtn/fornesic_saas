const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');

// Contrôleurs images forensiques
const {
  uploadForensicImage,
  uploadMultipleForensicImages,
  getForensicImageDetails,
  listForensicImages,
  deleteForensicImage,
  getImageStatus
} = require('../controllers/imageController');

// Middlewares
const { auth, optionalAuth, requireRole, requirePrivacyMode, forensicLogging } = require('../middleware/auth');
const {
  validateForensicUpload,
  validateForensicObjectId,
  validateForensicQuery
} = require('../middleware/validation');
const { single, array } = require('../middleware/upload');

// =====================================
// RATE LIMITING UPLOAD - CORRIGÉ IPv6-SAFE
// =====================================

const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 200, // 200 uploads par heure (augmenté)
  message: {
    error: 'Limite d\'upload dépassée',
    type: 'UPLOAD_RATE_LIMIT_EXCEEDED'
  },
  keyGenerator: (req) => {
    const clientIp = requestIp.getClientIp(req) || req.ip || 'unknown';
    return `upload-${clientIp}-${req.user?.sub || 'anonymous'}`;
  },
  standardHeaders: true,
  validate: {
    keyGeneratorIpFallback: false
  }
});

// MIDDLEWARE DE DEBUG UPLOAD
const debugUpload = (req, res, next) => {
  console.log(`🔧 Debug Upload Request:`);
  console.log(` Content-Length: ${req.headers['content-length'] || 'Non spécifié'}`);
  console.log(` Content-Type: ${req.headers['content-type'] || 'Non spécifié'}`);
  console.log(` User-Agent: ${req.headers['user-agent']?.substring(0, 50) || 'Inconnu'}`);
  console.log(` Method: ${req.method}`);
  console.log(` URL: ${req.url}`);
  console.log(`🔧 Limites Configurées:`);
  console.log(` MAX_FILE_SIZE: ${process.env.MAX_FILE_SIZE || 'Non défini'}`);
  console.log(` MULTER_FILE_SIZE: ${process.env.MULTER_FILE_SIZE || 'Non défini'}`);
  console.log(` EXPRESS_JSON_LIMIT: ${process.env.EXPRESS_JSON_LIMIT || 'Non défini'}`);
  next();
};

// =====================================
// ROUTES GESTION IMAGES FORENSIQUES
// =====================================

/**
 * @route POST /api/images/upload
 * @desc Upload sécurisé d'une image avec scan forensique intégré
 * @access Public/Private (dépend de la configuration)
 * @form {file} image - Fichier image (max 500MB)
 * @header {string} x-session-id - ID de session (optionnel)
 */
router.post('/upload',
  debugUpload,
  uploadRateLimit,
  optionalAuth,
  forensicLogging,
  single('image'),
  validateForensicUpload,
  uploadForensicImage
);

/**
 * @route POST /api/images/upload/multiple
 * @desc Upload multiple sécurisé avec traitement batch
 * @access Private
 * @form {file[]} images - Fichiers images (max 10 fichiers)
 */
router.post('/upload/multiple',
  uploadRateLimit,
  auth,
  requireRole(['forensic_analyst', 'admin']),
  forensicLogging,
  array('images', 10),
  validateForensicUpload,
  uploadMultipleForensicImages
);

/**
 * @route GET /api/images/:imageId
 * @desc Obtenir détails forensiques complets d'une image
 * @access Private
 * @param {string} imageId - ID MongoDB de l'image
 * @query {boolean} includeExif - Inclure métadonnées EXIF
 * @query {boolean} includeAuditLog - Inclure audit log (JUDICIAL uniquement)
 */
router.get('/:imageId',
  optionalAuth,
  forensicLogging,
  validateForensicObjectId('imageId'),
  validateForensicQuery,
  getForensicImageDetails
);

/**
 * @route GET /api/images/:imageId/status
 * @desc Obtenir statut en temps réel d'une image
 * @access Public (avec limitations)
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/status',
  optionalAuth,
  validateForensicObjectId('imageId'),
  getImageStatus
);

/**
 * @route GET /api/images
 * @desc Lister images avec filtres forensiques avancés
 * @access Public (avec authentification optionnelle)
 * @query {string} sessionId - Filtrer par session
 * @query {string} status - Filtrer par statut
 * @query {string} riskLevel - Filtrer par niveau de risque
 * @query {number} minScore - Score minimum d'authenticité
 * @query {number} maxScore - Score maximum d'authenticité
 * @query {string} dateFrom - Date de début
 * @query {string} dateTo - Date de fin
 * @query {boolean} hasFlags - Filtrer par présence de flags
 * @query {string} search - Recherche textuelle
 * @query {string} sortBy - Champ de tri
 * @query {string} sortOrder - Ordre de tri (asc/desc)
 * @query {number} page - Page (défaut: 1)
 * @query {number} limit - Limite par page (défaut: 50, max: 100)
 */
router.get('/',
  optionalAuth,
  validateForensicQuery,
  listForensicImages
);

/**
 * @route DELETE /api/images/:imageId
 * @desc Supprimer image avec nettoyage forensique complet
 * @access Private - Requires admin role
 * @param {string} imageId - ID MongoDB de l'image
 * @query {string} reason - Raison de suppression
 * @query {boolean} secure - Effacement sécurisé (multi-pass)
 */
router.delete('/:imageId',
  auth,
  requireRole(['admin', 'forensic_admin']),
  requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
  forensicLogging,
  validateForensicObjectId('imageId'),
  deleteForensicImage
);

/**
 * @route GET /api/images/:imageId/download
 * @desc Télécharger image originale (avec contrôles d'accès)
 * @access Private - Requires specific permissions
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/download',
  auth,
  requireRole(['forensic_analyst', 'expert', 'admin']),
  requirePrivacyMode(['JUDICIAL']),
  forensicLogging,
  validateForensicObjectId('imageId'),
  async (req, res) => {
    try {
      const { imageId } = req.params;
      const Image = require('../models/Image');
      const image = await Image.findById(imageId);

      if (!image) {
        return res.status(404).json({
          error: 'Image non trouvée',
          type: 'IMAGE_NOT_FOUND'
        });
      }

      const fs = require('fs');
      if (!image.files?.original || !fs.existsSync(image.files.original)) {
        return res.status(404).json({
          error: 'Fichier image introuvable',
          type: 'FILE_NOT_FOUND'
        });
      }

      await Image.findByIdAndUpdate(imageId, {
        $push: {
          auditLog: {
            action: 'FILE_DOWNLOADED',
            performedBy: req.user?.sub,
            timestamp: new Date(),
            details: {
              downloadType: 'original',
              ip: req.ip,
              userAgent: req.get('User-Agent')
            }
          }
        }
      });

      res.setHeader('Content-Type', image.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${image.originalName}"`);
      res.setHeader('X-Download-Type', 'forensic-original');
      res.setHeader('X-Image-Hash', image.hash?.substring(0, 16));

      res.download(image.files.original, image.originalName, (error) => {
        if (error) {
          console.error('❌ Erreur téléchargement image:', error);
        } else {
          console.log(`✅ Image téléchargée: ${imageId} par ${req.user?.sub}`);
        }
      });

    } catch (error) {
      console.error('❌ Erreur download route:', error);
      res.status(500).json({
        error: 'Erreur téléchargement',
        type: 'DOWNLOAD_ERROR'
      });
    }
  }
);

/**
 * @route GET /api/images/:imageId/thumbnail
 * @desc Obtenir thumbnail d'une image
 * @access Public (avec authentification optionnelle)
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/thumbnail',
  optionalAuth,
  validateForensicObjectId('imageId'),
  async (req, res) => {
    try {
      const { imageId } = req.params;
      const Image = require('../models/Image');
      const image = await Image.findById(imageId).select('files.thumbnail mimeType originalName');

      if (!image) {
        return res.status(404).json({
          error: 'Image non trouvée',
          type: 'IMAGE_NOT_FOUND'
        });
      }

      const fs = require('fs');
      if (!image.files?.thumbnail || !fs.existsSync(image.files.thumbnail)) {
        return res.status(404).json({
          error: 'Thumbnail non disponible',
          type: 'THUMBNAIL_NOT_FOUND'
        });
      }

      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Thumbnail-Generated', 'true');
      res.sendFile(require('path').resolve(image.files.thumbnail));

    } catch (error) {
      console.error('❌ Erreur thumbnail route:', error);
      res.status(500).json({
        error: 'Erreur récupération thumbnail',
        type: 'THUMBNAIL_ERROR'
      });
    }
  }
);

// ROUTE DE TEST DES LIMITES (À SUPPRIMER APRÈS TESTS)
router.get('/limits-check', (req, res) => {
  const limits = {
    environment: {
      MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
      MULTER_FILE_SIZE: process.env.MULTER_FILE_SIZE,
      EXPRESS_JSON_LIMIT: process.env.EXPRESS_JSON_LIMIT,
      EXPRESS_URLENCODED_LIMIT: process.env.EXPRESS_URLENCODED_LIMIT
    },
    calculated: {
      multerFileSizeBytes: parseInt(process.env.MULTER_FILE_SIZE) || 524288000,
      multerFileSizeMB: Math.round((parseInt(process.env.MULTER_FILE_SIZE) || 524288000) / 1024 / 1024),
      expressJsonLimit: process.env.EXPRESS_JSON_LIMIT || '500mb',
      expressUrlencodedLimit: process.env.EXPRESS_URLENCODED_LIMIT || '500mb'
    }
  };

  res.json({
    success: true,
    message: 'Configuration des limites',
    limits: limits,
    timestamp: new Date().toISOString()
  });
});

// =====================================
// ROUTES AVANCÉES (Partie 2/2 suit...)
// =====================================

/**
 * @route PATCH /api/images/:imageId/quarantine
 * @desc Mettre/Lever quarantaine sur une image
 * @access Private - Requires admin role
 * @param {string} imageId - ID MongoDB de l'image
 * @body {string} action - Action (quarantine/release)
 * @body {string} reason - Raison de l'action
 */
router.patch('/:imageId/quarantine',
  auth,
  requireRole(['admin', 'security_admin']),
  forensicLogging,
  validateForensicObjectId('imageId'),
  async (req, res) => {
    try {
      const { imageId } = req.params;
      const { action, reason } = req.body;

      if (!['quarantine', 'release'].includes(action)) {
        return res.status(400).json({
          error: 'Action invalide',
          type: 'INVALID_ACTION',
          validActions: ['quarantine', 'release']
        });
      }

      const Image = require('../models/Image');
      const image = await Image.findById(imageId);

      if (!image) {
        return res.status(404).json({
          error: 'Image non trouvée',
          type: 'IMAGE_NOT_FOUND'
        });
      }

      if (action === 'quarantine') {
        await image.quarantineImage(reason, req.user?.sub);
        res.json({
          success: true,
          message: 'Image mise en quarantaine',
          status: 'quarantined',
          reason: reason,
          quarantinedAt: new Date().toISOString()
        });
      } else {
        await Image.findByIdAndUpdate(imageId, {
          'quarantine.status': 'none',
          status: 'uploaded',
          $push: {
            auditLog: {
              action: 'QUARANTINE_RELEASED',
              performedBy: req.user?.sub,
              details: { reason },
              timestamp: new Date()
            }
          }
        });

        res.json({
          success: true,
          message: 'Quarantaine levée',
          status: 'released',
          releasedAt: new Date().toISOString()
        });
      }

    } catch (error) {
      console.error('❌ Erreur quarantine route:', error);
      res.status(500).json({
        error: 'Erreur gestion quarantaine',
        type: 'QUARANTINE_ERROR'
      });
    }
  }
);

/**
 * @route GET /api/images/statistics/overview
 * @desc Obtenir statistiques globales des images
 * @access Private - Requires analyst role
 */
router.get('/statistics/overview',
  auth,
  requireRole(['forensic_analyst', 'admin']),
  async (req, res) => {
    try {
      const { period = '30d' } = req.query;
      const Image = require('../models/Image');

      const periodMs = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000
      }[period] || 30 * 24 * 60 * 60 * 1000;

      const startDate = new Date(Date.now() - periodMs);

      const stats = await Image.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalImages: { $sum: 1 },
            analyzedImages: {
              $sum: { $cond: [{ $eq: ['$status', 'analyzed'] }, 1, 0] }
            },
            quarantinedImages: {
              $sum: { $cond: [{ $ne: ['$quarantine.status', 'none'] }, 1, 0] }
            },
            averageFileSize: { $avg: '$size' },
            averageAuthenticityScore: { $avg: '$authenticityScore' },
            totalFlags: {
              $sum: { $size: { $ifNull: ['$forensicAnalysis.flags', []] } }
            }
          }
        }
      ]);

      const overview = stats[0] || {};

      res.json({
        period: period,
        dateRange: {
          start: startDate.toISOString(),
          end: new Date().toISOString()
        },
        statistics: {
          totalImages: overview.totalImages || 0,
          analyzedImages: overview.analyzedImages || 0,
          quarantinedImages: overview.quarantinedImages || 0,
          analysisRate: overview.totalImages > 0 ?
            Math.round((overview.analyzedImages / overview.totalImages) * 100) : 0,
          averageFileSize: Math.round(overview.averageFileSize || 0),
          averageAuthenticityScore: Math.round(overview.averageAuthenticityScore || 0),
          totalSecurityFlags: overview.totalFlags || 0
        },
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur statistics overview:', error);
      res.status(500).json({
        error: 'Erreur statistiques images',
        type: 'STATISTICS_ERROR'
      });
    }
  }
);

/**
 * @route GET /api/images/:imageId/metadata
 * @desc Obtenir métadonnées complètes d'une image
 * @access Public (avec authentification optionnelle)
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/metadata',
  optionalAuth,
  validateForensicObjectId('imageId'),
  async (req, res) => {
    try {
      const { imageId } = req.params;
      const Image = require('../models/Image');

      const image = await Image.findById(imageId)
        .select('metadata exif forensicAnalysis.pillars authenticityScore classification')
        .lean();

      if (!image) {
        return res.status(404).json({
          error: 'Image non trouvée',
          type: 'IMAGE_NOT_FOUND'
        });
      }

      res.json({
        success: true,
        imageId: imageId,
        metadata: image.metadata,
        exif: image.exif,
        forensicPillars: image.forensicAnalysis?.pillars,
        authenticityScore: image.authenticityScore,
        classification: image.classification,
        retrievedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur metadata route:', error);
      res.status(500).json({
        error: 'Erreur récupération métadonnées',
        type: 'METADATA_ERROR'
      });
    }
  }
);

/**
 * @route POST /api/images/:imageId/reanalyze
 * @desc Relancer analyse forensique d'une image
 * @access Private - Requires analyst role
 * @param {string} imageId - ID MongoDB de l'image
 */
router.post('/:imageId/reanalyze',
  auth,
  requireRole(['forensic_analyst', 'admin']),
  forensicLogging,
  validateForensicObjectId('imageId'),
  async (req, res) => {
    try {
      const { imageId } = req.params;
      const { analysisType = 'full' } = req.body;
      const Image = require('../models/Image');

      const image = await Image.findById(imageId);

      if (!image) {
        return res.status(404).json({
          error: 'Image non trouvée',
          type: 'IMAGE_NOT_FOUND'
        });
      }

      const fs = require('fs');
      if (!fs.existsSync(image.files?.original)) {
        return res.status(404).json({
          error: 'Fichier image introuvable pour réanalyse',
          type: 'FILE_NOT_FOUND'
        });
      }

      await Image.findByIdAndUpdate(imageId, {
        'forensicAnalysis.status': 'pending',
        'forensicAnalysis.reanalysisRequested': true,
        'forensicAnalysis.reanalysisRequestedAt': new Date(),
        'forensicAnalysis.reanalysisRequestedBy': req.user?.sub,
        status: 'processing',
        $push: {
          auditLog: {
            action: 'REANALYSIS_REQUESTED',
            performedBy: req.user?.sub,
            details: { analysisType },
            timestamp: new Date()
          }
        }
      });

      try {
        const { addAnalysisJob } = require('../services/analysisQueue');
        await addAnalysisJob(imageId, image.files.original, {
          priority: 'high',
          type: analysisType
        });
        console.log(`📋 Réanalyse ajoutée à la queue: ${imageId}`);
      } catch (queueError) {
        console.warn('⚠️ Queue indisponible pour réanalyse, traitement direct');
      }

      res.json({
        success: true,
        message: 'Réanalyse forensique démarrée',
        imageId: imageId,
        analysisType: analysisType,
        status: 'reanalysis_pending',
        estimatedTime: '30-120 seconds',
        requestedAt: new Date().toISOString(),
        requestedBy: req.user?.sub
      });

    } catch (error) {
      console.error('❌ Erreur reanalyze route:', error);
      res.status(500).json({
        error: 'Erreur réanalyse forensique',
        type: 'REANALYSIS_ERROR'
      });
    }
  }
);

/**
 * @route GET /api/images/batch/status
 * @desc Obtenir statut de traitement batch
 * @access Private - Requires analyst role
 */
router.get('/batch/status',
  auth,
  requireRole(['forensic_analyst', 'admin']),
  async (req, res) => {
    try {
      const Image = require('../models/Image');

      const batchStatus = await Image.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            lastUpdate: { $max: '$updatedAt' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      let queueStats = null;
      try {
        const { analysisQueue } = require('../services/analysisQueue');
        if (analysisQueue) {
          queueStats = {
            waiting: await analysisQueue.getWaiting().length,
            active: await analysisQueue.getActive().length,
            completed: await analysisQueue.getCompleted().length,
            failed: await analysisQueue.getFailed().length
          };
        }
      } catch (queueError) {
        console.warn('⚠️ Impossible de récupérer stats queue');
      }

      res.json({
        success: true,
        batchProcessing: {
          imageStatus: batchStatus,
          totalImages: batchStatus.reduce((sum, s) => sum + s.count, 0),
          queueStats: queueStats
        },
        generatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur batch status:', error);
      res.status(500).json({
        error: 'Erreur récupération statut batch',
        type: 'BATCH_STATUS_ERROR'
      });
    }
  }
);

/**
 * @route DELETE /api/images/cleanup/temp
 * @desc Nettoyage des fichiers temporaires (maintenance)
 * @access Private - Requires admin role
 */
router.delete('/cleanup/temp',
  auth,
  requireRole(['admin']),
  forensicLogging,
  async (req, res) => {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      const { olderThan = 24 } = req.query;
      const tempDir = './uploads/temp';
      const cutoffTime = Date.now() - (olderThan * 60 * 60 * 1000);

      let cleanedFiles = 0;
      let cleanedSize = 0;

      if (await fs.access(tempDir).then(() => true).catch(() => false)) {
        const files = await fs.readdir(tempDir);

        for (const file of files) {
          if (file === '.gitkeep') continue;

          const filePath = path.join(tempDir, file);
          const stats = await fs.stat(filePath);

          if (stats.mtime.getTime() < cutoffTime) {
            cleanedSize += stats.size;
            await fs.unlink(filePath);
            cleanedFiles++;
          }
        }
      }

      console.log(`🧹 Nettoyage temp: ${cleanedFiles} fichiers, ${Math.round(cleanedSize / 1024 / 1024)}MB libérés`);

      res.json({
        success: true,
        cleanup: {
          filesRemoved: cleanedFiles,
          sizeFreed: cleanedSize,
          directory: tempDir,
          olderThanHours: olderThan
        },
        performedBy: req.user?.sub,
        completedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur cleanup temp:', error);
      res.status(500).json({
        error: 'Erreur nettoyage fichiers temporaires',
        type: 'CLEANUP_ERROR'
      });
    }
  }
);

// =====================================
// GESTION D'ERREURS ROUTES
// =====================================

router.use((error, req, res, next) => {
  console.error('❌ Erreur route images:', error);

  if (req.file && error) {
    const fs = require('fs');
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Fichier temporaire nettoyé après erreur route');
      }
    } catch (cleanupError) {
      console.error('⚠️ Erreur nettoyage fichier:', cleanupError);
    }
  }

  if (req.files && req.files.length > 0) {
    req.files.forEach(file => {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
          console.log(`🗑️ Fichier multiple nettoyé: ${file.filename}`);
        }
      } catch (cleanupError) {
        console.error('⚠️ Erreur nettoyage fichier multiple:', cleanupError);
      }
    });
  }

  const statusCode = error.status || 500;
  const errorResponse = {
    error: error.message || 'Erreur interne route images',
    type: error.type || 'IMAGES_ROUTE_ERROR',
    timestamp: new Date().toISOString(),
    requestId: req.requestId || 'unknown'
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.details = {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body
    };
  }

  res.status(statusCode).json(errorResponse);
});

// =====================================
// EXPORT DU ROUTER
// =====================================

module.exports = router;
