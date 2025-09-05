"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var rateLimit = require('express-rate-limit'); // ✅ CORRECTION - Supprimer import ip inexistant

// =====================================
// VALIDATION ENVIRONNEMENT CRITIQUE
// =====================================

var requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
var missingVars = requiredEnvVars.filter(function (varName) {
  return !process.env[varName];
});
if (missingVars.length > 0) {
  console.error('❌ Variables JWT manquantes:', missingVars.join(', '));
  process.exit(1);
}

// Validation sécurité des secrets
if (process.env.JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET doit faire au moins 32 caractères');
  process.exit(1);
}

// =====================================
// RATE LIMITING SPÉCIALISÉ FORENSIQUE - ✅ CORRIGÉ IPv6
// =====================================

var authRateLimit = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_FORENSIC_WINDOW_MINUTES) || 5) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_FORENSIC_MAX_REQUESTS) || 10,
  message: {
    error: 'Trop de tentatives d\'authentification',
    retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_FORENSIC_WINDOW_MINUTES) || 5) * 60),
    forensicNote: 'Accès aux fonctions forensiques limité pour sécurité'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // ✅ CORRECTION IPv6 - Utiliser req.ip directement au lieu de ip() inexistant
  keyGenerator: function keyGenerator(req) {
    var clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
    var identifier = crypto.createHash('sha256').update(clientIp + (req.get('User-Agent') || '')).digest('hex').substring(0, 16);
    return identifier;
  },
  validate: {
    keyGeneratorIpFallback: false // Désactive le warning IPv6
  },
  handler: function handler(req, res) {
    console.warn('🚨 Rate limit auth dépassé:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path,
      timestamp: new Date().toISOString(),
      method: req.method
    });
    res.status(429).json({
      error: 'Trop de tentatives d\'authentification',
      type: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_FORENSIC_WINDOW_MINUTES) || 5) * 60),
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// FONCTION D'AUTHENTIFICATION PRINCIPALE
// =====================================

function auth(req, res, next) {
  var startTime = Date.now();
  try {
    // Extraction et validation du header Authorization
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendAuthError(res, 'TOKEN_MISSING', 'Header Authorization manquant', {
        expected: 'Bearer <token>',
        received: 'none'
      });
    }
    if (!authHeader.startsWith('Bearer ')) {
      return sendAuthError(res, 'INVALID_TOKEN_FORMAT', 'Format de token invalide', {
        expected: 'Bearer <token>',
        received: authHeader.substring(0, 20) + '...'
      });
    }
    var token = authHeader.split(' ')[1];
    if (!token || token.trim().length === 0) {
      return sendAuthError(res, 'EMPTY_TOKEN', 'Token vide fourni');
    }

    // Validation format JWT basique
    var jwtParts = token.split('.');
    if (jwtParts.length !== 3) {
      return sendAuthError(res, 'MALFORMED_TOKEN', 'Structure JWT invalide');
    }

    // Vérification JWT avec options sécurisées
    var decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      // Forcer l'algorithme pour la sécurité
      maxAge: process.env.JWT_EXPIRE || '24h',
      clockTolerance: 30,
      // 30 secondes de tolérance horloge
      ignoreExpiration: false,
      ignoreNotBefore: false
    });

    // Validation du contenu décodé
    if (!decoded || _typeof(decoded) !== 'object') {
      return sendAuthError(res, 'INVALID_TOKEN_CONTENT', 'Contenu de token invalide');
    }

    // Validation champs obligatoires
    var requiredFields = ['sub', 'iat', 'exp'];
    var missingFields = requiredFields.filter(function (field) {
      return !decoded[field];
    });
    if (missingFields.length > 0) {
      return sendAuthError(res, 'INCOMPLETE_TOKEN', 'Champs token manquants', {
        missing: missingFields
      });
    }

    // Validation expiration personnalisée (double check)
    var now = Math.floor(Date.now() / 1000);
    if (decoded.exp <= now) {
      return sendAuthError(res, 'TOKEN_EXPIRED', 'Token expiré', {
        expiredAt: new Date(decoded.exp * 1000).toISOString(),
        currentTime: new Date().toISOString()
      });
    }

    // Validation jti (JWT ID) si présent pour éviter replay attacks
    if (decoded.jti && !isValidJti(decoded.jti)) {
      return sendAuthError(res, 'INVALID_JTI', 'JWT ID invalide ou révoqué');
    }

    // Enrichir req.user avec données décodées et métadonnées forensiques
    req.user = _objectSpread(_objectSpread({}, decoded), {}, {
      // Métadonnées forensiques
      authMethod: 'jwt',
      authTimestamp: new Date().toISOString(),
      tokenIssuedAt: new Date(decoded.iat * 1000).toISOString(),
      tokenExpiresAt: new Date(decoded.exp * 1000).toISOString(),
      requestId: generateRequestId(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Headers de sécurité forensique
    res.setHeader('X-Auth-Status', 'authenticated');
    res.setHeader('X-Auth-Method', 'jwt');
    res.setHeader('X-Request-Id', req.user.requestId);
    res.setHeader('X-Auth-Timestamp', req.user.authTimestamp);

    // Logging réussite authentification (sans données sensibles)
    console.log('✅ Authentification réussie:', {
      userId: decoded.sub,
      requestId: req.user.requestId,
      ip: req.ip,
      path: req.path,
      method: req.method,
      authDuration: Date.now() - startTime + 'ms',
      timestamp: new Date().toISOString()
    });

    // Chain of custody pour accès forensique
    if (req.path.includes('/api/analysis') || req.path.includes('/api/reports')) {
      req.chainOfCustodyEntry = {
        action: 'API_ACCESS',
        performedBy: decoded.sub || 'unknown',
        timestamp: new Date(),
        details: {
          endpoint: "".concat(req.method, " ").concat(req.path),
          requestId: req.user.requestId,
          authMethod: 'jwt'
        }
      };
    }
    next();
  } catch (err) {
    var _req$get, _req$headers$authoriz;
    var processingTime = Date.now() - startTime;

    // Gestion d'erreurs JWT spécifiques avec logging forensique
    var errorCode,
      errorMessage,
      statusCode = 401;
    switch (err.name) {
      case 'TokenExpiredError':
        errorCode = 'TOKEN_EXPIRED';
        errorMessage = 'Token JWT expiré';
        break;
      case 'JsonWebTokenError':
        errorCode = 'MALFORMED_TOKEN';
        errorMessage = 'Token JWT malformé ou invalide';
        break;
      case 'NotBeforeError':
        errorCode = 'TOKEN_NOT_ACTIVE';
        errorMessage = 'Token pas encore actif (nbf)';
        break;
      default:
        errorCode = 'AUTH_ERROR';
        errorMessage = 'Erreur d\'authentification';
        statusCode = 500;
    }

    // Logging sécurisé des tentatives échouées
    console.warn('⚠️ Tentative d\'authentification échouée:', {
      errorCode: errorCode,
      errorName: err.name,
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: (_req$get = req.get('User-Agent')) === null || _req$get === void 0 ? void 0 : _req$get.substring(0, 100),
      processingTime: processingTime + 'ms',
      timestamp: new Date().toISOString(),
      // Ne pas logger le token pour sécurité
      tokenLength: ((_req$headers$authoriz = req.headers.authorization) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.length) || 0
    });
    return res.status(statusCode).json(_objectSpread({
      error: errorMessage,
      type: errorCode,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId()
    }, process.env.NODE_ENV === 'development' && {
      debug: {
        errorName: err.name,
        processingTime: processingTime + 'ms'
      }
    }));
  }
}

// =====================================
// MIDDLEWARE AUTHENTIFICATION OPTIONNELLE
// =====================================

function optionalAuth(req, res, next) {
  var authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // Pas d'authentification, continuer sans user
    req.user = null;
    res.setHeader('X-Auth-Status', 'anonymous');
    return next();
  }

  // Utiliser l'auth normale si token présent
  auth(req, res, next);
}

// =====================================
// MIDDLEWARE VÉRIFICATION RÔLES FORENSIQUES
// =====================================

function requireRole(roles) {
  return function (req, res, next) {
    if (!req.user) {
      return sendAuthError(res, 'AUTHENTICATION_REQUIRED', 'Authentification requise pour cette action');
    }
    var userRoles = req.user.roles || [];
    var hasRequiredRole = Array.isArray(roles) ? roles.some(function (role) {
      return userRoles.includes(role);
    }) : userRoles.includes(roles);
    if (!hasRequiredRole) {
      console.warn('🚫 Accès refusé - rôle insuffisant:', {
        userId: req.user.sub,
        userRoles: userRoles,
        requiredRoles: roles,
        endpoint: "".concat(req.method, " ").concat(req.path),
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
      return res.status(403).json({
        error: 'Permissions insuffisantes',
        type: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: userRoles,
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
}

// =====================================
// MIDDLEWARE VALIDATION PRIVACY MODE
// =====================================

function requirePrivacyMode(allowedModes) {
  return function (req, res, next) {
    var currentMode = process.env.PRIVACY_MODE || 'COMMERCIAL';
    var allowed = Array.isArray(allowedModes) ? allowedModes : [allowedModes];
    if (!allowed.includes(currentMode)) {
      var _req$user;
      console.warn('🔒 Accès refusé - mode privacy insuffisant:', {
        currentMode: currentMode,
        requiredModes: allowed,
        endpoint: "".concat(req.method, " ").concat(req.path),
        userId: (_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.sub,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
      return res.status(403).json({
        error: 'Mode de confidentialité insuffisant',
        type: 'PRIVACY_MODE_INSUFFICIENT',
        currentMode: currentMode,
        requiredModes: allowed,
        timestamp: new Date().toISOString()
      });
    }

    // Ajouter mode privacy au context
    req.privacyMode = currentMode;
    res.setHeader('X-Privacy-Mode', currentMode);
    next();
  };
}

// =====================================
// FONCTIONS UTILITAIRES
// =====================================

function sendAuthError(res, type, message) {
  var details = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var errorResponse = {
    error: message,
    type: type,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId()
  };
  if (Object.keys(details).length > 0) {
    errorResponse.details = details;
  }
  return res.status(401).json(errorResponse);
}
function generateRequestId() {
  return crypto.randomBytes(8).toString('hex');
}
function isValidJti(jti) {
  // Vérifier si le JTI est dans une blacklist (Redis recommandé en production)
  // Pour l'instant, validation basique du format
  return /^[a-f0-9-]{8,}$/.test(jti);
}

// =====================================
// MIDDLEWARE LOGGING FORENSIQUE
// =====================================

function forensicLogging(req, res, next) {
  var startTime = Date.now();

  // Intercepter la réponse pour logging complet
  var originalSend = res.send;
  res.send = function (body) {
    var _req$user2, _req$user3, _req$get2;
    var processingTime = Date.now() - startTime;

    // Log forensique sécurisé
    console.log('🔍 Accès API forensique:', {
      requestId: ((_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.requestId) || generateRequestId(),
      userId: ((_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.sub) || 'anonymous',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      processingTime: processingTime + 'ms',
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: (_req$get2 = req.get('User-Agent')) === null || _req$get2 === void 0 ? void 0 : _req$get2.substring(0, 100),
      // Pas de body pour éviter fuite de données
      responseSize: body ? Buffer.byteLength(body, 'utf8') : 0
    });
    originalSend.call(this, body);
  };
  next();
}

// =====================================
// EXPORTS
// =====================================

module.exports = {
  auth: auth,
  optionalAuth: optionalAuth,
  requireRole: requireRole,
  requirePrivacyMode: requirePrivacyMode,
  forensicLogging: forensicLogging,
  authRateLimit: authRateLimit
};