"use strict";

// =====================================
// UTILITAIRES PARSING ENVIRONNEMENT
// =====================================

const parseNumber = (value, defaultValue) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === 'boolean') return value;
  return value.toLowerCase() === 'true';
};

const parseArray = (value, separator = ',', defaultValue = []) => {
  if (!value) return defaultValue;
  return value.split(separator).map(item => item.trim()).filter(Boolean);
};

const parseFileSize = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  
  const str = value.toString().toLowerCase();
  const match = str.match(/^(\d+(?:\.\d+)?)(mb|gb|kb|b)?$/);
  
  if (!match) return parseInt(value, 10) || 0;
  
  const size = parseFloat(match[1]);
  const unit = match[2] || 'b';
  
  switch (unit) {
    case 'gb': return Math.round(size * 1024 * 1024 * 1024);
    case 'mb': return Math.round(size * 1024 * 1024);
    case 'kb': return Math.round(size * 1024);
    default: return Math.round(size);
  }
};

// =====================================
// CONFIGURATION PRINCIPALE BA7ATH
// =====================================

const config = {
  // Configuration Serveur
  server: {
    port: parseNumber(process.env.PORT, 5000),
    environment: process.env.NODE_ENV || 'production',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    appUrl: process.env.APP_URL || 'http://localhost:5000',
    requestTimeout: parseNumber(process.env.REQUEST_TIMEOUT, 60000),
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  },

  // Configuration Base de Données
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ba7ath-forensic',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000
      }
    }
  },

  // Configuration JWT (Authentification)
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    emailSecret: process.env.JWT_EMAIL_SECRET,
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRES || '1h',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES || '7d',
    algorithm: 'HS256',
    issuer: 'ba7ath-forensic',
    audience: 'ba7ath-users'
  },

  // Configuration Redis (Cache & Sessions)
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseNumber(process.env.REDIS_PORT, 6379),
    password: process.env.REDIS_PASSWORD || null,
    db: parseNumber(process.env.REDIS_DB, 0),
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    ttl: {
      session: 86400, // 24h
      cache: 3600,    // 1h
      otp: parseNumber(process.env.OTP_TTL_MINUTES, 15) * 60,
      forensicCache: parseNumber(process.env.FORENSIC_CACHE_TTL, 7200)
    }
  },

  // Configuration Email (SMTP)
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseNumber(process.env.SMTP_PORT, 587),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    },
    from: process.env.SMTP_FROM || process.env.EMAIL_FROM || '"Ba7ath Forensic" <noreply@ba7ath.com>',
    testTo: process.env.SMTP_TEST_TO,
    templates: {
      verification: 'email-verification',
      passwordReset: 'password-reset',
      welcome: 'welcome'
    }
  },

  // Configuration OTP & Email Verification
  otp: {
    ttlMinutes: parseNumber(process.env.OTP_TTL_MINUTES, 15),
    attemptsLimit: parseNumber(process.env.OTP_ATTEMPTS_LIMIT, 5),
    length: 6,
    onlyDigits: true
  },

  // Configuration Rate Limiting
  rateLimit: {
    window: parseNumber(process.env.RATE_LIMIT_WINDOW, 15), // minutes
    maxRequests: parseNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
    email: {
      ipPerMinute: parseNumber(process.env.RATE_LIMIT_EMAIL_IP_PER_MIN, 2),
      perHour: parseNumber(process.env.RATE_LIMIT_EMAIL_PER_HOUR, 3)
    },
    skipSuccessfulRequests: false,
    standardHeaders: true,
    legacyHeaders: false
  },

  // Configuration Upload & Files
  upload: {
    maxFileSize: parseFileSize(process.env.MAX_FILE_SIZE || '500mb'),
    multerFileSize: parseNumber(process.env.MULTER_FILE_SIZE, 524288000),
    maxFilesPerRequest: parseNumber(process.env.MAX_FILES_PER_REQUEST, 10),
    allowedFormats: parseArray(process.env.ALLOWED_FORMATS, ',', [
      'jpg', 'jpeg', 'png', 'tiff', 'tif', 'webp', 'raw', 
      'dng', 'cr2', 'nef', 'arw', 'orf', 'bmp', 'gif'
    ]),
    directories: {
      temp: process.env.UPLOAD_TEMP_DIR || './uploads/temp',
      processed: process.env.UPLOAD_PROCESSED_DIR || './uploads/processed',
      quarantine: process.env.UPLOAD_QUARANTINE_DIR || './uploads/quarantine'
    },
    limits: {
      bodyParser: process.env.BODY_PARSER_LIMIT || '500mb',
      json: process.env.EXPRESS_JSON_LIMIT || '500mb',
      urlencoded: process.env.EXPRESS_URLENCODED_LIMIT || '500mb'
    }
  },

  // Configuration Analyse Forensique
  forensic: {
    cacheTTL: parseNumber(process.env.FORENSIC_CACHE_TTL, 7200),
    maxAnalysisTime: parseNumber(process.env.MAX_ANALYSIS_TIME, 300000),
    aiDetectionEnabled: parseBoolean(process.env.AI_DETECTION_ENABLED, true),
    heavyAnalysisEnabled: parseBoolean(process.env.HEAVY_ANALYSIS_ENABLED, true),
    validationRequired: parseBoolean(process.env.FORENSIC_VALIDATION_REQUIRED, false),
    algorithms: {
      ela: true,           // Error Level Analysis
      noise: true,         // Noise Analysis
      metadata: true,      // Metadata Analysis
      copyMove: true,      // Copy-Move Detection
      splicing: true,      // Splicing Detection
      resampling: true     // Resampling Detection
    },
    thresholds: {
      suspicionLevel: 0.7,
      confidenceLevel: 0.8,
      minimumScore: 0.5
    }
  },

  // Configuration Sécurité
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'ba7ath-session-secret-ultra-secure-2025',
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutTime: 15 * 60 * 1000, // 15 minutes
    sessionCleanupInterval: parseNumber(process.env.SESSION_CLEANUP_INTERVAL, 3600000),
    tokenValidation: {
      checkRevoked: true,
      checkExpiry: true,
      checkIssuer: true
    },
    headers: {
      contentTypeOptions: 'nosniff',
      frameOptions: 'DENY',
      xssProtection: '1; mode=block'
    }
  },

  // Configuration API
  api: {
    version: process.env.API_VERSION || '3.0.0',
    prefix: process.env.API_PREFIX || '/api',
    documentation: {
      enabled: !parseBoolean(process.env.NODE_ENV === 'production'),
      path: '/api-docs'
    }
  },

  // Configuration Logging & Debug
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'combined',
    enableColors: process.env.NODE_ENV !== 'production',
    enableTimestamp: true
  },

  // Configuration Debug (Développement uniquement)
  debug: {
    routes: parseBoolean(process.env.DEBUG_ROUTES, false),
    uploads: parseBoolean(process.env.DEBUG_UPLOADS, true),
    auth: parseBoolean(process.env.DEBUG_AUTH, true),
    validation: parseBoolean(process.env.DEBUG_VALIDATION, false),
    enableDevRoutes: process.env.NODE_ENV !== 'production'
  }
};

// =====================================
// VALIDATION VARIABLES CRITIQUES
// =====================================

if (process.env.NODE_ENV === 'production') {
  const requiredVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET', 
    'JWT_EMAIL_SECRET',
    'MONGODB_URI',
    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'SESSION_SECRET'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Variables d\'environnement critiques manquantes:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.log('💡 Veuillez configurer ces variables dans votre fichier .env');
    process.exit(1);
  }

  // Validation longueur secrets
  const secrets = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'JWT_EMAIL_SECRET'];
  secrets.forEach(secret => {
    if (process.env[secret] && process.env[secret].length < 32) {
      console.warn(`⚠️ ${secret} devrait faire au moins 32 caractères pour une sécurité optimale`);
    }
  });

  console.log('✅ Toutes les variables critiques sont configurées');
}

// =====================================
// VALIDATION CONFIGURATION
// =====================================

// Validation tailles upload cohérentes
const maxSize = config.upload.maxFileSize;
const multerSize = config.upload.multerFileSize;

if (multerSize && multerSize < maxSize) {
  console.warn(`⚠️ MULTER_FILE_SIZE (${multerSize}) < MAX_FILE_SIZE (${maxSize}). Ajustement automatique.`);
  config.upload.multerFileSize = maxSize;
}

// Validation formats autorisés
if (config.upload.allowedFormats.length === 0) {
  console.warn('⚠️ Aucun format d\'image autorisé. Utilisation des formats par défaut.');
  config.upload.allowedFormats = ['jpg', 'jpeg', 'png', 'tiff', 'webp'];
}

// =====================================
// EXPORT CONFIGURATION
// =====================================

module.exports = config;

// =====================================
// LOG INITIALISATION (MODE DEBUG)
// =====================================

if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  console.log('🔧 Configuration Ba7ath Forensic chargée:');
  console.log(`   📡 Serveur: ${config.server.environment} sur port ${config.server.port}`);
  console.log(`   🔐 JWT: secrets configurés (${config.jwt.accessTokenExpiry})`);
  console.log(`   📧 Email: ${config.email.smtp.host}:${config.email.smtp.port}`);
  console.log(`   💾 Redis: ${config.redis.host}:${config.redis.port}`);
  console.log(`   📁 Upload max: ${Math.round(config.upload.maxFileSize / 1024 / 1024)}MB`);
  console.log(`   🔍 Forensic: ${config.forensic.aiDetectionEnabled ? 'AI activé' : 'AI désactivé'}`);
}
