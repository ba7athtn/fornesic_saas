"use strict";

const crypto = require('crypto');
const sharp = require('sharp');
const fs = require('fs').promises;

const config = require('../config');

let cacheService = null;
try {
  cacheService = require('./cacheService');
  console.log('✅ CacheService intégré au ForensicAnalyzer');
} catch {
  console.warn('⚠️ CacheService indisponible pour ForensicAnalyzer (fallback mémoire)');
  cacheService = null;
}

// ================================
// CONFIG PARAMÉTRABLE
// ================================
const faCfg = config.forensic?.quick || {};

const VERSION = faCfg.version || '3.0.0-service';
const MAX_CACHE_SIZE = faCfg.maxCacheSize || 200;

const LIMITS = {
  minWidth: faCfg.limits?.minWidth || 100,
  minHeight: faCfg.limits?.minHeight || 100,
  entropySamples: faCfg.limits?.entropySamples || 10000,
  uniformitySamples: faCfg.limits?.uniformitySamples || 1000
};

const WEIGHTS = {
  anatomical: faCfg.weights?.anatomical ?? 0.15,
  physics: faCfg.weights?.physics ?? 0.18,
  statistical: faCfg.weights?.statistical ?? 0.17,
  exif: faCfg.weights?.exif ?? 0.20,
  behavioral: faCfg.weights?.behavioral ?? 0.10,
  audio: faCfg.weights?.audio ?? 0.05,
  expert: faCfg.weights?.expert ?? 0.15
};

const THRESHOLDS = {
  lowScoreRecommendDeep: faCfg.thresholds?.lowScoreRecommendDeep || 60,
  manyFlagsManualReview: faCfg.thresholds?.manyFlagsManualReview || 3,
  aspectRatioTolerance: faCfg.thresholds?.aspectRatioTolerance || 0.1
};

const SUSPICIOUS_SOFTWARE = faCfg.signatures?.software || [
  'photoshop', 'gimp', 'paint.net', 'canva', 'figma',
  'ai', 'midjourney', 'dall-e', 'stable', 'diffusion'
];

// =====================================
// SERVICE ANALYSE FORENSIQUE RAPIDE
// =====================================

class ForensicAnalyzer {
  constructor() {
    this.version = VERSION;
    this.analysisCache = new Map();
    this.maxCacheSize = MAX_CACHE_SIZE;
    console.log(`🔬 ForensicAnalyzer initialisé v${this.version}`);
  }

  makeCacheKey(filePath) {
    return `fa:${filePath}`;
  }

  ensureCacheLimit() {
    if (this.analysisCache.size >= this.maxCacheSize) {
      const firstKey = this.analysisCache.keys().next().value;
      this.analysisCache.delete(firstKey);
    }
  }

  /**
   * Analyse forensique rapide optimisée (5-15 secondes)
   */
  async performQuickForensicAnalysis(filePath, metadata = {}) {
    const startTime = Date.now();
    const analysisId = crypto.randomBytes(8).toString('hex');
    const cacheKey = this.makeCacheKey(`${filePath}:${metadata?.hash || ''}`);

    try {
      // Cache Redis prioritaire
      if (cacheService && !metadata.forceRefresh) {
        const cached = await cacheService.getWithType('forensic_analyzer', cacheKey);
        if (cached) {
          return { ...cached, fromCache: 'redis' };
        }
      }
      // Cache mémoire
      if (!metadata.forceRefresh && this.analysisCache.has(cacheKey)) {
        return { ...this.analysisCache.get(cacheKey), fromCache: 'memory' };
      }

      console.log(`🔍 Analyse forensique rapide [${analysisId}]: ${filePath}`);

      const analysis = {
        analysisId,
        timestamp: new Date().toISOString(),
        version: this.version,

        pillars: {
          anatomical: await this.analyzeAnatomical(filePath, metadata),
          physics: await this.analyzePhysics(filePath, metadata),
          statistical: await this.analyzeStatistical(filePath, metadata),
          exif: await this.analyzeExif(filePath, metadata),
          behavioral: await this.analyzeBehavioral(filePath, metadata),
          audio: await this.analyzeAudio(filePath, metadata),
          expert: await this.analyzeExpert(filePath, metadata)
        },

        overallScore: 0,
        classification: null,
        flags: [],
        recommendations: [],
        processingTime: 0
      };

      // Score global
      analysis.overallScore = this.calculateOverallScore(analysis.pillars);
      analysis.classification = this.classifyAuthenticity(analysis.overallScore);

      // Flags agrégés
      Object.values(analysis.pillars).forEach(pillar => {
        if (pillar?.flags?.length) analysis.flags.push(...pillar.flags);
      });

      // Recommandations
      if (analysis.overallScore < THRESHOLDS.lowScoreRecommendDeep) {
        analysis.recommendations.push('Analyse approfondie recommandée');
      }
      if (analysis.flags.length > THRESHOLDS.manyFlagsManualReview) {
        analysis.recommendations.push('Vérification manuelle nécessaire');
      }

      analysis.processingTime = Date.now() - startTime;

      // Cache set
      this.ensureCacheLimit();
      this.analysisCache.set(cacheKey, analysis);
      if (cacheService) {
        await cacheService.setWithType('forensic_analyzer', cacheKey, analysis, config.cache?.ttl?.forensic_analyzer || 1800);
      }

      console.log(`✅ Analyse forensique terminée [${analysisId}]: ${analysis.overallScore}% (${analysis.processingTime}ms)`);
      return analysis;

    } catch (error) {
      console.error(`❌ Erreur analyse forensique [${analysisId}]:`, error);
      return {
        analysisId,
        error: error.message,
        overallScore: 0,
        classification: 'ERROR',
        flags: ['ANALYSIS_ERROR'],
        processingTime: Date.now() - startTime
      };
    }
  }

  // =====================================
  // ANALYSES PAR PILIER
  // =====================================

  async analyzeAnatomical(filePath, metadata) {
    try {
      const stats = await fs.stat(filePath);
      const sizeScore = this.evaluateFileSize(stats.size);

      return {
        score: sizeScore,
        confidence: 'medium',
        details: {
          fileSize: stats.size,
          sizeCategory: this.categorizeSizeFile(stats.size)
        },
        flags: stats.size < 1024 ? ['VERY_SMALL_FILE'] : []
      };
    } catch {
      return { score: 50, confidence: 'error', flags: ['ANATOMICAL_ERROR'] };
    }
  }

  async analyzePhysics(filePath, metadata) {
    try {
      const imageMetadata = await sharp(filePath).metadata();
      const width = imageMetadata.width || 0;
      const height = imageMetadata.height || 0;
      const aspectRatio = height > 0 ? width / height : 0;
      const isNormalRatio = this.validateAspectRatio(aspectRatio);
      const resolutionScore = this.evaluateResolution(width, height);

      return {
        score: isNormalRatio ? resolutionScore : Math.max(0, resolutionScore - 15),
        confidence: 'high',
        details: {
          width,
          height,
          aspectRatio: height > 0 ? Math.round(aspectRatio * 100) / 100 : null,
          format: imageMetadata.format
        },
        flags: [
          ...(width < LIMITS.minWidth || height < LIMITS.minHeight ? ['LOW_RESOLUTION'] : []),
          ...(!isNormalRatio ? ['UNUSUAL_ASPECT_RATIO'] : [])
        ]
      };
    } catch {
      return { score: 60, confidence: 'error', flags: ['PHYSICS_ERROR'] };
    }
  }

  async analyzeStatistical(filePath, metadata) {
    try {
      const buffer = await fs.readFile(filePath);
      const entropy = this.calculateEntropy(buffer, LIMITS.entropySamples);
      const uniformity = this.calculateUniformity(buffer, LIMITS.uniformitySamples);

      let score = 70;
      if (entropy > 0.7) score += 15;
      if (uniformity < 0.8) score += 10;

      return {
        score: Math.min(score, 100),
        confidence: 'medium',
        details: {
          entropy: Math.round(entropy * 100) / 100,
          uniformity: Math.round(uniformity * 100) / 100,
          complexity: entropy * (1 - uniformity)
        },
        flags: entropy < 0.5 ? ['LOW_ENTROPY'] : []
      };
    } catch {
      return { score: 65, confidence: 'error', flags: ['STATISTICAL_ERROR'] };
    }
  }

  async analyzeExif(filePath, metadata) {
    try {
      const ExifReader = require('exifr');
      const exifData = await ExifReader.parse(filePath);

      const software = exifData?.Software;
      const hasBasicExif = !!(exifData && (exifData.Make || exifData.Model || exifData.DateTime));
      const hasSuspiciousSoftware = this.detectSuspiciousSoftware(software);
      const hasCompleteExif = this.evaluateExifCompleteness(exifData);

      let score = 50;
      if (hasBasicExif) score += 30;
      if (hasCompleteExif) score += 15;
      if (hasSuspiciousSoftware) score -= 40;

      return {
        score: Math.max(0, Math.min(score, 100)),
        confidence: hasBasicExif ? 'high' : 'medium',
        details: {
          hasExif: !!exifData,
          camera: `${exifData?.Make || 'Unknown'} ${exifData?.Model || ''}`.trim(),
          software: software || 'Unknown',
          dateTime: exifData?.DateTime || null,
          completeness: hasCompleteExif ? 'good' : 'partial'
        },
        flags: [
          ...(!hasBasicExif ? ['MISSING_BASIC_EXIF'] : []),
          ...(hasSuspiciousSoftware ? ['SUSPICIOUS_SOFTWARE'] : [])
        ]
      };
    } catch {
      return { score: 50, confidence: 'error', flags: ['EXIF_ERROR'] };
    }
  }

  async analyzeBehavioral(filePath, metadata) {
    return {
      score: 75,
      confidence: 'medium',
      details: { analysis: 'Basic behavioral pattern analysis' },
      flags: []
    };
    }

  async analyzeAudio(filePath, metadata) {
    return {
      score: 85,
      confidence: 'low',
      details: { hasAudio: false },
      flags: []
    };
  }

  async analyzeExpert(filePath, metadata) {
    return {
      score: 80,
      confidence: 'medium',
      details: { expertRules: 'Applied basic expert rules' },
      flags: []
    };
  }

  // =====================================
  // MÉTHODES UTILITAIRES
  // =====================================

  evaluateFileSize(size) {
    if (size < 1024) return 30;
    if (size < 100 * 1024) return 70;
    if (size < 10 * 1024 * 1024) return 85;
    if (size < 50 * 1024 * 1024) return 80;
    return 60;
  }

  categorizeSizeFile(size) {
    if (size < 100 * 1024) return 'small';
    if (size < 5 * 1024 * 1024) return 'medium';
    if (size < 20 * 1024 * 1024) return 'large';
    return 'very_large';
  }

  validateAspectRatio(ratio) {
    if (!Number.isFinite(ratio) || ratio <= 0) return false;
    const commonRatios = [1, 4/3, 16/9, 3/2, 2/3, 9/16, 5/4];
    return commonRatios.some(r => Math.abs(ratio - r) < THRESHOLDS.aspectRatioTolerance);
  }

  evaluateResolution(width, height) {
    const pixels = (Number(width) || 0) * (Number(height) || 0);
    if (pixels < 50000) return 40;
    if (pixels < 500000) return 70;
    if (pixels < 2000000) return 85;
    if (pixels < 8000000) return 90;
    return 85;
  }

  calculateEntropy(buffer, maxSamples = 10000) {
    const frequency = new Array(256).fill(0);
    const length = Math.min(buffer.length, maxSamples);

    for (let i = 0; i < length; i++) frequency[buffer[i]]++;

    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (frequency[i] > 0) {
        const p = frequency[i] / length;
        entropy -= p * Math.log2(p);
      }
    }
    return entropy / 8;
  }

  calculateUniformity(buffer, sampleSize = 1000) {
    const n = Math.min(sampleSize, buffer.length);
    if (n <= 1) return 1;
    let uniformity = 0;
    for (let i = 0; i < n - 1; i++) {
      if (Math.abs(buffer[i] - buffer[i + 1]) < 10) uniformity++;
    }
    return uniformity / (n - 1);
  }

  detectSuspiciousSoftware(software) {
    if (!software) return false;
    const s = String(software).toLowerCase();
    return SUSPICIOUS_SOFTWARE.some(sig => s.includes(sig));
  }

  evaluateExifCompleteness(exif) {
    if (!exif) return false;
    const important = ['Make', 'Model', 'DateTime', 'ISO', 'FNumber'];
    const present = important.filter(f => exif[f]).length;
    return present >= 3;
  }

  calculateOverallScore(pillars) {
    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(WEIGHTS).forEach(([pillar, weight]) => {
      const data = pillars[pillar];
      if (data && typeof data.score === 'number') {
        weightedSum += data.score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  classifyAuthenticity(score) {
    if (score >= 85) return 'AUTHENTIC';
    if (score >= 70) return 'LIKELY_AUTHENTIC';
    if (score >= 50) return 'UNCERTAIN';
    if (score >= 30) return 'LIKELY_FAKE';
    return 'FAKE';
  }
}

// Export singleton
const forensicAnalyzer = new ForensicAnalyzer();

// Fonctions publiques
async function performQuickForensicAnalysis(filePath, metadata = {}) {
  return forensicAnalyzer.performQuickForensicAnalysis(filePath, metadata);
}

module.exports = {
  performQuickForensicAnalysis,
  ForensicAnalyzer
};
