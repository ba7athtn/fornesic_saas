require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const timeout = require('connect-timeout');

const app = express();

// ✅ Configuration mongoose AVANT toute connexion (FIX MongoDB)
mongoose.set('bufferCommands', false);

// =====================================
// CONFIGURATION AVANCÉE ET SÉCURISÉE
// =====================================

// ✅ Variables d'environnement avec fallbacks sécurisés
const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ba7ath-forensic',
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  maxFileSize: process.env.MAX_FILE_SIZE || '500mb',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // ✅ NOUVEAU - Configuration Python Bridge 
  python: {
    executable: process.env.PYTHON_PATH || 'python',
    scriptsPath: path.join(__dirname, 'src'),
    timeout: parseInt(process.env.PYTHON_TIMEOUT) || 300000, // 5 minutes
    maxConcurrent: parseInt(process.env.PYTHON_MAX_CONCURRENT) || 5,
    venvPath: process.env.PYTHON_VENV || path.join(__dirname, '..', '.venv')
  }
};

// ✅ OPTIMISATION - Rate limiting hiérarchique et intelligent (CORRIGÉ)
const createRateLimit = (windowMs, max, message, skipCondition = null) => rateLimit({
  windowMs,
  max,
  message: {
    error: message,
    retryAfter: Math.ceil(windowMs / 1000),
    timestamp: new Date().toISOString()
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (req.path === '/api/health') return true;
    if (skipCondition) return skipCondition(req);
    return false;
  },
  validate: {
    keyGeneratorIpFallback: false
  }
});

// ✅ Rate limiters spécialisés par endpoint
const globalLimiter = createRateLimit(
  config.rateLimitWindow * 60 * 1000,
  config.rateLimitMax,
  'Trop de requêtes générales depuis cette IP'
);

const uploadLimiter = createRateLimit(
  60 * 60 * 1000, // 1 heure
  50, // 50 uploads par heure
  'Limite d\'upload atteinte'
);

const analysisLimiter = createRateLimit(
  60 * 60 * 1000, // 1 heure
  30, // 30 analyses par heure
  'Limite d\'analyse atteinte'
);

const reportLimiter = createRateLimit(
  60 * 60 * 1000, // 1 heure
  20, // 20 rapports par heure
  'Limite de génération de rapports atteinte'
);

// ✅ OPTIMISATION - Création sécurisée des dossiers avec permissions
const createDirectories = () => {
  const dirs = [
    { path: './uploads', mode: 0o755 },
    { path: './uploads/temp', mode: 0o755 },
    { path: './uploads/processed', mode: 0o755 },
    { path: './uploads/thumbnails', mode: 0o755 },
    { path: './uploads/reports', mode: 0o755 },
    { path: './uploads/exports', mode: 0o755 },
    { path: './logs', mode: 0o755 },
    { path: './backups', mode: 0o700 }, // Plus restrictif pour les backups
    { path: './services', mode: 0o755 } // ✅ NOUVEAU - Pour les services Python Bridge
  ];

  dirs.forEach(({ path: dirPath, mode }) => {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true, mode });
        console.log(`📁 Dossier sécurisé créé: ${dirPath}`);
      }
    } catch (error) {
      console.error(`❌ Erreur création dossier ${dirPath}:`, error.message);
      if (config.nodeEnv === 'production') {
        process.exit(1);
      }
    }
  });
};

createDirectories();

// ✅ SÉCURITÉ RENFORCÉE - Validation environnement critique
const requiredEnvVars = ['MONGODB_URI'];
const productionEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'FRONTEND_URL'];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (config.nodeEnv === 'production') {
  const missingProdVars = productionEnvVars.filter(varName =>
    !process.env[varName] || process.env[varName] === 'fallback-secret-change-in-production'
  );

  if (missingProdVars.length > 0) {
    console.error('❌ Variables d\'environnement production manquantes:', missingProdVars.join(', '));
    process.exit(1);
  }
}

if (missingEnvVars.length > 0) {
  console.error('❌ Variables d\'environnement critiques manquantes:', missingEnvVars.join(', '));
  console.error('💡 Créez un fichier .env avec les variables requises');
  if (config.nodeEnv === 'production') {
    process.exit(1);
  }
} else {
  // ✅ VÉRIFICATION JWT SECRETS
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'fallback-secret-change-in-production') {
    console.error('❌ Variables JWT manquantes: JWT_SECRET');
    process.exit(1);
  }

  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET === 'fallback-refresh-secret-change-in-production') {
    console.error('❌ Variables JWT manquantes: JWT_REFRESH_SECRET');
    process.exit(1);
  }

  console.log('✅ Variables JWT configurées correctement');
}

// =====================================
// MIDDLEWARES OPTIMISÉS
// =====================================

// ✅ COMPRESSION pour améliorer les performances
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024
}));

// ✅ SÉCURITÉ AVANCÉE - Helmet avec configuration complète
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// ✅ AJOUT CRITIQUE - Timeout global de 60 secondes
app.use(timeout('60s'));

// ✅ Rate limiting global
app.use(globalLimiter);

// ✅ CORS avec configuration de sécurité avancée
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = config.nodeEnv === 'production'
      ? [config.frontendUrl]
      : [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3001'
        ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚨 Origine CORS refusée: ${origin}`);
      callback(new Error('Origine non autorisée par CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-source',
    'x-session-id',
    'x-request-id',
    'x-privacy-mode'
  ],
  exposedHeaders: [
    'x-total-count',
    'x-rate-limit-remaining',
    'x-response-time'
  ],
  maxAge: 86400
};

app.use(cors(corsOptions));

// ✅ LOGGING AVANCÉ avec rotation
const morganFormat = config.nodeEnv === 'production'
  ? 'combined'
  : ':method :url :status :res[content-length] - :response-time ms :remote-addr';

// ✅ AJOUT - Middleware de timing des requêtes
app.use((req, res, next) => {
  req.startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    if (duration > 5000) {
      console.warn(`🐌 Requête lente: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
});

app.use(morgan(morganFormat, {
  skip: (req, res) => {
    return config.nodeEnv === 'production' && req.path === '/api/health';
  }
}));

// ✅ MIDDLEWARE pour gérer les timeouts
app.use((req, res, next) => {
  if (!req.timedout) {
    next();
  }
});

// ✅ PARSING SÉCURISÉ avec validation améliorée - LIMITES ÉLEVÉES
app.use(express.json({
  limit: process.env.EXPRESS_JSON_LIMIT || '500mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        error: 'JSON invalide',
        details: 'Le contenu JSON est malformé'
      });
      return;
    }
  }
}));

app.use(express.urlencoded({
  limit: process.env.EXPRESS_URLENCODED_LIMIT || '500mb',
  extended: true,
  parameterLimit: 50000
}));

// ✅ AJOUT CRITIQUE - Raw body parser pour gros uploads
app.use(express.raw({ limit: '500mb', type: ['application/octet-stream'] }));

// ✅ AJOUT - Headers de sécurité personnalisés
app.use((req, res, next) => {
  res.setHeader('X-API-Version', '3.0.0');
  res.setHeader('X-Powered-By-Ba7ath', 'Forensic-API');
  res.removeHeader('X-Powered-By');

  req.requestId = require('crypto').randomBytes(8).toString('hex');
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// =====================================
// ✅ NOUVEAU - PYTHON BRIDGE INTEGRATION
// =====================================

// --- PythonBridge (tolérant et compatible export) ---
let pythonBridge = null;

try {
  // Essayer src/services puis services pour couvrir les deux arborescences
  let mod = null;
  try {
    mod = require('./src/services/pythonBridge');
  } catch (e1) {
    mod = require('./services/pythonBridge');
  }

  // Le module exporte { PythonBridge, bridge, ... } (CommonJS)
  const { PythonBridge, bridge: pythonBridgeSingleton } = mod || {};

  // Utiliser le singleton exporté si présent, sinon instancier la classe avec la config déjà définie
  const pyCfg = config?.python || {};
  pythonBridge = pythonBridgeSingleton || (PythonBridge ? new PythonBridge({ python: pyCfg }) : null);

  if (pythonBridge) {
    console.log('🔬 ForensicAnalyzer initialisé v3.0.0-service');
    console.log('📸 ImageProcessor initialisé v3.0.0-service');
    console.log('🐍 PythonBridge initialisé v3.0.0-service');
  } else {
    console.warn('🔕 PythonBridge indisponible (aucun export utilisable)');
  }
} catch (error) {
  console.warn('🔕 PythonBridge désactivé (dev/local):', error.message);
  pythonBridge = null;
}

// Test de connectivité non bloquant (n'empêche pas le démarrage)
if (pythonBridge) {
  (async () => {
    try {
      if (typeof pythonBridge.testConnectivity === 'function') {
        const test = await pythonBridge.testConnectivity();
        if (test?.success) console.log('✅ Python Bridge opérationnel');
        else console.warn('⚠️ Python Bridge partiellement disponible');
      } else if (typeof pythonBridge.executeScript === 'function') {
        console.log('🐍 Test connectivité Python...');
        const testResult = await pythonBridge.executeScript('test_forensic_simple.py', { test: 'connectivity' }, { timeout: 10000 });
        if (testResult?.success) console.log('✅ Python Bridge opérationnel');
        else console.warn('⚠️ Python Bridge partiellement disponible');
      } else {
        console.warn('ℹ️ PythonBridge sans méthode de test disponible');
      }
    } catch (error) {
      console.warn('⚠️ Python Bridge non disponible:', error.message);
      console.log('💡 L\'API fonctionnera sans les analyses Python');
    }
  })();
}

// Middleware pour injecter le bridge dans les requests
app.use((req, res, next) => {
  req.pythonBridge = pythonBridge || null;
  next();
});

// ✅ OPTIMISATION - Static files avec cache intelligent
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: config.nodeEnv === 'production' ? '7d' : '1h',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.includes('/processed/') || filePath.includes('/thumbnails/')) {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
  }
}));

// ✅ HEALTH CHECK AVANCÉ avec métriques détaillées et Python Bridge
app.get('/api/health', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    version: '3.0.0-forensic',
    environment: config.nodeEnv,
    services: {
      mongodb: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host || 'localhost',
        database: mongoose.connection.name || 'ba7ath-forensic'
      },
      python: {
        status: pythonBridge ? 'available' : 'unavailable',
        bridge: pythonBridge ? pythonBridge.getStatus?.() : null,
        executable: config.python.executable,
        scriptsPath: config.python.scriptsPath
      },
      filesystem: {
        uploadsWritable: fs.existsSync('./uploads') &&
          (() => {
            try {
              fs.accessSync('./uploads', fs.constants.W_OK);
              return true;
            } catch {
              return false;
            }
          })()
      }
    },
    system: {
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
      },
      cpu: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version
      }
    },
    rateLimiting: {
      enabled: true,
      global: {
        windowMs: config.rateLimitWindow * 60 * 1000,
        maxRequests: config.rateLimitMax
      },
      specialized: {
        upload: { windowMs: 3600000, max: 50 },
        analysis: { windowMs: 3600000, max: 30 },
        reports: { windowMs: 3600000, max: 20 }
      }
    },
    endpoints: {
      auth: '/api/auth',
      images: '/api/images',
      analysis: '/api/analysis',
      reports: '/api/reports',
      forensic: '/api/forensic' // ✅ NOUVEAU
    }
  };

  const overallHealth = healthCheck.services.mongodb.status === 'connected' &&
                        healthCheck.services.filesystem.uploadsWritable;

  res.status(overallHealth ? 200 : 503).json(healthCheck);
});

// ✅ AJOUT - Endpoint de métriques (pour monitoring)
app.get('/api/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    platform: process.platform,
    mongodb: mongoose.connection.readyState === 1 ? {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      collections: mongoose.connection.collections ?
        Object.keys(mongoose.connection.collections).length : 0
    } : null,
    python: pythonBridge ? (pythonBridge.getStatus?.() || { status: 'unknown' }) : { status: 'unavailable' } // ✅ NOUVEAU
  };

  res.json(metrics);
});

// =====================================
// ROUTES AVEC RATE LIMITING SPÉCIALISÉ - MIS À JOUR
// =====================================

let imageRoutes, analysisRoutes, reportRoutes, authRoutes;

try {
  imageRoutes = require('./src/routes/images');
  console.log('✅ Routes images chargées');
} catch (error) {
  console.error('❌ Erreur import routes images:', error.message);
  imageRoutes = null;
}

try {
  analysisRoutes = require('./src/routes/analysis');
  console.log('✅ Routes analysis chargées');
} catch (error) {
  console.warn('⚠️ Routes analysis non disponibles:', error.message);
  analysisRoutes = null;
}

try {
  reportRoutes = require('./src/routes/reports');
  console.log('✅ Routes reports chargées');
} catch (error) {
  console.warn('⚠️ Routes reports non disponibles:', error.message);
  reportRoutes = null;
}

// ✅ AJOUT - Routes d'authentification
try {
  authRoutes = require('./src/routes/auth');
  console.log('✅ Routes auth chargées');
} catch (error) {
  console.error('❌ Erreur import routes auth:', error.message);
  authRoutes = null;
}

// ✅ NOUVEAU - Routes forensiques avec Python Bridge
try {
  const forensicRoutes = require('./src/routes/forensic');
  app.use('/api/forensic', analysisLimiter, forensicRoutes);
  console.log('✅ Routes forensic (Python Bridge) chargées');
} catch (error) {
  console.warn('⚠️ Routes forensic non disponibles:', error.message);
}

// Montage des routes
if (authRoutes) {
  app.use('/api/auth', authRoutes);
}

if (imageRoutes) {
  app.use('/api/images', uploadLimiter, imageRoutes);
}

if (analysisRoutes) {
  app.use('/api/analysis', analysisLimiter, analysisRoutes);
}

if (reportRoutes) {
  app.use('/api/reports', reportLimiter, reportRoutes);
}

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API Ba7ath Forensic fonctionnelle',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    version: '3.0.0-forensic',
    pythonBridge: pythonBridge ? 'available' : 'unavailable' // ✅ NOUVEAU
  });
});

// ✅ ORDRE CORRECT - Express Middleware Chain

// 1. D'ABORD : Route catch-all 404 (AVANT la gestion d'erreurs)
app.use('/*path', (req, res) => {
  res.status(404).json({
    error: 'Endpoint non trouvé',
    path: req.originalUrl,
    method: req.method,
    message: 'Cet endpoint n\'existe pas dans l\'API Ba7ath',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/metrics',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/images/upload',
      'POST /api/analysis/:imageId',
      'GET /api/reports/:imageId',
      'POST /api/forensic/analyze-image',
      'POST /api/forensic/validate',
      'POST /api/forensic/generate-report',
      'GET /api/forensic/python-status'
    ],
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
});

// 2. ENSUITE : Middleware de gestion d'erreurs (APRÈS toutes les routes)
app.use((err, req, res, next) => {
  if (req.timedout) {
    return res.status(408).json({
      error: 'Délai d\'attente dépassé',
      details: 'La requête a pris trop de temps à traiter (>60s)',
      timeout: '60s',
      requestId: req.requestId,
      type: 'REQUEST_TIMEOUT',
      timestamp: new Date().toISOString()
    });
  }

  const errorContext = {
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: {
      name: err.name,
      message: err.message,
      status: err.status || 500,
      code: err.code
    }
  };

  console.error('❌ Erreur interceptée:', errorContext);

  if (config.nodeEnv === 'development') {
    console.error('Stack:', err.stack);
  }

  // Gestion spécialisée des erreurs
  if (err.status === 429 || err.code === 'RATE_LIMITED') {
    return res.status(429).json({
      error: 'Limite de taux dépassée',
      details: 'Trop de requêtes depuis votre adresse IP',
      retryAfter: Math.ceil((config.rateLimitWindow * 60)),
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Fichier trop volumineux',
      maxSize: config.maxFileSize,
      requestId: req.requestId
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      error: 'Trop de fichiers',
      details: 'Nombre maximum de fichiers dépassé',
      requestId: req.requestId
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Données invalides',
      details: err.message,
      requestId: req.requestId
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Identifiant invalide',
      details: 'L\'ID fourni n\'est pas un ObjectId MongoDB valide',
      requestId: req.requestId
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {});
    return res.status(409).json({
      error: 'Ressource en conflit',
      details: field ? `${field} existe déjà` : 'Cette ressource existe déjà',
      requestId: req.requestId
    });
  }

  if (err.message?.includes?.('CORS')) {
    return res.status(403).json({
      error: 'Origine non autorisée',
      details: 'Votre domaine n\'est pas autorisé à accéder à cette API',
      requestId: req.requestId
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON malformé',
      details: 'Le contenu de la requête n\'est pas du JSON valide',
      requestId: req.requestId
    });
  }

  const responseError = {
    error: config.nodeEnv === 'development'
      ? err.message
      : 'Erreur interne du serveur',
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  };

  if (config.nodeEnv === 'development') {
    responseError.details = {
      name: err.name,
      code: err.code,
      status: err.status
    };
  }

  res.status(err.status || 500).json(responseError);
});
// =====================================
// CONNEXION MONGODB ROBUSTE CORRIGÉE
// =====================================

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const mongoOptions = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxIdleTimeMS: 30000,
        heartbeatFrequencyMS: 10000
      };

      const conn = await mongoose.connect(config.mongoUri, mongoOptions);

      console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
      console.log(`📊 Base de données: ${conn.connection.name}`);

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB déconnecté - tentative de reconnexion...');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnecté avec succès');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ Erreur MongoDB:', err);
      });

      return conn;

    } catch (error) {
      retries++;
      console.error(`❌ Tentative ${retries}/${maxRetries} - Erreur MongoDB:`, error.message);

      if (retries >= maxRetries) {
        if (config.nodeEnv === 'production') {
          console.error('🚨 Impossible de se connecter à MongoDB en production');
          process.exit(1);
        } else {
          console.warn('⚠️ Connexion MongoDB échouée, continuation en mode développement');
          return null;
        }
      }

      const delay = Math.min(1000 * Math.pow(2, retries), 30000);
      console.log(`⏳ Nouvelle tentative dans ${delay/1000}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// =====================================
// DÉMARRAGE SERVEUR OPTIMISÉ
// =====================================

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log('\n🚀 ========================================');
      console.log('🎯 SERVEUR BA7ATH FORENSIC DÉMARRÉ');
      console.log('🚀 ========================================');
      console.log(`✅ Serveur: http://localhost:${config.port}`);
      console.log(`🔍 Health: http://localhost:${config.port}/api/health`);
      console.log(`📊 Metrics: http://localhost:${config.port}/api/metrics`);
      console.log(`📁 Uploads: http://localhost:${config.port}/uploads`);
      console.log(`🔐 Auth: http://localhost:${config.port}/api/auth`);
      console.log(`🐍 Forensic: http://localhost:${config.port}/api/forensic`); // ✅ NOUVEAU
      console.log(`🚀 Environment: ${config.nodeEnv}`);
      console.log(`💾 MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connecté' : '❌ Déconnecté'}`);
      console.log(`🐍 Python Bridge: ${pythonBridge ? '✅ Disponible' : '❌ Indisponible'}`); // ✅ NOUVEAU
      console.log(`🛡️ Rate Limiting: ${config.rateLimitMax} req/IP par ${config.rateLimitWindow} min`);
      console.log(`🔒 CORS: ${config.nodeEnv === 'production' ? 'Production' : 'Développement'}`);
      console.log(`📦 Compression: ✅ Activée`);
      console.log(`🛡️ Helmet: ✅ Configuré`);
      console.log(`⏰ Timeout: ✅ 60 secondes`);
      console.log(`📊 Limites Upload: ✅ 500MB`);
      console.log('========================================\n');
    });

    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    server.on('error', (error) => {
      console.error('❌ Erreur serveur critique:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`🚨 Port ${config.port} déjà utilisé`);
        console.error('💡 Solutions:');
        console.error(' 1. Tuez le processus utilisant ce port');
        console.error(' 2. Changez la variable PORT dans .env');
        console.error(` 3. Utilisez: lsof -ti:${config.port} | xargs kill`);
      }
      process.exit(1);
    });

    let connections = new Set();
    server.on('connection', (connection) => {
      connections.add(connection);
      connection.on('close', () => {
        connections.delete(connection);
      });
    });

    server.connections = connections;
    return server;

  } catch (error) {
    console.error('❌ Erreur critique démarrage serveur:', error);
    process.exit(1);
  }
};

// =====================================
// GESTION FERMETURE PROPRE AVANCÉE
// =====================================

let isShuttingDown = false;
let server;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n⚠️ ${signal} reçu - Démarrage fermeture propre...`);

  const shutdownTimeout = setTimeout(() => {
    console.error('🚨 Timeout fermeture - Arrêt forcé');
    process.exit(1);
  }, 30000);

  try {
    console.log('📡 1/4 - Arrêt acceptation nouvelles requêtes...');
    if (server) {
      server.close();
    }

    console.log('🔌 2/4 - Fermeture connexions existantes...');
    if (server && server.connections) {
      server.connections.forEach(connection => {
        connection.destroy();
      });
    }

    console.log('💾 3/4 - Fermeture connexion MongoDB...');
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close(false);
      console.log('✅ MongoDB fermé proprement');
    }

    console.log('🧹 4/4 - Nettoyage ressources...');
    clearTimeout(shutdownTimeout);

    console.log('✅ Fermeture propre terminée');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur durant fermeture propre:', error);
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT (Ctrl+C)'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
  console.error('❌ EXCEPTION NON CAPTURÉE:', error);
  console.error('Stack:', error.stack);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ PROMESSE REJETÉE NON GÉRÉE:', reason);
  console.error('Promise:', promise);
  gracefulShutdown('unhandledRejection');
});

process.on('SIGUSR2', () => {
  console.log('📊 Signal SIGUSR2 reçu - Affichage métriques:');
  console.log('Memory:', process.memoryUsage());
  console.log('Uptime:', process.uptime());
  console.log('MongoDB:', mongoose.connection.readyState === 1 ? 'Connecté' : 'Déconnecté');
  console.log('Python Bridge:', pythonBridge ? 'Disponible' : 'Indisponible'); // ✅ NOUVEAU
});

// =====================================
// LANCEMENT APPLICATION
// =====================================

startServer()
  .then((serverInstance) => {
    server = serverInstance;
    console.log('🎉 Ba7ath Forensic API prêt pour l\'analyse d\'images !');
  })
  .catch((error) => {
    console.error('💥 Erreur fatale démarrage:', error);
    process.exit(1);
  });

module.exports = app;
