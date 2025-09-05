const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Contrôleurs forensiques
const {
  getComprehensiveAnalysis,
  initiateForensicAnalysis,
  getAnalysisStatus,
  compareForensicAnalyses,
  getForensicStatistics
} = require('../controllers/analysisController');

// Middlewares
const { auth, requireRole, requirePrivacyMode, forensicLogging } = require('../middleware/auth');
const { validateForensicObjectId, validateForensicQuery, validateForensicBody } = require('../middleware/validation');

// =====================================
// RATE LIMITING FORENSIQUE - CORRIGÉ
// =====================================

const forensicAnalysisRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Maximum 50 analyses par fenêtre
  message: {
    error: 'Trop de demandes d\'analyse forensique',
    type: 'FORENSIC_RATE_LIMIT_EXCEEDED',
    retryAfter: 900 // 15 minutes en secondes
  },
  standardHeaders: true,
  legacyHeaders: false,
  // CORRIGÉ - KeyGenerator simple
  keyGenerator: (req) => `${req.ip}-${req.user?.sub || 'anonymous'}`,
  validate: {
    keyGeneratorIpFallback: false // Désactive le warning IPv6
  },
  handler: (req, res) => {
    console.warn('🚨 Rate limit forensique dépassé:', {
      ip: req.ip,
      userId: req.user?.sub,
      endpoint: req.path,
      timestamp: new Date().toISOString()
    });
    res.status(429).json({
      error: 'Limite de requêtes forensiques dépassée',
      type: 'FORENSIC_RATE_LIMIT_EXCEEDED',
      maxRequests: 50,
      windowMinutes: 15,
      retryAfter: 900,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// ROUTES ANALYSE FORENSIQUE AVANCÉE
// =====================================

/**
 * @route GET /api/analysis/:imageId
 * @desc Obtenir l'analyse forensique complète d'une image avec tous les 7 piliers
 * @access Private - Requires authentication
 * @param {string} imageId - ID MongoDB de l'image
 * @query {string} includePillars - Piliers à inclure (comma-separated ou 'all')
 * @query {string} format - Format de réponse (json, summary)
 */
router.get('/:imageId',
  auth,
  forensicLogging,
  validateForensicObjectId('imageId'),
  validateForensicQuery,
  getComprehensiveAnalysis
);

/**
 * @route POST /api/analysis/:imageId
 * @desc Initier une nouvelle analyse forensique avec configuration des 7 piliers
 * @access Private - Requires forensic role
 * @param {string} imageId - ID MongoDB de l'image
 * @body {object} enabledPillars - Configuration des piliers à activer
 * @body {object} customWeights - Poids personnalisés pour chaque pilier
 * @body {string} privacyMode - Mode de confidentialité (JUDICIAL, COMMERCIAL, RESEARCH)
 */
router.post('/:imageId',
  forensicAnalysisRateLimit,
  auth,
  requireRole(['forensic_analyst', 'admin']),
  forensicLogging,
  validateForensicObjectId('imageId'),
  validateForensicBody,
  initiateForensicAnalysis
);

/**
 * @route GET /api/analysis/:analysisId/status
 * @desc Obtenir le statut en temps réel d'une analyse forensique
 * @access Private
 * @param {string} analysisId - ID de l'analyse
 */
router.get('/:analysisId/status',
  auth,
  validateForensicObjectId('analysisId'),
  getAnalysisStatus
);

/**
 * @route POST /api/analysis/compare
 * @desc Comparer deux analyses forensiques avec détection de patterns
 * @access Private - Requires forensic role
 * @body {string} imageId1 - ID de la première image
 * @body {string} imageId2 - ID de la seconde image
 * @body {string} comparisonMode - Mode de comparaison (comprehensive, quick, pillars)
 */
router.post('/compare',
  forensicAnalysisRateLimit,
  auth,
  requireRole(['forensic_analyst', 'expert', 'admin']),
  forensicLogging,
  validateForensicBody,
  compareForensicAnalyses
);

/**
 * @route GET /api/analysis/statistics
 * @desc Obtenir statistiques globales d'analyse avec métriques forensiques
 * @access Private - Requires analyst role
 * @query {string} period - Période d'analyse (7d, 30d, 90d)
 * @query {string} breakdown - Type de répartition (risk, pillar, time)
 */
router.get('/statistics',
  auth,
  requireRole(['forensic_analyst', 'admin', 'auditor']),
  validateForensicQuery,
  getForensicStatistics
);

/**
 * @route GET /api/analysis/session/:sessionId
 * @desc Obtenir résumé forensique d'une session complète
 * @access Private
 * @param {string} sessionId - ID de la session
 */
router.get('/session/:sessionId',
  auth,
  forensicLogging,
  validateForensicQuery,
  async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { includeDetails = 'false' } = req.query;

      // Import du contrôleur legacy adapté
      const { getSessionSummary } = require('../controllers/analysisController');

      // Adapter la requête pour le nouveau système
      req.params.sessionId = sessionId;
      req.query.includeDetails = includeDetails;

      await getSessionSummary(req, res);

    } catch (error) {
      console.error('❌ Erreur session analysis:', error);
      res.status(500).json({
        error: 'Erreur récupération analyse session',
        type: 'SESSION_ANALYSIS_ERROR'
      });
    }
  }
);

/**
 * @route POST /api/analysis/batch
 * @desc Lancer analyse batch pour plusieurs images
 * @access Private - Requires forensic role
 * @body {array} imageIds - Liste des IDs d'images
 * @body {object} batchConfig - Configuration batch
 */
router.post('/batch',
  forensicAnalysisRateLimit,
  auth,
  requireRole(['forensic_analyst', 'admin']),
  requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
  forensicLogging,
  validateForensicBody,
  async (req, res) => {
    try {
      const { imageIds, batchConfig = {} } = req.body;

      if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({
          error: 'Liste d\'IDs d\'images requise',
          type: 'MISSING_IMAGE_IDS'
        });
      }

      if (imageIds.length > 50) {
        return res.status(400).json({
          error: 'Maximum 50 images par batch',
          type: 'BATCH_SIZE_EXCEEDED',
          maxSize: 50,
          provided: imageIds.length
        });
      }

      const batchId = require('crypto').randomBytes(8).toString('hex');
      const results = [];

      // Lancer analyses en parallèle avec limite
      const concurrencyLimit = 5;
      for (let i = 0; i < imageIds.length; i += concurrencyLimit) {
        const batch = imageIds.slice(i, i + concurrencyLimit);
        const batchPromises = batch.map(async (imageId) => {
          try {
            // Simuler initiation analyse
            const { initiateForensicAnalysis } = require('../controllers/analysisController');
            const mockReq = {
              params: { imageId },
              body: {
                enabledPillars: batchConfig.enabledPillars || {},
                privacyMode: req.privacyMode,
                priority: 'batch'
              },
              user: req.user,
              ip: req.ip,
              privacyMode: req.privacyMode
            };
            const mockRes = {
              status: () => mockRes,
              json: (data) => data
            };

            const result = await initiateForensicAnalysis(mockReq, mockRes);
            return { imageId, success: true, analysisId: result?.analysisId };

          } catch (error) {
            return { imageId, success: false, error: error.message };
          }
        });

        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults.map(r => r.value || { success: false, error: 'Promise rejected' }));
      }

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;

      res.status(202).json({
        success: true,
        message: `Analyse batch initiée: ${successCount} succès, ${errorCount} erreurs`,
        batchId: batchId,
        summary: {
          total: imageIds.length,
          successful: successCount,
          failed: errorCount
        },
        results: results,
        trackingUrl: `/api/analysis/batch/${batchId}/status`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur batch analysis:', error);
      res.status(500).json({
        error: 'Erreur analyse batch',
        type: 'BATCH_ANALYSIS_ERROR'
      });
    }
  }
);

/**
 * @route POST /api/analysis/search
 * @desc Recherche forensique avancée par métadonnées et résultats
 * @access Private - Requires analyst role
 * @body {object} criteria - Critères de recherche
 */
router.post('/search',
  auth,
  requireRole(['forensic_analyst', 'admin']),
  validateForensicBody,
  async (req, res) => {
    try {
      const {
        camera,
        dateRange,
        gpsRadius,
        software,
        minAuthenticityScore,
        maxRiskScore,
        flagTypes,
        pillarScores
      } = req.body;

      const Image = require('../models/Image');
      const Analysis = require('../models/Analysis');

      // Construire requête MongoDB complexe
      const query = {};
      const analysisQuery = {};

      // Filtres EXIF
      if (camera?.make) query['exifData.camera.make'] = new RegExp(camera.make, 'i');
      if (camera?.model) query['exifData.camera.model'] = new RegExp(camera.model, 'i');
      if (software) query['exifData.software.creator'] = new RegExp(software, 'i');

      // Filtres temporels
      if (dateRange?.start && dateRange?.end) {
        query['exifData.timestamps.dateTimeOriginal'] = {
          $gte: new Date(dateRange.start),
          $lte: new Date(dateRange.end)
        };
      }

      // Filtres scores
      if (minAuthenticityScore) {
        query.authenticityScore = { $gte: minAuthenticityScore };
      }

      // Filtres flags
      if (flagTypes && flagTypes.length > 0) {
        query['forensicAnalysis.flags.type'] = { $in: flagTypes };
      }

      // Exécuter recherche avec limite
      const images = await Image.find(query)
        .select('originalName exifData authenticityScore riskClassification forensicAnalysis.flags createdAt')
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      // Post-filtrage GPS si nécessaire
      let filteredImages = images;
      if (gpsRadius?.lat && gpsRadius?.lng && gpsRadius?.radius) {
        const { calculateLocationDistance } = require('../utils/geoUtils');
        filteredImages = images.filter(img => {
          const gps = img.exifData?.gps;
          if (!gps?.latitude || !gps?.longitude) return false;
          const distance = calculateLocationDistance(
            { latitude: gpsRadius.lat, longitude: gpsRadius.lng },
            gps
          );
          return distance <= gpsRadius.radius;
        });
      }

      // Formater résultats
      const formattedResults = filteredImages.map(img => ({
        id: img._id,
        filename: img.originalName,
        camera: img.exifData?.camera ?
          `${img.exifData.camera.make || ''} ${img.exifData.camera.model || ''}`.trim() : null,
        timestamp: img.exifData?.timestamps?.dateTimeOriginal,
        authenticityScore: img.authenticityScore || 0,
        riskLevel: img.riskClassification?.level,
        flagsCount: img.forensicAnalysis?.flags?.length || 0,
        uploadDate: img.createdAt
      }));

      res.json({
        total: formattedResults.length,
        results: formattedResults,
        searchCriteria: { camera, dateRange, gpsRadius, software, minAuthenticityScore },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur forensic search:', error);
      res.status(500).json({
        error: 'Erreur recherche forensique',
        type: 'FORENSIC_SEARCH_ERROR'
      });
    }
  }
);

// =====================================
// GESTION D'ERREURS ROUTES
// =====================================

router.use((error, req, res, next) => {
  console.error('❌ Erreur route analysis:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Erreur interne route analysis',
    type: 'ANALYSIS_ROUTE_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = router;
