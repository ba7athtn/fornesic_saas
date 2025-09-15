// middleware/validation.js - VERSION COMPLÈTE OPTIMISÉE (intégrée avec config.js)
"use strict";

const { body, param, query, validationResult } = require('express-validator');
const path = require('path');
const mongoose = require('mongoose');
const sanitizeHtml = require('sanitize-html');
const crypto = require('crypto');

// Intégration config centralisée
const appConfig = require('../../config');

const isProd = process.env.NODE_ENV === 'production';

// =====================================
// CONFIGURATION CENTRALISÉE COMPLÈTE
// =====================================

// Mappings extension -> MIME (étendus aux formats RAW)
const EXT_TO_MIME = {
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
  png: ['image/png'],
  webp: ['image/webp'],
  gif: ['image/gif'],
  tif: ['image/tiff'],
  tiff: ['image/tiff'],
  bmp: ['image/bmp', 'image/x-ms-bmp'],
  ico: ['image/vnd.microsoft.icon'],
  dng: ['image/x-adobe-dng'],
  cr2: ['image/x-canon-cr2'],
  nef: ['image/x-nikon-nef'],
  arw: ['image/x-sony-arw'],
  orf: ['image/x-olympus-orf'],
  raw: ['application/octet-stream']
};

function buildAllowedFromFormats(formats) {
  const exts = formats.map(f => `.${f.toLowerCase()}`);
  const mimeSet = new Set();
  for (const f of formats) {
    const arr = EXT_TO_MIME[f.toLowerCase()];
    if (arr) arr.forEach(m => mimeSet.add(m));
  }
  return { allowedExtensions: exts, allowedMimeTypes: Array.from(mimeSet) };
}

const defaultFormats = Array.isArray(appConfig.upload?.allowedFormats)
  ? appConfig.upload.allowedFormats
  : ['jpg','jpeg','png','webp','tiff','tif','bmp'];

const { allowedExtensions: cfgAllowedExts, allowedMimeTypes: cfgAllowedMimes } =
  buildAllowedFromFormats(defaultFormats);

const VALIDATION_CONFIG = {
  limits: {
    email: { maxLength: 255, minLength: 5 },
    password: { minLength: 8, maxLength: 128 },
    names: { minLength: 2, maxLength: 50 },
    organization: { maxLength: 100 },
    token: { minLength: 32, maxLength: 128 },
    search: { minLength: 2, maxLength: 100 },
    filename: { maxLength: 255 }
  },

  patterns: {
    name: /^[a-zA-ZÀ-ÿ\s\-']+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    passwordBasic: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    token: /^[a-f0-9]+$/,
    objectId: /^[0-9a-fA-F]{24}$/,
    filename: /^[a-zA-Z0-9\-_\.\s()]+$/,
    dangerousFile: /[<>:"|?*\x00-\x1f]/,
    traversal: /\.\./,
    windowsReserved: /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i,
    urlEncoding: /%[0-9a-f]{2}/i,
    templateInjection: /\${.*}/,
    scriptInjection: /script\s*:/i
  },

  queryParams: {
    pagination: { maxPage: 1000, maxLimit: 100, defaultLimit: 20 },
    scores: { min: 0, max: 100 },
    riskLevels: ['AUTHENTIC', 'LIKELY_AUTHENTIC', 'UNCERTAIN', 'LIKELY_FAKE', 'FAKE'],
    pillars: ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'],
    flagSeverities: ['info', 'warning', 'critical'],
    outputFormats: ['json', 'csv', 'pdf', 'xml'],
    sortFields: ['createdAt', 'authenticityScore', 'riskLevel', 'processingTime', 'fileSize'],
    sortOrders: ['asc', 'desc']
  },

  upload: {
    maxFileSize: Number(appConfig.upload?.multerFileSize || 50 * 1024 * 1024),
    maxFiles: Number(appConfig.upload?.maxFilesPerRequest || 10),
    maxTotalSize: Number(appConfig.upload?.maxTotalSize || 200 * 1024 * 1024),
    allowedMimeTypes: cfgAllowedMimes,
    allowedExtensions: cfgAllowedExts,
    forbiddenExtensions: ['.svg', '.svgz', '.php', '.js', '.html', '.exe', '.bat', '.cmd'],
    suspiciousSize: { min: 1024, max: 20 * 1024 * 1024 }
  },

  mimeExtensionMap: {
    jpg: ['image/jpeg'],
    jpeg: ['image/jpeg'],
    png: ['image/png'],
    webp: ['image/webp'],
    gif: ['image/gif'],
    tif: ['image/tiff'],
    tiff: ['image/tiff'],
    bmp: ['image/bmp', 'image/x-ms-bmp'],
    svg: ['image/svg+xml'],
    raw: ['application/octet-stream'],
    dng: ['image/x-adobe-dng'],
    cr2: ['image/x-canon-cr2'],
    nef: ['image/x-nikon-nef'],
    arw: ['image/x-sony-arw'],
    orf: ['image/x-olympus-orf']
  }
};

// =====================================
// UTILITAIRES MODULAIRES COMPLETS
// =====================================
class ValidationUtilities {
  static generateRequestId(req) {
    if (!req.requestId) {
      req.requestId = crypto.randomBytes(8).toString('hex');
    }
    return req.requestId;
  }

  static logValidationEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;
    const logEntry = {
      level: level.toUpperCase(),
      message,
      requestId,
      timestamp: new Date().toISOString(),
      component: 'VALIDATION',
      ...data
    };
    const icon = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' }[level] || '📝';
    console.log(`${icon} VALIDATION ${logEntry.level}:`, JSON.stringify(logEntry));
  }

  static formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static validateForensicFilename(filename) {
    if (!filename || typeof filename !== 'string') {
      return { valid: false, reason: 'Nom de fichier manquant' };
    }
    const issues = [];
    if (filename.length > VALIDATION_CONFIG.limits.filename.maxLength) {
      issues.push(`Nom trop long (>${VALIDATION_CONFIG.limits.filename.maxLength} caractères)`);
    }
    const dangerousChecks = [
      { pattern: VALIDATION_CONFIG.patterns.dangerousFile, name: 'caractères système dangereux' },
      { pattern: VALIDATION_CONFIG.patterns.traversal, name: 'tentative directory traversal' },
      { pattern: VALIDATION_CONFIG.patterns.windowsReserved, name: 'nom réservé Windows' },
      { pattern: VALIDATION_CONFIG.patterns.urlEncoding, name: 'encodage URL suspect' },
      { pattern: VALIDATION_CONFIG.patterns.templateInjection, name: 'injection template potentielle' },
      { pattern: VALIDATION_CONFIG.patterns.scriptInjection, name: 'tentative injection script' }
    ];
    dangerousChecks.forEach(({ pattern, name }) => {
      if (pattern.test(filename)) issues.push(name);
    });
    const ext = path.extname(filename).toLowerCase();
    if (VALIDATION_CONFIG.upload.forbiddenExtensions.includes(ext)) {
      issues.push(`Extension interdite: ${ext}`);
    }
    return { valid: issues.length === 0, reason: issues.join(', '), issues };
  }

  static validateMimeExtensionCoherence(extension, mimetype) {
    const expected = VALIDATION_CONFIG.mimeExtensionMap[extension.toLowerCase()];
    if (!expected) return { coherent: false, expected: null };
    return { coherent: expected.includes(mimetype), expected };
  }

  static performForensicChecks(file) {
    const warnings = [];
    if (file.size < VALIDATION_CONFIG.upload.suspiciousSize.min) {
      warnings.push({ type: 'SUSPICIOUS_SIZE_SMALL', message: 'Fichier très petit pour une image', severity: 'warning' });
    }
    if (file.size > VALIDATION_CONFIG.upload.suspiciousSize.max) {
      warnings.push({ type: 'SUSPICIOUS_SIZE_LARGE', message: 'Fichier très volumineux', severity: 'medium' });
    }
    const suspiciousNamePatterns = ['temp', 'cache', 'tmp', 'backup', 'copy'];
    if (suspiciousNamePatterns.some(p => file.originalname.toLowerCase().includes(p))) {
      warnings.push({ type: 'SUSPICIOUS_NAME', message: 'Nom de fichier suspect (temp/cache/backup)', severity: 'info' });
    }
    const dots = (file.originalname.match(/\./g) || []).length;
    if (dots > 1) {
      warnings.push({ type: 'MULTIPLE_EXTENSIONS', message: 'Extensions multiples détectées', severity: 'warning' });
    }
    if (!/^[\x00-\x7F]*$/.test(file.originalname)) {
      warnings.push({ type: 'NON_ASCII_FILENAME', message: 'Caractères non-ASCII dans le nom de fichier', severity: 'info' });
    }
    return { warnings };
  }

  static calculateSecurityLevel(files, warnings) {
    const highWarnings = warnings.filter(w => w.severity === 'high').length;
    const mediumWarnings = warnings.filter(w => w.severity === 'medium').length;
    const lowWarnings = warnings.filter(w => w.severity === 'warning').length;
    if (highWarnings > 0) return 'HIGH_RISK';
    if (mediumWarnings > 2) return 'MEDIUM_RISK';
    if (lowWarnings > 5) return 'LOW_RISK';
    if (warnings.length > 10) return 'MODERATE_RISK';
    return 'SAFE';
  }

  static sanitizeSearchInput(value) {
    if (!value || typeof value !== 'string') return '';
    const cleaned = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
    return cleaned
      .replace(/[<>(){}[\]]/g, '')
      .replace(/['"`;]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, VALIDATION_CONFIG.limits.search.maxLength);
  }

  static sanitizeAnnotationContent(value) {
    if (!value || typeof value !== 'string') return '';
    return sanitizeHtml(value, {
      allowedTags: ['b', 'i', 'em', 'strong', 'u', 'br'],
      allowedAttributes: {},
      textFilter: (text) => text.substring(0, 1000)
    });
  }

  static recordValidationMetrics(validationType, success, errors, processingTime, requestId) {
    const metrics = {
      validationType,
      success,
      errorCount: errors?.length || 0,
      processingTime,
      requestId,
      timestamp: new Date().toISOString()
    };
    this.logValidationEvent('info', 'Validation metrics', metrics, requestId);
    return metrics;
  }
}

// =====================================
// GESTION D'ERREURS CENTRALISÉE
// =====================================
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const handleValidationErrors = asyncHandler(async (req, res, next) => {
  const requestId = ValidationUtilities.generateRequestId(req);
  const startTime = Date.now();

  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      ValidationUtilities.logValidationEvent('success', 'Validation passed', {
        path: req.path, method: req.method
      }, requestId);
      return next();
    }

    const errorFields = {};
    const errorDetails = [];
    const errorsByLocation = { body: [], query: [], params: [] };

    errors.array().forEach(error => {
      errorFields[error.path] = error.msg;
      errorDetails.push({
        field: error.path,
        value: error.value,
        message: error.msg,
        location: error.location
      });
      if (errorsByLocation[error.location]) {
        errorsByLocation[error.location].push(error);
      }
    });

    const processingTime = Date.now() - startTime;
    ValidationUtilities.logValidationEvent('warn', 'Validation failed', {
      path: req.path,
      method: req.method,
      errorCount: errors.array().length,
      fields: Object.keys(errorFields),
      locations: Object.keys(errorsByLocation).filter(loc => errorsByLocation[loc].length > 0),
      processingTime: `${processingTime}ms`
    }, requestId);

    ValidationUtilities.recordValidationMetrics('express-validator', false, errors.array(), processingTime, requestId);

    return res.status(400).json({
      success: false,
      error: 'Données de validation invalides',
      type: 'VALIDATION_ERROR',
      summary: `${errors.array().length} erreur(s) de validation détectée(s)`,
      fields: errorFields,
      details: errorDetails,
      breakdown: {
        bodyErrors: errorsByLocation.body.length,
        queryErrors: errorsByLocation.query.length,
        paramErrors: errorsByLocation.params.length
      },
      requestId,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    ValidationUtilities.logValidationEvent('error', 'Validation error handler failed', {
      error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
    }, requestId);

    return res.status(500).json({
      success: false,
      error: 'Erreur interne de validation',
      type: 'VALIDATION_SYSTEM_ERROR',
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// VALIDATIONS QUERY PARAMETERS FORENSIQUES
// =====================================
const validateForensicQuery = [
  query('page').optional()
    .isInt({ min: 1, max: VALIDATION_CONFIG.queryParams.pagination.maxPage })
    .withMessage(`Page doit être entre 1 et ${VALIDATION_CONFIG.queryParams.pagination.maxPage}`)
    .toInt(),

  query('limit').optional()
    .isInt({ min: 1, max: VALIDATION_CONFIG.queryParams.pagination.maxLimit })
    .withMessage(`Limite doit être entre 1 et ${VALIDATION_CONFIG.queryParams.pagination.maxLimit}`)
    .toInt(),

  query('riskLevel').optional()
    .isIn(VALIDATION_CONFIG.queryParams.riskLevels)
    .withMessage(`Niveau de risque invalide. Valeurs autorisées: ${VALIDATION_CONFIG.queryParams.riskLevels.join(', ')}`),

  query('minScore').optional()
    .isFloat({ min: VALIDATION_CONFIG.queryParams.scores.min, max: VALIDATION_CONFIG.queryParams.scores.max })
    .withMessage(`Score minimum doit être entre ${VALIDATION_CONFIG.queryParams.scores.min} et ${VALIDATION_CONFIG.queryParams.scores.max}`)
    .toFloat(),

  query('maxScore').optional()
    .isFloat({ min: VALIDATION_CONFIG.queryParams.scores.min, max: VALIDATION_CONFIG.queryParams.scores.max })
    .withMessage(`Score maximum doit être entre ${VALIDATION_CONFIG.queryParams.scores.min} et ${VALIDATION_CONFIG.queryParams.scores.max}`)
    .toFloat(),

  query('dateFrom').optional().isISO8601()
    .withMessage('Date de début doit être au format ISO8601 (YYYY-MM-DDTHH:mm:ss.sssZ)').toDate(),

  query('dateTo').optional().isISO8601()
    .withMessage('Date de fin doit être au format ISO8601 (YYYY-MM-DDTHH:mm:ss.sssZ)').toDate(),

  query('pillar').optional().isIn(VALIDATION_CONFIG.queryParams.pillars)
    .withMessage(`Pilier forensique invalide. Valeurs autorisées: ${VALIDATION_CONFIG.queryParams.pillars.join(', ')}`),

  query('flagSeverity').optional().isIn(VALIDATION_CONFIG.queryParams.flagSeverities)
    .withMessage(`Sévérité flag invalide. Valeurs autorisées: ${VALIDATION_CONFIG.queryParams.flagSeverities.join(', ')}`),

  query('format').optional().isIn(VALIDATION_CONFIG.queryParams.outputFormats)
    .withMessage(`Format de sortie invalide. Valeurs autorisées: ${VALIDATION_CONFIG.queryParams.outputFormats.join(', ')}`),

  query('sortBy').optional().isIn(VALIDATION_CONFIG.queryParams.sortFields)
    .withMessage(`Champ de tri invalide. Valeurs autorisées: ${VALIDATION_CONFIG.queryParams.sortFields.join(', ')}`),

  query('sortOrder').optional().isIn(VALIDATION_CONFIG.queryParams.sortOrders)
    .withMessage(`Ordre de tri invalide. Valeurs autorisées: ${VALIDATION_CONFIG.queryParams.sortOrders.join(', ')}`),

  query('search').optional()
    .isLength({ min: VALIDATION_CONFIG.limits.search.minLength, max: VALIDATION_CONFIG.limits.search.maxLength })
    .withMessage(`Recherche doit faire entre ${VALIDATION_CONFIG.limits.search.minLength} et ${VALIDATION_CONFIG.limits.search.maxLength} caractères`)
    .customSanitizer(ValidationUtilities.sanitizeSearchInput),

  asyncHandler(async (req, res, next) => {
    const requestId = ValidationUtilities.generateRequestId(req);
    const startTime = Date.now();

    try {
      ValidationUtilities.logValidationEvent('debug', 'Query parameters validation', {
        queryParams: Object.keys(req.query), path: req.path
      }, requestId);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        ValidationUtilities.logValidationEvent('warn', 'Query validation failed', {
          errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        }, requestId);

        return res.status(400).json({
          success: false,
          error: 'Paramètres de requête invalides',
          type: 'INVALID_QUERY_PARAMETERS',
          details: errors.array().map(err => ({
            field: err.path, message: err.msg, value: err.value, location: err.location
          })),
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (req.query.minScore && req.query.maxScore && req.query.minScore > req.query.maxScore) {
        ValidationUtilities.logValidationEvent('warn', 'Invalid score range', {
          minScore: req.query.minScore, maxScore: req.query.maxScore
        }, requestId);

        return res.status(400).json({
          success: false,
          error: 'Score minimum supérieur au score maximum',
          type: 'INVALID_SCORE_RANGE',
          details: { minScore: req.query.minScore, maxScore: req.query.maxScore },
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (req.query.dateFrom && req.query.dateTo && req.query.dateFrom > req.query.dateTo) {
        ValidationUtilities.logValidationEvent('warn', 'Invalid date range', {
          dateFrom: req.query.dateFrom, dateTo: req.query.dateTo
        }, requestId);

        return res.status(400).json({
          success: false,
          error: 'Date de début postérieure à la date de fin',
          type: 'INVALID_DATE_RANGE',
          details: {
            dateFrom: req.query.dateFrom.toISOString(),
            dateTo: req.query.dateTo.toISOString()
          },
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      const processingTime = Date.now() - startTime;

      // Enrichir req avec metadata validation query
      req.queryValidation = {
        validatedAt: new Date().toISOString(),
        paramCount: Object.keys(req.query).length,
        processingTime,
        sanitizedSearch: req.query.search
      };

      ValidationUtilities.logValidationEvent('success', 'Query validation passed', {
        queryParamsCount: Object.keys(req.query).length,
        processingTime: `${processingTime}ms`
      }, requestId);

      next();

    } catch (error) {
      const processingTime = Date.now() - startTime;
      ValidationUtilities.logValidationEvent('error', 'Query validation system error', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      return res.status(500).json({
        success: false,
        error: 'Erreur interne validation paramètres',
        type: 'QUERY_VALIDATION_SYSTEM_ERROR',
        requestId,
        timestamp: new Date().toISOString()
      });
    }
  })
];

// =====================================
// VALIDATIONS AUTHENTIFICATION COMPLÈTES
// =====================================
class Ba7athValidationAuth {
  static emailValidation() {
    return body('email')
      .isEmail()
      .withMessage('Format d\'email invalide')
      .normalizeEmail({
        gmail_remove_dots: true,
        gmail_remove_subaddress: true,
        outlookdotcom_remove_subaddress: true,
        yahoo_remove_subaddress: true,
        icloud_remove_subaddress: true
      })
      .isLength({
        min: VALIDATION_CONFIG.limits.email.minLength,
        max: VALIDATION_CONFIG.limits.email.maxLength
      })
      .withMessage(`Email doit faire entre ${VALIDATION_CONFIG.limits.email.minLength} et ${VALIDATION_CONFIG.limits.email.maxLength} caractères`);
  }

  static passwordValidation(fieldName = 'password', strong = true) {
    const pattern = strong ? VALIDATION_CONFIG.patterns.password : VALIDATION_CONFIG.patterns.passwordBasic;
    const message = strong
      ? 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'
      : 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';

    return body(fieldName)
      .isLength({
        min: VALIDATION_CONFIG.limits.password.minLength,
        max: VALIDATION_CONFIG.limits.password.maxLength
      })
      .withMessage(`Mot de passe doit faire entre ${VALIDATION_CONFIG.limits.password.minLength} et ${VALIDATION_CONFIG.limits.password.maxLength} caractères`)
      .matches(pattern)
      .withMessage(message);
  }

  static nameValidation(fieldName, displayName) {
    return body(fieldName)
      .trim()
      .isLength({
        min: VALIDATION_CONFIG.limits.names.minLength,
        max: VALIDATION_CONFIG.limits.names.maxLength
      })
      .withMessage(`${displayName} doit faire entre ${VALIDATION_CONFIG.limits.names.minLength} et ${VALIDATION_CONFIG.limits.names.maxLength} caractères`)
      .matches(VALIDATION_CONFIG.patterns.name)
      .withMessage(`${displayName} contient des caractères invalides (lettres, espaces, tirets et apostrophes uniquement)`);
  }

  static passwordConfirmation(passwordField = 'password', confirmField = 'confirmPassword') {
    return body(confirmField).custom((value, { req }) => {
      if (value !== req.body[passwordField]) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    });
  }

  static tokenValidation(paramName = 'token') {
    return param(paramName)
      .isLength({
        min: VALIDATION_CONFIG.limits.token.minLength,
        max: VALIDATION_CONFIG.limits.token.maxLength
      })
      .withMessage(`Token doit faire entre ${VALIDATION_CONFIG.limits.token.minLength} et ${VALIDATION_CONFIG.limits.token.maxLength} caractères`)
      .matches(VALIDATION_CONFIG.patterns.token)
      .withMessage('Format de token invalide (caractères hexadécimaux uniquement)');
  }

  static get registration() {
    return [
      this.emailValidation(),
      this.passwordValidation('password', true),
      this.passwordConfirmation('password', 'confirmPassword'),
      this.nameValidation('firstName', 'Prénom'),
      this.nameValidation('lastName', 'Nom'),
      body('organization').optional().trim()
        .isLength({ max: VALIDATION_CONFIG.limits.organization.maxLength })
        .withMessage(`Organisation trop longue (max ${VALIDATION_CONFIG.limits.organization.maxLength} caractères)`),
      body('acceptTerms').equals('true')
        .withMessage('Vous devez accepter les conditions d\'utilisation'),
      handleValidationErrors
    ];
  }

  static get login() {
    return [
      this.emailValidation(),
      body('password').notEmpty().withMessage('Mot de passe requis'),
      body('rememberMe').optional().isBoolean().withMessage('Remember me doit être un booléen'),
      handleValidationErrors
    ];
  }

  static get refreshToken() {
    return [
      body('refreshToken').notEmpty().withMessage('Refresh token requis')
        .isJWT().withMessage('Format de refresh token invalide'),
      handleValidationErrors
    ];
  }

  static get verificationToken() {
    return [this.tokenValidation('token'), handleValidationErrors];
  }

  static get email() {
    return [this.emailValidation(), handleValidationErrors];
  }

  static get passwordReset() {
    return [
      this.tokenValidation('token'),
      this.passwordValidation('password', true),
      this.passwordConfirmation('password', 'confirmPassword'),
      handleValidationErrors
    ];
  }

  static get passwordChange() {
    return [
      body('currentPassword').notEmpty().withMessage('Mot de passe actuel requis'),
      this.passwordValidation('newPassword', true),
      this.passwordConfirmation('newPassword', 'confirmPassword'),
      body('currentPassword').custom((value, { req }) => {
        if (value === req.body.newPassword) {
          throw new Error('Le nouveau mot de passe doit être différent de l\'ancien');
        }
        return true;
      }),
      handleValidationErrors
    ];
  }
}

// =====================================
// VALIDATION UPLOAD FORENSIQUE OPTIMISÉE
// =====================================
const validateForensicUpload = asyncHandler(async (req, res, next) => {
  const requestId = ValidationUtilities.generateRequestId(req);
  const startTime = Date.now();

  try {
    ValidationUtilities.logValidationEvent('info', 'Forensic upload validation start', {
      hasFile: !!req.file, hasFiles: !!(req.files && req.files.length > 0), path: req.path
    }, requestId);

    const hasFile = req.file || (req.files && req.files.length > 0);
    if (!hasFile) {
      ValidationUtilities.logValidationEvent('warn', 'No files provided for forensic upload', {}, requestId);
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier fourni pour analyse forensique',
        type: 'MISSING_FILES',
        details: 'Au moins un fichier image est requis',
        expectedFields: ['image', 'images', 'file', 'files'],
        requestId,
        timestamp: new Date().toISOString()
      });
    }

    const files = req.files || (req.file ? [req.file] : []);
    const validationErrors = [];
    const warnings = [];

    ValidationUtilities.logValidationEvent('debug', 'Files to validate', {
      fileCount: files.length,
      totalSize: ValidationUtilities.formatBytes(files.reduce((s, f) => s + (f.size || 0), 0))
    }, requestId);

    if (files.length > VALIDATION_CONFIG.upload.maxFiles) {
      ValidationUtilities.logValidationEvent('warn', 'Too many files', {
        provided: files.length, max: VALIDATION_CONFIG.upload.maxFiles
      }, requestId);

      return res.status(400).json({
        success: false,
        error: `Trop de fichiers (${files.length}/${VALIDATION_CONFIG.upload.maxFiles})`,
        type: 'TOO_MANY_FILES',
        maxAllowed: VALIDATION_CONFIG.upload.maxFiles,
        received: files.length,
        requestId,
        timestamp: new Date().toISOString()
      });
    }

    let totalSize = 0;
    files.forEach((file, index) => {
      if (!file) {
        validationErrors.push({ fileIndex: index, error: 'Fichier vide ou manquant', type: 'EMPTY_FILE' });
        return;
      }

      if (file.size > VALIDATION_CONFIG.upload.maxFileSize) {
        validationErrors.push({
          fileIndex: index,
          filename: file.originalname,
          error: `Fichier trop volumineux: ${ValidationUtilities.formatBytes(file.size)} > ${ValidationUtilities.formatBytes(VALIDATION_CONFIG.upload.maxFileSize)}`,
          type: 'FILE_TOO_LARGE',
          actualSize: file.size,
          maxSize: VALIDATION_CONFIG.upload.maxFileSize
        });
      }

      if (file.size === 0) {
        validationErrors.push({
          fileIndex: index, filename: file.originalname, error: 'Fichier vide détecté', type: 'ZERO_SIZE_FILE'
        });
      }

      const nameValidation = ValidationUtilities.validateForensicFilename(file.originalname);
      if (!nameValidation.valid) {
        validationErrors.push({
          fileIndex: index,
          filename: file.originalname,
          error: `Nom de fichier invalide: ${nameValidation.reason}`,
          type: 'INVALID_FILENAME',
          details: nameValidation
        });
      }

      const ext = path.extname(file.originalname).slice(1).toLowerCase();
      const mimeValidation = ValidationUtilities.validateMimeExtensionCoherence(ext, file.mimetype);
      if (mimeValidation.expected && !mimeValidation.coherent) {
        validationErrors.push({
          fileIndex: index,
          filename: file.originalname,
          error: `Incohérence format: .${ext} vs ${file.mimetype}`,
          type: 'MIME_EXTENSION_MISMATCH',
          extension: ext, mimetype: file.mimetype, expected: mimeValidation.expected
        });
      }

      const forensicChecks = ValidationUtilities.performForensicChecks(file);
      if (forensicChecks.warnings.length > 0) {
        warnings.push(...forensicChecks.warnings.map(w => ({
          fileIndex: index, filename: file.originalname, ...w
        })));
      }

      totalSize += file.size;
    });

    if (totalSize > VALIDATION_CONFIG.upload.maxTotalSize) {
      validationErrors.push({
        error: `Taille totale excessive: ${ValidationUtilities.formatBytes(totalSize)} > ${ValidationUtilities.formatBytes(VALIDATION_CONFIG.upload.maxTotalSize)}`,
        type: 'TOTAL_SIZE_EXCEEDED',
        totalSize, maxTotalSize: VALIDATION_CONFIG.upload.maxTotalSize
      });
    }

    const processingTime = Date.now() - startTime;

    if (validationErrors.length > 0) {
      ValidationUtilities.logValidationEvent('warn', 'Forensic upload validation failed', {
        errorCount: validationErrors.length, warningCount: warnings.length, processingTime: `${processingTime}ms`
      }, requestId);

      ValidationUtilities.recordValidationMetrics('forensic-upload', false, validationErrors, processingTime, requestId);

      return res.status(400).json({
        success: false,
        error: 'Validation forensique échouée',
        type: 'FORENSIC_VALIDATION_FAILED',
        summary: `${validationErrors.length} erreur(s) détectée(s)`,
        validationErrors,
        warnings,
        requestId,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      });
    }

    req.forensicValidation = {
      filesCount: files.length,
      totalSize,
      averageSize: Math.round(totalSize / files.length),
      validatedAt: new Date().toISOString(),
      processingTime,
      warnings,
      securityLevel: ValidationUtilities.calculateSecurityLevel(files, warnings)
    };

    ValidationUtilities.logValidationEvent('success', 'Forensic upload validation passed', {
      filesCount: files.length,
      totalSize: ValidationUtilities.formatBytes(totalSize),
      warningCount: warnings.length,
      securityLevel: req.forensicValidation.securityLevel,
      processingTime: `${processingTime}ms`
    }, requestId);

    ValidationUtilities.recordValidationMetrics('forensic-upload', true, [], processingTime, requestId);

    next();

  } catch (error) {
    const processingTime = Date.now() - startTime;

    ValidationUtilities.logValidationEvent('error', 'Forensic upload validation system error', {
      error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
    }, requestId);

    res.status(500).json({
      success: false,
      error: 'Erreur interne validation forensique',
      type: 'FORENSIC_VALIDATION_SYSTEM_ERROR',
      details: !isProd ? error.message : 'Erreur système',
      requestId,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// VALIDATION MONGODB OBJECTID AVANCÉE
// =====================================
const validateForensicObjectId = (paramName = 'id') => {
  return asyncHandler(async (req, res, next) => {
    const requestId = ValidationUtilities.generateRequestId(req);
    const startTime = Date.now();

    try {
      const id = req.params[paramName] || req.params.imageId || req.params.reportId;

      ValidationUtilities.logValidationEvent('debug', 'ObjectId validation start', {
        paramName, providedId: id, availableParams: Object.keys(req.params)
      }, requestId);

      if (!id) {
        ValidationUtilities.logValidationEvent('warn', 'Missing ObjectId parameter', {
          paramName, availableParams: Object.keys(req.params)
        }, requestId);

        return res.status(400).json({
          success: false,
          error: `Paramètre ${paramName} manquant`,
          type: 'MISSING_PARAMETER',
          expected: paramName,
          availableParams: Object.keys(req.params),
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        ValidationUtilities.logValidationEvent('warn', 'Invalid ObjectId format', {
          paramName, providedId: id, length: id.length
        }, requestId);

        return res.status(400).json({
          success: false,
          error: `ID MongoDB invalide: ${id}`,
          type: 'INVALID_MONGODB_ID',
          details: 'L\'ID doit être un ObjectId MongoDB valide (24 caractères hexadécimaux)',
          provided: id,
          format: 'ObjectId MongoDB requis',
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (id.length !== 24) {
        ValidationUtilities.logValidationEvent('warn', 'Invalid ObjectId length', {
          paramName, providedId: id, expectedLength: 24, actualLength: id.length
        }, requestId);

        return res.status(400).json({
          success: false,
          error: `Longueur ID incorrecte: ${id.length}/24 caractères`,
          type: 'INVALID_ID_LENGTH',
          provided: id,
          expectedLength: 24,
          actualLength: id.length,
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      if (!VALIDATION_CONFIG.patterns.objectId.test(id)) {
        ValidationUtilities.logValidationEvent('warn', 'Invalid hexadecimal characters', {
          paramName, providedId: id
        }, requestId);

        return res.status(400).json({
          success: false,
          error: 'ID contient des caractères non-hexadécimaux',
          type: 'INVALID_HEX_CHARACTERS',
          provided: id,
          expectedFormat: 'Caractères hexadécimaux uniquement (0-9, a-f, A-F)',
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      // Normaliser en ObjectId pour uniformité
      try {
        req.forensicObjectId = new mongoose.Types.ObjectId(id);
        req.params.normalizedId = req.forensicObjectId.toString();

        const processingTime = Date.now() - startTime;

        ValidationUtilities.logValidationEvent('success', 'ObjectId validation passed', {
          paramName,
          objectId: req.forensicObjectId.toString(),
          processingTime: `${processingTime}ms`
        }, requestId);

        ValidationUtilities.recordValidationMetrics('objectid', true, [], processingTime, requestId);

        next();

      } catch (conversionError) {
        ValidationUtilities.logValidationEvent('error', 'ObjectId conversion failed', {
          paramName, providedId: id, error: conversionError.message
        }, requestId);

        return res.status(400).json({
          success: false,
          error: 'Impossible de convertir ID en ObjectId',
          type: 'OBJECTID_CONVERSION_ERROR',
          details: conversionError.message,
          provided: id,
          requestId,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      const processingTime = Date.now() - startTime;

      ValidationUtilities.logValidationEvent('error', 'ObjectId validation system error', {
        paramName, error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      return res.status(500).json({
        success: false,
        error: 'Erreur interne validation ObjectId',
        type: 'OBJECTID_VALIDATION_SYSTEM_ERROR',
        requestId,
        timestamp: new Date().toISOString()
      });
    }
  });
};

// =====================================
// VALIDATION BODY FORENSIQUE (placeholder)
// =====================================
const validateForensicBody = asyncHandler(async (req, res, next) => {
  const requestId = ValidationUtilities.generateRequestId(req);

  try {
    ValidationUtilities.logValidationEvent('debug', 'Forensic body validation (placeholder)', {
      hasBody: !!req.body,
      bodyKeys: req.body ? Object.keys(req.body) : [],
      contentType: req.headers['content-type']
    }, requestId);

    if (req.body && typeof req.body === 'object') {
      const bodySize = JSON.stringify(req.body).length;
      if (bodySize > 1024 * 1024) { // 1MB
        ValidationUtilities.logValidationEvent('warn', 'Body too large', {
          bodySize: ValidationUtilities.formatBytes(bodySize)
        }, requestId);

        return res.status(400).json({
          success: false,
          error: 'Corps de requête trop volumineux',
          type: 'BODY_TOO_LARGE',
          maxSize: '1MB',
          actualSize: ValidationUtilities.formatBytes(bodySize),
          requestId,
          timestamp: new Date().toISOString()
        });
      }

      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim().substring(0, 10000);
        }
      });
    }

    ValidationUtilities.logValidationEvent('success', 'Forensic body validation passed', {}, requestId);
    next();

  } catch (error) {
    ValidationUtilities.logValidationEvent('error', 'Forensic body validation error', {
      error: error.message
    }, requestId);

    return res.status(500).json({
      success: false,
      error: 'Erreur validation corps de requête',
      type: 'BODY_VALIDATION_ERROR',
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// PIPELINES COMPOSABLES
// =====================================
class Ba7athValidationMiddleware {
  static get validateAuth() { return Ba7athValidationAuth; }

  static forensicUpload = validateForensicUpload;
  static forensicObjectId = validateForensicObjectId;
  static forensicQuery = validateForensicQuery;
  static forensicBody = validateForensicBody;

  static handleErrors = handleValidationErrors;

  static createValidationPipeline(validations) {
    return [...validations, handleValidationErrors];
  }

  static createQueryValidation(schema) {
    const validations = Object.entries(schema).map(([field, rules]) => {
      let v = query(field);
      rules.forEach(rule => {
        switch (rule.type) {
          case 'isInt': v = v.isInt(rule.options).withMessage(rule.message); break;
          case 'isString': v = v.isString().withMessage(rule.message); break;
          case 'isBoolean': v = v.isBoolean().withMessage(rule.message); break;
          case 'isIn': v = v.isIn(rule.values).withMessage(rule.message); break;
          case 'optional': v = v.optional(); break;
          case 'customSanitizer': v = v.customSanitizer(rule.sanitizer); break;
          default: break;
        }
      });
      return v;
    });
    return [...validations, handleValidationErrors];
  }

  static forensicEndpointPipeline(options = {}) {
    const pipeline = [];
    if (options.validateObjectId) pipeline.push(this.forensicObjectId(options.validateObjectId));
    if (options.validateQuery) pipeline.push(...this.forensicQuery);
    if (options.validateBody) pipeline.push(this.forensicBody);
    if (options.validateUpload) pipeline.push(this.forensicUpload);
    return pipeline;
  }

  static withMetrics(validationPipeline, validationType) {
    return [
      ...validationPipeline,
      asyncHandler(async (req, res, next) => {
        const requestId = ValidationUtilities.generateRequestId(req);
        ValidationUtilities.recordValidationMetrics(validationType, true, [], 0, requestId);
        next();
      })
    ];
  }
}

// =====================================
// EXPORT MODULAIRE COMPLET
// =====================================
module.exports = {
  validateAuth: Ba7athValidationAuth,
  validateForensicUpload,
  validateForensicObjectId,
  validateForensicQuery,
  validateForensicBody,
  handleValidationErrors,

  Ba7athValidationMiddleware,
  Ba7athValidationAuth,

  ValidationUtilities,
  VALIDATION_CONFIG
};
