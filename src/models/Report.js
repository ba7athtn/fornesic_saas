const mongoose = require('mongoose');
const crypto = require('crypto');

// =====================================
// SCHEMAS DÉTAILLÉS POUR RAPPORTS FORENSIQUES
// =====================================

// Schema statistiques forensiques complètes
const forensicStatsSchema = new mongoose.Schema({
  // Statistiques de base
  totalImages: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Total images must be an integer'
    }
  },

  analyzedImages: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(value) {
        return value <= this.totalImages;
      },
      message: 'Analyzed images cannot exceed total images'
    }
  },

  failedAnalyses: {
    type: Number,
    default: 0,
    min: 0
  },

  // Distribution des risques (corrigée selon notre méthodologie)
  riskDistribution: {
    authentic: { type: Number, default: 0, min: 0 },
    likelyAuthentic: { type: Number, default: 0, min: 0 },
    uncertain: { type: Number, default: 0, min: 0 },
    likelyFake: { type: Number, default: 0, min: 0 },
    fake: { type: Number, default: 0, min: 0 }
  },

  // Scores détaillés
  authenticityScores: {
    average: { type: Number, min: 0, max: 100 },
    median: { type: Number, min: 0, max: 100 },
    standardDeviation: { type: Number, min: 0 },
    min: { type: Number, min: 0, max: 100 },
    max: { type: Number, min: 0, max: 100 }
  },

  // Analyse des 7 piliers
  pillarAnalysis: {
    anatomical: {
      analyzed: { type: Number, default: 0 },
      averageScore: { type: Number, min: 0, max: 100 },
      flagged: { type: Number, default: 0 }
    },
    physics: {
      analyzed: { type: Number, default: 0 },
      averageScore: { type: Number, min: 0, max: 100 },
      flagged: { type: Number, default: 0 }
    },
    statistical: {
      analyzed: { type: Number, default: 0 },
      averageScore: { type: Number, min: 0, max: 100 },
      flagged: { type: Number, default: 0 }
    },
    exif: {
      analyzed: { type: Number, default: 0 },
      averageScore: { type: Number, min: 0, max: 100 },
      flagged: { type: Number, default: 0 }
    },
    behavioral: {
      analyzed: { type: Number, default: 0 },
      averageScore: { type: Number, min: 0, max: 100 },
      flagged: { type: Number, default: 0 }
    },
    audio: {
      analyzed: { type: Number, default: 0 },
      averageScore: { type: Number, min: 0, max: 100 },
      flagged: { type: Number, default: 0 }
    },
    expert: {
      analyzed: { type: Number, default: 0 },
      averageScore: { type: Number, min: 0, max: 100 },
      flagged: { type: Number, default: 0 }
    }
  },

  // Flags et alertes détaillées
  flagsAnalysis: {
    total: { type: Number, default: 0, min: 0 },
    bySeverity: {
      critical: { type: Number, default: 0, min: 0 },
      warning: { type: Number, default: 0, min: 0 },
      info: { type: Number, default: 0, min: 0 }
    },
    byType: [{
      type: String,
      count: { type: Number, min: 0 },
      percentage: { type: Number, min: 0, max: 100 }
    }]
  },

  // Détections spécialisées
  detectionStats: {
    aiGenerated: {
      count: { type: Number, default: 0, min: 0 },
      averageConfidence: { type: Number, min: 0, max: 100 },
      generators: [{
        name: String,
        count: Number,
        averageConfidence: Number
      }]
    },
    manipulationDetected: {
      count: { type: Number, default: 0, min: 0 },
      types: [{
        type: String,
        count: Number,
        averageScore: Number
      }]
    },
    metadataAnalysis: {
      complete: { type: Number, default: 0 },
      partial: { type: Number, default: 0 },
      missing: { type: Number, default: 0 },
      suspicious: { type: Number, default: 0 }
    }
  },

  // Analyse technique
  technicalMetrics: {
    averageFileSize: Number,
    totalProcessingTime: { type: Number, min: 0 },
    averageProcessingTimePerImage: { type: Number, min: 0 },
    formatDistribution: [{
      format: String,
      count: { type: Number, min: 0 },
      percentage: { type: Number, min: 0, max: 100 }
    }],
    cameraDistribution: [{
      make: String,
      model: String,
      count: { type: Number, min: 0 },
      suspiciousCount: { type: Number, default: 0 }
    }],
    softwareDistribution: [{
      name: String,
      version: String,
      count: { type: Number, min: 0 },
      suspiciousCount: { type: Number, default: 0 }
    }]
  }
}, { _id: false });

// Schema configuration rapport étendue et sécurisée
const reportConfigSchema = new mongoose.Schema({
  // Template et présentation
  template: {
    type: String,
    enum: ['executive', 'technical', 'legal', 'summary', 'detailed', 'comparison', 'audit'],
    default: 'executive',
    required: true
  },

  // Langue et localisation
  language: {
    type: String,
    enum: ['fr', 'en', 'es', 'de', 'it', 'ar'],
    default: 'fr'
  },

  locale: {
    type: String,
    default: 'fr-FR',
    validate: {
      validator: function(value) {
        return /^[a-z]{2}-[A-Z]{2}$/.test(value);
      },
      message: 'Locale must be in format xx-XX'
    }
  },

  // Sections incluses
  sections: {
    executiveSummary: { type: Boolean, default: true },
    methodology: { type: Boolean, default: false },
    detailedAnalysis: { type: Boolean, default: true },
    pillarAnalysis: { type: Boolean, default: true },
    technicalDetails: { type: Boolean, default: false },
    recommendations: { type: Boolean, default: true },
    chainOfCustody: { type: Boolean, default: false },
    appendices: { type: Boolean, default: false },
    glossary: { type: Boolean, default: false }
  },

  // Données incluses avec contrôle granulaire
  includeOptions: {
    rawData: { type: Boolean, default: false },
    thumbnails: { type: Boolean, default: true },
    fullImages: { type: Boolean, default: false },
    exifData: { type: Boolean, default: true },
    statisticalCharts: { type: Boolean, default: true },
    flagsDetails: { type: Boolean, default: true },
    pillarBreakdown: { type: Boolean, default: true },
    comparisonCharts: { type: Boolean, default: false },
    heatmaps: { type: Boolean, default: false },
    timelineAnalysis: { type: Boolean, default: false }
  },

  // Filtres avancés
  filters: {
    riskLevelMinimum: {
      type: String,
      enum: ['AUTHENTIC', 'LIKELY_AUTHENTIC', 'UNCERTAIN', 'LIKELY_FAKE', 'FAKE']
    },
    includeOnlyFlagged: { type: Boolean, default: false },
    minimumConfidence: { type: Number, min: 0, max: 100 },
    dateRange: {
      start: Date,
      end: Date
    },
    specificPillars: [{
      type: String,
      enum: ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert']
    }],
    excludeTypes: [String]
  },

  // Branding et customisation
  branding: {
    organizationName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    logo: String,
    colors: {
      primary: { type: String, default: '#1e40af', match: /^#[0-9a-f]{6}$/i },
      secondary: { type: String, default: '#06b6d4', match: /^#[0-9a-f]{6}$/i },
      success: { type: String, default: '#059669', match: /^#[0-9a-f]{6}$/i },
      warning: { type: String, default: '#d97706', match: /^#[0-9a-f]{6}$/i },
      danger: { type: String, default: '#dc2626', match: /^#[0-9a-f]{6}$/i }
    },
    watermark: { type: Boolean, default: false },
    footer: {
      type: String,
      maxlength: 200
    }
  }
}, { _id: false });

// Schema recommandations forensiques
const forensicRecommendationsSchema = new mongoose.Schema({
  overallRecommendation: {
    type: String,
    enum: [
      'ACCEPT_ALL',
      'ACCEPT_WITH_CAUTION',
      'FURTHER_INVESTIGATION_REQUIRED',
      'EXPERT_REVIEW_MANDATORY',
      'REJECT_SUSPICIOUS',
      'REJECT_ALL',
      'MIXED_RESULTS'
    ],
    required: true
  },

  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },

  confidenceLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },

  specificRecommendations: [{
    category: {
      type: String,
      enum: [
        'technical_verification',
        'expert_consultation',
        'source_verification',
        'legal_review',
        'chain_of_custody',
        'additional_testing',
        'quality_assurance',
        'training_required'
      ],
      required: true
    },
    recommendation: {
      type: String,
      required: true,
      maxlength: 500
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    estimatedTimeframe: String,
    requiredResources: [String],
    estimatedCost: String,
    riskIfIgnored: {
      type: String,
      enum: ['minimal', 'low', 'medium', 'high', 'critical']
    }
  }],

  riskMitigation: [{
    riskType: String,
    currentRiskLevel: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
    mitigationStrategy: String,
    expectedEffectiveness: { type: String, enum: ['low', 'medium', 'high'] },
    implementationComplexity: { type: String, enum: ['simple', 'moderate', 'complex'] }
  }],

  nextSteps: [{
    step: {
      type: String,
      required: true,
      maxlength: 200
    },
    responsible: String,
    deadline: Date,
    dependencies: [String],
    completed: { type: Boolean, default: false },
    completedAt: Date,
    notes: String
  }],

  legalConsiderations: [{
    consideration: String,
    jurisdiction: String,
    severity: { type: String, enum: ['info', 'warning', 'critical'] },
    recommendation: String
  }]
}, { _id: false });

// Schema chaîne de custody forensique
const chainOfCustodySchema = new mongoose.Schema({
  entries: [{
    timestamp: {
      type: Date,
      required: true,
      default: Date.now
    },
    action: {
      type: String,
      required: true,
      enum: [
        'RECEIVED',
        'ANALYZED',
        'TRANSFERRED',
        'STORED',
        'ACCESSED',
        'MODIFIED',
        'VERIFIED',
        'ARCHIVED',
        'DESTROYED',
        'REPORT_GENERATION_INITIATED'
      ]
    },
    performedBy: {
      type: String,
      required: true,
      trim: true
    },
    witness: String,
    location: String,
    method: String,
    hash: {
      type: String,
      required: false,
      validate: {
        validator: function(value) {
          return !value || value === '' || /^[a-f0-9]{64}$/i.test(value);
        },
        message: 'Hash must be empty or valid SHA-256 string'
      }
    },
    notes: {
      type: String,
      maxlength: 500
    },
    evidence: mongoose.Schema.Types.Mixed
  }],

  integrityVerification: {
    lastVerified: Date,
    verificationMethod: String,
    verifiedBy: String,
    status: {
      type: String,
      enum: ['intact', 'compromised', 'unknown'],
      default: 'intact'
    }
  }
}, { _id: false });

// =====================================
// SCHEMA RAPPORT PRINCIPAL COMPLET CORRIGÉ
// =====================================

const ReportSchema = new mongoose.Schema({
  // Identification unique et traçabilité
  sessionId: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(value) {
        return /^[a-zA-Z0-9_-]{8,50}$/.test(value);
      },
      message: 'SessionId must be alphanumeric, 8-50 characters'
    }
  },

  reportId: {
    type: String,
    required: true,
    default: function() {
      return `RPT-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    }
  },

  // Type et catégorie étendus
  reportType: {
    type: String,
    enum: ['single', 'batch', 'session', 'comparison', 'timeline', 'forensic_audit', 'legal_brief'],
    default: 'single',
    required: true
  },

  category: {
    type: String,
    enum: ['routine', 'investigation', 'legal', 'audit', 'research', 'quality_control'],
    default: 'routine'
  },

  classification: {
    type: String,
    enum: ['public', 'internal', 'confidential', 'restricted', 'top_secret'],
    default: 'internal'
  },

  // Formats de génération multiples
  formats: [{
    type: {
      type: String,
      enum: ['pdf', 'json', 'html', 'csv', 'docx', 'xml', 'excel'],
      required: true
    },
    generated: { type: Boolean, default: false },
    filepath: String,
    fileSize: { type: Number, min: 0 },
    checksum: {
      type: String,
      validate: {
        validator: function(value) {
          return !value || /^[a-f0-9]{64}$/i.test(value);
        },
        message: 'Checksum must be SHA-256 format'
      }
    },
    generatedAt: Date
  }],

  // Images analysées avec validation simplifiée
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  }],

  primaryImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },

  // Métadonnées temporelles complètes
  generatedAt: {
    type: Date,
    default: Date.now
  },

  reportPeriod: {
    startDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return !this.reportPeriod?.endDate || value <= this.reportPeriod.endDate;
        },
        message: 'Start date must be before end date'
      }
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return !this.reportPeriod?.startDate || value >= this.reportPeriod.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    description: {
      type: String,
      maxlength: 200
    }
  },

  // Configuration du rapport
  configuration: reportConfigSchema,

  // Statistiques forensiques complètes
  statistics: forensicStatsSchema,

  // Statut de génération avec progression
  status: {
    type: String,
    enum: ['queued', 'initializing', 'analyzing', 'generating', 'finalizing', 'completed', 'failed', 'cancelled', 'expired'],
    default: 'queued'
  },

  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Progress must be an integer'
    }
  },

  // Informations de génération étendues
  generation: {
    requestedBy: {
      ip: {
        type: String,
        validate: {
          validator: function(value) {
            // Accepter IPv4, IPv6 et IPv6 mappé
            return !value || 
              /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value) || // IPv4
              /^[a-f0-9:]+$/i.test(value) || // IPv6
              /^::ffff:[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(value); // IPv6 mappé
          },
          message: 'Invalid IP address format'
        }
      },
      userAgent: {
        type: String,
        maxlength: 500
      },
      userId: String,
      sessionId: String,
      timestamp: { type: Date, default: Date.now }
    },
    processingTime: { type: Number, min: 0 },
    systemInfo: {
      nodeVersion: String,
      platform: String,
      architecture: String,
      memory: { type: Number, min: 0 },
      cpuCores: { type: Number, min: 1 },
      loadAverage: [Number]
    },
    versions: {
      reportGenerator: { type: String, default: '3.0.0-forensic' },
      analysisEngine: String,
      templateVersion: String,
      dependencies: mongoose.Schema.Types.Mixed
    },
    performance: {
      memoryPeak: { type: Number, min: 0 },
      cpuUsage: { type: Number, min: 0, max: 100 },
      diskUsage: { type: Number, min: 0 },
      networkCalls: { type: Number, min: 0 }
    }
  },

  // Résumé exécutif forensique
  executiveSummary: {
    overallRisk: {
      type: String,
      enum: ['minimal', 'low', 'medium', 'high', 'critical']
    },
    confidence: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    keyFindings: [{
      type: String,
      maxlength: 300
    }],
    criticalIssues: [{
      issue: {
        type: String,
        required: true,
        maxlength: 200
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
      },
      affectedImages: {
        type: Number,
        min: 0,
        required: true
      },
      recommendation: {
        type: String,
        maxlength: 300
      },
      urgency: {
        type: String,
        enum: ['low', 'medium', 'high', 'immediate']
      }
    }],
    alertsDistribution: {
      info: { type: Number, default: 0, min: 0 },
      warning: { type: Number, default: 0, min: 0 },
      critical: { type: Number, default: 0, min: 0 }
    },
    complianceStatus: {
      forensicStandards: { type: Boolean, default: false },
      legalRequirements: { type: Boolean, default: false },
      qualityAssurance: { type: Boolean, default: false }
    }
  },

  // Recommandations forensiques
  recommendations: forensicRecommendationsSchema,

  // Chaîne de custody
  chainOfCustody: chainOfCustodySchema,

  // Issues et erreurs avec résolution
  issues: [{
    id: {
      type: String,
      default: function() {
        return crypto.randomBytes(4).toString('hex');
      }
    },
    level: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      required: true
    },
    category: {
      type: String,
      enum: ['generation', 'analysis', 'data', 'system', 'validation'],
      default: 'generation'
    },
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    source: String,
    timestamp: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
    resolution: {
      type: String,
      maxlength: 300
    },
    resolvedAt: Date,
    resolvedBy: String
  }],

  // Gestion d'accès sécurisée
  access: {
    downloadCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
    shareCount: { type: Number, default: 0, min: 0 },
    lastAccessed: Date,
    accessLog: [{
      timestamp: { type: Date, default: Date.now },
      action: {
        type: String,
        enum: ['view', 'download', 'share', 'modify', 'delete'],
        required: true
      },
      ip: String,
      userAgent: String,
      userId: String,
      success: { type: Boolean, default: true },
      failureReason: String
    }],
    permissions: {
      public: { type: Boolean, default: false },
      requiresAuth: { type: Boolean, default: true },
      allowedUsers: [{
        userId: String,
        permissions: [String],
        grantedBy: String,
        grantedAt: { type: Date, default: Date.now }
      }],
      allowedRoles: [String],
      restrictions: {
        ipWhitelist: [String],
        timeRestrictions: {
          startTime: String, // HH:MM
          endTime: String, // HH:MM
          timezone: String
        }
      }
    },

    // TTL amélioré avec gestion par catégorie
    expiresAt: {
      type: Date,
      default: function() {
        const baseDate = Date.now();
        let days = 30; // défaut

        switch(this.category) {
          case 'legal':
            days = 2555; // 7 ans
            break;
          case 'investigation':
            days = 1095; // 3 ans
            break;
          case 'audit':
            days = 365; // 1 an
            break;
          case 'research':
            days = 180; // 6 mois
            break;
          default:
            days = 30;
        }

        return new Date(baseDate + days * 24 * 60 * 60 * 1000);
      }
    }
  },

  // Intégrité et signature numérique
  integrity: {
    signature: String,
    checksum: {
      type: String,
      validate: {
        validator: function(value) {
          return !value || /^[a-f0-9]{64}$/i.test(value);
        },
        message: 'Checksum must be SHA-256 format'
      }
    },
    algorithm: { type: String, default: 'SHA-256' },
    signedBy: String,
    signedAt: Date,
    verified: { type: Boolean, default: false },
    verificationLog: [{
      timestamp: { type: Date, default: Date.now },
      verified: Boolean,
      verifiedBy: String,
      method: String,
      notes: String
    }]
  },

  // Configuration privacité héritée
  privacy: {
    mode: {
      type: String,
      enum: ['JUDICIAL', 'COMMERCIAL', 'RESEARCH', 'CUSTOM'],
      default: 'COMMERCIAL'
    },
    anonymized: { type: Boolean, default: false },
    dataRetentionPolicy: String,
    gdprCompliant: { type: Boolean, default: true },
    sensitiveDataRemoved: { type: Boolean, default: false },
    redactionLevel: {
      type: String,
      enum: ['none', 'partial', 'substantial', 'complete'],
      default: 'none'
    }
  },

  // Métadonnées personnalisées avec validation
  customMetadata: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: function(value) {
        return !value || (typeof value === 'object' && Object.keys(value).length <= 20);
      },
      message: 'Custom metadata cannot exceed 20 properties'
    }
  },

  // Versioning et historique
  version: { type: Number, default: 1, min: 1 },
  previousVersions: [{
    version: { type: Number, required: true },
    generatedAt: { type: Date, required: true },
    changes: String,
    archivedPath: String,
    archivedBy: String,
    retentionDate: Date
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  collection: 'reports'
});

// =====================================
// INDEX OPTIMISÉS ET SÉCURISÉS
// =====================================

// Index principaux
ReportSchema.index({ sessionId: 1, createdAt: -1 });
ReportSchema.index({ reportId: 1 }, { unique: true });
ReportSchema.index({ status: 1, generatedAt: -1 });
ReportSchema.index({ reportType: 1, category: 1 });

// Index pour recherche et filtrage
ReportSchema.index({ 'executiveSummary.overallRisk': 1 });
ReportSchema.index({ 'recommendations.urgencyLevel': 1 });
ReportSchema.index({ classification: 1 });
ReportSchema.index({ 'generation.requestedBy.userId': 1 });

// Index TTL sécurisé
ReportSchema.index({ 'access.expiresAt': 1 }, {
  expireAfterSeconds: 0,
  partialFilterExpression: {
    category: { $nin: ['legal', 'audit'] }
  }
});

// Index performance
ReportSchema.index({ 'access.lastAccessed': -1 });
ReportSchema.index({ 'privacy.mode': 1 });
ReportSchema.index({ version: -1 });

// =====================================
// VIRTUALS ÉTENDUS ET SÉCURISÉS
// =====================================

ReportSchema.virtual('isExpired').get(function() {
  if (this.category === 'legal' || this.category === 'audit') {
    return false; // Jamais expirer pour légal/audit
  }
  return this.access.expiresAt < new Date();
});

ReportSchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

ReportSchema.virtual('totalFileSize').get(function() {
  return this.formats.reduce((total, format) => {
    return total + (format.fileSize || 0);
  }, 0);
});

ReportSchema.virtual('generationTimeMinutes').get(function() {
  return this.generation?.processingTime ?
    Math.round(this.generation.processingTime / (1000 * 60)) : null;
});

ReportSchema.virtual('criticalIssuesCount').get(function() {
  return this.issues.filter(issue =>
    issue.level === 'critical' && !issue.resolved
  ).length;
});

ReportSchema.virtual('isLegalCompliant').get(function() {
  return this.chainOfCustody?.entries?.length > 0 &&
    this.integrity?.verified &&
    this.executiveSummary?.complianceStatus?.forensicStandards;
});

ReportSchema.virtual('accessibilityLevel').get(function() {
  if (this.access.permissions.public) return 'public';
  if (!this.access.permissions.requiresAuth) return 'open';
  if (this.access.permissions.allowedUsers.length > 0) return 'restricted';
  return 'private';
});

ReportSchema.virtual('completionPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'failed' || this.status === 'cancelled') return 0;
  return this.progress || 0;
});

// =====================================
// MÉTHODES D'INSTANCE ROBUSTES
// =====================================

// Gestion d'erreurs améliorée
ReportSchema.methods.addIssue = function(level, message, source, category = 'generation') {
  try {
    this.issues.push({
      level: level,
      category: category,
      message: message,
      source: source,
      timestamp: new Date()
    });

    // Log critique
    if (level === 'critical') {
      console.error(`🚨 Critical issue in report ${this.reportId}: ${message}`);
    }

    return this.save();
  } catch (error) {
    console.error(`Error adding issue to report ${this.reportId}:`, error);
    throw error;
  }
};

ReportSchema.methods.markCompleted = function(processingTime = 0) {
  try {
    this.status = 'completed';
    this.progress = 100;
    this.generation.processingTime = processingTime;

    // Calculer checksum d'intégrité
    const contentHash = crypto.createHash('sha256')
      .update(JSON.stringify(this.statistics || {}))
      .update(JSON.stringify(this.executiveSummary || {}))
      .update(this.reportId)
      .digest('hex');

    this.integrity.checksum = contentHash;
    this.integrity.signedAt = new Date();

    // Ajouter entrée chain of custody
    this.addChainOfCustodyEntry('ANALYZED', 'system', 'Report generation completed');

    console.log(`✅ Report ${this.reportId} completed in ${Math.round(processingTime/1000)}s`);
    return this.save();
  } catch (error) {
    console.error(`Error marking report ${this.reportId} as completed:`, error);
    throw error;
  }
};

ReportSchema.methods.markFailed = function(errorMessage, source = 'system') {
  try {
    this.status = 'failed';
    this.progress = 0;
    this.addIssue('critical', errorMessage, source);
    this.addChainOfCustodyEntry('MODIFIED', source, 'Report generation failed');

    console.error(`❌ Report ${this.reportId} failed: ${errorMessage}`);
    return this.save();
  } catch (error) {
    console.error(`Error marking report ${this.reportId} as failed:`, error);
    throw error;
  }
};

ReportSchema.methods.recordAccess = function(action, userInfo = {}) {
  try {
    // Validation action
    const validActions = ['view', 'download', 'share', 'modify', 'delete'];
    if (!validActions.includes(action)) {
      throw new Error(`Invalid action: ${action}`);
    }

    // Incrémenter compteurs
    switch(action) {
      case 'download':
        this.access.downloadCount += 1;
        break;
      case 'view':
        this.access.viewCount += 1;
        break;
      case 'share':
        this.access.shareCount += 1;
        break;
    }

    this.access.lastAccessed = new Date();

    // Enregistrer dans log (garder seulement les 200 derniers)
    this.access.accessLog.push({
      timestamp: new Date(),
      action: action,
      ip: userInfo.ip,
      userAgent: userInfo.userAgent,
      userId: userInfo.userId,
      success: userInfo.success !== false
    });

    if (this.access.accessLog.length > 200) {
      this.access.accessLog = this.access.accessLog.slice(-200);
    }

    // Chain of custody pour accès sensibles
    if (['download', 'share', 'modify'].includes(action)) {
      this.addChainOfCustodyEntry(
        'ACCESSED',
        userInfo.userId || 'anonymous',
        `Action: ${action} from ${userInfo.ip || 'unknown IP'}`
      );
    }

    return this.save();
  } catch (error) {
    console.error(`Error recording access for report ${this.reportId}:`, error);
    throw error;
  }
};

ReportSchema.methods.addChainOfCustodyEntry = function(action, performedBy, notes, additionalData = {}) {
  try {
    if (!this.chainOfCustody) {
      this.chainOfCustody = { entries: [], integrityVerification: {} };
    }

    const entry = {
      timestamp: new Date(),
      action: action,
      performedBy: performedBy,
      notes: notes,
      hash: this.integrity?.checksum || '',
      ...additionalData
    };

    this.chainOfCustody.entries.push(entry);

    // Mettre à jour statut intégrité
    this.chainOfCustody.integrityVerification = {
      lastVerified: new Date(),
      verificationMethod: 'checksum',
      verifiedBy: performedBy,
      status: 'intact'
    };

    return this.save();
  } catch (error) {
    console.error(`Error adding chain of custody entry:`, error);
    throw error;
  }
};

ReportSchema.methods.generateComprehensiveSummary = function() {
  try {
    if (!this.statistics) {
      throw new Error('Cannot generate summary without statistics');
    }

    const stats = this.statistics;
    const totalImages = stats.totalImages || 0;

    // Calculer risque global avec logique forensique
    let overallRisk = 'minimal';
    let confidence = 'medium';

    const highRiskCount = (stats.riskDistribution?.fake || 0) + (stats.riskDistribution?.likelyFake || 0);
    const mediumRiskCount = stats.riskDistribution?.uncertain || 0;
    const avgScore = stats.authenticityScores?.average || 0;
    const criticalFlags = stats.flagsAnalysis?.bySeverity?.critical || 0;

    // Algorithme de classification risque
    if (criticalFlags > 0 && highRiskCount > 0) {
      overallRisk = 'critical';
      confidence = 'high';
    } else if (highRiskCount > totalImages * 0.2 || avgScore < 30) {
      overallRisk = 'high';
      confidence = 'high';
    } else if (highRiskCount > 0 || mediumRiskCount > totalImages * 0.3 || avgScore < 60) {
      overallRisk = 'medium';
      confidence = avgScore > 0 ? 'medium' : 'low';
    } else if (mediumRiskCount > 0 || avgScore < 80) {
      overallRisk = 'low';
      confidence = 'medium';
    }

    // Générer findings clés
    const keyFindings = [];
    keyFindings.push(`${totalImages} image(s) soumise(s) à l'analyse forensique`);
    keyFindings.push(`${stats.analyzedImages || 0} image(s) analysée(s) avec succès`);

    if (avgScore > 0) {
      keyFindings.push(`Score moyen d'authenticité: ${Math.round(avgScore)}%`);
    }

    if (highRiskCount > 0) {
      keyFindings.push(`⚠️ ${highRiskCount} image(s) classée(s) à haut risque`);
    }

    if (stats.detectionStats?.aiGenerated?.count > 0) {
      keyFindings.push(`🤖 ${stats.detectionStats.aiGenerated.count} image(s) potentiellement générée(s) par IA`);
    }

    if (stats.detectionStats?.manipulationDetected?.count > 0) {
      keyFindings.push(`✂️ ${stats.detectionStats.manipulationDetected.count} image(s) avec manipulation détectée`);
    }

    if (criticalFlags > 0) {
      keyFindings.push(`🚨 ${criticalFlags} alerte(s) critique(s) levée(s)`);
    }

    // Identifier issues critiques
    const criticalIssues = [];

    if (stats.detectionStats?.aiGenerated?.count > 0) {
      criticalIssues.push({
        issue: 'Contenu potentiellement généré par Intelligence Artificielle',
        severity: 'critical',
        affectedImages: stats.detectionStats.aiGenerated.count,
        recommendation: 'Expertise forensique spécialisée en détection IA obligatoire',
        urgency: 'immediate'
      });
    }

    if (stats.detectionStats?.manipulationDetected?.count > 0) {
      criticalIssues.push({
        issue: 'Manipulation numérique détectée sur images',
        severity: 'high',
        affectedImages: stats.detectionStats.manipulationDetected.count,
        recommendation: 'Analyse technique approfondie et validation experte requises',
        urgency: 'high'
      });
    }

    if (stats.detectionStats?.metadataAnalysis?.missing > totalImages * 0.7) {
      criticalIssues.push({
        issue: 'Métadonnées EXIF largement absentes',
        severity: 'medium',
        affectedImages: stats.detectionStats.metadataAnalysis.missing,
        recommendation: 'Vérification origine et chaîne de custody des fichiers',
        urgency: 'medium'
      });
    }

    // Mettre à jour résumé exécutif
    this.executiveSummary = {
      overallRisk: overallRisk,
      confidence: confidence,
      keyFindings: keyFindings,
      criticalIssues: criticalIssues,
      alertsDistribution: {
        info: stats.flagsAnalysis?.bySeverity?.info || 0,
        warning: stats.flagsAnalysis?.bySeverity?.warning || 0,
        critical: stats.flagsAnalysis?.bySeverity?.critical || 0
      },
      complianceStatus: {
        forensicStandards: this.chainOfCustody?.entries?.length > 0,
        legalRequirements: this.integrity?.verified || false,
        qualityAssurance: criticalIssues.length === 0
      }
    };

    // Générer recommandations
    this.generateDetailedRecommendations(overallRisk, criticalIssues);

    console.log(`📋 Summary generated for report ${this.reportId}: ${overallRisk} risk level`);
    return this.save();
  } catch (error) {
    console.error(`Error generating summary for report ${this.reportId}:`, error);
    this.addIssue('error', `Failed to generate summary: ${error.message}`, 'summary_generator');
    throw error;
  }
};

ReportSchema.methods.generateDetailedRecommendations = function(overallRisk, criticalIssues) {
  try {
    let overallRecommendation = 'ACCEPT_ALL';
    let urgencyLevel = 'low';
    let confidenceLevel = 'high';

    // Déterminer recommandation globale
    switch(overallRisk) {
      case 'critical':
        overallRecommendation = 'REJECT_ALL';
        urgencyLevel = 'critical';
        confidenceLevel = 'high';
        break;
      case 'high':
        overallRecommendation = 'EXPERT_REVIEW_MANDATORY';
        urgencyLevel = 'high';
        confidenceLevel = 'high';
        break;
      case 'medium':
        overallRecommendation = 'FURTHER_INVESTIGATION_REQUIRED';
        urgencyLevel = 'medium';
        confidenceLevel = 'medium';
        break;
      case 'low':
        overallRecommendation = 'ACCEPT_WITH_CAUTION';
        urgencyLevel = 'low';
        confidenceLevel = 'medium';
        break;
    }

    const specificRecommendations = [];
    const riskMitigation = [];
    const nextSteps = [];

    // Recommandations basées sur les issues
    criticalIssues.forEach(issue => {
      if (issue.issue.includes('IA') || issue.issue.includes('Intelligence')) {
        specificRecommendations.push({
          category: 'expert_consultation',
          recommendation: 'Consultation immédiate avec spécialiste en détection de contenu généré par IA',
          priority: 'critical',
          estimatedTimeframe: '24-48 heures',
          requiredResources: ['Expert IA forensique', 'Outils de détection avancés', 'Bases de données de référence'],
          riskIfIgnored: 'critical'
        });

        riskMitigation.push({
          riskType: 'Acceptation de contenu synthétique comme preuve',
          currentRiskLevel: 'critical',
          mitigationStrategy: 'Validation multi-algorithmes et expertise humaine',
          expectedEffectiveness: 'high',
          implementationComplexity: 'moderate'
        });
      }

      if (issue.issue.includes('Manipulation') || issue.issue.includes('manipulation')) {
        specificRecommendations.push({
          category: 'technical_verification',
          recommendation: 'Analyse forensique technique approfondie avec outils spécialisés',
          priority: 'high',
          estimatedTimeframe: '2-5 jours ouvrables',
          requiredResources: ['Logiciels forensiques', 'Expert technique', 'Infrastructure d\'analyse'],
          riskIfIgnored: 'high'
        });
      }

      if (issue.issue.includes('Métadonnées') || issue.issue.includes('métadonnées')) {
        specificRecommendations.push({
          category: 'source_verification',
          recommendation: 'Investigation approfondie de l\'origine et de la chaîne de custody',
          priority: 'medium',
          estimatedTimeframe: '3-7 jours',
          requiredResources: ['Documentation source', 'Contact avec fournisseur', 'Outils de traçabilité'],
          riskIfIgnored: 'medium'
        });
      }
    });

    // Recommandations générales par niveau de risque
    if (overallRisk === 'critical' || overallRisk === 'high') {
      specificRecommendations.push({
        category: 'legal_review',
        recommendation: 'Consultation juridique sur l\'admissibilité des preuves',
        priority: 'high',
        estimatedTimeframe: '1-3 jours',
        requiredResources: ['Conseil juridique spécialisé'],
        riskIfIgnored: 'high'
      });

      nextSteps.push({
        step: 'Escalade immédiate vers équipe forensique senior',
        responsible: 'Chef d\'équipe forensique',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
        dependencies: ['Disponibilité expert senior']
      });
    }

    if (overallRisk !== 'minimal') {
      specificRecommendations.push({
        category: 'chain_of_custody',
        recommendation: 'Documentation complète de la chaîne de custody',
        priority: 'medium',
        estimatedTimeframe: '1-2 jours',
        requiredResources: ['Documentation', 'Signatures témoins'],
        riskIfIgnored: 'medium'
      });

      nextSteps.push({
        step: 'Vérification et documentation chaîne de custody',
        responsible: 'Analyste principal',
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h
        dependencies: ['Accès aux sources originales']
      });
    }

    // Toujours recommander quality assurance
    specificRecommendations.push({
      category: 'quality_assurance',
      recommendation: 'Revue par pair et validation des résultats d\'analyse',
      priority: urgencyLevel === 'critical' ? 'critical' : 'medium',
      estimatedTimeframe: '1-2 jours',
      requiredResources: ['Second analyste forensique'],
      riskIfIgnored: 'medium'
    });

    this.recommendations = {
      overallRecommendation: overallRecommendation,
      urgencyLevel: urgencyLevel,
      confidenceLevel: confidenceLevel,
      specificRecommendations: specificRecommendations,
      riskMitigation: riskMitigation,
      nextSteps: nextSteps,
      legalConsiderations: [{
        consideration: 'Admissibilité en contexte judiciaire',
        severity: overallRisk === 'critical' ? 'critical' : 'warning',
        recommendation: 'Consultation avec expert légal avant utilisation comme preuve'
      }]
    };

    return this.save();
  } catch (error) {
    console.error(`Error generating recommendations:`, error);
    throw error;
  }
};

// =====================================
// MÉTHODES STATIQUES ÉTENDUES
// =====================================

ReportSchema.statics.findBySession = function(sessionId, limit = 10) {
  return this.find({ sessionId: sessionId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('images', 'originalName status authenticityScore riskClassification')
    .populate('primaryImage', 'originalName status authenticityScore riskClassification')
    .lean();
};

ReportSchema.statics.findExpired = function() {
  return this.find({
    'access.expiresAt': { $lt: new Date() },
    category: { $nin: ['legal', 'audit'] } // Exclure ceux qui ne doivent jamais expirer
  });
};

ReportSchema.statics.findByRiskLevel = function(riskLevel) {
  return this.find({ 'executiveSummary.overallRisk': riskLevel })
    .sort({ generatedAt: -1 });
};

ReportSchema.statics.findCriticalReports = function() {
  return this.find({
    $or: [
      { 'executiveSummary.overallRisk': 'critical' },
      { 'recommendations.urgencyLevel': 'critical' },
      { 'issues.level': 'critical', 'issues.resolved': false }
    ]
  }).sort({ generatedAt: -1 });
};

ReportSchema.statics.getStatsByPeriod = function(days = 30) {
  const startDate = new Date(Date.now() - (days * 24 * 60 * 60 * 1000));
  
  return this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalReports: { $sum: 1 },
        completedReports: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        averageProcessingTime: { $avg: '$generation.processingTime' },
        totalDownloads: { $sum: '$access.downloadCount' },
        riskDistribution: { $push: '$executiveSummary.overallRisk' },
        formatDistribution: { $push: '$formats.type' },
        categoryDistribution: { $push: '$category' }
      }
    }
  ]);
};

ReportSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    'access.expiresAt': { $lt: new Date() },
    category: { $nin: ['legal', 'audit'] }
  });
};

// =====================================
// MIDDLEWARE ROBUSTE
// =====================================

// Pre-save validation complète
ReportSchema.pre('save', function(next) {
  try {
    // Validation cohérence type/images
    if (this.reportType === 'single' && this.images.length !== 1) {
      return next(new Error('Un rapport single doit contenir exactement une image'));
    }

    if (this.reportType === 'batch' && this.images.length < 2) {
      return next(new Error('Un rapport batch doit contenir au moins deux images'));
    }

    // Définir image principale pour single
    if (this.reportType === 'single' && this.images.length > 0) {
      this.primaryImage = this.images[0];
    }

    // Validation dates période
    if (this.reportPeriod?.startDate && this.reportPeriod?.endDate) {
      if (this.reportPeriod.startDate > this.reportPeriod.endDate) {
        return next(new Error('La date de début doit être antérieure à la date de fin'));
      }
    }

    // Validation formats générés
    if (this.status === 'completed') {
      const hasValidFormat = this.formats.some(format =>
        format.generated && format.filepath
      );
      
      if (!hasValidFormat) {
        return next(new Error('Un rapport completed doit avoir au moins un format généré'));
      }
    }

    // Validation progress cohérence
    if (this.progress < 0 || this.progress > 100) {
      return next(new Error('Progress doit être entre 0 et 100'));
    }

    // Auto-update progress basé sur status
    if (this.status === 'completed' && this.progress !== 100) {
      this.progress = 100;
    } else if (this.status === 'failed' && this.progress !== 0) {
      this.progress = 0;
    }

    // Validation classification vs catégorie
    if (this.classification === 'top_secret' && this.category !== 'legal') {
      console.warn(`Report ${this.reportId}: Top secret classification with non-legal category`);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Post-save logging sécurisé
ReportSchema.post('save', function(doc) {
  const sensitiveFields = ['generation.requestedBy.ip', 'access.accessLog'];
  const logDoc = { ...doc.toObject() };
  
  // Masquer champs sensibles dans les logs
  sensitiveFields.forEach(field => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (logDoc[parent] && logDoc[parent][child]) {
        logDoc[parent][child] = '[REDACTED]';
      }
    }
  });

  console.log(`📊 Rapport sauvegardé: ${doc.reportId} - Type: ${doc.reportType} - Status: ${doc.status} - Risk: ${doc.executiveSummary?.overallRisk || 'unknown'}`);
});

// Pre-remove cleanup robuste
ReportSchema.pre(['deleteOne', 'findOneAndDelete'], function(next) {
  try {
    const fs = require('fs');
    // Note: Dans les middleware pre pour deleteOne, 'this' est la query, pas le document
    // Il faut récupérer le document d'abord
    
    this.model.findOne(this.getQuery()).then(doc => {
      if (!doc) return next();

      // Supprimer fichiers physiques
      if (doc.formats && doc.formats.length > 0) {
        doc.formats.forEach(format => {
          if (format.filepath && fs.existsSync(format.filepath)) {
            try {
              fs.unlinkSync(format.filepath);
              console.log(`🗑️ Fichier supprimé: ${format.filepath}`);
            } catch (error) {
              console.error(`❌ Erreur suppression fichier ${format.filepath}:`, error);
            }
          }
        });
      }

      // Log de suppression
      console.log(`🗑️ Rapport supprimé: ${doc.reportId}`);
      next();
    }).catch(next);
  } catch (error) {
    next(error);
  }
});

// Post-remove cleanup
ReportSchema.post(['deleteOne', 'findOneAndDelete'], function(doc) {
  if (doc) {
    console.log(`✅ Nettoyage terminé pour rapport: ${doc.reportId}`);
  }
});

// =====================================
// TRANSFORMATION JSON SÉCURISÉE
// =====================================

ReportSchema.set('toJSON', {
  transform: function(doc, ret) {
    // Transformation de base
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;

    // Ajouter propriétés calculées
    ret.isExpired = doc.isExpired;
    ret.ageInHours = doc.ageInHours;
    ret.totalFileSize = doc.totalFileSize;
    ret.criticalIssuesCount = doc.criticalIssuesCount;
    ret.isLegalCompliant = doc.isLegalCompliant;
    ret.accessibilityLevel = doc.accessibilityLevel;
    ret.completionPercentage = doc.completionPercentage;

    // Masquage données sensibles selon mode privacy
    if (doc.privacy?.anonymized || doc.privacy?.mode === 'COMMERCIAL') {
      // Supprimer informations personnelles
      if (ret.generation?.requestedBy) {
        delete ret.generation.requestedBy.ip;
        delete ret.generation.requestedBy.userAgent;
      }

      // Nettoyer logs d'accès
      if (ret.access?.accessLog) {
        ret.access.accessLog = ret.access.accessLog.map(log => ({
          timestamp: log.timestamp,
          action: log.action,
          success: log.success
          // IP et userAgent supprimés
        }));
      }

      // Supprimer détails chaîne de custody sensibles
      if (ret.chainOfCustody?.entries) {
        ret.chainOfCustody.entries = ret.chainOfCustody.entries.map(entry => ({
          timestamp: entry.timestamp,
          action: entry.action,
          notes: entry.notes?.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_REDACTED]')
        }));
      }
    }

    // Redaction complète pour niveau élevé
    if (doc.privacy?.redactionLevel === 'substantial' || doc.privacy?.redactionLevel === 'complete') {
      delete ret.generation?.requestedBy;
      delete ret.access?.accessLog;
      delete ret.customMetadata;
      
      if (doc.privacy.redactionLevel === 'complete') {
        delete ret.chainOfCustody;
        delete ret.issues;
        ret.statistics = {
          totalImages: ret.statistics?.totalImages || 0,
          analyzedImages: ret.statistics?.analyzedImages || 0
        };
      }
    }

    return ret;
  }
});

// =====================================
// EXPORT ET CONFIGURATION
// =====================================

// Configuration d'optimisation
ReportSchema.set('strict', true);
ReportSchema.set('strictQuery', true);
ReportSchema.set('runValidators', true);

module.exports = mongoose.model('Report', ReportSchema);
