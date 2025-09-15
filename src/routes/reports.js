"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// ✅ CONFIG CENTRALISÉE
const config = require('../config');

// ✅ SERVICES BA7ATH
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const reportService = require('../services/reportService');
const auditService = require('../services/auditService');

// ✅ CONTRÔLEURS
const {
  generateSingleReport,
  generateBatchReport,
  getReportPreview,
  listAvailableReports,
  downloadExistingReport,
  exportForensicData,
  checkReportAccess
} = require('../controllers/reportController');

// ✅ MIDDLEWARES
const {
  auth,
  requireRole,
  requirePrivacyMode,
  forensicLogging
} = require('../middleware/auth');

const {
  validateForensicObjectId,
  validateForensicQuery,
  validateCustomReport
} = require('../middleware/validation');

// =====================================
// PARAMÈTRES ET RÈGLES (depuis config.js)
// =====================================

const reportsCfg = config.reports || {};
const rlCfg = (config.reports?.rateLimit) || {};
const cacheCfg = (config.reports?.cache) || {};
const limitsCfg = (config.limits?.reports) || {};

const VALID_TEMPLATES = reportsCfg.validTemplates || ['summary', 'detailed', 'forensic', 'legal', 'technical', 'custom', 'executive', 'comparison'];
const VALID_FORMATS = reportsCfg.validFormats || ['pdf', 'html', 'docx', 'json'];
const VALID_LANGUAGES = reportsCfg.validLanguages || ['fr', 'en', 'es', 'de', 'it'];
const VALID_EXPORT_FORMATS = reportsCfg.validExportFormats || ['json', 'csv', 'xml', 'yaml'];
const VALID_LAYOUTS = reportsCfg.validLayouts || ['single-column', 'two-column', 'comparison', 'timeline', 'grid'];

const MAX_BATCH_SIZE = reportsCfg.maxBatchSize || { analyst: 20, expert: 30, admin: 50 };
const MAX_CUSTOM_IMAGES = reportsCfg.maxCustomImages || { expert: 15, admin: 30 };
const PRIORITIES = reportsCfg.priorities || ['low', 'normal', 'high', 'urgent'];
const DEFAULT_PRIORITY = reportsCfg.defaultPriority || 'normal';

const BATCH_CFG = reportsCfg.batch || {};
const BATCH_EST_SEC = BATCH_CFG.estimatedTimePerReport || 30;
const BATCH_EST_CUSTOM_SEC = BATCH_CFG.estimatedTimePerCustom || 60;
const BATCH_MAX_CONCURRENCY = BATCH_CFG.maxConcurrency || 5;
const BATCH_FALLBACK_ENABLED = BATCH_CFG.fallbackEnabled !== false;
const BATCH_MIN_DEADLINE_MIN = BATCH_CFG.minDeadlineMinutes || 30;

const CACHE_REPORT_TTL = cacheCfg.reportTTL || 1800;
const CACHE_BATCH_TTL = cacheCfg.batchTTL || 1800;
const CACHE_CUSTOM_TTL = cacheCfg.customTTL || 3600;
const CACHE_EXPORT_TTL = cacheCfg.exportTTL || 600;
const CACHE_PREVIEW_TTL = cacheCfg.previewTTL || 300;
const CACHE_LIST_TTL = cacheCfg.listTTL || 180;
const CACHE_TEMPLATES_TTL = cacheCfg.templatesTTL || 3600;
const CACHE_STATISTICS_TTL = cacheCfg.statisticsTTL || 600;
const CACHE_STATUS_TTL = cacheCfg.statusTTL || 5;

const DL_MAX_BYTES = limitsCfg.maxDownloadSize || 100 * 1024 * 1024;
const DL_ALLOWED_EXTS = (limitsCfg.allowedExtensions || ['.pdf', '.html', '.docx', '.json', '.csv', '.xml', '.yaml']).map(e => e.toLowerCase());
const DL_SECURE_HEADERS = limitsCfg.secureHeaders !== false;

// =====================================
// RATE LIMITING REPORTS
// =====================================

function toMsWindow(w) {
  if (w?.windowSec) return w.windowSec * 1000;
  if (typeof w === 'number') return w * 1000;
  return 3600 * 1000;
}

const reportGenerationRateLimit = rateLimitService.createCustomLimit({
  windowMs: toMsWindow(rlCfg.reportGeneration) || 3600 * 1000,
  max: rlCfg.reportGeneration?.limit ?? 10,
  message: {
    success: false,
    error: 'Trop de générations de rapports dans la fenêtre',
    type: 'REPORT_GENERATION_RATE_LIMIT_EXCEEDED'
  }
});

const batchGenerationRateLimit = rateLimitService.createCustomLimit({
  windowMs: toMsWindow(rlCfg.batchGeneration) || 3600 * 1000,
  max: rlCfg.batchGeneration?.limit ?? 3,
  message: {
    success: false,
    error: 'Trop de générations batch dans la fenêtre',
    type: 'BATCH_GENERATION_RATE_LIMIT_EXCEEDED'
  }
});

const customReportRateLimit = rateLimitService.createCustomLimit({
  windowMs: toMsWindow(rlCfg.customReport) || 3600 * 1000,
  max: rlCfg.customReport?.limit ?? 2,
  message: {
    success: false,
    error: 'Trop de rapports personnalisés dans la fenêtre',
    type: 'CUSTOM_REPORT_RATE_LIMIT_EXCEEDED'
  }
});

const exportRateLimit = rateLimitService.createCustomLimit({
  windowMs: toMsWindow(rlCfg.export) || 3600 * 1000,
  max: rlCfg.export?.limit ?? 20,
  message: {
    success: false,
    error: 'Trop d\'exports dans la fenêtre',
    type: 'EXPORT_RATE_LIMIT_EXCEEDED'
  }
});

const downloadRateLimit = rateLimitService.createCustomLimit({
  windowMs: toMsWindow(rlCfg.download) || 3600 * 1000,
  max: rlCfg.download?.limit ?? 50,
  message: {
    success: false,
    error: 'Trop de téléchargements dans la fenêtre',
    type: 'DOWNLOAD_RATE_LIMIT_EXCEEDED'
  }
});

const previewRateLimit = rateLimitService.createCustomLimit({
  windowMs: toMsWindow(rlCfg.preview) || 900 * 1000,
  max: rlCfg.preview?.limit ?? 30,
  message: {
    success: false,
    error: 'Trop de previews dans la fenêtre',
    type: 'PREVIEW_RATE_LIMIT_EXCEEDED'
  }
});

// =====================================
// MIDDLEWARE FACTORY REPORTS
// =====================================

class ReportsRoutesMiddleware {
  static reportSecurityMiddleware = middlewareService.asyncHandler(async (req, res, next) => {
    req.requestId = req.requestId || crypto.randomBytes(8).toString('hex');
    req.reportContext = {
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']?.substring(0, 100),
      ipAddress: req.ip,
      requestId: req.requestId,
      user: req.user?.email || 'anonymous'
    };
    console.log(`📊 [${req.requestId}] Report request: ${req.method} ${req.path} by ${req.user?.email || 'anonymous'}`);
    next();
  });

  static validateReportParams = (req, res, next) => {
    const { template, format, language, priority } = req.query;

    if (template && !VALID_TEMPLATES.includes(template)) {
      return res.status(400).json({
        success: false,
        error: 'Template de rapport invalide',
        type: 'INVALID_TEMPLATE',
        validTemplates: VALID_TEMPLATES,
        provided: template,
        requestId: req.requestId
      });
    }

    if (format && !VALID_FORMATS.includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Format de rapport invalide',
        type: 'INVALID_FORMAT',
        validFormats: VALID_FORMATS,
        provided: format,
        requestId: req.requestId
      });
    }

    if (language && !VALID_LANGUAGES.includes(language)) {
      return res.status(400).json({
        success: false,
        error: 'Langue non supportée',
        type: 'INVALID_LANGUAGE',
        validLanguages: VALID_LANGUAGES,
        provided: language,
        requestId: req.requestId
      });
    }

    if (priority && !PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Priorité invalide',
        type: 'INVALID_PRIORITY',
        validPriorities: PRIORITIES,
        provided: priority,
        requestId: req.requestId
      });
    }

    next();
  };

  static get singleReportPipeline() {
    return [
      this.reportSecurityMiddleware,
      reportGenerationRateLimit,
      auth,
      requireRole(['forensic_analyst', 'expert', 'admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging,
      validateForensicObjectId('imageId'),
      this.validateReportParams
    ];
  }

  static get batchReportPipeline() {
    return [
      this.reportSecurityMiddleware,
      batchGenerationRateLimit,
      auth,
      requireRole(['forensic_analyst', 'admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging,
      this.validateReportParams
    ];
  }

  static get customReportPipeline() {
    return [
      this.reportSecurityMiddleware,
      customReportRateLimit,
      auth,
      requireRole(['expert', 'admin']),
      requirePrivacyMode(['JUDICIAL']),
      forensicLogging,
      validateCustomReport
    ];
  }

  static get exportPipeline() {
    return [
      this.reportSecurityMiddleware,
      exportRateLimit,
      auth,
      requireRole(['forensic_analyst', 'expert', 'admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging,
      validateForensicObjectId('imageId'),
      validateForensicQuery
    ];
  }

  static get previewPipeline() {
    return [
      this.reportSecurityMiddleware,
      previewRateLimit,
      auth,
      forensicLogging,
      validateForensicObjectId('imageId'),
      this.validateReportParams
    ];
  }

  static get listPipeline() {
    return [ this.reportSecurityMiddleware, auth, validateForensicQuery ];
  }

  static get downloadPipeline() {
    return [
      this.reportSecurityMiddleware,
      downloadRateLimit,
      auth,
      forensicLogging,
      validateForensicObjectId('reportId')
    ];
  }

  static get statusPipeline() {
    return [ this.reportSecurityMiddleware, auth ];
  }

  static get templatesPipeline() {
    return [ this.reportSecurityMiddleware, auth ];
  }

  static get statisticsPipeline() {
    return [
      this.reportSecurityMiddleware,
      auth,
      requireRole(['forensic_analyst', 'admin', 'auditor'])
    ];
  }
}

// =====================================
// GESTIONNAIRE CACHE REPORTS
// =====================================

class ReportsCacheManager {
  static generateCacheKey(type, params, userContext = {}) {
    const keyData = JSON.stringify({ ...params, userContext });
    const hash = crypto.createHash('md5').update(keyData).digest('hex');
    return `${type}_${hash}`;
  }

  static async getCache(type, cacheKey) {
    try {
      const cached = await cacheService.getWithType(type, cacheKey);
      return cached;
    } catch (error) {
      console.warn(`⚠️ Erreur cache ${type}:`, error.message);
      return null;
    }
  }

  static async setCache(type, cacheKey, data, ttl) {
    try {
      await cacheService.setWithType(type, cacheKey, {
        data,
        cachedAt: new Date().toISOString()
      }, ttl);
    } catch (error) {
      console.warn(`⚠️ Erreur sauvegarde cache ${type}:`, error.message);
    }
  }
}

// =====================================
// UTILITAIRES REPORTS
// =====================================

class ReportsUtilities {
  static formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h${Math.floor((seconds % 3600) / 60)}m`;
  }

  static getUserLevel(user) {
    if (!user || !user.roles) return 'user';
    if (user.roles.includes('admin')) return 'admin';
    if (user.roles.includes('expert')) return 'expert';
    if (user.roles.includes('forensic_analyst')) return 'analyst';
    if (user.roles.includes('auditor')) return 'auditor';
    return 'user';
  }

  static calculateDistribution(array) {
    if (!Array.isArray(array) || array.length === 0) return {};
    const distribution = {};
    array.forEach(item => {
      if (item) distribution[item] = (distribution[item] || 0) + 1;
    });
    const total = array.length;
    const result = {};
    Object.entries(distribution).forEach(([key, count]) => {
      result[key] = { count, percentage: Math.round((count / total) * 100) };
    });
    return result;
  }

  static calculateGrowthRate(breakdownData) {
    if (!Array.isArray(breakdownData) || breakdownData.length < 2) return 0;
    const first = breakdownData?.count || 0;
    const last = breakdownData[breakdownData.length - 1]?.count || 0;
    if (first === 0) return last > 0 ? 100 : 0;
    return Math.round(((last - first) / first) * 100);
  }

  static findPeakPeriod(breakdownData) {
    if (!Array.isArray(breakdownData) || breakdownData.length === 0) return null;
    let maxCount = 0;
    let peakPeriod = null;
    breakdownData.forEach(item => {
      if (item.count > maxCount) {
        maxCount = item.count;
        peakPeriod = item._id;
      }
    });
    return { period: peakPeriod, count: maxCount };
  }

  static validateImageBatch(imageIds, userRoles) {
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return { valid: false, error: 'Liste d\'IDs d\'images requise', type: 'MISSING_IMAGE_IDS' };
    }
    const userLevel = this.getUserLevel({ roles: userRoles });
    const maxBatchSize =
      (MAX_BATCH_SIZE[userLevel] !== undefined ? MAX_BATCH_SIZE[userLevel] : MAX_BATCH_SIZE.analyst);

    if (imageIds.length > maxBatchSize) {
      return {
        valid: false,
        error: `Maximum ${maxBatchSize} images par batch`,
        type: 'BATCH_SIZE_EXCEEDED',
        maxSize: maxBatchSize,
        provided: imageIds.length
      };
    }

    const uniqueIds = [...new Set(imageIds)];
    if (uniqueIds.length !== imageIds.length) {
      return {
        valid: false,
        error: 'IDs d\'images en double détectés',
        type: 'DUPLICATE_IMAGE_IDS',
        duplicateCount: imageIds.length - uniqueIds.length
      };
    }

    return { valid: true, uniqueIds };
  }

  static async verifyImagesExistAndAnalyzed(imageIds, privacyMode) {
    try {
      const Image = require('../models/Image');
      const images = await Image.find({ _id: { $in: imageIds } })
        .select('_id status privacyMode originalName');

      const foundIds = images.map(img => img._id.toString());
      const missingIds = imageIds.filter(id => !foundIds.includes(id));

      if (missingIds.length > 0) {
        return {
          valid: false,
          error: `${missingIds.length} image(s) non trouvée(s)`,
          type: 'IMAGES_NOT_FOUND',
          missingIds: missingIds.slice(0, 5),
          missingCount: missingIds.length
        };
      }

      const unanalyzedImages = images.filter(img => img.status !== 'analyzed' && img.status !== 'completed');
      if (unanalyzedImages.length > 0) {
        return {
          valid: false,
          error: `${unanalyzedImages.length} image(s) non analysée(s)`,
          type: 'IMAGES_NOT_ANALYZED',
          unanalyzedCount: unanalyzedImages.length
        };
      }

      const needsJudicial = images.some(img => img.privacyMode === 'JUDICIAL');
      if (needsJudicial && privacyMode !== 'JUDICIAL') {
        return {
          valid: false,
          error: 'Niveau de confidentialité JUDICIAL requis',
          type: 'PRIVACY_LEVEL_INSUFFICIENT',
          required: 'JUDICIAL',
          provided: privacyMode
        };
      }

      return { valid: true, images };
    } catch (error) {
      return {
        valid: false,
        error: 'Erreur vérification images',
        type: 'VERIFICATION_ERROR',
        details: error.message
      };
    }
  }

  static validateDownloadSecurity(reportPath) {
    if (!reportPath || typeof reportPath !== 'string') {
      return { safe: false, reason: 'Invalid path' };
    }
    const normalizedPath = path.normalize(reportPath);
    if (normalizedPath.includes('..')) {
      return { safe: false, reason: 'Path traversal detected' };
    }
    const ext = path.extname(normalizedPath).toLowerCase();
    if (!DL_ALLOWED_EXTS.includes(ext)) {
      return { safe: false, reason: 'Invalid file extension' };
    }
    if (!fs.existsSync(normalizedPath)) {
      return { safe: false, reason: 'File not found' };
    }
    try {
      const stats = fs.statSync(normalizedPath);
      if (stats.size > DL_MAX_BYTES) {
        return { safe: false, reason: 'File too large' };
      }
    } catch {
      return { safe: false, reason: 'Cannot access file stats' };
    }
    return { safe: true };
  }

  static getSecureDownloadHeaders(reportPath, reportId, reportType) {
    const ext = path.extname(reportPath) || '.pdf';
    const base = `${reportType || 'report'}-${reportId}`.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const safeName = `"${base}${ext}"`;

    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.html': 'text/html',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.json': 'application/json',
      '.csv': 'text/csv',
      '.xml': 'application/xml',
      '.yaml': 'text/yaml'
    };

    return {
      'Content-Disposition': `attachment; filename=${safeName}`,
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    };
  }

  static createBatchConfig(params, req) {
    return {
      batchId: params.batchId,
      imageIds: params.imageIds,
      sessionId: params.sessionId || `batch_${params.batchId}`,
      template: params.template || VALID_TEMPLATES,
      format: params.format || VALID_FORMATS,
      language: params.language || VALID_LANGUAGES,
      includeSummaryStats: params.includeSummaryStats === 'true',
      includeIndividualAnalyses: params.includeIndividualAnalyses === 'true',
      priority: params.priority || DEFAULT_PRIORITY,
      requestedBy: req.user?.sub,
      privacyMode: req.privacyMode,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  }
}

// =====================================
// HANDLERS REPORTS SÉPARÉS
// =====================================

class ReportsHandlers {
  static async handleSingleReport(req, res) {
    const { imageId } = req.params;
    const params = {
      template: req.query.template || VALID_TEMPLATES,
      format: req.query.format || VALID_FORMATS,
      language: req.query.language || VALID_LANGUAGES,
      priority: req.query.priority || DEFAULT_PRIORITY
    };

    console.log(`📄 [${req.requestId}] Génération rapport: ${imageId} (${params.template}/${params.format})`);

    const cacheKey = ReportsCacheManager.generateCacheKey('single_reports', { imageId, ...params }, { userId: req.user?.sub });
    const cachedReport = await ReportsCacheManager.getCache('single_reports', cacheKey);

    if (cachedReport && cachedReport.data) {
      console.log(`🎯 [${req.requestId}] Cache hit rapport: ${imageId}`);
      res.set('Cache-Control', 'private, max-age=1800');
      res.set('ETag', cacheKey);
      return res.json({
        ...cachedReport.data,
        cached: true,
        cacheTime: cachedReport.cachedAt
      });
    }

    try {
      const result = await generateSingleReport(req, res);

      if (result && result.success && !result.error) {
        await ReportsCacheManager.setCache('single_reports', cacheKey, result, CACHE_REPORT_TTL);
        console.log(`💾 [${req.requestId}] Rapport mis en cache: ${imageId}`);
      }

      res.set('Cache-Control', 'private, max-age=300');
      return result;
    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur génération rapport:`, error);
      return res.status(500).json({
        success: false,
        error: 'Erreur génération rapport',
        details: error.message,
        imageId,
        requestId: req.requestId
      });
    }
  }

  static async handleBatchReport(req, res) {
    const {
      imageIds,
      sessionId,
      template = VALID_TEMPLATES,
      format = VALID_FORMATS,
      language = VALID_LANGUAGES,
      includeSummaryStats,
      includeIndividualAnalyses,
      priority = DEFAULT_PRIORITY
    } = req.body;

    console.log(`📦 [${req.requestId}] Batch rapport: ${imageIds?.length || 0} images`);

    const batchValidation = ReportsUtilities.validateImageBatch(imageIds, req.user?.roles);
    if (!batchValidation.valid) {
      return res.status(400).json({
        success: false,
        ...batchValidation,
        requestId: req.requestId
      });
    }

    const uniqueIds = batchValidation.uniqueIds;
    const imagesVerification = await ReportsUtilities.verifyImagesExistAndAnalyzed(uniqueIds, req.privacyMode);
    if (!imagesVerification.valid) {
      return res.status(imagesVerification.type === 'IMAGES_NOT_FOUND' ? 404 : 400).json({
        success: false,
        ...imagesVerification,
        requestId: req.requestId
      });
    }

    const batchCacheKey = ReportsCacheManager.generateCacheKey('batch_reports', { uniqueIds, template, format });
    const cachedBatch = await ReportsCacheManager.getCache('batch_reports', batchCacheKey);

    if (cachedBatch && cachedBatch.data) {
      console.log(`🎯 [${req.requestId}] Cache hit batch rapport`);
      res.set('Cache-Control', 'private, max-age=900');
      res.set('ETag', batchCacheKey);
      return res.json({
        ...cachedBatch.data,
        cached: true,
        cacheTime: cachedBatch.cachedAt
      });
    }

    const batchId = crypto.randomBytes(12).toString('hex');
    const batchConfig = ReportsUtilities.createBatchConfig({
      batchId,
      imageIds: uniqueIds,
      sessionId,
      template,
      format,
      language,
      includeSummaryStats,
      includeIndividualAnalyses,
      priority
    }, req);

    try {
      const batchReportId = await reportService.initiateBatchReport(batchConfig);

      const initialStatus = {
        success: true,
        batchId,
        batchReportId,
        status: 'generating',
        progress: 0,
        estimatedCompletion: new Date(Date.now() + (uniqueIds.length * BATCH_EST_SEC * 1000)).toISOString()
      };

      await ReportsCacheManager.setCache('batch_reports', batchCacheKey, initialStatus, CACHE_BATCH_TTL);

      console.log(`🚀 [${req.requestId}] Batch rapport initié: ${batchId} (${uniqueIds.length} images)`);

      res.set('Cache-Control', 'private, max-age=30');
      res.status(202).json({
        success: true,
        message: `Rapport batch initié pour ${uniqueIds.length} images`,
        batchId,
        batchReportId,
        config: { template, format, language, imageCount: uniqueIds.length },
        tracking: {
          statusUrl: `/api/reports/batch/${batchId}/status`,
          estimatedCompletion: initialStatus.estimatedCompletion,
          estimatedTime: `${Math.round((uniqueIds.length * BATCH_EST_SEC) / 60)} minutes`
        },
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });

    } catch (serviceError) {
      console.warn(`⚠️ [${req.requestId}] Service batch indisponible, fallback:`, serviceError.message);

      if (BATCH_FALLBACK_ENABLED) {
        try {
          req.batchConfig = batchConfig;
          const result = await generateBatchReport(req, res);

          if (result && result.success) {
            await ReportsCacheManager.setCache('batch_reports', batchCacheKey, result, CACHE_BATCH_TTL);
          }

          return result;
        } catch (fallbackError) {
          console.error(`❌ [${req.requestId}] Erreur fallback batch:`, fallbackError);
          return res.status(500).json({
            success: false,
            error: 'Erreur génération rapport batch',
            details: fallbackError.message,
            requestId: req.requestId
          });
        }
      } else {
        return res.status(503).json({
          success: false,
          error: 'Service de génération batch temporairement indisponible',
          type: 'BATCH_SERVICE_UNAVAILABLE',
          requestId: req.requestId
        });
      }
    }
  }

  // ✅ HANDLER TEMPLATES RAPPORTS
  static async handleTemplates(req, res) {
    console.log(`📋 [${req.requestId}] Templates rapports par ${req.user?.email}`);

    const templatesCacheKey = 'report_templates_list';
    const cachedTemplates = await ReportsCacheManager.getCache('templates', templatesCacheKey);

    if (cachedTemplates && cachedTemplates.data) {
      res.set('Cache-Control', 'private, max-age=3600');
      res.set('ETag', templatesCacheKey);
      return res.json({
        ...cachedTemplates.data,
        cached: true,
        cacheTime: cachedTemplates.cachedAt,
        requestId: req.requestId
      });
    }

    const templates = {
      executive: {
        name: 'Résumé Exécutif',
        description: 'Rapport synthétique pour direction et décideurs',
        audience: 'Direction, Management, Clients',
        sections: ['Résumé', 'Conclusions principales', 'Recommandations', 'Annexes critiques'],
        features: ['Vue d\'ensemble', 'Métriques clés', 'Graphiques synthétiques'],
        estimatedPages: '2-4 pages',
        generationTime: '30-45 secondes',
        complexity: 'low',
        formats: ['pdf', 'html', 'docx']
      },
      technical: {
        name: 'Analyse Technique',
        description: 'Rapport détaillé pour experts techniques et analystes',
        audience: 'Experts forensiques, Analystes techniques, Ingénieurs',
        sections: ['Méthodologie', 'Analyse 7 piliers', 'Données techniques', 'Algorithmes utilisés'],
        features: ['Détails techniques', 'Métriques avancées', 'Graphiques techniques'],
        estimatedPages: '10-15 pages',
        generationTime: '60-90 secondes',
        complexity: 'medium',
        formats: ['pdf', 'html', 'json']
      },
      legal: {
        name: 'Rapport Judiciaire',
        description: 'Rapport conforme aux standards légaux et judiciaires',
        audience: 'Tribunaux, Avocats, Forces de l\'ordre, Experts judiciaires',
        sections: ['Chain of custody', 'Méthodologie certifiée', 'Preuves', 'Conclusions juridiques'],
        features: ['Conformité légale', 'Traçabilité', 'Signatures numériques'],
        estimatedPages: '8-12 pages',
        generationTime: '90-120 secondes',
        complexity: 'high',
        formats: ['pdf', 'docx'],
        requirements: ['Privacy JUDICIAL', 'Certification']
      },
      summary: {
        name: 'Résumé Rapide',
        description: 'Vue d\'ensemble concise pour évaluation rapide',
        audience: 'Screening, Évaluation rapide, Triage',
        sections: ['Scores principaux', 'Flags critiques', 'Recommandation immédiate'],
        features: ['Analyse rapide', 'Indicateurs visuels', 'Score global'],
        estimatedPages: '1-2 pages',
        generationTime: '15-30 secondes',
        complexity: 'very_low',
        formats: ['pdf', 'html', 'json', 'csv']
      },
      detailed: {
        name: 'Analyse Complète',
        description: 'Rapport exhaustif avec toutes les données disponibles',
        audience: 'Investigation approfondie, Expertise poussée, Recherche',
        sections: ['Tous les piliers', 'EXIF complet', 'Historique', 'Métadonnées', 'Raw data'],
        features: ['Données brutes', 'Métriques exhaustives', 'Graphiques détaillés'],
        estimatedPages: '15-25 pages',
        generationTime: '120-180 secondes',
        complexity: 'very_high',
        formats: ['pdf', 'html', 'json'],
        requirements: ['Role expert/admin']
      },
      comparison: {
        name: 'Rapport Comparatif',
        description: 'Analyse comparative entre plusieurs images',
        audience: 'Analyse de séries, Détection patterns, Investigations liées',
        sections: ['Comparaisons croisées', 'Matrice similarités', 'Divergences', 'Clustering'],
        features: ['Analyse comparative', 'Graphiques comparatifs', 'Corrélations'],
        estimatedPages: '6-10 pages',
        generationTime: '90-150 secondes',
        complexity: 'high',
        formats: ['pdf', 'html', 'csv'],
        requirements: ['Multiple images']
      },
      custom: {
        name: 'Rapport Personnalisé',
        description: 'Rapport sur mesure avec sections configurables',
        audience: 'Besoins spécifiques, Clients particuliers, Projets spéciaux',
        sections: ['Configurables', 'Layout personnalisé', 'Branding', 'Filtres avancés'],
        features: ['Personnalisation complète', 'Branding client', 'Filtres avancés'],
        estimatedPages: 'Variable (5-30 pages)',
        generationTime: '180-600 secondes',
        complexity: 'very_high',
        formats: ['pdf', 'html', 'docx'],
        requirements: ['Role expert/admin', 'Privacy JUDICIAL']
      }
    };

    const recommendedByRole = {
      'forensic_analyst': ['technical', 'detailed', 'comparison'],
      'expert': ['technical', 'detailed', 'legal', 'custom'],
      'admin': ['executive', 'technical', 'detailed', 'custom'],
      'legal_officer': ['legal', 'executive'],
      'investigator': ['comparison', 'detailed', 'technical'],
      'client': ['executive', 'summary']
    };

    const userRoles = req.user?.roles || [];
    const userRecommendations = userRoles.flatMap(role => recommendedByRole[role] || []);
    const uniqueRecommendations = [...new Set(userRecommendations)];

    const formatSupport = {
      pdf: Object.keys(templates),
      html: ['executive', 'technical', 'summary', 'detailed', 'comparison', 'custom'],
      json: ['summary', 'technical', 'detailed'],
      csv: ['summary', 'comparison'],
      docx: ['executive', 'legal', 'detailed', 'custom'],
      xml: ['technical', 'detailed']
    };

    const result = {
      templates,
      recommendations: {
        forUser: uniqueRecommendations,
        byRole: recommendedByRole,
        defaultTemplate: uniqueRecommendations || 'executive'
      },
      formatSupport,
      capabilities: {
        maxCustomImages: userRoles.includes('admin') ? (MAX_CUSTOM_IMAGES.admin || 30) : (MAX_CUSTOM_IMAGES.expert || 15),
        supportedLanguages: VALID_LANGUAGES,
        qualityLevels: ['draft', 'standard', 'high', 'print'],
        layoutOptions: VALID_LAYOUTS
      },
      userContext: {
        roles: userRoles,
        privacyMode: req.privacyMode,
        canCreateCustom: userRoles.includes('expert') || userRoles.includes('admin')
      },
      timestamp: new Date().toISOString()
    };

    await ReportsCacheManager.setCache('templates', templatesCacheKey, result, CACHE_TEMPLATES_TTL);

    res.set('Cache-Control', 'private, max-age=600');
    res.json(result);
  }

  // ✅ HANDLER STATISTIQUES RAPPORTS
  static async handleStatistics(req, res) {
    const { 
      period = '30d', 
      breakdown = 'daily',
      template,
      format,
      userId 
    } = req.query;
    
    console.log(`📈 [${req.requestId}] Stats rapports: ${period} (${breakdown}) par ${req.user?.email}`);

    const VALID_PERIODS = config.reports?.statistics?.validPeriods || ['7d', '30d', '90d', '1y'];
    const VALID_BREAKDOWNS = config.reports?.statistics?.validBreakdowns || ['hourly', 'daily', 'weekly', 'monthly'];

    if (!VALID_PERIODS.includes(period)) {
      return res.status(400).json({
        success: false,
        error: 'Période invalide pour statistiques',
        type: 'INVALID_STATS_PERIOD',
        validPeriods: VALID_PERIODS,
        provided: period,
        requestId: req.requestId
      });
    }

    if (!VALID_BREAKDOWNS.includes(breakdown)) {
      return res.status(400).json({
        success: false,
        error: 'Type de regroupement invalide',
        type: 'INVALID_BREAKDOWN',
        validBreakdowns: VALID_BREAKDOWNS,
        provided: breakdown,
        requestId: req.requestId
      });
    }

    const userLevel = ReportsUtilities.getUserLevel(req.user);
    const statsCacheKey = ReportsCacheManager.generateCacheKey('report_stats', 
      { period, breakdown, template, format, userId }, { userLevel });
    
    const cachedStats = await ReportsCacheManager.getCache('report_stats', statsCacheKey);
    if (cachedStats && cachedStats.data) {
      console.log(`🎯 [${req.requestId}] Cache hit stats rapports`);
      res.set('Cache-Control', 'private, max-age=600');
      res.set('ETag', statsCacheKey);
      return res.json({
        ...cachedStats.data,
        cached: true,
        cacheTime: cachedStats.cachedAt,
        requestId: req.requestId
      });
    }

    try {
      const Report = require('../models/Report');
      const periodMs = {
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        '90d': 90 * 24 * 60 * 60 * 1000,
        '1y': 365 * 24 * 60 * 60 * 1000
      }[period];
      
      const startDate = new Date(Date.now() - periodMs);
      
      const matchQuery = { createdAt: { $gte: startDate } };

      if (template) matchQuery['configuration.template'] = template;
      if (format) matchQuery['configuration.format'] = format;
      if (userId && (userLevel === 'admin' || userId === req.user?.sub)) {
        matchQuery['generation.requestedBy.userId'] = userId;
      }

      const stats = await Report.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalReports: { $sum: 1 },
            completedReports: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            failedReports: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
            byTemplate: { $push: '$configuration.template' },
            byFormat: { $push: '$configuration.format' },
            byClassification: { $push: '$classification' },
            avgGenerationTime: { $avg: '$generation.processingTime' },
            totalProcessingTime: { $sum: '$generation.processingTime' },
            avgFileSize: { $avg: '$files.size' }
          }
        }
      ]);

      let breakdownData = [];
      if (breakdown && stats?.totalReports > 0) {
        const groupBy = {
          'hourly': { $dateToString: { format: "%Y-%m-%d %H:00", date: "$createdAt" } },
          'daily': { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          'weekly': { $dateToString: { format: "%Y-W%U", date: "$createdAt" } },
          'monthly': { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
        };

        breakdownData = await Report.aggregate([
          { $match: matchQuery },
          {
            $group: {
              _id: groupBy[breakdown],
              count: { $sum: 1 },
              completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
              avgTime: { $avg: '$generation.processingTime' }
            }
          },
          { $sort: { _id: 1 } }
        ]);
      }

      const overview = stats || {};
      
      const result = {
        period,
        breakdown,
        dateRange: {
          start: startDate.toISOString(),
          end: new Date().toISOString()
        },
        filters: {
          template,
          format,
          userId: userId && userLevel === 'admin' ? userId : undefined
        },
        statistics: {
          totalReports: overview.totalReports || 0,
          completedReports: overview.completedReports || 0,
          failedReports: overview.failedReports || 0,
          successRate: overview.totalReports > 0 
            ? Math.round((overview.completedReports / overview.totalReports) * 100) 
            : 0,
          averageGenerationTime: Math.round(overview.avgGenerationTime || 0),
          totalProcessingTime: Math.round(overview.totalProcessingTime || 0),
          averageFileSize: Math.round(overview.avgFileSize || 0),
          distributions: {
            template: ReportsUtilities.calculateDistribution(overview.byTemplate || []),
            format: ReportsUtilities.calculateDistribution(overview.byFormat || []),
            classification: ReportsUtilities.calculateDistribution(overview.byClassification || [])
          },
          breakdown: breakdownData
        },
        performance: {
          reportsPerDay: overview.totalReports > 0 ? 
            Math.round(overview.totalReports / (periodMs / (24 * 60 * 60 * 1000))) : 0,
          avgTimePerReport: Math.round(overview.avgGenerationTime || 0),
          efficiency: overview.totalReports > 0 && overview.avgGenerationTime > 0 ?
            Math.round(overview.totalReports / (overview.avgGenerationTime / 1000)) : 0
        },
        trends: breakdownData.length > 1 ? {
          growthRate: ReportsUtilities.calculateGrowthRate(breakdownData),
          peakPeriod: ReportsUtilities.findPeakPeriod(breakdownData)
        } : null,
        generatedAt: new Date().toISOString(),
        requestId: req.requestId
      };

      await ReportsCacheManager.setCache('report_stats', statsCacheKey, result, CACHE_STATISTICS_TTL);

      res.set('Cache-Control', 'private, max-age=300');
      res.json(result);

    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur récupération statistiques:`, error);
      return res.status(500).json({
        success: false,
        error: 'Erreur récupération statistiques rapports',
        details: error.message,
        requestId: req.requestId
      });
    }
  }

  // ✅ HANDLER CUSTOM STATUS
  static async handleCustomStatus(req, res) {
    const { customReportId } = req.params;
    
    console.log(`🎨 [${req.requestId}] Status custom rapport: ${customReportId}`);

    try {
      let customStatus = await ReportsCacheManager.getCache('custom_reports', customReportId);
      
      if (!customStatus) {
        const Report = require('../models/Report');
        const report = await Report.findOne({
          reportId: `CUSTOM-${customReportId}`
        }).select('status progress generation.processingTime issues createdAt');
        
        if (!report) {
          return res.status(404).json({
            success: false,
            error: 'Rapport personnalisé non trouvé',
            type: 'CUSTOM_REPORT_NOT_FOUND',
            customReportId,
            requestId: req.requestId
          });
        }

        customStatus = {
          data: {
            status: report.status,
            progress: report.progress || 0,
            processingTime: report.generation?.processingTime,
            issues: report.issues?.filter(i => !i.resolved) || [],
            timestamp: report.createdAt.toISOString()
          }
        };
      }

      if (customStatus.data?.timestamp) {
        const elapsed = Math.round((Date.now() - new Date(customStatus.data.timestamp).getTime()) / 1000);
        customStatus.data.runtime = {
          elapsed,
          elapsedFormatted: ReportsUtilities.formatDuration(elapsed),
          progress: customStatus.data.progress || 0
        };
      }

      res.set('Cache-Control', 'private, max-age=5');
      res.json({
        success: true,
        customReportId,
        status: customStatus.data,
        requestId: req.requestId,
        retrievedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur status custom:`, error);
      return res.status(500).json({
        success: false,
        error: 'Erreur récupération status rapport personnalisé',
        details: error.message,
        customReportId,
        requestId: req.requestId
      });
    }
  }
}

// =====================================
// GESTIONNAIRE D'ERREURS REPORTS
// =====================================

class ReportsErrorHandler {
  static enrichErrorContext(error, req) {
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
      type: error.type || 'REPORT_ERROR',
      context: {
        route: 'reports',
        method: req.method,
        path: req.path,
        userId: req.user?.sub || 'anonymous',
        userRoles: req.user?.roles || [],
        privacyMode: req.privacyMode || 'unknown',
        reportId: req.params?.reportId || req.params?.imageId || 'unknown'
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  }

  static getStatusCodeForError(error) {
    if (error.type?.includes('VALIDATION_') || error.type?.includes('INVALID_')) return 400;
    if (error.type?.includes('UNAUTHORIZED') || error.type?.includes('ACCESS_')) return 403;
    if (error.type?.includes('NOT_FOUND')) return 404;
    if (error.type?.includes('TIMEOUT')) return 408;
    if (error.type?.includes('TOO_LARGE') || error.type?.includes('EXCEEDED')) return 413;
    if (error.type?.includes('RATE_LIMIT')) return 429;
    if (error.type?.includes('UNAVAILABLE') || error.type?.includes('SERVICE_')) return 503;
    return 500;
  }
}

// =====================================
// ROUTES REPORTS OPTIMISÉES
// =====================================

router.post('/:imageId',
  ...ReportsRoutesMiddleware.singleReportPipeline,
  middlewareService.asyncHandler(ReportsHandlers.handleSingleReport)
);

router.post('/batch',
  ...ReportsRoutesMiddleware.batchReportPipeline,
  middlewareService.asyncHandler(ReportsHandlers.handleBatchReport)
);

router.get('/templates',
  ...ReportsRoutesMiddleware.templatesPipeline,
  middlewareService.asyncHandler(ReportsHandlers.handleTemplates)
);

router.get('/statistics',
  ...ReportsRoutesMiddleware.statisticsPipeline,
  middlewareService.asyncHandler(ReportsHandlers.handleStatistics)
);

router.get('/custom/:customReportId/status',
  ...ReportsRoutesMiddleware.statusPipeline,
  validateForensicObjectId('customReportId'),
  middlewareService.asyncHandler(ReportsHandlers.handleCustomStatus)
);

// Dev test simple
if (process.env.NODE_ENV !== 'production') {
  router.get('/test', (req, res) => res.json({ message: 'Test réussi' }));
}

// =====================================
// ROUTES DEBUG (DEV UNIQUEMENT)
// =====================================

if (process.env.NODE_ENV !== 'production') {
  router.get('/debug/cache-stats',
    auth,
    requireRole(['admin', 'developer']),
    middlewareService.asyncHandler(async (req, res) => {
      try {
        const cacheStats = await cacheService.getStats();
        const reportsCacheStats = {
          single_reports: await cacheService.getTypeStats('single_reports'),
          batch_reports: await cacheService.getTypeStats('batch_reports'),
          templates: await cacheService.getTypeStats('templates'),
          report_stats: await cacheService.getTypeStats('report_stats'),
          custom_reports: await cacheService.getTypeStats('custom_reports')
        };

        return res.json({
          success: true,
          global: cacheStats,
          reports: reportsCacheStats,
          system: {
            nodeVersion: process.version,
            platform: process.platform,
            uptime: Math.round(process.uptime()),
            memory: {
              used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
              total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
            }
          },
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Erreur stats cache debug reports',
          details: error.message,
          requestId: req.requestId
        });
      }
    })
  );
}

// =====================================
// GESTION D'ERREURS REPORTS
// =====================================

router.use((error, req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
  console.error(`❌ [${requestId}] Erreur route reports:`, error);

  const enrichedError = ReportsErrorHandler.enrichErrorContext(error, req);
  const statusCode = ReportsErrorHandler.getStatusCodeForError(error);

  if (!res.headersSent) {
    res.status(statusCode).json(enrichedError);
  }
});

// =====================================
// EXPORT ROUTER REPORTS
// =====================================

module.exports = router;

console.log('🎉 BA7ATH REPORTS ROUTES MIGRATION COMPLÈTE !');
console.log('📊 Routes: single/batch, templates, statistics, custom status');
console.log('🔐 Sécurité: auth, rôles, privacy modes, rate limiting');
console.log('⚡ Perf: cache multi-niveaux, fallback batch, MongoDB aggregation');
console.log('🛡️ Obs: logging forensique, métriques, analytics, audit trail');
console.log('🎯 Prêt pour production Ba7ath Enterprise Reports !');
