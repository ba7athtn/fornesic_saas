"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var mongoose = require('mongoose');
var crypto = require('crypto');

// =====================================
// SCHEMAS DÉTAILLÉS POUR RAPPORTS FORENSIQUES
// =====================================

// Schema statistiques forensiques complètes
var forensicStatsSchema = new mongoose.Schema({
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
      validator: function validator(value) {
        return value <= this.totalImages;
      },
      message: 'Analyzed images cannot exceed total images'
    }
  },
  failedAnalyses: {
    type: Number,
    "default": 0,
    min: 0
  },
  // Distribution des risques (corrigée selon notre méthodologie)
  riskDistribution: {
    authentic: {
      type: Number,
      "default": 0,
      min: 0
    },
    likelyAuthentic: {
      type: Number,
      "default": 0,
      min: 0
    },
    uncertain: {
      type: Number,
      "default": 0,
      min: 0
    },
    likelyFake: {
      type: Number,
      "default": 0,
      min: 0
    },
    fake: {
      type: Number,
      "default": 0,
      min: 0
    }
  },
  // Scores détaillés
  authenticityScores: {
    average: {
      type: Number,
      min: 0,
      max: 100
    },
    median: {
      type: Number,
      min: 0,
      max: 100
    },
    standardDeviation: {
      type: Number,
      min: 0
    },
    min: {
      type: Number,
      min: 0,
      max: 100
    },
    max: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  // Analyse des 7 piliers
  pillarAnalysis: {
    anatomical: {
      analyzed: {
        type: Number,
        "default": 0
      },
      averageScore: {
        type: Number,
        min: 0,
        max: 100
      },
      flagged: {
        type: Number,
        "default": 0
      }
    },
    physics: {
      analyzed: {
        type: Number,
        "default": 0
      },
      averageScore: {
        type: Number,
        min: 0,
        max: 100
      },
      flagged: {
        type: Number,
        "default": 0
      }
    },
    statistical: {
      analyzed: {
        type: Number,
        "default": 0
      },
      averageScore: {
        type: Number,
        min: 0,
        max: 100
      },
      flagged: {
        type: Number,
        "default": 0
      }
    },
    exif: {
      analyzed: {
        type: Number,
        "default": 0
      },
      averageScore: {
        type: Number,
        min: 0,
        max: 100
      },
      flagged: {
        type: Number,
        "default": 0
      }
    },
    behavioral: {
      analyzed: {
        type: Number,
        "default": 0
      },
      averageScore: {
        type: Number,
        min: 0,
        max: 100
      },
      flagged: {
        type: Number,
        "default": 0
      }
    },
    audio: {
      analyzed: {
        type: Number,
        "default": 0
      },
      averageScore: {
        type: Number,
        min: 0,
        max: 100
      },
      flagged: {
        type: Number,
        "default": 0
      }
    },
    expert: {
      analyzed: {
        type: Number,
        "default": 0
      },
      averageScore: {
        type: Number,
        min: 0,
        max: 100
      },
      flagged: {
        type: Number,
        "default": 0
      }
    }
  },
  // Flags et alertes détaillées
  flagsAnalysis: {
    total: {
      type: Number,
      "default": 0,
      min: 0
    },
    bySeverity: {
      critical: {
        type: Number,
        "default": 0,
        min: 0
      },
      warning: {
        type: Number,
        "default": 0,
        min: 0
      },
      info: {
        type: Number,
        "default": 0,
        min: 0
      }
    },
    byType: [{
      type: String,
      count: {
        type: Number,
        min: 0
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      }
    }]
  },
  // Détections spécialisées
  detectionStats: {
    aiGenerated: {
      count: {
        type: Number,
        "default": 0,
        min: 0
      },
      averageConfidence: {
        type: Number,
        min: 0,
        max: 100
      },
      generators: [{
        name: String,
        count: Number,
        averageConfidence: Number
      }]
    },
    manipulationDetected: {
      count: {
        type: Number,
        "default": 0,
        min: 0
      },
      types: [{
        type: String,
        count: Number,
        averageScore: Number
      }]
    },
    metadataAnalysis: {
      complete: {
        type: Number,
        "default": 0
      },
      partial: {
        type: Number,
        "default": 0
      },
      missing: {
        type: Number,
        "default": 0
      },
      suspicious: {
        type: Number,
        "default": 0
      }
    }
  },
  // Analyse technique
  technicalMetrics: {
    averageFileSize: Number,
    totalProcessingTime: {
      type: Number,
      min: 0
    },
    averageProcessingTimePerImage: {
      type: Number,
      min: 0
    },
    formatDistribution: [{
      format: String,
      count: {
        type: Number,
        min: 0
      },
      percentage: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    cameraDistribution: [{
      make: String,
      model: String,
      count: {
        type: Number,
        min: 0
      },
      suspiciousCount: {
        type: Number,
        "default": 0
      }
    }],
    softwareDistribution: [{
      name: String,
      version: String,
      count: {
        type: Number,
        min: 0
      },
      suspiciousCount: {
        type: Number,
        "default": 0
      }
    }]
  }
}, {
  _id: false
});

// Schema configuration rapport étendue et sécurisée
var reportConfigSchema = new mongoose.Schema({
  // Template et présentation
  template: {
    type: String,
    "enum": ['executive', 'technical', 'legal', 'summary', 'detailed', 'comparison', 'audit'],
    "default": 'executive',
    required: true
  },
  // Langue et localisation
  language: {
    type: String,
    "enum": ['fr', 'en', 'es', 'de', 'it', 'ar'],
    "default": 'fr'
  },
  locale: {
    type: String,
    "default": 'fr-FR',
    validate: {
      validator: function validator(value) {
        return /^[a-z]{2}-[A-Z]{2}$/.test(value);
      },
      message: 'Locale must be in format xx-XX'
    }
  },
  // Sections incluses
  sections: {
    executiveSummary: {
      type: Boolean,
      "default": true
    },
    methodology: {
      type: Boolean,
      "default": false
    },
    detailedAnalysis: {
      type: Boolean,
      "default": true
    },
    pillarAnalysis: {
      type: Boolean,
      "default": true
    },
    technicalDetails: {
      type: Boolean,
      "default": false
    },
    recommendations: {
      type: Boolean,
      "default": true
    },
    chainOfCustody: {
      type: Boolean,
      "default": false
    },
    appendices: {
      type: Boolean,
      "default": false
    },
    glossary: {
      type: Boolean,
      "default": false
    }
  },
  // Données incluses avec contrôle granulaire
  includeOptions: {
    rawData: {
      type: Boolean,
      "default": false
    },
    thumbnails: {
      type: Boolean,
      "default": true
    },
    fullImages: {
      type: Boolean,
      "default": false
    },
    exifData: {
      type: Boolean,
      "default": true
    },
    statisticalCharts: {
      type: Boolean,
      "default": true
    },
    flagsDetails: {
      type: Boolean,
      "default": true
    },
    pillarBreakdown: {
      type: Boolean,
      "default": true
    },
    comparisonCharts: {
      type: Boolean,
      "default": false
    },
    heatmaps: {
      type: Boolean,
      "default": false
    },
    timelineAnalysis: {
      type: Boolean,
      "default": false
    }
  },
  // Filtres avancés
  filters: {
    riskLevelMinimum: {
      type: String,
      "enum": ['AUTHENTIC', 'LIKELY_AUTHENTIC', 'UNCERTAIN', 'LIKELY_FAKE', 'FAKE']
    },
    includeOnlyFlagged: {
      type: Boolean,
      "default": false
    },
    minimumConfidence: {
      type: Number,
      min: 0,
      max: 100
    },
    dateRange: {
      start: Date,
      end: Date
    },
    specificPillars: [{
      type: String,
      "enum": ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert']
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
      primary: {
        type: String,
        "default": '#1e40af',
        match: /^#[0-9a-f]{6}$/i
      },
      secondary: {
        type: String,
        "default": '#06b6d4',
        match: /^#[0-9a-f]{6}$/i
      },
      success: {
        type: String,
        "default": '#059669',
        match: /^#[0-9a-f]{6}$/i
      },
      warning: {
        type: String,
        "default": '#d97706',
        match: /^#[0-9a-f]{6}$/i
      },
      danger: {
        type: String,
        "default": '#dc2626',
        match: /^#[0-9a-f]{6}$/i
      }
    },
    watermark: {
      type: Boolean,
      "default": false
    },
    footer: {
      type: String,
      maxlength: 200
    }
  }
}, {
  _id: false
});

// Schema recommandations forensiques
var forensicRecommendationsSchema = new mongoose.Schema({
  overallRecommendation: {
    type: String,
    "enum": ['ACCEPT_ALL', 'ACCEPT_WITH_CAUTION', 'FURTHER_INVESTIGATION_REQUIRED', 'EXPERT_REVIEW_MANDATORY', 'REJECT_SUSPICIOUS', 'REJECT_ALL', 'MIXED_RESULTS'],
    required: true
  },
  urgencyLevel: {
    type: String,
    "enum": ['low', 'medium', 'high', 'critical'],
    required: true
  },
  confidenceLevel: {
    type: String,
    "enum": ['low', 'medium', 'high'],
    required: true
  },
  specificRecommendations: [{
    category: {
      type: String,
      "enum": ['technical_verification', 'expert_consultation', 'source_verification', 'legal_review', 'chain_of_custody', 'additional_testing', 'quality_assurance', 'training_required'],
      required: true
    },
    recommendation: {
      type: String,
      required: true,
      maxlength: 500
    },
    priority: {
      type: String,
      "enum": ['low', 'medium', 'high', 'critical'],
      required: true
    },
    estimatedTimeframe: String,
    requiredResources: [String],
    estimatedCost: String,
    riskIfIgnored: {
      type: String,
      "enum": ['minimal', 'low', 'medium', 'high', 'critical']
    }
  }],
  riskMitigation: [{
    riskType: String,
    currentRiskLevel: {
      type: String,
      "enum": ['low', 'medium', 'high', 'critical']
    },
    mitigationStrategy: String,
    expectedEffectiveness: {
      type: String,
      "enum": ['low', 'medium', 'high']
    },
    implementationComplexity: {
      type: String,
      "enum": ['simple', 'moderate', 'complex']
    }
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
    completed: {
      type: Boolean,
      "default": false
    },
    completedAt: Date,
    notes: String
  }],
  legalConsiderations: [{
    consideration: String,
    jurisdiction: String,
    severity: {
      type: String,
      "enum": ['info', 'warning', 'critical']
    },
    recommendation: String
  }]
}, {
  _id: false
});

// Schema chaîne de custody forensique
var chainOfCustodySchema = new mongoose.Schema({
  entries: [{
    timestamp: {
      type: Date,
      required: true,
      "default": Date.now
    },
    action: {
      type: String,
      required: true,
      "enum": ['RECEIVED', 'ANALYZED', 'TRANSFERRED', 'STORED', 'ACCESSED', 'MODIFIED', 'VERIFIED', 'ARCHIVED', 'DESTROYED', 'REPORT_GENERATION_INITIATED']
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
        validator: function validator(value) {
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
      "enum": ['intact', 'compromised', 'unknown'],
      "default": 'intact'
    }
  }
}, {
  _id: false
});

// =====================================
// SCHEMA RAPPORT PRINCIPAL COMPLET CORRIGÉ
// =====================================

var ReportSchema = new mongoose.Schema({
  // Identification unique et traçabilité
  sessionId: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function validator(value) {
        return /^[a-zA-Z0-9_-]{8,50}$/.test(value);
      },
      message: 'SessionId must be alphanumeric, 8-50 characters'
    }
  },
  reportId: {
    type: String,
    required: true,
    "default": function _default() {
      return "RPT-".concat(Date.now(), "-").concat(crypto.randomBytes(3).toString('hex').toUpperCase());
    }
  },
  // Type et catégorie étendus
  reportType: {
    type: String,
    "enum": ['single', 'batch', 'session', 'comparison', 'timeline', 'forensic_audit', 'legal_brief'],
    "default": 'single',
    required: true
  },
  category: {
    type: String,
    "enum": ['routine', 'investigation', 'legal', 'audit', 'research', 'quality_control'],
    "default": 'routine'
  },
  classification: {
    type: String,
    "enum": ['public', 'internal', 'confidential', 'restricted', 'top_secret'],
    "default": 'internal'
  },
  // Formats de génération multiples
  formats: [{
    type: {
      type: String,
      "enum": ['pdf', 'json', 'html', 'csv', 'docx', 'xml', 'excel'],
      required: true
    },
    generated: {
      type: Boolean,
      "default": false
    },
    filepath: String,
    fileSize: {
      type: Number,
      min: 0
    },
    checksum: {
      type: String,
      validate: {
        validator: function validator(value) {
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
    "default": Date.now
  },
  reportPeriod: {
    startDate: {
      type: Date,
      validate: {
        validator: function validator(value) {
          var _this$reportPeriod;
          return !((_this$reportPeriod = this.reportPeriod) !== null && _this$reportPeriod !== void 0 && _this$reportPeriod.endDate) || value <= this.reportPeriod.endDate;
        },
        message: 'Start date must be before end date'
      }
    },
    endDate: {
      type: Date,
      validate: {
        validator: function validator(value) {
          var _this$reportPeriod2;
          return !((_this$reportPeriod2 = this.reportPeriod) !== null && _this$reportPeriod2 !== void 0 && _this$reportPeriod2.startDate) || value >= this.reportPeriod.startDate;
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
    "enum": ['queued', 'initializing', 'analyzing', 'generating', 'finalizing', 'completed', 'failed', 'cancelled', 'expired'],
    "default": 'queued'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    "default": 0,
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
          validator: function validator(value) {
            // Accepter IPv4, IPv6 et IPv6 mappé
            return !value || /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value) ||
            // IPv4
            /^[a-f0-9:]+$/i.test(value) ||
            // IPv6
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
      timestamp: {
        type: Date,
        "default": Date.now
      }
    },
    processingTime: {
      type: Number,
      min: 0
    },
    systemInfo: {
      nodeVersion: String,
      platform: String,
      architecture: String,
      memory: {
        type: Number,
        min: 0
      },
      cpuCores: {
        type: Number,
        min: 1
      },
      loadAverage: [Number]
    },
    versions: {
      reportGenerator: {
        type: String,
        "default": '3.0.0-forensic'
      },
      analysisEngine: String,
      templateVersion: String,
      dependencies: mongoose.Schema.Types.Mixed
    },
    performance: {
      memoryPeak: {
        type: Number,
        min: 0
      },
      cpuUsage: {
        type: Number,
        min: 0,
        max: 100
      },
      diskUsage: {
        type: Number,
        min: 0
      },
      networkCalls: {
        type: Number,
        min: 0
      }
    }
  },
  // Résumé exécutif forensique
  executiveSummary: {
    overallRisk: {
      type: String,
      "enum": ['minimal', 'low', 'medium', 'high', 'critical']
    },
    confidence: {
      type: String,
      "enum": ['low', 'medium', 'high'],
      "default": 'medium'
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
        "enum": ['low', 'medium', 'high', 'critical'],
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
        "enum": ['low', 'medium', 'high', 'immediate']
      }
    }],
    alertsDistribution: {
      info: {
        type: Number,
        "default": 0,
        min: 0
      },
      warning: {
        type: Number,
        "default": 0,
        min: 0
      },
      critical: {
        type: Number,
        "default": 0,
        min: 0
      }
    },
    complianceStatus: {
      forensicStandards: {
        type: Boolean,
        "default": false
      },
      legalRequirements: {
        type: Boolean,
        "default": false
      },
      qualityAssurance: {
        type: Boolean,
        "default": false
      }
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
      "default": function _default() {
        return crypto.randomBytes(4).toString('hex');
      }
    },
    level: {
      type: String,
      "enum": ['info', 'warning', 'error', 'critical'],
      required: true
    },
    category: {
      type: String,
      "enum": ['generation', 'analysis', 'data', 'system', 'validation'],
      "default": 'generation'
    },
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    source: String,
    timestamp: {
      type: Date,
      "default": Date.now
    },
    resolved: {
      type: Boolean,
      "default": false
    },
    resolution: {
      type: String,
      maxlength: 300
    },
    resolvedAt: Date,
    resolvedBy: String
  }],
  // Gestion d'accès sécurisée
  access: {
    downloadCount: {
      type: Number,
      "default": 0,
      min: 0
    },
    viewCount: {
      type: Number,
      "default": 0,
      min: 0
    },
    shareCount: {
      type: Number,
      "default": 0,
      min: 0
    },
    lastAccessed: Date,
    accessLog: [{
      timestamp: {
        type: Date,
        "default": Date.now
      },
      action: {
        type: String,
        "enum": ['view', 'download', 'share', 'modify', 'delete'],
        required: true
      },
      ip: String,
      userAgent: String,
      userId: String,
      success: {
        type: Boolean,
        "default": true
      },
      failureReason: String
    }],
    permissions: {
      "public": {
        type: Boolean,
        "default": false
      },
      requiresAuth: {
        type: Boolean,
        "default": true
      },
      allowedUsers: [{
        userId: String,
        permissions: [String],
        grantedBy: String,
        grantedAt: {
          type: Date,
          "default": Date.now
        }
      }],
      allowedRoles: [String],
      restrictions: {
        ipWhitelist: [String],
        timeRestrictions: {
          startTime: String,
          // HH:MM
          endTime: String,
          // HH:MM
          timezone: String
        }
      }
    },
    // TTL amélioré avec gestion par catégorie
    expiresAt: {
      type: Date,
      "default": function _default() {
        var baseDate = Date.now();
        var days = 30; // défaut

        switch (this.category) {
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
        validator: function validator(value) {
          return !value || /^[a-f0-9]{64}$/i.test(value);
        },
        message: 'Checksum must be SHA-256 format'
      }
    },
    algorithm: {
      type: String,
      "default": 'SHA-256'
    },
    signedBy: String,
    signedAt: Date,
    verified: {
      type: Boolean,
      "default": false
    },
    verificationLog: [{
      timestamp: {
        type: Date,
        "default": Date.now
      },
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
      "enum": ['JUDICIAL', 'COMMERCIAL', 'RESEARCH', 'CUSTOM'],
      "default": 'COMMERCIAL'
    },
    anonymized: {
      type: Boolean,
      "default": false
    },
    dataRetentionPolicy: String,
    gdprCompliant: {
      type: Boolean,
      "default": true
    },
    sensitiveDataRemoved: {
      type: Boolean,
      "default": false
    },
    redactionLevel: {
      type: String,
      "enum": ['none', 'partial', 'substantial', 'complete'],
      "default": 'none'
    }
  },
  // Métadonnées personnalisées avec validation
  customMetadata: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: function validator(value) {
        return !value || _typeof(value) === 'object' && Object.keys(value).length <= 20;
      },
      message: 'Custom metadata cannot exceed 20 properties'
    }
  },
  // Versioning et historique
  version: {
    type: Number,
    "default": 1,
    min: 1
  },
  previousVersions: [{
    version: {
      type: Number,
      required: true
    },
    generatedAt: {
      type: Date,
      required: true
    },
    changes: String,
    archivedPath: String,
    archivedBy: String,
    retentionDate: Date
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
  collection: 'reports'
});

// =====================================
// INDEX OPTIMISÉS ET SÉCURISÉS
// =====================================

// Index principaux
ReportSchema.index({
  sessionId: 1,
  createdAt: -1
});
ReportSchema.index({
  reportId: 1
}, {
  unique: true
});
ReportSchema.index({
  status: 1,
  generatedAt: -1
});
ReportSchema.index({
  reportType: 1,
  category: 1
});

// Index pour recherche et filtrage
ReportSchema.index({
  'executiveSummary.overallRisk': 1
});
ReportSchema.index({
  'recommendations.urgencyLevel': 1
});
ReportSchema.index({
  classification: 1
});
ReportSchema.index({
  'generation.requestedBy.userId': 1
});

// Index TTL sécurisé
ReportSchema.index({
  'access.expiresAt': 1
}, {
  expireAfterSeconds: 0,
  partialFilterExpression: {
    category: {
      $nin: ['legal', 'audit']
    }
  }
});

// Index performance
ReportSchema.index({
  'access.lastAccessed': -1
});
ReportSchema.index({
  'privacy.mode': 1
});
ReportSchema.index({
  version: -1
});

// =====================================
// VIRTUALS ÉTENDUS ET SÉCURISÉS
// =====================================

ReportSchema.virtual('isExpired').get(function () {
  if (this.category === 'legal' || this.category === 'audit') {
    return false; // Jamais expirer pour légal/audit
  }
  return this.access.expiresAt < new Date();
});
ReportSchema.virtual('ageInHours').get(function () {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});
ReportSchema.virtual('totalFileSize').get(function () {
  return this.formats.reduce(function (total, format) {
    return total + (format.fileSize || 0);
  }, 0);
});
ReportSchema.virtual('generationTimeMinutes').get(function () {
  var _this$generation;
  return (_this$generation = this.generation) !== null && _this$generation !== void 0 && _this$generation.processingTime ? Math.round(this.generation.processingTime / (1000 * 60)) : null;
});
ReportSchema.virtual('criticalIssuesCount').get(function () {
  return this.issues.filter(function (issue) {
    return issue.level === 'critical' && !issue.resolved;
  }).length;
});
ReportSchema.virtual('isLegalCompliant').get(function () {
  var _this$chainOfCustody, _this$integrity, _this$executiveSummar;
  return ((_this$chainOfCustody = this.chainOfCustody) === null || _this$chainOfCustody === void 0 || (_this$chainOfCustody = _this$chainOfCustody.entries) === null || _this$chainOfCustody === void 0 ? void 0 : _this$chainOfCustody.length) > 0 && ((_this$integrity = this.integrity) === null || _this$integrity === void 0 ? void 0 : _this$integrity.verified) && ((_this$executiveSummar = this.executiveSummary) === null || _this$executiveSummar === void 0 || (_this$executiveSummar = _this$executiveSummar.complianceStatus) === null || _this$executiveSummar === void 0 ? void 0 : _this$executiveSummar.forensicStandards);
});
ReportSchema.virtual('accessibilityLevel').get(function () {
  if (this.access.permissions["public"]) return 'public';
  if (!this.access.permissions.requiresAuth) return 'open';
  if (this.access.permissions.allowedUsers.length > 0) return 'restricted';
  return 'private';
});
ReportSchema.virtual('completionPercentage').get(function () {
  if (this.status === 'completed') return 100;
  if (this.status === 'failed' || this.status === 'cancelled') return 0;
  return this.progress || 0;
});

// =====================================
// MÉTHODES D'INSTANCE ROBUSTES
// =====================================

// Gestion d'erreurs améliorée
ReportSchema.methods.addIssue = function (level, message, source) {
  var category = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'generation';
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
      console.error("\uD83D\uDEA8 Critical issue in report ".concat(this.reportId, ": ").concat(message));
    }
    return this.save();
  } catch (error) {
    console.error("Error adding issue to report ".concat(this.reportId, ":"), error);
    throw error;
  }
};
ReportSchema.methods.markCompleted = function () {
  var processingTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  try {
    this.status = 'completed';
    this.progress = 100;
    this.generation.processingTime = processingTime;

    // Calculer checksum d'intégrité
    var contentHash = crypto.createHash('sha256').update(JSON.stringify(this.statistics || {})).update(JSON.stringify(this.executiveSummary || {})).update(this.reportId).digest('hex');
    this.integrity.checksum = contentHash;
    this.integrity.signedAt = new Date();

    // Ajouter entrée chain of custody
    this.addChainOfCustodyEntry('ANALYZED', 'system', 'Report generation completed');
    console.log("\u2705 Report ".concat(this.reportId, " completed in ").concat(Math.round(processingTime / 1000), "s"));
    return this.save();
  } catch (error) {
    console.error("Error marking report ".concat(this.reportId, " as completed:"), error);
    throw error;
  }
};
ReportSchema.methods.markFailed = function (errorMessage) {
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'system';
  try {
    this.status = 'failed';
    this.progress = 0;
    this.addIssue('critical', errorMessage, source);
    this.addChainOfCustodyEntry('MODIFIED', source, 'Report generation failed');
    console.error("\u274C Report ".concat(this.reportId, " failed: ").concat(errorMessage));
    return this.save();
  } catch (error) {
    console.error("Error marking report ".concat(this.reportId, " as failed:"), error);
    throw error;
  }
};
ReportSchema.methods.recordAccess = function (action) {
  var userInfo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  try {
    // Validation action
    var validActions = ['view', 'download', 'share', 'modify', 'delete'];
    if (!validActions.includes(action)) {
      throw new Error("Invalid action: ".concat(action));
    }

    // Incrémenter compteurs
    switch (action) {
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
      this.addChainOfCustodyEntry('ACCESSED', userInfo.userId || 'anonymous', "Action: ".concat(action, " from ").concat(userInfo.ip || 'unknown IP'));
    }
    return this.save();
  } catch (error) {
    console.error("Error recording access for report ".concat(this.reportId, ":"), error);
    throw error;
  }
};
ReportSchema.methods.addChainOfCustodyEntry = function (action, performedBy, notes) {
  var additionalData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  try {
    var _this$integrity2;
    if (!this.chainOfCustody) {
      this.chainOfCustody = {
        entries: [],
        integrityVerification: {}
      };
    }
    var entry = _objectSpread({
      timestamp: new Date(),
      action: action,
      performedBy: performedBy,
      notes: notes,
      hash: ((_this$integrity2 = this.integrity) === null || _this$integrity2 === void 0 ? void 0 : _this$integrity2.checksum) || ''
    }, additionalData);
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
    console.error("Error adding chain of custody entry:", error);
    throw error;
  }
};
ReportSchema.methods.generateComprehensiveSummary = function () {
  try {
    var _stats$riskDistributi, _stats$riskDistributi2, _stats$riskDistributi3, _stats$authenticitySc, _stats$flagsAnalysis, _stats$detectionStats, _stats$detectionStats2, _stats$detectionStats3, _stats$detectionStats4, _stats$detectionStats5, _stats$flagsAnalysis2, _stats$flagsAnalysis3, _stats$flagsAnalysis4, _this$chainOfCustody2, _this$integrity3;
    if (!this.statistics) {
      throw new Error('Cannot generate summary without statistics');
    }
    var stats = this.statistics;
    var totalImages = stats.totalImages || 0;

    // Calculer risque global avec logique forensique
    var overallRisk = 'minimal';
    var confidence = 'medium';
    var highRiskCount = (((_stats$riskDistributi = stats.riskDistribution) === null || _stats$riskDistributi === void 0 ? void 0 : _stats$riskDistributi.fake) || 0) + (((_stats$riskDistributi2 = stats.riskDistribution) === null || _stats$riskDistributi2 === void 0 ? void 0 : _stats$riskDistributi2.likelyFake) || 0);
    var mediumRiskCount = ((_stats$riskDistributi3 = stats.riskDistribution) === null || _stats$riskDistributi3 === void 0 ? void 0 : _stats$riskDistributi3.uncertain) || 0;
    var avgScore = ((_stats$authenticitySc = stats.authenticityScores) === null || _stats$authenticitySc === void 0 ? void 0 : _stats$authenticitySc.average) || 0;
    var criticalFlags = ((_stats$flagsAnalysis = stats.flagsAnalysis) === null || _stats$flagsAnalysis === void 0 || (_stats$flagsAnalysis = _stats$flagsAnalysis.bySeverity) === null || _stats$flagsAnalysis === void 0 ? void 0 : _stats$flagsAnalysis.critical) || 0;

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
    var keyFindings = [];
    keyFindings.push("".concat(totalImages, " image(s) soumise(s) \xE0 l'analyse forensique"));
    keyFindings.push("".concat(stats.analyzedImages || 0, " image(s) analys\xE9e(s) avec succ\xE8s"));
    if (avgScore > 0) {
      keyFindings.push("Score moyen d'authenticit\xE9: ".concat(Math.round(avgScore), "%"));
    }
    if (highRiskCount > 0) {
      keyFindings.push("\u26A0\uFE0F ".concat(highRiskCount, " image(s) class\xE9e(s) \xE0 haut risque"));
    }
    if (((_stats$detectionStats = stats.detectionStats) === null || _stats$detectionStats === void 0 || (_stats$detectionStats = _stats$detectionStats.aiGenerated) === null || _stats$detectionStats === void 0 ? void 0 : _stats$detectionStats.count) > 0) {
      keyFindings.push("\uD83E\uDD16 ".concat(stats.detectionStats.aiGenerated.count, " image(s) potentiellement g\xE9n\xE9r\xE9e(s) par IA"));
    }
    if (((_stats$detectionStats2 = stats.detectionStats) === null || _stats$detectionStats2 === void 0 || (_stats$detectionStats2 = _stats$detectionStats2.manipulationDetected) === null || _stats$detectionStats2 === void 0 ? void 0 : _stats$detectionStats2.count) > 0) {
      keyFindings.push("\u2702\uFE0F ".concat(stats.detectionStats.manipulationDetected.count, " image(s) avec manipulation d\xE9tect\xE9e"));
    }
    if (criticalFlags > 0) {
      keyFindings.push("\uD83D\uDEA8 ".concat(criticalFlags, " alerte(s) critique(s) lev\xE9e(s)"));
    }

    // Identifier issues critiques
    var criticalIssues = [];
    if (((_stats$detectionStats3 = stats.detectionStats) === null || _stats$detectionStats3 === void 0 || (_stats$detectionStats3 = _stats$detectionStats3.aiGenerated) === null || _stats$detectionStats3 === void 0 ? void 0 : _stats$detectionStats3.count) > 0) {
      criticalIssues.push({
        issue: 'Contenu potentiellement généré par Intelligence Artificielle',
        severity: 'critical',
        affectedImages: stats.detectionStats.aiGenerated.count,
        recommendation: 'Expertise forensique spécialisée en détection IA obligatoire',
        urgency: 'immediate'
      });
    }
    if (((_stats$detectionStats4 = stats.detectionStats) === null || _stats$detectionStats4 === void 0 || (_stats$detectionStats4 = _stats$detectionStats4.manipulationDetected) === null || _stats$detectionStats4 === void 0 ? void 0 : _stats$detectionStats4.count) > 0) {
      criticalIssues.push({
        issue: 'Manipulation numérique détectée sur images',
        severity: 'high',
        affectedImages: stats.detectionStats.manipulationDetected.count,
        recommendation: 'Analyse technique approfondie et validation experte requises',
        urgency: 'high'
      });
    }
    if (((_stats$detectionStats5 = stats.detectionStats) === null || _stats$detectionStats5 === void 0 || (_stats$detectionStats5 = _stats$detectionStats5.metadataAnalysis) === null || _stats$detectionStats5 === void 0 ? void 0 : _stats$detectionStats5.missing) > totalImages * 0.7) {
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
        info: ((_stats$flagsAnalysis2 = stats.flagsAnalysis) === null || _stats$flagsAnalysis2 === void 0 || (_stats$flagsAnalysis2 = _stats$flagsAnalysis2.bySeverity) === null || _stats$flagsAnalysis2 === void 0 ? void 0 : _stats$flagsAnalysis2.info) || 0,
        warning: ((_stats$flagsAnalysis3 = stats.flagsAnalysis) === null || _stats$flagsAnalysis3 === void 0 || (_stats$flagsAnalysis3 = _stats$flagsAnalysis3.bySeverity) === null || _stats$flagsAnalysis3 === void 0 ? void 0 : _stats$flagsAnalysis3.warning) || 0,
        critical: ((_stats$flagsAnalysis4 = stats.flagsAnalysis) === null || _stats$flagsAnalysis4 === void 0 || (_stats$flagsAnalysis4 = _stats$flagsAnalysis4.bySeverity) === null || _stats$flagsAnalysis4 === void 0 ? void 0 : _stats$flagsAnalysis4.critical) || 0
      },
      complianceStatus: {
        forensicStandards: ((_this$chainOfCustody2 = this.chainOfCustody) === null || _this$chainOfCustody2 === void 0 || (_this$chainOfCustody2 = _this$chainOfCustody2.entries) === null || _this$chainOfCustody2 === void 0 ? void 0 : _this$chainOfCustody2.length) > 0,
        legalRequirements: ((_this$integrity3 = this.integrity) === null || _this$integrity3 === void 0 ? void 0 : _this$integrity3.verified) || false,
        qualityAssurance: criticalIssues.length === 0
      }
    };

    // Générer recommandations
    this.generateDetailedRecommendations(overallRisk, criticalIssues);
    console.log("\uD83D\uDCCB Summary generated for report ".concat(this.reportId, ": ").concat(overallRisk, " risk level"));
    return this.save();
  } catch (error) {
    console.error("Error generating summary for report ".concat(this.reportId, ":"), error);
    this.addIssue('error', "Failed to generate summary: ".concat(error.message), 'summary_generator');
    throw error;
  }
};
ReportSchema.methods.generateDetailedRecommendations = function (overallRisk, criticalIssues) {
  try {
    var overallRecommendation = 'ACCEPT_ALL';
    var urgencyLevel = 'low';
    var confidenceLevel = 'high';

    // Déterminer recommandation globale
    switch (overallRisk) {
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
    var specificRecommendations = [];
    var riskMitigation = [];
    var nextSteps = [];

    // Recommandations basées sur les issues
    criticalIssues.forEach(function (issue) {
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
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        // 24h
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
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
        // 48h
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
    console.error("Error generating recommendations:", error);
    throw error;
  }
};

// =====================================
// MÉTHODES STATIQUES ÉTENDUES
// =====================================

ReportSchema.statics.findBySession = function (sessionId) {
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  return this.find({
    sessionId: sessionId
  }).sort({
    createdAt: -1
  }).limit(limit).populate('images', 'originalName status authenticityScore riskClassification').populate('primaryImage', 'originalName status authenticityScore riskClassification').lean();
};
ReportSchema.statics.findExpired = function () {
  return this.find({
    'access.expiresAt': {
      $lt: new Date()
    },
    category: {
      $nin: ['legal', 'audit']
    } // Exclure ceux qui ne doivent jamais expirer
  });
};
ReportSchema.statics.findByRiskLevel = function (riskLevel) {
  return this.find({
    'executiveSummary.overallRisk': riskLevel
  }).sort({
    generatedAt: -1
  });
};
ReportSchema.statics.findCriticalReports = function () {
  return this.find({
    $or: [{
      'executiveSummary.overallRisk': 'critical'
    }, {
      'recommendations.urgencyLevel': 'critical'
    }, {
      'issues.level': 'critical',
      'issues.resolved': false
    }]
  }).sort({
    generatedAt: -1
  });
};
ReportSchema.statics.getStatsByPeriod = function () {
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
      totalReports: {
        $sum: 1
      },
      completedReports: {
        $sum: {
          $cond: [{
            $eq: ['$status', 'completed']
          }, 1, 0]
        }
      },
      averageProcessingTime: {
        $avg: '$generation.processingTime'
      },
      totalDownloads: {
        $sum: '$access.downloadCount'
      },
      riskDistribution: {
        $push: '$executiveSummary.overallRisk'
      },
      formatDistribution: {
        $push: '$formats.type'
      },
      categoryDistribution: {
        $push: '$category'
      }
    }
  }]);
};
ReportSchema.statics.cleanupExpired = function () {
  return this.deleteMany({
    'access.expiresAt': {
      $lt: new Date()
    },
    category: {
      $nin: ['legal', 'audit']
    }
  });
};

// =====================================
// MIDDLEWARE ROBUSTE
// =====================================

// Pre-save validation complète
ReportSchema.pre('save', function (next) {
  try {
    var _this$reportPeriod3, _this$reportPeriod4;
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
    if ((_this$reportPeriod3 = this.reportPeriod) !== null && _this$reportPeriod3 !== void 0 && _this$reportPeriod3.startDate && (_this$reportPeriod4 = this.reportPeriod) !== null && _this$reportPeriod4 !== void 0 && _this$reportPeriod4.endDate) {
      if (this.reportPeriod.startDate > this.reportPeriod.endDate) {
        return next(new Error('La date de début doit être antérieure à la date de fin'));
      }
    }

    // Validation formats générés
    if (this.status === 'completed') {
      var hasValidFormat = this.formats.some(function (format) {
        return format.generated && format.filepath;
      });
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
      console.warn("Report ".concat(this.reportId, ": Top secret classification with non-legal category"));
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Post-save logging sécurisé
ReportSchema.post('save', function (doc) {
  var _doc$executiveSummary;
  var sensitiveFields = ['generation.requestedBy.ip', 'access.accessLog'];
  var logDoc = _objectSpread({}, doc.toObject());

  // Masquer champs sensibles dans les logs
  sensitiveFields.forEach(function (field) {
    if (field.includes('.')) {
      var _field$split = field.split('.'),
        _field$split2 = _slicedToArray(_field$split, 2),
        parent = _field$split2[0],
        child = _field$split2[1];
      if (logDoc[parent] && logDoc[parent][child]) {
        logDoc[parent][child] = '[REDACTED]';
      }
    }
  });
  console.log("\uD83D\uDCCA Rapport sauvegard\xE9: ".concat(doc.reportId, " - Type: ").concat(doc.reportType, " - Status: ").concat(doc.status, " - Risk: ").concat(((_doc$executiveSummary = doc.executiveSummary) === null || _doc$executiveSummary === void 0 ? void 0 : _doc$executiveSummary.overallRisk) || 'unknown'));
});

// Pre-remove cleanup robuste
ReportSchema.pre(['deleteOne', 'findOneAndDelete'], function (next) {
  try {
    var fs = require('fs');
    // Note: Dans les middleware pre pour deleteOne, 'this' est la query, pas le document
    // Il faut récupérer le document d'abord

    this.model.findOne(this.getQuery()).then(function (doc) {
      if (!doc) return next();

      // Supprimer fichiers physiques
      if (doc.formats && doc.formats.length > 0) {
        doc.formats.forEach(function (format) {
          if (format.filepath && fs.existsSync(format.filepath)) {
            try {
              fs.unlinkSync(format.filepath);
              console.log("\uD83D\uDDD1\uFE0F Fichier supprim\xE9: ".concat(format.filepath));
            } catch (error) {
              console.error("\u274C Erreur suppression fichier ".concat(format.filepath, ":"), error);
            }
          }
        });
      }

      // Log de suppression
      console.log("\uD83D\uDDD1\uFE0F Rapport supprim\xE9: ".concat(doc.reportId));
      next();
    })["catch"](next);
  } catch (error) {
    next(error);
  }
});

// Post-remove cleanup
ReportSchema.post(['deleteOne', 'findOneAndDelete'], function (doc) {
  if (doc) {
    console.log("\u2705 Nettoyage termin\xE9 pour rapport: ".concat(doc.reportId));
  }
});

// =====================================
// TRANSFORMATION JSON SÉCURISÉE
// =====================================

ReportSchema.set('toJSON', {
  transform: function transform(doc, ret) {
    var _doc$privacy, _doc$privacy2, _doc$privacy3, _doc$privacy4;
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
    if ((_doc$privacy = doc.privacy) !== null && _doc$privacy !== void 0 && _doc$privacy.anonymized || ((_doc$privacy2 = doc.privacy) === null || _doc$privacy2 === void 0 ? void 0 : _doc$privacy2.mode) === 'COMMERCIAL') {
      var _ret$generation, _ret$access, _ret$chainOfCustody;
      // Supprimer informations personnelles
      if ((_ret$generation = ret.generation) !== null && _ret$generation !== void 0 && _ret$generation.requestedBy) {
        delete ret.generation.requestedBy.ip;
        delete ret.generation.requestedBy.userAgent;
      }

      // Nettoyer logs d'accès
      if ((_ret$access = ret.access) !== null && _ret$access !== void 0 && _ret$access.accessLog) {
        ret.access.accessLog = ret.access.accessLog.map(function (log) {
          return {
            timestamp: log.timestamp,
            action: log.action,
            success: log.success
            // IP et userAgent supprimés
          };
        });
      }

      // Supprimer détails chaîne de custody sensibles
      if ((_ret$chainOfCustody = ret.chainOfCustody) !== null && _ret$chainOfCustody !== void 0 && _ret$chainOfCustody.entries) {
        ret.chainOfCustody.entries = ret.chainOfCustody.entries.map(function (entry) {
          var _entry$notes;
          return {
            timestamp: entry.timestamp,
            action: entry.action,
            notes: (_entry$notes = entry.notes) === null || _entry$notes === void 0 ? void 0 : _entry$notes.replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_REDACTED]')
          };
        });
      }
    }

    // Redaction complète pour niveau élevé
    if (((_doc$privacy3 = doc.privacy) === null || _doc$privacy3 === void 0 ? void 0 : _doc$privacy3.redactionLevel) === 'substantial' || ((_doc$privacy4 = doc.privacy) === null || _doc$privacy4 === void 0 ? void 0 : _doc$privacy4.redactionLevel) === 'complete') {
      var _ret$generation2, _ret$access2;
      (_ret$generation2 = ret.generation) === null || _ret$generation2 === void 0 || delete _ret$generation2.requestedBy;
      (_ret$access2 = ret.access) === null || _ret$access2 === void 0 || delete _ret$access2.accessLog;
      delete ret.customMetadata;
      if (doc.privacy.redactionLevel === 'complete') {
        var _ret$statistics, _ret$statistics2;
        delete ret.chainOfCustody;
        delete ret.issues;
        ret.statistics = {
          totalImages: ((_ret$statistics = ret.statistics) === null || _ret$statistics === void 0 ? void 0 : _ret$statistics.totalImages) || 0,
          analyzedImages: ((_ret$statistics2 = ret.statistics) === null || _ret$statistics2 === void 0 ? void 0 : _ret$statistics2.analyzedImages) || 0
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