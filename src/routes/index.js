"use strict";

const express = require('express');
const router = express.Router();
const os = require('os');

// ✅ CONFIG CENTRALISÉE
const config = require('../config');

// ✅ SERVICES BA7ATH
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const auditService = require('../services/auditService');

// =====================================
// PARAMÈTRES API (depuis config.js)
// =====================================

const API_VERSION = config.api?.version || '3.0.0-ba7ath';
const API_PREFIX = config.api?.prefix || '/api';
const isProd = process.env.NODE_ENV === 'production';

// =====================================
// MIDDLEWARE GLOBAL API
// =====================================

// Rate limiting global léger pour discovery
const discoveryWindowMin = config.rateLimit?.window || 1;
const discoveryMax = Math.min(config.rateLimit?.maxRequests || 200, 100);
const apiDiscoveryRateLimit = rateLimitService.createCustomLimit({
  windowMs: discoveryWindowMin * 60 * 1000,
  max: discoveryMax,
  message: {
    success: false,
    error: 'Trop de requêtes de découverte API',
    type: 'API_DISCOVERY_RATE_LIMIT'
  }
});

// Middleware de logging pour routes discovery
const apiLoggingMiddleware = middlewareService.asyncHandler(async (req, res, next) => {
  if (req.path === '/' || req.path === '/health' || req.path === '/status') {
    console.log(`🌐 [API] ${req.method} ${req.path} from ${req.ip} - ${req.headers['user-agent']?.substring(0, 50)}`);
  }
  next();
});

// =====================================
// IMPORT ROUTES BA7ATH ENTERPRISE
// =====================================

try {
  console.log('Auth routes will resolve from:', require.resolve('./auth'));
} catch (e) {
  console.warn('Auth routes resolve failed (pre-import):', e.message);
}

const authRoutes = require('./auth');
const imagesRoutes = require('./images');
const analysisRoutes = require('./analysis');
const reportsRoutes = require('./reports');
const forensicRoutes = require('./forensic');
const adminRoutes = require('./admin');

try {
  console.log('Auth routes resolved from:', require.resolve('./auth'));
} catch (e) {
  console.warn('Auth routes resolve failed (post-import):', e.message);
}

// =====================================
// MONTAGE ROUTES CENTRALISÉ
// =====================================

router.use(apiLoggingMiddleware);

console.log('🔗 Montage des routes Ba7ath Enterprise...');

router.use('/auth', authRoutes);
console.log('✅ Routes auth montées: /api/auth');

router.use('/images', imagesRoutes);
console.log('✅ Routes images montées: /api/images');

router.use('/analysis', analysisRoutes);
console.log('✅ Routes analysis montées: /api/analysis');

router.use('/reports', reportsRoutes);
console.log('✅ Routes reports montées: /api/reports');

router.use('/forensic', forensicRoutes);
console.log('✅ Routes forensic montées: /api/forensic');

router.use('/admin', adminRoutes);
console.log('✅ Routes admin montées: /api/admin');

// Routes développement uniquement en non-production
if (!isProd) {
  try {
    const devRoutes = require('./dev');
    router.use('/dev', devRoutes);
    console.log('🔧 Routes dev montées: /api/dev (développement seulement)');
  } catch (error) {
    console.warn('⚠️ Routes dev non disponibles:', error.message);
  }
}

console.log('🎉 Toutes les routes Ba7ath Enterprise montées avec succès !');

// =====================================
// ENDPOINTS API DISCOVERY
// =====================================

/**
 * @route GET /api/
 * @desc Point d'entrée API avec documentation complète
 * @access Public avec rate limiting
 */
router.get('/', apiDiscoveryRateLimit, (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}${API_PREFIX}`;

  const maxFileMB = Math.round((config.upload?.maxFileSize || config.upload?.multerFileSize || 50 * 1024 * 1024) / 1024 / 1024);
  const supportedFormats = (config.upload?.allowedFormats || ['jpg','jpeg','png','webp','tiff']).map(f => f.toUpperCase());

  res.set('Cache-Control', `public, max-age=${config.api?.discoveryCacheSec || 300}`);
  res.json({
    success: true,
    service: config.api?.name || 'Ba7ath Forensic Enterprise API',
    version: API_VERSION,
    description: 'API complète pour analyses forensiques d\'images avec IA',
    endpoints: {
      auth: {
        url: `${baseUrl}/auth`,
        description: 'Authentification JWT et gestion utilisateurs',
        methods: ['POST', 'GET', 'PUT', 'DELETE'],
        features: ['Login/Register', 'Password reset', 'Profile management', 'Token refresh']
      },
      images: {
        url: `${baseUrl}/images`,
        description: 'Upload et traitement d\'images forensiques',
        methods: ['POST', 'GET', 'PUT', 'DELETE'],
        features: ['Upload sécurisé', 'Traitement batch', 'Metadata extraction', 'Preview generation']
      },
      analysis: {
        url: `${baseUrl}/analysis`,
        description: 'Analyses forensiques avancées avec IA',
        methods: ['POST', 'GET'],
        features: ['7 piliers forensiques', 'Comparaisons', 'Batch analysis', 'Statistics']
      },
      reports: {
        url: `${baseUrl}/reports`,
        description: 'Génération de rapports multi-formats',
        methods: ['POST', 'GET'],
        features: ['7 templates', 'PDF/HTML/DOCX', 'Batch reports', 'Statistics']
      },
      forensic: {
        url: `${baseUrl}/forensic`,
        description: 'Analyses Python Bridge spécialisées',
        methods: ['POST', 'GET'],
        features: ['Python integration', 'Advanced AI', 'Custom models', 'Real-time status']
      },
      admin: {
        url: `${baseUrl}/admin`,
        description: 'Administration et monitoring système',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        features: ['User management', 'System monitoring', 'Cache control', 'Audit logs']
      }
    },
    utilities: {
      health: `${baseUrl}/health`,
      status: `${baseUrl}/status`,
      docs: config.api?.documentation?.path ? `${req.protocol}://${req.get('host')}${config.api.documentation.path}` : `${baseUrl}/docs`
    },
    system: {
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
      uptime: Math.round(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    },
    capabilities: {
      supportedFormats,
      maxFileSize: `${maxFileMB}MB`,
      analysisTypes: ['quick', 'standard', 'deep', 'comprehensive'],
      reportFormats: ['PDF', 'HTML', 'DOCX', 'JSON'],
      languages: config.api?.languages || ['fr', 'en']
    },
    metadata: {
      requestId: req.headers['x-request-id'] || 'api-discovery',
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      server: os.hostname()
    }
  });
});

/**
 * @route GET /api/health
 * @desc Health check endpoint pour monitoring
 * @access Public
 */
router.get('/health', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.json({
    status: 'healthy',
    service: config.api?.name || 'ba7ath-forensic-api',
    version: API_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @route GET /api/status
 * @desc Status détaillé du système
 * @access Public avec informations limitées
 */
router.get('/status', (req, res) => {
  const status = {
    service: config.api?.name || 'Ba7ath Forensic API',
    version: API_VERSION,
    status: 'operational',
    modules: {
      auth: 'operational',
      images: 'operational',
      analysis: 'operational',
      reports: 'operational',
      forensic: 'operational',
      admin: 'operational'
    },
    system: {
      platform: process.platform,
      nodeVersion: process.version,
      uptime: Math.round(process.uptime()),
      environment: process.env.NODE_ENV || 'development'
    },
    timestamp: new Date().toISOString()
  };

  if (!isProd) {
    status.modules.dev = 'operational';
  }

  res.set('Cache-Control', `public, max-age=${config.api?.statusCacheSec || 60}`);
  res.json(status);
});

// =====================================
// GARDES AVANT 404 GLOBAL
// =====================================

// Ne pas déclencher le 404 si la requête est déjà en timeout en amont
router.use((req, res, next) => {
  if (req.timedout) return;
  next();
});

// =====================================
// GESTION D'ERREURS CENTRALISÉE
// =====================================

router.use('*', (req, res) => {
  // Éviter d’envoyer une réponse si déjà envoyée par un handler en amont
  if (res.headersSent) return;

  res.status(404).json({
    success: false,
    error: 'Endpoint API non trouvé',
    type: 'API_ENDPOINT_NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      `${API_PREFIX}/auth`,
      `${API_PREFIX}/images`,
      `${API_PREFIX}/analysis`,
      `${API_PREFIX}/reports`,
      `${API_PREFIX}/forensic`,
      `${API_PREFIX}/admin`
    ],
    documentation: `${req.protocol}://${req.get('host')}${API_PREFIX}/`,
    timestamp: new Date().toISOString()
  });
});

router.use((error, req, res, next) => {
  console.error('❌ [API] Erreur centralisée:', error.message);

  if (res.headersSent) return;

  res.status(error.status || 500).json({
    success: false,
    error: 'Erreur interne de l\'API',
    type: 'INTERNAL_API_ERROR',
    details: !isProd ? error.message : 'Erreur serveur',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;

console.log('🎉 BA7ATH ENTERPRISE API ROUTER INITIALISÉ !');
console.log(`🌐 API Version: ${API_VERSION}`);
console.log(`🔗 Préfixe API: ${API_PREFIX}`);
console.log(`📊 Modules montés: 6 modules + ${!isProd ? '1 dev' : '0 dev'}`);
console.log(`🛡️ Environnement: ${process.env.NODE_ENV || 'development'}`);
console.log('🎯 Prêt pour Ba7ath Enterprise Production !');
