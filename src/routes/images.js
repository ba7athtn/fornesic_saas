"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');

// ✅ CONFIG CENTRALISÉE
const config = require('../config');

// ✅ SERVICES BA7ATH OPTIMISÉS - Imports sécurisés
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const forensicValidationService = require('../services/forensicValidationService');
const imageProcessor = require('../services/imageProcessor');
const forensicService = require('../services/forensicService');

// ✅ CONTRÔLEURS - Gestion images forensiques
const {
  uploadForensicImage,
  uploadMultipleForensicImages,
  getForensicImageDetails,
  listForensicImages,
  deleteForensicImage,
  getImageStatus
} = require('../controllers/imageController');

// ✅ MIDDLEWARES - Authentication et validation
const {
  auth,
  optionalAuth,
  requireRole,
  requirePrivacyMode,
  forensicLogging
} = require('../middleware/auth');

const {
  validateForensicObjectId,
  validateForensicQuery
} = require('../middleware/validation');

// ✅ UPLOAD MIDDLEWARE - Multer sécurisé
const { single, array, forensicValidation, handleMulterError } = require('../middleware/upload');

// =====================================
// RATE LIMITING OPTIMISÉ BA7ATH
// =====================================

const uploadRateLimit = rateLimitService.upload || rateLimitService.createUploadLimit();
const downloadRateLimit = rateLimitService.download || rateLimitService.createDownloadLimit();
const adminRateLimit = rateLimitService.admin || rateLimitService.createAdminLimit();

// =====================================
/* MIDDLEWARE FACTORY - PIPELINES RÉUTILISABLES */
// =====================================

class ImageRoutesMiddleware {
  // ✅ MIDDLEWARE DEBUG SÉCURISÉ - Development uniquement
  static debugUpload = middlewareService.asyncHandler(async (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
      const contentLength = req.headers['content-length'];
      const contentType = req.headers['content-type'];
      const userAgent = req.headers['user-agent']?.substring(0, 50);

      console.log(`🔧 [${req.requestId}] Debug Upload:`, {
        contentLength: contentLength || 'Non spécifié',
        contentType: contentType || 'Non spécifié',
        userAgent: userAgent || 'Inconnu',
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString()
      });
    }
    next();
  });

  // ✅ VALIDATION SÉCURITÉ CENTRALISÉE
  static validateUploadSecurity = middlewareService.asyncHandler(async (req, res, next) => {
    // Vérifier présence fichier
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier fourni pour upload',
        type: 'NO_FILES_PROVIDED',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }

    // Validation sécurité pour fichier unique
    if (req.file) {
      const result = ImageRoutesMiddleware.validateSingleFile(req.file);
      if (!result.valid) {
        return res.status(400).json({
          success: false,
          error: result.error,
          type: result.type,
          requestId: req.requestId,
          filename: req.file.originalname
        });
      }
    }

    // Validation sécurité pour fichiers multiples
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const result = ImageRoutesMiddleware.validateSingleFile(req.files[i]);
        if (!result.valid) {
          return res.status(400).json({
            success: false,
            error: `Fichier ${i + 1}: ${result.error}`,
            type: result.type,
            requestId: req.requestId,
            fileIndex: i,
            filename: req.files[i].originalname
          });
        }
      }
    }

    next();
  });

  // ✅ VALIDATION FICHIER UNIQUE - Fonction utilitaire
  static validateSingleFile(file) {
    // Validation nom de fichier
    const sanitizedName = path.basename(file.originalname);
    if (sanitizedName !== file.originalname || file.originalname.includes('..')) {
      return {
        valid: false,
        error: 'Nom de fichier non sécurisé',
        type: 'UNSAFE_FILENAME'
      };
    }

    // Validation extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExts = (config.upload?.allowedFormats || []).map(f => (f.startsWith('.') ? f : '.' + f.toLowerCase()));
    if (!allowedExts.includes(ext)) {
      return {
        valid: false,
        error: `Extension non autorisée: ${ext}`,
        type: 'INVALID_EXTENSION'
      };
    }

    // Validation MIME type
    const allowedMimes = new Set([
      'image/jpeg', 'image/png', 'image/webp', 'image/tiff'
    ]);
    if (!allowedMimes.has(file.mimetype)) {
      return {
        valid: false,
        error: `Type MIME non autorisé: ${file.mimetype}`,
        type: 'INVALID_MIME_TYPE'
      };
    }

    // Validation taille
    const maxBytes = config.upload?.multerFileSize || config.upload?.maxFileSize || (50 * 1024 * 1024);
    if (file.size > maxBytes) {
      return {
        valid: false,
        error: `Fichier trop volumineux: ${Math.round(file.size / 1024 / 1024)}MB`,
        type: 'FILE_TOO_LARGE'
      };
    }

    return { valid: true };
  }

  // ✅ PIPELINES MIDDLEWARE RÉUTILISABLES
  static get singleUploadPipeline() {
    return [
      this.debugUpload,
      uploadRateLimit,
      optionalAuth,
      forensicLogging,
      single('image'),
      handleMulterError,
      this.validateUploadSecurity,
      forensicValidation
    ];
  }

  static get multipleUploadPipeline() {
    return [
      uploadRateLimit,
      auth,
      requireRole(['forensic_analyst', 'admin']),
      forensicLogging,
      array('images', 20),
      handleMulterError,
      this.validateUploadSecurity,
      forensicValidation
    ];
  }

  static get publicPipeline() {
    return [
      optionalAuth,
      forensicLogging,
      validateForensicQuery
    ];
  }

  static get adminPipeline() {
    return [
      auth,
      requireRole(['admin', 'forensic_admin']),
      requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
      forensicLogging,
      adminRateLimit
    ];
  }

  static get downloadPipeline() {
    return [
      auth,
      requireRole(['forensic_analyst', 'expert', 'admin']),
      requirePrivacyMode(['JUDICIAL']),
      forensicLogging,
      downloadRateLimit
    ];
  }
}

// =====================================
// GESTIONNAIRE CACHE CENTRALISÉ
// =====================================

class CacheManager {
  static generateCacheKey(baseKey, params = {}) {
    const paramsString = JSON.stringify(params);
    const hash = crypto.createHash('md5').update(paramsString).digest('hex');
    return `${baseKey}_${hash}`;
  }

  static async getWithFallback(cacheType, cacheKey, fallbackFn, ttl = (config.redis?.ttl?.cache || 3600)) {
    try {
      const cached = await cacheService.getWithType(cacheType, cacheKey);
      if (cached && cached.data) {
        return {
          ...cached.data,
          metadata: {
            ...cached.data.metadata,
            cached: true,
            cacheTime: cached.cachedAt,
            cacheAge: Math.round((Date.now() - new Date(cached.cachedAt).getTime()) / 1000)
          }
        };
      }
    } catch (cacheError) {
      console.warn(`⚠️ Erreur cache lecture ${cacheType}:`, cacheError.message);
    }

    const result = await fallbackFn();

    if (result && result.success) {
      try {
        await cacheService.setWithType(cacheType, cacheKey, {
          data: result,
          cachedAt: new Date().toISOString()
        }, ttl);
      } catch (cacheError) {
        console.warn(`⚠️ Erreur cache sauvegarde ${cacheType}:`, cacheError.message);
      }
    }

    return result;
  }

  static async invalidateImageCache(imageId) {
    const patterns = [
      `image_details_${imageId}_*`,
      `image_status_${imageId}*`,
      `image_metadata_${imageId}*`,
      `analysis_*_${imageId}_*`,
      `thumbnail_${imageId}*`,
      'image_lists_*',
      'stats_*'
    ];

    const cleanupPromises = patterns.map(pattern =>
      cacheService.deletePattern(pattern).catch(err =>
        console.warn(`⚠️ Erreur nettoyage cache pattern ${pattern}:`, err.message)
      )
    );

    await Promise.allSettled(cleanupPromises);
    console.log(`🧹 Cache nettoyé pour image: ${imageId}`);
  }
}

// =====================================
// UTILITAIRES FINAUX
// =====================================

class ImageUtilities {
  // ✅ FORMATEUR DURÉE OPTIMISÉ
  static formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h${Math.floor((seconds % 3600) / 60)}m`;
  }

  // ✅ CALCULATEUR MÉTRIQUES BATCH
  static calculateBatchMetrics(batchStatus) {
    const currentTime = new Date();
    const createdTime = new Date(batchStatus.createdAt);
    const elapsedTime = Math.round((currentTime - createdTime) / 1000);
    const completed = batchStatus.successful + batchStatus.failed;

    const estPerImageSec = Math.round((config.forensic?.analysisEstimatedMs || 30000) / 1000);

    return {
      runtime: {
        elapsed: elapsedTime,
        elapsedFormatted: this.formatDuration(elapsedTime),
        estimatedRemaining: batchStatus.status === 'processing'
          ? Math.max(0, Math.round((batchStatus.totalFiles * estPerImageSec) - elapsedTime))
          : 0
      },
      progress: {
        completed,
        total: batchStatus.totalFiles,
        percentage: Math.round((completed / batchStatus.totalFiles) * 100)
      }
    };
  }

  // ✅ INFORMATIONS SYSTÈME
  static getSystemInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: Math.round(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
      }
    };
  }
}

// =====================================
// HANDLERS MÉTIER
// =====================================

class ImageHandlers {
  // ✅ HANDLER UPLOAD UNIQUE OPTIMISÉ
  static async handleSingleUpload(req, res) {
    const startTime = Date.now();
    const uploadId = crypto.randomBytes(12).toString('hex');

    console.log(`📸 [${req.requestId}] Upload image: ${req.file?.originalname} (${Math.round((req.file?.size || 0) / 1024)}KB)`);

    let quickAnalysis = null;

    try {
      // Analyse rapide si buffer présent
      if (req.file && req.file.buffer) {
        try {
          quickAnalysis = await forensicService.analyzeImage(req.file.buffer, {
            include: { aiDetection: false, manipulation: true, physics: false, statistical: true },
            timeout: 10000
          });
          console.log(`🔍 [${req.requestId}] Analyse rapide: score ${quickAnalysis.overallScore || 0}%`);
        } catch (analysisError) {
          console.warn(`⚠️ [${req.requestId}] Erreur analyse rapide:`, analysisError.message);
        }
      }

      // Préparation contexte
      const outPath = req.file?.path || null;
      const hashBase = outPath ? `${outPath}:${req.file.size}` : `${req.file?.originalname || 'unknown'}:${req.file.size}`;
      const baseName = crypto.createHash('sha256').update(hashBase).digest('hex').substring(0, 32);

      req.uploadContext = {
        uploadId,
        quickAnalysis,
        uploadedAt: new Date().toISOString(),
        userAgent: req.headers['user-agent']?.substring(0, 100),
        ipAddress: req.ip,
        userId: req.user?.sub || 'anonymous',
        file: {
          path: outPath,
          url: outPath ? `/uploads/${path.basename(outPath)}` : undefined,
          mime: req.file?.mimetype || 'application/octet-stream',
          size: req.file?.size || 0,
          hash: baseName
        }
      };

      // Déléguer au contrôleur
      const result = await uploadForensicImage(req, res);
      const processingTime = Date.now() - startTime;
      console.log(`✅ [${req.requestId}] Upload terminé: ${uploadId} (${processingTime}ms)`);

      return result;

    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur upload:`, error);

      // Nettoyage fichier si erreur
      await ImageHandlers.cleanupFile(req.file?.path, req.requestId);

      return res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'upload d\'image',
        type: 'UPLOAD_ERROR',
        details: error.message,
        uploadId,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ✅ HANDLER UPLOAD MULTIPLE OPTIMISÉ — avec queue
  static async handleMultipleUpload(req, res) {
    const files = req.files || [];
    const batchId = crypto.randomBytes(12).toString('hex');

    console.log(`📦 [${req.requestId}] Upload batch ${batchId}: ${files.length} images par ${req.user?.sub}`);

    // Validation batch size
    const maxBatchSize = req.user?.roles?.includes('admin') ? 50 : 20;
    if (files.length > maxBatchSize) {
      return res.status(400).json({
        success: false,
        error: `Maximum ${maxBatchSize} images par batch`,
        type: 'BATCH_SIZE_EXCEEDED',
        maxSize: maxBatchSize,
        provided: files.length,
        userRole: req.user?.roles,
        requestId: req.requestId
      });
    }

    // Chargement service queue
    let analysisQueue;
    try {
      analysisQueue = require('../services/analysisQueue');
    } catch (queueError) {
      console.error(`❌ [${req.requestId}] Queue service indisponible:`, queueError.message);
      return res.status(503).json({
        success: false,
        error: 'Service de traitement batch temporairement indisponible',
        type: 'BATCH_SERVICE_UNAVAILABLE',
        requestId: req.requestId
      });
    }

    // Création des jobs
    const jobPromises = files.map(async (file, index) => {
      const imageId = crypto.randomBytes(8).toString('hex');

      try {
        const job = await analysisQueue.addAnalysisJob(`batch_${batchId}_${index}`, {
          priority: 'batch_upload',
          fileData: {
            ...file,
            originalname: path.basename(file.originalname),
            imageId
          },
          userId: req.user?.sub,
          batchId,
          uploadedAt: new Date().toISOString()
        });

        return {
          imageId,
          filename: file.originalname,
          success: true,
          jobId: job.id,
          status: 'queued',
          queuePosition: job.opts?.delay ? 'delayed' : 'active'
        };
      } catch (error) {
        console.error(`❌ [${req.requestId}] Erreur job batch ${index}:`, error.message);
        return {
          imageId,
          filename: file.originalname,
          success: false,
          error: error.message,
          type: 'JOB_CREATION_FAILED'
        };
      }
    });

    const jobResults = await Promise.allSettled(jobPromises);
    const results = jobResults.map(result =>
      result.status === 'fulfilled' ? result.value : {
        success: false,
        error: 'Promise rejected',
        type: 'PROMISE_REJECTED'
      }
    );

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    // Sauvegarde rapport batch en cache
    await ImageHandlers.saveBatchReport(batchId, {
      totalFiles: files.length,
      successful: successCount,
      failed: failureCount,
      results,
      createdBy: req.user?.sub,
      estimatedCompletion: new Date(Date.now() + (files.length * (config.forensic?.analysisEstimatedMs || 30000))).toISOString()
    }, req.requestId);

    console.log(`📊 [${req.requestId}] Batch créé ${batchId}: ${successCount}✅ ${failureCount}❌`);

    return res.status(202).json({
      success: true,
      message: `Upload batch initié: ${successCount} succès, ${failureCount} erreurs`,
      batchId,
      summary: {
        total: files.length,
        successful: successCount,
        failed: failureCount,
        status: 'processing'
      },
      results,
      tracking: {
        statusUrl: `/api/images/batch/${batchId}/status`,
        estimatedCompletion: new Date(Date.now() + (files.length * (config.forensic?.analysisEstimatedMs || 30000))).toISOString()
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }

  // ✅ CLEANUP FICHIER EN CAS D’ERREUR
  static async cleanupFile(filePath, requestId) {
    if (!filePath) return;
    try {
      await fs.unlink(filePath);
      console.log(`🧹 [${requestId}] Fichier temporaire supprimé: ${filePath}`);
    } catch (e) {
      console.warn(`⚠️ [${requestId}] Échec suppression fichier: ${filePath} -> ${e.message}`);
    }
  }

  // ✅ HANDLER LISTE D’IMAGES
  static async handleListImages(req, res) {
    try {
      const params = {
        page: parseInt(req.query.page || '1', 10),
        limit: Math.min(parseInt(req.query.limit || '20', 10), 100),
        search: (req.query.search || '').toString().trim(),
        owner: req.user?.sub || null
      };

      const cacheKey = CacheManager.generateCacheKey('image_lists', params);
      const result = await CacheManager.getWithFallback('image_lists', cacheKey, async () => {
        const data = await listForensicImages(req, res, params);
        return data;
      }, Math.min(config.redis?.ttl?.cache || 3600, 60));

      return res.json({
        ...result,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur liste images:`, error.message);
      return res.status(500).json({
        success: false,
        error: 'Erreur récupération liste images',
        type: 'IMAGE_LIST_ERROR',
        details: error.message,
        requestId: req.requestId
      });
    }
  }

  // ✅ HANDLER DÉTAILS IMAGE
  static async handleGetImageDetails(req, res) {
    const { imageId } = req.params;
    try {
      const cacheKey = CacheManager.generateCacheKey(`image_details_${imageId}`, { id: imageId });
      const result = await CacheManager.getWithFallback('image_details', cacheKey, async () => {
        const data = await getForensicImageDetails(req, res, imageId);
        return data;
      }, Math.min(config.redis?.ttl?.cache || 3600, 120));

      return res.json({
        ...result,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur détails image ${imageId}:`, error.message);
      return res.status(500).json({
        success: false,
        error: 'Erreur récupération détails image',
        type: 'IMAGE_DETAILS_ERROR',
        details: error.message,
        requestId: req.requestId
      });
    }
  }

  // ✅ HANDLER SUPPRESSION IMAGE
  static async handleDeleteImage(req, res) {
    const { imageId } = req.params;
    try {
      const result = await deleteForensicImage(req, res, imageId);
      if (result?.success) {
        await CacheManager.invalidateImageCache(imageId);
      }
      return res.json({
        ...result,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur suppression image ${imageId}:`, error.message);
      return res.status(500).json({
        success: false,
        error: 'Erreur suppression image',
        type: 'IMAGE_DELETE_ERROR',
        details: error.message,
        requestId: req.requestId
      });
    }
  }

  // ✅ HANDLER STATUT IMAGE
  static async handleGetImageStatus(req, res) {
    const { imageId } = req.params;
    try {
      const cacheKey = CacheManager.generateCacheKey(`image_status_${imageId}`, { id: imageId });
      const result = await CacheManager.getWithFallback('image_status', cacheKey, async () => {
        const data = await getImageStatus(req, res, imageId);
        return data;
      }, Math.min(config.redis?.ttl?.cache || 3600, 30));

      return res.json({
        ...result,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`❌ [${req.requestId}] Erreur statut image ${imageId}:`, error.message);
      return res.status(500).json({
        success: false,
        error: 'Erreur récupération statut image',
        type: 'IMAGE_STATUS_ERROR',
        details: error.message,
        requestId: req.requestId
      });
    }
  }

  // ✅ UTILITAIRES TÉLÉCHARGEMENT
  static getFileConfigForType(type, image) {
    const validTypes = ['original', 'thumbnail', 'processed'];
    if (!validTypes.includes(type)) {
      return {
        valid: false,
        statusCode: 400,
        error: `Type de téléchargement non supporté: ${type}`,
        type: 'INVALID_DOWNLOAD_TYPE'
      };
    }

    let filePath, contentType;
    switch (type) {
      case 'original':
        filePath = image.files?.original;
        contentType = image.mimeType || 'application/octet-stream';
        break;
      case 'thumbnail':
        filePath = image.files?.thumbnail;
        contentType = 'image/jpeg';
        break;
      case 'processed':
        filePath = image.files?.processed;
        contentType = image.mimeType || 'application/octet-stream';
        break;
    }

    if (!filePath || !fsSync.existsSync(filePath)) {
      return {
        valid: false,
        statusCode: 404,
        error: `Fichier ${type} introuvable`,
        type: 'FILE_NOT_FOUND'
      };
    }

    const filename = `${image.originalName || `image_${image._id}`}${path.extname(filePath)}`;

    return {
      valid: true,
      filePath,
      contentType,
      filename
    };
  }

  static async auditDownload(imageId, type, req) {
    const Image = require('../models/Image');
    await Image.findByIdAndUpdate(imageId, {
      $push: {
        auditLog: {
          action: 'FILE_DOWNLOADED',
          performedBy: req.user?.sub,
          timestamp: new Date(),
          details: {
            downloadType: type,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']?.substring(0, 100),
            requestId: req.requestId
          }
        }
      },
      $inc: { 'stats.downloadCount': 1 }
    });
  }

  static setSecureDownloadHeaders(res, fileConfig, image) {
    res.setHeader('Content-Type', fileConfig.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileConfig.filename}"`);
    res.setHeader('X-Download-Type', `forensic-${fileConfig.filename.split('.').pop()}`);
    res.setHeader('X-Image-Hash', image.hash?.substring(0, 16) || 'unknown');
    res.setHeader('X-Content-Security-Policy', 'default-src none');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }

  static async saveBatchReport(batchId, data, requestId) {
    try {
      await cacheService.setWithType('batch_uploads', batchId, {
        type: 'upload_batch',
        batchId,
        ...data,
        status: 'processing',
        createdAt: new Date().toISOString()
      }, Math.min(config.redis?.ttl?.cache || 3600, 7200));
    } catch (cacheError) {
      console.warn(`⚠️ [${requestId}] Erreur cache batch:`, cacheError.message);
    }
  }
}

// =====================================
// GESTIONNAIRE D'ERREURS SPÉCIALISÉ
// =====================================

class ImageErrorHandler {
  // ✅ NETTOYAGE FICHIERS AUTOMATIQUE
  static async cleanupUploadedFiles(req, requestId) {
    const cleanupPromises = [];

    // Nettoyage fichier unique
    try {
      const writtenPath = req.uploadContext?.file?.path || req.file?.path;
      if (writtenPath && fsSync.existsSync(writtenPath)) {
        cleanupPromises.push(
          fs.unlink(writtenPath)
            .then(() => console.log(`🗑️ [${requestId}] Fichier nettoyé: ${path.basename(writtenPath)}`))
            .catch(err => console.warn(`⚠️ [${requestId}] Erreur nettoyage fichier:`, err.message))
        );
      }
    } catch (cleanupError) {
      console.warn(`⚠️ [${requestId}] Erreur préparation nettoyage:`, cleanupError.message);
    }

    // Nettoyage fichiers multiples
    if (Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file, index) => {
        if (file.path && fsSync.existsSync(file.path)) {
          cleanupPromises.push(
            fs.unlink(file.path)
              .then(() => console.log(`🗑️ [${requestId}] Fichier batch nettoyé: ${file.originalname}`))
              .catch(err => console.warn(`⚠️ [${requestId}] Erreur nettoyage batch ${index}:`, err.message))
          );
        }
      });
    }

    if (cleanupPromises.length > 0) {
      await Promise.allSettled(cleanupPromises);
    }
  }

  // ✅ ENRICHISSEMENT CONTEXTE ERREUR
  static enrichErrorContext(error, req) {
    return {
      success: false,
      error: error.message || 'Erreur inconnue',
      type: error.type || 'IMAGES_ERROR',
      context: {
        route: 'images',
        method: req.method,
        path: req.path,
        hasFile: !!req.file,
        hasFiles: !!(req.files?.length > 0),
        fileCount: req.files?.length || (req.file ? 1 : 0),
        uploadSize: req.file?.size || (req.files?.reduce((sum, f) => sum + f.size, 0)) || 0,
        userId: req.user?.sub || 'anonymous',
        userRoles: req.user?.roles || []
      },
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    };
  }

  // ✅ DÉTERMINATION STATUS HTTP
  static getStatusCodeForError(error) {
    if (error.status) return error.status;
    if (error.type?.includes('VALIDATION_') || error.type?.includes('INVALID_')) return 400;
    if (error.type?.includes('UNAUTHORIZED') || error.type?.includes('ACCESS_')) return 403;
    if (error.type?.includes('NOT_FOUND')) return 404;
    if (error.type?.includes('TIMEOUT')) return 408;
    if (error.type?.includes('TOO_LARGE') || error.type?.includes('SIZE_EXCEEDED')) return 413;
    if (error.type?.includes('RATE_LIMIT')) return 429;
    if (error.type?.includes('UNAVAILABLE') || error.type?.includes('BUSY')) return 503;
    return 500;
  }
}

// =====================================
// ROUTES IMAGES
// =====================================

router.post('/upload',
  ...ImageRoutesMiddleware.singleUploadPipeline,
  middlewareService.asyncHandler(ImageHandlers.handleSingleUpload)
);

router.post('/upload/multiple',
  ...ImageRoutesMiddleware.multipleUploadPipeline,
  middlewareService.asyncHandler(ImageHandlers.handleMultipleUpload)
);

router.get('/',
  ...ImageRoutesMiddleware.publicPipeline,
  middlewareService.asyncHandler(ImageHandlers.handleListImages)
);

router.get('/:imageId',
  ...ImageRoutesMiddleware.publicPipeline,
  validateForensicObjectId('imageId'),
  middlewareService.asyncHandler(ImageHandlers.handleGetImageDetails)
);

router.delete('/:imageId',
  ...ImageRoutesMiddleware.adminPipeline,
  validateForensicObjectId('imageId'),
  middlewareService.asyncHandler(ImageHandlers.handleDeleteImage)
);

router.get('/:imageId/status',
  ...ImageRoutesMiddleware.publicPipeline,
  validateForensicObjectId('imageId'),
  middlewareService.asyncHandler(ImageHandlers.handleGetImageStatus)
);

// =====================================
// ERREUR GLOBALE
// =====================================

router.use(async (error, req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');
  console.error(`❌ [${requestId}] Erreur route images:`, error);

  // Nettoyage automatique fichiers uploadés
  await ImageErrorHandler.cleanupUploadedFiles(req, requestId);

  const enriched = ImageErrorHandler.enrichErrorContext(error, req);
  const status = ImageErrorHandler.getStatusCodeForError(enriched);

  if (!res.headersSent) {
    res.status(typeof status === 'number' ? status : 500).json({
      success: false,
      error: enriched.error,
      type: enriched.type,
      context: enriched.context,
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;

console.log('🖼️ Images routes initialisées: upload (single/multiple), list, details, delete, status.');
