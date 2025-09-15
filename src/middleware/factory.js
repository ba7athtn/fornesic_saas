// middleware/factory.js - VERSION COMPLÈTEMENT OPTIMISÉE
"use strict";

const crypto = require('crypto');

// =====================================
// IMPORTS MIDDLEWARES OPTIMISÉS
// =====================================

// Auth middlewares optimisés
const { Ba7athAuthMiddleware, auth, optionalAuth, requireRole, requirePrivacyMode, forensicLogging } = require('./auth');
const { Ba7athJWTMiddleware, authenticate, validateRefreshToken, optionalAuthenticate } = require('./authenticate');
const { Ba7athAuthorizeMiddleware, authorize } = require('./authorize');
const { Ba7athScopesMiddleware, requireScopes } = require('./requireScopes');

// Validation middlewares optimisés
const { 
  Ba7athValidationMiddleware, 
  validateAuth,
  validateForensicUpload,
  validateForensicObjectId,
  validateForensicQuery,
  validateForensicBody,
  handleValidationErrors 
} = require('./validation');

// Upload middlewares optimisés
const { 
  Ba7athUploadMiddleware,
  single: uploadSingle,
  array: uploadArray,
  forensicUpload,
  forensicBatch
} = require('./upload');

// Services optimisés
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');

const isProd = process.env.NODE_ENV === 'production';

// =====================================
// CONFIGURATION CENTRALISÉE FACTORY
// =====================================

const FACTORY_CONFIG = {
  // Rate limits par type de pipeline
  rateLimits: {
    default: { limit: 100, window: 3600 }, // 100 req/heure
    auth: { limit: 20, window: 3600 }, // 20 auth/heure
    upload: { limit: 30, window: 3600 }, // 30 uploads/heure
    admin: { limit: 200, window: 3600 }, // 200 admin ops/heure
    forensic: { limit: 50, window: 3600 }, // 50 analyses/heure
    api: { limit: 1000, window: 3600 }, // 1000 API calls/heure
    public: { limit: 50, window: 3600 } // 50 public/heure
  },

  // Pipelines par défaut
  defaults: {
    includeErrorHandling: true,
    includeLogging: true,
    includeRequestId: true,
    asyncWrapper: true
  },

  // Privacy modes supportés
  privacyModes: ['COMMERCIAL', 'JUDICIAL'],

  // Rôles supportés
  roles: {
    admin: ['admin', 'forensic_admin'],
    expert: ['expert', 'forensic_expert'], 
    analyst: ['forensic_analyst', 'data_analyst'],
    user: ['user', 'premium_user'],
    public: []
  }
};

// =====================================
// UTILITAIRES FACTORY
// =====================================

class FactoryUtilities {
  // ✅ Génération Request ID
  static generateRequestId = (req, res, next) => {
    if (!req.requestId) {
      req.requestId = crypto.randomBytes(8).toString('hex');
    }
    res.setHeader('X-Request-ID', req.requestId);
    next();
  };

  // ✅ Logging factory
  static logFactoryEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;

    const logEntry = {
      level: level.toUpperCase(),
      message,
      requestId,
      timestamp: new Date().toISOString(),
      component: 'MIDDLEWARE_FACTORY',
      ...data
    };

    const icon = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' }[level] || '🏭';
    console.log(`${icon} FACTORY ${logEntry.level}:`, JSON.stringify(logEntry));
  }

  // ✅ Création rate limiter configuré
  static createRateLimit(type = 'default', customOptions = {}) {
    const config = FACTORY_CONFIG.rateLimits[type] || FACTORY_CONFIG.rateLimits.default;
    
    return rateLimitService.createCustomLimit({
      windowMs: (customOptions.window || config.window) * 1000,
      max: customOptions.limit || config.limit,
      message: {
        success: false,
        error: `Trop de requêtes ${type} dans la fenêtre temporelle`,
        type: `${type.toUpperCase()}_RATE_LIMIT_EXCEEDED`,
        retryAfter: config.window
      }
    });
  }

  // ✅ Middleware de fin de pipeline avec gestion d'erreurs
  static pipelineErrorHandler = (pipelineName) => {
    return (error, req, res, next) => {
      const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
      
      this.logFactoryEvent('error', `Pipeline ${pipelineName} error`, {
        error: error.message,
        type: error.type || 'PIPELINE_ERROR',
        path: req.path,
        method: req.method
      }, requestId);

      if (!res.headersSent) {
        res.status(error.status || 500).json({
          success: false,
          error: error.message || 'Erreur pipeline middleware',
          type: error.type || 'PIPELINE_ERROR',
          pipeline: pipelineName,
          requestId,
          timestamp: new Date().toISOString()
        });
      }
    };
  };

  // ✅ Wrapper pipeline avec logging
  static wrapPipeline(pipelineName, middlewares) {
    const wrappedMiddlewares = [
      this.generateRequestId,
      ...middlewares
    ];

    // Ajouter error handler si configuré
    if (FACTORY_CONFIG.defaults.includeErrorHandling) {
      wrappedMiddlewares.push(this.pipelineErrorHandler(pipelineName));
    }

    return wrappedMiddlewares;
  }
}

// =====================================
// MIDDLEWARE FACTORY PRINCIPAL
// =====================================

class Ba7athMiddlewareFactory {
  // ✅ Pipeline authentification flexible
  static authPipeline(options = {}) {
    const {
      required = true,
      roles = null,
      privacyMode = null,
      scopes = null,
      includeLogging = FACTORY_CONFIG.defaults.includeLogging,
      rateLimit = true
    } = options;

    const pipeline = [];

    // Rate limiting auth si activé
    if (rateLimit) {
      pipeline.push(FactoryUtilities.createRateLimit('auth'));
    }

    // Authentification
    if (required) {
      pipeline.push(Ba7athAuthMiddleware.auth);
    } else {
      pipeline.push(Ba7athAuthMiddleware.optionalAuth);
    }

    // Logging forensique
    if (includeLogging) {
      pipeline.push(Ba7athAuthMiddleware.forensicLogging);
    }

    // Autorisation rôles
    if (roles) {
      pipeline.push(Ba7athAuthMiddleware.requireRole(roles));
    }

    // Privacy mode
    if (privacyMode) {
      pipeline.push(Ba7athAuthMiddleware.requirePrivacyMode(privacyMode));
    }

    // Scopes
    if (scopes) {
      pipeline.push(Ba7athScopesMiddleware.requireScopes(scopes));
    }

    return FactoryUtilities.wrapPipeline('auth', pipeline);
  }

  // ✅ Pipeline upload forensique sécurisé
  static uploadPipeline(options = {}) {
    const {
      type = 'single', // 'single', 'array', 'forensic', 'forensicBatch'
      fieldName = 'file',
      maxCount = 5,
      authRequired = true,
      validateUpload = true,
      rateLimit = true
    } = options;

    const pipeline = [];

    // Rate limiting upload
    if (rateLimit) {
      pipeline.push(FactoryUtilities.createRateLimit('upload'));
    }

    // Auth optionnelle ou requise
    if (authRequired) {
      pipeline.push(Ba7athAuthMiddleware.auth);
    } else {
      pipeline.push(Ba7athAuthMiddleware.optionalAuth);
    }

    // Logging forensique
    pipeline.push(Ba7athAuthMiddleware.forensicLogging);

    // Upload middleware selon type
    switch (type) {
      case 'single':
        pipeline.push(...Ba7athUploadMiddleware.single(fieldName));
        break;
      case 'array':
        pipeline.push(...Ba7athUploadMiddleware.array(fieldName, maxCount));
        break;
      case 'forensic':
        pipeline.push(...Ba7athUploadMiddleware.forensicUpload(fieldName));
        break;
      case 'forensicBatch':
        pipeline.push(...Ba7athUploadMiddleware.forensicBatch(fieldName, maxCount));
        break;
      default:
        pipeline.push(...Ba7athUploadMiddleware.single(fieldName));
    }

    // Validation upload supplémentaire
    if (validateUpload) {
      pipeline.push(Ba7athValidationMiddleware.forensicUpload);
    }

    return FactoryUtilities.wrapPipeline('upload', pipeline);
  }

  // ✅ Pipeline admin sécurisé
  static adminPipeline(options = {}) {
    const {
      strictAuth = true,
      roles = FACTORY_CONFIG.roles.admin,
      privacyMode = ['JUDICIAL', 'COMMERCIAL'],
      scopes = ['admin:*'],
      rateLimit = true,
      auditLog = true
    } = options;

    const pipeline = [];

    // Rate limiting admin plus généreux
    if (rateLimit) {
      pipeline.push(FactoryUtilities.createRateLimit('admin'));
    }

    // Auth stricte requise
    pipeline.push(Ba7athAuthMiddleware.auth);

    // Autorisation admin
    pipeline.push(Ba7athAuthMiddleware.requireRole(roles));

    // Privacy mode
    pipeline.push(Ba7athAuthMiddleware.requirePrivacyMode(privacyMode));

    // Scopes admin
    if (scopes) {
      pipeline.push(Ba7athScopesMiddleware.requireScopes(scopes));
    }

    // Logging forensique renforcé
    if (auditLog) {
      pipeline.push(Ba7athAuthMiddleware.forensicLogging);
    }

    return FactoryUtilities.wrapPipeline('admin', pipeline);
  }

  // ✅ Pipeline forensique spécialisé
  static forensicPipeline(options = {}) {
    const {
      roles = ['forensic_analyst', 'expert', 'admin'],
      privacyMode = ['JUDICIAL', 'COMMERCIAL'],
      scopes = ['forensic:*'],
      validateObjectId = null,
      validateQuery = false,
      validateBody = false,
      rateLimit = true
    } = options;

    const pipeline = [];

    // Rate limiting forensique
    if (rateLimit) {
      pipeline.push(FactoryUtilities.createRateLimit('forensic'));
    }

    // Auth forensique
    pipeline.push(Ba7athAuthMiddleware.auth);
    pipeline.push(Ba7athAuthMiddleware.requireRole(roles));
    pipeline.push(Ba7athAuthMiddleware.requirePrivacyMode(privacyMode));

    // Scopes forensiques
    if (scopes) {
      pipeline.push(Ba7athScopesMiddleware.requireScopes(scopes));
    }

    // Logging forensique obligatoire
    pipeline.push(Ba7athAuthMiddleware.forensicLogging);

    // Validations spécialisées
    if (validateObjectId) {
      pipeline.push(Ba7athValidationMiddleware.forensicObjectId(validateObjectId));
    }

    if (validateQuery) {
      pipeline.push(...Ba7athValidationMiddleware.forensicQuery);
    }

    if (validateBody) {
      pipeline.push(Ba7athValidationMiddleware.forensicBody);
    }

    return FactoryUtilities.wrapPipeline('forensic', pipeline);
  }

  // ✅ Pipeline API flexible et configurable
  static apiPipeline(options = {}) {
    const {
      auth: authConfig = { required: false },
      rateLimit: rateLimitType = 'api',
      validation: validationConfig = null,
      roles = null,
      privacyMode = null,
      scopes = null,
      forensic = false
    } = options;

    const pipeline = [];

    // Rate limiting
    if (rateLimitType) {
      pipeline.push(FactoryUtilities.createRateLimit(rateLimitType));
    }

    // Authentification selon config
    if (authConfig.required) {
      pipeline.push(Ba7athAuthMiddleware.auth);
    } else {
      pipeline.push(Ba7athAuthMiddleware.optionalAuth);
    }

    // Autorisation si spécifiée
    if (roles) {
      pipeline.push(Ba7athAuthMiddleware.requireRole(roles));
    }

    // Privacy mode si spécifié
    if (privacyMode) {
      pipeline.push(Ba7athAuthMiddleware.requirePrivacyMode(privacyMode));
    }

    // Scopes si spécifiés
    if (scopes) {
      pipeline.push(Ba7athScopesMiddleware.requireScopes(scopes));
    }

    // Logging forensique si mode forensique
    if (forensic) {
      pipeline.push(Ba7athAuthMiddleware.forensicLogging);
    }

    // Validation selon schéma fourni
    if (validationConfig) {
      if (validationConfig.type === 'auth') {
        pipeline.push(...validateAuth[validationConfig.schema]);
      } else if (validationConfig.type === 'query') {
        pipeline.push(...Ba7athValidationMiddleware.forensicQuery);
      } else if (validationConfig.type === 'objectId') {
        pipeline.push(Ba7athValidationMiddleware.forensicObjectId(validationConfig.param));
      } else if (validationConfig.schema) {
        pipeline.push(Ba7athValidationMiddleware.handleErrors);
      }
    }

    return FactoryUtilities.wrapPipeline('api', pipeline);
  }

  // ✅ Pipeline public avec protection basique
  static publicPipeline(options = {}) {
    const {
      rateLimit = true,
      optionalAuth = false,
      cors = true
    } = options;

    const pipeline = [];

    // Rate limiting public plus restrictif
    if (rateLimit) {
      pipeline.push(FactoryUtilities.createRateLimit('public'));
    }

    // Auth optionnelle pour contenu enrichi
    if (optionalAuth) {
      pipeline.push(Ba7athAuthMiddleware.optionalAuth);
    }

    return FactoryUtilities.wrapPipeline('public', pipeline);
  }

  // =====================================
  // PIPELINES PRÊTS À L'EMPLOI
  // =====================================

  // ✅ Pipeline auth standard
  static get standardAuth() {
    return this.authPipeline({ required: true, includeLogging: true });
  }

  // ✅ Pipeline auth optionnel
  static get optionalAuth() {
    return this.authPipeline({ required: false, includeLogging: true });
  }

  // ✅ Pipeline admin standard
  static get standardAdmin() {
    return this.adminPipeline({
      roles: FACTORY_CONFIG.roles.admin,
      privacyMode: ['JUDICIAL'],
      scopes: ['admin:*']
    });
  }

  // ✅ Pipeline forensic analyst
  static get forensicAnalyst() {
    return this.forensicPipeline({
      roles: ['forensic_analyst', 'expert', 'admin'],
      scopes: ['forensic:analysis', 'forensic:*']
    });
  }

  // ✅ Pipeline upload forensique simple
  static get simpleForensicUpload() {
    return this.uploadPipeline({
      type: 'forensic',
      authRequired: true,
      validateUpload: true
    });
  }

  // ✅ Pipeline upload batch forensique
  static get batchForensicUpload() {
    return this.uploadPipeline({
      type: 'forensicBatch',
      maxCount: 10,
      authRequired: true,
      validateUpload: true
    });
  }

  // ✅ Pipeline API publique
  static get publicAPI() {
    return this.publicPipeline({
      rateLimit: true,
      optionalAuth: true
    });
  }

  // =====================================
  // MÉTHODES UTILITAIRES
  // =====================================

  // ✅ Composition pipeline personnalisée
  static customPipeline(name, middlewares, options = {}) {
    return FactoryUtilities.wrapPipeline(name, middlewares);
  }

  // ✅ Pipeline avec cache
  static withCache(pipeline, cacheOptions = {}) {
    // TODO: Intégrer middleware cache
    return pipeline;
  }

  // ✅ Pipeline avec métriques
  static withMetrics(pipeline, metricsName) {
    return [
      ...pipeline,
      (req, res, next) => {
        // TODO: Intégrer middleware métriques
        FactoryUtilities.logFactoryEvent('info', `Pipeline ${metricsName} completed`, {
          path: req.path,
          method: req.method,
          user: req.user?.sub
        }, req.requestId);
        next();
      }
    ];
  }

  // ✅ Validation de pipeline
  static validatePipeline(pipeline) {
    if (!Array.isArray(pipeline)) {
      throw new Error('Pipeline doit être un array de middlewares');
    }

    pipeline.forEach((middleware, index) => {
      if (typeof middleware !== 'function') {
        throw new Error(`Middleware à l'index ${index} doit être une fonction`);
      }
    });

    return true;
  }

  // ✅ Information sur les pipelines disponibles
  static getPipelineInfo() {
    return {
      pipelines: {
        authPipeline: 'Pipeline authentification flexible',
        uploadPipeline: 'Pipeline upload sécurisé avec validation',
        adminPipeline: 'Pipeline administration avec autorisation stricte',
        forensicPipeline: 'Pipeline forensique spécialisé',
        apiPipeline: 'Pipeline API configurable',
        publicPipeline: 'Pipeline public avec protection basique'
      },
      prebuilt: {
        standardAuth: 'Auth standard avec logging',
        optionalAuth: 'Auth optionnelle avec logging',
        standardAdmin: 'Admin avec rôles et scopes',
        forensicAnalyst: 'Pipeline analyst forensique',
        simpleForensicUpload: 'Upload forensique simple',
        batchForensicUpload: 'Upload forensique batch',
        publicAPI: 'API publique avec rate limiting'
      },
      rateLimits: FACTORY_CONFIG.rateLimits,
      roles: FACTORY_CONFIG.roles
    };
  }
}

// =====================================
// EXPORT MODULAIRE
// =====================================

module.exports = {
  // Factory principale
  Ba7athMiddlewareFactory,
  
  // Alias pour compatibilité
  MiddlewareFactory: Ba7athMiddlewareFactory,
  
  // Utilitaires
  FactoryUtilities,
  
  // Configuration
  FACTORY_CONFIG,

  // Pipelines directs (compatibilité)
  authPipeline: Ba7athMiddlewareFactory.authPipeline,
  uploadPipeline: Ba7athMiddlewareFactory.uploadPipeline,
  adminPipeline: Ba7athMiddlewareFactory.adminPipeline,
  apiPipeline: Ba7athMiddlewareFactory.apiPipeline
};
