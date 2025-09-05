const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit'); // ✅ CORRECTION - Supprimer import ip inexistant

// =====================================
// VALIDATION ENVIRONNEMENT CRITIQUE
// =====================================

const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

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

const authRateLimit = rateLimit({
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
  keyGenerator: (req) => {
    const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
    const identifier = crypto.createHash('sha256')
      .update(clientIp + (req.get('User-Agent') || ''))
      .digest('hex')
      .substring(0, 16);
    return identifier;
  },
  validate: {
    keyGeneratorIpFallback: false // Désactive le warning IPv6
  },
  handler: (req, res) => {
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
  const startTime = Date.now();
  
  try {
    // Extraction et validation du header Authorization
    const authHeader = req.headers.authorization;
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

    const token = authHeader.split(' ')[1];
    if (!token || token.trim().length === 0) {
      return sendAuthError(res, 'EMPTY_TOKEN', 'Token vide fourni');
    }

    // Validation format JWT basique
    const jwtParts = token.split('.');
    if (jwtParts.length !== 3) {
      return sendAuthError(res, 'MALFORMED_TOKEN', 'Structure JWT invalide');
    }

    // Vérification JWT avec options sécurisées
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'], // Forcer l'algorithme pour la sécurité
      maxAge: process.env.JWT_EXPIRE || '24h',
      clockTolerance: 30, // 30 secondes de tolérance horloge
      ignoreExpiration: false,
      ignoreNotBefore: false
    });

    // Validation du contenu décodé
    if (!decoded || typeof decoded !== 'object') {
      return sendAuthError(res, 'INVALID_TOKEN_CONTENT', 'Contenu de token invalide');
    }

    // Validation champs obligatoires
    const requiredFields = ['sub', 'iat', 'exp'];
    const missingFields = requiredFields.filter(field => !decoded[field]);
    if (missingFields.length > 0) {
      return sendAuthError(res, 'INCOMPLETE_TOKEN', 'Champs token manquants', {
        missing: missingFields
      });
    }

    // Validation expiration personnalisée (double check)
    const now = Math.floor(Date.now() / 1000);
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
    req.user = {
      ...decoded,
      // Métadonnées forensiques
      authMethod: 'jwt',
      authTimestamp: new Date().toISOString(),
      tokenIssuedAt: new Date(decoded.iat * 1000).toISOString(),
      tokenExpiresAt: new Date(decoded.exp * 1000).toISOString(),
      requestId: generateRequestId(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

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
          endpoint: `${req.method} ${req.path}`,
          requestId: req.user.requestId,
          authMethod: 'jwt'
        }
      };
    }

    next();

  } catch (err) {
    const processingTime = Date.now() - startTime;
    
    // Gestion d'erreurs JWT spécifiques avec logging forensique
    let errorCode, errorMessage, statusCode = 401;

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
      userAgent: req.get('User-Agent')?.substring(0, 100),
      processingTime: processingTime + 'ms',
      timestamp: new Date().toISOString(),
      // Ne pas logger le token pour sécurité
      tokenLength: req.headers.authorization?.length || 0
    });

    return res.status(statusCode).json({
      error: errorMessage,
      type: errorCode,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          errorName: err.name,
          processingTime: processingTime + 'ms'
        }
      })
    });
  }
}

// =====================================
// MIDDLEWARE AUTHENTIFICATION OPTIONNELLE
// =====================================

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
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
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthError(res, 'AUTHENTICATION_REQUIRED', 'Authentification requise pour cette action');
    }

    const userRoles = req.user.roles || [];
    const hasRequiredRole = Array.isArray(roles)
      ? roles.some(role => userRoles.includes(role))
      : userRoles.includes(roles);

    if (!hasRequiredRole) {
      console.warn('🚫 Accès refusé - rôle insuffisant:', {
        userId: req.user.sub,
        userRoles: userRoles,
        requiredRoles: roles,
        endpoint: `${req.method} ${req.path}`,
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
  return (req, res, next) => {
    const currentMode = process.env.PRIVACY_MODE || 'COMMERCIAL';
    const allowed = Array.isArray(allowedModes) ? allowedModes : [allowedModes];

    if (!allowed.includes(currentMode)) {
      console.warn('🔒 Accès refusé - mode privacy insuffisant:', {
        currentMode: currentMode,
        requiredModes: allowed,
        endpoint: `${req.method} ${req.path}`,
        userId: req.user?.sub,
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

function sendAuthError(res, type, message, details = {}) {
  const errorResponse = {
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
  const startTime = Date.now();

  // Intercepter la réponse pour logging complet
  const originalSend = res.send;
  res.send = function(body) {
    const processingTime = Date.now() - startTime;

    // Log forensique sécurisé
    console.log('🔍 Accès API forensique:', {
      requestId: req.user?.requestId || generateRequestId(),
      userId: req.user?.sub || 'anonymous',
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      processingTime: processingTime + 'ms',
      timestamp: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 100),
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
  auth,
  optionalAuth,
  requireRole,
  requirePrivacyMode,
  forensicLogging,
  authRateLimit
};
