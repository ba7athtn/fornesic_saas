// middleware/auth.js - VERSION OPTIMISÉE (corrigée anti double-réponse)
"use strict";

const crypto = require('crypto');
const authService = require('../services/authService');
const appConfig = require('../config');

const isProd = process.env.NODE_ENV === 'production';

// =====================================
// CONFIGURATION CENTRALISÉE
// =====================================
const AUTH_CONFIG = {
  headers: {
    authenticate: 'Bearer error="invalid_token"',
    authStatus: 'X-Auth-Status',
    authMethod: 'X-Auth-Method',
    requestId: 'X-Request-Id',
    privacyMode: 'X-Privacy-Mode'
  },
  rateLimit: {
    maxAttempts: appConfig.rateLimit?.maxRequests || 100,
    windowMs: (appConfig.rateLimit?.window || 15) * 60 * 1000,
    retryAfter: 300 // 5 minutes
  },
  forensic: {
    chainOfCustodyPaths: ['/api/analysis', '/api/reports', '/api/forensic'],
    logResponseSize: true,
    maxUserAgentLength: 100
  },
  jwt: {
    regex: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
  },
  privacy: {
    defaultMode: process.env.PRIVACY_MODE || 'COMMERCIAL'
  }
};

// =====================================
// UTILITAIRES MODULAIRES
// =====================================
class AuthUtilities {
  static generateRequestId(req) {
    if (!req.requestId) {
      req.requestId = crypto.randomBytes(8).toString('hex');
    }
    return req.requestId;
  }

  static extractBearerToken(req) {
    let authHeader = req.headers['authorization'] || req.get?.('Authorization');
    if (!authHeader || typeof authHeader !== 'string') return null;

    const normalized = authHeader.replace(/\s+/g, ' ').trim().replace(/\r/g, '');
    if (normalized.toLowerCase().startsWith('bearer ')) {
      const token = normalized.slice(7).trim();
      return token || null;
    }
    if (AUTH_CONFIG.jwt.regex.test(normalized)) {
      return normalized;
    }
    return null;
  }

  static sendUnauthorized(res, type = 'UNAUTHORIZED', message = 'Non autorisé', details = {}, requestId = null) {
    if (res.headersSent) return res;

    if (!res.headersSent) {
      res.setHeader('WWW-Authenticate', AUTH_CONFIG.headers.authenticate);
    }

    const payload = {
      success: false,
      error: message,
      type,
      details,
      requestId,
      timestamp: new Date().toISOString()
    };

    try {
      const formatted = authService.formatAuthError(type, message, details, requestId);
      if (res.headersSent) return res;
      res.status(401).json(formatted);
      return res;
    } catch {
      if (!isProd) {
        console.warn('⚠️ Erreur formatage auth: fallback JSON standard');
      }
      if (res.headersSent) return res;
      res.status(401).json(payload);
      return res;
    }
  }

  static logAuthEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;
    const logEntry = {
      level: level.toUpperCase(),
      message,
      requestId,
      timestamp: new Date().toISOString(),
      ...data
    };
    const icon = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' }[level] || '📝';
    console.log(`${icon} AUTH ${logEntry.level}:`, JSON.stringify(logEntry));
  }

  static setSecurityHeaders(res, status = 'authenticated', method = 'jwt', requestId = null) {
    if (res.headersSent) return;
    res.setHeader(AUTH_CONFIG.headers.authStatus, status);
    res.setHeader(AUTH_CONFIG.headers.authMethod, method);
    if (requestId) res.setHeader(AUTH_CONFIG.headers.requestId, requestId);
  }

  static setRateLimitHeaders(res, rateLimitInfo) {
    if (res.headersSent) return;
    if (!rateLimitInfo || typeof rateLimitInfo.limit === 'undefined') return;

    res.setHeader('RateLimit', `${rateLimitInfo.limit}; window=${rateLimitInfo.resetTime || 300}`);
    res.setHeader('RateLimit-Remaining', String(Math.max(0, rateLimitInfo.remaining || 0)));
    res.setHeader('RateLimit-Reset', String(Math.max(0, rateLimitInfo.resetTime || 0)));

    if (rateLimitInfo.allowed === false) {
      res.setHeader('Retry-After', String(Math.max(1, rateLimitInfo.resetTime || 1)));
    }
  }

  static addChainOfCustody(req) {
    const isForensicPath = AUTH_CONFIG.forensic.chainOfCustodyPaths.some(path =>
      req.path.includes(path)
    );

    if (isForensicPath && req.user) {
      req.chainOfCustodyEntry = {
        action: 'API_ACCESS',
        performedBy: req.user.sub,
        timestamp: new Date(),
        details: {
          endpoint: `${req.method} ${req.path}`,
          requestId: req.requestId,
          authMethod: 'jwt',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')?.substring(0, AUTH_CONFIG.forensic.maxUserAgentLength)
        }
      };
    }
  }
}

// =====================================
// ASYNC HANDLER WRAPPER
// =====================================
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (res.headersSent) return;
    return next(err);
  });
};

// =====================================
// MIDDLEWARES PRINCIPAUX
// =====================================
class Ba7athAuthMiddleware {
  // ✅ Authentification principale
  static auth = asyncHandler(async (req, res, next) => {
    const startTime = Date.now();
    const requestId = AuthUtilities.generateRequestId(req);

    try {
      AuthUtilities.logAuthEvent('debug', 'AUTH start', {
        method: req.method,
        path: req.path,
        ip: req.ip
      }, requestId);

      // Extraction token
      const token = AuthUtilities.extractBearerToken(req);
      if (!token) {
        AuthUtilities.logAuthEvent('debug', 'Token vide après extraction', {
          authHeader: req.headers['authorization'] || 'none'
        }, requestId);

        AuthUtilities.setSecurityHeaders(res, 'unauthenticated', 'none', requestId);
        AuthUtilities.sendUnauthorized(
          res,
          'EMPTY_TOKEN',
          'Token d\'authentification requis',
          {},
          requestId
        );
        return;
      }

      // Génération client ID pour rate limiting
      let clientId;
      try {
        clientId = authService.generateClientIdentifier(req);
        AuthUtilities.logAuthEvent('debug', 'Client ID généré', { clientId }, requestId);
      } catch (clientError) {
        AuthUtilities.logAuthEvent('error', 'Erreur génération client ID', {
          error: clientError.message
        }, requestId);

        AuthUtilities.setSecurityHeaders(res, 'unauthenticated', 'none', requestId);
        AuthUtilities.sendUnauthorized(
          res,
          'CLIENT_ID_ERROR',
          'Erreur identification client',
          {},
          requestId
        );
        return;
      }

      // Vérification rate limit
      let rateLimitInfo;
      try {
        rateLimitInfo = await authService.checkAuthRateLimit(clientId, 'auth');
        AuthUtilities.setRateLimitHeaders(res, rateLimitInfo);

        AuthUtilities.logAuthEvent('debug', 'Rate limit vérifié', {
          allowed: rateLimitInfo?.allowed,
          remaining: rateLimitInfo?.remaining,
          current: rateLimitInfo?.current
        }, requestId);
      } catch (rateLimitError) {
        AuthUtilities.logAuthEvent('error', 'Erreur rate limit', {
          error: rateLimitError.message
        }, requestId);
      }

      if (rateLimitInfo && rateLimitInfo.allowed === false) {
        if (res.headersSent) return;
        res.status(429).json({
          success: false,
          error: 'Trop de tentatives d\'authentification',
          type: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitInfo.resetTime,
          remaining: rateLimitInfo.remaining,
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      // Validation JWT (déléguée au service)
      let validation;
      try {
        validation = await authService.validateAccessToken(token);
      } catch (validationError) {
        AuthUtilities.logAuthEvent('error', 'Exception validation token', {
          error: validationError.message
        }, requestId);

        AuthUtilities.setSecurityHeaders(res, 'unauthenticated', 'jwt', requestId);
        AuthUtilities.sendUnauthorized(
          res,
          'TOKEN_VALIDATION_ERROR',
          'Erreur validation token',
          {},
          requestId
        );
        return;
      }

      if (!validation?.valid) {
        const error = validation?.error || {
          code: 'TOKEN_INVALID',
          message: 'Token invalide',
          status: 401
        };

        AuthUtilities.logAuthEvent('warn', 'Validation échouée', {
          code: error.code,
          message: error.message
        }, requestId);

        AuthUtilities.setSecurityHeaders(res, 'unauthenticated', 'jwt', requestId);
        AuthUtilities.sendUnauthorized(
          res,
          error.code || 'TOKEN_INVALID',
          error.message || 'Token invalide',
          { processingTime: `${Date.now() - startTime}ms` },
          requestId
        );
        return;
      }

      // Enrichissement contexte utilisateur
      let enrichedUser;
      try {
        enrichedUser = authService.enrichUserContext(validation.decoded, req);
        enrichedUser.requestId = requestId;
      } catch (enrichError) {
        AuthUtilities.logAuthEvent('error', 'Erreur enrichissement contexte', {
          error: enrichError.message
        }, requestId);

        AuthUtilities.setSecurityHeaders(res, 'unauthenticated', 'jwt', requestId);
        AuthUtilities.sendUnauthorized(
          res,
          'CONTEXT_ENRICH_ERROR',
          'Erreur enrichissement contexte utilisateur',
          {},
          requestId
        );
        return;
      }

      // Assignation contexte
      req.user = enrichedUser;
      req.session = validation.session;

      // Headers sécurisés
      AuthUtilities.setSecurityHeaders(res, 'authenticated', 'jwt', requestId);

      // Chain of custody
      AuthUtilities.addChainOfCustody(req);

      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('success', 'AUTH OK', {
        userId: req.user.sub,
        duration: `${processingTime}ms`
      }, requestId);

      return next();
    } catch (error) {
      const processingTime = Date.now() - startTime;

      AuthUtilities.logAuthEvent('error', 'AUTH MIDDLEWARE EXCEPTION', {
        name: error.name,
        message: error.message,
        code: error.code,
        processingTime: `${processingTime}ms`,
        path: req.path,
        ip: req.ip,
        stack: !isProd ? error.stack : undefined
      }, requestId);

      if (res.headersSent) return;

      const errorPayload = {
        success: false,
        error: 'Erreur interne authentification',
        type: 'AUTH_MIDDLEWARE_ERROR',
        details: {
          processingTime: `${processingTime}ms`,
          errorMessage: error.message,
          errorName: error.name,
          errorCode: error.code
        },
        requestId,
        timestamp: new Date().toISOString()
      };

      res.status(500).json(errorPayload);
      return;
    }
  });

  // ✅ Authentification optionnelle
  static optionalAuth = asyncHandler(async (req, res, next) => {
    const requestId = AuthUtilities.generateRequestId(req);
    const token = AuthUtilities.extractBearerToken(req);

    if (!token) {
      AuthUtilities.logAuthEvent('debug', 'optionalAuth -> anonyme', {}, requestId);
      req.user = null;
      req.session = null;
      AuthUtilities.setSecurityHeaders(res, 'anonymous', 'none', requestId);
      return next();
    }

    AuthUtilities.logAuthEvent('debug', 'optionalAuth -> token présent', {}, requestId);
    return Ba7athAuthMiddleware.auth(req, res, next);
  });

  // ✅ Contrôle des rôles
  static requireRole = (roles) => {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    return asyncHandler(async (req, res, next) => {
      const requestId = req.requestId || AuthUtilities.generateRequestId(req);

      if (!req.user) {
        AuthUtilities.logAuthEvent('warn', 'Authentification requise pour rôle', {
          requiredRoles,
          path: req.path
        }, requestId);

        AuthUtilities.sendUnauthorized(
          res,
          'AUTHENTICATION_REQUIRED',
          'Authentification requise pour cette action',
          { requiredRoles },
          requestId
        );
        return;
      }

      const userRoles = Array.isArray(req.user.roles) ? req.user.roles :
                        (req.user.roles ? [req.user.roles] : []);

      const hasRole = requiredRoles.some(role => userRoles.includes(role));

      if (!hasRole) {
        AuthUtilities.logAuthEvent('warn', 'Permissions insuffisantes', {
          userId: req.user.sub,
          requiredRoles,
          userRoles,
          path: req.path
        }, requestId);

        if (res.headersSent) return;
        res.status(403).json({
          success: false,
          error: 'Permissions insuffisantes pour cette action',
          type: 'INSUFFICIENT_PERMISSIONS',
          required: requiredRoles,
          current: userRoles,
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      AuthUtilities.logAuthEvent('debug', 'Contrôle rôles OK', {
        userId: req.user.sub,
        matchedRoles: requiredRoles.filter(role => userRoles.includes(role))
      }, requestId);

      return next();
    });
  };

  // ✅ Contrôle mode de confidentialité
  static requirePrivacyMode = (allowedModes) => {
    const allowed = Array.isArray(allowedModes) ? allowedModes : [allowedModes];

    return (req, res, next) => {
      const requestId = req.requestId || AuthUtilities.generateRequestId(req);
      const currentMode = req.headers['x-privacy-mode'] ||
                          AUTH_CONFIG.privacy.defaultMode ||
                          'COMMERCIAL';

      if (!allowed.includes(currentMode)) {
        AuthUtilities.logAuthEvent('warn', 'Mode de confidentialité insuffisant', {
          currentMode,
          requiredModes: allowed,
          path: req.path,
          userId: req.user?.sub
        }, requestId);

        if (res.headersSent) return;
        res.status(403).json({
          success: false,
          error: 'Mode de confidentialité insuffisant pour cette action',
          type: 'PRIVACY_MODE_INSUFFICIENT',
          currentMode,
          requiredModes: allowed,
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      req.privacyMode = currentMode;
      if (!res.headersSent) {
        res.setHeader(AUTH_CONFIG.headers.privacyMode, currentMode);
      }

      AuthUtilities.logAuthEvent('debug', 'Privacy mode OK', {
        mode: currentMode,
        userId: req.user?.sub
      }, requestId);

      return next();
    };
  };

  // ✅ Logging forensique avec métriques
  static forensicLogging = (req, res, next) => {
    const requestId = req.requestId || AuthUtilities.generateRequestId(req);
    const startTime = Date.now();

    const originalSend = res.send.bind(res);
    res.send = function(body) {
      // Si déjà envoyé ailleurs, ne rien refaire
      if (res.headersSent) {
        try { return originalSend(body); } catch { return res; }
      }

      const processingTime = Date.now() - startTime;
      const responseSize = body ? Buffer.byteLength(body, 'utf8') : 0;

      const logData = {
        requestId,
        userId: req.user?.sub || 'anonymous',
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        processingTime: `${processingTime}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent')?.substring(0, AUTH_CONFIG.forensic.maxUserAgentLength),
        privacyMode: req.privacyMode,
        chainOfCustody: !!req.chainOfCustodyEntry
      };

      if (AUTH_CONFIG.forensic.logResponseSize) {
        logData.responseSize = responseSize;
      }

      AuthUtilities.logAuthEvent('info', 'API forensic access', logData, requestId);

      return originalSend(body);
    };

    return next();
  };
}

// =====================================
// EXPORT MODULAIRE
// =====================================
module.exports = {
  auth: Ba7athAuthMiddleware.auth,
  optionalAuth: Ba7athAuthMiddleware.optionalAuth,
  requireRole: Ba7athAuthMiddleware.requireRole,
  requirePrivacyMode: Ba7athAuthMiddleware.requirePrivacyMode,
  forensicLogging: Ba7athAuthMiddleware.forensicLogging,

  AuthUtilities,
  Ba7athAuthMiddleware,
  AUTH_CONFIG
};
