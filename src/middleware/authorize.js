// middleware/authorize.js - VERSION OPTIMISÉE
"use strict";

const crypto = require('crypto');

const isProd = process.env.NODE_ENV === 'production';

// =====================================
// CONFIGURATION CENTRALISÉE
// =====================================
const AUTHORIZE_CONFIG = {
  headers: {
    requiredScopes: 'X-Required-Scopes',
    requiredRoles: 'X-Required-Roles',
    userScopes: 'X-User-Scopes',
    userRoles: 'X-User-Roles',
    requestId: 'X-Request-ID'
  },
  defaults: {
    anyScopes: false,
    exposeHeaders: true,
    logFailures: true,
    strictMode: false // Mode strict : toutes conditions requises
  },
  wildcard: {
    suffix: ':*',
    separator: ':'
  }
};

// =====================================
// UTILITAIRES MODULAIRES
// =====================================
class AuthorizeUtilities {
  static normalizeOptions(options = {}) {
    return {
      scopes: this.normalizeArray(options.scopes),
      roles: this.normalizeArray(options.roles),
      anyScopes: Boolean(options.anyScopes || AUTHORIZE_CONFIG.defaults.anyScopes),
      exposeHeaders: options.exposeHeaders !== false,
      logFailures: options.logFailures !== false,
      strictMode: Boolean(options.strictMode || AUTHORIZE_CONFIG.defaults.strictMode)
    };
  }

  static normalizeArray(input) {
    if (Array.isArray(input)) return input.filter(Boolean);
    if (input && typeof input === 'string') return [input];
    return [];
  }

  static matchScope(requiredScope, userScopes) {
    if (!requiredScope || !Array.isArray(userScopes)) return false;
    if (requiredScope.endsWith(AUTHORIZE_CONFIG.wildcard.suffix)) {
      const prefix = requiredScope.slice(0, -AUTHORIZE_CONFIG.wildcard.suffix.length);
      return userScopes.some(scope =>
        typeof scope === 'string' &&
        scope.startsWith(prefix + AUTHORIZE_CONFIG.wildcard.separator)
      );
    }
    return userScopes.includes(requiredScope);
  }

  static validateScopes(requiredScopes, userScopes, anyScopes = false) {
    if (!requiredScopes.length) return { valid: true, matched: [], missing: [] };
    if (!Array.isArray(userScopes) || userScopes.length === 0) {
      return { valid: false, matched: [], missing: requiredScopes };
    }
    const matched = [];
    const missing = [];
    requiredScopes.forEach(requiredScope => {
      if (this.matchScope(requiredScope, userScopes)) {
        matched.push(requiredScope);
      } else {
        missing.push(requiredScope);
      }
    });
    const valid = anyScopes ? matched.length > 0 : missing.length === 0;
    return { valid, matched, missing };
  }

  static validateRoles(requiredRoles, userRoles) {
    if (!requiredRoles.length) return { valid: true, matched: [], missing: [] };
    if (!Array.isArray(userRoles) || userRoles.length === 0) {
      return { valid: false, matched: [], missing: requiredRoles };
    }
    const normalizedUserRoles = userRoles.map(String);
    const matched = [];
    const missing = [];
    requiredRoles.forEach(requiredRole => {
      const roleStr = String(requiredRole);
      if (normalizedUserRoles.includes(roleStr)) {
        matched.push(requiredRole);
      } else {
        missing.push(requiredRole);
      }
    });
    return {
      valid: matched.length > 0,
      matched,
      missing: matched.length > 0 ? [] : missing
    };
  }

  static setDebugHeaders(res, options, userContext, validationResults) {
    if (!options.exposeHeaders || isProd) return;
    const { requiredScopes, requiredRoles } = options;
    const { userScopes, userRoles } = userContext;
    const { scopesResult, rolesResult } = validationResults;

    if (requiredScopes.length) {
      res.setHeader(AUTHORIZE_CONFIG.headers.requiredScopes, requiredScopes.join(','));
      res.setHeader(AUTHORIZE_CONFIG.headers.userScopes, userScopes.join(','));
    }
    if (requiredRoles.length) {
      res.setHeader(AUTHORIZE_CONFIG.headers.requiredRoles, requiredRoles.join(','));
      res.setHeader(AUTHORIZE_CONFIG.headers.userRoles, userRoles.map(String).join(','));
    }
    if (scopesResult.matched.length) {
      res.setHeader('X-Matched-Scopes', scopesResult.matched.join(','));
    }
    if (scopesResult.missing.length) {
      res.setHeader('X-Missing-Scopes', scopesResult.missing.join(','));
    }
    if (rolesResult.matched.length) {
      res.setHeader('X-Matched-Roles', rolesResult.matched.join(','));
    }
    if (rolesResult.missing.length) {
      res.setHeader('X-Missing-Roles', rolesResult.missing.join(','));
    }
  }

  static logAuthorizationEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;
    const logEntry = {
      level: level.toUpperCase(),
      message,
      requestId,
      timestamp: new Date().toISOString(),
      component: 'AUTHORIZE',
      ...data
    };
    const icon = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' }[level] || '📝';
    console.log(`${icon} AUTH ${logEntry.level}:`, JSON.stringify(logEntry));
  }

  static sendForbiddenError(res, reason, details, requestId) {
    const errorResponse = {
      success: false,
      error: 'Accès refusé - autorisations insuffisantes',
      type: 'FORBIDDEN',
      reason,
      details,
      requestId,
      timestamp: new Date().toISOString()
    };
    return res.status(403).json(errorResponse);
  }

  static extractUserContext(req) {
    return {
      userId: req.user?.sub || req.user?._id || 'anonymous',
      userScopes: Array.isArray(req.user?.scopes) ? req.user.scopes : [],
      userRoles: Array.isArray(req.user?.roles) ? req.user.roles : [],
      subscription: req.user?.subscription,
      status: req.user?.status
    };
  }
}

// =====================================
// ASYNC HANDLER WRAPPER
// =====================================
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// =====================================
// FACTORY MIDDLEWARE PRINCIPAL
// =====================================
function createAuthorizeMiddleware(options = {}) {
  const normalizedOptions = AuthorizeUtilities.normalizeOptions(options);
  const { scopes: requiredScopes, roles: requiredRoles, anyScopes, exposeHeaders, logFailures, strictMode } = normalizedOptions;

  return asyncHandler(async (req, res, next) => {
    const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
    const startTime = Date.now();

    try {
      const userContext = AuthorizeUtilities.extractUserContext(req);
      const { userId, userScopes, userRoles } = userContext;

      AuthorizeUtilities.logAuthorizationEvent('debug', 'Authorization check start', {
        userId,
        requiredScopes,
        requiredRoles,
        userScopes: userScopes.slice(0, 10),
        userRoles: userRoles.slice(0, 10),
        anyScopes,
        strictMode
      }, requestId);

      const scopesResult = AuthorizeUtilities.validateScopes(requiredScopes, userScopes, anyScopes);
      const rolesResult = AuthorizeUtilities.validateRoles(requiredRoles, userRoles);

      const scopesValid = scopesResult.valid;
      const rolesValid = rolesResult.valid;
      const isAuthorized = strictMode
        ? (scopesValid && rolesValid)
        : (scopesValid || rolesValid || (!requiredScopes.length && !requiredRoles.length));

      AuthorizeUtilities.setDebugHeaders(res, normalizedOptions, userContext, { scopesResult, rolesResult });

      if (!isAuthorized) {
        const failureReason = !scopesValid && !rolesValid ? 'scope_and_role' :
                              !scopesValid ? 'scope' : 'role';

        const failureDetails = {
          requiredScopes,
          requiredRoles,
          userScopes: userScopes.slice(0, 20),
          userRoles: userRoles.slice(0, 20),
          scopesResult: {
            valid: scopesResult.valid,
            matched: scopesResult.matched,
            missing: scopesResult.missing.slice(0, 10)
          },
          rolesResult: {
            valid: rolesResult.valid,
            matched: rolesResult.matched,
            missing: rolesResult.missing.slice(0, 10)
          },
          anyScopes,
          strictMode
        };

        if (logFailures) {
          AuthorizeUtilities.logAuthorizationEvent('warn', 'Authorization failed', {
            userId,
            reason: failureReason,
            processingTime: `${Date.now() - startTime}ms`,
            path: req.path,
            method: req.method,
            ...failureDetails
          }, requestId);
        }

        return AuthorizeUtilities.sendForbiddenError(res, failureReason, failureDetails, requestId);
      }

      const processingTime = Date.now() - startTime;
      AuthorizeUtilities.logAuthorizationEvent('success', 'Authorization granted', {
        userId,
        matchedScopes: scopesResult.matched,
        matchedRoles: rolesResult.matched,
        processingTime: `${processingTime}ms`
      }, requestId);

      res.setHeader(AUTHORIZE_CONFIG.headers.requestId, requestId);
      next();

    } catch (error) {
      const processingTime = Date.now() - startTime;

      AuthorizeUtilities.logAuthorizationEvent('error', 'Authorization middleware error', {
        error: error.name,
        message: error.message,
        processingTime: `${processingTime}ms`,
        stack: !isProd ? error.stack : undefined
      }, requestId);

      return res.status(500).json({
        success: false,
        error: 'Erreur interne d\'autorisation',
        type: 'AUTHORIZATION_ERROR',
        requestId,
        timestamp: new Date().toISOString()
      });
    }
  });
}

// =====================================
// MIDDLEWARES PRÊTS À L'EMPLOI
// =====================================
class Ba7athAuthorizeMiddleware {
  static authorize = createAuthorizeMiddleware;

  static requireForensicAnalyst = () => createAuthorizeMiddleware({
    roles: ['forensic_analyst', 'expert', 'admin'],
    logFailures: true
  });

  static requireAdmin = () => createAuthorizeMiddleware({
    roles: ['admin'],
    logFailures: true
  });

  static requireExpert = () => createAuthorizeMiddleware({
    roles: ['expert', 'admin'],
    logFailures: true
  });

  static requireForensicScope = (specificScope = null) => createAuthorizeMiddleware({
    scopes: specificScope ? [specificScope] : ['forensic:*'],
    logFailures: true
  });

  static requireAnalysisScope = () => createAuthorizeMiddleware({
    scopes: ['forensic:analysis', 'forensic:*'],
    anyScopes: true,
    logFailures: true
  });

  static requireReportsScope = () => createAuthorizeMiddleware({
    scopes: ['forensic:reports', 'forensic:*'],
    anyScopes: true,
    logFailures: true
  });

  static requireForensicAnalystWithScope = (scope = 'forensic:*') => createAuthorizeMiddleware({
    roles: ['forensic_analyst', 'expert', 'admin'],
    scopes: [scope],
    strictMode: true,
    logFailures: true
  });

  static optionalAuthorize = (options = {}) => {
    const middleware = createAuthorizeMiddleware({
      ...options,
      logFailures: false
    });

    return asyncHandler(async (req, res, next) => {
      if (!req.user) {
        return next();
      }
      return middleware(req, res, next);
    });
  };
}

// =====================================
// EXPORT MODULAIRE
// =====================================
module.exports = {
  authorize: createAuthorizeMiddleware,
  Ba7athAuthorizeMiddleware,
  AuthorizeUtilities,
  AUTHORIZE_CONFIG,
  default: createAuthorizeMiddleware
};
