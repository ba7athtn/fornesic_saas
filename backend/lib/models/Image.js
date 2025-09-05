"use strict";

var mongoose = require('mongoose');
var _require = require('../utils/exifNormalizer'),
  normalizeOrientation = _require.normalizeOrientation;

// =====================================
// SCHEMAS EXIF DÉTAILLÉS - CONFORMES MÉTHODOLOGIE
// =====================================

// Schema technique EXIF étendu
var technicalSchema = new mongoose.Schema({
  // Orientation et dimensions
  orientation: {
    type: Number,
    min: 1,
    max: 8,
    set: normalizeOrientation,
    validate: {
      validator: function validator(value) {
        return value === null || Number.isInteger(value) && value >= 1 && value <= 8;
      },
      message: 'Orientation must be an integer between 1 and 8, or null'
    },
    "default": null
  },
  // Paramètres exposition
  iso: {
    type: Number,
    min: 0,
    max: 409600,
    // Limite technique actuelle
    "default": null,
    validate: {
      validator: function validator(value) {
        return value === null || value >= 50 && value <= 409600;
      },
      message: 'ISO value outside realistic range'
    }
  },
  aperture: {
    type: String,
    "default": null,
    validate: {
      validator: function validator(value) {
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
    "default": null
  },
  shutterSpeed: {
    type: String,
    "default": null
  },
  shutterSpeedValue: {
    type: Number,
    "default": null
  },
  exposureTime: {
    type: Number,
    min: 0,
    max: 3600,
    // Maximum 1 heure
    "default": null
  },
  exposureMode: {
    type: String,
    "enum": ['Manual', 'Program', 'Aperture Priority', 'Shutter Priority', 'Creative', 'Action', 'Portrait', 'Landscape'],
    "default": null
  },
  exposureCompensation: {
    type: Number,
    min: -5,
    max: 5,
    "default": null
  },
  meteringMode: {
    type: String,
    "enum": ['Unknown', 'Average', 'CenterWeightedAverage', 'Spot', 'MultiSpot', 'Pattern', 'Partial'],
    "default": null
  },
  // Objectif et focus
  focalLength: {
    type: Number,
    min: 0,
    max: 2000,
    // Téléobjectifs extrêmes
    "default": null
  },
  focalLengthIn35mmFormat: {
    type: Number,
    min: 0,
    max: 2000,
    "default": null
  },
  maxAperture: {
    type: Number,
    min: 0.5,
    max: 64,
    "default": null
  },
  subjectDistance: {
    type: Number,
    min: 0,
    "default": null
  },
  // Flash
  flash: {
    type: String,
    "default": null
  },
  flashMode: {
    type: String,
    "enum": ['Unknown', 'CompulsoryFlashFiring', 'CompulsoryFlashSuppression', 'AutoMode'],
    "default": null
  },
  flashExposureCompensation: {
    type: Number,
    min: -3,
    max: 3,
    "default": null
  },
  // Balance blancs et couleur
  whiteBalance: {
    type: String,
    "enum": ['Auto', 'Manual', 'Daylight', 'Shade', 'Tungsten', 'Fluorescent', 'Flash'],
    "default": null
  },
  whiteBalanceMode: {
    type: String,
    "default": null
  },
  colorSpace: {
    type: String,
    "enum": ['sRGB', 'Adobe RGB', 'ProPhoto RGB', 'Wide Gamut RGB'],
    "default": null
  },
  colorMode: {
    type: String,
    "default": null
  },
  // Qualité et compression
  compressionMode: {
    type: String,
    "default": null
  },
  quality: {
    type: String,
    "enum": ['RAW', 'RAW+JPEG', 'Fine', 'Normal', 'Basic'],
    "default": null
  },
  // Traitement d'image
  saturation: {
    type: String,
    "enum": ['Normal', 'Low', 'High'],
    "default": null
  },
  sharpness: {
    type: String,
    "enum": ['Normal', 'Soft', 'Hard'],
    "default": null
  },
  contrast: {
    type: String,
    "enum": ['Normal', 'Soft', 'Hard'],
    "default": null
  },
  // Autres paramètres techniques
  digitalZoom: {
    type: Number,
    min: 1,
    "default": null
  },
  sceneMode: {
    type: String,
    "default": null
  },
  gainControl: {
    type: String,
    "enum": ['None', 'Low gain up', 'High gain up', 'Low gain down', 'High gain down'],
    "default": null
  }
}, {
  _id: false
});

// Schema caméra étendu
var cameraSchema = new mongoose.Schema({
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
    "enum": ['None', 'Optical', 'Electronic', 'Hybrid'],
    "default": 'None'
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
}, {
  _id: false
});

// Schema timestamps étendu
var timestampsSchema = new mongoose.Schema({
  // Timestamps principaux
  dateTimeOriginal: {
    type: Date
    // ❌ SUPPRIMÉ: index: true (car défini plus bas avec schema.index())
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
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    anomalies: [String],
    validated: {
      type: Boolean,
      "default": false
    }
  }
}, {
  _id: false
});

// Schema GPS étendu
var gpsSchema = new mongoose.Schema({
  // Coordonnées
  latitude: {
    type: Number,
    min: -90,
    max: 90,
    validate: {
      validator: function validator(value) {
        return value === null || value >= -90 && value <= 90;
      },
      message: 'Latitude must be between -90 and 90 degrees'
    }
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
    validate: {
      validator: function validator(value) {
        return value === null || value >= -180 && value <= 180;
      },
      message: 'Longitude must be between -180 and 180 degrees'
    }
  },
  altitude: {
    type: Number,
    min: -1000,
    // Mer Morte
    max: 10000 // Everest + marge
  },
  // Références et précision
  latitudeRef: {
    type: String,
    "enum": ['N', 'S']
  },
  longitudeRef: {
    type: String,
    "enum": ['E', 'W']
  },
  altitudeRef: {
    type: String,
    "enum": ['Above Sea Level', 'Below Sea Level']
  },
  // Données GPS détaillées
  timestamp: Date,
  datestamp: String,
  satellites: String,
  status: {
    type: String,
    "enum": ['A', 'V'] // Active/Void
  },
  measureMode: {
    type: String,
    "enum": ['2', '3'] // 2D/3D
  },
  dop: Number,
  // Dilution of Precision

  // Vitesse et direction
  speed: Number,
  speedRef: {
    type: String,
    "enum": ['K', 'M', 'N'] // km/h, mph, knots
  },
  track: Number,
  trackRef: {
    type: String,
    "enum": ['T', 'M'] // True/Magnetic North
  },
  imgDirection: Number,
  imgDirectionRef: {
    type: String,
    "enum": ['T', 'M']
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
    "enum": [0, 1] // 0=no, 1=yes
  },
  hPositioningError: Number,
  // Validation GPS
  validationStatus: {
    coordinatesValid: {
      type: Boolean,
      "default": true
    },
    altitudeRealistic: {
      type: Boolean,
      "default": true
    },
    precisionAcceptable: {
      type: Boolean,
      "default": true
    },
    anomalies: [String]
  }
}, {
  _id: false
});

// Schema logiciels étendu
var softwareSchema = new mongoose.Schema({
  creator: String,
  software: String,
  processingHistory: [String],
  lastEditedWith: String,
  // Détection IA/génération
  aiSignatures: [{
    detected: Boolean,
    generator: {
      type: String,
      "enum": ['Midjourney', 'DALL-E', 'Stable Diffusion', 'Adobe Firefly', 'Leonardo', 'Artbreeder', 'Unknown']
    },
    version: String,
    confidence: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  // Logiciels de retouche détectés
  editingSoftware: [{
    name: String,
    version: String,
    detectionConfidence: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  // Plugins et extensions
  pluginsDetected: [String],
  // Signature suspecte
  suspiciousIndicators: [{
    type: String,
    description: String,
    riskLevel: {
      type: String,
      "enum": ['low', 'medium', 'high']
    }
  }]
}, {
  _id: false
});

// ✅ CORRECTION CRITIQUE - Schema dimensions étendu
var dimensionsSchema = new mongoose.Schema({
  width: {
    type: Number,
    min: 1,
    required: false,
    // ✅ CHANGÉ de true à false
    "default": null
  },
  height: {
    type: Number,
    min: 1,
    required: false,
    // ✅ CHANGÉ de true à false
    "default": null
  },
  resolution: Number,
  resolutionUnit: {
    type: String,
    "enum": ['None', 'inches', 'cm']
  },
  bitDepth: {
    type: Number,
    "enum": [1, 8, 16, 24, 32]
  },
  colorSpace: String,
  pixelsPerUnitX: Number,
  pixelsPerUnitY: Number,
  // Aspect ratio
  aspectRatio: {
    type: Number,
    "default": function _default() {
      return this.width && this.height ? this.width / this.height : null;
    }
  },
  // Megapixels
  megapixels: {
    type: Number,
    "default": function _default() {
      return this.width && this.height ? this.width * this.height / 1000000 : null;
    }
  }
}, {
  _id: false
});

// Schema EXIF complet
var exifSchema = new mongoose.Schema({
  camera: cameraSchema,
  technical: technicalSchema,
  timestamps: timestampsSchema,
  gps: gpsSchema,
  software: softwareSchema,
  dimensions: dimensionsSchema,
  // MakerNote et données propriétaires
  makerNote: {
    present: {
      type: Boolean,
      "default": false
    },
    manufacturer: String,
    size: Number,
    encrypted: {
      type: Boolean,
      "default": false
    },
    parseable: {
      type: Boolean,
      "default": false
    },
    customTags: mongoose.Schema.Types.Mixed
  },
  // Version et conformité EXIF
  exifVersion: String,
  compatibilityIDF: String,
  // Validation globale EXIF
  validationStatus: {
    structureValid: {
      type: Boolean,
      "default": true
    },
    dataConsistent: {
      type: Boolean,
      "default": true
    },
    completenessScore: {
      type: Number,
      min: 0,
      max: 100
    },
    anomaliesCount: {
      type: Number,
      "default": 0
    },
    suspiciousElements: [String]
  }
}, {
  _id: false
});

// =====================================
// SCHEMA ANALYSIS FORENSIQUE COMPLET
// =====================================

var forensicAnalysisSchema = new mongoose.Schema({
  // Score d'authenticité global
  authenticity: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    confidence: {
      type: String,
      "enum": ['low', 'medium', 'high']
    },
    methodology: String,
    lastUpdated: {
      type: Date,
      "default": Date.now
    }
  },
  // Détection manipulation étendue
  manipulationDetection: {
    overall: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    // Types spécifiques
    compression: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    cloning: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    splicing: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    enhancement: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    resampling: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    inpainting: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    // Détection avancée
    copyMove: {
      detected: Boolean,
      confidence: Number,
      regions: [{
        source: {
          x: Number,
          y: Number,
          w: Number,
          h: Number
        },
        target: {
          x: Number,
          y: Number,
          w: Number,
          h: Number
        },
        similarity: Number
      }]
    },
    doubleJpegCompression: {
      detected: Boolean,
      confidence: Number,
      evidence: mongoose.Schema.Types.Mixed
    },
    geometricTransforms: {
      rotation: {
        detected: Boolean,
        angle: Number
      },
      scaling: {
        detected: Boolean,
        factor: Number
      },
      translation: {
        detected: Boolean,
        offset: [Number]
      }
    }
  },
  // Détection IA étendue
  aiDetection: {
    generated: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    deepfake: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    synthetic: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    detectedGenerators: [{
      name: String,
      version: String,
      confidence: Number,
      evidence: mongoose.Schema.Types.Mixed
    }],
    // Signatures spécifiques
    ganArtifacts: {
      detected: Boolean,
      type: String,
      // GAN, VAE, Diffusion
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
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      violations: [{
        type: String,
        location: {
          x: Number,
          y: Number,
          w: Number,
          h: Number
        },
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
      "enum": ['AI_GENERATED_SUSPECTED', 'MANIPULATION_DETECTED', 'METADATA_MISSING', 'METADATA_LIMITED', 'METADATA_INCONSISTENT', 'COMPRESSION_ANOMALY', 'SIGNATURE_MISMATCH', 'SUSPICIOUS_PATTERN', 'PHYSICS_VIOLATION', 'TEMPORAL_ANOMALY', 'GPS_IMPOSSIBLE', 'SOFTWARE_SUSPICIOUS', 'QUALITY_MISMATCH', 'CONTEXT_INAPPROPRIATE']
    },
    severity: {
      type: String,
      "enum": ['info', 'warning', 'critical'],
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
      location: {
        x: Number,
        y: Number,
        w: Number,
        h: Number
      },
      values: mongoose.Schema.Types.Mixed,
      visualEvidence: String // chemin vers image preuve
    },
    timestamp: {
      type: Date,
      "default": Date.now
    }
  }],
  // Métadonnées d'analyse étendues
  analysisMetadata: {
    version: {
      type: String,
      "default": '3.0.0-forensic'
    },
    algorithms: [{
      pillar: String,
      name: String,
      version: String,
      parameters: mongoose.Schema.Types.Mixed
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
      signatureValid: {
        type: Boolean,
        "default": true
      },
      sizeValid: {
        type: Boolean,
        "default": true
      },
      formatSupported: {
        type: Boolean,
        "default": true
      },
      corruptionDetected: {
        type: Boolean,
        "default": false
      },
      integrityChecksum: String
    },
    // Performance
    performanceMetrics: {
      analysisSpeed: Number,
      // images par seconde
      memoryPeak: Number,
      cpuUsage: Number
    }
  }
}, {
  _id: false
});

// =====================================
// SCHEMA IMAGE PRINCIPAL ÉTENDU CORRIGÉ
// =====================================

var imageSchema = new mongoose.Schema({
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
    "enum": ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/raw', 'image/dng', 'image/cr2', 'image/nef', 'image/arw', 'image/orf', 'image/rw2', 'image/pef']
  },
  // ✅ CORRECTION - Hash et identifiants (suppression index: true)
  hash: {
    type: String,
    required: true,
    // ❌ SUPPRIMÉ: unique: true (car défini dans schema.index())
    validate: {
      validator: function validator(value) {
        return /^[a-f0-9]{64}$/i.test(value);
      },
      message: 'Hash must be a valid SHA-256 hexadecimal string'
    }
  },
  hashAlgorithm: {
    type: String,
    "default": 'SHA-256'
  },
  additionalHashes: {
    md5: String,
    sha1: String,
    sha512: String
  },
  // ✅ CORRECTION - SessionId (suppression index: true)
  sessionId: {
    type: String,
    required: true,
    trim: true
    // ❌ SUPPRIMÉ: index: true (car défini plus bas avec schema.index())
  },
  // ✅ CORRECTION - Statut étendu (suppression index: true)
  status: {
    type: String,
    "enum": ['uploaded', 'validated', 'processing', 'analyzed', 'error', 'quarantined'],
    "default": 'uploaded'
    // ❌ SUPPRIMÉ: index: true (car défini plus bas avec schema.index())
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
  // ✅ CORRECTION CRITIQUE - Métadonnées upload étendues
  uploadMetadata: {
    ip: String,
    userAgent: String,
    source: {
      type: String,
      "enum": ['web', 'web-app', 'api', 'batch', 'mobile', 'integration'],
      // ✅ AJOUT 'web-app'
      "default": 'web-app' // ✅ CHANGÉ défaut vers web-app
    },
    uploadedAt: {
      type: Date,
      "default": Date.now
      // ❌ SUPPRIMÉ: index: true (car défini plus bas avec schema.index())
    },
    uploadedBy: String,
    clientInfo: mongoose.Schema.Types.Mixed
  },
  // Étapes traitement étendues
  processingSteps: [{
    step: {
      type: String,
      required: true
    },
    status: {
      type: String,
      "enum": ['queued', 'processing', 'completed', 'error', 'skipped'],
      required: true
    },
    startTime: {
      type: Date,
      required: true,
      "default": Date.now
    },
    endTime: Date,
    processingTime: Number,
    error: String,
    progress: {
      type: Number,
      min: 0,
      max: 100,
      "default": 0
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  // Analyse forensique complète
  forensicAnalysis: forensicAnalysisSchema,
  // Données EXIF complètes
  exifData: exifSchema,
  // ✅ CORRECTION - Score authenticité (suppression index: true)
  authenticityScore: {
    type: Number,
    min: 0,
    max: 100,
    "default": null
    // ❌ SUPPRIMÉ: index: true (car défini plus bas avec schema.index())
  },
  // Classification risque
  riskClassification: {
    level: {
      type: String,
      "enum": ['AUTHENTIC', 'LIKELY_AUTHENTIC', 'UNCERTAIN', 'LIKELY_FAKE', 'FAKE']
      // ❌ SUPPRIMÉ: index: true (car défini plus bas avec schema.index())
    },
    confidence: {
      type: String,
      "enum": ['low', 'medium', 'high']
    },
    lastUpdated: {
      type: Date,
      "default": Date.now
    }
  },
  // Quarantaine et sécurité
  quarantine: {
    status: {
      type: String,
      "enum": ['none', 'suspicious', 'malware', 'policy_violation'],
      "default": 'none'
    },
    reason: String,
    quarantinedAt: Date,
    releaseScheduled: Date
  },
  // Annotations et reviews
  annotations: [{
    type: {
      type: String,
      "enum": ['note', 'flag', 'correction', 'validation']
    },
    content: String,
    annotatedBy: String,
    timestamp: {
      type: Date,
      "default": Date.now
    },
    visibility: {
      type: String,
      "enum": ['private', 'team', 'public'],
      "default": 'team'
    }
  }],
  // Historique et audit
  auditLog: [{
    action: String,
    performedBy: String,
    timestamp: {
      type: Date,
      "default": Date.now
    },
    details: mongoose.Schema.Types.Mixed,
    ipAddress: String
  }],
  // Configuration privacité
  privacy: {
    mode: {
      type: String,
      "enum": ['JUDICIAL', 'COMMERCIAL', 'RESEARCH', 'CUSTOM'],
      "default": 'COMMERCIAL'
    },
    retentionPolicy: String,
    anonymized: {
      type: Boolean,
      "default": false
    },
    gdprCompliant: {
      type: Boolean,
      "default": true
    }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

// =====================================
// INDEX OPTIMISÉS ÉTENDUS - ✅ CORRIGÉS (pas de doublons)
// =====================================

imageSchema.index({
  hash: 1
}, {
  unique: true
});
imageSchema.index({
  sessionId: 1,
  createdAt: -1
});
imageSchema.index({
  status: 1,
  createdAt: -1
});
imageSchema.index({
  authenticityScore: 1
});
imageSchema.index({
  'riskClassification.level': 1
});
imageSchema.index({
  'forensicAnalysis.flags.severity': 1
});
imageSchema.index({
  'forensicAnalysis.flags.type': 1
});
imageSchema.index({
  'uploadMetadata.source': 1
});
imageSchema.index({
  'quarantine.status': 1
});
imageSchema.index({
  'exifData.camera.make': 1
});
imageSchema.index({
  'exifData.software.creator': 1
});
imageSchema.index({
  'exifData.timestamps.dateTimeOriginal': 1
});

// =====================================
// MÉTHODES ÉTENDUES
// =====================================

// Méthodes existantes améliorées
imageSchema.methods.updateStatus = function (newStatus) {
  var processingStep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
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
    action: "Status changed to ".concat(newStatus),
    performedBy: 'system',
    details: {
      previousStatus: this.status,
      newStatus: newStatus,
      processingStep: processingStep
    }
  });
  return this.save();
};
imageSchema.methods.addFlag = function (flagData) {
  var _flagData$detectedBy;
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
    performedBy: ((_flagData$detectedBy = flagData.detectedBy) === null || _flagData$detectedBy === void 0 ? void 0 : _flagData$detectedBy.pillar) || 'system',
    details: flagData
  });
  return this.save();
};

// Nouvelles méthodes étendues
imageSchema.methods.calculateComprehensiveRisk = function () {
  var _this$forensicAnalysi, _this$forensicAnalysi2, _this$forensicAnalysi3;
  var riskScore = 0;
  var factors = [];

  // Score authenticité
  if (this.authenticityScore !== null) {
    riskScore = 100 - this.authenticityScore;
    factors.push({
      factor: 'authenticity',
      impact: riskScore
    });
  }

  // Flags critiques
  var criticalFlags = ((_this$forensicAnalysi = this.forensicAnalysis) === null || _this$forensicAnalysi === void 0 || (_this$forensicAnalysi = _this$forensicAnalysi.flags) === null || _this$forensicAnalysi === void 0 ? void 0 : _this$forensicAnalysi.filter(function (f) {
    return f.severity === 'critical';
  })) || [];
  if (criticalFlags.length > 0) {
    var flagImpact = criticalFlags.length * 25;
    riskScore = Math.max(riskScore, flagImpact);
    factors.push({
      factor: 'critical_flags',
      count: criticalFlags.length,
      impact: flagImpact
    });
  }

  // Détection IA
  if (((_this$forensicAnalysi2 = this.forensicAnalysis) === null || _this$forensicAnalysi2 === void 0 || (_this$forensicAnalysi2 = _this$forensicAnalysi2.aiDetection) === null || _this$forensicAnalysi2 === void 0 ? void 0 : _this$forensicAnalysi2.generated) > 70) {
    var aiImpact = this.forensicAnalysis.aiDetection.generated * 0.8;
    riskScore = Math.max(riskScore, aiImpact);
    factors.push({
      factor: 'ai_detection',
      score: this.forensicAnalysis.aiDetection.generated,
      impact: aiImpact
    });
  }

  // Manipulation détectée
  if (((_this$forensicAnalysi3 = this.forensicAnalysis) === null || _this$forensicAnalysi3 === void 0 || (_this$forensicAnalysi3 = _this$forensicAnalysi3.manipulationDetection) === null || _this$forensicAnalysi3 === void 0 ? void 0 : _this$forensicAnalysi3.overall) > 50) {
    var manipImpact = this.forensicAnalysis.manipulationDetection.overall * 0.7;
    riskScore = Math.max(riskScore, manipImpact);
    factors.push({
      factor: 'manipulation',
      score: this.forensicAnalysis.manipulationDetection.overall,
      impact: manipImpact
    });
  }

  // Métadonnées suspectes
  if (!this.exifData || Object.keys(this.exifData).length === 0) {
    riskScore = Math.max(riskScore, 60);
    factors.push({
      factor: 'missing_metadata',
      impact: 60
    });
  }

  // Déterminer niveau
  var level = 'AUTHENTIC';
  if (riskScore >= 80) level = 'FAKE';else if (riskScore >= 60) level = 'LIKELY_FAKE';else if (riskScore >= 40) level = 'UNCERTAIN';else if (riskScore >= 20) level = 'LIKELY_AUTHENTIC';

  // Confiance basée sur nombre de facteurs analysés
  var confidence = 'low';
  if (factors.length >= 3) confidence = 'high';else if (factors.length >= 2) confidence = 'medium';
  return {
    score: Math.min(Math.round(riskScore), 100),
    level: level,
    confidence: confidence,
    factors: factors,
    calculatedAt: new Date()
  };
};
imageSchema.methods.generateForensicSummary = function () {
  var _this$forensicAnalysi4, _this$forensicAnalysi5, _this$forensicAnalysi6, _this$exifData, _this$exifData2, _this$exifData3, _this$exifData4, _this$forensicAnalysi7, _this$forensicAnalysi8;
  var risk = this.calculateComprehensiveRisk();
  var flags = ((_this$forensicAnalysi4 = this.forensicAnalysis) === null || _this$forensicAnalysi4 === void 0 ? void 0 : _this$forensicAnalysi4.flags) || [];
  return {
    // Identification
    id: this._id.toString(),
    filename: this.originalName,
    hash: this.hash,
    // Évaluation risque
    riskAssessment: risk,
    // Flags par sévérité
    flagsSummary: {
      critical: flags.filter(function (f) {
        return f.severity === 'critical';
      }).length,
      warning: flags.filter(function (f) {
        return f.severity === 'warning';
      }).length,
      info: flags.filter(function (f) {
        return f.severity === 'info';
      }).length,
      total: flags.length
    },
    // Scores principaux
    scores: {
      authenticity: this.authenticityScore,
      aiGeneration: ((_this$forensicAnalysi5 = this.forensicAnalysis) === null || _this$forensicAnalysi5 === void 0 || (_this$forensicAnalysi5 = _this$forensicAnalysi5.aiDetection) === null || _this$forensicAnalysi5 === void 0 ? void 0 : _this$forensicAnalysi5.generated) || 0,
      manipulation: ((_this$forensicAnalysi6 = this.forensicAnalysis) === null || _this$forensicAnalysi6 === void 0 || (_this$forensicAnalysi6 = _this$forensicAnalysi6.manipulationDetection) === null || _this$forensicAnalysi6 === void 0 ? void 0 : _this$forensicAnalysi6.overall) || 0
    },
    // Métadonnées key
    metadata: {
      hasExif: !!(this.exifData && Object.keys(this.exifData).length > 0),
      camera: (_this$exifData = this.exifData) !== null && _this$exifData !== void 0 && _this$exifData.camera ? "".concat(this.exifData.camera.make, " ").concat(this.exifData.camera.model) : null,
      software: ((_this$exifData2 = this.exifData) === null || _this$exifData2 === void 0 || (_this$exifData2 = _this$exifData2.software) === null || _this$exifData2 === void 0 ? void 0 : _this$exifData2.creator) || null,
      gpsPresent: !!((_this$exifData3 = this.exifData) !== null && _this$exifData3 !== void 0 && (_this$exifData3 = _this$exifData3.gps) !== null && _this$exifData3 !== void 0 && _this$exifData3.latitude && (_this$exifData4 = this.exifData) !== null && _this$exifData4 !== void 0 && (_this$exifData4 = _this$exifData4.gps) !== null && _this$exifData4 !== void 0 && _this$exifData4.longitude)
    },
    // Status et timing
    status: this.status,
    analyzedAt: (_this$forensicAnalysi7 = this.forensicAnalysis) === null || _this$forensicAnalysi7 === void 0 || (_this$forensicAnalysi7 = _this$forensicAnalysi7.analysisMetadata) === null || _this$forensicAnalysi7 === void 0 ? void 0 : _this$forensicAnalysi7.completedAt,
    processingTime: (_this$forensicAnalysi8 = this.forensicAnalysis) === null || _this$forensicAnalysi8 === void 0 || (_this$forensicAnalysi8 = _this$forensicAnalysi8.analysisMetadata) === null || _this$forensicAnalysi8 === void 0 ? void 0 : _this$forensicAnalysi8.processingTime
  };
};
imageSchema.methods.addAnnotation = function (annotation, user) {
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
imageSchema.methods.quarantineImage = function (reason, scheduledRelease) {
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
    details: {
      reason: reason,
      scheduledRelease: scheduledRelease
    }
  });
  return this.save();
};

// =====================================
// MÉTHODES STATIQUES ÉTENDUES
// =====================================

imageSchema.statics.findByRiskLevel = function (level) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
  return this.find({
    'riskClassification.level': level
  }).sort({
    createdAt: -1
  }).limit(limit);
};
imageSchema.statics.findWithCriticalFlags = function () {
  return this.find({
    'forensicAnalysis.flags.severity': 'critical'
  }).sort({
    createdAt: -1
  });
};
imageSchema.statics.findByCamera = function (make, model) {
  var query = {};
  if (make) query['exifData.camera.make'] = new RegExp(make, 'i');
  if (model) query['exifData.camera.model'] = new RegExp(model, 'i');
  return this.find(query).sort({
    createdAt: -1
  });
};
imageSchema.statics.findBySoftware = function (software) {
  return this.find({
    $or: [{
      'exifData.software.creator': new RegExp(software, 'i')
    }, {
      'exifData.software.software': new RegExp(software, 'i')
    }]
  }).sort({
    createdAt: -1
  });
};
imageSchema.statics.getForensicStats = function () {
  var days = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
  var startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.aggregate([{
    $match: {
      createdAt: {
        $gte: startDate
      }
    }
  }, {
    $group: {
      _id: null,
      totalImages: {
        $sum: 1
      },
      averageAuthenticityScore: {
        $avg: '$authenticityScore'
      },
      riskDistribution: {
        $push: '$riskClassification.level'
      },
      flagsDistribution: {
        $push: {
          $size: {
            $ifNull: ['$forensicAnalysis.flags', []]
          }
        }
      },
      processingTimes: {
        $push: '$forensicAnalysis.analysisMetadata.processingTime'
      }
    }
  }]);
};

// =====================================
// MIDDLEWARE ÉTENDU
// =====================================

imageSchema.pre('save', function (next) {
  var _this$forensicAnalysi9;
  // Validation cohérence authenticityScore
  if ((_this$forensicAnalysi9 = this.forensicAnalysis) !== null && _this$forensicAnalysi9 !== void 0 && (_this$forensicAnalysi9 = _this$forensicAnalysi9.authenticity) !== null && _this$forensicAnalysi9 !== void 0 && _this$forensicAnalysi9.score) {
    this.authenticityScore = this.forensicAnalysis.authenticity.score;
  }

  // Mise à jour classification risque
  if (this.authenticityScore !== null) {
    var riskAssessment = this.calculateComprehensiveRisk();
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
  var allowedTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/raw', 'image/dng', 'image/cr2', 'image/nef', 'image/arw', 'image/orf', 'image/rw2', 'image/pef'];
  if (!allowedTypes.includes(this.mimeType)) {
    return next(new Error("Type MIME non support\xE9: ".concat(this.mimeType)));
  }
  next();
});
imageSchema.post('save', function (doc) {
  var _doc$riskClassificati;
  console.log("\uD83D\uDCBE Image sauvegard\xE9e: ".concat(doc._id, " - Status: ").concat(doc.status, " - Risk: ").concat((_doc$riskClassificati = doc.riskClassification) === null || _doc$riskClassificati === void 0 ? void 0 : _doc$riskClassificati.level));
});

// =====================================
// VIRTUALS ÉTENDUS
// =====================================

imageSchema.virtual('analysisProgress').get(function () {
  switch (this.status) {
    case 'analyzed':
      return 100;
    case 'processing':
      var lastStep = this.processingSteps[this.processingSteps.length - 1];
      return lastStep ? lastStep.progress : 50;
    case 'error':
      return 0;
    case 'quarantined':
      return -1;
    default:
      return 10;
  }
});
imageSchema.virtual('fileExists').get(function () {
  var fs = require('fs');
  return this.files.original ? fs.existsSync(this.files.original) : false;
});
imageSchema.virtual('flagsCount').get(function () {
  var _this$forensicAnalysi0;
  return ((_this$forensicAnalysi0 = this.forensicAnalysis) === null || _this$forensicAnalysi0 === void 0 || (_this$forensicAnalysi0 = _this$forensicAnalysi0.flags) === null || _this$forensicAnalysi0 === void 0 ? void 0 : _this$forensicAnalysi0.length) || 0;
});
imageSchema.virtual('criticalFlagsCount').get(function () {
  var _this$forensicAnalysi1;
  return ((_this$forensicAnalysi1 = this.forensicAnalysis) === null || _this$forensicAnalysi1 === void 0 || (_this$forensicAnalysi1 = _this$forensicAnalysi1.flags) === null || _this$forensicAnalysi1 === void 0 ? void 0 : _this$forensicAnalysi1.filter(function (f) {
    return f.severity === 'critical';
  }).length) || 0;
});
imageSchema.virtual('hasAiDetection').get(function () {
  var _this$forensicAnalysi10;
  return ((_this$forensicAnalysi10 = this.forensicAnalysis) === null || _this$forensicAnalysi10 === void 0 || (_this$forensicAnalysi10 = _this$forensicAnalysi10.aiDetection) === null || _this$forensicAnalysi10 === void 0 ? void 0 : _this$forensicAnalysi10.generated) > 30;
});
imageSchema.virtual('hasManipulationDetection').get(function () {
  var _this$forensicAnalysi11;
  return ((_this$forensicAnalysi11 = this.forensicAnalysis) === null || _this$forensicAnalysi11 === void 0 || (_this$forensicAnalysi11 = _this$forensicAnalysi11.manipulationDetection) === null || _this$forensicAnalysi11 === void 0 ? void 0 : _this$forensicAnalysi11.overall) > 20;
});
imageSchema.virtual('ageInHours').get(function () {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

// =====================================
// TRANSFORMATION JSON ÉTENDUE
// =====================================

imageSchema.set('toJSON', {
  transform: function transform(doc, ret) {
    var _doc$riskClassificati2, _doc$privacy;
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Ajouter propriétés calculées
    ret.riskLevel = ((_doc$riskClassificati2 = doc.riskClassification) === null || _doc$riskClassificati2 === void 0 ? void 0 : _doc$riskClassificati2.level) || 'UNKNOWN';
    ret.analysisProgress = doc.analysisProgress;
    ret.flagsCount = doc.flagsCount;
    ret.criticalFlagsCount = doc.criticalFlagsCount;
    ret.hasAiDetection = doc.hasAiDetection;
    ret.hasManipulationDetection = doc.hasManipulationDetection;
    ret.ageInHours = doc.ageInHours;

    // Masquer données sensibles selon mode privacy
    if ((_doc$privacy = doc.privacy) !== null && _doc$privacy !== void 0 && _doc$privacy.anonymized) {
      var _ret$uploadMetadata;
      (_ret$uploadMetadata = ret.uploadMetadata) === null || _ret$uploadMetadata === void 0 || delete _ret$uploadMetadata.ip;
      delete ret.auditLog;
      delete ret.annotations;
    }
    return ret;
  }
});
module.exports = mongoose.model('Image', imageSchema);