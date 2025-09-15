// src/services/forensicValidationService.js
"use strict";

const sharp = require('sharp');
const { fileTypeFromBuffer } = require('file-type');
const fs = require('fs');
const path = require('path');

const config = require('../config');

class ForensicValidationService {
  constructor() {
    this.config = this.getValidationConfig();
    console.log('🔬 ForensicValidationService initialisé (version sécurisée)');
  }

  getValidationConfig() {
    const vCfg = config.upload?.validation || {};
    return {
      maxSize: Number(vCfg.maxSize || process.env.MULTER_FILE_SIZE || 10 * 1024 * 1024),
      maxFiles: Number(vCfg.maxFiles || process.env.MAX_FILES_PER_REQUEST || 5),
      allowedMimeTypes: vCfg.allowedMimeTypes || ['image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'image/webp', 'image/gif'],
      allowedExtensions: vCfg.allowedExtensions || ['jpg', 'jpeg', 'png', 'tiff', 'tif', 'bmp', 'webp', 'gif'],
      maxWidth: Number(vCfg.maxWidth || process.env.IMAGE_MAX_WIDTH || 20000),
      maxHeight: Number(vCfg.maxHeight || process.env.IMAGE_MAX_HEIGHT || 20000),
      signatureBytes: Number(vCfg.signatureBytes || process.env.SIGNATURE_READ_BYTES || 16384),
      validationTimeout: Number(vCfg.validationTimeout || process.env.VALIDATION_TIMEOUT || 30000),
      sharpTimeout: Number(vCfg.sharpTimeout || process.env.SHARP_TIMEOUT || 15000),
      requireValidation: vCfg.requireValidation ?? (process.env.FORENSIC_VALIDATION_REQUIRED === 'true'),
      suspiciousSoftware: vCfg.suspiciousSoftware || ['photoshop', 'gimp', 'paint.net', 'canva', 'midjourney', 'dall-e', 'stable diffusion']
    };
  }

  validateUpload() {
    return async (req, res, next) => {
      const startTime = Date.now();
      const cfg = this.config;

      try {
        const files = req.files || (req.file ? [req.file] : []);
        if (!files.length) {
          return res.status(400).json({
            success: false,
            error: 'Aucun fichier fourni pour analyse forensique',
            type: 'MISSING_FILES',
            timestamp: new Date().toISOString()
          });
        }

        if (files.length > cfg.maxFiles) {
          return res.status(400).json({
            success: false,
            error: `Trop de fichiers, maximum autorisé: ${cfg.maxFiles}`,
            type: 'TOO_MANY_FILES',
            timestamp: new Date().toISOString()
          });
        }

        const validationPromise = this.validateFiles(files);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout validation')), cfg.validationTimeout)
        );
        const result = await Promise.race([validationPromise, timeoutPromise]);

        if (!result.valid) {
          return res.status(400).json({
            success: false,
            error: 'Validation forensique échouée',
            type: 'FORENSIC_VALIDATION_FAILED',
            details: result.errors,
            warnings: result.warnings,
            timestamp: new Date().toISOString()
          });
        }

        req.forensicValidation = result.metadata;
        return next();

      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`❌ Erreur validation forensique (${duration}ms):`, error.message);

        if (!this.config.requireValidation) {
          console.warn('⚠️ Validation forensique échouée mais non bloquante, continuation...');
          req.forensicValidation = {
            skipped: true,
            reason: error.message,
            timestamp: new Date().toISOString()
          };
          return next();
        }

        return res.status(500).json({
          success: false,
          error: 'Erreur système validation forensique',
          type: 'VALIDATION_SYSTEM_ERROR',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          timestamp: new Date().toISOString()
        });
      }
    };
  }

  async validateFiles(files) {
    const errors = [];
    const warnings = [];
    let totalSize = 0;

    try {
      const validationPromises = files.map(async (file, idx) => {
        try {
          return await this.validateSingleFile(file, idx);
        } catch (error) {
          return {
            errors: [{
              fileIndex: idx,
              type: 'VALIDATION_ERROR',
              severity: 'critical',
              message: `Erreur validation: ${error.message}`
            }],
            warnings: []
          };
        }
      });

      const results = await Promise.allSettled(validationPromises);

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          errors.push(...result.value.errors);
          warnings.push(...result.value.warnings);
        } else {
          errors.push({
            fileIndex: idx,
            type: 'PROMISE_REJECTED',
            severity: 'critical',
            message: `Promise rejetée: ${result.reason?.message || String(result.reason)}`
          });
        }
      });

      for (const f of files) totalSize += Number(f.size || 0);

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        metadata: {
          filesCount: files.length,
          totalSize,
          averageSize: files.length > 0 ? Math.round(totalSize / files.length) : 0,
          validatedAt: new Date().toISOString(),
          securityLevel: this.calculateSecurityLevel(warnings, errors),
          riskScore: this.calculateRiskScore(warnings, errors)
        }
      };

    } catch (error) {
      return {
        valid: false,
        errors: [{
          fileIndex: -1,
          type: 'SYSTEM_ERROR',
          severity: 'critical',
          message: `Erreur système: ${error.message}`
        }],
        warnings: [],
        metadata: {
          filesCount: files.length,
          validatedAt: new Date().toISOString(),
          securityLevel: 'CRITICAL',
          riskScore: 0
        }
      };
    }
  }

  async validateSingleFile(file, index) {
    const errors = [];
    const warnings = [];
    const cfg = this.config;

    try {
      // 1) Validations de base
      try {
        if (!cfg.allowedMimeTypes.includes(file.mimetype || '')) {
          errors.push({
            fileIndex: index,
            type: 'INVALID_MIME_TYPE',
            severity: 'high',
            message: `Type MIME non autorisé: ${file.mimetype}`
          });
        }
        if (Number(file.size || 0) > cfg.maxSize) {
          errors.push({
            fileIndex: index,
            type: 'FILE_TOO_LARGE',
            severity: 'high',
            message: `Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB`
          });
        }
        if (!file.size || file.size === 0) {
          errors.push({
            fileIndex: index,
            type: 'EMPTY_FILE',
            severity: 'critical',
            message: 'Fichier vide détecté'
          });
        }
      } catch (basicError) {
        errors.push({
          fileIndex: index,
          type: 'BASIC_VALIDATION_ERROR',
          severity: 'medium',
          message: `Erreur validations de base: ${basicError.message}`
        });
      }

      // 2) Vérifications avancées si accessible
      if (file.path && fs.existsSync(file.path)) {
        try {
          await Promise.race([
            this.checkSignature(file, index, errors, warnings),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout signature')), 5000))
          ]);
        } catch (sigError) {
          warnings.push({
            fileIndex: index,
            type: 'SIGNATURE_CHECK_FAILED',
            severity: 'low',
            message: `Check signature échoué: ${sigError.message}`
          });
        }

        try {
          await Promise.race([
            this.checkIntegrity(file, index, errors, warnings),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout intégrité')), cfg.sharpTimeout))
          ]);
        } catch (integrityError) {
          warnings.push({
            fileIndex: index,
            type: 'INTEGRITY_CHECK_FAILED',
            severity: 'medium',
            message: `Check intégrité échoué: ${integrityError.message}`
          });
        }

        try {
          await this.checkExif(file, index, warnings);
        } catch (exifError) {
          // EXIF optionnel
        }
      } else {
        warnings.push({
          fileIndex: index,
          type: 'FILE_NOT_ACCESSIBLE',
          severity: 'low',
          message: 'Fichier non accessible pour vérifications avancées'
        });
      }

      return { errors, warnings };

    } catch (error) {
      return {
        errors: [{
          fileIndex: index,
          type: 'FILE_VALIDATION_ERROR',
          severity: 'critical',
          message: `Erreur critique: ${error.message}`
        }],
        warnings: []
      };
    }
  }

  async checkSignature(file, index, errors, warnings) {
    let fd = null;
    try {
      fd = await fs.promises.open(file.path, 'r');
      const { size } = await fd.stat();
      const len = Math.min(this.config.signatureBytes, size);
      const buf = Buffer.alloc(len);
      await fd.read(buf, 0, len, 0);

      const detected = await fileTypeFromBuffer(buf);
      if (!detected) {
        warnings.push({
          fileIndex: index,
          type: 'UNDETECTABLE_FILE_TYPE',
          severity: 'medium',
          message: 'Type non détectable via magic numbers'
        });
        return;
      }

      if (file.mimetype && detected.mime && file.mimetype !== detected.mime) {
        errors.push({
          fileIndex: index,
          type: 'MIME_SIGNATURE_MISMATCH',
          severity: 'high',
          message: `Discordance: déclaré ${file.mimetype}, détecté ${detected.mime}`,
          detected: detected.mime
        });
      }

      if (detected.mime === 'image/svg+xml') {
        errors.push({
          fileIndex: index,
          type: 'SVG_FORBIDDEN',
          severity: 'high',
          message: 'SVG interdit'
        });
      }

    } catch (error) {
      warnings.push({
        fileIndex: index,
        type: 'SIGNATURE_READ_ERROR',
        severity: 'low',
        message: `Erreur lecture signature: ${error.message}`
      });
    } finally {
      if (fd) {
        try { await fd.close(); } catch {}
      }
    }
  }

  async checkExif(file, index, warnings) {
    try {
      let exifr;
      try {
        exifr = require('exifr');
      } catch {
        return;
      }

      const exifData = await exifr.parse(file.path, { tiff: true, xmp: true, icc: true, iptc: true });
      if (!exifData) return;

      const sw = String(exifData.Software || '').toLowerCase();
      const hit = this.config.suspiciousSoftware.find(s => sw.includes(s));
      if (hit) {
        const severity = ['midjourney', 'dall-e', 'stable diffusion'].some(k => hit.includes(k)) ? 'high' : 'medium';
        warnings.push({
          fileIndex: index,
          type: 'SUSPICIOUS_SOFTWARE',
          severity,
          message: `Logiciel suspect EXIF: ${exifData.Software}`
        });
      }

      const critical = ['DateTimeOriginal', 'Make', 'Model', 'ExposureTime'];
      const missing = critical.filter(k => !exifData[k]);
      if (missing.length >= 3) {
        warnings.push({
          fileIndex: index,
          type: 'METADATA_MISSING',
          severity: 'medium',
          message: 'Métadonnées critiques manquantes',
          missingFields: missing
        });
      }

    } catch {
      // Ignorer erreurs EXIF
    }
  }

  async checkIntegrity(file, index, errors, warnings) {
    try {
      const meta = await sharp(file.path).timeout({ seconds: Math.ceil(this.config.sharpTimeout / 1000) }).metadata();

      if (!meta.width || !meta.height) {
        errors.push({
          fileIndex: index,
          type: 'INVALID_DIMENSIONS',
          severity: 'critical',
          message: 'Dimensions invalides ou image corrompue'
        });
        return;
      }

      if (meta.width > this.config.maxWidth || meta.height > this.config.maxHeight) {
        warnings.push({
          fileIndex: index,
          type: 'EXCESSIVE_DIMENSIONS',
          severity: 'medium',
          message: `Dimensions excessives: ${meta.width}x${meta.height}`
        });
      }

      const fmt = String(meta.format || '').toLowerCase();
      if (fmt && file.mimetype && !file.mimetype.includes(fmt)) {
        warnings.push({
          fileIndex: index,
          type: 'FORMAT_INCONSISTENCY',
          severity: 'medium',
          message: `Format incohérent: MIME ${file.mimetype} vs Format ${fmt}`
        });
      }

    } catch (error) {
      errors.push({
        fileIndex: index,
        type: 'INTEGRITY_CHECK_FAILED',
        severity: 'high',
        message: `Validation intégrité échouée: ${error.message}`
      });
    }
  }

  calculateSecurityLevel(warnings, errors) {
    const critical = errors.filter(e => e.severity === 'critical').length;
    const high = [...errors, ...warnings].filter(i => i.severity === 'high').length;
    if (critical > 0) return 'CRITICAL';
    if (high >= 2) return 'HIGH';
    if (warnings.length > 3) return 'MEDIUM';
    return 'LOW';
  }

  calculateRiskScore(warnings, errors) {
    const crit = errors.filter(e => e.severity === 'critical').length * 40;
    const high = [...errors, ...warnings].filter(i => i.severity === 'high').length * 25;
    const med = warnings.filter(w => w.severity === 'medium').length * 15;
    const low = warnings.filter(w => w.severity === 'low').length * 5;
    const total = crit + high + med + low;
    return Math.max(0, 100 - total);
  }
}

module.exports = new ForensicValidationService();
