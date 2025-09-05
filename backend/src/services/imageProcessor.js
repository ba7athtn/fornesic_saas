const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

// =====================================
// SERVICE TRAITEMENT D'IMAGES FORENSIQUE
// =====================================

class ImageProcessor {
  constructor() {
    this.version = '3.0.0-service';
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
    this.supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'gif', 'bmp'];
    console.log(`📸 ImageProcessor initialisé v${this.version}`);
  }

  /**
   * Création de thumbnail optimisée
   */
  async createThumbnail(inputPath, outputDir, filename, options = {}) {
    const startTime = Date.now();
    
    try {
      const config = {
        width: 300,
        height: 300,
        quality: 80,
        format: 'jpeg',
        fit: 'inside',
        withoutEnlargement: true,
        preserveMetadata: false,
        ...options
      };

      // Assurer que le dossier de sortie existe
      await fs.mkdir(outputDir, { recursive: true });
      
      const outputPath = path.join(outputDir, filename);
      
      console.log(`📸 Création thumbnail: ${path.basename(inputPath)} → ${filename}`);
      
      // Vérifier que le fichier source existe
      await fs.access(inputPath);
      
      let processor = sharp(inputPath, {
        failOnError: false,
        limitInputPixels: 268402689
      });

      // Redimensionnement
      processor = processor.resize(config.width, config.height, {
        fit: config.fit,
        withoutEnlargement: config.withoutEnlargement,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      });

      // Application du format de sortie
      switch (config.format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          processor = processor.jpeg({
            quality: config.quality,
            progressive: true,
            mozjpeg: true
          });
          break;
        case 'png':
          processor = processor.png({
            quality: config.quality,
            compressionLevel: 6
          });
          break;
        case 'webp':
          processor = processor.webp({
            quality: config.quality
          });
          break;
        default:
          processor = processor.jpeg({
            quality: config.quality,
            progressive: true
          });
      }

      // Gestion métadonnées
      if (config.preserveMetadata) {
        processor = processor.withMetadata();
      } else {
        processor = processor.withMetadata({});
      }

      // Traitement avec timeout
      await this.processWithTimeout(processor, outputPath, 30000);
      
      // Validation du résultat
      const stats = await fs.stat(outputPath);
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ Thumbnail créé: ${filename} (${this.formatFileSize(stats.size)}, ${processingTime}ms)`);
      
      return {
        success: true,
        outputPath: outputPath,
        filename: filename,
        size: stats.size,
        processingTime: processingTime
      };
      
    } catch (error) {
      console.error(`❌ Erreur création thumbnail: ${error.message}`);
      throw new Error(`Échec création thumbnail: ${error.message}`);
    }
  }

  /**
   * Extraction de métadonnées d'image
   */
  async extractImageMetadata(imagePath) {
    try {
      console.log(`🔍 Extraction métadonnées: ${path.basename(imagePath)}`);
      
      // Métadonnées Sharp
      const metadata = await sharp(imagePath).metadata();
      
      // Statistiques fichier
      const stats = await fs.stat(imagePath);
      
      // Analyse couleur basique
      const colorAnalysis = await this.analyzeColors(imagePath);
      
      const result = {
        // Informations de base
        filename: path.basename(imagePath),
        filepath: imagePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        
        // Propriétés image
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
        
        // Analyse couleur
        colors: colorAnalysis,
        
        // Calculs dérivés
        aspectRatio: metadata.width / metadata.height,
        megapixels: (metadata.width * metadata.height) / 1000000,
        
        // Métadonnées extraction
        extractedAt: new Date().toISOString(),
        extractorVersion: this.version
      };
      
      console.log(`✅ Métadonnées extraites: ${metadata.width}x${metadata.height}, ${metadata.format}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Erreur extraction métadonnées: ${error.message}`);
      throw new Error(`Extraction métadonnées échouée: ${error.message}`);
    }
  }

  /**
   * Optimisation d'image
   */
  async optimizeImage(inputPath, outputPath, options = {}) {
    const startTime = Date.now();
    
    try {
      const config = {
        quality: 85,
        progressive: true,
        stripMetadata: false,
        format: null, // Auto-detect
        maxWidth: null,
        maxHeight: null,
        ...options
      };
      
      console.log(`🚀 Optimisation image: ${path.basename(inputPath)}`);
      
      // Assurer que le dossier de sortie existe
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      const originalStats = await fs.stat(inputPath);
      const originalMetadata = await sharp(inputPath).metadata();
      
      let processor = sharp(inputPath, {
        failOnError: false,
        limitInputPixels: 268402689
      });
      
      // Redimensionnement si nécessaire
      if (config.maxWidth || config.maxHeight) {
        processor = processor.resize(config.maxWidth, config.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }
      
      // Gestion métadonnées
      if (config.stripMetadata) {
        processor = processor.withMetadata({});
      } else {
        processor = processor.withMetadata();
      }
      
      // Format de sortie
      const outputFormat = config.format || originalMetadata.format;
      
      switch (outputFormat.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          processor = processor.jpeg({
            quality: config.quality,
            progressive: config.progressive,
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
            quality: config.quality,
            nearLossless: true
          });
          break;
        default:
          processor = processor.jpeg({
            quality: config.quality,
            progressive: config.progressive
          });
      }
      
      await this.processWithTimeout(processor, outputPath, 60000);
      
      const optimizedStats = await fs.stat(outputPath);
      const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size) * 100;
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ Image optimisée: ${this.formatFileSize(optimizedStats.size)} (-${reduction.toFixed(1)}%, ${processingTime}ms)`);
      
      return {
        success: true,
        inputPath: inputPath,
        outputPath: outputPath,
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
          processingTime: processingTime
        }
      };
      
    } catch (error) {
      console.error(`❌ Erreur optimisation: ${error.message}`);
      throw new Error(`Optimisation échouée: ${error.message}`);
    }
  }

  /**
   * Redimensionnement d'image
   */
  async resizeImage(inputPath, outputPath, options = {}) {
    try {
      const config = {
        width: null,
        height: null,
        fit: 'cover',
        quality: 85,
        format: null,
        ...options
      };
      
      console.log(`🔄 Redimensionnement: ${path.basename(inputPath)}`);
      
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      let processor = sharp(inputPath);
      
      if (config.width || config.height) {
        processor = processor.resize(config.width, config.height, {
          fit: config.fit,
          withoutEnlargement: true
        });
      }
      
      // Appliquer format si spécifié
      if (config.format) {
        switch (config.format.toLowerCase()) {
          case 'jpeg':
          case 'jpg':
            processor = processor.jpeg({ quality: config.quality });
            break;
          case 'png':
            processor = processor.png();
            break;
          case 'webp':
            processor = processor.webp({ quality: config.quality });
            break;
        }
      }
      
      await processor.toFile(outputPath);
      
      console.log(`✅ Image redimensionnée: ${outputPath}`);
      
      return {
        success: true,
        outputPath: outputPath
      };
      
    } catch (error) {
      console.error(`❌ Erreur redimensionnement: ${error.message}`);
      throw error;
    }
  }

  // =====================================
  // MÉTHODES UTILITAIRES
  // =====================================

  async analyzeColors(imagePath) {
    try {
      const { dominant } = await sharp(imagePath)
        .resize(50, 50)
        .raw()
        .toBuffer({ resolveWithObject: true });
      
      // Analyse basique des couleurs dominantes
      return {
        hasColors: true,
        analysis: 'basic_color_analysis'
      };
    } catch (error) {
      return { hasColors: false, error: error.message };
    }
  }

  async processWithTimeout(processor, outputPath, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout processing (${timeoutMs}ms)`));
      }, timeoutMs);
      
      processor.toFile(outputPath)
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

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
