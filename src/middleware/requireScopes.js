// middleware/requireScopes.js - VERSION OPTIMISÉE
"use strict";

const crypto = require('crypto');
// Réutilisation des utilitaires d'autorisation existants
const { AuthorizeUtilities } = require('./authorize');

const isProd = process.env.NODE_ENV === 'production';

// =====================================
// CONFIGURATION CENTRALISÉE
// =====================================
const SCOPES_CONFIG = {
  headers: {
    requiredScopes: 'X-Required-Scopes',
    userScopes: 'X-User-Scopes',
    matchedScopes: 'X-Matched-Scopes',
    missingScopes: 'X-Missing-Scopes',
    requestId: 'X-Request-ID'
  },
  defaults: {
    any: false,
    exposeHeaders: true,
    logChecks: true,
    strictMode: false
  },
  wildcard: {
    suffix: ':*',
    separator: ':'
  }
};

// =====================================
// UTILITAIRES SPÉCIALISÉS SCOPES
// =====================================
class ScopesUtilities {
  // Normalisation inputs robuste (compatible avec API existante)
  static normalizeInputs(args) {
    // Usage 1: requireScopes('scope1', 'scope2', 'scope3')
    // Usage 2: requireScopes({ scopes: ['scope1'], any: true, exposeHeaders: false })
    if (
      args.length === 1 &&
      typeof args[0] === 'object' &&
      !Array.isArray(args[0]) &&
      args[0] !== null
    ) {
      const options = args[0];
      return {
        scopes: AuthorizeUtilities.normalizeArray(options.scopes),
        any: Boolean(options.any || SCOPES_CONFIG.defaults.any),
        exposeHeaders: options.exposeHeaders !== false,
        logChecks: options.logChecks !== false,
        strictMode: Boolean(options.strictMode || SCOPES_CONFIG.defaults.strictMode)
      };
    }

    // Args multiples ou array direct
    const flatScopes = args.flat().filter(Boolean);
    return {
      scopes: flatScopes,
      any: SCOPES_CONFIG.defaults.any,
      exposeHeaders: SCOPES_CONFIG.defaults.exposeHeaders,
      logChecks: SCOPES_CONFIG.defaults.logChecks,
      strictMode: SCOPES_CONFIG.defaults.strictMode
    };
  }

  // Headers debug enrichis
  static setDebugHeaders(res, options, userScopes, validationResult) {
    if (!options.exposeHeaders || isProd) return;

    const { scopes: requiredScopes } = options;
    const { matched, missing } = validationResult;

    if (requiredScopes.length) {
      res.setHeader(SCOPES_CONFIG.headers.requiredScopes, requiredScopes.join(','));
      res.setHeader(SCOPES_CONFIG.headers.userScopes, userScopes.join(','));
    }
    if (matched.length) {
      res.setHeader(SCOPES_CONFIG.headers.matchedScopes, matched.join(','));
    }
    if (missing.length) {
      res.setHeader(SCOPES_CONFIG.headers.missingScopes, missing.join(','));
    }
  }

  // Logging spécialisé scopes
  static logScopesEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;

    const logEntry = {
      level: level.toUpperCase(),
      message,
      requestId,
      timestamp: new Date().toISOString(),
      component: 'REQUIRE_SCOPES',
      ...data
    };

    const icon = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' }[level] || '📝';
    console.log(`${icon} SCOPES ${logEntry.level}:`, JSON.stringify(logEntry));
  }

  // Réponse d'erreur enrichie
  static sendScopesError(res, details, requestId) {
    const errorResponse = {
      success: false,
      error: 'Accès refusé - scopes insuffisants',
      type: 'FORBIDDEN',
      reason: 'scope',
      details,
      requestId,
      timestamp: new Date().toISOString()
    };
    return res.status(403).json(errorResponse);
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
function createRequireScopesMiddleware(...args) {
  const options = ScopesUtilities.normalizeInputs(args);
  const { scopes: requiredScopes, any, exposeHeaders, logChecks, strictMode } = options;

  return asyncHandler(async (req, res, next) => {
    const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
    const startTime = Date.now();

    try {
      // Extraction scopes utilisateur
      const userScopes = Array.isArray(req.user?.scopes) ? req.user.scopes : [];
      const userId = req.user?.sub || req.user?._id || 'anonymous';

      if (logChecks) {
        ScopesUtilities.logScopesEvent('debug', 'Scopes check start', {
          userId,
          requiredScopes,
          userScopes: userScopes.slice(0, 10),
          any,
          strictMode
        }, requestId);
      }

      // Validation via AuthorizeUtilities (réutilisation)
      const validationResult = AuthorizeUtilities.validateScopes(requiredScopes, userScopes, any);
      const { valid, matched, missing } = validationResult;

      // Headers de debug
      ScopesUtilities.setDebugHeaders(res, options, userScopes, validationResult);

      // Si aucun scope requis, passer
      if (!requiredScopes.length) {
        if (logChecks) {
          ScopesUtilities.logScopesEvent('debug', 'No scopes required', { userId }, requestId);
        }
        return next();
      }

      if (!valid) {
        const failureDetails = {
          requiredScopes,
          userScopes: userScopes.slice(0, 20),
          matched,
          missing: missing.slice(0, 10),
          any,
          strictMode
        };

        if (logChecks) {
          ScopesUtilities.logScopesEvent('warn', 'Scopes authorization failed', {
            userId,
            processingTime: `${Date.now() - startTime}ms`,
            path: req.path,
            method: req.method,
            ...failureDetails
          }, requestId);
        }

        return ScopesUtilities.sendScopesError(res, failureDetails, requestId);
      }

      // Succès
      const processingTime = Date.now() - startTime;
      if (logChecks) {
        ScopesUtilities.logScopesEvent('success', 'Scopes authorization granted', {
          userId,
          matchedScopes: matched,
          processingTime: `${processingTime}ms`
        }, requestId);
      }

      // Headers de succès
      res.setHeader(SCOPES_CONFIG.headers.requestId, requestId);

      next();

    } catch (error) {
      const processingTime = Date.now() - startTime;

      ScopesUtilities.logScopesEvent('error', 'Scopes middleware error', {
        error: error.name,
        message: error.message,
        processingTime: `${processingTime}ms`,
        stack: !isProd ? error.stack : undefined
      }, requestId);

      return res.status(500).json({
        success: false,
        error: 'Erreur interne de vérification des scopes',
        type: 'SCOPES_ERROR',
        requestId,
        timestamp: new Date().toISOString()
      });
    }
  });
}

// =====================================
// MIDDLEWARES PRÊTS À L'EMPLOI
// =====================================
class Ba7athScopesMiddleware {
  // Factory principal
  static requireScopes = createRequireScopesMiddleware;

  // Scopes prédéfinis forensiques
  static requireForensicRead = () => createRequireScopesMiddleware({
    scopes: ['forensic:read', 'forensic:*'],
    any: true,
    logChecks: true
  });

  static requireForensicWrite = () => createRequireScopesMiddleware({
    scopes: ['forensic:write', 'forensic:*'],
    any: true,
    logChecks: true
  });

  static requireAnalysisScopes = () => createRequireScopesMiddleware({
    scopes: ['forensic:analysis', 'analysis:*', 'forensic:*'],
    any: true,
    logChecks: true
  });

  static requireReportsScopes = () => createRequireScopesMiddleware({
    scopes: ['forensic:reports', 'reports:*', 'forensic:*'],
    any: true,
    logChecks: true
  });

  static requireAdminScopes = () => createRequireScopesMiddleware({
    scopes: ['admin:*'],
    logChecks: true
  });

  // Patterns complexes
  static requireMultipleScopes = (scopes, mode = 'all') => createRequireScopesMiddleware({
    scopes,
    any: mode === 'any',
    strictMode: mode === 'strict',
    logChecks: true
  });

  // Scopes optionnels (pour APIs mixtes)
  static optionalScopes = (scopes, options = {}) => {
    const middleware = createRequireScopesMiddleware({
      scopes,
      ...options,
      logChecks: false
    });

    return asyncHandler(async (req, res, next) => {
      // Si pas d'utilisateur, passer sans vérification
      if (!req.user) {
        return next();
      }
      // Si utilisateur présent, appliquer vérification scopes
      return middleware(req, res, next);
    });
  };

  // Scopes dynamiques basés sur contexte
  static requireDynamicScopes = (scopesFunction) => {
    return asyncHandler(async (req, res, next) => {
      const dynamicScopes = await scopesFunction(req);
      const middleware = createRequireScopesMiddleware(dynamicScopes);
      return middleware(req, res, next);
    });
  };
}

// =====================================
// EXPORT MODULAIRE
// =====================================
module.exports = {
  requireScopes: createRequireScopesMiddleware,
  Ba7athScopesMiddleware,
  ScopesUtilities,
  SCOPES_CONFIG,
  default: createRequireScopesMiddleware
};
