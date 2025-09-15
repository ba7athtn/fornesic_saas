"use strict";

const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const crypto = require('crypto');

// ✅ CONFIG
const config = require('../config');

// =====================================
// SERVICE DÉTECTION IA FORENSIQUE AVANCÉ
// =====================================

class AIDetectionService {
  constructor() {
    this.models = { deepfake: null, synthetic: null, gan: null, diffusion: null };
    this.isInitialized = false;

    // Paramètres depuis config avec fallbacks sûrs
    const aiCfg = config.forensic?.aiDetection || {};
    this.inputSize = aiCfg.inputSize || 224;
    this.enableModels = {
      deepfake: aiCfg.enable?.deepfake !== false,
      synthetic: aiCfg.enable?.synthetic !== false,
      gan: aiCfg.enable?.gan !== false,
      diffusion: aiCfg.enable?.diffusion !== false
    };
    this.timeouts = {
      preprocessMs: aiCfg.timeouts?.preprocessMs || 3000,
      perModuleMs: aiCfg.timeouts?.perModuleMs || 2000,
      totalMs: aiCfg.timeouts?.totalMs || 8000
    };
    this.thresholds = {
      deepfakeHigh: aiCfg.thresholds?.deepfakeHigh || 0.7,
      deepfakeMed: aiCfg.thresholds?.deepfakeMed || 0.4,
      syntheticHigh: aiCfg.thresholds?.syntheticHigh || 0.6,
      ganHigh: aiCfg.thresholds?.ganHigh || 0.7,
      ganMed: aiCfg.thresholds?.ganMed || 0.4,
      diffusionHigh: aiCfg.thresholds?.diffusionHigh || 0.65,
      diffusionMed: aiCfg.thresholds?.diffusionMed || 0.35
    };
    this.weights = aiCfg.weights || { deepfake: 0.3, synthetic: 0.25, gan: 0.25, diffusion: 0.2 };
    this.randomSeed = aiCfg.randomSeed || null; // possibilité de seed pour tests

    this.initializeModels();
  }

  async initializeModels() {
    try {
      console.log('🤖 Initialisation modèles détection IA...');
      // En production: charger de vrais modèles pré-entraînés depuis config.forensic.aiDetection.models.*
      // Exemple:
      // if (this.enableModels.deepfake && config.forensic?.aiDetection?.models?.deepfake) {
      //   this.models.deepfake = await tf.loadLayersModel(config.forensic.aiDetection.models.deepfake);
      // }
      this.isInitialized = true;
      console.log('✅ Modèles IA initialisés');
    } catch (error) {
      console.error('❌ Erreur initialisation modèles IA:', error);
      this.isInitialized = false;
    }
  }

  // Utilitaire timeout promesse
  withTimeout(promise, ms, label = 'task') {
    let t;
    const timeout = new Promise((_, rej) =>
      t = setTimeout(() => rej(new Error(`${label}_TIMEOUT`)), ms)
    );
    return Promise.race([promise.finally(() => clearTimeout(t)), timeout]);
  }

  // RNG contrôlé (pour tests)
  rnd() {
    if (this.randomSeed == null) return Math.random();
    // Simple LCG
    const a = 1664525, c = 1013904223, m = 2 ** 32;
    this.randomSeed = (a * this.randomSeed + c) % m;
    return this.randomSeed / m;
  }

  /**
   * Analyse complète de détection IA avec tous les types
   */
  async detectAIGenerated(imageBuffer, options = {}) {
    const startTime = Date.now();
    const opt = {
      include: options.include || { deepfake: true, synthetic: true, gan: true, diffusion: true },
      timeoutMs: options.timeoutMs || this.timeouts.totalMs
    };

    try {
      const analysis = {
        overallScore: 0,
        confidence: 'low',
        deepfake: { score: 0, confidence: 'low', indicators: [] },
        synthetic: { score: 0, confidence: 'low', indicators: [] },
        gan: { score: 0, confidence: 'low', indicators: [] },
        diffusion: { score: 0, confidence: 'low', indicators: [] },
        detectedGenerators: [],
        analysisMetadata: {
          processingTime: 0,
          modelVersions: {
            deepfake: '1.0.0',
            synthetic: '1.0.0',
            gan: '1.0.0',
            diffusion: '1.0.0'
          },
          analysisDate: new Date().toISOString(),
          inputHash: crypto.createHash('sha256').update(imageBuffer || Buffer.from([])).digest('hex')
        }
      };

      // Préparation image pour analyse (timeout)
      const preprocessedImage = await this.withTimeout(
        this.preprocessImage(imageBuffer),
        this.timeouts.preprocessMs,
        'PREPROCESS'
      );

      // Analyses spécialisées (respectent flags enable + include)
      if (this.enableModels.deepfake && opt.include.deepfake) {
        analysis.deepfake = await this.withTimeout(
          this.analyzeDeepfake(preprocessedImage),
          this.timeouts.perModuleMs,
          'DEEPFAKE'
        );
      }
      if (this.enableModels.synthetic && opt.include.synthetic) {
        analysis.synthetic = await this.withTimeout(
          this.analyzeSynthetic(preprocessedImage),
          this.timeouts.perModuleMs,
          'SYNTHETIC'
        );
      }
      if (this.enableModels.gan && opt.include.gan) {
        analysis.gan = await this.withTimeout(
          this.analyzeGAN(preprocessedImage),
          this.timeouts.perModuleMs,
          'GAN'
        );
      }
      if (this.enableModels.diffusion && opt.include.diffusion) {
        analysis.diffusion = await this.withTimeout(
          this.analyzeDiffusion(preprocessedImage),
          this.timeouts.perModuleMs,
          'DIFFUSION'
        );
      }

      // Analyses complémentaires (non bloquantes)
      // Ignorent les erreurs/timeout
      try { await this.withTimeout(this.analyzeStatisticalPatterns(preprocessedImage), this.timeouts.perModuleMs, 'STATS'); } catch {}
      try { await this.withTimeout(this.analyzeAnatomicalCoherence(preprocessedImage), this.timeouts.perModuleMs, 'ANATOMY'); } catch {}

      // Calculs agrégés
      analysis.overallScore = this.calculateOverallAIScore(analysis);
      analysis.confidence = this.calculateConfidence(analysis);
      analysis.detectedGenerators = await this.identifyGenerators(analysis);
      analysis.analysisMetadata.processingTime = Date.now() - startTime;

      console.log(`🤖 Analyse IA terminée: ${analysis.overallScore}% (${analysis.analysisMetadata.processingTime}ms)`);
      return analysis;
    } catch (error) {
      console.error('❌ Erreur détection IA:', error?.message || error);
      return {
        overallScore: 0,
        confidence: 'error',
        error: error.message || String(error),
        analysisMetadata: {
          processingTime: Date.now() - startTime,
          analysisDate: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Préprocessing image pour analyse IA
   */
  async preprocessImage(imageBuffer) {
    try {
      const size = this.inputSize;
      const processedImage = await sharp(imageBuffer)
        .resize(size, size, { fit: 'fill' })
        .removeAlpha()
        .raw()
        .toBuffer();

      const tensor = tf.tensor3d(new Float32Array(processedImage), [size, size, 3]).div(255.0);

      return { tensor, buffer: processedImage, dimensions: [size, size, 3] };
    } catch (error) {
      throw new Error(`Erreur preprocessing: ${error.message}`);
    }
  }

  /**
   * Analyse deepfake spécialisée
   */
  async analyzeDeepfake(preprocessedImage) {
    try {
      // TODO: utiliser un vrai modèle si disponible
      const faceDetected = await this.detectFaces(preprocessedImage);
      if (!faceDetected) {
        return { score: 0, confidence: 'high', indicators: ['NO_FACE_DETECTED'] };
      }

      const eyeInconsistency = await this.analyzeEyeInconsistency(preprocessedImage);
      const blinkingArtifacts = await this.analyzeBlinkingArtifacts(preprocessedImage);
      const faceBlending = await this.analyzeFaceBlending(preprocessedImage);
      const temporalInconsistency = await this.analyzeTemporalInconsistency(preprocessedImage);

      let score = 0;
      const indicators = [];
      if (eyeInconsistency > this.thresholds.deepfakeHigh) { score += 30; indicators.push('EYE_INCONSISTENCY'); }
      if (blinkingArtifacts > (this.thresholds.deepfakeMed + 0.2)) { score += 25; indicators.push('BLINKING_ARTIFACTS'); }
      if (faceBlending > (this.thresholds.deepfakeHigh + 0.1)) { score += 35; indicators.push('FACE_BLENDING_DETECTED'); }
      if (temporalInconsistency > this.thresholds.deepfakeMed) { score += 20; indicators.push('TEMPORAL_INCONSISTENCY'); }

      return {
        score: Math.min(score, 100),
        confidence: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
        indicators,
        details: { eyeInconsistency, blinkingArtifacts, faceBlending, temporalInconsistency }
      };
    } catch (error) {
      return { score: 0, confidence: 'error', indicators: ['ANALYSIS_ERROR'], error: error.message };
    }
  }

  /**
   * Analyse contenu synthétique général
   */
  async analyzeSynthetic(preprocessedImage) {
    try {
      const noiseAnalysis = await this.analyzeSyntheticNoise(preprocessedImage);
      const frequencyAnalysis = await this.analyzeFrequencyDomain(preprocessedImage);
      const textureAnalysis = await this.analyzeSyntheticTextures(preprocessedImage);
      const colorAnalysis = await this.analyzeSyntheticColors(preprocessedImage);

      let score = 0;
      const indicators = [];
      if (noiseAnalysis.artificialPattern > 0.8) { score += 25; indicators.push('ARTIFICIAL_NOISE_PATTERN'); }
      if (frequencyAnalysis.anomalyScore > 0.7) { score += 30; indicators.push('FREQUENCY_ANOMALY'); }
      if (textureAnalysis.perfectionScore > 0.9) { score += 20; indicators.push('PERFECT_TEXTURES'); }
      if (colorAnalysis.unrealisticScore > 0.6) { score += 25; indicators.push('UNREALISTIC_COLORS'); }

      return {
        score: Math.min(score, 100),
        confidence: score > 60 ? 'high' : score > 30 ? 'medium' : 'low',
        indicators,
        details: { noiseAnalysis, frequencyAnalysis, textureAnalysis, colorAnalysis }
      };
    } catch {
      return { score: 0, confidence: 'error', indicators: ['SYNTHETIC_ANALYSIS_ERROR'] };
    }
  }

  /**
   * Analyse GAN
   */
  async analyzeGAN(preprocessedImage) {
    try {
      const gridArtifacts = await this.detectGridArtifacts(preprocessedImage);
      const modeCollapse = await this.detectModeCollapse(preprocessedImage);
      const generatorFingerprint = await this.detectGeneratorFingerprint(preprocessedImage);
      const spectralAnomalies = await this.detectSpectralAnomalies(preprocessedImage);

      let score = 0;
      const indicators = [];
      if (gridArtifacts > this.thresholds.ganHigh) { score += 30; indicators.push('GRID_ARTIFACTS'); }
      if (modeCollapse > this.thresholds.ganMed) { score += 25; indicators.push('MODE_COLLAPSE_DETECTED'); }
      if (generatorFingerprint.detected) { score += 40; indicators.push(`GENERATOR_FINGERPRINT_${generatorFingerprint.type}`); }
      if (spectralAnomalies > (this.thresholds.ganHigh + 0.1)) { score += 20; indicators.push('SPECTRAL_ANOMALIES'); }

      return {
        score: Math.min(score, 100),
        confidence: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
        indicators,
        details: { gridArtifacts, modeCollapse, generatorFingerprint, spectralAnomalies }
      };
    } catch {
      return { score: 0, confidence: 'error', indicators: ['GAN_ANALYSIS_ERROR'] };
    }
  }

  /**
   * Analyse Diffusion
   */
  async analyzeDiffusion(preprocessedImage) {
    try {
      const noiseResiduals = await this.detectNoiseResiduals(preprocessedImage);
      const attentionArtifacts = await this.detectAttentionArtifacts(preprocessedImage);
      const diffusionSignature = await this.detectDiffusionSignature(preprocessedImage);
      const timestepArtifacts = await this.detectTimestepArtifacts(preprocessedImage);

      let score = 0;
      const indicators = [];
      if (noiseResiduals > this.thresholds.diffusionMed) { score += 25; indicators.push('NOISE_RESIDUALS'); }
      if (attentionArtifacts > this.thresholds.diffusionHigh) { score += 30; indicators.push('ATTENTION_ARTIFACTS'); }
      if (diffusionSignature.detected) { score += 35; indicators.push(`DIFFUSION_SIGNATURE_${diffusionSignature.model}`); }
      if (timestepArtifacts > this.thresholds.diffusionMed) { score += 20; indicators.push('TIMESTEP_ARTIFACTS'); }

      return {
        score: Math.min(score, 100),
        confidence: score > 65 ? 'high' : score > 35 ? 'medium' : 'low',
        indicators,
        details: { noiseResiduals, attentionArtifacts, diffusionSignature, timestepArtifacts }
      };
    } catch {
      return { score: 0, confidence: 'error', indicators: ['DIFFUSION_ANALYSIS_ERROR'] };
    }
  }

  /**
   * Calcul score global IA
   */
  calculateOverallAIScore(analysis) {
    const weights = this.weights || { deepfake: 0.3, synthetic: 0.25, gan: 0.25, diffusion: 0.2 };
    let weightedScore = 0, totalWeight = 0;
    Object.entries(weights).forEach(([type, weight]) => {
      if (analysis[type] && analysis[type].score !== undefined) {
        weightedScore += analysis[type].score * weight;
        totalWeight += weight;
      }
    });
    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  }

  /**
   * Calcul niveau de confiance
   */
  calculateConfidence(analysis) {
    const scores = [
      analysis.deepfake?.score || 0,
      analysis.synthetic?.score || 0,
      analysis.gan?.score || 0,
      analysis.diffusion?.score || 0
    ];
    const maxScore = Math.max(...scores);
    const avgScore = scores.reduce((s, v) => s + v, 0) / scores.length;
    const consistency = scores.filter(s => Math.abs(s - avgScore) < 20).length / scores.length;

    if (maxScore > 80 && consistency > 0.7) return 'high';
    if (maxScore > 60 && consistency > 0.5) return 'medium';
    if (maxScore > 30) return 'low';
    return 'very_low';
  }

  /**
   * Identification générateurs spécifiques
   */
  async identifyGenerators(analysis) {
    const generators = [];
    const allIndicators = [
      ...(analysis.deepfake?.indicators || []),
      ...(analysis.synthetic?.indicators || []),
      ...(analysis.gan?.indicators || []),
      ...(analysis.diffusion?.indicators || [])
    ];
    const generatorMappings = {
      'GENERATOR_FINGERPRINT_STYLEGAN': 'StyleGAN',
      'GENERATOR_FINGERPRINT_BIGGAN': 'BigGAN',
      'DIFFUSION_SIGNATURE_STABLE_DIFFUSION': 'Stable Diffusion',
      'DIFFUSION_SIGNATURE_DALLE': 'DALL-E',
      'DIFFUSION_SIGNATURE_MIDJOURNEY': 'Midjourney',
      'FACE_BLENDING_DETECTED': 'FaceSwap/DeepFaceLab',
      'ATTENTION_ARTIFACTS': 'Attention-based Models'
    };
    allIndicators.forEach(indicator => {
      if (generatorMappings[indicator]) {
        generators.push({
          name: generatorMappings[indicator],
          confidence: this.getIndicatorConfidence(indicator, analysis),
          evidence: indicator
        });
      }
    });
    return generators;
  }

  // =====================================
  // MÉTHODES D'ANALYSE SPÉCIALISÉES (stubs)
  // =====================================

  async detectFaces() { return this.rnd() > 0.3; }
  async analyzeEyeInconsistency() { return this.rnd() * 0.3; }
  async analyzeBlinkingArtifacts() { return this.rnd() * 0.4; }
  async analyzeFaceBlending() { return this.rnd() * 0.2; }
  async analyzeTemporalInconsistency() { return this.rnd() * 0.3; }
  async analyzeSyntheticNoise() { return { artificialPattern: this.rnd() * 0.5, noiseLevel: this.rnd(), coherence: this.rnd() }; }
  async analyzeFrequencyDomain() { return { anomalyScore: this.rnd() * 0.4, spectralConsistency: this.rnd(), frequencySignature: 'unknown' }; }
  async analyzeSyntheticTextures() { return { perfectionScore: this.rnd() * 0.3, repetitionPattern: this.rnd(), naturalness: this.rnd() }; }
  async analyzeSyntheticColors() { return { unrealisticScore: this.rnd() * 0.4, colorCoherence: this.rnd(), saturationAnomalies: this.rnd() }; }
  async detectGridArtifacts() { return this.rnd() * 0.3; }
  async detectModeCollapse() { return this.rnd() * 0.2; }
  async detectGeneratorFingerprint() {
    const generators = ['STYLEGAN', 'BIGGAN', 'PROGRESSIVEGAN'];
    const detected = this.rnd() > 0.8;
    return {
      detected,
      type: detected ? generators[Math.floor(this.rnd() * generators.length)] : null,
      confidence: detected ? (this.rnd() * 0.5 + 0.5) : 0
    };
  }
  async detectSpectralAnomalies() { return this.rnd() * 0.4; }
  async detectNoiseResiduals() { return this.rnd() * 0.5; }
  async detectAttentionArtifacts() { return this.rnd() * 0.3; }
  async detectDiffusionSignature() {
    const models = ['STABLE_DIFFUSION', 'DALLE', 'MIDJOURNEY'];
    const detected = this.rnd() > 0.7;
    return {
      detected,
      model: detected ? models[Math.floor(this.rnd() * models.length)] : null,
      version: detected ? 'v' + (Math.floor(this.rnd() * 3) + 1) : null
    };
  }
  async detectTimestepArtifacts() { return this.rnd() * 0.4; }
  async analyzeStatisticalPatterns() { return { pixelDistribution: this.rnd(), correlationAnomalies: this.rnd() * 0.3, entropyAnalysis: this.rnd() }; }
  async analyzeAnatomicalCoherence() { return { proportionConsistency: this.rnd(), symmetryAnalysis: this.rnd() * 0.2, anatomicalRealism: this.rnd() }; }

  getIndicatorConfidence(indicator) {
    const confidenceMap = {
      'GENERATOR_FINGERPRINT_STYLEGAN': 0.9,
      'GENERATOR_FINGERPRINT_BIGGAN': 0.85,
      'DIFFUSION_SIGNATURE_STABLE_DIFFUSION': 0.85,
      'FACE_BLENDING_DETECTED': 0.8,
      'GRID_ARTIFACTS': 0.75,
      'ATTENTION_ARTIFACTS': 0.7
    };
    return confidenceMap[indicator] || 0.5;
  }
}

module.exports = new AIDetectionService();
