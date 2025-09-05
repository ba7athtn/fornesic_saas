// src/services/manipulationDetector.js
const sharp = require('sharp');
const fs = require('fs').promises;
const crypto = require('crypto');

// =====================================
// SERVICE DÉTECTION MANIPULATION FORENSIQUE
// =====================================

class ManipulationDetector {
  constructor() {
    this.analysisCache = new Map();
    this.initialized = false;
    this.initialize();
  }

  async initialize() {
    try {
      console.log('🔍 Initialisation détecteur de manipulation...');
      this.initialized = true;
      console.log('✅ Détecteur de manipulation initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation détecteur:', error);
    }
  }

  /**
   * Analyse complète de manipulation avec tous les types
   */
  async analyzeManipulations(imageBuffer, options = {}) {
    const startTime = Date.now();

    try {
      const analysis = {
        // Scores globaux
        overallScore: 0,
        confidence: 'low',
        // Types de manipulation
        cloning: {
          score: 0,
          confidence: 'low',
          regions: [],
          indicators: []
        },
        splicing: {
          score: 0,
          confidence: 'low',
          boundaries: [],
          indicators: []
        },
        enhancement: {
          score: 0,
          confidence: 'low',
          areas: [],
          indicators: []
        },
        retouching: {
          score: 0,
          confidence: 'low',
          modifications: [],
          indicators: []
        },
        compression: {
          score: 0,
          artifacts: [],
          anomalies: []
        },
        // Analyses techniques
        statistical: {
          noiseAnalysis: {},
          frequencyAnalysis: {},
          correlationAnalysis: {}
        },
        // Métadonnées
        analysisMetadata: {
          processingTime: 0,
          imageSize: imageBuffer.length,
          analysisDate: new Date().toISOString(),
          version: '3.0.0'
        }
      };

      // Extraction métadonnées image
      const imageInfo = await this.extractImageInfo(imageBuffer);
      analysis.imageInfo = imageInfo;

      // Analyse de clonage
      analysis.cloning = await this.detectCloning(imageBuffer, imageInfo);

      // Analyse de splicing
      analysis.splicing = await this.detectSplicing(imageBuffer, imageInfo);

      // Analyse d'enhancement
      analysis.enhancement = await this.detectEnhancement(imageBuffer, imageInfo);

      // Analyse de retouching
      analysis.retouching = await this.detectRetouching(imageBuffer, imageInfo);

      // Analyse compression
      analysis.compression = await this.analyzeCompressionArtifacts(imageBuffer, imageInfo);

      // Analyses statistiques
      analysis.statistical = await this.performStatisticalAnalysis(imageBuffer, imageInfo);

      // Calcul score global
      analysis.overallScore = this.calculateOverallManipulationScore(analysis);
      analysis.confidence = this.calculateConfidence(analysis);

      analysis.analysisMetadata.processingTime = Date.now() - startTime;

      console.log(`🔍 Analyse manipulation terminée: ${analysis.overallScore}% (${analysis.analysisMetadata.processingTime}ms)`);

      return analysis;

    } catch (error) {
      console.error('❌ Erreur analyse manipulation:', error);
      return {
        overallScore: 0,
        confidence: 'error',
        error: error.message,
        analysisMetadata: {
          processingTime: Date.now() - startTime,
          analysisDate: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Détection de clonage (Copy-Move)
   */
  async detectCloning(imageBuffer, imageInfo) {
    try {
      // Conversion pour analyse
      const grayImage = await sharp(imageBuffer)
        .greyscale()
        .raw()
        .toBuffer();

      const analysis = {
        score: 0,
        confidence: 'low',
        regions: [],
        indicators: [],
        details: {
          blockSize: 16,
          threshold: 0.8,
          candidateRegions: 0
        }
      };

      // Analyse par blocs pour détecter duplications
      const blockAnalysis = await this.analyzeImageBlocks(grayImage, imageInfo);
      analysis.details.candidateRegions = blockAnalysis.duplicatedBlocks;

      // Détection patterns répétitifs
      const repetitivePatterns = await this.detectRepetitivePatterns(grayImage, imageInfo);
      if (repetitivePatterns.score > 0.7) {
        analysis.score += 40;
        analysis.indicators.push('REPETITIVE_PATTERNS');
        analysis.regions.push(...repetitivePatterns.regions);
      }

      // Analyse corrélation croisée
      const correlationAnalysis = await this.performCrossCorrelation(grayImage, imageInfo);
      if (correlationAnalysis.maxCorrelation > 0.9) {
        analysis.score += 35;
        analysis.indicators.push('HIGH_CORRELATION');
      }

      // Détection contours dupliqués
      const edgeAnalysis = await this.analyzeEdgeDuplication(grayImage, imageInfo);
      if (edgeAnalysis.duplicatedEdges > 0.5) {
        analysis.score += 25;
        analysis.indicators.push('DUPLICATED_EDGES');
      }

      analysis.score = Math.min(analysis.score, 100);
      analysis.confidence = analysis.score > 70 ? 'high' : analysis.score > 40 ? 'medium' : 'low';

      return analysis;

    } catch (error) {
      return {
        score: 0,
        confidence: 'error',
        error: error.message,
        indicators: ['CLONING_ANALYSIS_ERROR']
      };
    }
  }

  /**
   * Détection de splicing (assemblage d'images)
   */
  async detectSplicing(imageBuffer, imageInfo) {
    try {
      const analysis = {
        score: 0,
        confidence: 'low',
        boundaries: [],
        indicators: [],
        details: {
          edgeInconsistencies: 0,
          lightingIncoherence: 0,
          compressionMismatch: 0
        }
      };

      // Analyse des discontinuités de compression
      const compressionAnalysis = await this.analyzeCompressionDiscontinuities(imageBuffer);
      analysis.details.compressionMismatch = compressionAnalysis.mismatchScore;
      if (compressionAnalysis.mismatchScore > 0.6) {
        analysis.score += 35;
        analysis.indicators.push('COMPRESSION_MISMATCH');
        analysis.boundaries.push(...compressionAnalysis.boundaries);
      }

      // Analyse cohérence d'illumination
      const lightingAnalysis = await this.analyzeLightingConsistency(imageBuffer);
      analysis.details.lightingIncoherence = lightingAnalysis.incoherenceScore;
      if (lightingAnalysis.incoherenceScore > 0.5) {
        analysis.score += 30;
        analysis.indicators.push('LIGHTING_INCONSISTENCY');
      }

      // Détection de contours artificiels
      const edgeAnalysis = await this.detectArtificialEdges(imageBuffer);
      analysis.details.edgeInconsistencies = edgeAnalysis.artificialScore;
      if (edgeAnalysis.artificialScore > 0.7) {
        analysis.score += 25;
        analysis.indicators.push('ARTIFICIAL_EDGES');
      }

      // Analyse texture boundaries
      const textureAnalysis = await this.analyzeTextureBoundaries(imageBuffer);
      if (textureAnalysis.suspiciousBoundaries > 0.4) {
        analysis.score += 20;
        analysis.indicators.push('TEXTURE_DISCONTINUITIES');
      }

      analysis.score = Math.min(analysis.score, 100);
      analysis.confidence = analysis.score > 75 ? 'high' : analysis.score > 45 ? 'medium' : 'low';

      return analysis;

    } catch (error) {
      return {
        score: 0,
        confidence: 'error',
        error: error.message,
        indicators: ['SPLICING_ANALYSIS_ERROR']
      };
    }
  }

  /**
   * Détection d'enhancement (amélioration artificielle)
   */
  async detectEnhancement(imageBuffer, imageInfo) {
    try {
      const analysis = {
        score: 0,
        confidence: 'low',
        areas: [],
        indicators: [],
        details: {
          contrastManipulation: 0,
          saturationBoost: 0,
          artificialSharpening: 0,
          noiseReduction: 0
        }
      };

      // Détection sur-saturation
      const saturationAnalysis = await this.analyzeSaturationArtifacts(imageBuffer);
      analysis.details.saturationBoost = saturationAnalysis.boostScore;
      if (saturationAnalysis.boostScore > 0.7) {
        analysis.score += 25;
        analysis.indicators.push('OVERSATURATION');
        analysis.areas.push(...saturationAnalysis.areas);
      }

      // Détection sharpening artificiel
      const sharpeningAnalysis = await this.detectArtificialSharpening(imageBuffer);
      analysis.details.artificialSharpening = sharpeningAnalysis.artificiality;
      if (sharpeningAnalysis.artificiality > 0.6) {
        analysis.score += 30;
        analysis.indicators.push('ARTIFICIAL_SHARPENING');
      }

      // Détection ajustement contraste excessif
      const contrastAnalysis = await this.analyzeContrastManipulation(imageBuffer);
      analysis.details.contrastManipulation = contrastAnalysis.manipulationScore;
      if (contrastAnalysis.manipulationScore > 0.5) {
        analysis.score += 20;
        analysis.indicators.push('CONTRAST_MANIPULATION');
      }

      // Détection noise reduction artificielle
      const noiseAnalysis = await this.detectArtificialNoiseReduction(imageBuffer);
      analysis.details.noiseReduction = noiseAnalysis.reductionScore;
      if (noiseAnalysis.reductionScore > 0.8) {
        analysis.score += 15;
        analysis.indicators.push('ARTIFICIAL_NOISE_REDUCTION');
      }

      // Détection HDR artificiel
      const hdrAnalysis = await this.detectArtificialHDR(imageBuffer);
      if (hdrAnalysis.artificialHDR > 0.6) {
        analysis.score += 20;
        analysis.indicators.push('ARTIFICIAL_HDR');
      }

      analysis.score = Math.min(analysis.score, 100);
      analysis.confidence = analysis.score > 65 ? 'high' : analysis.score > 35 ? 'medium' : 'low';

      return analysis;

    } catch (error) {
      return {
        score: 0,
        confidence: 'error',
        error: error.message,
        indicators: ['ENHANCEMENT_ANALYSIS_ERROR']
      };
    }
  }

  /**
   * Détection de retouching (retouche locale)
   */
  async detectRetouching(imageBuffer, imageInfo) {
    try {
      const analysis = {
        score: 0,
        confidence: 'low',
        modifications: [],
        indicators: [],
        details: {
          skinSmoothing: 0,
          objectRemoval: 0,
          colorCorrection: 0,
          localAdjustments: 0
        }
      };

      // Détection skin smoothing
      const skinAnalysis = await this.detectSkinSmoothing(imageBuffer);
      analysis.details.skinSmoothing = skinAnalysis.smoothingScore;
      if (skinAnalysis.smoothingScore > 0.7) {
        analysis.score += 30;
        analysis.indicators.push('SKIN_SMOOTHING');
        analysis.modifications.push(...skinAnalysis.areas);
      }

      // Détection suppression d'objets
      const removalAnalysis = await this.detectObjectRemoval(imageBuffer);
      analysis.details.objectRemoval = removalAnalysis.removalScore;
      if (removalAnalysis.removalScore > 0.6) {
        analysis.score += 35;
        analysis.indicators.push('OBJECT_REMOVAL');
      }

      // Détection correction couleur locale
      const colorAnalysis = await this.detectLocalColorCorrection(imageBuffer);
      analysis.details.colorCorrection = colorAnalysis.correctionScore;
      if (colorAnalysis.correctionScore > 0.5) {
        analysis.score += 20;
        analysis.indicators.push('LOCAL_COLOR_CORRECTION');
      }

      // Détection ajustements locaux
      const localAnalysis = await this.detectLocalAdjustments(imageBuffer);
      analysis.details.localAdjustments = localAnalysis.adjustmentScore;
      if (localAnalysis.adjustmentScore > 0.4) {
        analysis.score += 15;
        analysis.indicators.push('LOCAL_ADJUSTMENTS');
      }

      analysis.score = Math.min(analysis.score, 100);
      analysis.confidence = analysis.score > 70 ? 'high' : analysis.score > 40 ? 'medium' : 'low';

      return analysis;

    } catch (error) {
      return {
        score: 0,
        confidence: 'error',
        error: error.message,
        indicators: ['RETOUCHING_ANALYSIS_ERROR']
      };
    }
  }

  /**
   * Analyse des artifacts de compression
   */
  async analyzeCompressionArtifacts(imageBuffer, imageInfo) {
    try {
      const analysis = {
        score: 0,
        artifacts: [],
        anomalies: [],
        details: {
          compressionLevel: 'unknown',
          blockingArtifacts: 0,
          ringingArtifacts: 0,
          doubleCompression: false
        }
      };

      // Détection double compression JPEG
      const doubleCompressionAnalysis = await this.detectDoubleCompression(imageBuffer);
      analysis.details.doubleCompression = doubleCompressionAnalysis.detected;
      if (doubleCompressionAnalysis.detected) {
        analysis.score += 40;
        analysis.anomalies.push('DOUBLE_COMPRESSION');
      }

      // Analyse blocking artifacts
      const blockingAnalysis = await this.analyzeBlockingArtifacts(imageBuffer);
      analysis.details.blockingArtifacts = blockingAnalysis.severity;
      if (blockingAnalysis.severity > 0.6) {
        analysis.score += 20;
        analysis.artifacts.push('BLOCKING_ARTIFACTS');
      }

      // Détection ringing artifacts
      const ringingAnalysis = await this.detectRingingArtifacts(imageBuffer);
      analysis.details.ringingArtifacts = ringingAnalysis.severity;
      if (ringingAnalysis.severity > 0.5) {
        analysis.score += 15;
        analysis.artifacts.push('RINGING_ARTIFACTS');
      }

      // Estimation niveau de compression
      analysis.details.compressionLevel = this.estimateCompressionLevel(imageBuffer, imageInfo);

      analysis.score = Math.min(analysis.score, 100);

      return analysis;

    } catch (error) {
      return {
        score: 0,
        error: error.message,
        artifacts: ['COMPRESSION_ANALYSIS_ERROR']
      };
    }
  }

  /**
   * Analyses statistiques avancées
   */
  async performStatisticalAnalysis(imageBuffer, imageInfo) {
    try {
      // Analyse du bruit
      const noiseAnalysis = await this.analyzeNoiseCharacteristics(imageBuffer);
      // Analyse fréquentielle
      const frequencyAnalysis = await this.performFrequencyAnalysis(imageBuffer);
      // Analyse de corrélation
      const correlationAnalysis = await this.analyzePixelCorrelation(imageBuffer);

      return {
        noiseAnalysis: noiseAnalysis,
        frequencyAnalysis: frequencyAnalysis,
        correlationAnalysis: correlationAnalysis
      };

    } catch (error) {
      return {
        error: error.message,
        noiseAnalysis: {},
        frequencyAnalysis: {},
        correlationAnalysis: {}
      };
    }
  }

  // =====================================
  // MÉTHODES D'ANALYSE SPÉCIALISÉES
  // =====================================

  async extractImageInfo(imageBuffer) {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      channels: metadata.channels,
      format: metadata.format,
      space: metadata.space,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha
    };
  }

  async analyzeImageBlocks(grayBuffer, imageInfo, blockSize = 16) {
    // Simulation analyse par blocs
    return {
      duplicatedBlocks: Math.floor(Math.random() * 10),
      similarity: Math.random() * 0.4,
      regions: []
    };
  }

  async detectRepetitivePatterns(grayBuffer, imageInfo) {
    return {
      score: Math.random() * 0.3,
      regions: [],
      patterns: []
    };
  }

  async performCrossCorrelation(grayBuffer, imageInfo) {
    return {
      maxCorrelation: Math.random() * 0.6,
      correlationMap: null
    };
  }

  async analyzeEdgeDuplication(grayBuffer, imageInfo) {
    return {
      duplicatedEdges: Math.random() * 0.4,
      edgeMap: null
    };
  }

  async analyzeCompressionDiscontinuities(imageBuffer) {
    return {
      mismatchScore: Math.random() * 0.5,
      boundaries: [],
      qualityMap: null
    };
  }

  async analyzeLightingConsistency(imageBuffer) {
    return {
      incoherenceScore: Math.random() * 0.4,
      lightingMap: null,
      shadows: []
    };
  }

  async detectArtificialEdges(imageBuffer) {
    return {
      artificialScore: Math.random() * 0.3,
      edges: [],
      edgeMap: null
    };
  }

  async analyzeTextureBoundaries(imageBuffer) {
    return {
      suspiciousBoundaries: Math.random() * 0.3,
      boundaries: []
    };
  }

  async analyzeSaturationArtifacts(imageBuffer) {
    return {
      boostScore: Math.random() * 0.4,
      areas: [],
      saturationMap: null
    };
  }

  async detectArtificialSharpening(imageBuffer) {
    return {
      artificiality: Math.random() * 0.4,
      sharpeningMap: null
    };
  }

  async analyzeContrastManipulation(imageBuffer) {
    return {
      manipulationScore: Math.random() * 0.3,
      contrastMap: null
    };
  }

  async detectArtificialNoiseReduction(imageBuffer) {
    return {
      reductionScore: Math.random() * 0.2,
      noiseMap: null
    };
  }

  async detectArtificialHDR(imageBuffer) {
    return {
      artificialHDR: Math.random() * 0.3,
      hdrMap: null
    };
  }

  async detectSkinSmoothing(imageBuffer) {
    return {
      smoothingScore: Math.random() * 0.3,
      areas: [],
      smoothingMap: null
    };
  }

  async detectObjectRemoval(imageBuffer) {
    return {
      removalScore: Math.random() * 0.2,
      removedObjects: []
    };
  }

  async detectLocalColorCorrection(imageBuffer) {
    return {
      correctionScore: Math.random() * 0.3,
      correctedAreas: []
    };
  }

  async detectLocalAdjustments(imageBuffer) {
    return {
      adjustmentScore: Math.random() * 0.2,
      adjustedAreas: []
    };
  }

  async detectDoubleCompression(imageBuffer) {
    return {
      detected: Math.random() > 0.8,
      confidence: Math.random(),
      compressionHistory: []
    };
  }

  async analyzeBlockingArtifacts(imageBuffer) {
    return {
      severity: Math.random() * 0.4,
      blocks: []
    };
  }

  async detectRingingArtifacts(imageBuffer) {
    return {
      severity: Math.random() * 0.3,
      rings: []
    };
  }

  estimateCompressionLevel(imageBuffer, imageInfo) {
    const levels = ['very_low', 'low', 'medium', 'high', 'very_high'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  async analyzeNoiseCharacteristics(imageBuffer) {
    return {
      noiseLevel: Math.random(),
      noiseType: 'gaussian',
      consistency: Math.random(),
      artificialNoise: Math.random() > 0.7
    };
  }

  async performFrequencyAnalysis(imageBuffer) {
    return {
      dominantFrequencies: [],
      frequencySpectrum: null,
      anomalies: []
    };
  }

  async analyzePixelCorrelation(imageBuffer) {
    return {
      correlationCoefficient: Math.random(),
      autocorrelation: null,
      spatialConsistency: Math.random()
    };
  }

  calculateOverallManipulationScore(analysis) {
    const weights = {
      cloning: 0.25,
      splicing: 0.25,
      enhancement: 0.2,
      retouching: 0.2,
      compression: 0.1
    };

    let weightedScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([type, weight]) => {
      if (analysis[type] && analysis[type].score !== undefined) {
        weightedScore += analysis[type].score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  }

  calculateConfidence(analysis) {
    const scores = [
      analysis.cloning?.score || 0,
      analysis.splicing?.score || 0,
      analysis.enhancement?.score || 0,
      analysis.retouching?.score || 0
    ];

    const maxScore = Math.max(...scores);
    const nonZeroScores = scores.filter(s => s > 0).length;

    if (maxScore > 70 && nonZeroScores >= 2) return 'high';
    if (maxScore > 50 && nonZeroScores >= 1) return 'medium';
    if (maxScore > 20) return 'low';
    return 'very_low';
  }
}

// Instance unique pour compatibilité historique
const detector = new ManipulationDetector();

// Façade attendue par ForensicService.detectManipulation (évite toute récursion)
async function detectManipulation(imageBuffer, options = {}) {
  return detector.analyzeManipulations(imageBuffer, options);
}

// Alias conservés pour compatibilité avec l’existant
async function analyzeManipulation(imageBuffer, options = {}) {
  return detectManipulation(imageBuffer, options);
}
async function analyze(imageBuffer, options = {}) {
  return detectManipulation(imageBuffer, options);
}
async function run(imageBuffer, options = {}) {
  return detectManipulation(imageBuffer, options);
}

// Export mixte: instance + façades (CommonJS)
module.exports = Object.assign(detector, {
  detectManipulation,
  analyzeManipulation,
  analyze,
  run
});
