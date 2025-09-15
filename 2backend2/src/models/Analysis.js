const mongoose = require('mongoose');

// =====================================
// SCHEMAS POUR LES 7 PILIERS D'ANALYSE
// =====================================

// Pilier 1: Analyse Anatomique & Objets
const anatomicalAnalysisSchema = new mongoose.Schema({
  facialSymmetryScore: { type: Number, min: 0, max: 100, default: null },
  skinTextureConsistency: { type: Number, min: 0, max: 100, default: null },
  anatomicalCoherence: { type: Number, min: 0, max: 100, default: null },
  objectRealismScore: { type: Number, min: 0, max: 100, default: null },
  groomingContextMatch: { type: Number, min: 0, max: 100, default: null },
  perfectionAnomalies: [{
    type: { type: String, enum: ['perfect_skin', 'unnatural_symmetry', 'impossible_grooming', 'object_unrealistic'] },
    confidence: { type: Number, min: 0, max: 100 },
    location: { x: Number, y: Number, width: Number, height: Number }
  }],
  overallScore: { type: Number, min: 0, max: 100, default: null }
}, { _id: false });

// Pilier 2: Violations Physiques & Géométriques
const physicsAnalysisSchema = new mongoose.Schema({
  vanishingPointsConsistent: { type: Boolean, default: null },
  shadowDirectionConsistent: { type: Boolean, default: null },
  reflectionGeometryValid: { type: Boolean, default: null },
  perspectiveCoherence: { type: Number, min: 0, max: 100, default: null },
  lightingConsistency: { type: Number, min: 0, max: 100, default: null },
  physicsViolations: [{
    type: { type: String, enum: ['multiple_vanishing_points', 'shadow_inconsistency', 'reflection_impossible', 'perspective_error'] },
    confidence: { type: Number, min: 0, max: 100 },
    description: String,
    location: { x: Number, y: Number, width: Number, height: Number }
  }],
  overallScore: { type: Number, min: 0, max: 100, default: null }
}, { _id: false });

// Pilier 3: Empreintes Statistiques & Pixel
const statisticalAnalysisSchema = new mongoose.Schema({
  noisePatternScore: { type: Number, min: 0, max: 100, default: null },
  compressionArtifacts: { type: Number, min: 0, max: 100, default: null },
  copyMoveDetection: { type: Number, min: 0, max: 100, default: null },
  frequencyDomainScore: { type: Number, min: 0, max: 100, default: null },
  pixelCorrelationScore: { type: Number, min: 0, max: 100, default: null },
  statisticalAnomalies: [{
    type: { type: String, enum: ['artificial_noise', 'double_jpeg', 'cloned_regions', 'frequency_anomaly'] },
    confidence: { type: Number, min: 0, max: 100 },
    evidence: mongoose.Schema.Types.Mixed
  }],
  overallScore: { type: Number, min: 0, max: 100, default: null }
}, { _id: false });

// Pilier 4: Forensique EXIF Avancée
const exifForensicsSchema = new mongoose.Schema({
  temporalConsistency: { type: Number, min: 0, max: 100, default: null },
  cameraFingerprintValid: { type: Boolean, default: null },
  technicalCoherence: { type: Number, min: 0, max: 100, default: null },
  softwareSignatures: [{
    software: String,
    version: String,
    suspicionLevel: { type: String, enum: ['clean', 'suspicious', 'ai_generated'] },
    confidence: { type: Number, min: 0, max: 100 }
  }],
  metadataCompleteness: { type: Number, min: 0, max: 100, default: null },
  makerNoteIntegrity: { type: Boolean, default: null },
  gpsConsistency: { type: Number, min: 0, max: 100, default: null },
  timestampAnomalies: [{
    type: { type: String, enum: ['future_date', 'impossible_sequence', 'timezone_mismatch'] },
    description: String,
    confidence: { type: Number, min: 0, max: 100 }
  }],
  overallScore: { type: Number, min: 0, max: 100, default: null }
}, { _id: false });

// Pilier 5: Comportement & Contexte
const behavioralAnalysisSchema = new mongoose.Schema({
  crowdDiversityScore: { type: Number, min: 0, max: 100, default: null },
  emotionalCoherence: { type: Number, min: 0, max: 100, default: null },
  environmentalConsistency: { type: Number, min: 0, max: 100, default: null },
  culturalAppropriateness: { type: Number, min: 0, max: 100, default: null },
  temporalLogic: { type: Number, min: 0, max: 100, default: null },
  contextualAnomalies: [{
    type: { type: String, enum: ['crowd_uniformity', 'emotion_mismatch', 'anachronism', 'cultural_inconsistency'] },
    confidence: { type: Number, min: 0, max: 100 },
    description: String
  }],
  overallScore: { type: Number, min: 0, max: 100, default: null }
}, { _id: false });

// Pilier 6: Forensique Audio & Vocal
const audioForensicsSchema = new mongoose.Schema({
  audioAvailable: { type: Boolean, default: false },
  voiceNaturalness: { type: Number, min: 0, max: 100, default: null },
  environmentalAudioConsistency: { type: Number, min: 0, max: 100, default: null },
  linguisticAuthenticity: { type: Number, min: 0, max: 100, default: null },
  spectralAnalysisScore: { type: Number, min: 0, max: 100, default: null },
  audioVideoSync: { type: Number, min: 0, max: 100, default: null },
  audioAnomalies: [{
    type: { type: String, enum: ['synthetic_voice', 'unnatural_pacing', 'missing_ambient', 'spectral_artifact'] },
    confidence: { type: Number, min: 0, max: 100 },
    timeStamp: Number,
    description: String
  }],
  overallScore: { type: Number, min: 0, max: 100, default: null }
}, { _id: false });

// Pilier 7: Détection Intuitive & Expertise
const expertAnalysisSchema = new mongoose.Schema({
  uncannyValleyScore: { type: Number, min: 0, max: 100, default: null },
  productionQualityParadox: { type: Number, min: 0, max: 100, default: null },
  timingConvenienceScore: { type: Number, min: 0, max: 100, default: null },
  expertReviewRequired: { type: Boolean, default: false },
  multiSourceCorrelation: { type: Number, min: 0, max: 100, default: null },
  intuitiveConcerns: [{
    type: { type: String, enum: ['uncanny_valley', 'too_convenient', 'source_mismatch', 'expert_flagged'] },
    confidence: { type: Number, min: 0, max: 100 },
    description: String,
    reviewerNote: String
  }],
  overallScore: { type: Number, min: 0, max: 100, default: null }
}, { _id: false });

// =====================================
// SCHEMA ANALYSE PRINCIPAL CORRIGÉ
// =====================================

const AnalysisSchema = new mongoose.Schema({
  // ✅ CORRECTION - Suppression index: true (gardé seulement dans schema.index())
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
    // ❌ SUPPRIMÉ: index: true (car défini plus bas avec schema.index())
  },

  // Version du système d'analyse
  analysisVersion: {
    type: String,
    default: '3.0.0-forensic',
    required: true
  },

  // Configuration des piliers activés
  enabledPillars: {
    anatomical: { type: Boolean, default: true },
    physics: { type: Boolean, default: true },
    statistical: { type: Boolean, default: true },
    exif: { type: Boolean, default: true },
    behavioral: { type: Boolean, default: true },
    audio: { type: Boolean, default: true },
    expert: { type: Boolean, default: true }
  },

  // Résultats des 7 piliers
  anatomicalAnalysis: anatomicalAnalysisSchema,
  physicsAnalysis: physicsAnalysisSchema,
  statisticalAnalysis: statisticalAnalysisSchema,
  exifForensics: exifForensicsSchema,
  behavioralAnalysis: behavioralAnalysisSchema,
  audioForensics: audioForensicsSchema,
  expertAnalysis: expertAnalysisSchema,

  // Score global agrégé
  aggregatedScore: {
    authenticity: { type: Number, min: 0, max: 100, default: null },
    confidence: { type: String, enum: ['low', 'medium', 'high'], default: null },
    riskLevel: { type: String, enum: ['AUTHENTIC', 'LIKELY_AUTHENTIC', 'UNCERTAIN', 'LIKELY_FAKE', 'FAKE'], default: null }
  },

  // Pondération des piliers
  pillarWeights: {
    anatomical: { type: Number, default: 0.15, min: 0, max: 1 },
    physics: { type: Number, default: 0.20, min: 0, max: 1 },
    statistical: { type: Number, default: 0.20, min: 0, max: 1 },
    exif: { type: Number, default: 0.25, min: 0, max: 1 },
    behavioral: { type: Number, default: 0.10, min: 0, max: 1 },
    audio: { type: Number, default: 0.05, min: 0, max: 1 },
    expert: { type: Number, default: 0.05, min: 0, max: 1 }
  },

  // Métadonnées d'analyse
  analysisMetadata: {
    startTime: { type: Date, required: true, default: Date.now },
    endTime: Date,
    processingTime: { type: Number, min: 0 }, // millisecondes
    algorithmVersions: [{
      pillar: String,
      algorithm: String,
      version: String
    }],
    hardwareInfo: {
      cpuCores: Number,
      memoryUsed: Number,
      gpuUsed: Boolean
    },
    errorsDuringAnalysis: [{
      pillar: String,
      error: String,
      timestamp: { type: Date, default: Date.now },
      recoverable: Boolean
    }]
  },

  // Flags consolidés
  consolidatedFlags: [{
    type: { type: String, required: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], required: true },
    pillarSource: [String], // Quels piliers ont contribué à ce flag
    confidence: { type: Number, min: 0, max: 100, required: true },
    message: { type: String, required: true },
    evidence: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
  }],

  // Configuration administrateur
  privacyMode: {
    type: String,
    enum: ['JUDICIAL', 'COMMERCIAL', 'RESEARCH', 'CUSTOM'],
    default: 'COMMERCIAL'
  },

  retentionPolicy: {
    type: String,
    default: '30_DAYS'
  },

  anonymizationApplied: {
    type: Boolean,
    default: true
  },

  // Chaîne de custody
  chainOfCustody: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    user: String,
    details: mongoose.Schema.Types.Mixed
  }],

  // Résultats legacy (compatibilité)
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // ✅ CORRECTION - Suppression index: true (gardé seulement dans schema.index())
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'partial'],
    default: 'pending'
    // ❌ SUPPRIMÉ: index: true (car défini plus bas avec schema.index())
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// =====================================
// INDEX OPTIMISÉS - ✅ CORRIGÉS (suppression des doublons)
// =====================================

AnalysisSchema.index({ imageId: 1 }, { unique: true });
AnalysisSchema.index({ status: 1, createdAt: -1 });
AnalysisSchema.index({ 'aggregatedScore.riskLevel': 1 });
AnalysisSchema.index({ 'consolidatedFlags.severity': 1 });
AnalysisSchema.index({ analysisVersion: 1 });
AnalysisSchema.index({ privacyMode: 1 });

// =====================================
// MÉTHODES D'INSTANCE
// =====================================

AnalysisSchema.methods.calculateAggregatedScore = function() {
  const weights = this.pillarWeights;
  let totalScore = 0;
  let totalWeight = 0;

  // Calculer score pondéré
  if (this.anatomicalAnalysis?.overallScore !== null) {
    totalScore += this.anatomicalAnalysis.overallScore * weights.anatomical;
    totalWeight += weights.anatomical;
  }

  if (this.physicsAnalysis?.overallScore !== null) {
    totalScore += this.physicsAnalysis.overallScore * weights.physics;
    totalWeight += weights.physics;
  }

  if (this.statisticalAnalysis?.overallScore !== null) {
    totalScore += this.statisticalAnalysis.overallScore * weights.statistical;
    totalWeight += weights.statistical;
  }

  if (this.exifForensics?.overallScore !== null) {
    totalScore += this.exifForensics.overallScore * weights.exif;
    totalWeight += weights.exif;
  }

  if (this.behavioralAnalysis?.overallScore !== null) {
    totalScore += this.behavioralAnalysis.overallScore * weights.behavioral;
    totalWeight += weights.behavioral;
  }

  if (this.audioForensics?.overallScore !== null) {
    totalScore += this.audioForensics.overallScore * weights.audio;
    totalWeight += weights.audio;
  }

  if (this.expertAnalysis?.overallScore !== null) {
    totalScore += this.expertAnalysis.overallScore * weights.expert;
    totalWeight += weights.expert;
  }

  const finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : null;

  // Déterminer niveau de risque
  let riskLevel = 'UNCERTAIN';
  if (finalScore !== null) {
    if (finalScore >= 80) riskLevel = 'AUTHENTIC';
    else if (finalScore >= 60) riskLevel = 'LIKELY_AUTHENTIC';
    else if (finalScore >= 40) riskLevel = 'UNCERTAIN';
    else if (finalScore >= 20) riskLevel = 'LIKELY_FAKE';
    else riskLevel = 'FAKE';
  }

  // Déterminer niveau de confiance
  const criticalFlags = this.consolidatedFlags.filter(f => f.severity === 'critical').length;
  const completedPillars = [
    this.anatomicalAnalysis?.overallScore,
    this.physicsAnalysis?.overallScore,
    this.statisticalAnalysis?.overallScore,
    this.exifForensics?.overallScore,
    this.behavioralAnalysis?.overallScore,
    this.audioForensics?.overallScore,
    this.expertAnalysis?.overallScore
  ].filter(s => s !== null && s !== undefined).length;

  let confidence = 'low';
  if (completedPillars >= 5 && criticalFlags === 0) confidence = 'high';
  else if (completedPillars >= 3) confidence = 'medium';

  this.aggregatedScore = {
    authenticity: finalScore,
    confidence: confidence,
    riskLevel: riskLevel
  };

  return this.save();
};

AnalysisSchema.methods.addFlag = function(flagData) {
  this.consolidatedFlags.push({
    type: flagData.type,
    severity: flagData.severity,
    pillarSource: flagData.pillarSource || ['unknown'],
    confidence: flagData.confidence,
    message: flagData.message,
    evidence: flagData.evidence,
    timestamp: new Date()
  });

  return this.save();
};

AnalysisSchema.methods.addChainOfCustodyEntry = function(action, user, details) {
  this.chainOfCustody.push({
    action: action,
    user: user,
    details: details,
    timestamp: new Date()
  });

  return this.save();
};

AnalysisSchema.methods.getDetailedResults = function() {
  return {
    imageId: this.imageId,
    analysisVersion: this.analysisVersion,
    aggregatedScore: this.aggregatedScore,
    pillarResults: {
      anatomical: this.anatomicalAnalysis,
      physics: this.physicsAnalysis,
      statistical: this.statisticalAnalysis,
      exif: this.exifForensics,
      behavioral: this.behavioralAnalysis,
      audio: this.audioForensics,
      expert: this.expertAnalysis
    },
    flags: this.consolidatedFlags,
    metadata: this.analysisMetadata,
    chainOfCustody: this.chainOfCustody
  };
};

// =====================================
// MÉTHODES STATIQUES
// =====================================

AnalysisSchema.statics.findByRiskLevel = function(riskLevel) {
  return this.find({ 'aggregatedScore.riskLevel': riskLevel });
};

AnalysisSchema.statics.findWithCriticalFlags = function() {
  return this.find({ 'consolidatedFlags.severity': 'critical' });
};

AnalysisSchema.statics.getAnalysisStats = function(days = 30) {
  const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
  
  return this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalAnalyses: { $sum: 1 },
        averageScore: { $avg: '$aggregatedScore.authenticity' },
        riskDistribution: {
          $push: '$aggregatedScore.riskLevel'
        },
        averageProcessingTime: { $avg: '$analysisMetadata.processingTime' }
      }
    }
  ]);
};

// =====================================
// MIDDLEWARE
// =====================================

AnalysisSchema.pre('save', function(next) {
  // Validation cohérence pondération
  const weights = this.pillarWeights;
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  
  if (Math.abs(totalWeight - 1.0) > 0.01) {
    return next(new Error('La somme des poids des piliers doit être égale à 1.0'));
  }

  // Finaliser timing si completed
  if (this.status === 'completed' && !this.analysisMetadata.endTime) {
    this.analysisMetadata.endTime = new Date();
    if (this.analysisMetadata.startTime) {
      this.analysisMetadata.processingTime = this.analysisMetadata.endTime - this.analysisMetadata.startTime;
    }
  }

  next();
});

AnalysisSchema.post('save', function(doc) {
  console.log(`🔬 Analyse sauvegardée: ${doc._id} - Status: ${doc.status} - Score: ${doc.aggregatedScore?.authenticity}`);
});

// =====================================
// VIRTUALS
// =====================================

AnalysisSchema.virtual('isComplete').get(function() {
  return this.status === 'completed';
});

AnalysisSchema.virtual('processingTimeSeconds').get(function() {
  return this.analysisMetadata?.processingTime ? Math.round(this.analysisMetadata.processingTime / 1000) : null;
});

AnalysisSchema.virtual('criticalFlagsCount').get(function() {
  return this.consolidatedFlags.filter(f => f.severity === 'critical').length;
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
