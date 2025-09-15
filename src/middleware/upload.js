// middleware/upload.js - VERSION OPTIMISÉE (intégrée avec config.js)
"use strict";

const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const sanitizeFilename = require('sanitize-filename');
const { fileTypeFromFile } = require('file-type');

// Intégration config centralisée
const appConfig = require('../../config');

const forensicValidationService = require('../services/forensicValidationService');
const rateLimitService = require('../services/rateLimitService');

const isProd = process.env.NODE_ENV === 'production';

// =====================================
// MAPPINGS EXTENSIONS → MIME (basé sur config.upload.allowedFormats)
// =====================================
const EXT_TO_MIME = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  bmp: 'image/bmp',
  ico: 'image/vnd.microsoft.icon',
  // formats RAW: signature check post-upload, accepter via whitelist extension
  dng: 'image/x-adobe-dng',
  cr2: 'image/x-canon-cr2',
  nef: 'image/x-nikon-nef',
  arw: 'image/x-sony-arw',
  orf: 'image/x-olympus-orf',
  raw: 'application/octet-stream'
};

// Construit whitelist MIME depuis allowedFormats
function buildAllowedMimeTypes(allowedFormats) {
  const set = new Set();
  for (const ext of allowedFormats) {
    const mime = EXT_TO_MIME[ext.toLowerCase()];
    if (mime) set.add(mime);
  }
  // Ajouter variantes courantes cohérentes avec vos traitements
  set.add('image/x-ms-bmp');
  return Array.from(set);
}

// =====================================
// CONFIGURATION CENTRALISÉE (depuis config.js)
// =====================================
const UPLOAD_CONFIG = {
  // Directories
  tempDir: appConfig.upload?.directories?.temp || path.join(__dirname, '../../uploads/temp'),
  quarantineDir: appConfig.upload?.directories?.quarantine || path.join(__dirname, '../../uploads/quarantine'),

  // File limits
  maxFileSize: Number(appConfig.upload?.multerFileSize || 50 * 1024 * 1024),
  maxFiles: Number(appConfig.upload?.maxFilesPerRequest || 10),
  maxTotalSize: Number(process.env.MAX_TOTAL_UPLOAD_SIZE || 200 * 1024 * 1024), // optionnel

  // Security whitelist
  allowedFormats: Array.isArray(appConfig.upload?.allowedFormats) ? appConfig.upload.allowedFormats : ['jpg','jpeg','png','webp','tiff','tif'],
  allowedExtensions: [], // rempli juste après
  allowedMimeTypes: [],  // rempli juste après

  // Extensions interdites
  forbiddenExtensions: [
    '.svg', '.svgz', '.php', '.js', '.html', '.htm', '.sh', '.bat',
    '.cmd', '.exe', '.dll', '.msi', '.dmg', '.pkg', '.deb', '.rpm'
  ],

  // Multer limits additionnels
  limits: {
    fieldSize: 10 * 1024 * 1024, // 10MB
    fieldNameSize: 200,
    fields: 50,
    parts: 100,
    headerPairs: 2000
  },

  // Rate limiting
  rateLimits: {
    uploadRequests: { limit: 20, window: 3600 }, // 20 uploads/heure
    uploadSize: { limit: 500 * 1024 * 1024, window: 3600 } // 500MB/heure
  },

  // Validation
  validation: {
    enableSignatureCheck: true,
    enableForensicValidation: true,
    quarantineSuspiciousFiles: true,
    maxFilenameLength: 255
  }
};

// Renseigner les extensions autorisées à partir des formats
UPLOAD_CONFIG.allowedExtensions = UPLOAD_CONFIG.allowedFormats
  .map(f => `.${f.toLowerCase()}`);
UPLOAD_CONFIG.allowedMimeTypes = buildAllowedMimeTypes(UPLOAD_CONFIG.allowedFormats);

// =====================================
// UTILITAIRES MODULAIRES
// =====================================
class UploadUtilities {
  // ✅ Initialisation répertoires sécurisée
  static async initializeDirectories() {
    const dirs = [UPLOAD_CONFIG.tempDir, UPLOAD_CONFIG.quarantineDir];
    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        if (!isProd) console.log(`📁 Répertoire upload créé: ${dir}`);
      }
    }
  }

  // ✅ Détection double extension
  static hasDoubleExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 2;
  }

  // ✅ Détection SVG par nom
  static isSvgByName(name) {
    const lower = name.toLowerCase();
    return lower.endsWith('.svg') || lower.includes('.svgz');
  }

  // ✅ Vérification extension interdite
  static isForbiddenExtension(ext) {
    return UPLOAD_CONFIG.forbiddenExtensions.includes(ext.toLowerCase());
  }

  // ✅ Génération nom sécurisé
  static generateSecureFilename(originalName, customPrefix = 'forensic') {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(12).toString('hex');
    const sanitized = sanitizeFilename(originalName || 'upload');
    const ext = path.extname(sanitized).toLowerCase();

    return {
      secureName: `${customPrefix}_${timestamp}_${randomBytes}${ext}`,
      originalName: sanitized,
      timestamp,
      extension: ext,
      randomId: randomBytes
    };
  }

  // ✅ Validation nom de fichier sécurisée
  static validateFilename(filename) {
    if (!filename || filename.length === 0) {
      return { valid: false, reason: 'Nom de fichier vide' };
    }
    if (filename.length > UPLOAD_CONFIG.validation.maxFilenameLength) {
      return { valid: false, reason: 'Nom de fichier trop long' };
    }
    if (this.hasDoubleExtension(filename)) {
      return { valid: false, reason: 'Double extension non autorisée' };
    }
    if (this.isSvgByName(filename)) {
      return { valid: false, reason: 'SVG interdit pour sécurité' };
    }
    const ext = path.extname(filename).toLowerCase();
    if (this.isForbiddenExtension(ext)) {
      return { valid: false, reason: `Extension interdite: ${ext}` };
    }
    // Vérifier extension whitelist si fournie
    if (UPLOAD_CONFIG.allowedExtensions.length > 0 && !UPLOAD_CONFIG.allowedExtensions.includes(ext)) {
      return { valid: false, reason: `Extension non autorisée: ${ext}` };
    }
    return { valid: true };
  }

  // ✅ Nettoyage fichier sécurisé
  static async safeUnlink(filePath, reason = 'cleanup') {
    try {
      if (filePath && fsSync.existsSync(filePath)) {
        await fs.unlink(filePath);
        if (!isProd) console.log(`🗑️ Fichier supprimé (${reason}): ${path.basename(filePath)}`);
      }
    } catch (error) {
      if (!isProd) console.warn(`⚠️ Erreur suppression fichier: ${error.message}`);
    }
  }

  // ✅ Quarantaine fichier suspect
  static async quarantineFile(filePath, reason, metadata = {}) {
    try {
      const filename = path.basename(filePath);
      const quarantinePath = path.join(
        UPLOAD_CONFIG.quarantineDir,
        `quarantine_${Date.now()}_${filename}`
      );

      await fs.rename(filePath, quarantinePath);

      const logEntry = {
        timestamp: new Date().toISOString(),
        originalPath: filePath,
        quarantinePath,
        reason,
        metadata
      };

      if (!isProd) console.warn(`🚨 Fichier mis en quarantaine:`, logEntry);

      return quarantinePath;
    } catch (error) {
      if (!isProd) console.error(`❌ Erreur quarantaine: ${error.message}`);
      // Fallback: suppression si quarantaine échoue
      await this.safeUnlink(filePath, 'quarantine-fallback');
      return null;
    }
  }

  // ✅ Logging structuré upload
  static logUploadEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;

    const logEntry = {
      level: level.toUpperCase(),
      message,
      requestId,
      timestamp: new Date().toISOString(),
      component: 'UPLOAD',
      ...data
    };

    const icon = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅'
    }[level] || '📁';

    console.log(`${icon} UPLOAD ${logEntry.level}:`, JSON.stringify(logEntry));
  }

  // ✅ Métriques upload
  static recordUploadMetrics(files, processingTime, requestId) {
    const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const fileCount = files.length;

    const metrics = {
      fileCount,
      totalSize,
      averageSize: Math.round(totalSize / (fileCount || 1)),
      processingTime,
      throughput: processingTime ? Math.round(totalSize / (processingTime / 1000)) : 0, // bytes/sec
      requestId
    };

    this.logUploadEvent('info', 'Upload metrics', metrics, requestId);

    // TODO: Intégrer avec service de métriques (Prometheus, etc.)
    return metrics;
  }
}

// =====================================
// RATE LIMITING UPLOAD
// =====================================
const uploadRateLimit = rateLimitService.createCustomLimit({
  windowMs: UPLOAD_CONFIG.rateLimits.uploadRequests.window * 1000,
  max: UPLOAD_CONFIG.rateLimits.uploadRequests.limit,
  message: {
    success: false,
    error: 'Trop d\'uploads dans l\'heure',
    type: 'UPLOAD_RATE_LIMIT_EXCEEDED'
  }
});

// =====================================
// CONFIGURATION MULTER OPTIMISÉE
// =====================================

// ✅ Storage sécurisé avec logging
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await UploadUtilities.initializeDirectories();
      cb(null, UPLOAD_CONFIG.tempDir);
    } catch (error) {
      UploadUtilities.logUploadEvent('error', 'Erreur destination storage', {
        error: error.message
      }, req.requestId);
      cb(error);
    }
  },

  // ✅ Génération de nom de fichier robuste
  filename: (req, file, cb) => {
    try {
      const sanitized = sanitizeFilename(file.originalname || 'upload.jpg');
      const ext = path.extname(sanitized).toLowerCase();
      if (UploadUtilities.isForbiddenExtension(ext)) {
        return cb(new Error(`Extension interdite: ${ext}`));
      }
      const simpleName = `temp_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext || ''}`;
      UploadUtilities.logUploadEvent('debug', 'Nom de fichier généré', {
        original: file.originalname,
        saved: simpleName
      }, req.requestId);
      cb(null, simpleName);
    } catch (error) {
      UploadUtilities.logUploadEvent('error', 'Erreur génération nom', { error: error.message }, req.requestId);
      cb(error);
    }
  }
});

// ✅ Filtre fichier avec validation légère
const fileFilter = (req, file, cb) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');

  try {
    const mime = file.mimetype || '';
    const originalName = file.originalname || '';

    UploadUtilities.logUploadEvent('debug', 'Validation fichier', {
      mimetype: mime,
      originalName,
      fieldName: file.fieldname
    }, requestId);

    // Validation nom de fichier
    const nameValidation = UploadUtilities.validateFilename(originalName);
    if (!nameValidation.valid) {
      UploadUtilities.logUploadEvent('warn', 'Nom de fichier rejeté', {
        originalName,
        reason: nameValidation.reason
      }, requestId);
      return cb(new Error(nameValidation.reason), false);
    }

    // Vérification MIME type via whitelist (basée sur allowedFormats)
    if (UPLOAD_CONFIG.allowedMimeTypes.length > 0 && !UPLOAD_CONFIG.allowedMimeTypes.includes(mime)) {
      UploadUtilities.logUploadEvent('warn', 'Type MIME non autorisé', {
        mimetype: mime,
        originalName
      }, requestId);
      return cb(new Error(`Type MIME non autorisé: ${mime}`), false);
    }

    UploadUtilities.logUploadEvent('success', 'Fichier accepté pour upload', {
      mimetype: mime,
      originalName
    }, requestId);

    cb(null, true);
  } catch (error) {
    UploadUtilities.logUploadEvent('error', 'Erreur filtre fichier', {
      error: error.message
    }, requestId);
    cb(error, false);
  }
};

// ✅ Instance Multer configurée
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.maxFileSize,
    files: UPLOAD_CONFIG.maxFiles,
    fieldSize: UPLOAD_CONFIG.limits.fieldSize,
    fieldNameSize: UPLOAD_CONFIG.limits.fieldNameSize,
    fields: UPLOAD_CONFIG.limits.fields,
    parts: UPLOAD_CONFIG.limits.parts,
    headerPairs: UPLOAD_CONFIG.limits.headerPairs
  }
});

// =====================================
// POST-UPLOAD VALIDATION
// =====================================
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ✅ Vérifications post-upload sécurisées
const postUploadChecks = asyncHandler(async (req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
  const startTime = Date.now();

  try {
    const files = req.files ? (Array.isArray(req.files) ? req.files : [req.file]) :
                  req.file ? [req.file] : [];

    if (files.length === 0) {
      UploadUtilities.logUploadEvent('debug', 'Aucun fichier à valider', {}, requestId);
      return next();
    }

    UploadUtilities.logUploadEvent('info', 'Post-upload validation start', {
      fileCount: files.length,
      totalSize: files.reduce((sum, f) => sum + (f.size || 0), 0)
    }, requestId);

    // Validation de chaque fichier
    for (const file of files) {
      try {
        // 1. Vérification signature binaire
        if (UPLOAD_CONFIG.validation.enableSignatureCheck) {
          const detected = await fileTypeFromFile(file.path).catch(() => null);
          const detectedMime = detected?.mime || '';
          const detectedExt = detected?.ext ? `.${detected.ext.toLowerCase()}` : '';

          UploadUtilities.logUploadEvent('debug', 'Signature détectée', {
            filename: file.filename,
            detectedMime,
            detectedExt,
            originalMime: file.mimetype
          }, requestId);

          // Validation signature vs whitelist
          if (detectedMime && !UPLOAD_CONFIG.allowedMimeTypes.includes(detectedMime)) {
            UploadUtilities.logUploadEvent('warn', 'Signature non autorisée', {
              filename: file.filename,
              detectedMime
            }, requestId);

            if (UPLOAD_CONFIG.validation.quarantineSuspiciousFiles) {
              await UploadUtilities.quarantineFile(file.path, 'signature_mismatch', {
                detectedMime,
                originalMime: file.mimetype
              });
            } else {
              await UploadUtilities.safeUnlink(file.path, 'signature_mismatch');
            }

            return res.status(400).json({
              success: false,
              error: 'Type de fichier non autorisé (signature binaire)',
              type: 'UPLOAD_SIGNATURE_MISMATCH',
              details: {
                filename: file.originalname,
                detectedType: detectedMime
              },
              requestId,
              timestamp: new Date().toISOString()
            });
          }

          // 2. Normalisation extension si nécessaire
          if (detectedExt) {
            const currentExt = path.extname(file.filename).toLowerCase();
            if (currentExt !== detectedExt) {
              const newName = file.filename.replace(new RegExp(`${currentExt}$`), detectedExt);
              const newPath = path.join(path.dirname(file.path), newName);

              await fs.rename(file.path, newPath);
              file.filename = newName;
              file.path = newPath;

              UploadUtilities.logUploadEvent('info', 'Extension normalisée', {
                originalExt: currentExt,
                correctedExt: detectedExt,
                newFilename: newName
              }, requestId);
            }
          }

          // 3. Détection SVG/polyglot
          if (detectedMime === 'image/svg+xml') {
            UploadUtilities.logUploadEvent('warn', 'SVG détecté et rejeté', {
              filename: file.filename
            }, requestId);

            await UploadUtilities.quarantineFile(file.path, 'svg_detected', {
              detectedMime
            });

            return res.status(400).json({
              success: false,
              error: 'SVG interdit pour des raisons de sécurité',
              type: 'UPLOAD_SVG_FORBIDDEN',
              details: {
                filename: file.originalname
              },
              requestId,
              timestamp: new Date().toISOString()
            });
          }
        }

        UploadUtilities.logUploadEvent('success', 'Fichier validé', {
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype
        }, requestId);

      } catch (fileError) {
        UploadUtilities.logUploadEvent('error', 'Erreur validation fichier', {
          filename: file.filename,
          error: fileError.message
        }, requestId);

        await UploadUtilities.safeUnlink(file.path, 'validation_error');

        return res.status(400).json({
          success: false,
          error: 'Erreur validation fichier',
          type: 'UPLOAD_VALIDATION_ERROR',
          details: {
            filename: file.originalname,
            error: fileError.message
          },
          requestId,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Métriques upload
    const processingTime = Date.now() - startTime;
    UploadUtilities.recordUploadMetrics(files, processingTime, requestId);

    UploadUtilities.logUploadEvent('success', 'Post-upload validation complete', {
      fileCount: files.length,
      processingTime: `${processingTime}ms`
    }, requestId);

    next();

  } catch (error) {
    const processingTime = Date.now() - startTime;

    UploadUtilities.logUploadEvent('error', 'Erreur post-upload validation', {
      error: error.message,
      stack: !isProd ? error.stack : undefined,
      processingTime: `${processingTime}ms`
    }, requestId);

    // Nettoyage des fichiers en cas d'erreur
    const files = req.files ? (Array.isArray(req.files) ? req.files : [req.file]) :
                  req.file ? [req.file] : [];

    for (const file of files) {
      if (file?.path) {
        await UploadUtilities.safeUnlink(file.path, 'post_validation_error');
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Erreur interne lors de la validation',
      type: 'UPLOAD_POST_VALIDATION_ERROR',
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// GESTION ERREURS MULTER ENRICHIE
// =====================================
const handleMulterError = (err, req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');

  UploadUtilities.logUploadEvent('error', 'Erreur Multer', {
    errorType: err.constructor?.name,
    message: err.message,
    code: err.code
  }, requestId);

  // Nettoyage automatique des fichiers uploadés
  const filesToClean = [];
  if (req.file) filesToClean.push(req.file);
  if (req.files) {
    if (Array.isArray(req.files)) {
      filesToClean.push(...req.files);
    } else {
      Object.values(req.files).flat().forEach(file => filesToClean.push(file));
    }
  }

  // Nettoyage asynchrone (fire-and-forget)
  filesToClean.forEach(async (file) => {
    if (file?.path) await UploadUtilities.safeUnlink(file.path, 'multer_error_cleanup');
  });

  // Mapping erreurs Multer vers réponses API standardisées
  if (err instanceof multer.MulterError) {
    const errorMappings = {
      'LIMIT_FILE_SIZE': {
        status: 413,
        error: 'Fichier trop volumineux',
        type: 'FILE_TOO_LARGE',
        details: {
          maxSizeMB: Math.round(UPLOAD_CONFIG.maxFileSize / 1024 / 1024),
          maxSizeBytes: UPLOAD_CONFIG.maxFileSize
        }
      },
      'LIMIT_FILE_COUNT': {
        status: 400,
        error: 'Trop de fichiers',
        type: 'TOO_MANY_FILES',
        details: { maxFiles: UPLOAD_CONFIG.maxFiles }
      },
      'LIMIT_UNEXPECTED_FILE': {
        status: 400,
        error: 'Champ de fichier inattendu',
        type: 'UNEXPECTED_FIELD',
        details: { field: err.field || 'unknown' }
      },
      'LIMIT_FIELD_KEY': {
        status: 400,
        error: 'Nom de champ trop long',
        type: 'FIELD_NAME_TOO_LONG',
        details: { maxLength: UPLOAD_CONFIG.limits.fieldNameSize }
      },
      'LIMIT_FIELD_VALUE': {
        status: 400,
        error: 'Valeur de champ trop longue',
        type: 'FIELD_VALUE_TOO_LONG',
        details: { maxLength: UPLOAD_CONFIG.limits.fieldSize }
      },
      'LIMIT_FIELD_COUNT': {
        status: 400,
        error: 'Trop de champs',
        type: 'TOO_MANY_FIELDS',
        details: { maxFields: UPLOAD_CONFIG.limits.fields }
      },
      'LIMIT_PART_COUNT': {
        status: 400,
        error: 'Trop de parties multipart',
        type: 'TOO_MANY_PARTS',
        details: { maxParts: UPLOAD_CONFIG.limits.parts }
      }
    };

    const mapping = errorMappings[err.code] || {
      status: 400,
      error: 'Erreur upload',
      type: 'UPLOAD_ERROR',
      details: { code: err.code, message: err.message }
    };

    return res.status(mapping.status).json({
      success: false,
      error: mapping.error,
      type: mapping.type,
      details: mapping.details,
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  // Erreurs personnalisées (fileFilter, storage, etc.)
  if (err.message) {
    let status = 400;
    let type = 'UPLOAD_ERROR';

    if (err.message.includes('Type MIME non autorisé')) {
      status = 415;
      type = 'UNSUPPORTED_MEDIA_TYPE';
    } else if (err.message.includes('SVG') || err.message.includes('extension')) {
      type = 'FORBIDDEN_FILE_TYPE';
    } else if (err.message.includes('Nom de fichier')) {
      type = 'INVALID_FILENAME';
    }

    return res.status(status).json({
      success: false,
      error: err.message,
      type,
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  // Erreur générique
  return res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur',
    type: 'INTERNAL_SERVER_ERROR',
    details: !isProd ? err.message : 'Une erreur inattendue s\'est produite',
    requestId,
    timestamp: new Date().toISOString()
  });
};

// =====================================
// PIPELINES COMPOSABLES
// =====================================
class Ba7athUploadMiddleware {
  // ✅ Pipeline upload fichier unique
  static single(fieldName = 'file', options = {}) {
    const middleware = [
      uploadRateLimit,
      upload.single(fieldName),
      handleMulterError,
      postUploadChecks
    ];

    // Ajout validation forensique optionnelle
    if (options.enableForensicValidation !== false && UPLOAD_CONFIG.validation.enableForensicValidation) {
      middleware.push(forensicValidationService.validateUpload());
    }

    return middleware;
  }

  // ✅ Pipeline upload fichiers multiples
  static array(fieldName = 'files', maxCount = UPLOAD_CONFIG.maxFiles, options = {}) {
    const middleware = [
      uploadRateLimit,
      upload.array(fieldName, maxCount),
      handleMulterError,
      postUploadChecks
    ];

    if (options.enableForensicValidation !== false && UPLOAD_CONFIG.validation.enableForensicValidation) {
      middleware.push(forensicValidationService.validateUpload());
    }

    return middleware;
  }

  // ✅ Pipeline upload champs multiples
  static fields(fieldsConfig, options = {}) {
    const middleware = [
      uploadRateLimit,
      upload.fields(fieldsConfig),
      handleMulterError,
      postUploadChecks
    ];

    if (options.enableForensicValidation !== false && UPLOAD_CONFIG.validation.enableForensicValidation) {
      middleware.push(forensicValidationService.validateUpload());
    }

    return middleware;
  }

  // ✅ Upload forensique optimisé (alias principal)
  static forensicUpload(fieldName = 'file', options = {}) {
    return this.single(fieldName, {
      enableForensicValidation: true,
      ...options
    });
  }

  // ✅ Upload batch forensique
  static forensicBatch(fieldName = 'files', maxCount = UPLOAD_CONFIG.maxFiles, options = {}) {
    return this.array(fieldName, maxCount, {
      enableForensicValidation: true,
      ...options
    });
  }

  // ✅ Validation seule (sans upload)
  static validationOnly() {
    return [
      forensicValidationService.validateUpload()
    ];
  }

  // ✅ Upload avec rate limiting personnalisé
  static withCustomRateLimit(rateLimitOptions, uploadType = 'single', fieldName = 'file', maxCount = 1) {
    const customRateLimit = rateLimitService.createCustomLimit(rateLimitOptions);
    const uploadMiddleware = uploadType === 'array'
      ? upload.array(fieldName, maxCount)
      : upload.single(fieldName);

    return [
      customRateLimit,
      uploadMiddleware,
      handleMulterError,
      postUploadChecks,
      forensicValidationService.validateUpload()
    ];
  }
}

// =====================================
// INITIALISATION
// =====================================
// Initialisation des répertoires au chargement du module
UploadUtilities.initializeDirectories().catch(error => {
  console.error('❌ Erreur initialisation répertoires upload:', error);
});

// =====================================
// EXPORT MODULAIRE
// =====================================
module.exports = {
  // Pipelines principaux (API simple)
  single: Ba7athUploadMiddleware.single,
  array: Ba7athUploadMiddleware.array,
  fields: Ba7athUploadMiddleware.fields,

  // Alias forensiques
  forensicUpload: Ba7athUploadMiddleware.forensicUpload,
  forensicBatch: Ba7athUploadMiddleware.forensicBatch,

  // Suite complète
  Ba7athUploadMiddleware,

  // Composants individuels (pour usage avancé)
  multerUpload: upload,
  handleMulterError,
  postUploadChecks,
  uploadRateLimit,

  // Services
  forensicValidation: forensicValidationService.validateUpload(),

  // Utilitaires (pour tests et réutilisation)
  UploadUtilities,

  // Configuration (pour override si nécessaire)
  UPLOAD_CONFIG
};
