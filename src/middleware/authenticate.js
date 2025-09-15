// middleware/authentificate.js - VERSION OPTIMISÉE (intégrée avec config.js)
"use strict";

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Intégration config centralisée
const appConfig = require('../../config');

const isProd = process.env.NODE_ENV === 'production';

// =====================================
// CONFIGURATION CENTRALISÉE JWT
// =====================================
const JWT_CONFIG = {
  secrets: {
    // HS256: secret partagé | RS256: clé publique (si vous migrez plus tard)
    access: appConfig.jwt.secret,
    refresh: appConfig.jwt.refreshSecret
  },
  claims: {
    issuer: appConfig.jwt.issuer || 'ba7ath-auth',
    audience: appConfig.jwt.audience || 'ba7ath-api'
  },
  types: {
    access: 'access',
    refresh: 'refresh'
  },
  headers: {
    authenticate: 'WWW-Authenticate'
  },
  algorithms: [appConfig.jwt.algorithm || 'HS256'] // Algorithme explicitement whiteliste
};

// =====================================
// UTILITAIRES MODULAIRES
// =====================================
class JWTUtilities {
  // ✅ Extraction token Bearer améliorée
  static extractBearerToken(req) {
    const authHeader = req.headers.authorization || req.get?.('Authorization') || '';
    if (typeof authHeader !== 'string') return null;

    const normalized = authHeader.trim().replace(/\s+/g, ' ');
    if (normalized.toLowerCase().startsWith('bearer ')) {
      const token = normalized.slice(7).trim();
      return token || null;
    }
    return null;
  }

  // ✅ Validation structure JWT
  static isValidJWTFormat(token) {
    if (!token || typeof token !== 'string') return false;
    return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);
  }

  // ✅ Normalisation claims sécurisée
  static normalizeClaims(decoded) {
    return {
      _id: decoded.sub,
      sub: decoded.sub,
      roles: Array.isArray(decoded.roles)
        ? decoded.roles
        : (decoded.roles ? [decoded.roles] : []),
      scopes: Array.isArray(decoded.scopes)
        ? decoded.scopes
        : (decoded.scopes ? [decoded.scopes] : []),
      subscription: decoded.subscription,
      status: decoded.status,
      // Métadonnées token
      iat: decoded.iat,
      exp: decoded.exp,
      iss: decoded.iss,
      aud: decoded.aud,
      jti: decoded.jti,
      // Contexte sécurité
      tokenType: decoded.type || JWT_CONFIG.types.access
    };
  }

  // ✅ Headers d'erreur standardisés
  static setErrorHeaders(res, error = 'invalid_token', description = null) {
    let headerValue = `Bearer error="${error}"`;
    if (description) {
      headerValue += `, error_description="${description}"`;
    }
    res.setHeader(JWT_CONFIG.headers.authenticate, headerValue);
  }

  // ✅ Réponse d'erreur standardisée
  static sendAuthError(res, type = 'UNAUTHORIZED', message = 'Token invalide', details = {}, requestId = null) {
    const errorResponse = {
      success: false,
      error: message,
      type,
      details,
      requestId: requestId || crypto.randomBytes(8).toString('hex'),
      timestamp: new Date().toISOString()
    };
    return res.status(401).json(errorResponse);
  }

  // ✅ Logging structuré
  static logJWTEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;

    const logEntry = {
      level: level.toUpperCase(),
      message,
      requestId,
      timestamp: new Date().toISOString(),
      ...data
    };

    const icon = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅'
    }[level] || '📝';

    console.log(`${icon} JWT ${logEntry.level}:`, JSON.stringify(logEntry));
  }
}

// =====================================
// ASYNC HANDLER WRAPPER
// =====================================
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// =====================================
// MIDDLEWARE PRINCIPAL
// =====================================
const authenticate = asyncHandler(async (req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
  const startTime = Date.now();

  try {
    JWTUtilities.logJWTEvent('debug', 'JWT authentication start', {
      method: req.method,
      path: req.path,
      ip: req.ip
    }, requestId);

    // Extraction token
    const token = JWTUtilities.extractBearerToken(req);
    if (!token) {
      JWTUtilities.logJWTEvent('warn', 'Token absent', {
        authHeader: req.headers.authorization ? 'present' : 'absent'
      }, requestId);

      JWTUtilities.setErrorHeaders(res, 'invalid_token', 'Token Bearer requis');
      return JWTUtilities.sendAuthError(
        res,
        'MISSING_TOKEN',
        'Token d\'authentification requis',
        {},
        requestId
      );
    }

    // Validation format JWT
    if (!JWTUtilities.isValidJWTFormat(token)) {
      JWTUtilities.logJWTEvent('warn', 'Format JWT invalide', {
        tokenPrefix: token.substring(0, 20) + '...'
      }, requestId);

      JWTUtilities.setErrorHeaders(res, 'invalid_token', 'Format JWT invalide');
      return JWTUtilities.sendAuthError(
        res,
        'INVALID_TOKEN_FORMAT',
        'Format de token invalide',
        {},
        requestId
      );
    }

    // Validation JWT avec options strictes
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_CONFIG.secrets.access, {
        issuer: JWT_CONFIG.claims.issuer,
        audience: JWT_CONFIG.claims.audience,
        algorithms: JWT_CONFIG.algorithms
      });

      JWTUtilities.logJWTEvent('debug', 'JWT verified successfully', {
        sub: decoded.sub,
        iss: decoded.iss,
        aud: decoded.aud,
        exp: decoded.exp
      }, requestId);

    } catch (jwtError) {
      JWTUtilities.logJWTEvent('warn', 'JWT verification failed', {
        error: jwtError.name,
        message: jwtError.message
      }, requestId);

      let errorType = 'TOKEN_INVALID';
      let errorDescription = 'Token invalide';

      // Mapping erreurs JWT spécifiques
      switch (jwtError.name) {
        case 'TokenExpiredError':
          errorType = 'TOKEN_EXPIRED';
          errorDescription = 'Token expiré';
          break;
        case 'JsonWebTokenError':
          errorType = 'TOKEN_MALFORMED';
          errorDescription = 'Token mal formé';
          break;
        case 'NotBeforeError':
          errorType = 'TOKEN_NOT_ACTIVE';
          errorDescription = 'Token pas encore actif';
          break;
        default:
          errorType = 'TOKEN_INVALID';
          errorDescription = 'Token invalide';
      }

      JWTUtilities.setErrorHeaders(res, 'invalid_token', errorDescription);
      return JWTUtilities.sendAuthError(
        res,
        errorType,
        errorDescription,
        { jwtError: jwtError.name },
        requestId
      );
    }

    // Validation type de token
    if (decoded.type && decoded.type !== JWT_CONFIG.types.access) {
      JWTUtilities.logJWTEvent('warn', 'Type de token invalide', {
        expected: JWT_CONFIG.types.access,
        received: decoded.type,
        sub: decoded.sub
      }, requestId);

      JWTUtilities.setErrorHeaders(res, 'invalid_token', 'Type de token invalide');
      return JWTUtilities.sendAuthError(
        res,
        'INVALID_TOKEN_TYPE',
        'Type de token non autorisé pour cette opération',
        {
          expected: JWT_CONFIG.types.access,
          received: decoded.type
        },
        requestId
      );
    }

    // Normalisation et peuplement req.user
    req.user = JWTUtilities.normalizeClaims(decoded);
    req.user.requestId = requestId; // Propagation requestId

    // Métadonnées auth
    req.authContext = {
      method: 'jwt',
      tokenType: decoded.type || JWT_CONFIG.types.access,
      issuedAt: new Date(decoded.iat * 1000),
      expiresAt: new Date(decoded.exp * 1000),
      issuer: decoded.iss,
      audience: decoded.aud,
      jwtId: decoded.jti
    };

    const processingTime = Date.now() - startTime;

    JWTUtilities.logJWTEvent('success', 'Authentication successful', {
      userId: req.user.sub,
      roles: req.user.roles,
      tokenType: req.user.tokenType,
      processingTime: `${processingTime}ms`
    }, requestId);

    // Headers de succès
    res.setHeader('X-Auth-Status', 'authenticated');
    res.setHeader('X-Auth-Method', 'jwt');
    res.setHeader('X-Request-ID', requestId);

    next();

  } catch (error) {
    const processingTime = Date.now() - startTime;

    JWTUtilities.logJWTEvent('error', 'Authentication middleware error', {
      error: error.name,
      message: error.message,
      processingTime: `${processingTime}ms`,
      stack: !isProd ? error.stack : undefined
    }, requestId);

    JWTUtilities.setErrorHeaders(res, 'server_error', 'Erreur interne d\'authentification');
    return res.status(500).json({
      success: false,
      error: 'Erreur interne d\'authentification',
      type: 'AUTHENTICATION_ERROR',
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// MIDDLEWARES COMPLÉMENTAIRES
// =====================================
class Ba7athJWTMiddleware {
  // ✅ Authentification principale
  static authenticate = authenticate;

  // ✅ Validation token refresh
  static validateRefreshToken = asyncHandler(async (req, res, next) => {
    const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
    const token = JWTUtilities.extractBearerToken(req);

    if (!token) {
      JWTUtilities.setErrorHeaders(res, 'invalid_token', 'Token refresh requis');
      return JWTUtilities.sendAuthError(
        res,
        'MISSING_REFRESH_TOKEN',
        'Token de rafraîchissement requis',
        {},
        requestId
      );
    }

    try {
      const decoded = jwt.verify(token, JWT_CONFIG.secrets.refresh, {
        issuer: JWT_CONFIG.claims.issuer,
        audience: JWT_CONFIG.claims.audience,
        algorithms: JWT_CONFIG.algorithms
      });

      if (decoded.type !== JWT_CONFIG.types.refresh) {
        JWTUtilities.setErrorHeaders(res, 'invalid_token', 'Token refresh requis');
        return JWTUtilities.sendAuthError(
          res,
          'INVALID_TOKEN_TYPE',
          'Token de rafraîchissement requis',
          {},
          requestId
        );
      }

      req.user = JWTUtilities.normalizeClaims(decoded);
      req.user.requestId = requestId;

      JWTUtilities.logJWTEvent('success', 'Refresh token validated', {
        userId: req.user.sub
      }, requestId);

      next();

    } catch (error) {
      JWTUtilities.logJWTEvent('warn', 'Refresh token validation failed', {
        error: error.name
      }, requestId);

      JWTUtilities.setErrorHeaders(res, 'invalid_token', 'Token refresh invalide');
      return JWTUtilities.sendAuthError(
        res,
        'INVALID_REFRESH_TOKEN',
        'Token de rafraîchissement invalide',
        {},
        requestId
      );
    }
  });

  // ✅ Authentification optionnelle
  static optionalAuthenticate = asyncHandler(async (req, res, next) => {
    const token = JWTUtilities.extractBearerToken(req);
    const requestId = req.requestId || crypto.randomBytes(8).toString('hex');

    if (!token) {
      JWTUtilities.logJWTEvent('debug', 'Optional auth: no token provided', {}, requestId);
      req.user = null;
      res.setHeader('X-Auth-Status', 'anonymous');
      return next();
    }

    JWTUtilities.logJWTEvent('debug', 'Optional auth: token present', {}, requestId);
    return authenticate(req, res, next);
  });

  // ✅ Validation claims spécifiques
  static requireClaims = (requiredClaims = {}) => {
    return asyncHandler(async (req, res, next) => {
      const requestId = req.requestId || crypto.randomBytes(8).toString('hex');

      if (!req.user) {
        return JWTUtilities.sendAuthError(
          res,
          'AUTHENTICATION_REQUIRED',
          'Authentification requise',
          {},
          requestId
        );
      }

      // Validation des claims requis
      for (const [claim, expectedValue] of Object.entries(requiredClaims)) {
        const actualValue = req.user[claim];

        if (Array.isArray(expectedValue)) {
          if (!expectedValue.includes(actualValue)) {
            JWTUtilities.logJWTEvent('warn', 'Claim validation failed', {
              claim,
              expected: expectedValue,
              actual: actualValue,
              userId: req.user.sub
            }, requestId);

            return res.status(403).json({
              success: false,
              error: `Valeur de claim ${claim} insuffisante`,
              type: 'INSUFFICIENT_CLAIM',
              required: expectedValue,
              actual: actualValue,
              requestId,
              timestamp: new Date().toISOString()
            });
          }
        } else if (actualValue !== expectedValue) {
          JWTUtilities.logJWTEvent('warn', 'Claim validation failed', {
            claim,
            expected: expectedValue,
            actual: actualValue,
            userId: req.user.sub
          }, requestId);

          return res.status(403).json({
            success: false,
            error: `Valeur de claim ${claim} incorrecte`,
            type: 'INCORRECT_CLAIM',
            required: expectedValue,
            actual: actualValue,
            requestId,
            timestamp: new Date().toISOString()
          });
        }
      }

      JWTUtilities.logJWTEvent('debug', 'Claims validation successful', {
        validatedClaims: Object.keys(requiredClaims),
        userId: req.user.sub
      }, requestId);

      next();
    });
  };
}

// =====================================
// EXPORT MODULAIRE
// =====================================
module.exports = {
  // Middleware principal (compatible avec import simple)
  authenticate,

  // Suite complète de middlewares JWT
  Ba7athJWTMiddleware,

  // Utilitaires (pour tests et réutilisation)
  JWTUtilities,

  // Configuration (pour override si nécessaire)
  JWT_CONFIG
};
