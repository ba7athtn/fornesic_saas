"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var _require = require('express-validator'),
  body = _require.body,
  param = _require.param,
  query = _require.query,
  validationResult = _require.validationResult;
var path = require('path');
var mongoose = require('mongoose');
var sanitizeHtml = require('sanitize-html');

// =====================================
// GESTION D'ERREURS DE VALIDATION
// =====================================

var handleValidationErrors = function handleValidationErrors(req, res, next) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errorFields = {};
    errors.array().forEach(function (error) {
      errorFields[error.path] = error.msg;
    });
    var validationError = new Error('Données de validation invalides');
    validationError.type = 'VALIDATION_ERROR';
    validationError.status = 400;
    validationError.fields = errorFields;
    return next(validationError);
  }
  next();
};

// =====================================
// VALIDATIONS AUTHENTIFICATION
// =====================================

var validateAuth = {
  // Validation inscription
  registration: [body('email').isEmail().withMessage('Email invalide').normalizeEmail().isLength({
    max: 255
  }).withMessage('Email trop long'), body('password').isLength({
    min: 8
  }).withMessage('Mot de passe trop court (minimum 8 caractères)').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'), body('confirmPassword').custom(function (value, _ref) {
    var req = _ref.req;
    if (value !== req.body.password) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  }), body('firstName').trim().isLength({
    min: 2,
    max: 50
  }).withMessage('Prénom requis (2-50 caractères)').matches(/^[a-zA-ZÀ-ÿ\s-']+$/).withMessage('Prénom contient des caractères invalides'), body('lastName').trim().isLength({
    min: 2,
    max: 50
  }).withMessage('Nom requis (2-50 caractères)').matches(/^[a-zA-ZÀ-ÿ\s-']+$/).withMessage('Nom contient des caractères invalides'), body('organization').optional().trim().isLength({
    max: 100
  }).withMessage('Organisation trop longue (max 100 caractères)'), body('acceptTerms').equals('true').withMessage('Vous devez accepter les conditions d\'utilisation'), handleValidationErrors],
  // Validation connexion
  login: [body('email').isEmail().withMessage('Email invalide').normalizeEmail(), body('password').notEmpty().withMessage('Mot de passe requis'), body('rememberMe').optional().isBoolean().withMessage('Remember me doit être un booléen'), handleValidationErrors],
  // Validation refresh token
  refreshToken: [body('refreshToken').notEmpty().withMessage('Refresh token requis').isJWT().withMessage('Format de refresh token invalide'), handleValidationErrors],
  // Validation token de vérification
  verificationToken: [param('token').isLength({
    min: 32,
    max: 128
  }).withMessage('Token de vérification invalide').matches(/^[a-f0-9]+$/).withMessage('Format de token invalide'), handleValidationErrors],
  // Validation email seul
  email: [body('email').isEmail().withMessage('Email invalide').normalizeEmail(), handleValidationErrors],
  // Validation reset password
  passwordReset: [param('token').isLength({
    min: 32,
    max: 128
  }).withMessage('Token de réinitialisation invalide'), body('password').isLength({
    min: 8
  }).withMessage('Mot de passe trop court (minimum 8 caractères)').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'), body('confirmPassword').custom(function (value, _ref2) {
    var req = _ref2.req;
    if (value !== req.body.password) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  }), handleValidationErrors],
  // Validation changement mot de passe
  passwordChange: [body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'), body('newPassword').isLength({
    min: 8
  }).withMessage('Nouveau mot de passe trop court (minimum 8 caractères)').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'), body('confirmPassword').custom(function (value, _ref3) {
    var req = _ref3.req;
    if (value !== req.body.newPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }
    return true;
  }), body('currentPassword').custom(function (value, _ref4) {
    var req = _ref4.req;
    if (value === req.body.newPassword) {
      throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
    }
    return true;
  }), handleValidationErrors]
};

// =====================================
// VALIDATION UPLOAD FORENSIQUE CORRIGÉE
// =====================================

function validateForensicUpload(req, res, next) {
  var startTime = Date.now();
  try {
    // Vérification présence fichiers
    var hasFile = req.file || req.files && req.files.length > 0;
    if (!hasFile) {
      return res.status(400).json({
        error: 'Aucun fichier fourni pour analyse forensique',
        type: 'MISSING_FILES',
        details: 'Au moins un fichier image est requis',
        expectedFields: ['image', 'images'],
        timestamp: new Date().toISOString()
      });
    }

    // Normaliser vers array
    var files = req.files || (req.file ? [req.file] : []);
    var validationErrors = [];
    var warnings = [];

    // Configuration limites
    var maxSize = parseInt(process.env.MULTER_FILE_SIZE) || 524288000; // 500MB
    var maxFiles = parseInt(process.env.MAX_FILES_PER_REQUEST) || 10;

    // Validation nombre de fichiers
    if (files.length > maxFiles) {
      return res.status(400).json({
        error: "Trop de fichiers (".concat(files.length, "/").concat(maxFiles, ")"),
        type: 'TOO_MANY_FILES',
        maxAllowed: maxFiles,
        received: files.length,
        timestamp: new Date().toISOString()
      });
    }

    // Validation individuelle des fichiers
    var totalSize = 0;
    files.forEach(function (file, index) {
      if (!file) {
        validationErrors.push({
          fileIndex: index,
          error: 'Fichier vide ou manquant',
          type: 'EMPTY_FILE'
        });
        return;
      }

      // Validation taille
      if (file.size > maxSize) {
        validationErrors.push({
          fileIndex: index,
          filename: file.originalname,
          error: "Fichier trop volumineux: ".concat(formatBytes(file.size), " > ").concat(formatBytes(maxSize)),
          type: 'FILE_TOO_LARGE',
          actualSize: file.size,
          maxSize: maxSize
        });
      }

      // Fichier vide
      if (file.size === 0) {
        validationErrors.push({
          fileIndex: index,
          filename: file.originalname,
          error: 'Fichier vide détecté',
          type: 'ZERO_SIZE_FILE'
        });
      }

      // Validation nom fichier forensique
      var nameValidation = validateForensicFilename(file.originalname);
      if (!nameValidation.valid) {
        validationErrors.push({
          fileIndex: index,
          filename: file.originalname,
          error: "Nom de fichier invalide: ".concat(nameValidation.reason),
          type: 'INVALID_FILENAME',
          details: nameValidation
        });
      }

      // Extension vs MIME cohérence
      var ext = path.extname(file.originalname).slice(1).toLowerCase();
      var mimeValidation = validateMimeExtensionCoherence(ext, file.mimetype);
      if (!mimeValidation.coherent) {
        validationErrors.push({
          fileIndex: index,
          filename: file.originalname,
          error: "Incoh\xE9rence format: .".concat(ext, " vs ").concat(file.mimetype),
          type: 'MIME_EXTENSION_MISMATCH',
          extension: ext,
          mimetype: file.mimetype,
          expected: mimeValidation.expected
        });
      }

      // Vérifications forensiques spécialisées
      var forensicChecks = performForensicChecks(file);
      if (forensicChecks.warnings.length > 0) {
        warnings.push.apply(warnings, _toConsumableArray(forensicChecks.warnings.map(function (w) {
          return _objectSpread({
            fileIndex: index,
            filename: file.originalname
          }, w);
        })));
      }
      totalSize += file.size;
    });

    // Validation taille totale
    var maxTotalSize = maxSize * files.length;
    if (totalSize > maxTotalSize) {
      validationErrors.push({
        error: "Taille totale excessive: ".concat(formatBytes(totalSize), " > ").concat(formatBytes(maxTotalSize)),
        type: 'TOTAL_SIZE_EXCEEDED',
        totalSize: totalSize,
        maxTotalSize: maxTotalSize
      });
    }

    // Retourner erreurs si présentes
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: 'Validation forensique échouée',
        type: 'FORENSIC_VALIDATION_FAILED',
        summary: "".concat(validationErrors.length, " erreur(s) d\xE9tect\xE9e(s)"),
        validationErrors: validationErrors,
        warnings: warnings,
        processingTime: Date.now() - startTime + 'ms',
        timestamp: new Date().toISOString()
      });
    }

    // Enrichir metadata de validation
    req.forensicValidation = {
      filesCount: files.length,
      totalSize: totalSize,
      averageSize: Math.round(totalSize / files.length),
      validatedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      warnings: warnings,
      securityLevel: calculateSecurityLevel(files, warnings)
    };

    // Logging forensique
    console.log("\u2705 Validation forensique r\xE9ussie:", {
      files: files.length,
      totalSize: formatBytes(totalSize),
      warnings: warnings.length,
      processingTime: Date.now() - startTime + 'ms',
      securityLevel: req.forensicValidation.securityLevel
    });
    next();
  } catch (error) {
    console.error('❌ Erreur validation forensique:', error);
    res.status(500).json({
      error: 'Erreur interne validation forensique',
      type: 'VALIDATION_SYSTEM_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Erreur système',
      processingTime: Date.now() - startTime + 'ms',
      timestamp: new Date().toISOString()
    });
  }
}

// =====================================
// VALIDATION MONGODB OBJECTID AVANCÉE
// =====================================

function validateForensicObjectId() {
  var paramName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'id';
  return function (req, res, next) {
    var id = req.params[paramName] || req.params.imageId || req.params.reportId;
    if (!id) {
      return res.status(400).json({
        error: "Param\xE8tre ".concat(paramName, " manquant"),
        type: 'MISSING_PARAMETER',
        expected: paramName,
        timestamp: new Date().toISOString()
      });
    }

    // Validation format ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "ID MongoDB invalide: ".concat(id),
        type: 'INVALID_MONGODB_ID',
        details: 'L\'ID doit être un ObjectId MongoDB valide (24 caractères hexadécimaux)',
        provided: id,
        format: 'ObjectId MongoDB requis',
        timestamp: new Date().toISOString()
      });
    }

    // Validation longueur exacte
    if (id.length !== 24) {
      return res.status(400).json({
        error: "Longueur ID incorrecte: ".concat(id.length, "/24 caract\xE8res"),
        type: 'INVALID_ID_LENGTH',
        provided: id,
        expectedLength: 24,
        actualLength: id.length,
        timestamp: new Date().toISOString()
      });
    }

    // Validation caractères hexadécimaux
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        error: 'ID contient des caractères non-hexadécimaux',
        type: 'INVALID_HEX_CHARACTERS',
        provided: id,
        expectedFormat: 'Caractères hexadécimaux uniquement (0-9, a-f, A-F)',
        timestamp: new Date().toISOString()
      });
    }

    // Normaliser en ObjectId pour uniformité
    try {
      req.forensicObjectId = new mongoose.Types.ObjectId(id);
      req.params.normalizedId = req.forensicObjectId.toString();
    } catch (error) {
      return res.status(400).json({
        error: 'Impossible de convertir ID en ObjectId',
        type: 'OBJECTID_CONVERSION_ERROR',
        details: error.message,
        provided: id,
        timestamp: new Date().toISOString()
      });
    }
    next();
  };
}

// =====================================
// VALIDATION QUERY PARAMETERS FORENSIQUES
// =====================================

var validateForensicQuery = [
// Pagination sécurisée
query('page').optional().isInt({
  min: 1,
  max: 1000
}).withMessage('Page doit être un entier entre 1 et 1000').toInt(), query('limit').optional().isInt({
  min: 1,
  max: 100
}).withMessage('Limite doit être entre 1 et 100').toInt(),
// Filtres de risque
query('riskLevel').optional().isIn(['AUTHENTIC', 'LIKELY_AUTHENTIC', 'UNCERTAIN', 'LIKELY_FAKE', 'FAKE']).withMessage('Niveau de risque invalide'), query('minScore').optional().isFloat({
  min: 0,
  max: 100
}).withMessage('Score minimum doit être entre 0 et 100').toFloat(), query('maxScore').optional().isFloat({
  min: 0,
  max: 100
}).withMessage('Score maximum doit être entre 0 et 100').toFloat(),
// Filtres temporels
query('dateFrom').optional().isISO8601().withMessage('Date de début doit être au format ISO8601').toDate(), query('dateTo').optional().isISO8601().withMessage('Date de fin doit être au format ISO8601').toDate(),
// Filtres techniques
query('pillar').optional().isIn(['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert']).withMessage('Pilier forensique invalide'), query('flagSeverity').optional().isIn(['info', 'warning', 'critical']).withMessage('Sévérité flag invalide'),
// Format de sortie
query('format').optional().isIn(['json', 'csv', 'pdf', 'xml']).withMessage('Format de sortie invalide'),
// Trier
query('sortBy').optional().isIn(['createdAt', 'authenticityScore', 'riskLevel', 'processingTime', 'fileSize']).withMessage('Champ de tri invalide'), query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Ordre de tri invalide (asc/desc)'),
// Recherche texte sécurisée
query('search').optional().isLength({
  min: 2,
  max: 100
}).withMessage('Recherche doit faire entre 2 et 100 caractères').customSanitizer(sanitizeSearchInput),
// Middleware validation des résultats
function (req, res, next) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Paramètres de requête invalides',
      type: 'INVALID_QUERY_PARAMETERS',
      details: errors.array().map(function (err) {
        return {
          field: err.param,
          message: err.msg,
          value: err.value
        };
      }),
      timestamp: new Date().toISOString()
    });
  }

  // Validation cohérence scores
  if (req.query.minScore && req.query.maxScore && req.query.minScore > req.query.maxScore) {
    return res.status(400).json({
      error: 'Score minimum supérieur au score maximum',
      type: 'INVALID_SCORE_RANGE',
      minScore: req.query.minScore,
      maxScore: req.query.maxScore,
      timestamp: new Date().toISOString()
    });
  }

  // Validation cohérence dates
  if (req.query.dateFrom && req.query.dateTo && req.query.dateFrom > req.query.dateTo) {
    return res.status(400).json({
      error: 'Date de début postérieure à la date de fin',
      type: 'INVALID_DATE_RANGE',
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      timestamp: new Date().toISOString()
    });
  }
  next();
}];

// =====================================
// MIDDLEWARE PLACEHOLDER POUR CORRIGER ROUTE CUSTOM
// =====================================

function validateForensicBody(req, res, next) {
  // Placeholder minimal pour éviter un middleware undefined dans les routes /api/reports/custom
  // Ne modifie pas le fonctionnement métier existant; renforcez si besoin plus tard
  return next();
}

// =====================================
// FONCTIONS UTILITAIRES
// =====================================

function validateForensicFilename(filename) {
  var issues = [];

  // Longueur
  if (filename.length > 255) {
    issues.push('Nom trop long (>255 caractères)');
  }

  // Caractères dangereux
  var dangerousPatterns = [{
    pattern: /[<>:"|?*\x00-\x1f]/,
    name: 'caractères système dangereux'
  }, {
    pattern: /\.\./,
    name: 'tentative directory traversal'
  }, {
    pattern: /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i,
    name: 'nom réservé Windows'
  }, {
    pattern: /%[0-9a-f]{2}/i,
    name: 'encodage URL suspect'
  }, {
    pattern: /\${.*}/,
    name: 'injection template potentielle'
  }, {
    pattern: /script\s*:/i,
    name: 'tentative injection script'
  }];
  for (var _i = 0, _dangerousPatterns = dangerousPatterns; _i < _dangerousPatterns.length; _i++) {
    var _dangerousPatterns$_i = _dangerousPatterns[_i],
      pattern = _dangerousPatterns$_i.pattern,
      name = _dangerousPatterns$_i.name;
    if (pattern.test(filename)) {
      issues.push(name);
    }
  }
  return {
    valid: issues.length === 0,
    reason: issues.join(', ')
  };
}
function validateMimeExtensionCoherence(extension, mimeType) {
  var validCombinations = {
    'jpg': ['image/jpeg'],
    'jpeg': ['image/jpeg'],
    'png': ['image/png'],
    'gif': ['image/gif'],
    'webp': ['image/webp'],
    'tiff': ['image/tiff', 'image/tif'],
    'tif': ['image/tiff', 'image/tif'],
    'bmp': ['image/bmp'],
    'svg': ['image/svg+xml'],
    'raw': ['image/x-canon-cr2', 'image/x-canon-crw', 'image/x-nikon-nef', 'image/x-sony-arw'],
    'dng': ['image/x-adobe-dng'],
    'cr2': ['image/x-canon-cr2'],
    'nef': ['image/x-nikon-nef']
  };
  var expectedMimes = validCombinations[extension];
  return {
    coherent: expectedMimes ? expectedMimes.includes(mimeType) : false,
    expected: expectedMimes
  };
}
function performForensicChecks(file) {
  var warnings = [];

  // Vérifier taille suspecte
  if (file.size < 1024) {
    warnings.push({
      type: 'SUSPICIOUS_SIZE',
      message: 'Fichier très petit pour une image',
      severity: 'warning'
    });
  }

  // Vérifier nom suspect
  if (file.originalname.includes('temp') || file.originalname.includes('cache')) {
    warnings.push({
      type: 'SUSPICIOUS_NAME',
      message: 'Nom de fichier suspect (temp/cache)',
      severity: 'info'
    });
  }

  // Vérifier extensions multiples
  var dots = (file.originalname.match(/\./g) || []).length;
  if (dots > 1) {
    warnings.push({
      type: 'MULTIPLE_EXTENSIONS',
      message: 'Extensions multiples détectées',
      severity: 'warning'
    });
  }
  return {
    warnings: warnings
  };
}
function calculateSecurityLevel(files, warnings) {
  var warningCount = warnings.length;
  var fileCount = files.length;
  var ratio = warningCount / fileCount;
  if (ratio === 0) return 'HIGH';
  if (ratio <= 0.5) return 'MEDIUM';
  return 'LOW';
}
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function sanitizeSearchInput(value) {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {}
  });
}
function sanitizeAnnotationContent(value) {
  return sanitizeHtml(value, {
    allowedTags: ['b', 'i', 'em', 'strong'],
    allowedAttributes: {}
  });
}

// =====================================
// EXPORTS
// =====================================

module.exports = {
  // Validations existantes
  validateForensicUpload: validateForensicUpload,
  validateForensicObjectId: validateForensicObjectId,
  validateForensicQuery: validateForensicQuery,
  handleValidationErrors: handleValidationErrors,
  // Nouvelles validations auth
  validateAuth: validateAuth,
  // Middleware de corps requis par les routes de rapports custom
  validateForensicBody: validateForensicBody
};