"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// ✅ CONFIG CENTRALISÉE
const config = require('../config');

// ✅ SERVICES BA7ATH
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const pythonBridge = require('../services/pythonBridge');
const validationService = require('../services/validationService');

// ✅ MIDDLEWARES
const {
  auth,
  optionalAuth,
  requireRole,
  requirePrivacyMode,
  forensicLogging
} = require('../middleware/auth');

const {
  validateForensicObjectId,
  validateForensicQuery
} = require('../middleware/validation');

// =====================================
// RATE LIMITING FORENSIQUE
// =====================================

const analysisRateLimit = rateLimitService.createCustomLimit({
  windowMs: (config.rateLimit?.window || 15) * 60 * 1000,
  max: Math.min(config.rateLimit?.maxRequests || 100, 20),
  message: {
    success: false,
    error: 'Trop d\'analyses Python dans la fenêtre définie',
    type: 'PYTHON_ANALYSIS_RATE_LIMIT_EXCEEDED'
  }
});

const validationRateLimit = rateLimitService.createCustomLimit({
  windowMs: (config.rateLimit?.window || 15) * 60 * 1000,
  max: 50,
  message: {
    success: false,
    error: 'Trop de validations dans la fenêtre définie',
    type: 'VALIDATION_RATE_LIMIT_EXCEEDED'
  }
});

const reportRateLimit = rateLimitService.createCustomLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Trop de générations de rapports dans l\'heure',
    type: 'REPORT_RATE_LIMIT_EXCEEDED'
  }
});

const batchRateLimit = rateLimitService.createCustomLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Trop d\'analyses batch dans l\'heure',
    type: 'BATCH_RATE_LIMIT_EXCEEDED'
  }
});

// =====================================
// MIDDLEWARE FACTORY FORENSIC
// =====================================

class ForensicRoutesMiddleware {
  // ✅ MIDDLEWARE SÉCURITÉ FORENSIC
  static forensicSecurityMiddleware = middlewareService.asyncHandler(async (req, res, next) => {
    req.requestId = req.requestId || crypto.randomBytes(8).toString('hex');
    req.forensicContext = {
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']?.substring(0, 100),
      ipAddress: req.ip,
      requestId: req.requestId,
      user: req.user?.email || 'anonymous'
    };

    console.log(`🔬 [${req.requestId}] Forensic request: ${req.method} ${req.path} by ${req.user?.email || 'anonymous'}`);
    next();
  });

  // ✅ VÉRIFICATION PYTHON BRIDGE
  static requirePythonBridge = middlewareService.asyncHandler(async (req, res, next) => {
    try {
      if (!pythonBridge || !pythonBridge.bridge) {
        console.error('❌ Python Bridge non initialisé');
        return res.status(503).json({
          success: false,
          error: 'Service d\'analyse forensique non disponible',
          type: 'PYTHON_BRIDGE_UNAVAILABLE',
          details: 'Le bridge Python n\'est pas initialisé ou indisponible',
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
          retryAfter: '60s'
        });
      }

      const bridgeStatus = pythonBridge.bridge.getStatus();
      if (bridgeStatus.health === 'error' || bridgeStatus.activeProcesses >= bridgeStatus.maxConcurrent) {
        console.warn('⚠️ Python Bridge surchargé ou en erreur');
        return res.status(503).json({
          success: false,
          error: 'Service d\'analyse temporairement surchargé',
          type: 'PYTHON_BRIDGE_BUSY',
          details: `Processus actifs: ${bridgeStatus.activeProcesses}/${bridgeStatus.maxConcurrent}`,
          requestId: req.requestId,
          timestamp: new Date().toISOString(),
          retryAfter: '30s'
        });
      }

      req.pythonBridge = pythonBridge;
      req.bridgeStatus = bridgeStatus;
      next();
    } catch (error) {
      console.error('❌ Erreur vérification Python Bridge:', error);
      return res.status(503).json({
        success: false,
        error: 'Erreur interne du service d\'analyse',
        type: 'PYTHON_BRIDGE_ERROR',
        details: error.message,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  });

  // ✅ VALIDATION PARAMÈTRES ANALYSE
  static validateAnalysisParams = (req, res, next) => {
    const { filename, analysisType, imageId, userId } = req.body;

    if (!filename || typeof filename !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Paramètre filename manquant ou invalide',
        type: 'INVALID_FILENAME',
        details: 'Le nom de fichier est requis et doit être une chaîne de caractères',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    // Protection path traversal
    const sanitizedFilename = path.basename(filename);
    if (sanitizedFilename !== filename || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        error: 'Nom de fichier non sécurisé',
        type: 'UNSAFE_FILENAME',
        details: 'Le nom de fichier contient des caractères non autorisés',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    const validTypes = ['quick', 'full', 'metadata', 'tampering', 'deepfake'];
    if (analysisType && !validTypes.includes(analysisType)) {
      return res.status(400).json({
        success: false,
        error: 'Type d\'analyse non supporté',
        type: 'INVALID_ANALYSIS_TYPE',
        details: `Types supportés: ${validTypes.join(', ')}`,
        provided: analysisType,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    // Normaliser paramètres
    req.body.filename = sanitizedFilename;
    req.body.analysisType = analysisType || 'full';
    req.body.imageId = imageId || crypto.randomBytes(8).toString('hex');
    req.body.userId = userId || req.user?.sub || 'anonymous';

    next();
  };

  // ✅ PIPELINES FORENSIC
  static get analysisPipeline() {
    return [
      this.forensicSecurityMiddleware,
      analysisRateLimit,
      auth,
      requireRole(['forensic_analyst', 'expert', 'admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging,
      this.requirePythonBridge,
      this.validateAnalysisParams
    ];
  }

  static get validationPipeline() {
    return [
      this.forensicSecurityMiddleware,
      validationRateLimit,
      optionalAuth,
      forensicLogging,
      this.requirePythonBridge
    ];
  }

  static get reportPipeline() {
    return [
      this.forensicSecurityMiddleware,
      reportRateLimit,
      auth,
      requireRole(['forensic_analyst', 'expert', 'admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging,
      this.requirePythonBridge
    ];
  }

  static get batchPipeline() {
    return [
      this.forensicSecurityMiddleware,
      batchRateLimit,
      auth,
      requireRole(['forensic_analyst', 'admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging,
      this.requirePythonBridge
    ];
  }

  static get statusPipeline() {
    return [ this.forensicSecurityMiddleware ];
  }

  static get testPipeline() {
    return [
      this.forensicSecurityMiddleware,
      auth,
      requireRole(['forensic_analyst', 'admin']),
      this.requirePythonBridge
    ];
  }

  static get batchStatusPipeline() {
    return [
      this.forensicSecurityMiddleware,
      auth,
      validateForensicObjectId('batchId')
    ];
  }

  static get serviceInfoPipeline() {
    return [ this.forensicSecurityMiddleware ];
  }
}

// =====================================
// GESTIONNAIRE CACHE FORENSIC
// =====================================

class ForensicCacheManager {
  static generateAnalysisCacheKey(filename, analysisType, imageId) {
    return `python_analysis_${crypto
      .createHash('sha256')
      .update(`${filename}_${analysisType}_${imageId}`)
      .digest('hex').substring(0, 16)}`;
  }

  static generateValidationCacheKey(dataString, userId) {
    return `validation_${crypto
      .createHash('sha256')
      .update(dataString + (userId || 'anonymous'))
      .digest('hex').substring(0, 16)}`;
  }

  static generateReportCacheKey(analysisId, format, sections, template) {
    return `python_report_${crypto
      .createHash('md5')
      .update(`${analysisId}_${format}_${sections.sort().join('_')}_${template}`)
      .digest('hex')}`;
  }

  static async getAnalysisCache(cacheKey) {
    try {
      const cached = await cacheService.getWithType('python_analysis', cacheKey);
      return cached;
    } catch (error) {
      console.warn('⚠️ Erreur cache analyse:', error.message);
      return null;
    }
  }

  static async setAnalysisCache(cacheKey, data, metadata) {
    try {
      await cacheService.setWithType('python_analysis', cacheKey, {
        data,
        metadata,
        cachedAt: new Date().toISOString(),
        version: '1.0'
      }, config.forensic?.cacheTTL || 1800);
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde cache analyse:', error.message);
    }
  }

  static async getValidationCache(cacheKey) {
    try {
      const cached = await cacheService.getWithType('validations', cacheKey);
      return cached;
    } catch (error) {
      console.warn('⚠️ Erreur cache validation:', error.message);
      return null;
    }
  }

  static async setValidationCache(cacheKey, data) {
    try {
      await cacheService.setWithType('validations', cacheKey, {
        data,
        cachedAt: new Date().toISOString()
      }, Math.min(config.redis?.ttl?.cache || 3600, 900));
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde validation:', error.message);
    }
  }

  static async getReportCache(cacheKey) {
    try {
      const cached = await cacheService.getWithType('python_reports', cacheKey);
      return cached;
    } catch (error) {
      console.warn('⚠️ Erreur cache rapport:', error.message);
      return null;
    }
  }

  static async setReportCache(cacheKey, data, metadata) {
    try {
      await cacheService.setWithType('python_reports', cacheKey, {
        data,
        metadata,
        generatedAt: new Date().toISOString()
      }, Math.min(config.redis?.ttl?.cache || 3600, 3600));
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde rapport:', error.message);
    }
  }

  static async getBatchReport(batchId) {
    try {
      const batch = await cacheService.getWithType('python_batch', batchId);
      return batch;
    } catch (error) {
      console.warn('⚠️ Erreur cache batch:', error.message);
      return null;
    }
  }

  static async setBatchReport(batchId, batchReport) {
    try {
      await cacheService.setWithType('python_batch', batchId, batchReport, Math.min(config.redis?.ttl?.cache || 3600, 7200));
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde batch:', error.message);
    }
  }

  static async getStatusCache(cacheKey) {
    try {
      const cached = await cacheService.getWithType('python_status', cacheKey);
      if (cached && cached.timestamp &&
          (Date.now() - new Date(cached.timestamp).getTime() < 30 * 1000)) {
        return cached;
      }
      return null;
    } catch (error) {
      console.warn('⚠️ Erreur cache status:', error.message);
      return null;
    }
  }

  static async setStatusCache(cacheKey, data) {
    try {
      await cacheService.setWithType('python_status', cacheKey, { ...data, timestamp: new Date().toISOString() }, 30);
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde status:', error.message);
    }
  }

  static async getServiceInfo() {
    try {
      const cached = await cacheService.getWithType('service_info', 'forensic_service_info');
      if (cached && cached.timestamp &&
          (Date.now() - new Date(cached.timestamp).getTime() < 300 * 1000)) {
        return cached;
      }
      return null;
    } catch (error) {
      console.warn('⚠️ Erreur cache info service:', error.message);
      return null;
    }
  }

  static async setServiceInfo(serviceInfo) {
    try {
      await cacheService.setWithType('service_info', 'forensic_service_info', { ...serviceInfo, timestamp: new Date().toISOString() }, 300);
    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde info service:', error.message);
    }
  }
}

// =====================================
// UTILITAIRES FORENSIC
// =====================================

class ForensicUtilities {
  static getSystemInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: Math.round(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      }
    };
  }

  static generateRecommendations(bridgeStatus) {
    const recommendations = [];

    const utilizationRate = Math.round((bridgeStatus.activeProcesses / bridgeStatus.maxConcurrent) * 100);
    if (utilizationRate > 80) {
      recommendations.push({
        type: 'performance',
        message: 'Utilisation élevée - considérer augmenter maxConcurrent',
        priority: 'medium'
      });
    }

    if (bridgeStatus.queueLength > 10) {
      recommendations.push({
        type: 'performance',
        message: 'Queue importante - vérifier performance Python',
        priority: 'high'
      });
    }

    if (bridgeStatus.health === 'degraded') {
      recommendations.push({
        type: 'health',
        message: 'Service dégradé - vérifier logs Python',
        priority: 'high'
      });
    }

    return recommendations;
  }

  static evaluatePerformance(duration) {
    if (duration < 1000) return 'excellent';
    if (duration < 3000) return 'good';
    if (duration < 5000) return 'slow';
    return 'very_slow';
  }

  static validateImageBatch(images, userRoles) {
    const maxBatchSize = userRoles?.includes('admin') ? 50 : 20;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return {
        valid: false,
        error: 'Liste d\'images requise pour analyse batch',
        type: 'MISSING_IMAGES'
      };
    }

    if (images.length > maxBatchSize) {
      return {
        valid: false,
        error: `Maximum ${maxBatchSize} images par batch`,
        type: 'BATCH_SIZE_EXCEEDED',
        maxSize: maxBatchSize,
        provided: images.length
      };
    }

    // Validation de chaque image
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      if (!image.filename || typeof image.filename !== 'string') {
        return {
          valid: false,
          error: `Image ${i + 1}: filename manquant ou invalide`,
          type: 'INVALID_IMAGE_DATA',
          imageIndex: i
        };
      }

      const sanitizedFilename = path.basename(image.filename);
      if (sanitizedFilename !== image.filename) {
        return {
          valid: false,
          error: `Image ${i + 1}: nom de fichier non sécurisé`,
          type: 'UNSAFE_FILENAME',
          imageIndex: i,
          filename: image.filename
        };
      }

      images[i].filename = sanitizedFilename;
    }

    return { valid: true };
  }

  static createAnalysisParams(body, req) {
    return {
      filename: body.filename,
      analysisType: body.analysisType,
      imageId: body.imageId,
      userId: body.userId,
      privacyMode: req.privacyMode,
      requestId: req.requestId,
      security: {
        userRole: req.user?.roles || [],
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']?.substring(0, 100),
        deviceFingerprint: req.headers['x-device-fingerprint']
      },
      timestamp: new Date().toISOString()
    };
  }
}
// =====================================
// HANDLERS FORENSIC SÉPARÉS
// =====================================

class ForensicHandlers {
  // ✅ HANDLER ANALYSE IMAGE
  static async handleAnalyzeImage(req, res) {
    const startTime = Date.now();
    const { filename, analysisType, imageId, userId } = req.body;

    console.log(`🐍 [${req.requestId}] Analyse forensique: ${filename} (${analysisType})`);

    // Vérifier cache
    const cacheKey = ForensicCacheManager.generateAnalysisCacheKey(filename, analysisType, imageId);
    const cachedAnalysis = await ForensicCacheManager.getAnalysisCache(cacheKey);

    if (cachedAnalysis && cachedAnalysis.data) {
      console.log(`🎯 [${req.requestId}] Cache hit: ${filename}`);
      return res.json({
        success: true,
        requestId: req.requestId,
        analysis: cachedAnalysis.data,
        metadata: {
          ...cachedAnalysis.metadata,
          cached: true,
          cacheTime: cachedAnalysis.cachedAt,
          cacheKey: cacheKey.substring(0, 8)
        },
        performance: {
          totalTime: Date.now() - startTime,
          cached: true
        },
        timestamp: new Date().toISOString()
      });
    }

    // Préparer paramètres d'analyse
    const analysisParams = ForensicUtilities.createAnalysisParams(req.body, req);

    try {
      const timeoutMs = config.forensic?.maxAnalysisTime || 300000;
      const analysisResult = await req.pythonBridge.bridge.analyzeImage(analysisParams, { timeout: timeoutMs });

      if (!analysisResult || !analysisResult.success) {
        throw new Error(analysisResult?.error || 'Analyse Python échouée sans détails');
      }

      const processingTime = Date.now() - startTime;

      const response = {
        success: true,
        requestId: req.requestId,
        analysis: analysisResult.data,
        metadata: {
          filename,
          analysisType,
          imageId,
          userId,
          processingTime,
          pythonDuration: analysisResult.duration,
          pythonProcessId: analysisResult.processId,
          version: analysisResult.version || (process.env.API_VERSION || '3.0.0-ba7ath'),
          timestamp: new Date().toISOString(),
          bridgeStatus: {
            health: req.bridgeStatus?.health,
            activeProcesses: req.bridgeStatus?.activeProcesses,
            queueLength: req.bridgeStatus?.queueLength
          }
        },
        performance: {
          totalTime: processingTime,
          pythonTime: analysisResult.duration,
          overheadTime: processingTime - (analysisResult.duration || 0),
          cached: false
        }
      };

      // Sauvegarder en cache
      await ForensicCacheManager.setAnalysisCache(cacheKey, analysisResult.data, response.metadata);
      console.log(`💾 [${req.requestId}] Analyse mise en cache: ${cacheKey.substring(0, 8)}`);

      console.log(`✅ [${req.requestId}] Analyse terminée: ${filename} (${processingTime}ms)`);
      res.json(response);

    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur analyse Python:`, error.message);

      return res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'analyse forensique',
        type: error.message.includes('Timeout') ? 'ANALYSIS_TIMEOUT' : 'ANALYSIS_ERROR',
        details: error.message,
        requestId: req.requestId,
        filename,
        analysisType,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ✅ HANDLER VALIDATION
  static async handleValidate(req, res) {
    console.log(`🧪 [${req.requestId}] Validation données forensiques`);

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Données de validation manquantes',
        type: 'MISSING_VALIDATION_DATA',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    const dataString = JSON.stringify(req.body);
    const maxKB = (config.forensic?.validation?.maxDataSizeKB ?? 50);
    if (dataString.length > maxKB * 1024) {
      return res.status(413).json({
        success: false,
        error: 'Données de validation trop volumineuses',
        type: 'VALIDATION_DATA_TOO_LARGE',
        maxSize: `${maxKB}KB`,
        actualSize: `${Math.round(dataString.length / 1024)}KB`,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    const cacheKey = ForensicCacheManager.generateValidationCacheKey(dataString, req.user?.sub);
    const cachedValidation = await ForensicCacheManager.getValidationCache(cacheKey);

    if (cachedValidation && cachedValidation.data) {
      console.log(`🎯 [${req.requestId}] Cache hit validation`);
      return res.json({
        success: true,
        validation: cachedValidation.data,
        metadata: {
          cached: true,
          cacheTime: cachedValidation.cachedAt
        },
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    try {
      const validationParams = {
        ...req.body,
        requestId: req.requestId,
        userId: req.user?.sub || 'anonymous',
        timestamp: new Date().toISOString(),
        context: {
          userAgent: req.headers['user-agent']?.substring(0, 100),
          ipAddress: req.ip
        }
      };

      const timeoutMs = (config.forensic?.validation?.timeoutSeconds || 30) * 1000;
      const validationResult = await req.pythonBridge.bridge.validateForensicData(validationParams, { timeout: timeoutMs });

      if (!validationResult || !validationResult.success) {
        throw new Error(validationResult?.error || 'Validation Python échouée');
      }

      const response = {
        success: true,
        validation: validationResult.data,
        metadata: {
          processingTime: validationResult.duration,
          pythonProcessId: validationResult.processId,
          cached: false
        },
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      };

      await ForensicCacheManager.setValidationCache(cacheKey, validationResult.data);

      console.log(`✅ [${req.requestId}] Validation terminée (${validationResult.duration}ms)`);
      res.json(response);

    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur validation:`, error.message);

      res.status(500).json({
        success: false,
        error: 'Erreur lors de la validation forensique',
        type: 'VALIDATION_ERROR',
        details: error.message,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ✅ HANDLER GÉNÉRATION RAPPORT
  static async handleGenerateReport(req, res) {
    const requestId = req.requestId;

    try {
      const defaultFormat = 'pdf';
      const validFormats = ['pdf', 'json', 'html', 'xml'];
      const validSections = ['summary', 'details', 'recommendations'];
      const validTemplates = ['default', 'judicial', 'commercial'];

      const { analysisId, format = defaultFormat, sections = ['summary'], template = 'default' } = req.body || {};

      if (!analysisId || typeof analysisId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'analysisId requis',
          type: 'MISSING_ANALYSIS_ID',
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (!validFormats.includes(format)) {
        return res.status(400).json({
          success: false,
          error: 'Format de rapport invalide',
          type: 'INVALID_REPORT_FORMAT',
          validFormats,
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (!Array.isArray(sections) || sections.some(s => !validSections.includes(s))) {
        return res.status(400).json({
          success: false,
          error: 'Sections de rapport invalides',
          type: 'INVALID_REPORT_SECTIONS',
          validSections,
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (!validTemplates.includes(template)) {
        return res.status(400).json({
          success: false,
          error: 'Template de rapport invalide',
          type: 'INVALID_REPORT_TEMPLATE',
          validTemplates,
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      const cacheKey = ForensicCacheManager.generateReportCacheKey(analysisId, format, sections, template);
      const cached = await ForensicCacheManager.getReportCache(cacheKey);

      if (cached?.data) {
        return res.json({
          success: true,
          cached: true,
          requestId,
          report: cached.data,
          metadata: cached.metadata,
          timestamp: new Date().toISOString()
        });
      }

      const bridge = req.pythonBridge.bridge;
      const timeoutMs = config.forensic?.maxAnalysisTime || 300000;
      const result = await bridge.call({
        action: 'generate_report',
        params: {
          analysis_id: analysisId,
          format,
          sections,
          template,
          request_id: requestId
        }
      }, { timeout: timeoutMs });

      const metadata = {
        analysisId,
        format,
        sections,
        template,
        sizeBytes: result?.size_bytes,
        generatedAt: result?.generated_at || new Date().toISOString(),
        requestId
      };

      await ForensicCacheManager.setReportCache(cacheKey, result?.data || result, metadata);

      return res.json({
        success: true,
        cached: false,
        requestId,
        report: result?.data || result,
        metadata,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ [${requestId}] Erreur génération rapport:`, error.message);
      return res.status(500).json({
        success: false,
        error: 'Erreur interne lors de la génération du rapport',
        type: 'REPORT_GENERATION_ERROR',
        details: error.message,
        requestId,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ✅ ANALYSE BATCH (via bridge.call)
  static async handleBatchAnalysis(req, res) {
    const requestId = req.requestId;

    try {
      const role = req.user?.roles?.includes('admin') ? 'admin' : 'analyst';
      const maxSize = role === 'admin' ? 50 : 20;

      const { files = [], analysisType = 'full', priority = 'batch' } = req.body || {};

      if (!Array.isArray(files) || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Liste de fichiers requise',
          type: 'MISSING_FILES',
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (files.length > maxSize) {
        return res.status(413).json({
          success: false,
          error: `Taille batch dépassée (max ${maxSize})`,
          type: 'BATCH_SIZE_EXCEEDED',
          provided: files.length,
          max: maxSize,
          role,
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      const bridge = req.pythonBridge.bridge;
      const batchId = crypto.randomBytes(10).toString('hex');
      const startedAt = new Date().toISOString();

      const jobs = files.map(filename => ({
        filename,
        analysisType,
        imageId: crypto.randomBytes(6).toString('hex'),
        userId: req.user?.sub || 'anonymous'
      }));

      const timeoutMs = config.forensic?.maxAnalysisTime || 300000;
      const result = await bridge.call({
        action: 'analyze_batch',
        params: {
          jobs,
          priority,
          request_id: requestId,
          batch_id: batchId
        }
      }, { timeout: timeoutMs });

      const summary = {
        batchId,
        total: jobs.length,
        successful: result?.successful || 0,
        failed: result?.failed || 0,
        startedAt,
        finishedAt: result?.finished_at || new Date().toISOString(),
        processingMethod: 'python_bridge_batch'
      };

      await cacheService.setWithType('python_batch', batchId, {
        summary,
        results: result?.results || []
      }, Math.min(config.redis?.ttl?.cache || 3600, 7200));

      return res.status(202).json({
        success: true,
        message: 'Batch lancé',
        summary,
        tracking: {
          statusUrl: `/api/forensic/batch/${batchId}/status`
        },
        requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ [${requestId}] Erreur batch analyse:`, error.message);
      return res.status(500).json({
        success: false,
        error: 'Erreur interne lors de l’analyse batch',
        type: 'BATCH_ANALYSIS_ERROR',
        details: error.message,
        requestId,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ✅ STATUS PYTHON (détaillé + cache court)
  static async handlePythonStatus(req, res) {
    console.log(`📊 [${req.requestId}] Vérification status Python Bridge`);

    const statusCacheKey = 'python_bridge_status_detailed';
    const cachedStatus = await ForensicCacheManager.getStatusCache(statusCacheKey);

    if (cachedStatus) {
      return res.json({
        ...cachedStatus,
        cached: true,
        cacheAge: Math.round((Date.now() - new Date(cachedStatus.timestamp).getTime()) / 1000)
      });
    }

    let bridgeStatus;
    try {
      if (!pythonBridge || !pythonBridge.bridge) {
        return res.status(503).json({
          status: 'unavailable',
          error: 'Python Bridge non initialisé',
          type: 'BRIDGE_NOT_INITIALIZED',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }

      bridgeStatus = pythonBridge.bridge.getStatus();
    } catch (statusError) {
      console.error(`❌ [${req.requestId}] Erreur status bridge:`, statusError.message);
      return res.status(503).json({
        status: 'error',
        error: 'Erreur récupération status Python Bridge',
        details: statusError.message,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    const utilizationRate = Math.round((bridgeStatus.activeProcesses / bridgeStatus.maxConcurrent) * 100);
    const queueUtilization = bridgeStatus.queueLength ? Math.round((bridgeStatus.queueLength / 50) * 100) : 0;

    const response = {
      status: 'available',
      health: bridgeStatus.health || 'unknown',
      bridge: {
        ...bridgeStatus,
        utilizationRate,
        queueUtilization,
        performance: {
          avgProcessingTime: bridgeStatus.avgProcessingTime || 'N/A',
          successRate: bridgeStatus.successRate || 'N/A',
          errorRate: bridgeStatus.errorRate || 'N/A'
        }
      },
      system: ForensicUtilities.getSystemInfo(),
      recommendations: ForensicUtilities.generateRecommendations(bridgeStatus),
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };

    await ForensicCacheManager.setStatusCache(statusCacheKey, response);
    res.json(response);
  }
}
// =====================================
// GESTIONNAIRE D'ERREURS FORENSIC
// =====================================

class ForensicErrorHandler {
  static enrichErrorContext(error, req) {
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
      type: error.type || 'FORENSIC_ERROR',
      context: {
        route: 'forensic-python',
        method: req.method,
        path: req.path,
        userId: req.user?.sub || 'anonymous',
        userRoles: req.user?.roles || [],
        pythonBridge: req.pythonBridge ? 'available' : 'unavailable',
        bridgeStatus: req.bridgeStatus?.health || 'unknown',
        privacyMode: req.privacyMode || 'unknown'
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  }

  static getStatusCodeForError(error) {
    if (error.type === 'VALIDATION_ERROR' || error.type?.includes('INVALID_')) return 400;
    if (error.type?.includes('UNAUTHORIZED') || error.type?.includes('ACCESS_')) return 403;
    if (error.type?.includes('NOT_FOUND')) return 404;
    if (error.type?.includes('TIMEOUT')) return 408;
    if (error.type?.includes('TOO_LARGE') || error.type?.includes('EXCEEDED')) return 413;
    if (error.type?.includes('RATE_LIMIT')) return 429;
    if (error.type?.includes('UNAVAILABLE') || error.type?.includes('BUSY')) return 503;
    return 500;
  }
}

// =====================================
// HANDLERS COMPLÉMENTAIRES
// =====================================

class ForensicHandlersExtra {
  // ✅ TEST PYTHON (diagnostics)
  static async handleTestPython(req, res) {
    console.log(`🧪 [${req.requestId}] Test connectivité Python Bridge par ${req.user?.sub}`);
    const testStartTime = Date.now();

    const testResults = {
      connectivity: 'unknown',
      performance: 'unknown',
      features: {},
      errors: []
    };

    try {
      const timeoutMs = (config.forensic?.validation?.timeoutSeconds || 30) * 1000;
      const connectivityResult = await req.pythonBridge.bridge.testConnectivity({
        requestId: req.requestId,
        userId: req.user?.sub,
        testType: 'full',
        timestamp: new Date().toISOString()
      }, { timeout: timeoutMs });

      if (connectivityResult && connectivityResult.success) {
        testResults.connectivity = 'ok';
        testResults.features = connectivityResult.data?.features || {};
      } else {
        testResults.connectivity = 'failed';
        testResults.errors.push('Test connectivité échoué');
      }
    } catch (testError) {
      console.error(`❌ [${req.requestId}] Erreur test connectivité:`, testError.message);
      testResults.connectivity = 'error';
      testResults.errors.push(testError.message);
    }

    const totalDuration = Date.now() - testStartTime;
    testResults.performance = ForensicUtilities.evaluatePerformance(totalDuration);

    const response = {
      success: testResults.connectivity === 'ok',
      test: testResults,
      diagnostics: {
        totalDuration,
        bridgeStatus: req.bridgeStatus,
        timestamp: new Date().toISOString()
      },
      recommendations: [],
      requestId: req.requestId,
      testedBy: req.user?.sub
    };

    if (testResults.performance === 'slow' || testResults.performance === 'very_slow') {
      response.recommendations.push({
        type: 'performance',
        message: 'Performance dégradée - vérifier charge système',
        priority: 'medium'
      });
    }

    if (testResults.errors.length > 0) {
      response.recommendations.push({
        type: 'error',
        message: 'Erreurs détectées - vérifier logs Python',
        priority: 'high'
      });
    }

    console.log(`${response.success ? '✅' : '❌'} [${req.requestId}] Test Python terminé: ${testResults.performance} (${totalDuration}ms)`);
    res.json(response);
  }

  // ✅ HANDLER ANALYSE BATCH (pipeline parallèle)
  static async handleBatchAnalyze(req, res) {
    const { images, analysisType, priority } = req.body;

    console.log(`📦 [${req.requestId}] Analyse batch par ${req.user?.sub}: ${images?.length || 0} images`);

    const validation = ForensicUtilities.validateImageBatch(images, req.user?.roles);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        ...validation,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    const batchId = crypto.randomBytes(12).toString('hex');
    const batchStartTime = Date.now();
    const results = [];

    console.log(`🚀 [${req.requestId}] Démarrage batch ${batchId}: ${images.length} analyses`);

    const defaultConcurrency = 3;
    const maxConcurrent = req.bridgeStatus?.maxConcurrent || defaultConcurrency;
    const concurrencyLimit = Math.min(maxConcurrent, defaultConcurrency);
    const batchChunks = [];

    for (let i = 0; i < images.length; i += concurrencyLimit) {
      batchChunks.push(images.slice(i, i + concurrencyLimit));
    }

    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const chunk of batchChunks) {
      const chunkPromises = chunk.map(async (imageData) => {
        const imageStartTime = Date.now();
        const imageId = crypto.randomBytes(8).toString('hex');

        try {
          const analysisParams = {
            filename: imageData.filename,
            analysisType: analysisType || 'quick',
            imageId,
            userId: req.user?.sub,
            batchId,
            priority: priority || 'batch',
            metadata: imageData.metadata || {}
          };

          const timeoutMs = config.forensic?.maxAnalysisTime || 300000;
          const result = await req.pythonBridge.bridge.analyzeImage(analysisParams, { timeout: timeoutMs });

          if (result && result.success) {
            successCount++;
            return {
              filename: imageData.filename,
              imageId,
              success: true,
              analysis: result.data,
              processingTime: Date.now() - imageStartTime,
              pythonDuration: result.duration,
              timestamp: new Date().toISOString()
            };
          } else {
            errorCount++;
            return {
              filename: imageData.filename,
              imageId,
              success: false,
              error: result?.error || 'Analyse échouée sans détails',
              processingTime: Date.now() - imageStartTime,
              timestamp: new Date().toISOString()
            };
          }
        } catch (error) {
          console.error(`❌ [${req.requestId}] Erreur analyse ${imageData.filename}:`, error.message);
          errorCount++;
          return {
            filename: imageData.filename,
            imageId,
            success: false,
            error: error.message,
            processingTime: Date.now() - imageStartTime,
            timestamp: new Date().toISOString()
          };
        }
      });

      const chunkResults = await Promise.allSettled(chunkPromises);
      const chunkData = chunkResults.map(r => r.value || { success: false, error: 'Promise settled avec rejet' });

      results.push(...chunkData);
      processedCount += chunk.length;

      console.log(`⏳ [${req.requestId}] Batch ${batchId}: ${processedCount}/${images.length} traités`);
    }

    const totalProcessingTime = Date.now() - batchStartTime;

    const batchReport = {
      batchId,
      type: 'python_batch_analysis',
      summary: {
        total: images.length,
        successful: successCount,
        failed: errorCount,
        successRate: Math.round((successCount / images.length) * 100),
        analysisType: analysisType || 'quick',
        priority: priority || 'batch'
      },
      performance: {
        totalTime: totalProcessingTime,
        avgTimePerImage: Math.round(totalProcessingTime / images.length),
        concurrencyUsed: concurrencyLimit
      },
      results,
      status: 'completed',
      requestId: req.requestId,
      processedBy: req.user?.sub,
      timestamp: new Date().toISOString()
    };

    await ForensicCacheManager.setBatchReport(batchId, batchReport);
    console.log(`💾 [${req.requestId}] Batch sauvegardé: ${batchId}`);

    console.log(`✅ [${req.requestId}] Batch terminé ${batchId}: ${successCount}✅ ${errorCount}❌ (${totalProcessingTime}ms)`);

    res.status(202).json({
      success: true,
      message: `Analyse batch terminée: ${successCount} succès, ${errorCount} erreurs`,
      batch: batchReport,
      trackingUrl: `/api/forensic/batch/${batchId}/status`,
      timestamp: new Date().toISOString()
    });
  }

  // ✅ HANDLER STATUS BATCH
  static async handleBatchStatus(req, res) {
    const { batchId } = req.params;

    console.log(`📊 [${req.requestId}] Status batch: ${batchId}`);

    try {
      const batchStatus = await ForensicCacheManager.getBatchReport(batchId);

      if (!batchStatus) {
        return res.status(404).json({
          success: false,
          error: 'Batch non trouvé',
          type: 'BATCH_NOT_FOUND',
          batchId,
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }

      const canAccess = req.user?.roles?.includes('admin') ||
                        batchStatus.processedBy === req.user?.sub;

      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Accès non autorisé à ce batch',
          type: 'BATCH_ACCESS_DENIED',
          batchId,
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        batch: batchStatus,
        metadata: {
          age: Math.round((Date.now() - new Date(batchStatus.timestamp).getTime()) / 1000),
          canDownload: req.user?.roles?.includes('admin') || req.user?.roles?.includes('forensic_analyst'),
          downloadUrl: `/api/forensic/batch/${batchId}/download`
        },
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur status batch:`, error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur récupération status batch',
        details: error.message,
        batchId,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ✅ HANDLER SERVICE INFO
  static async handleServiceInfo(req, res) {
    console.log(`ℹ️ [${req.requestId}] Info service forensique`);

    const cachedInfo = await ForensicCacheManager.getServiceInfo();
    if (cachedInfo) {
      return res.json({
        ...cachedInfo,
        cached: true,
        requestId: req.requestId
      });
    }

    let pythonStatus = 'unavailable';
    let bridgeInfo = null;

    try {
      if (pythonBridge && pythonBridge.bridge) {
        const status = pythonBridge.bridge.getStatus();
        pythonStatus = status.health || 'unknown';
        bridgeInfo = {
          activeProcesses: status.activeProcesses,
          maxConcurrent: status.maxConcurrent,
          queueLength: status.queueLength,
          totalProcessed: status.totalProcessed,
          uptime: status.uptimeFormatted
        };
      }
    } catch (error) {
      console.warn(`⚠️ [${req.requestId}] Erreur status Python:`, error.message);
    }

    const windowMin = config.rateLimit?.window || 15;
    const analysisMax = 20, validationMax = 50, reportsMax = 10;

    const serviceInfo = {
      service: 'Ba7ath Forensic Python Bridge API',
      version: config.api?.version || '3.0.0-ba7ath',
      description: 'Service d\'analyse forensique d\'images avec IA et Python Bridge',
      pythonBridge: {
        status: pythonStatus,
        info: bridgeInfo
      },
      endpoints: {
        'POST /analyze-image': {
          description: 'Analyse forensique d\'une image via Python',
          authentication: 'required',
          roles: ['forensic_analyst', 'expert', 'admin'],
          rateLimit: `${analysisMax} requêtes / ${windowMin} minutes`
        },
        'POST /validate': {
          description: 'Validation de données forensiques',
          authentication: 'optional',
          rateLimit: `${validationMax} requêtes / ${windowMin} minutes`
        },
        'POST /generate-report': {
          description: 'Génération de rapport d\'analyse',
          authentication: 'required',
          roles: ['forensic_analyst', 'expert', 'admin'],
          rateLimit: `${reportsMax} requêtes / heure`
        },
        'POST /batch-analyze': {
          description: `Analyse batch d'images (jusqu'à 50)`,
          authentication: 'required',
          roles: ['forensic_analyst', 'admin'],
          maxBatchSize: 50
        },
        'GET /python-status': {
          description: 'Statut détaillé du Python Bridge',
          authentication: 'none',
          cached: `30 secondes`
        },
        'GET /test-python': {
          description: 'Test de connectivité Python',
          authentication: 'required',
          roles: ['forensic_analyst', 'admin']
        }
      },
      features: [
        'Cache intelligent multi-niveaux Redis',
        'Rate limiting distribué par rôle',
        'Analyse batch parallèle optimisée',
        'Authentification et autorisation granulaire',
        'Monitoring et métriques temps réel',
        'Gestion d\'erreurs et retry automatique',
        'Sécurité renforcée (path traversal, validation)',
        'Support formats multiples (JSON, PDF, HTML)',
        'Privacy modes (JUDICIAL, COMMERCIAL)',
        'Logging forensique détaillé'
      ],
      limits: {
        maxFileSize: `${Math.round((config.upload?.maxFileSize || 500 * 1024 * 1024) / 1024 / 1024)}MB`,
        maxBatchSize: {
          analyst: 20,
          admin: 50
        },
        supportedFormats: ['JPEG', 'PNG', 'WEBP', 'TIFF'],
        rateLimits: {
          analysis: `${analysisMax}/${windowMin}min`,
          validation: `${validationMax}/${windowMin}min`,
          reports: `${reportsMax}/hour`
        }
      },
      system: ForensicUtilities.getSystemInfo(),
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };

    await ForensicCacheManager.setServiceInfo(serviceInfo);
    res.json(serviceInfo);
  }
}

// =====================================
// ROUTES FORENSIC
// =====================================

router.post('/analyze-image',
  ...ForensicRoutesMiddleware.analysisPipeline,
  middlewareService.asyncHandler(ForensicHandlers.handleAnalyzeImage)
);

router.post('/validate',
  ...ForensicRoutesMiddleware.validationPipeline,
  middlewareService.asyncHandler(ForensicHandlers.handleValidate)
);

router.post('/generate-report',
  ...ForensicRoutesMiddleware.reportPipeline,
  middlewareService.asyncHandler(ForensicHandlers.handleGenerateReport)
);

router.get('/python-status',
  ...ForensicRoutesMiddleware.statusPipeline,
  middlewareService.asyncHandler(ForensicHandlers.handlePythonStatus)
);

router.get('/test-python',
  ...ForensicRoutesMiddleware.testPipeline,
  middlewareService.asyncHandler(ForensicHandlersExtra.handleTestPython)
);

router.post('/batch-analyze',
  ...ForensicRoutesMiddleware.batchPipeline,
  middlewareService.asyncHandler(ForensicHandlersExtra.handleBatchAnalyze)
);

router.get('/batch/:batchId/status',
  ...ForensicRoutesMiddleware.batchStatusPipeline,
  middlewareService.asyncHandler(ForensicHandlersExtra.handleBatchStatus)
);

router.get('/',
  ...ForensicRoutesMiddleware.serviceInfoPipeline,
  middlewareService.asyncHandler(ForensicHandlersExtra.handleServiceInfo)
);

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
        const forensicCacheStats = {
          python_analysis: await cacheService.getTypeStats('python_analysis'),
          validations: await cacheService.getTypeStats('validations'),
          python_reports: await cacheService.getTypeStats('python_reports'),
          python_batch: await cacheService.getTypeStats('python_batch'),
          python_status: await cacheService.getTypeStats('python_status')
        };

        return res.json({
          success: true,
          global: cacheStats,
          forensic: forensicCacheStats,
          pythonBridge: req.pythonBridge ? {
            available: true,
            status: req.pythonBridge.bridge.getStatus()
          } : { available: false },
          system: ForensicUtilities.getSystemInfo(),
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Erreur stats cache debug forensic',
          details: error.message,
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      }
    })
  );
}

// =====================================
// GESTION D'ERREURS GLOBALE
// =====================================

router.use((error, req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
  console.error(`❌ [${requestId}] Erreur route forensique:`, error);

  const enrichedError = ForensicErrorHandler.enrichErrorContext(error, req);
  const statusCode = ForensicErrorHandler.getStatusCodeForError(error);

  if (!res.headersSent) {
    res.status(statusCode).json(enrichedError);
  }
});

// =====================================
// EXPORT ROUTER FORENSIC
// =====================================

module.exports = router;

// ✅ LOG MIGRATION COMPLÈTE
console.log('🎉 BA7ATH FORENSIC ROUTES MIGRATION COMPLÈTE !');
console.log('🔬 Routes disponibles: analyse Python, validation, rapports, batch, status');
console.log('🐍 Python Bridge: intégration complète avec health management');
console.log('🔐 Sécurité: auth requise, rôles forensiques, privacy modes');
console.log('⚡ Performance: cache multi-niveaux, concurrence adaptative');
console.log('🛡️ Observabilité: logging forensique, métriques Python Bridge');
console.log('🎯 Prêt pour production Ba7ath Enterprise Forensics !');
