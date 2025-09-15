// src/utils/imageProcessor.js
"use strict";

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

class ImageProcessor {
  constructor() {
    this.version = '3.1.0-forensic';
    this.supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'avif', 'gif'];
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
    this.qualitySettings = {
      thumbnail: { quality: 80, progressive: true },
      preview: { quality: 85, progressive: true },
      optimized: { quality: 90, progressive: true }
    };
    if (process.env.NODE_ENV !== 'test') {
      console.log(`📸 Processeur d'images initialisé v${this.version}`);
    }
  }

  // ===============================
  // Thumbnails forensiques
  // ===============================
  async createForensicThumbnail(inputPath, outputDir, filename, options = {}) {
    const startTime = Date.now();
    try {
      this.validateInputs(inputPath, outputDir, filename);
      await this.ensureDirectoryExists(outputDir);
      await this.validateSourceFile(inputPath);

      const config = {
        width: 300,
        height: 300,
        fit: 'inside',
        withoutEnlargement: true,
        quality: this.qualitySettings.thumbnail.quality,
        format: 'jpeg',
        progressive: true,
        // Forensics: orientation aplanie, pas de réinjection EXIF/XMP
        preserveMetadata: false,
        backgroundFill: { r: 255, g: 255, b: 255, alpha: 1 },
        ...options
      };

      const outputPath = path.join(outputDir, filename);

      let processor = sharp(inputPath, {
        failOnError: false,
        limitInputPixels: 268402689
      })
        .rotate() // aplatit l’orientation EXIF si présente
        .resize(config.width, config.height, {
          fit: config.fit,
          withoutEnlargement: config.withoutEnlargement,
          background: config.backgroundFill
        });

      // Métadonnées: par défaut, ne rien réinjecter
      processor = config.preserveMetadata ? processor.withMetadata() : processor.withMetadata({});

      // Format de sortie
      processor = this.applyOutputFormat(processor, String(config.format || 'jpeg'), config.quality, {
        progressive: config.progressive
      });

      await this.processWithTimeout(processor, outputPath, 30000);
      const result = await this.validateOutput(outputPath, inputPath);
      const processingTime = Date.now() - startTime;

      if (process.env.NODE_ENV !== 'test') {
        console.log(`✅ Thumbnail créé: ${result.filename} (${this.formatFileSize(result.size)}, ${processingTime}ms)`);
      }

      return {
        success: true,
        outputPath,
        filename: result.filename,
        size: result.size,
        width: result.width,
        height: result.height,
        format: result.format,
        processingTime,
        originalSize: await this.getFileSize(inputPath),
        compressionRatio: result.compressionRatio
      };
    } catch (error) {
      console.error(`❌ Erreur création thumbnail: ${error.message}`);
      await this.cleanupFailedOutput(path.join(outputDir, filename));
      throw new Error(`Échec création thumbnail: ${error.message}`);
    }
  }

  // ===============================
  // Redimensionnement avancé
  // ===============================
  async resizeImageAdvanced(inputPath, outputPath, options = {}) {
    const startTime = Date.now();
    try {
      await this.validateSourceFile(inputPath);
      await this.ensureDirectoryExists(path.dirname(outputPath));

      const config = {
        width: null,
        height: null,
        fit: 'cover',
        position: 'center',
        quality: this.qualitySettings.optimized.quality,
        format: null,
        maintainAspectRatio: true,
        upscaleLimit: 2.0,
        allowUpscale: false,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        sharpen: false,
        blur: false,
        gamma: null,
        normalize: false,
        // forensics: par défaut ne pas réinjecter EXIF/XMP
        preserveMetadata: false,
        progressive: true,
        ...options
      };

      const sourceMetadata = await this.extractDetailedMetadata(inputPath);
      const targetDimensions = this.calculateOptimalDimensions(
        sourceMetadata,
        config.width,
        config.height,
        config
      );

      let processor = sharp(inputPath, {
        failOnError: false,
        limitInputPixels: 268402689
      }).rotate();

      if (targetDimensions.resize) {
        processor = processor.resize(targetDimensions.width, targetDimensions.height, {
          fit: config.fit,
          position: config.position,
          background: config.background,
          withoutEnlargement: !config.allowUpscale,
          kernel: sharp.kernel.lanczos3
        });
      }

      if (config.sharpen) processor = processor.sharpen(config.sharpen === true ? undefined : config.sharpen);
      if (config.blur) processor = processor.blur(config.blur === true ? 1 : config.blur);
      if (config.gamma) processor = processor.gamma(config.gamma);
      if (config.normalize) processor = processor.normalize();

      processor = config.preserveMetadata ? processor.withMetadata() : processor.withMetadata({});

      const outputFormat = config.format || this.detectFormatFromPath(outputPath) || sourceMetadata.format || 'jpeg';
      processor = this.applyOutputFormat(processor, String(outputFormat), config.quality, {
        progressive: config.progressive
      });

      await this.processWithTimeout(processor, outputPath, 60000);
      const result = await this.validateOutput(outputPath, inputPath);
      const processingTime = Date.now() - startTime;

      if (process.env.NODE_ENV !== 'test') {
        console.log(`✅ Image redimensionnée: ${result.width}x${result.height}, ${this.formatFileSize(result.size)} (${processingTime}ms)`);
      }

      return {
        success: true,
        inputPath,
        outputPath,
        originalDimensions: { width: sourceMetadata.width, height: sourceMetadata.height },
        newDimensions: { width: result.width, height: result.height },
        originalSize: sourceMetadata.size,
        newSize: result.size,
        compressionRatio: result.compressionRatio,
        format: result.format,
        processingTime,
        qualityPreserved: result.compressionRatio > 0.8
      };
    } catch (error) {
      console.error(`❌ Erreur redimensionnement: ${error.message}`);
      await this.cleanupFailedOutput(outputPath);
      throw new Error(`Échec redimensionnement: ${error.message}`);
    }
  }

  // ===============================
  // Optimisation forensique
  // ===============================
  async optimizeImageForensic(inputPath, outputPath, options = {}) {
    const startTime = Date.now();
    try {
      await this.validateSourceFile(inputPath);
      await this.ensureDirectoryExists(path.dirname(outputPath));

      const config = {
        quality: 85,
        progressive: true,
        stripMetadata: true, // par défaut, ne pas réinjecter EXIF/XMP
        preserveProfile: false, // conserver ICC si besoin -> set true
        lossless: false,
        targetSize: null,
        maxReduction: 0.7,
        format: null,
        ...options
      };

      const originalStats = await fs.stat(inputPath);
      const originalMetadata = await sharp(inputPath).metadata();

      let processor = sharp(inputPath, {
        failOnError: false,
        limitInputPixels: 268402689
      }).rotate();

      // Métadonnées
      processor = config.stripMetadata
        ? processor.withMetadata({})
        : processor.withMetadata();

      const targetFormat = String(config.format || originalMetadata.format || 'jpeg').toLowerCase();

      // Config du format d’export
      processor = this.applyOutputFormat(processor, targetFormat, config.quality, {
        progressive: config.progressive,
        lossless: config.lossless
      });

      let finalPath = outputPath;

      if (config.targetSize) {
        finalPath = await this.optimizeToTargetSizeByFormat(
          processor,
          outputPath,
          config.targetSize,
          originalStats.size,
          { ...config, targetFormat }
        );
      } else {
        await this.processWithTimeout(processor, outputPath, 45000);
        finalPath = outputPath;
      }

      const optimizedStats = await fs.stat(finalPath);
      const optimizedMetadata = await sharp(finalPath).metadata();

      const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size) * 100;
      const processingTime = Date.now() - startTime;

      if (reduction > config.maxReduction * 100) {
        console.warn(`⚠️ Réduction excessive: ${reduction.toFixed(1)}% > ${config.maxReduction * 100}%`);
      }

      if (process.env.NODE_ENV !== 'test') {
        console.log(`✅ Image optimisée: ${this.formatFileSize(optimizedStats.size)} (-${reduction.toFixed(1)}%, ${processingTime}ms)`);
      }

      return {
        success: true,
        inputPath,
        outputPath: finalPath,
        original: {
          size: originalStats.size,
          width: originalMetadata.width,
          height: originalMetadata.height,
          format: originalMetadata.format
        },
        optimized: {
          size: optimizedStats.size,
          width: optimizedMetadata.width,
          height: optimizedMetadata.height,
          format: optimizedMetadata.format
        },
        optimization: {
          sizeReduction: reduction,
          bytesReduced: originalStats.size - optimizedStats.size,
          qualityPreserved: reduction < 50 && optimizedMetadata.width === originalMetadata.width,
          processingTime
        }
      };
    } catch (error) {
      console.error(`❌ Erreur optimisation: ${error.message}`);
      await this.cleanupFailedOutput(outputPath);
      throw new Error(`Optimisation échouée: ${error.message}`);
    }
  }

  // ===============================
  // Métadonnées forensiques
  // ===============================
  async extractForensicMetadata(imagePath) {
    try {
      await this.validateSourceFile(imagePath);
      const sharpMetadata = await sharp(imagePath).metadata();
      const fileStats = await fs.stat(imagePath);
      const contentAnalysis = await this.analyzeImageContent(imagePath);
      const fingerprints = await this.calculateImageFingerprints(imagePath);

      const forensicMetadata = {
        basic: {
          filename: path.basename(imagePath),
          filepath: imagePath,
          size: fileStats.size,
          created: fileStats.birthtime,
          modified: fileStats.mtime,
          accessed: fileStats.atime
        },
        image: {
          format: sharpMetadata.format,
          width: sharpMetadata.width,
          height: sharpMetadata.height,
          channels: sharpMetadata.channels,
          depth: sharpMetadata.depth,
          density: sharpMetadata.density,
          space: sharpMetadata.space,
          hasAlpha: sharpMetadata.hasAlpha,
          hasProfile: sharpMetadata.hasProfile,
          isProgressive: sharpMetadata.isProgressive,
          orientation: sharpMetadata.orientation,
          chromaSubsampling: sharpMetadata.chromaSubsampling
        },
        quality: {
          estimated: this.estimateImageQuality({ ...sharpMetadata, size: fileStats.size }),
          compression: contentAnalysis.compression,
          artifactLevel: contentAnalysis.artifacts,
          sharpness: contentAnalysis.sharpness,
          noise: contentAnalysis.noise
        },
        fingerprints,
        content: {
          histogram: contentAnalysis.histogram,
          dominantColors: contentAnalysis.dominantColors,
          complexity: contentAnalysis.complexity,
          entropy: contentAnalysis.entropy
        },
        security: {
          suspiciousAspects: this.detectSuspiciousAspects(sharpMetadata, contentAnalysis),
          formatAuthenticity: this.validateFormatAuthenticity(imagePath, sharpMetadata),
          sizeConsistency: this.validateSizeConsistency(fileStats.size, sharpMetadata)
        },
        analysis: {
          extractedAt: new Date().toISOString(),
          version: this.version,
          processingTime: 0
        }
      };

      return forensicMetadata;
    } catch (error) {
      console.error(`❌ Erreur extraction métadonnées: ${error.message}`);
      throw new Error(`Extraction métadonnées échouée: ${error.message}`);
    }
  }

  // ===============================
  // Utilitaires internes
  // ===============================
  detectFormatFromPath(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const formatMap = {
      '.jpg': 'jpeg',
      '.jpeg': 'jpeg',
      '.png': 'png',
      '.webp': 'webp',
      '.tiff': 'tiff',
      '.avif': 'avif',
      '.gif': 'gif'
    };
    return formatMap[ext] || 'jpeg';
  }

  applyOutputFormat(processor, format, quality, opts = {}) {
    const q = typeof quality === 'number' ? quality : 80;
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        return processor.jpeg({
          quality: q,
          progressive: Boolean(opts.progressive),
          mozjpeg: true,
          optimiseCoding: true,
          optimizeScans: Boolean(opts.progressive)
        });
      case 'png':
        // Deux stratégies:
        // - palette (avec quality) pour réduire la palette si toléré
        // - compressionLevel fort pour lossless classique
        if (typeof quality === 'number') {
          return processor.png({
            palette: true,
            quality: q, // active palette-based quantization
            effort: 7
          });
        }
        return processor.png({
          compressionLevel: 9,
          adaptiveFiltering: true
        });
      case 'webp':
        return processor.webp({
          quality: q,
          lossless: Boolean(opts.lossless),
          nearLossless: !opts.lossless
        });
      case 'avif':
        return processor.avif({
          quality: q,
          lossless: Boolean(opts.lossless)
        });
      case 'tiff':
        return processor.tiff({
          quality: q,
          compression: 'lzw'
        });
      default:
        return processor.jpeg({
          quality: q,
          progressive: Boolean(opts.progressive),
          mozjpeg: true
        });
    }
  }

  async analyzeImageContent(imagePath) {
    try {
      const { data, info } = await sharp(imagePath)
        .limitInputPixels(268402689)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const histogram = this.calculateHistogram(data);
      const entropy = this.calculateEntropy(histogram);

      return {
        compression: this.estimateCompression(info),
        artifacts: this.estimateArtifacts(data, info),
        sharpness: this.estimateSharpness(data, info),
        noise: this.estimateNoise(data, info),
        histogram,
        dominantColors: this.findDominantColors(data, info),
        complexity: this.calculateComplexity(data),
        entropy
      };
    } catch {
      return {
        compression: 'unknown',
        artifacts: 0,
        sharpness: 0,
        noise: 0,
        histogram: [],
        dominantColors: [],
        complexity: 0,
        entropy: 0
      };
    }
  }

  async calculateImageFingerprints(imagePath) {
    try {
      const buffer = await fs.readFile(imagePath);
      const imageBuffer = await sharp(imagePath)
        .resize(8, 8, { fit: 'fill' })
        .greyscale()
        .raw()
        .toBuffer();

      return {
        md5: crypto.createHash('md5').update(buffer).digest('hex'),
        sha1: crypto.createHash('sha1').update(buffer).digest('hex'),
        sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
        perceptual: this.calculatePerceptualHash(imageBuffer),
        difference: this.calculateDifferenceHash(imageBuffer)
      };
    } catch (error) {
      return {
        md5: null,
        sha1: null,
        sha256: null,
        perceptual: null,
        difference: null,
        error: error.message
      };
    }
  }

  calculateHistogram(data) {
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i++) histogram[data[i]]++;
    return histogram;
  }

  calculateEntropy(histogram) {
    const total = histogram.reduce((sum, c) => sum + c, 0);
    let entropy = 0;
    for (const count of histogram) {
      if (count > 0) {
        const p = count / total;
        entropy -= p * Math.log2(p);
      }
    }
    return entropy;
  }

  estimateImageQuality(metadata) {
    if (metadata.format === 'png') return 100;
    if (metadata.format === 'gif') return 'lossless';
    const pixelCount = metadata.width * metadata.height;
    const bytesPerPixel = metadata.channels || 3;
    const expectedSize = pixelCount * bytesPerPixel;
    if (metadata.size) {
      const ratio = metadata.size / expectedSize;
      if (ratio > 0.3) return 95;
      if (ratio > 0.2) return 85;
      if (ratio > 0.1) return 75;
      return 60;
    }
    return 80;
  }

  estimateCompression(info) {
    if (info.format === 'png' || info.format === 'gif' || info.format === 'tiff') return 'lossless';
    if (info.format === 'jpeg') return 'lossy';
    if (info.format === 'webp') return 'mixed';
    return 'unknown';
  }

  estimateArtifacts(data, info) {
    // Placeholder simple; à remplacer par analyse DCT si nécessaire
    return Math.min(0.3, (info.width * (info.channels || 3)) / (data.length || 1) * 0.05);
  }

  estimateSharpness(data, info) {
    if (data.length < 1000) return 0.5;
    let edgeCount = 0;
    const channels = info.channels || 3;
    for (let i = channels; i < data.length - channels; i += channels) {
      const diff = Math.abs(data[i] - data[i + channels]);
      if (diff > 30) edgeCount++;
    }
    return Math.min(edgeCount / (data.length / channels), 1);
  }

  estimateNoise(data, info) {
    if (data.length < 1000) return 0;
    let variance = 0;
    const sampleSize = Math.min(10000, data.length);
    let mean = 0;
    for (let i = 0; i < sampleSize; i++) mean += data[i];
    mean /= sampleSize;
    for (let i = 0; i < sampleSize; i++) variance += Math.pow(data[i] - mean, 2);
    variance /= sampleSize;
    return Math.min(Math.sqrt(variance) / 255, 1);
  }

  findDominantColors(data, info) {
    if (!data || data.length === 0) return [];
    const colorCounts = {};
    const channels = info.channels || 3;
    for (let i = 0; i < data.length; i += channels * 10) {
      if (i + 2 < data.length) {
        const r = Math.floor(data[i] / 32) * 32;
        const g = Math.floor(data[i + 1] / 32) * 32;
        const b = Math.floor(data[i + 2] / 32) * 32;
        const color = `${r},${g},${b}`;
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }
    }
    return Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([color, count]) => ({ rgb: color, count }));
  }

  calculateComplexity(data) {
    if (!data || data.length < 100) return 0;
    let changes = 0;
    for (let i = 1; i < Math.min(1000, data.length); i++) {
      if (Math.abs(data[i] - data[i - 1]) > 10) changes++;
    }
    return changes / Math.min(1000, data.length);
  }

  calculatePerceptualHash(imageBuffer) {
    let hash = '';
    const avg = imageBuffer.reduce((s, v) => s + v, 0) / imageBuffer.length;
    for (const pixel of imageBuffer) hash += pixel > avg ? '1' : '0';
    return hash;
  }

  calculateDifferenceHash(imageBuffer) {
    let hash = '';
    for (let i = 0; i < imageBuffer.length - 1; i++) {
      hash += imageBuffer[i] > imageBuffer[i + 1] ? '1' : '0';
    }
    return hash;
  }

  detectSuspiciousAspects(metadata, contentAnalysis) {
    const aspects = [];
    if (metadata.width > 10000 || metadata.height > 10000) aspects.push('UNUSUALLY_LARGE_DIMENSIONS');
    if (contentAnalysis.entropy < 2) aspects.push('LOW_ENTROPY');
    if (contentAnalysis.complexity > 0.8) aspects.push('HIGH_COMPLEXITY');
    return aspects;
  }

  validateFormatAuthenticity(imagePath, metadata) {
    const extension = path.extname(imagePath).toLowerCase();
    const formatMap = {
      '.jpg': 'jpeg',
      '.jpeg': 'jpeg',
      '.png': 'png',
      '.webp': 'webp',
      '.tiff': 'tiff',
      '.gif': 'gif'
    };
    const expectedFormat = formatMap[extension];
    return {
      authentic: !expectedFormat || expectedFormat === metadata.format,
      expectedFormat,
      actualFormat: metadata.format,
      mismatch: Boolean(expectedFormat && expectedFormat !== metadata.format)
    };
  }

  validateSizeConsistency(fileSize, metadata) {
    const pixelCount = (metadata.width || 0) * (metadata.height || 0);
    const channels = metadata.channels || 3;
    const expectedMinSize = pixelCount * channels * 0.01;
    const expectedMaxSize = pixelCount * channels * 3;
    return {
      consistent: fileSize >= expectedMinSize && fileSize <= expectedMaxSize,
      fileSize,
      expectedRange: { min: expectedMinSize, max: expectedMaxSize },
      suspicious: fileSize < expectedMinSize * 0.1 || fileSize > expectedMaxSize * 2
    };
  }

  async optimizeToTargetSizeByFormat(processor, outputPath, targetSize, originalSize, config) {
    // Détermine le format et itère la qualité
    const fmt = String(config.targetFormat || 'jpeg').toLowerCase();
    let currentQuality = Math.min(95, Math.max(10, config.quality || 85));
    let attempt = 0;
    const maxAttempts = 10;

    while (attempt < maxAttempts) {
      const tempPath = `${outputPath}.temp.${attempt}`;
      try {
        let current = processor.clone();
        switch (fmt) {
          case 'jpeg':
          case 'jpg':
            current = current.jpeg({ quality: currentQuality, progressive: config.progressive, mozjpeg: true });
            break;
          case 'webp':
            current = current.webp({ quality: currentQuality, lossless: false, nearLossless: false });
            break;
          case 'avif':
            current = current.avif({ quality: currentQuality, lossless: false });
            break;
          case 'png':
            // Pour PNG, quality agit avec palette; sinon compressionLevel
            current =
              typeof currentQuality === 'number'
                ? current.png({ palette: true, quality: currentQuality, effort: 7 })
                : current.png({ compressionLevel: 9, adaptiveFiltering: true });
            break;
          default:
            current = current.jpeg({ quality: currentQuality, progressive: config.progressive, mozjpeg: true });
        }

        await current.toFile(tempPath);
        const stats = await fs.stat(tempPath);

        if (stats.size <= targetSize) {
          await fs.rename(tempPath, outputPath);
          return outputPath;
        }

        // prochaine tentative
        currentQuality = Math.max(10, currentQuality - 10);
        attempt++;
        await fs.unlink(tempPath).catch(() => {});
      } catch (error) {
        await fs.unlink(tempPath).catch(() => {});
        throw error;
      }
    }

    // Dernier recours à qualité minimale pour ce format
    const fallbackPath = `${outputPath}.temp.final`;
    let finalProc = processor.clone();
    switch (fmt) {
      case 'jpeg':
      case 'jpg':
        finalProc = finalProc.jpeg({ quality: 10, progressive: config.progressive, mozjpeg: true });
        break;
      case 'webp':
        finalProc = finalProc.webp({ quality: 10, lossless: false });
        break;
      case 'avif':
        finalProc = finalProc.avif({ quality: 10, lossless: false });
        break;
      case 'png':
        finalProc = finalProc.png({ palette: true, quality: 10, effort: 7 });
        break;
      default:
        finalProc = finalProc.jpeg({ quality: 10, progressive: config.progressive, mozjpeg: true });
    }
    await finalProc.toFile(fallbackPath);
    await fs.rename(fallbackPath, outputPath);
    return outputPath;
  }

  // ===============================
  // Outils généraux
  // ===============================
  validateInputs(inputPath, outputDir, filename) {
    if (!inputPath || typeof inputPath !== 'string') throw new Error('inputPath doit être une chaîne valide');
    if (!outputDir || typeof outputDir !== 'string') throw new Error('outputDir doit être une chaîne valide');
    if (!filename || typeof filename !== 'string') throw new Error('filename doit être une chaîne valide');
  }

  async ensureDirectoryExists(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw new Error(`Impossible de créer le répertoire: ${error.message}`);
    }
  }

  async validateSourceFile(filePath) {
    try {
      await fs.access(filePath);
      const stats = await fs.stat(filePath);
      if (stats.size === 0) throw new Error('Fichier vide');
      if (stats.size > this.maxFileSize) {
        throw new Error(`Fichier trop volumineux: ${this.formatFileSize(stats.size)} > ${this.formatFileSize(this.maxFileSize)}`);
      }
    } catch (error) {
      throw new Error(`Fichier source invalide: ${error.message}`);
    }
  }

  async processWithTimeout(processor, outputPath, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Timeout traitement (${timeoutMs}ms)`)), timeoutMs);
      processor
        .toFile(outputPath)
        .then(() => {
          clearTimeout(timeout);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }

  async validateOutput(outputPath, inputPath) {
    try {
      const stats = await fs.stat(outputPath);
      const metadata = await sharp(outputPath).metadata();
      const originalStats = await fs.stat(inputPath);
      return {
        filename: path.basename(outputPath),
        size: stats.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        compressionRatio: stats.size / originalStats.size
      };
    } catch (error) {
      throw new Error(`Validation sortie échouée: ${error.message}`);
    }
  }

  async cleanupFailedOutput(filePath) {
    try {
      await fs.unlink(filePath);
    } catch {
      // ignore cleanup errors
    }
  }

  async getFileSize(filePath) {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  async extractDetailedMetadata(imagePath) {
    const metadata = await sharp(imagePath).metadata();
    const stats = await fs.stat(imagePath);
    return { ...metadata, size: stats.size, created: stats.birthtime, modified: stats.mtime };
  }

  calculateOptimalDimensions(sourceMetadata, targetWidth, targetHeight, config) {
    const result = {
      width: targetWidth || sourceMetadata.width,
      height: targetHeight || sourceMetadata.height,
      resize: true
    };
    if (!targetWidth && !targetHeight) {
      result.resize = false;
      return result;
    }
    if (targetWidth && !targetHeight) {
      result.height = Math.round((sourceMetadata.height / sourceMetadata.width) * targetWidth);
    } else if (!targetWidth && targetHeight) {
      result.width = Math.round((sourceMetadata.width / sourceMetadata.height) * targetHeight);
    }
    const scaleX = result.width / sourceMetadata.width;
    const scaleY = result.height / sourceMetadata.height;
    const maxScale = Math.max(scaleX, scaleY);
    if (maxScale > (config.upscaleLimit || 2.0)) {
      result.width = Math.round(sourceMetadata.width * (config.upscaleLimit || 2.0));
      result.height = Math.round(sourceMetadata.height * (config.upscaleLimit || 2.0));
    }
    return result;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// =====================================
// Exports legacy
// =====================================
const processor = new ImageProcessor();

async function createThumbnail(inputPath, outputDir, filename, options = {}) {
  return processor.createForensicThumbnail(inputPath, outputDir, filename, options);
}
async function resizeImage(inputPath, outputPath, options = {}) {
  return processor.resizeImageAdvanced(inputPath, outputPath, options);
}
async function extractImageMetadata(imagePath) {
  return processor.extractForensicMetadata(imagePath);
}
async function optimizeImage(inputPath, outputPath, options = {}) {
  return processor.optimizeImageForensic(inputPath, outputPath, options);
}

module.exports = {
  createThumbnail,
  resizeImage,
  extractImageMetadata,
  optimizeImage,
  ImageProcessor
};
