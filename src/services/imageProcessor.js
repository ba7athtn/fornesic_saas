// src/services/imageProcessor.js
"use strict";

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const config = require('../config');

// =====================================
// SERVICE TRAITEMENT D'IMAGES FORENSIQUE
// =====================================

class ImageProcessor {
  constructor() {
    const ipCfg = config.images || {};
    this.version = ipCfg.version || '3.1.0-service';
    this.maxFileSize = ipCfg.maxFileSize || 100 * 1024 * 1024; // 100MB
    this.supportedFormats = ipCfg.supportedFormats || ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'gif', 'bmp'];
    this.thumbnail = {
      width: ipCfg.thumbnail?.width || 300,
      height: ipCfg.thumbnail?.height || 300,
      quality: ipCfg.thumbnail?.quality || 80,
      format: ipCfg.thumbnail?.format || 'jpeg',
      fit: ipCfg.thumbnail?.fit || 'inside',
      withoutEnlargement: ipCfg.thumbnail?.withoutEnlargement ?? true,
      preserveMetadata: ipCfg.thumbnail?.preserveMetadata ?? false,
      timeoutMs: ipCfg.thumbnail?.timeoutMs || 30000
    };
    this.optimization = {
      timeoutMs: ipCfg.optimization?.timeoutMs || 60000,
      defaultQuality: ipCfg.optimization?.defaultQuality || 85
    };
    this.sharpLimitPixels = ipCfg.sharp?.limitInputPixels || 268402689;
    this.sharpTimeoutSec = Math.max(1, Math.ceil((ipCfg.sharp?.timeoutMs || 15000) / 1000));

    console.log(`📸 ImageProcessor initialisé v${this.version}`);
  }

  /**
   * Création de thumbnail optimisée
   */
  async createThumbnail(inputPath, outputDir, filename, options = {}) {
    const startTime = Date.now();

    const cfg = {
      width: this.thumbnail.width,
      height: this.thumbnail.height,
      quality: this.thumbnail.quality,
      format: this.thumbnail.format,
      fit: this.thumbnail.fit,
      withoutEnlargement: this.thumbnail.withoutEnlargement,
      preserveMetadata: this.thumbnail.preserveMetadata,
      timeoutMs: this.thumbnail.timeoutMs,
      ...options
    };

    try {
      await fs.mkdir(outputDir, { recursive: true });
      const outputPath = path.join(outputDir, filename);

      await fs.access(inputPath);

      let processor = sharp(inputPath, {
        failOnError: false,
        limitInputPixels: this.sharpLimitPixels
      }).timeout({ seconds: this.sharpTimeoutSec });

      processor = processor.resize(cfg.width, cfg.height, {
        fit: cfg.fit,
        withoutEnlargement: cfg.withoutEnlargement,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      });

      switch (String(cfg.format).toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          processor = processor.jpeg({
            quality: cfg.quality,
            progressive: true,
            mozjpeg: true
          });
          break;
        case 'png':
          processor = processor.png({
            quality: cfg.quality,
            compressionLevel: 6
          });
          break;
        case 'webp':
          processor = processor.webp({ quality: cfg.quality });
          break;
        default:
          processor = processor.jpeg({ quality: cfg.quality, progressive: true });
      }

      processor = cfg.preserveMetadata ? processor.withMetadata() : processor.withMetadata({});

      await this.processWithTimeout(processor, outputPath, cfg.timeoutMs);

      const stats = await fs.stat(outputPath);
      const processingTime = Date.now() - startTime;

      return {
        success: true,
        outputPath,
        filename,
        size: stats.size,
        processingTime
      };

    } catch (error) {
      throw new Error(`Échec création thumbnail: ${error.message}`);
    }
  }

  /**
   * Extraction de métadonnées d'image
   */
  async extractImageMetadata(imagePath) {
    try {
      const metadata = await sharp(imagePath).timeout({ seconds: this.sharpTimeoutSec }).metadata();
      const stats = await fs.stat(imagePath);
      const colorAnalysis = await this.analyzeColors(imagePath);

      return {
        filename: path.basename(imagePath),
        filepath: imagePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        space: metadata.space,
        channels: metadata.channels,
        depth: metadata.depth,
        density: metadata.density,
        hasAlpha: metadata.hasAlpha,
        hasProfile: metadata.hasProfile,
        isProgressive: metadata.isProgressive,
        orientation: metadata.orientation,
        colors: colorAnalysis,
        aspectRatio: metadata.width && metadata.height ? (metadata.width / metadata.height) : null,
        megapixels: metadata.width && metadata.height ? ((metadata.width * metadata.height) / 1e6) : null,
        extractedAt: new Date().toISOString(),
        extractorVersion: this.version
      };

    } catch (error) {
      throw new Error(`Extraction métadonnées échouée: ${error.message}`);
    }
  }

  /**
   * Optimisation d'image
   */
  async optimizeImage(inputPath, outputPath, options = {}) {
    const startTime = Date.now();

    try {
      const cfg = {
        quality: this.optimization.defaultQuality,
        progressive: true,
        stripMetadata: false,
        format: null,
        maxWidth: null,
        maxHeight: null,
        timeoutMs: this.optimization.timeoutMs,
        ...options
      };

      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      const originalStats = await fs.stat(inputPath);
      const originalMetadata = await sharp(inputPath).timeout({ seconds: this.sharpTimeoutSec }).metadata();

      let processor = sharp(inputPath, {
        failOnError: false,
        limitInputPixels: this.sharpLimitPixels
      }).timeout({ seconds: this.sharpTimeoutSec });

      if (cfg.maxWidth || cfg.maxHeight) {
        processor = processor.resize(cfg.maxWidth, cfg.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      processor = cfg.stripMetadata ? processor.withMetadata({}) : processor.withMetadata();

      const outputFormat = (cfg.format || originalMetadata.format || 'jpeg').toLowerCase();

      switch (outputFormat) {
        case 'jpeg':
        case 'jpg':
          processor = processor.jpeg({
            quality: cfg.quality,
            progressive: cfg.progressive,
            mozjpeg: true,
            trellisQuantisation: true,
            overshootDeringing: true
          });
          break;
        case 'png':
          processor = processor.png({
            compressionLevel: 9,
            adaptiveFiltering: true
          });
          break;
        case 'webp':
          processor = processor.webp({
            quality: cfg.quality,
            nearLossless: true
          });
          break;
        case 'tiff':
          processor = processor.tiff({ quality: cfg.quality, compression: 'lzw' });
          break;
        default:
          processor = processor.jpeg({
            quality: cfg.quality,
            progressive: cfg.progressive
          });
      }

      await this.processWithTimeout(processor, outputPath, cfg.timeoutMs);

      const optimizedStats = await fs.stat(outputPath);
      const reduction = originalStats.size > 0
        ? ((originalStats.size - optimizedStats.size) / originalStats.size) * 100
        : 0;

      const processingTime = Date.now() - startTime;

      return {
        success: true,
        inputPath,
        outputPath,
        original: {
          size: originalStats.size,
          width: originalMetadata.width,
          height: originalMetadata.height
        },
        optimized: {
          size: optimizedStats.size
        },
        optimization: {
          sizeReduction: reduction,
          processingTime
        }
      };

    } catch (error) {
      throw new Error(`Optimisation échouée: ${error.message}`);
    }
  }

  /**
   * Redimensionnement d'image
   */
  async resizeImage(inputPath, outputPath, options = {}) {
    try {
      const cfg = {
        width: null,
        height: null,
        fit: 'cover',
        quality: 85,
        format: null,
        ...options
      };

      await fs.mkdir(path.dirname(outputPath), { recursive: true });

      let processor = sharp(inputPath).timeout({ seconds: this.sharpTimeoutSec });

      if (cfg.width || cfg.height) {
        processor = processor.resize(cfg.width, cfg.height, {
          fit: cfg.fit,
          withoutEnlargement: true
        });
      }

      if (cfg.format) {
        switch (cfg.format.toLowerCase()) {
          case 'jpeg':
          case 'jpg':
            processor = processor.jpeg({ quality: cfg.quality });
            break;
          case 'png':
            processor = processor.png();
            break;
          case 'webp':
            processor = processor.webp({ quality: cfg.quality });
            break;
        }
      }

      await processor.toFile(outputPath);

      return { success: true, outputPath };

    } catch (error) {
      throw error;
    }
  }

  // =====================================
  // MÉTHODES UTILITAIRES
  // =====================================

  async analyzeColors(imagePath) {
    try {
      // Note: sharp.stats() donne des infos de canaux; ici placeholder léger
      await sharp(imagePath).resize(8, 8).toBuffer(); // warm-up
      return { hasColors: true, analysis: 'basic_color_analysis' };
    } catch (error) {
      return { hasColors: false, error: error.message };
    }
  }

  async processWithTimeout(processor, outputPath, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Timeout processing (${timeoutMs}ms)`)), timeoutMs);
      processor.toFile(outputPath)
        .then(() => { clearTimeout(timeout); resolve(); })
        .catch((error) => { clearTimeout(timeout); reject(error); });
    });
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

// Export singleton
const imageProcessor = new ImageProcessor();

// Fonctions publiques
async function createThumbnail(inputPath, outputDir, filename, options = {}) {
  return imageProcessor.createThumbnail(inputPath, outputDir, filename, options);
}
async function extractImageMetadata(imagePath) {
  return imageProcessor.extractImageMetadata(imagePath);
}
async function optimizeImage(inputPath, outputPath, options = {}) {
  return imageProcessor.optimizeImage(inputPath, outputPath, options);
}
async function resizeImage(inputPath, outputPath, options = {}) {
  return imageProcessor.resizeImage(inputPath, outputPath, options);
}

module.exports = {
  createThumbnail,
  extractImageMetadata,
  optimizeImage,
  resizeImage,
  ImageProcessor
};
