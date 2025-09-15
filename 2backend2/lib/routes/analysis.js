"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// ✅ SERVICES BA7ATH OPTIMISÉS
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const analysisQueue = require('../services/analysisQueue');
const geoLocationService = require('../services/geoLocationService');

// Contrôleurs forensiques
const {
  getComprehensiveAnalysis,
  initiateForensicAnalysis,
  getAnalysisStatus,
  compareForensicAnalyses,
  getForensicStatistics,
  getSessionSummary
} = require('../controllers/analysisController');

// Middlewares
const {
  auth,
  requireRole,
  requirePrivacyMode,
  forensicLogging
} = require('../middleware/auth');

// ✅ CORRECTION: Suppression validateForensicBody
const {
  validateForensicObjectId,
  validateForensicQuery
} = require('../middleware/validation');

// ✅ OPTIMISATION: Rate limiting Ba7ath
const forensicAnalysisRateLimit = rateLimitService.analysis;

// =====================================
// ROUTES ANALYSE FORENSIQUE CORRIGÉES
// =====================================

/**
 * @route GET /api/analysis/:imageId
 * @desc Obtenir l'analyse forensique complète d'une image avec cache
 */
router.get('/:imageId', 
  auth, 
  forensicLogging, 
  validateForensicObjectId('imageId'), 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    
    // ✅ Cache check
    const cachedAnalysis = await cacheService.getCachedImageAnalysis(imageId);
    if (cachedAnalysis) {
      return res.json({
        ...cachedAnalysis,
        cached: true,
        cacheTime: new Date().toISOString()
      });
    }
    
    // Analyse normale
    const result = await getComprehensiveAnalysis(req, res);
    
    // ✅ Cache result
    if (result && result.analysisId) {
      await cacheService.cacheImageAnalysis(imageId, result);
    }
    
    return result;
  })
);

/**
 * @route POST /api/analysis/:imageId
 * @desc Initier nouvelle analyse forensique optimisée
 */
router.post('/:imageId', 
  forensicAnalysisRateLimit, 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  forensicLogging, 
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(initiateForensicAnalysis)
);

/**
 * @route GET /api/analysis/:analysisId/status
 * @desc Statut analyse en temps réel
 */
router.get('/:analysisId/status', 
  auth, 
  validateForensicObjectId('analysisId'), 
  middlewareService.asyncHandler(getAnalysisStatus)
);

/**
 * @route POST /api/analysis/compare
 * @desc Comparer analyses forensiques
 */
router.post('/compare', 
  forensicAnalysisRateLimit, 
  auth, 
  requireRole(['forensic_analyst', 'expert', 'admin']), 
  forensicLogging, 
  middlewareService.asyncHandler(compareForensicAnalyses)
);

/**
 * @route GET /api/analysis/statistics
 * @desc Statistiques forensiques avec cache
 */
router.get('/statistics', 
  auth, 
  requireRole(['forensic_analyst', 'admin', 'auditor']), 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const cacheKey = `stats_${JSON.stringify(req.query)}`;
    
    // ✅ Cache stats
    const cachedStats = await cacheService.getWithType('stats', cacheKey);
    if (cachedStats) {
      return res.json(cachedStats);
    }
    
    const stats = await getForensicStatistics(req, res);
    
    // ✅ Cache pour 10 minutes
    await cacheService.setWithType('stats', cacheKey, stats, 600);
    
    return stats;
  })
);

/**
 * @route GET /api/analysis/session/:sessionId
 * @desc Résumé session forensique
 */
router.get('/session/:sessionId', 
  auth, 
  forensicLogging, 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const sessionId = req.params.sessionId;
    const includeDetails = req.query.includeDetails || 'false';
    
    // Adapter la requête
    req.params.sessionId = sessionId;
    req.query.includeDetails = includeDetails;
    
    const result = await getSessionSummary(req, res);
    return result;
  })
);

/**
 * @route POST /api/analysis/batch
 * @desc Analyse batch optimisée avec queue Ba7ath
 */
router.post('/batch', 
  forensicAnalysisRateLimit, 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']), 
  forensicLogging, 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageIds, batchConfig = {} } = req.body;
    
    // Validation
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
    
    const batchId = crypto.randomBytes(8).toString('hex');
    const results = [];
    
    // ✅ OPTIMISATION: Utiliser analysisQueue Ba7ath
    for (const imageId of imageIds) {
      try {
        const job = await analysisQueue.addAnalysisJob(imageId, {
          priority: 'batch',
          config: batchConfig,
          userId: req.user.sub,
          batchId
        });
        
        results.push({
          imageId,
          success: true,
          jobId: job.id,
          priority: 'batch'
        });
      } catch (error) {
        results.push({
          imageId,
          success: false,
          error: error.message
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const errorCount = results.length - successCount;
    
    // ✅ Cache batch status
    await cacheService.cacheBatchReport(batchId, {
      total: imageIds.length,
      successful: successCount,
      failed: errorCount,
      results,
      status: 'initiated',
      timestamp: new Date().toISOString()
    });
    
    res.status(202).json({
      success: true,
      message: `Analyse batch initiée: ${successCount} succès, ${errorCount} erreurs`,
      batchId,
      summary: {
        total: imageIds.length,
        successful: successCount,
        failed: errorCount
      },
      results,
      trackingUrl: `/api/analysis/batch/${batchId}/status`,
      timestamp: new Date().toISOString()
    });
  })
);

/**
 * @route POST /api/analysis/search
 * @desc Recherche forensique optimisée avec cache
 */
router.post('/search', 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  middlewareService.asyncHandler(async (req, res) => {
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
    
    // ✅ Cache key basé sur critères de recherche
    const searchCacheKey = crypto
      .createHash('md5')
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    const cachedResult = await cacheService.getWithType('search_results', searchCacheKey);
    if (cachedResult) {
      return res.json({
        ...cachedResult,
        cached: true,
        cacheTime: new Date().toISOString()
      });
    }
    
    const Image = require('../models/Image');
    const Analysis = require('../models/Analysis');
    
    // Construction requête MongoDB optimisée
    const query = {};
    
    // Filtres EXIF
    if (camera?.make) {
      query['exifData.camera.make'] = new RegExp(camera.make, 'i');
    }
    if (camera?.model) {
      query['exifData.camera.model'] = new RegExp(camera.model, 'i');
    }
    if (software) {
      query['exifData.software.creator'] = new RegExp(software, 'i');
    }
    
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
    
    if (maxRiskScore) {
      query['riskClassification.score'] = { $lte: maxRiskScore };
    }
    
    // Filtres flags
    if (flagTypes && flagTypes.length > 0) {
      query['forensicAnalysis.flags.type'] = { $in: flagTypes };
    }
    
    // Exécuter recherche avec limite
    let images = await Image.find(query)
      .select('originalName exifData authenticityScore riskClassification forensicAnalysis.flags createdAt')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    
    // ✅ Post-filtrage GPS avec service Ba7ath
    if (gpsRadius?.lat && gpsRadius?.lng && gpsRadius?.radius) {
      images = images.filter(img => {
        const gps = img.exifData?.gps;
        if (!gps?.latitude || !gps?.longitude) return false;
        
        const distance = geoLocationService.calculateDistance(
          { latitude: gpsRadius.lat, longitude: gpsRadius.lng },
          gps
        );
        
        return distance.valid && distance.distance <= (gpsRadius.radius * 1000); // km to meters
      });
    }
    
    // Formater résultats
    const formattedResults = images.map(img => ({
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
    
    const result = {
      total: formattedResults.length,
      results: formattedResults,
      searchCriteria: {
        camera,
        dateRange,
        gpsRadius,
        software,
        minAuthenticityScore,
        maxRiskScore,
        flagTypes
      },
      timestamp: new Date().toISOString()
    };
    
    // ✅ Cache résultat (10 minutes)
    await cacheService.setWithType('search_results', searchCacheKey, result, 600);
    
    res.json(result);
  })
);

/**
 * @route GET /api/analysis/batch/:batchId/status
 * @desc Statut batch analysis
 */
router.get('/batch/:batchId/status',
  auth,
  middlewareService.asyncHandler(async (req, res) => {
    const { batchId } = req.params;
    
    const batchStatus = await cacheService.getCachedBatchReport(batchId);
    if (!batchStatus) {
      return res.status(404).json({
        error: 'Batch non trouvé',
        type: 'BATCH_NOT_FOUND'
      });
    }
    
    res.json({
      batchId,
      status: batchStatus.status || 'processing',
      summary: batchStatus.summary || batchStatus,
      lastUpdate: batchStatus.timestamp
    });
  })
);

// =====================================
// GESTION D'ERREURS OPTIMISÉE BA7ATH
// =====================================

router.use(middlewareService.errorHandler());

module.exports = router;
