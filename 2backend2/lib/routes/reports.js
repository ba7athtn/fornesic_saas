"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// ✅ SERVICES BA7ATH OPTIMISÉS
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const reportService = require('../services/reportService');
const validationService = require('../services/validationService');

// Contrôleurs rapports forensiques
const {
  generateForensicReport,
  generateBatchReport,
  getReportPreview,
  listAvailableReports,
  downloadExistingReport,
  exportForensicData
} = require('../controllers/reportController');

// Middlewares
const {
  auth,
  requireRole,
  requirePrivacyMode,
  forensicLogging
} = require('../middleware/auth');

// ✅ CORRECTION: Suppression validateForensicBody + optimisations
const {
  validateForensicObjectId,
  validateForensicQuery
} = require('../middleware/validation');

// =====================================
// RATE LIMITING OPTIMISÉ BA7ATH
// =====================================

// ✅ OPTIMISATION: Services Ba7ath au lieu d'express-rate-limit
const reportGenerationRateLimit = rateLimitService.reportGeneration; // 20/heure
const exportRateLimit = rateLimitService.export;                     // 10/heure

// =====================================
// ROUTES RAPPORTS FORENSIQUES OPTIMISÉES
// =====================================

/**
 * @route GET /api/reports/:imageId/generate
 * @desc Générer rapport forensique avec cache et optimisations
 */
router.get('/:imageId/generate', 
  reportGenerationRateLimit, 
  auth, 
  requireRole(['forensic_analyst', 'expert', 'admin']), 
  forensicLogging, 
  validateForensicObjectId('imageId'), 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    const { template, format, language, includeRawData, includePillars } = req.query;
    
    // ✅ CACHE: Vérifier cache rapport existant
    const reportCacheKey = `report_${imageId}_${template}_${format}_${language}`;
    const cachedReport = await cacheService.getWithType('reports', reportCacheKey);
    
    if (cachedReport) {
      return res.json({
        ...cachedReport,
        cached: true,
        cacheTime: new Date().toISOString()
      });
    }
    
    // ✅ ENRICHISSEMENT: Configuration avec services Ba7ath
    req.reportConfig = {
      template: template || 'executive',
      format: format || 'pdf',
      language: language || 'fr',
      includeRawData: includeRawData === 'true',
      includePillars: includePillars === 'all' ? 'all' : (includePillars?.split(',') || ['basic']),
      requestedBy: req.user?.sub,
      generationId: crypto.randomBytes(8).toString('hex')
    };
    
    const result = await generateForensicReport(req, res);
    
    // ✅ CACHE: Sauvegarder rapport généré (15 minutes)
    if (result && result.success) {
      await cacheService.setWithType('reports', reportCacheKey, result, 900);
    }
    
    return result;
  })
);

/**
 * @route GET /api/reports/session/:sessionId/batch
 * @desc Générer rapport batch optimisé avec queue
 */
router.get('/session/:sessionId/batch', 
  reportGenerationRateLimit, 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  forensicLogging, 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { template, format, includeSummaryStats, includeIndividualAnalyses } = req.query;
    
    // ✅ CACHE: Vérifier cache batch
    const batchCacheKey = `batch_report_${sessionId}_${template}_${format}`;
    const cachedBatch = await cacheService.getWithType('batch_reports', batchCacheKey);
    
    if (cachedBatch) {
      return res.json({
        ...cachedBatch,
        cached: true
      });
    }
    
    // ✅ OPTIMISATION: Configuration batch avec reportService
    try {
      const batchConfig = {
        sessionId,
        template: template || 'batch',
        format: format || 'pdf',
        includeSummaryStats: includeSummaryStats === 'true',
        includeIndividualAnalyses: includeIndividualAnalyses !== 'false',
        requestedBy: req.user?.sub,
        priority: 'normal'
      };
      
      const batchReportId = await reportService.initiateBatchReport(batchConfig);
      
      // ✅ CACHE: Status batch temporaire
      await cacheService.setWithType('batch_reports', batchCacheKey, {
        success: true,
        batchReportId,
        status: 'generating',
        estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString()
      }, 300);
      
      res.status(202).json({
        success: true,
        message: 'Rapport batch initié',
        batchReportId,
        trackingUrl: `/api/reports/batch/${batchReportId}/status`,
        estimatedTime: '3-5 minutes',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      // ✅ FALLBACK: Si service batch indisponible
      console.warn('⚠️ Service batch indisponible, fallback contrôleur:', error.message);
      return await generateBatchReport(req, res);
    }
  })
);

/**
 * @route GET /api/reports/:imageId/preview
 * @desc Aperçu rapport avec cache rapide
 */
router.get('/:imageId/preview', 
  auth, 
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    
    // ✅ CACHE: Preview pour 5 minutes
    const previewCacheKey = `report_preview_${imageId}`;
    const cachedPreview = await cacheService.getWithType('report_previews', previewCacheKey);
    
    if (cachedPreview) {
      return res.json({
        ...cachedPreview,
        cached: true
      });
    }
    
    const preview = await getReportPreview(req, res);
    
    if (preview && !preview.error) {
      await cacheService.setWithType('report_previews', previewCacheKey, preview, 300);
    }
    
    return preview;
  })
);

/**
 * @route GET /api/reports
 * @desc Liste rapports avec cache et pagination
 */
router.get('/', 
  auth, 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const queryHash = crypto
      .createHash('md5')
      .update(JSON.stringify({ ...req.query, userId: req.user?.sub }))
      .digest('hex');
    const listCacheKey = `reports_list_${queryHash}`;
    
    const cachedList = await cacheService.getWithType('report_lists', listCacheKey);
    if (cachedList) {
      return res.json({
        ...cachedList,
        cached: true
      });
    }
    
    const result = await listAvailableReports(req, res);
    
    if (result && result.reports) {
      await cacheService.setWithType('report_lists', listCacheKey, result, 180); // 3 minutes
    }
    
    return result;
  })
);

/**
 * @route GET /api/reports/:reportId/download
 * @desc Téléchargement sécurisé avec audit
 */
router.get('/:reportId/download', 
  auth, 
  forensicLogging, 
  validateForensicObjectId('reportId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { reportId } = req.params;
    
    // ✅ AUDIT: Enregistrer tentative de téléchargement
    console.log(`📥 Téléchargement rapport demandé: ${reportId} par ${req.user?.sub}`);
    
    // ✅ VÉRIFICATION: Permissions spécifiques
    const Report = require('../models/Report');
    const report = await Report.findById(reportId).select('classification generatedBy accessControl');
    
    if (report && report.classification === 'restricted') {
      const hasAccess = report.generatedBy === req.user?.sub || 
                       req.user?.roles?.includes('admin') ||
                       report.accessControl?.allowedUsers?.includes(req.user?.sub);
      
      if (!hasAccess) {
        return res.status(403).json({
          error: 'Accès refusé à ce rapport',
          type: 'ACCESS_DENIED'
        });
      }
    }
    
    return await downloadExistingReport(req, res);
  })
);

/**
 * @route GET /api/reports/:imageId/export
 * @desc Export données optimisé avec validation
 */
router.get('/:imageId/export', 
  exportRateLimit, 
  auth, 
  requireRole(['forensic_analyst', 'expert', 'admin']), 
  requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']), 
  forensicLogging, 
  validateForensicObjectId('imageId'), 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    const { format, includeRawExif, includePillarsDetails } = req.query;
    
    // ✅ CACHE: Export pour 10 minutes
    const exportCacheKey = `export_${imageId}_${format}_${includeRawExif}_${includePillarsDetails}`;
    const cachedExport = await cacheService.getWithType('exports', exportCacheKey);
    
    if (cachedExport) {
      return res.json({
        ...cachedExport,
        cached: true
      });
    }
    
    // ✅ AUDIT: Export forensique
    console.log(`📤 Export forensique: ${imageId} format ${format} par ${req.user?.sub}`);
    
    const exportResult = await exportForensicData(req, res);
    
    if (exportResult && exportResult.success) {
      await cacheService.setWithType('exports', exportCacheKey, exportResult, 600);
    }
    
    return exportResult;
  })
);

/**
 * @route POST /api/reports/custom
 * @desc Génération rapport personnalisé optimisée
 */
router.post('/custom', 
  reportGenerationRateLimit, 
  auth, 
  requireRole(['expert', 'admin']), 
  requirePrivacyMode(['JUDICIAL']), 
  forensicLogging, 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageIds, customConfig = {}, layout = {}, filters = {} } = req.body;
    
    // ✅ VALIDATION: Paramètres custom
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({
        error: 'Liste d\'IDs d\'images requise',
        type: 'MISSING_IMAGE_IDS'
      });
    }
    
    if (imageIds.length > 20) {
      return res.status(400).json({
        error: 'Maximum 20 images pour rapport personnalisé',
        type: 'TOO_MANY_IMAGES',
        maxImages: 20,
        provided: imageIds.length
      });
    }
    
    const validLayouts = ['single-column', 'two-column', 'comparison', 'timeline'];
    if (layout.type && !validLayouts.includes(layout.type)) {
      return res.status(400).json({
        error: 'Type de mise en page invalide',
        type: 'INVALID_LAYOUT',
        validLayouts
      });
    }
    
    const customReportId = crypto.randomBytes(8).toString('hex');
    
    // ✅ OPTIMISATION: Configuration avec reportService
    const defaultConfig = {
      template: 'custom',
      format: customConfig.format || 'pdf',
      language: customConfig.language || 'fr',
      sections: {
        coverPage: true,
        executiveSummary: true,
        methodology: true,
        individualAnalyses: true,
        comparativeAnalysis: imageIds.length > 1,
        conclusions: true,
        appendices: customConfig.includeAppendices !== false
      },
      advanced: {
        includeStatisticalCharts: customConfig.includeCharts !== false,
        includePillarBreakdown: true,
        includeRiskMatrix: true,
        includeTimelineAnalysis: imageIds.length > 1,
        customBranding: layout.branding || false
      }
    };
    
    const finalConfig = { ...defaultConfig, ...customConfig };
    
    try {
      // ✅ SERVICE: Utiliser reportService pour génération
      const reportRequest = await reportService.createCustomReport({
        customReportId,
        imageIds,
        config: finalConfig,
        layout,
        filters,
        requestedBy: req.user?.sub,
        ip: req.ip
      });
      
      // ✅ CACHE: Status custom report
      await cacheService.setWithType('custom_reports', customReportId, {
        status: 'generating',
        progress: 0,
        config: finalConfig,
        timestamp: new Date().toISOString()
      }, 1800); // 30 minutes
      
      res.status(202).json({
        success: true,
        message: 'Génération rapport personnalisé initiée',
        customReportId,
        config: finalConfig,
        estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        trackingUrl: `/api/reports/custom/${customReportId}/status`,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Erreur custom report:', error);
      
      // ✅ FALLBACK: Génération basique si service indisponible
      const Report = require('../models/Report');
      const customReport = new Report({
        reportId: `CUSTOM-${customReportId}`,
        sessionId: `custom-${Date.now()}`,
        reportType: 'custom',
        category: 'investigation',
        classification: 'restricted',
        images: imageIds,
        configuration: {
          template: 'custom',
          customConfig: finalConfig,
          layout,
          filters
        },
        generation: {
          requestedBy: {
            userId: req.user?.sub,
            ip: req.ip,
            timestamp: new Date()
          }
        },
        status: 'generating'
      });
      
      await customReport.save();
      
      res.status(202).json({
        success: true,
        message: 'Génération rapport personnalisé initiée (mode basique)',
        customReportId,
        trackingUrl: `/api/reports/custom/${customReportId}/status`,
        timestamp: new Date().toISOString()
      });
    }
  })
);

/**
 * @route GET /api/reports/custom/:customReportId/status
 * @desc Statut génération custom avec cache
 */
router.get('/custom/:customReportId/status', 
  auth, 
  middlewareService.asyncHandler(async (req, res) => {
    const { customReportId } = req.params;
    
    // ✅ CACHE: Status en premier
    const cachedStatus = await cacheService.getWithType('custom_reports', customReportId);
    if (cachedStatus) {
      return res.json({
        customReportId,
        ...cachedStatus
      });
    }
    
    // ✅ FALLBACK: Base de données
    const Report = require('../models/Report');
    const report = await Report.findOne({
      reportId: `CUSTOM-${customReportId}`
    }).select('status progress generation.processingTime issues');
    
    if (!report) {
      return res.status(404).json({
        error: 'Rapport personnalisé non trouvé',
        type: 'CUSTOM_REPORT_NOT_FOUND'
      });
    }
    
    const status = {
      status: report.status,
      progress: report.progress || 0,
      processingTime: report.generation?.processingTime,
      issues: report.issues?.filter(i => !i.resolved) || [],
      timestamp: new Date().toISOString()
    };
    
    // ✅ CACHE: Sauvegarder status (30 secondes)
    await cacheService.setWithType('custom_reports', customReportId, status, 30);
    
    res.json({
      customReportId,
      ...status
    });
  })
);

/**
 * @route GET /api/reports/batch/:batchId/status
 * @desc Statut rapport batch
 */
router.get('/batch/:batchId/status', 
  auth, 
  middlewareService.asyncHandler(async (req, res) => {
    const { batchId } = req.params;
    
    // ✅ SERVICE: Via reportService si disponible
    try {
      const batchStatus = await reportService.getBatchReportStatus(batchId);
      return res.json(batchStatus);
    } catch (error) {
      // ✅ FALLBACK: Cache ou base de données
      const cachedStatus = await cacheService.getCachedBatchReport(batchId);
      if (cachedStatus) {
        return res.json(cachedStatus);
      }
      
      return res.status(404).json({
        error: 'Rapport batch non trouvé',
        type: 'BATCH_REPORT_NOT_FOUND'
      });
    }
  })
);

/**
 * @route GET /api/reports/templates
 * @desc Templates avec cache et recommandations
 */
router.get('/templates', 
  auth, 
  middlewareService.asyncHandler(async (req, res) => {
    // ✅ CACHE: Templates pour 1 heure
    const templatesCacheKey = 'report_templates_list';
    const cachedTemplates = await cacheService.getWithType('templates', templatesCacheKey);
    
    if (cachedTemplates) {
      return res.json({
        ...cachedTemplates,
        cached: true
      });
    }
    
    const templates = {
      executive: {
        name: 'Résumé Exécutif',
        description: 'Rapport synthétique pour direction et décideurs',
        sections: ['Résumé', 'Conclusions principales', 'Recommandations'],
        estimatedPages: '2-4 pages',
        audience: 'Direction, Management',
        generationTime: '30-45 secondes'
      },
      technical: {
        name: 'Analyse Technique',
        description: 'Rapport détaillé pour experts techniques',
        sections: ['Méthodologie', 'Analyse détaillée des 7 piliers', 'Données techniques'],
        estimatedPages: '10-15 pages',
        audience: 'Experts forensiques, Analystes',
        generationTime: '60-90 secondes'
      },
      legal: {
        name: 'Rapport Judiciaire',
        description: 'Rapport conforme aux standards légaux',
        sections: ['Chain of custody', 'Méthodologie certifiée', 'Conclusions juridiques'],
        estimatedPages: '8-12 pages',
        audience: 'Tribunaux, Avocats, Forces de l\'ordre',
        generationTime: '90-120 secondes'
      },
      summary: {
        name: 'Résumé Rapide',
        description: 'Vue d\'ensemble concise des résultats',
        sections: ['Scores principaux', 'Flags critiques', 'Recommandation'],
        estimatedPages: '1-2 pages',
        audience: 'Utilisation rapide, Screening',
        generationTime: '15-30 secondes'
      },
      detailed: {
        name: 'Analyse Complète',
        description: 'Rapport exhaustif avec toutes les données',
        sections: ['Tous les piliers', 'EXIF complet', 'Historique traitement'],
        estimatedPages: '15-25 pages',
        audience: 'Investigation approfondie, Expertise',
        generationTime: '120-180 secondes'
      },
      comparison: {
        name: 'Rapport Comparatif',
        description: 'Analyse comparative entre plusieurs images',
        sections: ['Comparaisons croisées', 'Similarités', 'Divergences'],
        estimatedPages: '6-10 pages',
        audience: 'Analyse de séries, Détection patterns',
        generationTime: '90-150 secondes'
      }
    };
    
    const result = {
      templates,
      defaultTemplate: 'executive',
      recommendedByRole: {
        'forensic_analyst': 'technical',
        'expert': 'detailed',
        'admin': 'executive',
        'legal_officer': 'legal',
        'investigator': 'comparison'
      },
      formatSupport: {
        pdf: ['executive', 'technical', 'legal', 'detailed', 'comparison'],
        html: ['summary', 'executive', 'technical'],
        json: ['summary', 'technical', 'detailed'],
        csv: ['summary', 'comparison'],
        docx: ['executive', 'legal', 'detailed']
      },
      timestamp: new Date().toISOString()
    };
    
    // ✅ CACHE: Templates pour 1 heure
    await cacheService.setWithType('templates', templatesCacheKey, result, 3600);
    
    res.json(result);
  })
);

/**
 * @route GET /api/reports/stats
 * @desc Statistiques rapports avec cache
 */
router.get('/stats', 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  middlewareService.asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    
    // ✅ CACHE: Stats pour 10 minutes
    const statsCacheKey = `report_stats_${period}`;
    const cachedStats = await cacheService.getWithType('report_stats', statsCacheKey);
    
    if (cachedStats) {
      return res.json({
        ...cachedStats,
        cached: true
      });
    }
    
    try {
      const Report = require('../models/Report');
      const periodMs = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000
      }[period] || 30 * 24 * 60 * 60 * 1000;
      
      const startDate = new Date(Date.now() - periodMs);
      
      const stats = await Report.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalReports: { $sum: 1 },
            completedReports: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            byTemplate: {
              $push: '$configuration.template'
            },
            byFormat: {
              $push: '$configuration.format'
            },
            avgGenerationTime: {
              $avg: '$generation.processingTime'
            }
          }
        }
      ]);
      
      const overview = stats[0] || {};
      
      const result = {
        period,
        dateRange: {
          start: startDate.toISOString(),
          end: new Date().toISOString()
        },
        statistics: {
          totalReports: overview.totalReports || 0,
          completedReports: overview.completedReports || 0,
          successRate: overview.totalReports > 0 
            ? Math.round((overview.completedReports / overview.totalReports) * 100) 
            : 0,
          averageGenerationTime: Math.round(overview.avgGenerationTime || 0),
          templateDistribution: this.calculateDistribution(overview.byTemplate || []),
          formatDistribution: this.calculateDistribution(overview.byFormat || [])
        },
        generatedAt: new Date().toISOString()
      };
      
      // ✅ CACHE: Stats pour 10 minutes
      await cacheService.setWithType('report_stats', statsCacheKey, result, 600);
      
      res.json(result);
      
    } catch (error) {
      console.error('❌ Erreur stats rapports:', error);
      res.status(500).json({
        error: 'Erreur récupération statistiques rapports',
        type: 'REPORT_STATS_ERROR'
      });
    }
  })
);

// ✅ HELPER: Calculer distribution
function calculateDistribution(items) {
  const distribution = {};
  items.forEach(item => {
    distribution[item] = (distribution[item] || 0) + 1;
  });
  return distribution;
}

// =====================================
// GESTION D'ERREURS OPTIMISÉE BA7ATH
// =====================================

router.use(middlewareService.errorHandler({
  enrichError: (error, req) => {
    return {
      ...error,
      context: {
        route: 'reports',
        method: req.method,
        path: req.path,
        userId: req.user?.sub,
        reportType: req.query?.template || req.body?.template || 'unknown'
      }
    };
  }
}));

module.exports = router;
