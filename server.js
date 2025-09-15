// server.js (corrigé, ordre de montage et guards 404/erreurs, logs de résolution des routes)
'use strict';

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
const crypto = require('crypto');
const OpenApiValidator = require('express-openapi-validator');

// Import config centralisée
const config = require('./config');

// Middlewares internes
const auth = require('./src/middleware/auth');
const activityTracker = require('./src/middleware/activity');

let PromClient = null;
try {
  PromClient = require('prom-client');
} catch {}

const app = express();

// =====================================
// 1) VALIDATIONS ENV CRITIQUES PROD
// =====================================
if (config.server.environment === 'production') {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v] || process.env[v].includes('fallback'));
  if (missingVars.length > 0) {
    console.error('❌ Variables d’environnement manquantes en production:', missingVars.join(', '));
    process.exit(1);
  }
}

// =====================================
// 2) DIRECTORIES
// =====================================
(function createDirectories() {
  const dirs = [
    config.upload.directories.temp,
    config.upload.directories.processed || './uploads/processed',
    config.upload.directories.quarantine,
    './uploads',
    './uploads/reports',
    './logs'
  ];
  dirs.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created: ${dir}`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${dir}:`, error.message);
      if (config.server.environment === 'production') process.exit(1);
    }
  });
})();

// =====================================
// 3) MIDDLEWARES GLOBAUX (ORDRE CRITIQUE)
// =====================================

// 3.1 Headers + requestId
app.use((req, res, next) => {
  res.setHeader('X-API-Version', config.api.version || '3.0.0');
  res.removeHeader('X-Powered-By');
  req.requestId = crypto.randomBytes(8).toString('hex');
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// 3.2 Compression
app.use(compression({
  level: 6,
  filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res)
}));

// 3.3 Sécurité
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true,
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// 3.4 CORS
const allowedOrigins = config.server.environment === 'production'
  ? [config.server.frontendUrl]
  : [config.server.frontendUrl, 'http://127.0.0.1:3000', 'http://localhost:3000', 'http://localhost:3001', `http://localhost:${config.server.port}`];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`🚨 CORS refusé: ${origin}`);
    return callback(new Error('Origine non autorisée'));
  },
  credentials: !!config.server.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  exposedHeaders: ['x-total-count', 'x-rate-limit-remaining'],
  maxAge: 86400,
  optionsSuccessStatus: 204
}));

// 3.5 Logging
const morganFormat = config.server.environment === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, {
  skip: (req) => req.path.startsWith('/api/health') || req.path === '/api/metrics'
}));

// 3.6 Rate limit global
app.use(rateLimit({
  windowMs: (config.rateLimit.window || 15) * 60 * 1000,
  max: config.rateLimit.maxRequests || 100,
  standardHeaders: config.rateLimit.standardHeaders !== false,
  legacyHeaders: config.rateLimit.legacyHeaders === true,
  skip: (req) => req.path.startsWith('/api/health') || req.path === '/api/metrics',
  handler: (req, res) => res.status(429).json({ error: 'Trop de requêtes' })
}));

// 3.7 Timeout global
app.use(timeout(`${Math.max(1, Math.floor((config.server.requestTimeout || 30000) / 1000))}s`));
// Guard global: si la requête a expiré, ne pas poursuivre la chaîne
app.use((req, res, next) => {
  if (req.timedout) return;
  next();
});

// 3.8 Parsers (ne pas casser multipart)
app.use(express.json({ limit: config.upload.limits?.json || '10mb' }));
app.use(express.urlencoded({ extended: false, limit: config.upload.limits?.urlencoded || '10mb' }));

// =====================================
// 4) PROMETHEUS (optionnel)
// =====================================
if (PromClient) {
  const register = new PromClient.Registry();
  PromClient.collectDefaultMetrics({ register });

  app.get('/api/metrics', async (req, res) => {
    try {
      res.set('Content-Type', register.contentType);
      res.end(await register.metrics());
    } catch (error) {
      res.status(500).end('# Erreur métrique');
    }
  });
}

// =====================================
// 5) ROUTES PUBLIQUES
// =====================================
app.get('/api/health/live', (req, res) => {
  res.json({
    status: 'LIVE',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: config.api.version || '3.0.0'
  });
});

app.get('/api/health/ready', async (req, res) => {
  const checks = { mongo: false, cache: false };
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      checks.mongo = true;
    }
  } catch {}
  try {
    const cache = require('./src/services/cacheService');
    checks.cache = !!cache;
  } catch {}
  const ready = Object.values(checks).every(Boolean);
  res.status(ready ? 200 : 503).json({
    status: ready ? 'READY' : 'NOT_READY',
    checks,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API Ba7ath Forensic opérationnelle',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    version: config.api.version || '3.0.0'
  });
});

// =====================================
// 6) AUTH ROUTES (avant tout catch-all ou validateur strict)
// =====================================
try {
  const authRoutesPath = require.resolve('./src/routes/auth');
  console.log('✅ Routes auth chargées depuis:', authRoutesPath);
  const authRoutes = require('./src/routes/auth');
  const mountPath = `${config.api.prefix || '/api'}/auth`;
  app.use(mountPath, authRoutes);
  console.log('✅ Routes auth montées sur:', mountPath);
} catch (error) {
  console.error('❌ Erreur chargement routes auth:', error.message);
}

// =====================================
// 7) STATIC
// =====================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: config.server.environment === 'production' ? '7d' : '1h',
  etag: true,
  setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff')
}));

// =====================================
// 8) PROTECT MIDDLEWARE (n’interfère pas avec le body)
// =====================================
const protect = [
  auth.auth,
  activityTracker(),
  (req, res, next) => { if (req.timedout) return; next(); }
];

const createRateLimit = (max, windowMinutes = 15) => rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: `Limite de ${max} requêtes atteinte` })
});

const uploadLimiter = createRateLimit(50, 15);
const analysisLimiter = createRateLimit(20, 15);
const reportLimiter = createRateLimit(30, 15);

// =====================================
// 9) ROUTES IMAGES (multipart)
// =====================================
try {
  const imageRoutes = require('./src/routes/images');
  app.use(`${config.api.prefix || '/api'}/images`, ...protect, uploadLimiter, imageRoutes);
  console.log('✅ Routes images protégées');
} catch (error) {
  console.warn('⚠️ Routes images non disponibles:', error.message);
}

// =====================================
// 10) AUTRES ROUTES PROTÉGÉES
// =====================================
try {
  const analysisRoutes = require('./src/routes/analysis');
  app.use(`${config.api.prefix || '/api'}/analysis`, ...protect, analysisLimiter, analysisRoutes);
  console.log('✅ Routes analysis protégées');
} catch (error) {
  console.warn('⚠️ Routes analysis non disponibles:', error.message);
}

try {
  const reportRoutes = require('./src/routes/reports');
  app.use(`${config.api.prefix || '/api'}/reports`, ...protect, reportLimiter, reportRoutes);
  console.log('✅ Routes reports protégées');
} catch (error) {
  console.warn('⚠️ Routes reports non disponibles:', error.message);
}

try {
  const forensicRoutes = require('./src/routes/forensic');
  app.use(`${config.api.prefix || '/api'}/forensic`, ...protect, analysisLimiter, forensicRoutes);
  console.log('✅ Routes forensic protégées');
} catch (error) {
  console.warn('⚠️ Routes forensic non disponibles:', error.message);
}

try {
  const adminRoutes = require('./src/routes/admin');
  const adminLimiter = createRateLimit(10, 15);
  app.use(`${config.api.prefix || '/api'}/admin`, ...protect, adminLimiter, adminRoutes);
  console.log('✅ Routes admin protégées');
} catch (error) {
  console.warn('⚠️ Routes admin non disponibles:', error.message);
}

// =====================================
// 11) OPENAPI VALIDATOR (NON STRICT, IGNORE /api/auth)
//     Placer après le montage des routes pour éviter d’intercepter /api/auth
// =====================================
try {
  const openApiSpec = path.join(__dirname, 'openapi', 'openapi.yaml');
  if (!fs.existsSync(openApiSpec)) {
    console.warn('⚠️ OpenAPI spec non trouvé à:', openApiSpec);
    console.warn('⚠️ OpenAPI validation désactivée');
  } else {
    // Ignore explicitement /api/auth et les uploads images
    const ignorePaths = (path) => {
      return /^\/api\/auth(\/|$)/i.test(path) || /\/api\/images\/upload(\/multiple)?/i.test(path);
    };

    app.use(
      `${config.api.prefix || '/api'}`,
      OpenApiValidator.middleware({
        apiSpec: openApiSpec,
        validateRequests: false,
        validateResponses: false,
        validateSecurity: false,
        ignorePaths
      })
    );
    console.log('✅ OpenAPI validation activée (non strict), spec:', openApiSpec);
  }
} catch (error) {
  console.warn('⚠️ OpenAPI validation désactivée:', error.message);
}

// =====================================
// 12) 404 & ERROR HANDLERS (guards)
// =====================================
app.use((req, res) => {
  if (res.headersSent) return;
  res.status(404).json({
    error: 'Endpoint non trouvé',
    path: req.originalUrl,
    method: req.method,
    message: 'Cet endpoint n’existe pas dans l’API Ba7ath',
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    availableEndpoints: [
      'GET /api/health/live',
      'GET /api/health/ready',
      'GET /api/test',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'POST /api/images/upload',
      'POST /api/analysis/:imageId',
      'GET /api/reports/:reportId'
    ]
  });
});

app.use((error, req, res, next) => {
  console.error('❌ Erreur:', error);
  if (res.headersSent) return;

  if (error.status === 401) {
    return res.status(401).json({
      error: 'Non autorisé',
      message: 'Token manquant ou invalide',
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
  }

  if (error.status === 429) {
    return res.status(429).json({
      error: 'Trop de requêtes',
      message: 'Limite de taux atteinte',
      timestamp: new Date().toISOString(),
      requestId: req.requestId
    });
  }

  res.status(error.status || 500).json({
    error: 'Erreur serveur',
    message: config.server.environment === 'production' ? 'Erreur interne' : error.message,
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  });
});

// =====================================
// 13) DB CONNECT
// =====================================
async function connectMongoDB() {
  const maxRetries = 5;
  let retries = 0;

  const baseOptions = { ...(config.database.mongodb.options || {}) };
  if ('useNewUrlParser' in baseOptions) delete baseOptions.useNewUrlParser;
  if ('useUnifiedTopology' in baseOptions) delete baseOptions.useUnifiedTopology;

  const connectOptions = {
    autoIndex: true,
    ...baseOptions
  };

  while (retries < maxRetries) {
    try {
      await mongoose.connect(config.database.mongodb.uri, connectOptions);

      console.log('✅ MongoDB connecté');

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB déconnecté');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ Erreur MongoDB:', err);
      });

      return;
    } catch (error) {
      retries++;
      console.error(`❌ Tentative ${retries}/${maxRetries} - MongoDB:`, error.message);

      if (retries >= maxRetries) {
        if (config.server.environment === 'production') {
          console.error('🚨 Impossible de connecter MongoDB en production');
          process.exit(1);
        } else {
          console.warn('⚠️ MongoDB indisponible, continuation en mode dev');
          return;
        }
      }

      const delay = Math.min(1000 * Math.pow(2, retries), 30000);
      console.log(`⏳ Nouvelle tentative dans ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// =====================================
// 14) START SERVER
// =====================================
async function startServer() {
  try {
    await connectMongoDB();

    const server = app.listen(config.server.port, () => {
      console.log('\n🚀 ========================================');
      console.log('🎯 BA7ATH FORENSIC API DÉMARRÉ');
      console.log('🚀 ========================================');
      console.log(`✅ Port: ${config.server.port}`);
      console.log(`🌐 URL: ${config.server.appUrl || `http://localhost:${config.server.port}`}`);
      console.log(`🔍 Health: ${config.server.appUrl || `http://localhost:${config.server.port}`}/api/health/live`);
      console.log(`🔐 Auth: ${config.server.appUrl || `http://localhost:${config.server.port}`}/api/auth`);
      console.log(`🛡️ Environment: ${config.server.environment}`);
      console.log(`💾 MongoDB: ${mongoose.connection.readyState === 1 ? '✅' : '❌'}`);
      console.log(`📊 Rate Limit: ${config.rateLimit.maxRequests} req/IP/${config.rateLimit.window}min`);
      console.log('========================================\n');
    });

    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    return server;
  } catch (error) {
    console.error('❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

// =====================================
// 15) GRACEFUL SHUTDOWN
// =====================================
let server;
let isShuttingDown = false;

async function gracefulShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n⚠️ ${signal} reçu - Fermeture propre...`);

  const shutdownTimeout = setTimeout(() => {
    console.error('🚨 Timeout fermeture - Arrêt forcé');
    process.exit(1);
  }, 30000);

  try {
    if (server) {
      console.log('📡 Fermeture serveur...');
      server.close();
    }

    if (mongoose.connection.readyState === 1) {
      console.log('💾 Fermeture MongoDB...');
      await mongoose.connection.close();
    }

    clearTimeout(shutdownTimeout);
    console.log('✅ Fermeture propre terminée');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur fermeture:', error);
    process.exit(1);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('uncaughtException', (error) => {
  console.error('❌ EXCEPTION NON CAPTURÉE:', error);
  gracefulShutdown('uncaughtException');
});
process.on('unhandledRejection', (reason) => {
  console.error('❌ PROMESSE REJETÉE:', reason);
  gracefulShutdown('unhandledRejection');
});

// =====================================
// 16) LAUNCH
// =====================================
startServer()
  .then(srv => {
    server = srv;
    console.log('🎉 Ba7ath Forensic API prêt !');
  })
  .catch(err => {
    console.error('💥 Erreur fatale:', err);
    process.exit(1);
  });

module.exports = app;
