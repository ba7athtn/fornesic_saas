const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const fileType = require('file-type');
const sanitize = require('sanitize-filename');
const sharp = require('sharp');

// =====================================
// CONFIGURATION ENVIRONNEMENT - LIMITES ÉLEVÉES
// =====================================

const uploadConfig = {
  tempDir: process.env.UPLOAD_TEMP_DIR || path.join(__dirname, '../../../uploads/temp'),
  processedDir: process.env.UPLOAD_PROCESSED_DIR || path.join(__dirname, '../../../uploads/processed'),
  quarantineDir: process.env.UPLOAD_QUARANTINE_DIR || path.join(__dirname, '../../../uploads/quarantine'),
  maxFileSize: parseInt(process.env.MULTER_FILE_SIZE) || 524288000, // ✅ 500MB en bytes
  maxFiles: parseInt(process.env.MAX_FILES_PER_REQUEST) || 10,
  allowedFormats: (process.env.ALLOWED_FORMATS || 'jpg,jpeg,png,tiff,tif,webp,raw,dng,cr2,nef,arw,orf,bmp,gif').split(',').map(f => f.trim().toLowerCase())
};

// =====================================
// CRÉATION STRUCTURE DOSSIERS SÉCURISÉE
// =====================================

const createSecureDirectories = () => {
  const dirs = [
    uploadConfig.tempDir,
    uploadConfig.processedDir,
    uploadConfig.quarantineDir,
    path.join(uploadConfig.tempDir, '../thumbnails'),
    path.join(uploadConfig.tempDir, '../reports')
  ];

  dirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
          mode: 0o755
        });
        console.log(`📁 Dossier sécurisé créé: ${dir}`);
        
        const gitkeepPath = path.join(dir, '.gitkeep');
        if (!fs.existsSync(gitkeepPath)) {
          fs.writeFileSync(gitkeepPath, '');
        }
      }
    } catch (error) {
      console.error(`❌ Erreur création dossier ${dir}:`, error);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  });
};

createSecureDirectories();

// =====================================
// VALIDATION AVANCÉE FICHIERS
// =====================================

const advancedFileValidation = {
  async verifyMagicNumbers(buffer, mimeType) {
    const detectedType = await fileType.fromBuffer(buffer);
    
    if (!detectedType) {
      return { valid: false, reason: 'Type de fichier non détectable' };
    }

    const mimeMapping = {
      'image/jpeg': ['jpg', 'jpeg'],
      'image/png': ['png'],
      'image/tiff': ['tiff', 'tif'],
      'image/webp': ['webp'],
      'image/bmp': ['bmp'],
      'image/gif': ['gif']
    };

    const expectedExts = mimeMapping[mimeType] || [];
    if (!expectedExts.includes(detectedType.ext)) {
      return {
        valid: false,
        reason: `Discordance type: déclaré ${mimeType}, détecté ${detectedType.mime}`,
        detected: detectedType
      };
    }

    return { valid: true, detected: detectedType };
  },

  async analyzeExifSafety(filePath) {
    try {
      const exifr = require('exifr');
      const exifData = await exifr.parse(filePath, {
        tiff: true,
        xmp: true,
        icc: true,
        iptc: true
      });

      const risks = [];

      const suspiciousSoftware = [
        'photoshop', 'gimp', 'paint.net', 'canva', 'midjourney',
        'dall-e', 'stable diffusion', 'firefly', 'leonardo'
      ];

      if (exifData?.Software) {
        const software = exifData.Software.toLowerCase();
        const foundSuspicious = suspiciousSoftware.find(s => software.includes(s));
        
        if (foundSuspicious) {
          risks.push({
            type: 'SUSPICIOUS_SOFTWARE',
            severity: 'high',
            details: `Logiciel détecté: ${exifData.Software}`,
            software: foundSuspicious
          });
        }
      }

      const criticalFields = ['DateTimeOriginal', 'Make', 'Model'];
      const missingFields = criticalFields.filter(field => !exifData?.[field]);
      
      if (missingFields.length === criticalFields.length) {
        risks.push({
          type: 'METADATA_MISSING',
          severity: 'medium',
          details: 'Métadonnées EXIF critiques manquantes'
        });
      }

      return {
        safe: risks.length === 0,
        risks: risks,
        exifData: exifData || {}
      };

    } catch (error) {
      return {
        safe: false,
        risks: [{
          type: 'EXIF_READ_ERROR',
          severity: 'low',
          details: 'Impossible de lire les métadonnées EXIF'
        }],
        exifData: {}
      };
    }
  },

  async scanForThreats(filePath) {
    try {
      const buffer = fs.readFileSync(filePath);
      const threats = [];

      const malwareSignatures = [
        /\x4d\x5a/g, // Executable PE header
        /\x7f\x45\x4c\x46/g, // ELF header
        /\x50\x4b\x03\x04/g, // ZIP header (potentiel polyglot)
        /\x25\x50\x44\x46/g, // PDF header
        /%PDF-/g, // PDF signature
        /\x89PNG/g // PNG avec données suspectes
      ];

      malwareSignatures.forEach((signature, index) => {
        const matches = buffer.toString('binary').match(signature);
        if (matches && matches.length > 1) {
          threats.push({
            type: 'SUSPICIOUS_BINARY_PATTERN',
            severity: 'high',
            details: `Pattern suspect détecté: ${signature.source}`,
            occurrences: matches.length
          });
        }
      });

      const suspiciousStrings = ['eval(', 'exec(', '<script>', 'javascript:', 'data:'];
      const contentStr = buffer.toString('ascii', 0, Math.min(buffer.length, 10000));
      
      suspiciousStrings.forEach(str => {
        if (contentStr.includes(str)) {
          threats.push({
            type: 'SUSPICIOUS_CODE_INJECTION',
            severity: 'critical',
            details: `Code suspect trouvé: ${str}`
          });
        }
      });

      return {
        safe: threats.length === 0,
        threats: threats,
        scannedBytes: buffer.length
      };

    } catch (error) {
      return {
        safe: false,
        threats: [{
          type: 'SCAN_ERROR',
          severity: 'medium',
          details: 'Impossible de scanner le fichier'
        }],
        scannedBytes: 0
      };
    }
  },

  async validateImageIntegrity(filePath) {
    try {
      const metadata = await sharp(filePath).metadata();
      const issues = [];

      if (!metadata.width || !metadata.height) {
        issues.push({
          type: 'INVALID_DIMENSIONS',
          severity: 'high',
          details: 'Dimensions invalides ou corrompues'
        });
      }

      if (metadata.width > 50000 || metadata.height > 50000) {
        issues.push({
          type: 'EXCESSIVE_DIMENSIONS',
          severity: 'medium',
          details: `Dimensions excessives: ${metadata.width}x${metadata.height}`
        });
      }

      if (metadata.density && (metadata.density > 10000 || metadata.density < 1)) {
        issues.push({
          type: 'SUSPICIOUS_DENSITY',
          severity: 'low',
          details: `Densité suspecte: ${metadata.density}`
        });
      }

      return {
        valid: issues.length === 0,
        issues: issues,
        metadata: metadata
      };

    } catch (error) {
      return {
        valid: false,
        issues: [{
          type: 'CORRUPTION_ERROR',
          severity: 'critical',
          details: `Image corrompue: ${error.message}`
        }],
        metadata: null
      };
    }
  }
};

// =====================================
// CONFIGURATION MULTER SÉCURISÉE - LIMITES ÉLEVÉES
// =====================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadConfig.tempDir)) {
      try {
        fs.mkdirSync(uploadConfig.tempDir, { recursive: true, mode: 0o755 });
      } catch (error) {
        return cb(new Error('Impossible de créer le dossier temporaire'));
      }
    }
    cb(null, uploadConfig.tempDir);
  },

  filename: (req, file, cb) => {
    try {
      const timestamp = Date.now();
      const randomBytes = crypto.randomBytes(12).toString('hex');
      const sanitizedName = sanitize(file.originalname);
      const extension = path.extname(sanitizedName).toLowerCase();
      
      if (!uploadConfig.allowedFormats.includes(extension.substring(1))) {
        return cb(new Error(`Extension non autorisée: ${extension}`));
      }

      const secureName = `upload_${timestamp}_${randomBytes}${extension}`;
      
      req.uploadMeta = {
        originalName: sanitizedName,
        secureName: secureName,
        timestamp: timestamp,
        extension: extension
      };

      cb(null, secureName);

    } catch (error) {
      cb(new Error(`Erreur génération nom fichier: ${error.message}`));
    }
  }
});

const fileFilter = async (req, file, cb) => {
  try {
    console.log(`🔍 Validation fichier: ${file.originalname} (${file.mimetype})`);

    const allowedMimes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/tiff',
      'image/webp', 'image/bmp', 'image/gif'
    ];

    if (!allowedMimes.includes(file.mimetype)) {
      console.log(`❌ MIME type rejeté: ${file.mimetype}`);
      return cb(new Error(`Type MIME non autorisé: ${file.mimetype}`), false);
    }

    const sanitizedName = sanitize(file.originalname);
    if (!sanitizedName || sanitizedName.length === 0) {
      return cb(new Error('Nom de fichier invalide'), false);
    }

    const extension = path.extname(sanitizedName).toLowerCase().substring(1);
    if (!uploadConfig.allowedFormats.includes(extension)) {
      return cb(new Error(`Extension non autorisée: .${extension}`), false);
    }

    if (file.size && file.size > uploadConfig.maxFileSize) {
      return cb(new Error(`Fichier trop volumineux: ${file.size} bytes`), false);
    }

    console.log(`✅ Validation fichier réussie: ${file.originalname} (${file.mimetype})`);
    cb(null, true);

  } catch (error) {
    console.error('❌ Erreur validation fichier:', error);
    cb(new Error(`Erreur validation: ${error.message}`), false);
  }
};

// Configuration Multer complète avec limites TRÈS ÉLEVÉES
const multerConfig = {
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: uploadConfig.maxFileSize, // ✅ 500MB
    files: uploadConfig.maxFiles, // 10 fichiers max
    fieldSize: 100 * 1024 * 1024, // ✅ 100MB pour les champs
    fieldNameSize: 2000, // ✅ 2KB pour noms de champs
    fields: 100, // ✅ 100 champs max
    parts: 200, // ✅ 200 parties multipart max
    headerPairs: 2000 // ✅ Plus de headers autorisés
  }
};

console.log(`✅ Configuration Multer: fileSize=${Math.round(uploadConfig.maxFileSize/1024/1024)}MB, files=${uploadConfig.maxFiles}`);

// =====================================
// MIDDLEWARE POST-UPLOAD VALIDATION
// =====================================

const postUploadValidation = async (req, res, next) => {
  if (!req.file) return next();

  const validationId = crypto.randomBytes(8).toString('hex');
  console.log(`🔍 Post-validation démarrée [${validationId}]: ${req.file.filename}`);

  try {
    const filePath = req.file.path;
    const validationResults = {
      validationId: validationId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      timestamp: new Date().toISOString(),
      checks: {}
    };

    console.log(`🔍 Vérification signatures magiques [${validationId}]`);
    const buffer = fs.readFileSync(filePath);
    const magicValidation = await advancedFileValidation.verifyMagicNumbers(buffer, req.file.mimetype);
    validationResults.checks.magicNumbers = magicValidation;

    if (!magicValidation.valid) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: 'Validation fichier échouée',
        details: magicValidation.reason,
        type: 'MAGIC_NUMBER_MISMATCH'
      });
    }

    console.log(`🛡️ Scan sécurité [${validationId}]`);
    const threatScan = await advancedFileValidation.scanForThreats(filePath);
    validationResults.checks.threatScan = threatScan;

    if (!threatScan.safe) {
      const criticalThreats = threatScan.threats.filter(t => t.severity === 'critical');
      if (criticalThreats.length > 0) {
        const quarantinePath = path.join(uploadConfig.quarantineDir, req.file.filename);
        fs.renameSync(filePath, quarantinePath);
        
        console.log(`🚨 Fichier mis en quarantaine: ${req.file.filename}`);
        return res.status(400).json({
          error: 'Fichier suspect détecté',
          details: 'Le fichier contient des éléments potentiellement dangereux',
          type: 'SECURITY_THREAT_DETECTED',
          quarantined: true
        });
      }
    }

    console.log(`🖼️ Validation intégrité image [${validationId}]`);
    const integrityValidation = await advancedFileValidation.validateImageIntegrity(filePath);
    validationResults.checks.integrity = integrityValidation;

    if (!integrityValidation.valid) {
      const criticalIssues = integrityValidation.issues.filter(i => i.severity === 'critical');
      if (criticalIssues.length > 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({
          error: 'Image corrompue',
          details: 'L\'image ne peut pas être traitée car elle est corrompue',
          type: 'IMAGE_CORRUPTION'
        });
      }
    }

    console.log(`📊 Analyse EXIF sécurité [${validationId}]`);
    const exifAnalysis = await advancedFileValidation.analyzeExifSafety(filePath);
    validationResults.checks.exifSafety = exifAnalysis;

    req.validationResults = validationResults;

    console.log(`✅ Post-validation terminée [${validationId}]: ${validationResults.checks.magicNumbers.valid ? 'VALID' : 'INVALID'}`);
    next();

  } catch (error) {
    console.error(`❌ Erreur post-validation [${validationId}]:`, error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Erreur validation post-upload',
      details: error.message,
      type: 'POST_VALIDATION_ERROR'
    });
  }
};

// =====================================
// GESTION D'ERREURS MULTER SPÉCIALISÉE
// =====================================

const handleMulterError = (err, req, res, next) => {
  console.error('❌ Erreur Multer:', err);

  if (req.file && fs.existsSync(req.file.path)) {
    try {
      fs.unlinkSync(req.file.path);
      console.log('🗑️ Fichier temporaire nettoyé après erreur');
    } catch (cleanupError) {
      console.error('⚠️ Erreur nettoyage fichier:', cleanupError);
    }
  }

  if (req.files) {
    req.files.forEach(file => {
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error('⚠️ Erreur nettoyage fichier multiple:', cleanupError);
        }
      }
    });
  }

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({
          error: 'Fichier trop volumineux',
          maxSize: `${Math.round(uploadConfig.maxFileSize / 1024 / 1024)}MB`,
          receivedSize: err.field ? `${Math.round(err.field / 1024 / 1024)}MB` : 'Inconnu',
          type: 'FILE_TOO_LARGE',
          code: 'LIMIT_FILE_SIZE'
        });

      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          error: 'Trop de fichiers',
          maxFiles: uploadConfig.maxFiles,
          type: 'TOO_MANY_FILES',
          code: 'LIMIT_FILE_COUNT'
        });

      case 'LIMIT_FIELD_COUNT':
        return res.status(400).json({
          error: 'Trop de champs',
          type: 'TOO_MANY_FIELDS',
          code: 'LIMIT_FIELD_COUNT'
        });

      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Champ de fichier inattendu',
          field: err.field,
          type: 'UNEXPECTED_FILE',
          code: 'LIMIT_UNEXPECTED_FILE'
        });

      case 'LIMIT_PART_COUNT':
        return res.status(400).json({
          error: 'Trop de parties dans la requête',
          type: 'TOO_MANY_PARTS',
          code: 'LIMIT_PART_COUNT'
        });

      default:
        return res.status(400).json({
          error: 'Erreur upload',
          details: err.message,
          type: 'MULTER_ERROR',
          code: err.code
        });
    }
  }

  res.status(400).json({
    error: 'Erreur upload',
    details: err.message,
    type: 'UPLOAD_ERROR'
  });
};

// =====================================
// MIDDLEWARE EXPORTS
// =====================================

const single = (fieldName) => {
  const upload = multer(multerConfig).single(fieldName);
  
  return [
    upload,
    handleMulterError,
    postUploadValidation
  ];
};

const array = (fieldName, maxCount = uploadConfig.maxFiles) => {
  const upload = multer(multerConfig).array(fieldName, maxCount);
  
  return [
    upload,
    handleMulterError,
    postUploadValidation
  ];
};

const forensicUpload = single;

module.exports = {
  single,
  array,
  forensicUpload,
  uploadConfig,
  advancedFileValidation,
  postUploadValidation,
  handleMulterError
};
