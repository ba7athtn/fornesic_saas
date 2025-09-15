"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Services Ba7ath
const emailService = require('../services/emailService');
const middlewareService = require('../services/middlewareService');
const rateLimitService = require('../services/rateLimitService');
const { auth, requireRole, forensicLogging } = require('../middleware/auth');
const { validateForensicQuery } = require('../middleware/validation');

// Config centralisée
const config = require('../config');

// ================================
// CONFIGURATION CENTRALISÉE (branchée)
// ================================
const CONFIG = {
  rateLimits: {
    testEmail: {
      limit: config.rateLimit?.dev?.emailTests?.limit ?? 10,
      window: config.rateLimit?.dev?.emailTests?.windowSeconds ?? 3600
    },
    devEndpoints: {
      limit: config.rateLimit?.dev?.endpoints?.limit ?? 50,
      window: config.rateLimit?.dev?.endpoints?.windowSeconds ?? 3600
    }
  },
  validation: {
    maxSubjectLength: config.dev?.validation?.maxSubjectLength ?? 255,
    maxLineLength: config.dev?.validation?.maxLineLength ?? 500,
    maxLines: config.dev?.validation?.maxLines ?? 10
  },
  smtp: {
    defaultSubject: config.mail?.smtp?.defaultSubject ?? 'Ba7ath Forensic - Test SMTP (API)',
    testRecipient: config.mail?.smtp?.testTo || config.mail?.smtp?.user || process.env.SMTP_TEST_TO || process.env.SMTP_USER,
    fromAddress: config.mail?.smtp?.from || process.env.SMTP_FROM
  },
  security: {
    enabledInProduction: config.dev?.routes?.enabledInProduction ?? false
  }
};

// ================================
// RATE LIMITING DEV
// ================================
const testEmailLimiter = rateLimitService.createCustomLimit({
  windowMs: CONFIG.rateLimits.testEmail.window * 1000,
  max: CONFIG.rateLimits.testEmail.limit,
  message: {
    success: false,
    error: 'Trop de tests d\'email dans l\'heure',
    type: 'DEV_EMAIL_RATE_LIMIT_EXCEEDED'
  }
});

const devEndpointsLimiter = rateLimitService.createCustomLimit({
  windowMs: CONFIG.rateLimits.devEndpoints.window * 1000,
  max: CONFIG.rateLimits.devEndpoints.limit,
  message: {
    success: false,
    error: 'Trop de requêtes dev dans l\'heure',
    type: 'DEV_ENDPOINTS_RATE_LIMIT_EXCEEDED'
  }
});

// ================================
// MIDDLEWARE FACTORY DEV
// ================================
class DevRoutesMiddleware {
  // Sécurité dev (bloque en prod par défaut)
  static devSecurityMiddleware = middlewareService.asyncHandler(async (req, res, next) => {
    const isProd = process.env.NODE_ENV === 'production';
    if (isProd && !CONFIG.security.enabledInProduction) {
      return res.status(403).json({
        success: false,
        error: 'Endpoints de développement non disponibles en production',
        type: 'DEV_ENDPOINTS_DISABLED',
        environment: 'production'
      });
    }

    req.requestId = req.requestId || crypto.randomBytes(8).toString('hex');
    req.devContext = {
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent']?.substring(0, 100),
      ipAddress: req.ip,
      requestId: req.requestId
    };

    console.log(`🔧 [${req.requestId}] Dev endpoint: ${req.method} ${req.path} from ${req.ip}`);
    next();
  });

  // Validation email test
  static validateTestEmail = (req, res, next) => {
    const { subject, lines, to } = req.body || {};

    if (subject && (typeof subject !== 'string' || subject.length > CONFIG.validation.maxSubjectLength)) {
      return res.status(400).json({
        success: false,
        error: `Sujet invalide (max ${CONFIG.validation.maxSubjectLength} caractères)`,
        type: 'INVALID_SUBJECT',
        requestId: req.requestId
      });
    }

    if (lines) {
      if (!Array.isArray(lines) || lines.length > CONFIG.validation.maxLines) {
        return res.status(400).json({
          success: false,
          error: `Lignes invalides (max ${CONFIG.validation.maxLines} lignes)`,
          type: 'INVALID_LINES',
          requestId: req.requestId
        });
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (typeof line !== 'string' || line.length > CONFIG.validation.maxLineLength) {
          return res.status(400).json({
            success: false,
            error: `Ligne ${i + 1} invalide (max ${CONFIG.validation.maxLineLength} caractères)`,
            type: 'INVALID_LINE_LENGTH',
            lineIndex: i,
            requestId: req.requestId
          });
        }
      }
    }

    if (to && (typeof to !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to))) {
      return res.status(400).json({
        success: false,
        error: 'Adresse email destinataire invalide',
        type: 'INVALID_RECIPIENT_EMAIL',
        requestId: req.requestId
      });
    }

    next();
  };

  // Pipelines dev
  static get testEmailPipeline() {
    return [
      this.devSecurityMiddleware,
      testEmailLimiter,
      auth,
      // requireRole peut accepter un tableau ou des args; adapter si besoin:
      requireRole(['admin', 'developer']),
      // forensicLogging doit rester non intrusif pour les endpoints non-image
      forensicLogging,
      this.validateTestEmail
    ];
  }

  static get devInfoPipeline() {
    return [
      this.devSecurityMiddleware,
      devEndpointsLimiter,
      auth,
      requireRole(['admin', 'developer'])
    ];
  }
}

// ================================
// HANDLERS DEV
// ================================
class DevHandlers {
  static async handleSendTestEmail(req, res) {
    const { subject, lines, to } = req.body || {};
    console.log(`📧 [${req.requestId}] Test email demandé par ${req.user?.email}`);

    const emailConfig = {
      to: to || CONFIG.smtp.testRecipient,
      subject: subject || CONFIG.smtp.defaultSubject,
      from: CONFIG.smtp.fromAddress,
      // Masquer d’éventuelles infos sensibles dans les logs applicatifs
      lines: Array.isArray(lines) && lines.length ? lines.slice(0, CONFIG.validation.maxLines) : [
        'Test d\'envoi via endpoint API de développement',
        `Date: ${new Date().toISOString()}`,
        `From: ${CONFIG.smtp.fromAddress || 'non configuré'}`,
        `Requested by: ${req.user?.email || 'Unknown'}`,
        `Request ID: ${req.requestId}`,
        `IP: ${req.ip}`,
        `Environment: ${process.env.NODE_ENV || 'development'}`
      ]
    };

    if (!emailConfig.to) {
      return res.status(500).json({
        success: false,
        error: 'Configuration email manquante (mail.smtp.testTo ou mail.smtp.user)',
        type: 'MISSING_EMAIL_CONFIG',
        requestId: req.requestId
      });
    }

    try {
      console.log(`📤 [${req.requestId}] Envoi test email vers: ${emailConfig.to}`);
      console.log(`📝 [${req.requestId}] Sujet: "${emailConfig.subject}"`);

      const result = await emailService.sendCustomEmail(emailConfig);

      if (result.ok) {
        console.log(`✅ [${req.requestId}] Email test envoyé avec succès: ${result.messageId}`);
        return res.status(200).json({
          success: true,
          message: 'Email de test envoyé avec succès',
          data: {
            messageId: result.messageId,
            recipient: emailConfig.to,
            subject: emailConfig.subject,
            linesCount: emailConfig.lines.length
          },
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      } else {
        console.error(`❌ [${req.requestId}] Erreur envoi email:`, result.error);
        return res.status(502).json({
          success: false,
          error: 'Erreur SMTP lors de l\'envoi',
          details: result.error || 'Erreur SMTP inconnue',
          type: 'SMTP_ERROR',
          requestId: req.requestId
        });
      }
    } catch (error) {
      console.error(`❌ [${req.requestId}] Exception envoi email:`, error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur lors de l\'envoi de l\'email de test',
        details: error.message,
        type: 'SERVER_ERROR',
        requestId: req.requestId
      });
    }
  }

  static async handleDevInfo(req, res) {
    console.log(`ℹ️ [${req.requestId}] Info dev demandée par ${req.user?.email}`);

    try {
      const devInfo = {
        service: 'Ba7ath Development Endpoints',
        version: '3.0.0-dev',
        description: 'Endpoints de développement pour tests et debug',
        environment: process.env.NODE_ENV || 'development',
        endpoints: {
          'POST /send-test-email': {
            description: 'Envoi email de test via SMTP',
            authentication: 'required',
            roles: ['admin', 'developer'],
            rateLimit: `${CONFIG.rateLimits.testEmail.limit} emails/heure`,
            validation: {
              subject: `optionnel, max ${CONFIG.validation.maxSubjectLength} caractères`,
              lines: `optionnel, max ${CONFIG.validation.maxLines} lignes de ${CONFIG.validation.maxLineLength} caractères`,
              to: 'optionnel, email valide'
            }
          },
          'GET /info': {
            description: 'Informations sur les endpoints de développement',
            authentication: 'required',
            roles: ['admin', 'developer'],
            rateLimit: `${CONFIG.rateLimits.devEndpoints.limit} requêtes/heure`
          }
        },
        configuration: {
          smtp: {
            testRecipient: CONFIG.smtp.testRecipient ? 'configuré' : 'non configuré',
            fromAddress: CONFIG.smtp.fromAddress ? 'configuré' : 'non configuré'
          },
          rateLimits: CONFIG.rateLimits,
          validation: CONFIG.validation
        },
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: Math.round(process.uptime()),
          memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
          }
        },
        security: {
          productionDisabled: process.env.NODE_ENV === 'production' && !CONFIG.security.enabledInProduction,
          authenticationRequired: true,
          rolesRequired: ['admin', 'developer'],
          rateLimitingEnabled: true,
          inputValidationEnabled: true
        },
        requestId: req.requestId,
        requestedBy: req.user?.email,
        timestamp: new Date().toISOString()
      };

      return res.json(devInfo);
    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur info dev:`, error);
      return res.status(500).json({
        success: false,
        error: 'Erreur récupération informations développement',
        details: error.message,
        requestId: req.requestId
      });
    }
  }
}

// ================================
// GESTIONNAIRE D'ERREURS DEV
// ================================
class DevErrorHandler {
  static enrichErrorContext(error, req) {
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
      type: error.type || 'DEV_ERROR',
      context: {
        route: 'dev',
        method: req.method,
        path: req.path,
        environment: process.env.NODE_ENV || 'development',
        userId: req.user?.sub || 'anonymous',
        email: req.user?.email || 'unknown',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']?.substring(0, 100)
      },
      requestId: req.requestId || crypto.randomBytes(8).toString('hex'),
      timestamp: new Date().toISOString()
    };
  }
}

// ================================
// ROUTES DEV
// ================================
router.post(
  '/send-test-email',
  ...DevRoutesMiddleware.testEmailPipeline,
  middlewareService.asyncHandler(DevHandlers.handleSendTestEmail)
);

router.get(
  '/info',
  ...DevRoutesMiddleware.devInfoPipeline,
  middlewareService.asyncHandler(DevHandlers.handleDevInfo)
);

// Routes debug supplémentaires (dev seulement)
if (process.env.NODE_ENV !== 'production' || CONFIG.security.enabledInProduction) {
  router.get('/debug/environment',
    auth,
    requireRole(['admin', 'developer']),
    middlewareService.asyncHandler(async (req, res) => {
      try {
        const envVars = {
          NODE_ENV: process.env.NODE_ENV,
          PORT: process.env.PORT,
          MONGODB_URI: process.env.MONGODB_URI ? '***configuré***' : 'non configuré',
          REDIS_URL: process.env.REDIS_URL ? '***configuré***' : 'non configuré',
          SMTP_HOST: config.mail?.smtp?.host || process.env.SMTP_HOST || 'non configuré',
          SMTP_PORT: config.mail?.smtp?.port || process.env.SMTP_PORT || 'non configuré',
          SMTP_USER: (config.mail?.smtp?.user || process.env.SMTP_USER) ? '***configuré***' : 'non configuré',
          SMTP_FROM: config.mail?.smtp?.from || process.env.SMTP_FROM || 'non configuré',
          JWT_SECRET: config.jwt?.secret ? '***configuré***' : (process.env.JWT_SECRET ? '***configuré***' : 'non configuré')
        };

        return res.json({
          success: true,
          environment: envVars,
          warning: 'Informations sensibles masquées pour sécurité',
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Erreur récupération environnement debug',
          details: error.message,
          requestId: req.requestId
        });
      }
    })
  );

  router.post('/debug/cache-test',
    auth,
    requireRole(['admin', 'developer']),
    middlewareService.asyncHandler(async (req, res) => {
      try {
        const cacheService = require('../services/cacheService');
        const testKey = `dev_test_${Date.now()}`;
        const testValue = { message: 'Cache test', timestamp: new Date().toISOString() };

        await cacheService.set(testKey, testValue, 60);
        const retrieved = await cacheService.get(testKey);
        await cacheService.delete(testKey);

        return res.json({
          success: true,
          message: 'Test cache Redis réussi',
          data: {
            written: testValue,
            retrieved: retrieved,
            match: JSON.stringify(testValue) === JSON.stringify(retrieved)
          },
          requestId: req.requestId,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: 'Erreur test cache Redis',
          details: error.message,
          requestId: req.requestId
        });
      }
    })
  );
}

// ================================
// ERROR HANDLER
// ================================
router.use(async (error, req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
  console.error(`❌ [${requestId}] Erreur route dev:`, error);

  const enrichedError = DevErrorHandler.enrichErrorContext(error, req);

  let statusCode = 500;
  if (error.type?.includes('VALIDATION_') || error.type?.includes('INVALID_')) statusCode = 400;
  else if (error.type?.includes('UNAUTHORIZED')) statusCode = 401;
  else if (error.type?.includes('FORBIDDEN') || error.type?.includes('DISABLED')) statusCode = 403;
  else if (error.type?.includes('NOT_FOUND')) statusCode = 404;
  else if (error.type?.includes('RATE_LIMIT')) statusCode = 429;
  else if (error.type?.includes('SMTP_')) statusCode = 502;

  if (!res.headersSent) {
    res.status(statusCode).json(enrichedError);
  }
});

// ================================
// EXPORT
// ================================
module.exports = router;

// Logs d’initialisation
console.log('🎉 BA7ATH DEV ROUTES CHARGÉES (config intégrée)');
console.log('🔧 Routes: POST /api/dev/send-test-email, GET /api/dev/info, debug/*');
console.log(`🔐 Prod disabled: ${process.env.NODE_ENV === 'production' && !CONFIG.security.enabledInProduction}`);
console.log('⚡ Rate limits (dev):', CONFIG.rateLimits);
