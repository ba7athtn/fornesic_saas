"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var express = require('express');
var router = express.Router();
var rateLimit = require('express-rate-limit');
var requestIp = require('request-ip');

// Contrôleurs images forensiques
var _require = require('../controllers/imageController'),
  uploadForensicImage = _require.uploadForensicImage,
  uploadMultipleForensicImages = _require.uploadMultipleForensicImages,
  getForensicImageDetails = _require.getForensicImageDetails,
  listForensicImages = _require.listForensicImages,
  deleteForensicImage = _require.deleteForensicImage,
  getImageStatus = _require.getImageStatus;

// Middlewares
var _require2 = require('../middleware/auth'),
  auth = _require2.auth,
  optionalAuth = _require2.optionalAuth,
  requireRole = _require2.requireRole,
  requirePrivacyMode = _require2.requirePrivacyMode,
  forensicLogging = _require2.forensicLogging;
var _require3 = require('../middleware/validation'),
  validateForensicUpload = _require3.validateForensicUpload,
  validateForensicObjectId = _require3.validateForensicObjectId,
  validateForensicQuery = _require3.validateForensicQuery;
var _require4 = require('../middleware/upload'),
  single = _require4.single,
  array = _require4.array;

// =====================================
// RATE LIMITING UPLOAD - CORRIGÉ IPv6-SAFE
// =====================================

var uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  // 1 heure
  max: 200,
  // 200 uploads par heure (augmenté)
  message: {
    error: 'Limite d\'upload dépassée',
    type: 'UPLOAD_RATE_LIMIT_EXCEEDED'
  },
  keyGenerator: function keyGenerator(req) {
    var _req$user;
    var clientIp = requestIp.getClientIp(req) || req.ip || 'unknown';
    return "upload-".concat(clientIp, "-").concat(((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.sub) || 'anonymous');
  },
  standardHeaders: true,
  validate: {
    keyGeneratorIpFallback: false
  }
});

// MIDDLEWARE DE DEBUG UPLOAD
var debugUpload = function debugUpload(req, res, next) {
  var _req$headers$userAge;
  console.log("\uD83D\uDD27 Debug Upload Request:");
  console.log(" Content-Length: ".concat(req.headers['content-length'] || 'Non spécifié'));
  console.log(" Content-Type: ".concat(req.headers['content-type'] || 'Non spécifié'));
  console.log(" User-Agent: ".concat(((_req$headers$userAge = req.headers['user-agent']) === null || _req$headers$userAge === void 0 ? void 0 : _req$headers$userAge.substring(0, 50)) || 'Inconnu'));
  console.log(" Method: ".concat(req.method));
  console.log(" URL: ".concat(req.url));
  console.log("\uD83D\uDD27 Limites Configur\xE9es:");
  console.log(" MAX_FILE_SIZE: ".concat(process.env.MAX_FILE_SIZE || 'Non défini'));
  console.log(" MULTER_FILE_SIZE: ".concat(process.env.MULTER_FILE_SIZE || 'Non défini'));
  console.log(" EXPRESS_JSON_LIMIT: ".concat(process.env.EXPRESS_JSON_LIMIT || 'Non défini'));
  next();
};

// =====================================
// ROUTES GESTION IMAGES FORENSIQUES
// =====================================

/**
 * @route POST /api/images/upload
 * @desc Upload sécurisé d'une image avec scan forensique intégré
 * @access Public/Private (dépend de la configuration)
 * @form {file} image - Fichier image (max 500MB)
 * @header {string} x-session-id - ID de session (optionnel)
 */
router.post('/upload', debugUpload, uploadRateLimit, optionalAuth, forensicLogging, single('image'), validateForensicUpload, uploadForensicImage);

/**
 * @route POST /api/images/upload/multiple
 * @desc Upload multiple sécurisé avec traitement batch
 * @access Private
 * @form {file[]} images - Fichiers images (max 10 fichiers)
 */
router.post('/upload/multiple', uploadRateLimit, auth, requireRole(['forensic_analyst', 'admin']), forensicLogging, array('images', 10), validateForensicUpload, uploadMultipleForensicImages);

/**
 * @route GET /api/images/:imageId
 * @desc Obtenir détails forensiques complets d'une image
 * @access Private
 * @param {string} imageId - ID MongoDB de l'image
 * @query {boolean} includeExif - Inclure métadonnées EXIF
 * @query {boolean} includeAuditLog - Inclure audit log (JUDICIAL uniquement)
 */
router.get('/:imageId', optionalAuth, forensicLogging, validateForensicObjectId('imageId'), validateForensicQuery, getForensicImageDetails);

/**
 * @route GET /api/images/:imageId/status
 * @desc Obtenir statut en temps réel d'une image
 * @access Public (avec limitations)
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/status', optionalAuth, validateForensicObjectId('imageId'), getImageStatus);

/**
 * @route GET /api/images
 * @desc Lister images avec filtres forensiques avancés
 * @access Public (avec authentification optionnelle)
 * @query {string} sessionId - Filtrer par session
 * @query {string} status - Filtrer par statut
 * @query {string} riskLevel - Filtrer par niveau de risque
 * @query {number} minScore - Score minimum d'authenticité
 * @query {number} maxScore - Score maximum d'authenticité
 * @query {string} dateFrom - Date de début
 * @query {string} dateTo - Date de fin
 * @query {boolean} hasFlags - Filtrer par présence de flags
 * @query {string} search - Recherche textuelle
 * @query {string} sortBy - Champ de tri
 * @query {string} sortOrder - Ordre de tri (asc/desc)
 * @query {number} page - Page (défaut: 1)
 * @query {number} limit - Limite par page (défaut: 50, max: 100)
 */
router.get('/', optionalAuth, validateForensicQuery, listForensicImages);

/**
 * @route DELETE /api/images/:imageId
 * @desc Supprimer image avec nettoyage forensique complet
 * @access Private - Requires admin role
 * @param {string} imageId - ID MongoDB de l'image
 * @query {string} reason - Raison de suppression
 * @query {boolean} secure - Effacement sécurisé (multi-pass)
 */
router["delete"]('/:imageId', auth, requireRole(['admin', 'forensic_admin']), requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']), forensicLogging, validateForensicObjectId('imageId'), deleteForensicImage);

/**
 * @route GET /api/images/:imageId/download
 * @desc Télécharger image originale (avec contrôles d'accès)
 * @access Private - Requires specific permissions
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/download', auth, requireRole(['forensic_analyst', 'expert', 'admin']), requirePrivacyMode(['JUDICIAL']), forensicLogging, validateForensicObjectId('imageId'), /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var _image$files, _req$user2, _image$hash, imageId, Image, image, _fs, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          imageId = req.params.imageId;
          Image = require('../models/Image');
          _context.n = 1;
          return Image.findById(imageId);
        case 1:
          image = _context.v;
          if (image) {
            _context.n = 2;
            break;
          }
          return _context.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND'
          }));
        case 2:
          _fs = require('fs');
          if (!(!((_image$files = image.files) !== null && _image$files !== void 0 && _image$files.original) || !_fs.existsSync(image.files.original))) {
            _context.n = 3;
            break;
          }
          return _context.a(2, res.status(404).json({
            error: 'Fichier image introuvable',
            type: 'FILE_NOT_FOUND'
          }));
        case 3:
          _context.n = 4;
          return Image.findByIdAndUpdate(imageId, {
            $push: {
              auditLog: {
                action: 'FILE_DOWNLOADED',
                performedBy: (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.sub,
                timestamp: new Date(),
                details: {
                  downloadType: 'original',
                  ip: req.ip,
                  userAgent: req.get('User-Agent')
                }
              }
            }
          });
        case 4:
          res.setHeader('Content-Type', image.mimeType);
          res.setHeader('Content-Disposition', "attachment; filename=\"".concat(image.originalName, "\""));
          res.setHeader('X-Download-Type', 'forensic-original');
          res.setHeader('X-Image-Hash', (_image$hash = image.hash) === null || _image$hash === void 0 ? void 0 : _image$hash.substring(0, 16));
          res.download(image.files.original, image.originalName, function (error) {
            if (error) {
              console.error('❌ Erreur téléchargement image:', error);
            } else {
              var _req$user3;
              console.log("\u2705 Image t\xE9l\xE9charg\xE9e: ".concat(imageId, " par ").concat((_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.sub));
            }
          });
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
          console.error('❌ Erreur download route:', _t);
          res.status(500).json({
            error: 'Erreur téléchargement',
            type: 'DOWNLOAD_ERROR'
          });
        case 6:
          return _context.a(2);
      }
    }, _callee, null, [[0, 5]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

/**
 * @route GET /api/images/:imageId/thumbnail
 * @desc Obtenir thumbnail d'une image
 * @access Public (avec authentification optionnelle)
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/thumbnail', optionalAuth, validateForensicObjectId('imageId'), /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _image$files2, imageId, Image, image, _fs2, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          imageId = req.params.imageId;
          Image = require('../models/Image');
          _context2.n = 1;
          return Image.findById(imageId).select('files.thumbnail mimeType originalName');
        case 1:
          image = _context2.v;
          if (image) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND'
          }));
        case 2:
          _fs2 = require('fs');
          if (!(!((_image$files2 = image.files) !== null && _image$files2 !== void 0 && _image$files2.thumbnail) || !_fs2.existsSync(image.files.thumbnail))) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(404).json({
            error: 'Thumbnail non disponible',
            type: 'THUMBNAIL_NOT_FOUND'
          }));
        case 3:
          res.setHeader('Content-Type', 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.setHeader('X-Thumbnail-Generated', 'true');
          res.sendFile(require('path').resolve(image.files.thumbnail));
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          console.error('❌ Erreur thumbnail route:', _t2);
          res.status(500).json({
            error: 'Erreur récupération thumbnail',
            type: 'THUMBNAIL_ERROR'
          });
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 4]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

// ROUTE DE TEST DES LIMITES (À SUPPRIMER APRÈS TESTS)
router.get('/limits-check', function (req, res) {
  var limits = {
    environment: {
      MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
      MULTER_FILE_SIZE: process.env.MULTER_FILE_SIZE,
      EXPRESS_JSON_LIMIT: process.env.EXPRESS_JSON_LIMIT,
      EXPRESS_URLENCODED_LIMIT: process.env.EXPRESS_URLENCODED_LIMIT
    },
    calculated: {
      multerFileSizeBytes: parseInt(process.env.MULTER_FILE_SIZE) || 524288000,
      multerFileSizeMB: Math.round((parseInt(process.env.MULTER_FILE_SIZE) || 524288000) / 1024 / 1024),
      expressJsonLimit: process.env.EXPRESS_JSON_LIMIT || '500mb',
      expressUrlencodedLimit: process.env.EXPRESS_URLENCODED_LIMIT || '500mb'
    }
  };
  res.json({
    success: true,
    message: 'Configuration des limites',
    limits: limits,
    timestamp: new Date().toISOString()
  });
});

// =====================================
// ROUTES AVANCÉES (Partie 2/2 suit...)
// =====================================

/**
 * @route PATCH /api/images/:imageId/quarantine
 * @desc Mettre/Lever quarantaine sur une image
 * @access Private - Requires admin role
 * @param {string} imageId - ID MongoDB de l'image
 * @body {string} action - Action (quarantine/release)
 * @body {string} reason - Raison de l'action
 */
router.patch('/:imageId/quarantine', auth, requireRole(['admin', 'security_admin']), forensicLogging, validateForensicObjectId('imageId'), /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var imageId, _req$body, action, reason, Image, image, _req$user4, _req$user5, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          imageId = req.params.imageId;
          _req$body = req.body, action = _req$body.action, reason = _req$body.reason;
          if (['quarantine', 'release'].includes(action)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, res.status(400).json({
            error: 'Action invalide',
            type: 'INVALID_ACTION',
            validActions: ['quarantine', 'release']
          }));
        case 1:
          Image = require('../models/Image');
          _context3.n = 2;
          return Image.findById(imageId);
        case 2:
          image = _context3.v;
          if (image) {
            _context3.n = 3;
            break;
          }
          return _context3.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND'
          }));
        case 3:
          if (!(action === 'quarantine')) {
            _context3.n = 5;
            break;
          }
          _context3.n = 4;
          return image.quarantineImage(reason, (_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.sub);
        case 4:
          res.json({
            success: true,
            message: 'Image mise en quarantaine',
            status: 'quarantined',
            reason: reason,
            quarantinedAt: new Date().toISOString()
          });
          _context3.n = 7;
          break;
        case 5:
          _context3.n = 6;
          return Image.findByIdAndUpdate(imageId, {
            'quarantine.status': 'none',
            status: 'uploaded',
            $push: {
              auditLog: {
                action: 'QUARANTINE_RELEASED',
                performedBy: (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.sub,
                details: {
                  reason: reason
                },
                timestamp: new Date()
              }
            }
          });
        case 6:
          res.json({
            success: true,
            message: 'Quarantaine levée',
            status: 'released',
            releasedAt: new Date().toISOString()
          });
        case 7:
          _context3.n = 9;
          break;
        case 8:
          _context3.p = 8;
          _t3 = _context3.v;
          console.error('❌ Erreur quarantine route:', _t3);
          res.status(500).json({
            error: 'Erreur gestion quarantaine',
            type: 'QUARANTINE_ERROR'
          });
        case 9:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 8]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// ✅ SERVICES BA7ATH OPTIMISÉS
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const forensicValidationService = require('../services/forensicValidationService');
const imageProcessor = require('../services/imageProcessor');
const forensicService = require('../services/forensicService');

// Contrôleurs images forensiques
const {
  uploadForensicImage,
  uploadMultipleForensicImages,
  getForensicImageDetails,
  listForensicImages,
  deleteForensicImage,
  getImageStatus
} = require('../controllers/imageController');

// Middlewares
const {
  auth,
  optionalAuth,
  requireRole,
  requirePrivacyMode,
  forensicLogging
} = require('../middleware/auth');

// ✅ CORRECTION: Suppression validateForensicUpload + optimisations
const {
  validateForensicObjectId,
  validateForensicQuery
} = require('../middleware/validation');

// Upload middleware
const { single, array } = require('../middleware/upload');

// =====================================
// RATE LIMITING OPTIMISÉ BA7ATH
// =====================================

const uploadRateLimit = rateLimitService.upload;      // 200/heure optimisé
const downloadRateLimit = rateLimitService.download;  // 50/heure pour téléchargements

// ✅ MIDDLEWARE DEBUG AMÉLIORÉ
const debugUpload = middlewareService.asyncHandler(async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Debug Upload Request:');
    console.log(` Content-Length: ${req.headers['content-length'] || 'Non spécifié'}`);
    console.log(` Content-Type: ${req.headers['content-type'] || 'Non spécifié'}`);
    console.log(` User-Agent: ${req.headers['user-agent']?.substring(0, 50) || 'Inconnu'}`);
    console.log(` Method: ${req.method}`);
    console.log(` URL: ${req.url}`);
  }
  next();
});

// =====================================
// ROUTES GESTION IMAGES OPTIMISÉES
// =====================================

/**
 * @route POST /api/images/upload
 * @desc Upload sécurisé optimisé avec validation forensique Ba7ath
 */
router.post('/upload', 
  debugUpload, 
  uploadRateLimit, 
  optionalAuth, 
  forensicLogging, 
  single('image'), 
  forensicValidationService.validateUpload(), // ✅ SERVICE BA7ATH
  middlewareService.asyncHandler(async (req, res) => {
    // ✅ OPTIMISATION: Pré-analyse rapide avec forensicService
    if (req.file && req.file.buffer) {
      try {
        const quickAnalysis = await forensicService.analyzeImage(req.file.buffer, {
          include: {
            aiDetection: false,
            manipulation: true,
            physics: false,
            statistical: true
          }
        });
        
        req.quickForensicAnalysis = quickAnalysis;
        console.log(`🔍 Analyse rapide upload: score ${quickAnalysis.overallScore || 0}%`);
      } catch (analysisError) {
        console.warn('⚠️ Erreur analyse rapide upload:', analysisError.message);
      }
    }
    
    return await uploadForensicImage(req, res);
  })
);

/**
 * @route POST /api/images/upload/multiple
 * @desc Upload multiple optimisé avec queue asynchrone
 */
router.post('/upload/multiple', 
  uploadRateLimit, 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  forensicLogging, 
  array('images', 10), 
  forensicValidationService.validateUpload(),
  middlewareService.asyncHandler(async (req, res) => {
    const files = req.files || [];
    
    if (files.length === 0) {
      return res.status(400).json({
        error: 'Aucun fichier fourni',
        type: 'NO_FILES_PROVIDED'
      });
    }
    
    const analysisQueue = require('../services/analysisQueue');
    const uploadId = crypto.randomBytes(8).toString('hex');
    
    const jobPromises = files.map(async (file, index) => {
      try {
        const job = await analysisQueue.addAnalysisJob(`upload_${uploadId}_${index}`, {
          priority: 'upload_batch',
          fileData: file,
          userId: req.user?.sub,
          uploadId
        });
        
        return {
          filename: file.originalname,
          success: true,
          jobId: job.id
        };
      } catch (error) {
        return {
          filename: file.originalname,
          success: false,
          error: error.message
        };
      }
    });
    
    const jobResults = await Promise.allSettled(jobPromises);
    const results = jobResults.map(r => r.value || { success: false, error: 'Promise rejected' });
    
    await cacheService.cacheBatchReport(uploadId, {
      type: 'upload_batch',
      files: files.length,
      results,
      timestamp: new Date().toISOString()
    });
    
    res.status(202).json({
      success: true,
      message: `Upload batch initié: ${files.length} fichiers`,
      uploadId,
      results,
      trackingUrl: `/api/images/batch/${uploadId}/status`
    });
  })
);

/**
 * @route GET /api/images/:imageId
 * @desc Détails forensiques avec cache intelligent
 */
router.get('/:imageId', 
  optionalAuth, 
  forensicLogging, 
  validateForensicObjectId('imageId'), 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    const { includeExif, includeAuditLog } = req.query;
    
    const cacheKey = `image_details_${imageId}_${includeExif}_${includeAuditLog}`;
    const cached = await cacheService.getWithType('image_details', cacheKey);
    
    if (cached) {
      return res.json({
        ...cached,
        cached: true,
        cacheTime: new Date().toISOString()
      });
    }
    
    const result = await getForensicImageDetails(req, res);
    
    if (result && !result.error) {
      await cacheService.setWithType('image_details', cacheKey, result, 900);
    }
    
    return result;
  })
);

/**
 * @route GET /api/images/:imageId/status
 * @desc Statut temps réel avec cache court
 */
router.get('/:imageId/status', 
  optionalAuth, 
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    
    const statusCacheKey = `image_status_${imageId}`;
    const cachedStatus = await cacheService.getWithType('image_status', statusCacheKey);
    
    if (cachedStatus) {
      return res.json({
        ...cachedStatus,
        cached: true
      });
    }
    
    const status = await getImageStatus(req, res);
    
    if (status && !status.error) {
      await cacheService.setWithType('image_status', statusCacheKey, status, 30);
    }
    
    return status;
  })
);

/**
 * @route GET /api/images
 * @desc Liste images avec cache et pagination optimisée
 */
router.get('/', 
  optionalAuth, 
  validateForensicQuery, 
  middlewareService.asyncHandler(async (req, res) => {
    const queryHash = crypto
      .createHash('md5')
      .update(JSON.stringify(req.query))
      .digest('hex');
    const listCacheKey = `image_list_${queryHash}`;
    
    const cachedList = await cacheService.getWithType('image_lists', listCacheKey);
    if (cachedList) {
      return res.json({
        ...cachedList,
        cached: true
      });
    }
    
    const result = await listForensicImages(req, res);
    
    if (result && result.images) {
      await cacheService.setWithType('image_lists', listCacheKey, result, 300);
    }
    
    return result;
  })
);

/**
 * @route DELETE /api/images/:imageId
 * @desc Suppression sécurisée avec nettoyage complet
 */
router.delete('/:imageId', 
  auth, 
  requireRole(['admin', 'forensic_admin']), 
  requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']), 
  forensicLogging, 
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    
    await Promise.all([
      cacheService.deletePattern(`image_details_${imageId}_*`),
      cacheService.deletePattern(`image_status_${imageId}*`),
      cacheService.deletePattern(`analysis_*_${imageId}_*`),
      cacheService.deletePattern(`thumbnail_${imageId}*`)
    ]);
    
    const result = await deleteForensicImage(req, res);
    
    if (result && result.success) {
      await cacheService.deletePattern('image_lists_*');
      console.log(`🗑️ Image supprimée avec nettoyage cache: ${imageId}`);
    }
    
    return result;
  })
);

/**
 * @route GET /api/images/:imageId/download
 * @desc Téléchargement sécurisé avec audit forensique
 */
router.get('/:imageId/download', 
  auth, 
  requireRole(['forensic_analyst', 'expert', 'admin']), 
  requirePrivacyMode(['JUDICIAL']), 
  forensicLogging, 
  downloadRateLimit,
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    const Image = require('../models/Image');
    
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND'
      });
    }
    
    if (!image.files?.original || !fs.existsSync(image.files.original)) {
      return res.status(404).json({
        error: 'Fichier image introuvable',
        type: 'FILE_NOT_FOUND'
      });
    }
    
    await Image.findByIdAndUpdate(imageId, {
      $push: {
        auditLog: {
          action: 'FILE_DOWNLOADED',
          performedBy: req.user?.sub,
          timestamp: new Date(),
          details: {
            downloadType: 'original',
            ip: req.ip,
            userAgent: req.get('User-Agent')
          }
        }
      }
    });
    
    res.setHeader('Content-Type', image.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${image.originalName}"`);
    res.setHeader('X-Download-Type', 'forensic-original');
    res.setHeader('X-Image-Hash', image.hash?.substring(0, 16));
    res.setHeader('X-Content-Security-Policy', 'default-src none');
    
    res.download(image.files.original, image.originalName, (error) => {
      if (error) {
        console.error('❌ Erreur téléchargement image:', error);
      } else {
        console.log(`✅ Image téléchargée: ${imageId} par ${req.user?.sub}`);
      }
    });
  })
);

/**
 * @route GET /api/images/:imageId/thumbnail
 * @desc Thumbnail optimisé avec cache et génération à la demande
 */
router.get('/:imageId/thumbnail', 
  optionalAuth, 
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    
    const thumbnailPath = await cacheService.getCachedThumbnailPath(imageId);
    if (thumbnailPath && fs.existsSync(thumbnailPath)) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.setHeader('X-Thumbnail-Cached', 'true');
      return res.sendFile(path.resolve(thumbnailPath));
    }
    
    const Image = require('../models/Image');
    const image = await Image.findById(imageId).select('files.thumbnail files.original mimeType originalName');
    
    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND'
      });
    }
    
    if (!image.files?.thumbnail || !fs.existsSync(image.files.thumbnail)) {
      if (image.files?.original && fs.existsSync(image.files.original)) {
        try {
          const thumbnailDir = path.dirname(image.files.original).replace('/originals/', '/thumbnails/');
          const thumbnailFilename = `thumb_${imageId}.jpg`;
          
          const thumbnailResult = await imageProcessor.createThumbnail(
            image.files.original,
            thumbnailDir,
            thumbnailFilename,
            { width: 300, height: 300, quality: 80 }
          );
          
          if (thumbnailResult.success) {
            await Image.findByIdAndUpdate(imageId, {
              'files.thumbnail': thumbnailResult.outputPath
            });
            
            await cacheService.cacheThumbnailPath(imageId, thumbnailResult.outputPath);
            
            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.setHeader('X-Thumbnail-Generated', 'true');
            return res.sendFile(path.resolve(thumbnailResult.outputPath));
          }
        } catch (thumbnailError) {
          console.error(`❌ Erreur génération thumbnail ${imageId}:`, thumbnailError);
        }
      }
      
      return res.status(404).json({
        error: 'Thumbnail non disponible',
        type: 'THUMBNAIL_NOT_FOUND'
      });
    }
    
    await cacheService.cacheThumbnailPath(imageId, image.files.thumbnail);
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Thumbnail-Existing', 'true');
    res.sendFile(path.resolve(image.files.thumbnail));
  })
);

/**
 * @route PATCH /api/images/:imageId/quarantine
 * @desc Gestion quarantaine optimisée avec cache invalidation
 */
router.patch('/:imageId/quarantine', 
  auth, 
  requireRole(['admin', 'security_admin']), 
  forensicLogging, 
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    const { action, reason } = req.body;
    
    if (!['quarantine', 'release'].includes(action)) {
      return res.status(400).json({
        error: 'Action invalide',
        type: 'INVALID_ACTION',
        validActions: ['quarantine', 'release']
      });
    }
    
    const Image = require('../models/Image');
    const image = await Image.findById(imageId);
    
    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND'
      });
    }
    
    if (action === 'quarantine') {
      await image.quarantineImage(reason, req.user?.sub);
      
      await Promise.all([
        cacheService.deletePattern(`image_details_${imageId}_*`),
        cacheService.deletePattern(`image_status_${imageId}*`),
        cacheService.deletePattern('image_lists_*')
      ]);
      
      res.json({
        success: true,
        message: 'Image mise en quarantaine',
        status: 'quarantined',
        reason,
        quarantinedAt: new Date().toISOString()
      });
    } else {
      await Image.findByIdAndUpdate(imageId, {
        'quarantine.status': 'none',
        status: 'uploaded',
        $push: {
          auditLog: {
            action: 'QUARANTINE_RELEASED',
            performedBy: req.user?.sub,
            details: { reason },
            timestamp: new Date()
          }
        }
      });
      
      await Promise.all([
        cacheService.deletePattern(`image_details_${imageId}_*`),
        cacheService.deletePattern(`image_status_${imageId}*`),
        cacheService.deletePattern('image_lists_*')
      ]);
      
      res.json({
        success: true,
        message: 'Quarantaine levée',
        status: 'released',
        releasedAt: new Date().toISOString()
      });
    }
  })
);

/**
 * @route GET /api/images/batch/:uploadId/status
 * @desc Statut upload batch
 */
router.get('/batch/:uploadId/status', 
  optionalAuth, 
  middlewareService.asyncHandler(async (req, res) => {
    const { uploadId } = req.params;
    
    const batchStatus = await cacheService.getCachedBatchReport(uploadId);
    if (!batchStatus) {
      return res.status(404).json({
        error: 'Batch upload non trouvé',
        type: 'BATCH_NOT_FOUND'
      });
    }
    
    res.json({
      success: true,
      uploadId,
      status: batchStatus.status || 'processing',
      summary: batchStatus,
      lastUpdate: batchStatus.timestamp
    });
  })
);

// =====================================
// ROUTES AVANCÉES
// =====================================

/**
 * @route GET /api/images/statistics/overview
 * @desc Statistiques globales optimisées avec cache
 */
router.get('/statistics/overview', 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  middlewareService.asyncHandler(async (req, res) => {
    const { period = '30d' } = req.query;
    
    const statsCacheKey = `image_stats_overview_${period}`;
    const cachedStats = await cacheService.getWithType('stats', statsCacheKey);
    
    if (cachedStats) {
      return res.json({
        ...cachedStats,
        cached: true,
        cacheTime: new Date().toISOString()
      });
    }
    
    const Image = require('../models/Image');
    const periodMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    }[period] || 30 * 24 * 60 * 60 * 1000;
    
    const startDate = new Date(Date.now() - periodMs);
    
    const stats = await Image.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalImages: { $sum: 1 },
          analyzedImages: {
            $sum: { $cond: [{ $eq: ['$status', 'analyzed'] }, 1, 0] }
          },
          quarantinedImages: {
            $sum: { $cond: [{ $ne: ['$quarantine.status', 'none'] }, 1, 0] }
          },
          averageFileSize: { $avg: '$size' },
          averageAuthenticityScore: { $avg: '$authenticityScore' },
          totalFlags: {
            $sum: { $size: { $ifNull: ['$forensicAnalysis.flags', []] } }
          },
          aiDetected: {
            $sum: { $cond: [{ $gt: ['$forensicAnalysis.pillars.aiDetection.score', 70] }, 1, 0] }
          },
          manipulationDetected: {
            $sum: { $cond: [{ $gt: ['$forensicAnalysis.pillars.manipulation.score', 60] }, 1, 0] }
          },
          highRiskImages: {
            $sum: { $cond: [{ $eq: ['$riskClassification.level', 'HIGH'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const overview = stats[0] || {};
    
    const result = {
      period,
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString()
      },
      statistics: {
        totalImages: overview.totalImages || 0,
        analyzedImages: overview.analyzedImages || 0,
        quarantinedImages: overview.quarantinedImages || 0,
        analysisRate: overview.totalImages > 0 
          ? Math.round((overview.analyzedImages / overview.totalImages) * 100) 
          : 0,
        averageFileSize: Math.round(overview.averageFileSize || 0),
        averageAuthenticityScore: Math.round(overview.averageAuthenticityScore || 0),
        totalSecurityFlags: overview.totalFlags || 0,
        aiDetectedCount: overview.aiDetected || 0,
        manipulationDetectedCount: overview.manipulationDetected || 0,
        highRiskCount: overview.highRiskImages || 0,
        riskDistribution: {
          high: overview.highRiskImages || 0,
          medium: (overview.totalImages - overview.highRiskImages - overview.analyzedImages) || 0,
          low: overview.analyzedImages || 0
        }
      },
      generatedAt: new Date().toISOString()
    };
    
    await cacheService.setWithType('stats', statsCacheKey, result, 600);
    
    res.json(result);
  })
);

/**
 * @route GET /api/images/:imageId/metadata
 * @desc Métadonnées complètes avec cache EXIF
 */
router.get('/:imageId/metadata', 
  optionalAuth, 
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    
    const metadataCacheKey = `image_metadata_${imageId}`;
    const cachedMetadata = await cacheService.getWithType('metadata', metadataCacheKey);
    
    if (cachedMetadata) {
      return res.json({
        ...cachedMetadata,
        cached: true
      });
    }
    
    const Image = require('../models/Image');
    const image = await Image.findById(imageId)
      .select('metadata exifData forensicAnalysis.pillars authenticityScore riskClassification hash originalName')
      .lean();
    
    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND'
      });
    }
    
    let enrichedExif = image.exifData;
    
    if (image.hash) {
      const exifService = require('../services/exifService');
      const cachedExif = await exifService.getCachedExifData(image.hash);
      if (cachedExif) {
        enrichedExif = { ...enrichedExif, ...cachedExif };
      }
    }
    
    const result = {
      success: true,
      imageId,
      metadata: {
        basic: image.metadata,
        exif: enrichedExif,
        forensicPillars: image.forensicAnalysis?.pillars,
        authenticityScore: image.authenticityScore,
        riskClassification: image.riskClassification,
        filename: image.originalName,
        hash: image.hash?.substring(0, 16)
      },
      retrievedAt: new Date().toISOString()
    };
    
    await cacheService.setWithType('metadata', metadataCacheKey, result, 1800);
    
    res.json(result);
  })
);

/**
 * @route POST /api/images/:imageId/reanalyze
 * @desc Réanalyse optimisée avec queue prioritaire
 */
router.post('/:imageId/reanalyze', 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  forensicLogging, 
  validateForensicObjectId('imageId'), 
  middlewareService.asyncHandler(async (req, res) => {
    const { imageId } = req.params;
    const { analysisType = 'full', priority = 'high' } = req.body;
    
    const Image = require('../models/Image');
    const image = await Image.findById(imageId);
    
    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND'
      });
    }
    
    if (!fs.existsSync(image.files?.original)) {
      return res.status(404).json({
        error: 'Fichier image introuvable pour réanalyse',
        type: 'FILE_NOT_FOUND'
      });
    }
    
    await Promise.all([
      cacheService.deletePattern(`image_details_${imageId}_*`),
      cacheService.deletePattern(`image_metadata_${imageId}*`),
      cacheService.deletePattern(`image_status_${imageId}*`),
      cacheService.deletePattern(`analysis_*_${imageId}_*`)
    ]);
    
    try {
      const analysisQueue = require('../services/analysisQueue');
      const job = await analysisQueue.addAnalysisJob(imageId, {
        priority: priority,
        type: analysisType,
        reanalysis: true,
        requestedBy: req.user?.sub,
        timestamp: new Date().toISOString()
      });
      
      console.log(`🔄 Réanalyse ajoutée à la queue: ${imageId} (Job ID: ${job.id})`);
      
      await Image.findByIdAndUpdate(imageId, {
        'forensicAnalysis.status': 'pending',
        'forensicAnalysis.reanalysisRequested': true,
        'forensicAnalysis.reanalysisRequestedAt': new Date(),
        'forensicAnalysis.reanalysisRequestedBy': req.user?.sub,
        status: 'processing',
        $push: {
          auditLog: {
            action: 'REANALYSIS_REQUESTED',
            performedBy: req.user?.sub,
            details: { analysisType, priority, jobId: job.id },
            timestamp: new Date()
          }
        }
      });
      
      res.json({
        success: true,
        message: 'Réanalyse forensique démarrée',
        imageId,
        jobId: job.id,
        analysisType,
        priority,
        status: 'reanalysis_pending',
        estimatedTime: analysisType === 'full' ? '60-300 seconds' : '30-120 seconds',
        trackingUrl: `/api/analysis/${imageId}/status`,
        requestedAt: new Date().toISOString(),
        requestedBy: req.user?.sub
      });
      
    } catch (queueError) {
      console.warn('⚠️ Queue indisponible pour réanalyse:', queueError.message);
      
      await Image.findByIdAndUpdate(imageId, {
        'forensicAnalysis.status': 'pending',
        status: 'processing',
        $push: {
          auditLog: {
            action: 'REANALYSIS_REQUESTED_DIRECT',
            performedBy: req.user?.sub,
            details: { analysisType, fallback: true },
            timestamp: new Date()
          }
        }
      });
      
      res.json({
        success: true,
        message: 'Réanalyse forensique démarrée (traitement direct)',
        imageId,
        analysisType,
        status: 'reanalysis_pending_direct',
        requestedAt: new Date().toISOString(),
        requestedBy: req.user?.sub
      });
    }
  })
);

/**
 * @route GET /api/images/batch/status
 * @desc Statut batch avec cache et métriques avancées
 */
router.get('/batch/status', 
  auth, 
  requireRole(['forensic_analyst', 'admin']), 
  middlewareService.asyncHandler(async (req, res) => {
    const batchStatusCacheKey = 'batch_processing_status';
    const cachedStatus = await cacheService.getWithType('batch_status', batchStatusCacheKey);
    
    if (cachedStatus) {
      return res.json({
        ...cachedStatus,
        cached: true
      });
    }
    
    const Image = require('../models/Image');
    
    const batchStatus = await Image.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          lastUpdate: { $max: '$updatedAt' },
          averageSize: { $avg: '$size' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    let queueStats = null;
    try {
      const { analysisQueue } = require('../services/analysisQueue');
      if (analysisQueue) {
        const [waiting, active, completed, failed] = await Promise.all([
          analysisQueue.getWaiting(),
          analysisQueue.getActive(), 
          analysisQueue.getCompleted(),
          analysisQueue.getFailed()
        ]);
        
        queueStats = {
          waiting: waiting.length,
          active: active.length,
          completed: completed.length,
          failed: failed.length,
          total: waiting.length + active.length + completed.length + failed.length
        };
      }
    } catch (queueError) {
      console.warn('⚠️ Impossible de récupérer stats queue:', queueError.message);
    }
    
    const cacheStats = await cacheService.getStats();
    
    const result = {
      success: true,
      batchProcessing: {
        imageStatus: batchStatus,
        totalImages: batchStatus.reduce((sum, s) => sum + s.count, 0),
        queueStats,
        performance: {
          cacheHitRate: cacheStats?.keysByType || {},
          memoryUsage: cacheStats?.memory || {},
          totalCachedKeys: cacheStats?.keyspace?.totalKeys || 0
        }
      },
      generatedAt: new Date().toISOString()
    };
    
    await cacheService.setWithType('batch_status', batchStatusCacheKey, result, 30);
    
    res.json(result);
  })
);

/**
 * @route DELETE /api/images/cleanup/temp
 * @desc Nettoyage optimisé avec métriques et sécurité
 */
router.delete('/cleanup/temp', 
  auth, 
  requireRole(['admin']), 
  forensicLogging, 
  middlewareService.asyncHandler(async (req, res) => {
    const { olderThan = 24, dryRun = false } = req.query;
    const tempDir = './uploads/temp';
    const cutoffTime = Date.now() - (olderThan * 60 * 60 * 1000);
    
    let cleanedFiles = 0;
    let cleanedSize = 0;
    const cleanedList = [];
    
    try {
      await fs.promises.access(tempDir);
      const files = await fs.promises.readdir(tempDir);
      
      const cleanupPromises = files
        .filter(file => file !== '.gitkeep')
        .map(async (file) => {
          const filePath = path.join(tempDir, file);
          
          try {
            const stats = await fs.promises.stat(filePath);
            
            if (stats.mtime.getTime() < cutoffTime) {
              const fileInfo = {
                filename: file,
                size: stats.size,
                lastModified: stats.mtime.toISOString(),
                path: filePath
              };
              
              if (!dryRun) {
                await fs.promises.unlink(filePath);
                console.log(`🗑️ Supprimé: ${file} (${Math.round(stats.size / 1024)}KB)`);
              }
              
              cleanedSize += stats.size;
              cleanedFiles++;
              cleanedList.push(fileInfo);
            }
          } catch (fileError) {
            console.warn(`⚠️ Erreur traitement fichier ${file}:`, fileError.message);
          }
        });
      
      await Promise.allSettled(cleanupPromises);
      
    } catch (dirError) {
      console.warn(`⚠️ Répertoire temp inaccessible: ${tempDir}`);
    }
    
    const cleanupResult = {
      filesRemoved: cleanedFiles,
      sizeFreed: cleanedSize,
      sizeMB: Math.round(cleanedSize / 1024 / 1024 * 100) / 100,
      directory: tempDir,
      olderThanHours: olderThan,
      dryRun: Boolean(dryRun),
      fileList: dryRun ? cleanedList : cleanedList.slice(0, 10)
    };
    
    if (!dryRun && cleanedFiles > 0) {
      await cacheService.deletePattern('batch_status_*');
      await cacheService.deletePattern('image_stats_*');
    }
    
    console.log(`🧹 Nettoyage temp: ${cleanedFiles} fichiers, ${cleanupResult.sizeMB}MB libérés`);
    
    res.json({
      success: true,
      cleanup: cleanupResult,
      performedBy: req.user?.sub,
      completedAt: new Date().toISOString()
    });
  })
);

/**
 * @route GET /api/images/health
 * @desc Health check système images
 */
router.get('/health', 
  middlewareService.asyncHandler(async (req, res) => {
    const healthChecks = {};
    
    try {
      healthChecks.cache = await cacheService.healthCheck();
    } catch (error) {
      healthChecks.cache = { status: 'unhealthy', error: error.message };
    }
    
    const uploadDirs = ['./uploads/originals', './uploads/thumbnails', './uploads/temp'];
    healthChecks.storage = {};
    
    for (const dir of uploadDirs) {
      try {
        await fs.promises.access(dir, fs.constants.W_OK);
        healthChecks.storage[dir] = { status: 'healthy', writable: true };
      } catch (error) {
        healthChecks.storage[dir] = { status: 'unhealthy', error: 'Not writable' };
      }
    }
    
    try {
      const Image = require('../models/Image');
      await Image.countDocuments().limit(1);
      healthChecks.database = { status: 'healthy', connected: true };
    } catch (error) {
      healthChecks.database = { status: 'unhealthy', error: error.message };
    }
    
    try {
      const { analysisQueue } = require('../services/analysisQueue');
      const queueHealth = analysisQueue ? 'healthy' : 'unavailable';
      healthChecks.analysisQueue = { status: queueHealth };
    } catch (error) {
      healthChecks.analysisQueue = { status: 'unhealthy', error: error.message };
    }
    
    const allHealthy = Object.values(healthChecks).every(check => 
      check.status === 'healthy' || check.status === 'unavailable'
    );
    
    const overallStatus = allHealthy ? 'healthy' : 'degraded';
    
    res.status(overallStatus === 'healthy' ? 200 : 503).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: healthChecks,
      version: '3.0.0-ba7ath'
    });
  })
);

/**
 * @route GET /api/images/limits-check
 * @desc Debug configuration limites (DEV/ADMIN)
 */
router.get('/limits-check', 
  middlewareService.asyncHandler(async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        error: 'Accès refusé en production',
        type: 'ACCESS_DENIED'
      });
    }
    
    const limits = {
      environment: {
        MAX_FILE_SIZE: process.env.MAX_FILE_SIZE,
        MULTER_FILE_SIZE: process.env.MULTER_FILE_SIZE,
        EXPRESS_JSON_LIMIT: process.env.EXPRESS_JSON_LIMIT,
        EXPRESS_URLENCODED_LIMIT: process.env.EXPRESS_URLENCODED_LIMIT
      },
      calculated: {
        multerFileSizeBytes: parseInt(process.env.MULTER_FILE_SIZE) || 524288000,
        multerFileSizeMB: Math.round((parseInt(process.env.MULTER_FILE_SIZE) || 524288000) / 1024 / 1024),
        expressJsonLimit: process.env.EXPRESS_JSON_LIMIT || '500mb',
        expressUrlencodedLimit: process.env.EXPRESS_URLENCODED_LIMIT || '500mb'
      },
      cacheStats: await cacheService.getStats(),
      rateLimitStatus: rateLimitService.getStatus?.() || 'N/A'
    };
    
    res.json({
      success: true,
      message: 'Configuration des limites + status services',
      limits,
      timestamp: new Date().toISOString()
    });
  })
);

// =====================================
// GESTION D'ERREURS OPTIMISÉE BA7ATH
// =====================================

router.use(middlewareService.errorHandler({
  cleanup: async (req) => {
    const cleanupPromises = [];
    
    if (req.file?.path && fs.existsSync(req.file.path)) {
      cleanupPromises.push(
        fs.promises.unlink(req.file.path)
          .then(() => console.log('🗑️ Fichier temporaire nettoyé après erreur'))
          .catch(err => console.warn('⚠️ Erreur nettoyage fichier:', err.message))
      );
    }
    
    if (req.files?.length > 0) {
      req.files.forEach(file => {
        if (file.path && fs.existsSync(file.path)) {
          cleanupPromises.push(
            fs.promises.unlink(file.path)
              .then(() => console.log(`🗑️ Fichier multiple nettoyé: ${file.filename}`))
              .catch(err => console.warn('⚠️ Erreur nettoyage fichier multiple:', err.message))
          );
        }
      });
    }
    
    if (cleanupPromises.length > 0) {
      await Promise.allSettled(cleanupPromises);
    }
  },
  
  enrichError: (error, req) => {
    const enriched = {
      ...error,
      context: {
        route: 'images',
        method: req.method,
        path: req.path,
        hasFile: !!req.file,
        hasFiles: !!(req.files?.length > 0),
        fileCount: req.files?.length || 0
      }
    };
    
    if (process.env.NODE_ENV === 'development') {
      enriched.debug = {
        query: req.query,
        body: req.body,
        headers: {
          'content-type': req.headers['content-type'],
          'content-length': req.headers['content-length'],
          'user-agent': req.headers['user-agent']?.substring(0, 50)
        }
      };
    }
    
    return enriched;
  }
}));

module.exports = router;
