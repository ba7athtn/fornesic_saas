const mongoose = require('mongoose');
// ✅ CORRECTION CRITIQUE - Import explicite de Schema
const { Schema } = mongoose;
const { normalizeOrientation } = require('../utils/exifNormalizer');

// =====================================
// SCHEMAS EXIF DÉTAILLÉS - CONFORMES MÉTHODOLOGIE
// =====================================

// ✅ CORRIGÉ - Schema technique EXIF étendu
const technicalSchema = new Schema({
  // Orientation et dimensions
  orientation: {
    type: Number,
    min: 1,
    max: 8,
    set: normalizeOrientation,
    validate: {
      validator: function(value) {
        return value === null || (Number.isInteger(value) && value >= 1 && value <= 8);
      },
      message: 'Orientation must be an integer between 1 and 8, or null'
    },
    default: null
  },

  // Paramètres exposition
  iso: {
    type: Number,
    min: 0,
    max: 409600, // Limite technique actuelle
    default: null,
    validate: {
      validator: function(value) {
        return value === null || (value >= 50 && value <= 409600);
      },
      message: 'ISO value outside realistic range'
    }
  },

  aperture: {
    type: String,
    default: null,
    validate: {
      validator: function(value) {
        if (!value) return true;
        // Valider format f/x.x
        return /^f\/[0-9]+\.?[0-9]*$/.test(value);
      },
      message: 'Aperture must be in format f/x.x'
    }
  },

  apertureValue: {
    type: Number,
    min: 0.5,
    max: 64,
    default: null
  },

  shutterSpeed: {
    type: String,
    default: null
  },

  shutterSpeedValue: {
    type: Number,
    default: null
  },

  exposureTime: {
    type: Number,
    min: 0,
    max: 3600, // Maximum 1 heure
    default: null
  },

  exposureMode: {
    type: String,
    enum: ['Manual', 'Program', 'Aperture Priority', 'Shutter Priority', 'Creative', 'Action', 'Portrait', 'Landscape'],
    default: null
  },

  exposureCompensation: {
    type: Number,
    min: -5,
    max: 5,
    default: null
  },

  meteringMode: {
    type: String,
    enum: ['Unknown', 'Average', 'CenterWeightedAverage', 'Spot', 'MultiSpot', 'Pattern', 'Partial'],
    default: null
  },

  // Objectif et focus
  focalLength: {
    type: Number,
    min: 0,
    max: 2000, // Téléobjectifs extrêmes
    default: null
  },

  focalLengthIn35mmFormat: {
    type: Number,
    min: 0,
    max: 2000,
    default: null
  },

  maxAperture: {
    type: Number,
    min: 0.5,
    max: 64,
    default: null
  },

  subjectDistance: {
    type: Number,
    min: 0,
    default: null
  },

  // Flash
  flash: {
    type: String,
    default: null
  },

  flashMode: {
    type: String,
    enum: ['Unknown', 'CompulsoryFlashFiring', 'CompulsoryFlashSuppression', 'AutoMode'],
    default: null
  },

  flashExposureCompensation: {
    type: Number,
    min: -3,
    max: 3,
    default: null
  },

  // Balance blancs et couleur
  whiteBalance: {
    type: String,
    enum: ['Auto', 'Manual', 'Daylight', 'Shade', 'Tungsten', 'Fluorescent', 'Flash'],
    default: null
  },

  whiteBalanceMode: {
    type: String,
    default: null
  },

  colorSpace: {
    type: String,
    enum: ['sRGB', 'Adobe RGB', 'ProPhoto RGB', 'Wide Gamut RGB'],
    default: null
  },

  colorMode: {
    type: String,
    default: null
  },

  // Qualité et compression
  compressionMode: {
    type: String,
    default: null
  },

  quality: {
    type: String,
    enum: ['RAW', 'RAW+JPEG', 'Fine', 'Normal', 'Basic'],
    default: null
  },

  // Traitement d'image
  saturation: {
    type: String,
    enum: ['Normal', 'Low', 'High'],
    default: null
  },

  sharpness: {
    type: String,
    enum: ['Normal', 'Soft', 'Hard'],
    default: null
  },

  contrast: {
    type: String,
    enum: ['Normal', 'Soft', 'Hard'],
    default: null
  },

  // Autres paramètres techniques
  digitalZoom: {
    type: Number,
    min: 1,
    default: null
  },

  sceneMode: {
    type: String,
    default: null
  },

  gainControl: {
    type: String,
    enum: ['None', 'Low gain up', 'High gain up', 'Low gain down', 'High gain down'],
    default: null
  }
}, { _id: false });

// ✅ CORRIGÉ - Schema caméra étendu
const cameraSchema = new Schema({
  make: {
    type: String,
    trim: true,
    uppercase: true
  },

  model: {
    type: String,
    trim: true
  },

  lens: {
    type: String,
    trim: true
  },

  lensInfo: {
    minFocalLength: Number,
    maxFocalLength: Number,
    minAperture: Number,
    maxAperture: Number
  },

  lensSerialNumber: String,
  serialNumber: String,
  firmware: String,

  // Informations capteur
  sensorSize: {
    width: Number,
    height: Number,
    diagonal: Number
  },

  // Traitement interne
  imageProcessor: String,
  processingEngine: String,

  // Stabilisation
  imageStabilization: {
    type: String,
    enum: ['None', 'Optical', 'Electronic', 'Hybrid'],
    default: 'None'
  },

  // Modes spéciaux
  hdr: {
    enabled: Boolean,
    mode: String
  },

  multiShot: {
    enabled: Boolean,
    mode: String,
    count: Number
  }
}, { _id: false });

// ✅ CORRIGÉ - Schema timestamps étendu
const timestampsSchema = new Schema({
  // Timestamps principaux
  dateTimeOriginal: {
    type: Date
  },

  dateTimeDigitized: Date,
  modifyDate: Date,
  createDate: Date,

  // Timestamps avec fuseaux horaires
  offsetTimeOriginal: String,
  offsetTimeDigitized: String,
  offsetTime: String,

  // Sub-secondes
  subSecTimeOriginal: String,
  subSecTimeDigitized: String,
  subSecTime: String,

  // Timestamps système
  fileModifyDate: Date,
  fileAccessDate: Date,
  fileCreateDate: Date,

  // Validation temporelle
  temporalConsistency: {
    score: { type: Number, min: 0, max: 100 },
    anomalies: [String],
    validated: { type: Boolean, default: false }
  }
}, { _id: false });

// ✅ CORRIGÉ - Schema GPS étendu
const gpsSchema = new Schema({
  // Coordonnées
  latitude: {
    type: Number,
    min: -90,
    max: 90,
    validate: {
      validator: function(value) {
        return value === null || (value >= -90 && value <= 90);
      },
      message: 'Latitude must be between -90 and 90 degrees'
    }
  },

  longitude: {
    type: Number,
    min: -180,
    max: 180,
    validate: {
      validator: function(value) {
        return value === null || (value >= -180 && value <= 180);
      },
      message: 'Longitude must be between -180 and 180 degrees'
    }
  },

  altitude: {
    type: Number,
    min: -1000, // Mer Morte
    max: 10000 // Everest + marge
  },

  // Références et précision
  latitudeRef: {
    type: String,
    enum: ['N', 'S']
  },

  longitudeRef: {
    type: String,
    enum: ['E', 'W']
  },

  altitudeRef: {
    type: String,
    enum: ['Above Sea Level', 'Below Sea Level']
  },

  // Données GPS détaillées
  timestamp: Date,
  datestamp: String,
  satellites: String,

  status: {
    type: String,
    enum: ['A', 'V'] // Active/Void
  },

  measureMode: {
    type: String,
    enum: ['2', '3'] // 2D/3D
  },

  dop: Number, // Dilution of Precision

  // Vitesse et direction
  speed: Number,
  speedRef: {
    type: String,
    enum: ['K', 'M', 'N'] // km/h, mph, knots
  },

  track: Number,
  trackRef: {
    type: String,
    enum: ['T', 'M'] // True/Magnetic North
  },

  imgDirection: Number,
  imgDirectionRef: {
    type: String,
    enum: ['T', 'M']
  },

  // Destination et zone
  destLatitude: Number,
  destLongitude: Number,
  destBearing: Number,
  destDistance: Number,
  areaInformation: String,

  // Données différentielles
  differential: {
    type: Number,
    enum: [0, 1] // 0=no, 1=yes
  },

  hPositioningError: Number,

  // Validation GPS
  validationStatus: {
    coordinatesValid: { type: Boolean, default: true },
    altitudeRealistic: { type: Boolean, default: true },
    precisionAcceptable: { type: Boolean, default: true },
    anomalies: [String]
  }
}, { _id: false });

// ✅ CORRIGÉ - Schema logiciels étendu
const softwareSchema = new Schema({
  creator: String,
  software: String,
  processingHistory: [String],
  lastEditedWith: String,

  // Détection IA/génération
  aiSignatures: [{
    detected: Boolean,
    generator: {
      type: String,
      enum: ['Midjourney', 'DALL-E', 'Stable Diffusion', 'Adobe Firefly', 'Leonardo', 'Artbreeder', 'Unknown']
    },
    version: String,
    confidence: { type: Number, min: 0, max: 100 }
  }],

  // Logiciels de retouche détectés
  editingSoftware: [{
    name: String,
    version: String,
    detectionConfidence: { type: Number, min: 0, max: 100 }
  }],

  // Plugins et extensions
  pluginsDetected: [String],

  // Signature suspecte
  suspiciousIndicators: [{
    type: String,
    description: String,
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] }
  }]
}, { _id: false });

// ✅ CORRIGÉ - Schema dimensions étendu
const dimensionsSchema = new Schema({
  width: {
    type: Number,
    min: 1,
    required: false,
    default: null
  },

  height: {
    type: Number,
    min: 1,
    required: false,
    default: null
  },

  resolution: Number,
  resolutionUnit: {
    type: String,
    enum: ['None', 'inches', 'cm']
  },

  bitDepth: {
    type: Number,
    enum: [1, 8, 16, 24, 32]
  },

  colorSpace: String,
  pixelsPerUnitX: Number,
  pixelsPerUnitY: Number,

  // Aspect ratio
  aspectRatio: {
    type: Number,
    default: function() {
      return this.width && this.height ? this.width / this.height : null;
    }
  },

  // Megapixels
  megapixels: {
    type: Number,
    default: function() {
      return this.width && this.height ? (this.width * this.height) / 1000000 : null;
    }
  }
}, { _id: false });

// ✅ CORRIGÉ - Schema EXIF complet
const exifSchema = new Schema({
  camera: cameraSchema,
  technical: technicalSchema,
  timestamps: timestampsSchema,
  gps: gpsSchema,
  software: softwareSchema,
  dimensions: dimensionsSchema,

  // MakerNote et données propriétaires
  makerNote: {
    present: { type: Boolean, default: false },
    manufacturer: String,
    size: Number,
    encrypted: { type: Boolean, default: false },
    parseable: { type: Boolean, default: false },
    customTags: Schema.Types.Mixed
  },

  // Version et conformité EXIF
  exifVersion: String,
  compatibilityIDF: String,

  // Validation globale EXIF
  validationStatus: {
    structureValid: { type: Boolean, default: true },
    dataConsistent: { type: Boolean, default: true },
    completenessScore: { type: Number, min: 0, max: 100 },
    anomaliesCount: { type: Number, default: 0 },
    suspiciousElements: [String]
  }
}, { _id: false });

// =====================================
// SCHEMA ANALYSIS FORENSIQUE COMPLET
// =====================================

const forensicAnalysisSchema = new Schema({
  // Score d'authenticité global
  authenticity: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    confidence: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    methodology: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // Détection manipulation étendue
  manipulationDetection: {
    overall: { type: Number, min: 0, max: 100, default: 0 },
    // Types spécifiques
    compression: { type: Number, min: 0, max: 100, default: 0 },
    cloning: { type: Number, min: 0, max: 100, default: 0 },
    splicing: { type: Number, min: 0, max: 100, default: 0 },
    enhancement: { type: Number, min: 0, max: 100, default: 0 },
    resampling: { type: Number, min: 0, max: 100, default: 0 },
    inpainting: { type: Number, min: 0, max: 100, default: 0 },

    // Détection avancée
    copyMove: {
      detected: Boolean,
      confidence: Number,
      regions: [{
        source: { x: Number, y: Number, w: Number, h: Number },
        target: { x: Number, y: Number, w: Number, h: Number },
        similarity: Number
      }]
    },

    doubleJpegCompression: {
      detected: Boolean,
      confidence: Number,
      evidence: Schema.Types.Mixed
    },

    geometricTransforms: {
      rotation: { detected: Boolean, angle: Number },
      scaling: { detected: Boolean, factor: Number },
      translation: { detected: Boolean, offset: [Number] }
    }
  },

  // Détection IA étendue
  aiDetection: {
    generated: { type: Number, min: 0, max: 100, default: 0 },
    deepfake: { type: Number, min: 0, max: 100, default: 0 },
    synthetic: { type: Number, min: 0, max: 100, default: 0 },
    detectedGenerators: [{
      name: String,
      version: String,
      confidence: Number,
      evidence: Schema.Types.Mixed
    }],

    // Signatures spécifiques
    ganArtifacts: {
      detected: Boolean,
      type: String, // GAN, VAE, Diffusion
      confidence: Number
    },

    textToImageIndicators: {
      detected: Boolean,
      promptReconstruction: String,
      confidence: Number
    },

    imageToImageIndicators: {
      detected: Boolean,
      sourceType: String,
      confidence: Number
    }
  },

  // Analyse physique et géométrique
  physicalAnalysis: {
    lightingConsistency: {
      score: { type: Number, min: 0, max: 100 },
      violations: [{
        type: String,
        location: { x: Number, y: Number, w: Number, h: Number },
        severity: String
      }]
    },

    shadowAnalysis: {
      consistent: Boolean,
      directionCount: Number,
      anomalies: [String]
    },

    perspectiveAnalysis: {
      vanishingPoints: [{
        x: Number,
        y: Number,
        confidence: Number
      }],
      consistent: Boolean,
      violations: [String]
    },

    reflectionAnalysis: {
      detected: Boolean,
      geometryValid: Boolean,
      anomalies: [String]
    }
  },

  // Flags consolidés étendus
  flags: [{
    type: {
      type: String,
      required: true,
      enum: [
        'AI_GENERATED_SUSPECTED',
        'MANIPULATION_DETECTED',
        'METADATA_MISSING',
        'METADATA_LIMITED',
        'METADATA_INCONSISTENT',
        'COMPRESSION_ANOMALY',
        'SIGNATURE_MISMATCH',
        'SUSPICIOUS_PATTERN',
        'PHYSICS_VIOLATION',
        'TEMPORAL_ANOMALY',
        'GPS_IMPOSSIBLE',
        'SOFTWARE_SUSPICIOUS',
        'QUALITY_MISMATCH',
        'CONTEXT_INAPPROPRIATE'
      ]
    },

    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },

    // Source du flag
    detectedBy: {
      pillar: String,
      algorithm: String,
      version: String
    },

    // Preuves
    evidence: {
      location: { x: Number, y: Number, w: Number, h: Number },
      values: Schema.Types.Mixed,
      visualEvidence: String // chemin vers image preuve
    },

    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Métadonnées d'analyse étendues
  analysisMetadata: {
    version: {
      type: String,
      default: '3.0.0-forensic'
    },

    algorithms: [{
      pillar: String,
      name: String,
      version: String,
      parameters: Schema.Types.Mixed
    }],

    processingTime: {
      type: Number,
      min: 0
    },

    completedAt: Date,

    systemInfo: {
      platform: String,
      nodeVersion: String,
      memory: Number,
      cpuCores: Number
    },

    // Validation fichier étendue
    fileValidation: {
      signatureValid: { type: Boolean, default: true },
      sizeValid: { type: Boolean, default: true },
      formatSupported: { type: Boolean, default: true },
      corruptionDetected: { type: Boolean, default: false },
      integrityChecksum: String
    },

    // Performance
    performanceMetrics: {
      analysisSpeed: Number, // images par seconde
      memoryPeak: Number,
      cpuUsage: Number
    }
  }
}, { _id: false });

// =====================================
// ✅ CORRIGÉ - SCHEMA IMAGE PRINCIPAL ÉTENDU
// =====================================

const imageSchema = new Schema({
  // Informations fichier
  filename: {
    type: String,
    required: true,
    trim: true
  },

  originalName: {
    type: String,
    required: true,
    trim: true
  },

  size: {
    type: Number,
    required: true,
    min: 1
  },

  mimeType: {
    type: String,
    required: true,
    enum: [
      'image/jpeg', 'image/png', 'image/tiff', 'image/webp',
      'image/raw', 'image/dng', 'image/cr2', 'image/nef',
      'image/arw', 'image/orf', 'image/rw2', 'image/pef'
    ]
  },

  // Hash et identifiants
  hash: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return /^[a-f0-9]{64}$/i.test(value);
      },
      message: 'Hash must be a valid SHA-256 hexadecimal string'
    }
  },

  hashAlgorithm: {
    type: String,
    default: 'SHA-256'
  },

  additionalHashes: {
    md5: String,
    sha1: String,
    sha512: String
  },

  sessionId: {
    type: String,
    required: true,
    trim: true
  },

  // Statut étendu
  status: {
    type: String,
    enum: ['uploaded', 'validated', 'processing', 'analyzed', 'error', 'quarantined'],
    default: 'uploaded'
  },

  error: String,
  errorDetails: {
    timestamp: Date,
    type: String,
    recoverable: Boolean,
    stack: String
  },

  // Chemins fichiers étendus
  files: {
    original: {
      type: String,
      required: true
    },
    thumbnail: String,
    processed: String,
    preview: String,
    backup: String,
    // Formats export
    exports: {
      pdf: String,
      json: String,
      csv: String
    }
  },

  // Métadonnées upload étendues
  uploadMetadata: {
    ip: String,
    userAgent: String,
    source: {
      type: String,
      enum: ['web', 'web-app', 'api', 'batch', 'mobile', 'integration'],
      default: 'web-app'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: String,
    clientInfo: Schema.Types.Mixed
  },

  // Étapes traitement étendues
  processingSteps: [{
    step: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'error', 'skipped'],
      required: true
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now
    },
    endTime: Date,
    processingTime: Number,
    error: String,
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    metadata: Schema.Types.Mixed
  }],

  // Analyse forensique complète
  forensicAnalysis: forensicAnalysisSchema,

  // Données EXIF complètes
  exifData: exifSchema,

  // Score authenticité
  authenticityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },

  // Classification risque
  riskClassification: {
    level: {
      type: String,
      enum: ['AUTHENTIC', 'LIKELY_AUTHENTIC', 'UNCERTAIN', 'LIKELY_FAKE', 'FAKE']
    },
    confidence: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // Quarantaine et sécurité
  quarantine: {
    status: {
      type: String,
      enum: ['none', 'suspicious', 'malware', 'policy_violation'],
      default: 'none'
    },
    reason: String,
    quarantinedAt: Date,
    releaseScheduled: Date
  },

  // Annotations et reviews
  annotations: [{
    type: {
      type: String,
      enum: ['note', 'flag', 'correction', 'validation']
    },
    content: String,
    annotatedBy: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    visibility: {
      type: String,
      enum: ['private', 'team', 'public'],
      default: 'team'
    }
  }],

  // Historique et audit
  auditLog: [{
    action: String,
    performedBy: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: Schema.Types.Mixed,
    ipAddress: String
  }],

  // Configuration privacité
  privacy: {
    mode: {
      type: String,
      enum: ['JUDICIAL', 'COMMERCIAL', 'RESEARCH', 'CUSTOM'],
      default: 'COMMERCIAL'
    },
    retentionPolicy: String,
    anonymized: {
      type: Boolean,
      default: false
    },
    gdprCompliant: {
      type: Boolean,
      default: true
    }
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// =====================================
// INDEX OPTIMISÉS ÉTENDUS
// =====================================

imageSchema.index({ hash: 1 }, { unique: true });
imageSchema.index({ sessionId: 1, createdAt: -1 });
imageSchema.index({ status: 1, createdAt: -1 });
imageSchema.index({ authenticityScore: 1 });
imageSchema.index({ 'riskClassification.level': 1 });
imageSchema.index({ 'forensicAnalysis.flags.severity': 1 });
imageSchema.index({ 'forensicAnalysis.flags.type': 1 });
imageSchema.index({ 'uploadMetadata.source': 1 });
imageSchema.index({ 'quarantine.status': 1 });
imageSchema.index({ 'exifData.camera.make': 1 });
imageSchema.index({ 'exifData.software.creator': 1 });
imageSchema.index({ 'exifData.timestamps.dateTimeOriginal': 1 });

// =====================================
// MÉTHODES ÉTENDUES
// =====================================

// Méthodes existantes améliorées
imageSchema.methods.updateStatus = function(newStatus, processingStep = null) {
  this.status = newStatus;
  
  if (processingStep) {
    this.processingSteps.push({
      step: processingStep.step,
      status: processingStep.status,
      startTime: processingStep.startTime || new Date(),
      endTime: processingStep.endTime || null,
      processingTime: processingStep.processingTime || null,
      error: processingStep.error || null,
      progress: processingStep.progress || 0,
      metadata: processingStep.metadata || {}
    });
  }

  // Audit log
  this.auditLog.push({
    action: `Status changed to ${newStatus}`,
    performedBy: 'system',
    details: { previousStatus: this.status, newStatus, processingStep }
  });

  return this.save();
};

imageSchema.methods.addFlag = function(flagData) {
  this.forensicAnalysis.flags.push({
    type: flagData.type,
    severity: flagData.severity,
    message: flagData.message,
    confidence: flagData.confidence,
    detectedBy: flagData.detectedBy,
    evidence: flagData.evidence,
    timestamp: new Date()
  });

  // Audit log
  this.auditLog.push({
    action: 'Flag added',
    performedBy: flagData.detectedBy?.pillar || 'system',
    details: flagData
  });

  return this.save();
};

// Nouvelles méthodes étendues
imageSchema.methods.calculateComprehensiveRisk = function() {
  let riskScore = 0;
  let factors = [];

  // Score authenticité
  if (this.authenticityScore !== null) {
    riskScore = 100 - this.authenticityScore;
    factors.push({ factor: 'authenticity', impact: riskScore });
  }

  // Flags critiques
  const criticalFlags = this.forensicAnalysis?.flags?.filter(f => f.severity === 'critical') || [];
  if (criticalFlags.length > 0) {
    const flagImpact = criticalFlags.length * 25;
    riskScore = Math.max(riskScore, flagImpact);
    factors.push({ factor: 'critical_flags', count: criticalFlags.length, impact: flagImpact });
  }

  // Détection IA
  if (this.forensicAnalysis?.aiDetection?.generated > 70) {
    const aiImpact = this.forensicAnalysis.aiDetection.generated * 0.8;
    riskScore = Math.max(riskScore, aiImpact);
    factors.push({ factor: 'ai_detection', score: this.forensicAnalysis.aiDetection.generated, impact: aiImpact });
  }

  // Manipulation détectée
  if (this.forensicAnalysis?.manipulationDetection?.overall > 50) {
    const manipImpact = this.forensicAnalysis.manipulationDetection.overall * 0.7;
    riskScore = Math.max(riskScore, manipImpact);
    factors.push({ factor: 'manipulation', score: this.forensicAnalysis.manipulationDetection.overall, impact: manipImpact });
  }

  // Métadonnées suspectes
  if (!this.exifData || Object.keys(this.exifData).length === 0) {
    riskScore = Math.max(riskScore, 60);
    factors.push({ factor: 'missing_metadata', impact: 60 });
  }

  // Déterminer niveau
  let level = 'AUTHENTIC';
  if (riskScore >= 80) level = 'FAKE';
  else if (riskScore >= 60) level = 'LIKELY_FAKE';
  else if (riskScore >= 40) level = 'UNCERTAIN';
  else if (riskScore >= 20) level = 'LIKELY_AUTHENTIC';

  // Confiance basée sur nombre de facteurs analysés
  let confidence = 'low';
  if (factors.length >= 3) confidence = 'high';
  else if (factors.length >= 2) confidence = 'medium';

  return {
    score: Math.min(Math.round(riskScore), 100),
    level: level,
    confidence: confidence,
    factors: factors,
    calculatedAt: new Date()
  };
};

imageSchema.methods.generateForensicSummary = function() {
  const risk = this.calculateComprehensiveRisk();
  const flags = this.forensicAnalysis?.flags || [];

  return {
    // Identification
    id: this._id.toString(),
    filename: this.originalName,
    hash: this.hash,

    // Évaluation risque
    riskAssessment: risk,

    // Flags par sévérité
    flagsSummary: {
      critical: flags.filter(f => f.severity === 'critical').length,
      warning: flags.filter(f => f.severity === 'warning').length,
      info: flags.filter(f => f.severity === 'info').length,
      total: flags.length
    },

    // Scores principaux
    scores: {
      authenticity: this.authenticityScore,
      aiGeneration: this.forensicAnalysis?.aiDetection?.generated || 0,
      manipulation: this.forensicAnalysis?.manipulationDetection?.overall || 0
    },

    // Métadonnées key
    metadata: {
      hasExif: !!(this.exifData && Object.keys(this.exifData).length > 0),
      camera: this.exifData?.camera ? `${this.exifData.camera.make} ${this.exifData.camera.model}` : null,
      software: this.exifData?.software?.creator || null,
      gpsPresent: !!(this.exifData?.gps?.latitude && this.exifData?.gps?.longitude)
    },

    // Status et timing
    status: this.status,
    analyzedAt: this.forensicAnalysis?.analysisMetadata?.completedAt,
    processingTime: this.forensicAnalysis?.analysisMetadata?.processingTime
  };
};

imageSchema.methods.addAnnotation = function(annotation, user) {
  this.annotations.push({
    type: annotation.type,
    content: annotation.content,
    annotatedBy: user,
    visibility: annotation.visibility || 'team',
    timestamp: new Date()
  });

  this.auditLog.push({
    action: 'Annotation added',
    performedBy: user,
    details: annotation
  });

  return this.save();
};

imageSchema.methods.quarantineImage = function(reason, scheduledRelease) {
  this.quarantine = {
    status: 'suspicious',
    reason: reason,
    quarantinedAt: new Date(),
    releaseScheduled: scheduledRelease
  };

  this.status = 'quarantined';

  this.auditLog.push({
    action: 'Image quarantined',
    performedBy: 'system',
    details: { reason, scheduledRelease }
  });

  return this.save();
};

// =====================================
// MÉTHODES STATIQUES ÉTENDUES
// =====================================

imageSchema.statics.findByRiskLevel = function(level, limit = 50) {
  return this.find({ 'riskClassification.level': level })
    .sort({ createdAt: -1 })
    .limit(limit);
};

imageSchema.statics.findWithCriticalFlags = function() {
  return this.find({ 'forensicAnalysis.flags.severity': 'critical' })
    .sort({ createdAt: -1 });
};

imageSchema.statics.findByCamera = function(make, model) {
  const query = {};
  if (make) query['exifData.camera.make'] = new RegExp(make, 'i');
  if (model) query['exifData.camera.model'] = new RegExp(model, 'i');
  return this.find(query).sort({ createdAt: -1 });
};

imageSchema.statics.findBySoftware = function(software) {
  return this.find({
    $or: [
      { 'exifData.software.creator': new RegExp(software, 'i') },
      { 'exifData.software.software': new RegExp(software, 'i') }
    ]
  }).sort({ createdAt: -1 });
};

imageSchema.statics.getForensicStats = function(days = 30) {
  const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
  
  return this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalImages: { $sum: 1 },
        averageAuthenticityScore: { $avg: '$authenticityScore' },
        riskDistribution: { $push: '$riskClassification.level' },
        flagsDistribution: { $push: { $size: { $ifNull: ['$forensicAnalysis.flags', []] } } },
        processingTimes: { $push: '$forensicAnalysis.analysisMetadata.processingTime' }
      }
    }
  ]);
};

// =====================================
// MIDDLEWARE ÉTENDU
// =====================================

imageSchema.pre('save', function(next) {
  // Validation cohérence authenticityScore
  if (this.forensicAnalysis?.authenticity?.score) {
    this.authenticityScore = this.forensicAnalysis.authenticity.score;
  }

  // Mise à jour classification risque
  if (this.authenticityScore !== null) {
    const riskAssessment = this.calculateComprehensiveRisk();
    this.riskClassification = {
      level: riskAssessment.level,
      confidence: riskAssessment.confidence,
      lastUpdated: new Date()
    };
  }

  // Validation taille fichier
  if (this.size <= 0) {
    return next(new Error('La taille du fichier doit être positive'));
  }

  // Validation hash format
  if (this.hash && !/^[a-f0-9]{64}$/i.test(this.hash)) {
    return next(new Error('Format de hash SHA-256 invalide'));
  }

  // Validation MIME type
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/tiff', 'image/webp',
    'image/raw', 'image/dng', 'image/cr2', 'image/nef',
    'image/arw', 'image/orf', 'image/rw2', 'image/pef'
  ];

  if (!allowedTypes.includes(this.mimeType)) {
    return next(new Error(`Type MIME non supporté: ${this.mimeType}`));
  }

  next();
});

imageSchema.post('save', function(doc) {
  console.log(`💾 Image sauvegardée: ${doc._id} - Status: ${doc.status} - Risk: ${doc.riskClassification?.level}`);
});

// =====================================
// VIRTUALS ÉTENDUS
// =====================================

imageSchema.virtual('analysisProgress').get(function() {
  switch (this.status) {
    case 'analyzed': return 100;
    case 'processing':
      const lastStep = this.processingSteps[this.processingSteps.length - 1];
      return lastStep ? lastStep.progress : 50;
    case 'error': return 0;
    case 'quarantined': return -1;
    default: return 10;
  }
});

imageSchema.virtual('fileExists').get(function() {
  const fs = require('fs');
  return this.files.original ? fs.existsSync(this.files.original) : false;
});

imageSchema.virtual('flagsCount').get(function() {
  return this.forensicAnalysis?.flags?.length || 0;
});

imageSchema.virtual('criticalFlagsCount').get(function() {
  return this.forensicAnalysis?.flags?.filter(f => f.severity === 'critical').length || 0;
});

imageSchema.virtual('hasAiDetection').get(function() {
  return this.forensicAnalysis?.aiDetection?.generated > 30;
});

imageSchema.virtual('hasManipulationDetection').get(function() {
  return this.forensicAnalysis?.manipulationDetection?.overall > 20;
});

imageSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

// =====================================
// TRANSFORMATION JSON ÉTENDUE
// =====================================

imageSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Ajouter propriétés calculées
    ret.riskLevel = doc.riskClassification?.level || 'UNKNOWN';
    ret.analysisProgress = doc.analysisProgress;
    ret.flagsCount = doc.flagsCount;
    ret.criticalFlagsCount = doc.criticalFlagsCount;
    ret.hasAiDetection = doc.hasAiDetection;
    ret.hasManipulationDetection = doc.hasManipulationDetection;
    ret.ageInHours = doc.ageInHours;

    // Masquer données sensibles selon mode privacy
    if (doc.privacy?.anonymized) {
      delete ret.uploadMetadata?.ip;
      delete ret.auditLog;
      delete ret.annotations;
    }

    return ret;
  }
});

module.exports = mongoose.model('Image', imageSchema);
