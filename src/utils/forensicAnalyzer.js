// src/utils/forensicAnalyzer.js
"use strict";

const crypto = require('crypto');

// =====================================
// ANALYSEUR FORENSIQUE AVANCÉ COMPLET
// =====================================

class ForensicAnalyzer {
  constructor(options = {}) {
    this.version = options.version || '3.0.0-production';
    this.maxCacheSize = Number(options.maxCacheSize || 100);
    this.analysisCache = new Map(); // LRU rudimentaire via réinsertion
    this.initialized = true;

    if (process.env.NODE_ENV !== 'test') {
      console.log(`🔬 Analyseur forensique initialisé v${this.version}`);
    }
  }

  /**
   * Analyse complète de manipulations d'images
   */
  async analyzeManipulations(imageBuffer, metadata = {}) {
    const startTime = Date.now();

    try {
      if (!Buffer.isBuffer(imageBuffer)) {
        throw new Error('imageBuffer doit être un Buffer valide');
      }

      if (imageBuffer.length === 0) {
        throw new Error("Buffer d'image vide");
      }

      if (process.env.NODE_ENV !== 'test' && process.env.DEBUG_FORENSIC === 'true') {
        console.log(`🔍 Analyse manipulation: ${this.formatBytes(imageBuffer.length)}`);
      }

      // Cache check (LRU touch)
      const cacheKey = this.generateCacheKey(imageBuffer, metadata);
      const cached = this.analysisCache.get(cacheKey);
      if (cached) {
        if (process.env.NODE_ENV !== 'test' && process.env.DEBUG_FORENSIC === 'true') {
          console.log('📋 Résultat récupéré du cache');
        }
        this.analysisCache.delete(cacheKey);
        this.analysisCache.set(cacheKey, cached);
        return cached;
      }

      const cloning = await this.safeCall(() => this.detectCloning(imageBuffer, metadata), 'cloning');
      const splicing = await this.safeCall(() => this.detectSplicing(imageBuffer, metadata), 'splicing');
      const enhancement = await this.safeCall(() => this.detectEnhancement(imageBuffer, metadata), 'enhancement');
      const compression = await this.safeCall(() => this.analyzeCompressionArtifacts(imageBuffer, metadata), 'compression');
      const statistical = await this.safeCall(() => this.analyzeStatisticalAnomalies(imageBuffer, metadata), 'statistical');

      const analysisResult = {
        // Scores principaux
        cloning,
        splicing,
        enhancement,
        compression,
        statistical,

        // Score global pondéré
        overall: 0,

        // Métadonnées d'analyse
        metadata: {
          analysisTime: 0,
          imageSize: imageBuffer.length,
          version: this.version,
          timestamp: new Date().toISOString(),
          methods: ['cloning', 'splicing', 'enhancement', 'compression', 'statistical']
        }
      };

      // Calcul du score global avec pondération
      analysisResult.overall = this.calculateOverallScore(analysisResult);
      analysisResult.metadata.analysisTime = Date.now() - startTime;

      // Mise en cache
      this.updateCache(cacheKey, analysisResult);

      if (process.env.NODE_ENV !== 'test') {
        console.log(`✅ Analyse terminée: score global ${analysisResult.overall}/100 (${analysisResult.metadata.analysisTime}ms)`);
      }

      return analysisResult;

    } catch (error) {
      console.error(`❌ Erreur analyse manipulations: ${error.message}`);

      return {
        cloning: this.emptySubscore('cloning', error.message),
        splicing: this.emptySubscore('splicing', error.message),
        enhancement: this.emptySubscore('enhancement', error.message),
        compression: this.emptySubscore('compression', error.message),
        statistical: this.emptySubscore('statistical', error.message),
        overall: 0,
        error: error.message,
        metadata: {
          analysisTime: Date.now() - startTime,
          failed: true,
          version: this.version,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  // Helper pour encapsuler les sous-analyses
  async safeCall(fn, name) {
    try {
      const r = await fn();
      // normalisation minimale
      return {
        score: typeof r?.score === 'number' ? r.score : 0,
        confidence: r?.confidence || 'low',
        indicators: Array.isArray(r?.indicators) ? r.indicators : [],
        details: r?.details ?? r ?? null
      };
    } catch (e) {
      console.warn(`⚠️ Erreur sous-analyse ${name}: ${e.message}`);
      return { score: 0, confidence: 'error', indicators: ['ANALYSIS_ERROR'], details: null };
    }
  }

  emptySubscore(name, reason) {
    return { score: 0, confidence: 'error', indicators: [`${name.toUpperCase()}_FAILED`], details: { error: reason } };
  }

  // =============== Sous-analyses ===============
  async detectCloning(imageBuffer, metadata) {
    try {
      if (process.env.DEBUG_FORENSIC === 'true') console.log('🔍 Détection clonage...');

      let cloningScore = 0;
      const indicators = [];

      // 1. Analyse de l'entropie des blocs
      const entropyAnalysis = this.calculateBlockEntropy(imageBuffer, 16);
      if (entropyAnalysis && entropyAnalysis.averageEntropy < 3.0) {
        cloningScore += 25;
        indicators.push('LOW_ENTROPY_BLOCKS');
      }

      // 2. Détection de patterns répétitifs
      const repetitionAnalysis = this.detectRepetitivePatterns(imageBuffer);
      if (repetitionAnalysis && repetitionAnalysis.repetitionRate > 0.15) {
        cloningScore += 30;
        indicators.push('HIGH_REPETITION_PATTERNS');
      }

      // 3. Analyse de corrélation croisée
      const correlationAnalysis = this.calculateCrossCorrelation(imageBuffer);
      if (correlationAnalysis && correlationAnalysis.maxCorrelation > 0.85) {
        cloningScore += 25;
        indicators.push('HIGH_CROSS_CORRELATION');
      }

      // 4. Détection de duplicatas de contours
      const edgeAnalysis = this.analyzeEdgeDuplication(imageBuffer);
      if (edgeAnalysis && edgeAnalysis.duplicatedEdges > 0.3) {
        cloningScore += 20;
        indicators.push('DUPLICATED_EDGE_PATTERNS');
      }

      return {
        score: Math.min(cloningScore, 100),
        confidence: this.calculateConfidence(cloningScore, indicators.length),
        indicators,
        details: {
          entropy: entropyAnalysis || null,
          repetition: repetitionAnalysis || null,
          correlation: correlationAnalysis || null,
          edges: edgeAnalysis || null
        }
      };

    } catch (error) {
      console.warn(`⚠️ Erreur détection clonage: ${error.message}`);
      return { score: 0, confidence: 'error', indicators: ['ANALYSIS_ERROR'], details: null };
    }
  }

  async detectSplicing(imageBuffer, metadata) {
    try {
      if (process.env.DEBUG_FORENSIC === 'true') console.log('✂️ Détection splicing...');

      let splicingScore = 0;
      const indicators = [];

      // 1. Analyse des artefacts de compression
      const compressionAnalysis = this.analyzeCompressionConsistency(imageBuffer);
      if (compressionAnalysis && compressionAnalysis.inconsistencyScore > 40) {
        splicingScore += 35;
        indicators.push('COMPRESSION_INCONSISTENCY');
      }

      // 2. Analyse de la cohérence du bruit
      const noiseAnalysis = this.analyzeNoiseConsistency(imageBuffer);
      if (noiseAnalysis && noiseAnalysis.coherenceScore < 0.6) {
        splicingScore += 30;
        indicators.push('NOISE_INCONSISTENCY');
      }

      // 3. Détection de frontières artificielles
      const boundaryAnalysis = this.detectArtificialBoundaries(imageBuffer);
      if (boundaryAnalysis && boundaryAnalysis.artificialScore > 0.7) {
        splicingScore += 25;
        indicators.push('ARTIFICIAL_BOUNDARIES');
      }

      // 4. Analyse de cohérence d'illumination
      const lightingAnalysis = this.analyzeLightingConsistency(imageBuffer);
      if (lightingAnalysis && lightingAnalysis.inconsistencyScore > 0.5) {
        splicingScore += 20;
        indicators.push('LIGHTING_INCONSISTENCY');
      }

      // 5. Vérification taille vs qualité attendue
      if (metadata && metadata.expectedSize && metadata.actualSize) {
        const expected = Number(metadata.expectedSize) || 0;
        const actual = Number(metadata.actualSize) || 0;
        if (expected > 0 && actual > 0) {
          const sizeDifference = Math.abs(actual - expected) / expected;
          if (sizeDifference > 0.5) {
            splicingScore += 15;
            indicators.push('SIZE_QUALITY_MISMATCH');
          }
        }
      }

      return {
        score: Math.min(splicingScore, 100),
        confidence: this.calculateConfidence(splicingScore, indicators.length),
        indicators,
        details: {
          compression: compressionAnalysis || null,
          noise: noiseAnalysis || null,
          boundaries: boundaryAnalysis || null,
          lighting: lightingAnalysis || null
        }
      };

    } catch (error) {
      console.warn(`⚠️ Erreur détection splicing: ${error.message}`);
      return { score: 0, confidence: 'error', indicators: ['ANALYSIS_ERROR'], details: null };
    }
  }

  async detectEnhancement(imageBuffer, metadata) {
    try {
      if (process.env.DEBUG_FORENSIC === 'true') console.log('✨ Détection enhancement...');

      let enhancementScore = 0;
      const indicators = [];

      // 1. Analyse de l'histogramme
      const histogramAnalysis = this.analyzeHistogramArtifacts(imageBuffer);
      if (histogramAnalysis && histogramAnalysis.artificialPeaks > 0.6) {
        enhancementScore += 30;
        indicators.push('HISTOGRAM_MANIPULATION');
      }

      // 2. Détection de sur-netteté
      const sharpnessAnalysis = this.detectOverSharpening(imageBuffer);
      if (sharpnessAnalysis && sharpnessAnalysis.overSharpenScore > 0.7) {
        enhancementScore += 25;
        indicators.push('OVER_SHARPENING');
      }

      // 3. Détection de saturation artificielle
      const saturationAnalysis = this.detectArtificialSaturation(imageBuffer);
      if (saturationAnalysis && saturationAnalysis.artificialScore > 0.8) {
        enhancementScore += 20;
        indicators.push('ARTIFICIAL_SATURATION');
      }

      // 4. Détection de réduction de bruit artificielle
      const denoiseAnalysis = this.detectArtificialDenoising(imageBuffer);
      if (denoiseAnalysis && denoiseAnalysis.artificialScore > 0.6) {
        enhancementScore += 15;
        indicators.push('ARTIFICIAL_DENOISING');
      }

      // 5. Détection d'ajustements tonaux excessifs
      const tonalAnalysis = this.detectExcessiveTonalAdjustments(imageBuffer);
      if (tonalAnalysis && tonalAnalysis.excessiveScore > 0.5) {
        enhancementScore += 10;
        indicators.push('EXCESSIVE_TONAL_ADJUSTMENTS');
      }

      return {
        score: Math.min(enhancementScore, 100),
        confidence: this.calculateConfidence(enhancementScore, indicators.length),
        indicators,
        details: {
          histogram: histogramAnalysis || null,
          sharpness: sharpnessAnalysis || null,
          saturation: saturationAnalysis || null,
          denoise: denoiseAnalysis || null,
          tonal: tonalAnalysis || null
        }
      };

    } catch (error) {
      console.warn(`⚠️ Erreur détection enhancement: ${error.message}`);
      return { score: 0, confidence: 'error', indicators: ['ANALYSIS_ERROR'], details: null };
    }
  }

  /**
   * Analyse avancée de compression JPEG
   */
  async analyzeCompressionArtifacts(imageBuffer, metadata) {
    try {
      if (process.env.DEBUG_FORENSIC === 'true') console.log('🗜️ Analyse compression...');

      let compressionScore = 0;
      const indicators = [];

      // Vérifier si c'est un JPEG
      if (!this.isJpegImage(imageBuffer)) {
        return {
          score: 0,
          confidence: 'not_applicable',
          indicators: ['NOT_JPEG_IMAGE'],
          details: { format: 'non-jpeg' }
        };
      }

      // 1. Détection de compression multiple
      const multipleCompressionAnalysis = this.detectMultipleJpegCompression(imageBuffer);
      if (multipleCompressionAnalysis.detected) {
        compressionScore += Math.min(multipleCompressionAnalysis.score * 2, 40);
        indicators.push('MULTIPLE_COMPRESSION_DETECTED');
      }

      // 2. Analyse des tables de quantification
      const quantizationAnalysis = this.analyzeQuantizationTables(imageBuffer);
      if (quantizationAnalysis.anomalyScore > 30) {
        compressionScore += 25;
        indicators.push('QUANTIZATION_ANOMALIES');
      }

      // 3. Détection d'artefacts de blocs
      const blockingAnalysis = this.detectBlockingArtifacts(imageBuffer);
      if (blockingAnalysis.severity > 40) {
        compressionScore += 20;
        indicators.push('BLOCKING_ARTIFACTS');
      }

      // 4. Analyse de cohérence de qualité
      const qualityAnalysis = this.analyzeQualityConsistency(imageBuffer);
      if (qualityAnalysis.inconsistency > 0.5) {
        compressionScore += 15;
        indicators.push('QUALITY_INCONSISTENCY');
      }

      return {
        score: Math.min(compressionScore, 100),
        confidence: this.calculateConfidence(compressionScore, indicators.length),
        indicators,
        details: {
          multipleCompression: multipleCompressionAnalysis,
          quantization: quantizationAnalysis,
          blocking: blockingAnalysis,
          quality: qualityAnalysis
        }
      };

    } catch (error) {
      console.warn(`⚠️ Erreur analyse compression: ${error.message}`);
      return { score: 0, confidence: 'error', indicators: ['ANALYSIS_ERROR'], details: null };
    }
  }

  /**
   * Analyse des anomalies statistiques
   */
  async analyzeStatisticalAnomalies(imageBuffer, metadata) {
    try {
      if (process.env.DEBUG_FORENSIC === 'true') console.log('📊 Analyse statistique...');

      let statisticalScore = 0;
      const indicators = [];

      // 1. Analyse de distribution des pixels
      const pixelDistribution = this.analyzePixelDistribution(imageBuffer);
      if (pixelDistribution.anomalyScore > 0.7) {
        statisticalScore += 25;
        indicators.push('PIXEL_DISTRIBUTION_ANOMALY');
      }

      // 2. Analyse de corrélation spatiale
      const spatialCorrelation = this.analyzeSpatialCorrelation(imageBuffer);
      if (spatialCorrelation.anomalyScore > 0.6) {
        statisticalScore += 20;
        indicators.push('SPATIAL_CORRELATION_ANOMALY');
      }

      // 3. Analyse de l'entropie globale
      const entropyAnalysis = this.analyzeGlobalEntropy(imageBuffer);
      if (entropyAnalysis.suspiciousLevel > 0.5) {
        statisticalScore += 15;
        indicators.push('ENTROPY_ANOMALY');
      }

      // 4. Détection de patterns artificiels
      const patternAnalysis = this.detectArtificialPatterns(imageBuffer);
      if (patternAnalysis.artificialScore > 0.8) {
        statisticalScore += 20;
        indicators.push('ARTIFICIAL_PATTERNS');
      }

      // 5. Analyse de cohérence spectrale
      const spectralAnalysis = this.analyzeSpectralCoherence(imageBuffer);
      if (spectralAnalysis.incoherenceScore > 0.4) {
        statisticalScore += 20;
        indicators.push('SPECTRAL_INCOHERENCE');
      }

      return {
        score: Math.min(statisticalScore, 100),
        confidence: this.calculateConfidence(statisticalScore, indicators.length),
        indicators,
        details: {
          pixelDistribution,
          spatialCorrelation,
          entropy: entropyAnalysis,
          patterns: patternAnalysis,
          spectral: spectralAnalysis
        }
      };

    } catch (error) {
      console.warn(`⚠️ Erreur analyse statistique: ${error.message}`);
      return { score: 0, confidence: 'error', indicators: ['ANALYSIS_ERROR'], details: null };
    }
  }

  // =====================================
  // MÉTHODES D'ANALYSE SPÉCIALISÉES - TOUTES COMPLÈTES
  // =====================================

  calculateBlockEntropy(imageBuffer, blockSize = 16) {
    try {
      const blocks = this.extractImageBlocks(imageBuffer, blockSize);
      if (!blocks.length) {
        return { averageEntropy: 4.0, variance: 0, blocksAnalyzed: 0 };
      }

      let totalEntropy = 0;
      const entropies = [];

      blocks.forEach(block => {
        const histogram = new Array(256).fill(0);

        // Construire histogramme du bloc
        for (let i = 0; i < block.length; i++) {
          histogram[block[i]]++;
        }

        // Calculer entropie
        let entropy = 0;
        const blockLength = block.length || 1;

        for (let i = 0; i < 256; i++) {
          if (histogram[i] > 0) {
            const probability = histogram[i] / blockLength;
            entropy -= probability * Math.log2(probability);
          }
        }

        entropies.push(entropy);
        totalEntropy += entropy;
      });

      const averageEntropy = totalEntropy / entropies.length;
      const entropyVariance = this.calculateVariance(entropies);

      return {
        averageEntropy,
        variance: entropyVariance,
        blocksAnalyzed: entropies.length,
        suspiciousBlocks: entropies.filter(e => e < 2.0).length
      };

    } catch (error) {
      return { averageEntropy: 4.0, variance: 0, blocksAnalyzed: 0, error: error.message };
    }
  }

  detectRepetitivePatterns(imageBuffer) {
    try {
      const chunkSize = 64;
      if (imageBuffer.length < chunkSize) {
        return { repetitionRate: 0, uniqueChunks: 1, totalChunks: 1, maxRepetitions: 1, suspiciousLevel: 'low' };
      }

      const chunks = new Map();
      let repetitions = 0;
      let totalChunks = 0;

      for (let i = 0; i <= imageBuffer.length - chunkSize; i += chunkSize) {
        const chunk = imageBuffer.slice(i, i + chunkSize);
        const hash = crypto.createHash('md5').update(chunk).digest('hex');

        if (chunks.has(hash)) {
          repetitions++;
          chunks.set(hash, chunks.get(hash) + 1);
        } else {
          chunks.set(hash, 1);
        }
        totalChunks++;
      }

      const repetitionRate = totalChunks > 0 ? repetitions / totalChunks : 0;
      const uniqueChunks = chunks.size || 1;
      const maxRepetitions = Math.max(...chunks.values());

      return {
        repetitionRate,
        uniqueChunks,
        totalChunks,
        maxRepetitions,
        suspiciousLevel: repetitionRate > 0.1 ? 'high' : repetitionRate > 0.05 ? 'medium' : 'low'
      };

    } catch (error) {
      return { repetitionRate: 0, error: error.message };
    }
  }

  calculateCrossCorrelation(imageBuffer) {
    try {
      const sampleSize = Math.max(1, Math.min(1024, Math.floor(imageBuffer.length / 10)));
      if (imageBuffer.length < sampleSize * 2) {
        return { maxCorrelation: 0, sampleSize: 0, suspiciousLevel: 'low' };
      }

      const sample1 = imageBuffer.slice(0, sampleSize);
      const mid = Math.floor(imageBuffer.length / 2);
      const sample2 = imageBuffer.slice(mid, mid + sampleSize);

      let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, sumProd = 0;

      for (let i = 0; i < sampleSize; i++) {
        const a = sample1[i], b = sample2[i];
        sum1 += a;
        sum2 += b;
        sum1Sq += a * a;
        sum2Sq += b * b;
        sumProd += a * b;
      }

      const numerator = sumProd - (sum1 * sum2 / sampleSize);
      const denomA = sum1Sq - (sum1 * sum1 / sampleSize);
      const denomB = sum2Sq - (sum2 * sum2 / sampleSize);
      const denominator = Math.sqrt(Math.max(denomA, 0) * Math.max(denomB, 0));

      const corr = denominator !== 0 ? numerator / denominator : 0;
      const absCorr = Math.max(0, Math.min(1, Math.abs(corr)));

      return {
        maxCorrelation: absCorr,
        sampleSize,
        suspiciousLevel: absCorr > 0.8 ? 'high' : absCorr > 0.6 ? 'medium' : 'low'
      };

    } catch (error) {
      return { maxCorrelation: 0, error: error.message };
    }
  }

  analyzeEdgeDuplication(imageBuffer) {
    try {
      const edgeStrength = [];
      const windowSize = 16;

      if (imageBuffer.length < windowSize + 1) {
        return { duplicatedEdges: 0, totalEdges: 0, uniquePatterns: 0, suspiciousLevel: 'low' };
      }

      for (let i = 0; i < imageBuffer.length - windowSize; i += windowSize) {
        let edgeValue = 0;
        for (let j = 0; j < windowSize - 1; j++) {
          edgeValue += Math.abs(imageBuffer[i + j + 1] - imageBuffer[i + j]);
        }
        edgeStrength.push(edgeValue);
      }

      const edgePatterns = new Map();
      let duplicatedEdges = 0;

      edgeStrength.forEach(strength => {
        const bucket = Math.floor(strength / 10) * 10;
        if (edgePatterns.has(bucket)) {
          duplicatedEdges++;
          edgePatterns.set(bucket, edgePatterns.get(bucket) + 1);
        } else {
          edgePatterns.set(bucket, 1);
        }
      });

      const ratio = edgeStrength.length > 0 ? duplicatedEdges / edgeStrength.length : 0;

      return {
        duplicatedEdges: ratio,
        totalEdges: edgeStrength.length,
        uniquePatterns: edgePatterns.size,
        suspiciousLevel: ratio > 0.4 ? 'high' : ratio > 0.2 ? 'medium' : 'low'
      };

    } catch (error) {
      return { duplicatedEdges: 0, error: error.message };
    }
  }

  analyzeCompressionConsistency(imageBuffer) {
    try {
      if (!this.isJpegImage(imageBuffer)) {
        return { inconsistencyScore: 0, applicable: false };
      }

      let dqtMarkers = 0;
      const qualityPositions = [];

      for (let i = 0; i < imageBuffer.length - 1; i++) {
        if (imageBuffer[i] === 0xFF && imageBuffer[i + 1] === 0xDB) {
          dqtMarkers++;
          const position = i / imageBuffer.length;
          qualityPositions.push(position);
        }
      }

      let inconsistencyScore = 0;

      if (dqtMarkers > 2) {
        inconsistencyScore += Math.min((dqtMarkers - 2) * 15, 50);
      }

      if (qualityPositions.length > 1) {
        const variance = this.calculateVariance(qualityPositions);
        if (variance > 0.1) {
          inconsistencyScore += 20;
        }
      }

      return {
        inconsistencyScore: Math.min(inconsistencyScore, 100),
        dqtMarkers,
        qualityVariance: qualityPositions.length > 1 ? this.calculateVariance(qualityPositions) : 0,
        applicable: true
      };

    } catch (error) {
      return { inconsistencyScore: 0, error: error.message };
    }
  }

  analyzeNoiseConsistency(imageBuffer) {
    try {
      const regionSize = 256;
      const numRegions = Math.min(16, Math.floor(imageBuffer.length / regionSize));
      if (numRegions <= 0) {
        return { coherenceScore: 1, meanNoise: 0, noiseVariance: 0, regionsAnalyzed: 0, suspiciousLevel: 'low' };
      }

      const noiseEstimates = [];

      for (let r = 0; r < numRegions; r++) {
        const startIdx = r * regionSize;
        const region = imageBuffer.slice(startIdx, startIdx + regionSize);

        let variance = 0;
        const mean = region.reduce((sum, val) => sum + val, 0) / region.length;

        for (let i = 0; i < region.length; i++) {
          const d = region[i] - mean;
          variance += d * d;
        }
        variance /= region.length;

        noiseEstimates.push(Math.sqrt(variance));
      }

      const meanNoise = noiseEstimates.reduce((s, v) => s + v, 0) / noiseEstimates.length;
      const noiseVariance = this.calculateVariance(noiseEstimates);
      const coherenceScore = 1 - (noiseVariance / (meanNoise * meanNoise + 1));

      return {
        coherenceScore: Math.max(0, Math.min(1, coherenceScore)),
        meanNoise,
        noiseVariance,
        regionsAnalyzed: numRegions,
        suspiciousLevel: coherenceScore < 0.5 ? 'high' : coherenceScore < 0.7 ? 'medium' : 'low'
      };

    } catch (error) {
      return { coherenceScore: 0.5, error: error.message };
    }
  }

  detectArtificialBoundaries(imageBuffer) {
    try {
      const gradients = [];
      const stepSize = 32;

      if (imageBuffer.length < stepSize + 1) {
        return { artificialScore: 0, peakCount: 0, totalGradients: 0, threshold: 0, suspiciousLevel: 'low' };
      }

      for (let i = 0; i < imageBuffer.length - stepSize; i += stepSize) {
        let gradient = 0;
        for (let j = 0; j < stepSize - 1; j++) {
          gradient += Math.abs(imageBuffer[i + j + 1] - imageBuffer[i + j]);
        }
        gradients.push(gradient / stepSize);
      }

      if (!gradients.length) {
        return { artificialScore: 0, peakCount: 0, totalGradients: 0, threshold: 0, suspiciousLevel: 'low' };
      }

      const mean = gradients.reduce((s, v) => s + v, 0) / gradients.length;
      const threshold = mean * 3;
      const peakCount = gradients.filter(g => g > threshold).length;
      const artificialScore = gradients.length > 0 ? peakCount / gradients.length : 0;

      return {
        artificialScore,
        peakCount,
        totalGradients: gradients.length,
        threshold,
        suspiciousLevel: artificialScore > 0.8 ? 'high' : artificialScore > 0.5 ? 'medium' : 'low'
      };

    } catch (error) {
      return { artificialScore: 0, error: error.message };
    }
  }

  analyzeLightingConsistency(imageBuffer) {
    try {
      const blockSize = 128;
      const numBlocks = Math.min(20, Math.floor(imageBuffer.length / blockSize));
      if (numBlocks <= 0) {
        return { inconsistencyScore: 0, brightnessVariance: 0, brightnessRange: 0, blocksAnalyzed: 0, suspiciousLevel: 'low' };
      }

      const brightnessValues = [];

      for (let b = 0; b < numBlocks; b++) {
        const startIdx = b * blockSize;
        const block = imageBuffer.slice(startIdx, startIdx + blockSize);
        const avgBrightness = block.reduce((sum, val) => sum + val, 0) / block.length;
        brightnessValues.push(avgBrightness);
      }

      const brightnessVariance = this.calculateVariance(brightnessValues);
      const maxBrightness = Math.max(...brightnessValues);
      const minBrightness = Math.min(...brightnessValues);
      const range = maxBrightness - minBrightness;

      const inconsistencyScore = Math.min((brightnessVariance / 10000) + (range / 500), 1);

      return {
        inconsistencyScore,
        brightnessVariance,
        brightnessRange: range,
        blocksAnalyzed: numBlocks,
        suspiciousLevel: inconsistencyScore > 0.7 ? 'high' : inconsistencyScore > 0.4 ? 'medium' : 'low'
      };

    } catch (error) {
      return { inconsistencyScore: 0, error: error.message };
    }
  }

  analyzeHistogramArtifacts(imageBuffer) {
    try {
      const histogram = new Array(256).fill(0);

      for (let i = 0; i < imageBuffer.length; i++) {
        histogram[imageBuffer[i]]++;
      }

      let peakCount = 0;
      let valleyCount = 0;
      const threshold = imageBuffer.length / 1000;

      for (let i = 1; i < 255; i++) {
        if (histogram[i] > histogram[i - 1] && histogram[i] > histogram[i + 1] && histogram[i] > threshold) {
          peakCount++;
        }
        if (histogram[i] < histogram[i - 1] && histogram[i] < histogram[i + 1] && histogram[i] < threshold) {
          valleyCount++;
        }
      }

      const artificialPeaks = Math.min(Math.max((peakCount - 3) / 10, 0), 1);

      return {
        artificialPeaks,
        peakCount,
        valleyCount,
        histogram,
        suspiciousLevel: artificialPeaks > 0.7 ? 'high' : artificialPeaks > 0.4 ? 'medium' : 'low'
      };

    } catch (error) {
      return { artificialPeaks: 0, error: error.message };
    }
  }

  detectOverSharpening(imageBuffer) {
    try {
      const windowSize = 16;
      if (imageBuffer.length < windowSize + 1) {
        return { overSharpenScore: 0, averageSharpness: 0, windowsAnalyzed: 0, suspiciousLevel: 'low' };
      }

      let totalSharpness = 0;
      let windowCount = 0;

      for (let i = 0; i < imageBuffer.length - windowSize; i += windowSize) {
        let sharpnessValue = 0;

        for (let j = 0; j < windowSize - 1; j++) {
          const diff = Math.abs(imageBuffer[i + j + 1] - imageBuffer[i + j]);
          sharpnessValue += diff * diff;
        }

        totalSharpness += Math.sqrt(sharpnessValue / windowSize);
        windowCount++;
      }

      const avgSharpness = windowCount > 0 ? totalSharpness / windowCount : 0;
      const overSharpenScore = Math.min(avgSharpness / 100, 1);

      return {
        overSharpenScore,
        averageSharpness: avgSharpness,
        windowsAnalyzed: windowCount,
        suspiciousLevel: overSharpenScore > 0.8 ? 'high' : overSharpenScore > 0.5 ? 'medium' : 'low'
      };

    } catch (error) {
      return { overSharpenScore: 0, error: error.message };
    }
  }

  detectArtificialSaturation(imageBuffer) {
    try {
      const sampleSize = Math.min(10000, imageBuffer.length);
      if (sampleSize <= 0) {
        return { artificialScore: 0, extremeValues: 0, nearExtremeValues: 0, sampleSize: 0, suspiciousLevel: 'low' };
      }

      let extremeValues = 0;
      let nearExtremeValues = 0;

      for (let i = 0; i < sampleSize; i++) {
        const value = imageBuffer[i];

        if (value === 0 || value === 255) {
          extremeValues++;
        } else if (value < 5 || value > 250) {
          nearExtremeValues++;
        }
      }

      const extremeRatio = extremeValues / sampleSize;
      const nearExtremeRatio = nearExtremeValues / sampleSize;
      const artificialScore = Math.min((extremeRatio * 2) + nearExtremeRatio, 1);

      return {
        artificialScore,
        extremeValues,
        nearExtremeValues,
        sampleSize,
        suspiciousLevel: artificialScore > 0.9 ? 'high' : artificialScore > 0.6 ? 'medium' : 'low'
      };

    } catch (error) {
      return { artificialScore: 0, error: error.message };
    }
  }

  detectArtificialDenoising(imageBuffer) {
    try {
      const blockSize = 64;
      const numBlocks = Math.min(50, Math.floor(imageBuffer.length / blockSize));
      if (numBlocks <= 0) {
        return { artificialScore: 0, averageSmoothness: 0, blocksAnalyzed: 0, suspiciousLevel: 'low' };
      }

      const smoothnessScores = [];

      for (let b = 0; b < numBlocks; b++) {
        const startIdx = b * blockSize;
        const block = imageBuffer.slice(startIdx, startIdx + blockSize);

        let variance = 0;
        const mean = block.reduce((sum, val) => sum + val, 0) / block.length;

        for (let i = 0; i < block.length; i++) {
          const d = block[i] - mean;
          variance += d * d;
        }
        variance /= block.length;

        smoothnessScores.push(1 / (variance + 1));
      }

      const avgSmoothness = smoothnessScores.reduce((sum, val) => sum + val, 0) / smoothnessScores.length;
      const artificialScore = Math.min(avgSmoothness, 1);

      return {
        artificialScore,
        averageSmoothness: avgSmoothness,
        blocksAnalyzed: numBlocks,
        suspiciousLevel: artificialScore > 0.85 ? 'high' : artificialScore > 0.7 ? 'medium' : 'low'
      };

    } catch (error) {
      return { artificialScore: 0, error: error.message };
    }
  }

  detectExcessiveTonalAdjustments(imageBuffer) {
    try {
      const histogram = new Array(256).fill(0);

      for (let i = 0; i < imageBuffer.length; i++) {
        histogram[imageBuffer[i]]++;
      }

      let gaps = 0;
      let spikes = 0;
      const avgCount = imageBuffer.length / 256;

      for (let i = 0; i < 256; i++) {
        if (histogram[i] === 0 && i > 10 && i < 245) {
          gaps++;
        }
        if (histogram[i] > avgCount * 5) {
          spikes++;
        }
      }

      const excessiveScore = Math.min((gaps / 50) + (spikes / 20), 1);

      return {
        excessiveScore,
        gaps,
        spikes,
        suspiciousLevel: excessiveScore > 0.6 ? 'high' : excessiveScore > 0.3 ? 'medium' : 'low'
      };

    } catch (error) {
      return { excessiveScore: 0, error: error.message };
    }
  }

  analyzePixelDistribution(imageBuffer) {
    try {
      const histogram = new Array(256).fill(0);

      for (let i = 0; i < imageBuffer.length; i++) {
        histogram[imageBuffer[i]]++;
      }

      const expectedFreq = imageBuffer.length / 256 || 1;
      let chiSquare = 0;

      for (let i = 0; i < 256; i++) {
        const diff = histogram[i] - expectedFreq;
        chiSquare += (diff * diff) / expectedFreq;
      }

      const anomalyScore = Math.min(chiSquare / (imageBuffer.length / 100 + 1), 1);

      return {
        anomalyScore,
        chiSquareStatistic: chiSquare,
        histogram,
        suspiciousLevel: anomalyScore > 0.8 ? 'high' : anomalyScore > 0.5 ? 'medium' : 'low'
      };

    } catch (error) {
      return { anomalyScore: 0, error: error.message };
    }
  }

  analyzeSpatialCorrelation(imageBuffer) {
    try {
      const sampleSize = Math.min(1000, Math.max(1, imageBuffer.length - 1));
      let correlationSum = 0;

      for (let i = 0; i < sampleSize; i++) {
        const index = Math.floor(Math.random() * (imageBuffer.length - 1));
        const correlation = Math.abs(imageBuffer[index] - imageBuffer[index + 1]);
        correlationSum += correlation;
      }

      const avgCorrelation = correlationSum / sampleSize;
      const normalizedCorrelation = avgCorrelation / 255;
      const anomalyScore = Math.min(Math.abs(0.5 - normalizedCorrelation) * 2, 1);

      return {
        anomalyScore,
        averageCorrelation: avgCorrelation,
        normalizedCorrelation,
        suspiciousLevel: anomalyScore > 0.7 ? 'high' : anomalyScore > 0.4 ? 'medium' : 'low'
      };

    } catch (error) {
      return { anomalyScore: 0, error: error.message };
    }
  }

  analyzeGlobalEntropy(imageBuffer) {
    try {
      const histogram = new Array(256).fill(0);

      for (let i = 0; i < imageBuffer.length; i++) {
        histogram[imageBuffer[i]]++;
      }

      let entropy = 0;
      for (let i = 0; i < 256; i++) {
        if (histogram[i] > 0) {
          const probability = histogram[i] / imageBuffer.length;
          entropy -= probability * Math.log2(probability);
        }
      }

      const expectedEntropy = 7.5; // proche d'une distribution naturelle 8-bit
      const suspiciousLevel = Math.abs(entropy - expectedEntropy) / expectedEntropy;

      return {
        entropy,
        expectedEntropy,
        suspiciousLevel: Math.min(suspiciousLevel, 1),
        level: suspiciousLevel > 0.6 ? 'high' : suspiciousLevel > 0.3 ? 'medium' : 'low'
      };

    } catch (error) {
      return { entropy: 0, suspiciousLevel: 0, error: error.message };
    }
  }

  detectArtificialPatterns(imageBuffer) {
    try {
      const patternSize = 32;
      const numPatterns = Math.min(100, Math.floor(imageBuffer.length / patternSize));
      if (numPatterns <= 0) {
        return { artificialScore: 0, uniquePatterns: 0, repeatedPatterns: 0, totalPatterns: 0, suspiciousLevel: 'low' };
      }
      const patterns = new Map();

      for (let p = 0; p < numPatterns; p++) {
        const startIdx = p * patternSize;
        const pattern = imageBuffer.slice(startIdx, startIdx + patternSize);
        const hash = crypto.createHash('md5').update(pattern).digest('hex');

        patterns.set(hash, (patterns.get(hash) || 0) + 1);
      }

      const repeatedPatterns = Array.from(patterns.values()).filter(count => count > 1);
      const artificialScore = patterns.size > 0 ? repeatedPatterns.length / patterns.size : 0;

      return {
        artificialScore,
        uniquePatterns: patterns.size,
        repeatedPatterns: repeatedPatterns.length,
        totalPatterns: numPatterns,
        suspiciousLevel: artificialScore > 0.9 ? 'high' : artificialScore > 0.7 ? 'medium' : 'low'
      };

    } catch (error) {
      return { artificialScore: 0, error: error.message };
    }
  }

  analyzeSpectralCoherence(imageBuffer) {
    try {
      const blockSize = 256;
      const numBlocks = Math.min(20, Math.floor(imageBuffer.length / blockSize));
      if (numBlocks <= 0) {
        return { incoherenceScore: 0, averageVariance: 0, varianceOfVariances: 0, blocksAnalyzed: 0, suspiciousLevel: 'low' };
      }
      const spectralVariances = [];

      for (let b = 0; b < numBlocks; b++) {
        const startIdx = b * blockSize;
        const block = imageBuffer.slice(startIdx, startIdx + blockSize);

        const freqBins = new Array(16).fill(0);

        for (let i = 0; i < block.length; i++) {
          const bin = Math.floor((block[i] / 256) * 16);
          freqBins[Math.min(bin, 15)]++;
        }

        const variance = this.calculateVariance(freqBins);
        spectralVariances.push(variance);
      }

      const avgVariance = spectralVariances.reduce((sum, val) => sum + val, 0) / spectralVariances.length;
      const varianceOfVariances = this.calculateVariance(spectralVariances);
      const incoherenceScore = Math.min(varianceOfVariances / (avgVariance + 1), 1);

      return {
        incoherenceScore,
        averageVariance: avgVariance,
        varianceOfVariances,
        blocksAnalyzed: numBlocks,
        suspiciousLevel: incoherenceScore > 0.5 ? 'high' : incoherenceScore > 0.3 ? 'medium' : 'low'
      };

    } catch (error) {
      return { incoherenceScore: 0, error: error.message };
    }
  }

  detectMultipleJpegCompression(imageBuffer) {
    try {
      let dqtCount = 0;
      let sosCount = 0;

      for (let i = 0; i < imageBuffer.length - 1; i++) {
        if (imageBuffer[i] === 0xFF) {
          if (imageBuffer[i + 1] === 0xDB) dqtCount++;
          if (imageBuffer[i + 1] === 0xDA) sosCount++;
        }
      }

      const detected = dqtCount > 2 || sosCount > 1;
      const score = Math.min(Math.max((dqtCount - 1) * 20 + (sosCount - 1) * 30, 0), 100);

      return {
        detected,
        score,
        dqtMarkers: dqtCount,
        sosMarkers: sosCount,
        suspiciousLevel: detected ? 'high' : 'low'
      };

    } catch (error) {
      return { detected: false, score: 0, error: error.message };
    }
  }

  analyzeQuantizationTables(imageBuffer) {
    try {
      const qtables = [];

      for (let i = 0; i < imageBuffer.length - 67; i++) {
        if (imageBuffer[i] === 0xFF && imageBuffer[i + 1] === 0xDB) {
          const tableData = imageBuffer.slice(i + 4, i + 68);
          if (tableData.length === 64) {
            qtables.push(Array.from(tableData));
          }
        }
      }

      if (qtables.length === 0) {
        return { anomalyScore: 0, tablesFound: 0 };
      }

      let anomalyScore = 0;

      qtables.forEach(table => {
        const avgValue = table.reduce((sum, val) => sum + val, 0) / table.length;
        const variance = this.calculateVariance(table);

        if (avgValue < 10 || avgValue > 200) anomalyScore += 15;
        if (variance < 100) anomalyScore += 10;
      });

      return {
        anomalyScore: Math.min(anomalyScore, 100),
        tablesFound: qtables.length,
        tables: qtables,
        suspiciousLevel: anomalyScore > 50 ? 'high' : anomalyScore > 25 ? 'medium' : 'low'
      };

    } catch (error) {
      return { anomalyScore: 0, tablesFound: 0, error: error.message };
    }
  }

  detectBlockingArtifacts(imageBuffer) {
    try {
      if (!this.isJpegImage(imageBuffer)) {
        return { severity: 0, applicable: false };
      }

      const blockSize = 64;
      let blockingScore = 0;
      let blocksAnalyzed = 0;

      for (let i = 0; i < imageBuffer.length - blockSize; i += blockSize) {
        const block = imageBuffer.slice(i, i + blockSize);

        let uniformity = 0;
        const firstValue = block[0];

        for (let j = 0; j < block.length; j++) {
          if (Math.abs(block[j] - firstValue) < 5) {
            uniformity++;
          }
        }

        if (uniformity / block.length > 0.8) {
          blockingScore += 10;
        }

        blocksAnalyzed++;
      }

      const severity = blocksAnalyzed > 0 ? Math.min((blockingScore / blocksAnalyzed) * 10, 100) : 0;

      return {
        severity,
        blockingScore,
        blocksAnalyzed,
        applicable: true,
        suspiciousLevel: severity > 60 ? 'high' : severity > 30 ? 'medium' : 'low'
      };

    } catch (error) {
      return { severity: 0, error: error.message };
    }
  }

  analyzeQualityConsistency(imageBuffer) {
    try {
      const sampleSize = Math.min(5000, imageBuffer.length);
      const samples = [];

      for (let i = 0; i < sampleSize; i += 100) {
        samples.push(imageBuffer[i]);
      }

      if (samples.length === 0) {
        return { inconsistency: 0, variance: 0, mean: 0, samplesAnalyzed: 0, suspiciousLevel: 'low' };
      }

      const mean = samples.reduce((sum, val) => sum + val, 0) / samples.length;
      const variance = this.calculateVariance(samples);
      const inconsistency = variance / (mean * mean + 1);

      return {
        inconsistency: Math.min(inconsistency, 1),
        variance,
        mean,
        samplesAnalyzed: samples.length,
        suspiciousLevel: inconsistency > 0.7 ? 'high' : inconsistency > 0.4 ? 'medium' : 'low'
      };

    } catch (error) {
      return { inconsistency: 0, error: error.message };
    }
  }

  // =====================================
  // MÉTHODES UTILITAIRES COMPLÈTES
  // =====================================

  extractImageBlocks(imageBuffer, blockSize) {
    const blocks = [];
    const totalBlocks = Math.floor(imageBuffer.length / blockSize);
    const maxBlocks = Math.min(totalBlocks, 1000); // Limiter pour performance

    for (let i = 0; i < maxBlocks; i++) {
      const startIdx = i * blockSize;
      blocks.push(imageBuffer.slice(startIdx, startIdx + blockSize));
    }

    return blocks;
  }

  calculateVariance(values) {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;

    return variance;
  }

  calculateConfidence(score, indicatorCount) {
    if (score === 0) return 'low';

    const baseConfidence = Math.min(score / 100, 1);
    const indicatorBonus = Math.min(indicatorCount / 5, 0.3);
    const finalConfidence = baseConfidence + indicatorBonus;

    if (finalConfidence >= 0.8) return 'very_high';
    if (finalConfidence >= 0.6) return 'high';
    if (finalConfidence >= 0.4) return 'medium';
    return 'low';
  }

  calculateOverallScore(analysisResult) {
    const weights = {
      cloning: 0.25,
      splicing: 0.25,
      enhancement: 0.2,
      compression: 0.15,
      statistical: 0.15
    };

    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([key, weight]) => {
      if (analysisResult[key] && typeof analysisResult[key].score === 'number') {
        weightedSum += analysisResult[key].score * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  isJpegImage(imageBuffer) {
    return imageBuffer.length > 3 &&
           imageBuffer[0] === 0xFF &&
           imageBuffer[1] === 0xD8 &&
           imageBuffer[2] === 0xFF;
  }

  generateCacheKey(imageBuffer, metadata) {
    const contentHash = crypto.createHash('md5').update(imageBuffer.slice(0, 1000)).digest('hex');
    const metadataHash = crypto.createHash('md5').update(JSON.stringify(metadata)).digest('hex');
    return `${contentHash}-${metadataHash}`;
  }

  updateCache(key, result) {
    if (this.analysisCache.size >= this.maxCacheSize) {
      const firstKey = this.analysisCache.keys().next().value;
      this.analysisCache.delete(firstKey);
    }
    this.analysisCache.set(key, result);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

// =====================================
// FONCTIONS PUBLIQUES
// =====================================

const analyzer = new ForensicAnalyzer();

async function analyzeManipulations(imageBuffer, metadata = {}) {
  return analyzer.analyzeManipulations(imageBuffer, metadata);
}

async function analyzeCompression(imageBuffer, options = {}) {
  const metadata = { ...options };
  const result = await analyzer.analyzeManipulations(imageBuffer, metadata);
  return result.compression;
}

async function detectCloning(imageBuffer) {
  return analyzer.detectCloning(imageBuffer, {});
}

async function detectSplicing(imageBuffer, metadata) {
  return analyzer.detectSplicing(imageBuffer, metadata);
}

async function detectEnhancement(imageBuffer) {
  return analyzer.detectEnhancement(imageBuffer, {});
}

module.exports = {
  analyzeManipulations,
  analyzeCompression,
  detectCloning,
  detectSplicing,
  detectEnhancement,
  ForensicAnalyzer
};
