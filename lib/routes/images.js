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

/**
 * @route GET /api/images/statistics/overview
 * @desc Obtenir statistiques globales des images
 * @access Private - Requires analyst role
 */
router.get('/statistics/overview', auth, requireRole(['forensic_analyst', 'admin']), /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$query$period, period, Image, periodMs, startDate, stats, overview, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _req$query$period = req.query.period, period = _req$query$period === void 0 ? '30d' : _req$query$period;
          Image = require('../models/Image');
          periodMs = {
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
            '90d': 90 * 24 * 60 * 60 * 1000
          }[period] || 30 * 24 * 60 * 60 * 1000;
          startDate = new Date(Date.now() - periodMs);
          _context4.n = 1;
          return Image.aggregate([{
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
              analyzedImages: {
                $sum: {
                  $cond: [{
                    $eq: ['$status', 'analyzed']
                  }, 1, 0]
                }
              },
              quarantinedImages: {
                $sum: {
                  $cond: [{
                    $ne: ['$quarantine.status', 'none']
                  }, 1, 0]
                }
              },
              averageFileSize: {
                $avg: '$size'
              },
              averageAuthenticityScore: {
                $avg: '$authenticityScore'
              },
              totalFlags: {
                $sum: {
                  $size: {
                    $ifNull: ['$forensicAnalysis.flags', []]
                  }
                }
              }
            }
          }]);
        case 1:
          stats = _context4.v;
          overview = stats[0] || {};
          res.json({
            period: period,
            dateRange: {
              start: startDate.toISOString(),
              end: new Date().toISOString()
            },
            statistics: {
              totalImages: overview.totalImages || 0,
              analyzedImages: overview.analyzedImages || 0,
              quarantinedImages: overview.quarantinedImages || 0,
              analysisRate: overview.totalImages > 0 ? Math.round(overview.analyzedImages / overview.totalImages * 100) : 0,
              averageFileSize: Math.round(overview.averageFileSize || 0),
              averageAuthenticityScore: Math.round(overview.averageAuthenticityScore || 0),
              totalSecurityFlags: overview.totalFlags || 0
            },
            generatedAt: new Date().toISOString()
          });
          _context4.n = 3;
          break;
        case 2:
          _context4.p = 2;
          _t4 = _context4.v;
          console.error('❌ Erreur statistics overview:', _t4);
          res.status(500).json({
            error: 'Erreur statistiques images',
            type: 'STATISTICS_ERROR'
          });
        case 3:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

/**
 * @route GET /api/images/:imageId/metadata
 * @desc Obtenir métadonnées complètes d'une image
 * @access Public (avec authentification optionnelle)
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/metadata', optionalAuth, validateForensicObjectId('imageId'), /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _image$forensicAnalys, imageId, Image, image, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          imageId = req.params.imageId;
          Image = require('../models/Image');
          _context5.n = 1;
          return Image.findById(imageId).select('metadata exif forensicAnalysis.pillars authenticityScore classification').lean();
        case 1:
          image = _context5.v;
          if (image) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND'
          }));
        case 2:
          res.json({
            success: true,
            imageId: imageId,
            metadata: image.metadata,
            exif: image.exif,
            forensicPillars: (_image$forensicAnalys = image.forensicAnalysis) === null || _image$forensicAnalys === void 0 ? void 0 : _image$forensicAnalys.pillars,
            authenticityScore: image.authenticityScore,
            classification: image.classification,
            retrievedAt: new Date().toISOString()
          });
          _context5.n = 4;
          break;
        case 3:
          _context5.p = 3;
          _t5 = _context5.v;
          console.error('❌ Erreur metadata route:', _t5);
          res.status(500).json({
            error: 'Erreur récupération métadonnées',
            type: 'METADATA_ERROR'
          });
        case 4:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 3]]);
  }));
  return function (_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}());

/**
 * @route POST /api/images/:imageId/reanalyze
 * @desc Relancer analyse forensique d'une image
 * @access Private - Requires analyst role
 * @param {string} imageId - ID MongoDB de l'image
 */
router.post('/:imageId/reanalyze', auth, requireRole(['forensic_analyst', 'admin']), forensicLogging, validateForensicObjectId('imageId'), /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var _image$files3, _req$user6, _req$user7, _req$user8, imageId, _req$body$analysisTyp, analysisType, Image, image, _fs3, _require5, addAnalysisJob, _t6, _t7;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          imageId = req.params.imageId;
          _req$body$analysisTyp = req.body.analysisType, analysisType = _req$body$analysisTyp === void 0 ? 'full' : _req$body$analysisTyp;
          Image = require('../models/Image');
          _context6.n = 1;
          return Image.findById(imageId);
        case 1:
          image = _context6.v;
          if (image) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND'
          }));
        case 2:
          _fs3 = require('fs');
          if (_fs3.existsSync((_image$files3 = image.files) === null || _image$files3 === void 0 ? void 0 : _image$files3.original)) {
            _context6.n = 3;
            break;
          }
          return _context6.a(2, res.status(404).json({
            error: 'Fichier image introuvable pour réanalyse',
            type: 'FILE_NOT_FOUND'
          }));
        case 3:
          _context6.n = 4;
          return Image.findByIdAndUpdate(imageId, {
            'forensicAnalysis.status': 'pending',
            'forensicAnalysis.reanalysisRequested': true,
            'forensicAnalysis.reanalysisRequestedAt': new Date(),
            'forensicAnalysis.reanalysisRequestedBy': (_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.sub,
            status: 'processing',
            $push: {
              auditLog: {
                action: 'REANALYSIS_REQUESTED',
                performedBy: (_req$user7 = req.user) === null || _req$user7 === void 0 ? void 0 : _req$user7.sub,
                details: {
                  analysisType: analysisType
                },
                timestamp: new Date()
              }
            }
          });
        case 4:
          _context6.p = 4;
          _require5 = require('../services/analysisQueue'), addAnalysisJob = _require5.addAnalysisJob;
          _context6.n = 5;
          return addAnalysisJob(imageId, image.files.original, {
            priority: 'high',
            type: analysisType
          });
        case 5:
          console.log("\uD83D\uDCCB R\xE9analyse ajout\xE9e \xE0 la queue: ".concat(imageId));
          _context6.n = 7;
          break;
        case 6:
          _context6.p = 6;
          _t6 = _context6.v;
          console.warn('⚠️ Queue indisponible pour réanalyse, traitement direct');
        case 7:
          res.json({
            success: true,
            message: 'Réanalyse forensique démarrée',
            imageId: imageId,
            analysisType: analysisType,
            status: 'reanalysis_pending',
            estimatedTime: '30-120 seconds',
            requestedAt: new Date().toISOString(),
            requestedBy: (_req$user8 = req.user) === null || _req$user8 === void 0 ? void 0 : _req$user8.sub
          });
          _context6.n = 9;
          break;
        case 8:
          _context6.p = 8;
          _t7 = _context6.v;
          console.error('❌ Erreur reanalyze route:', _t7);
          res.status(500).json({
            error: 'Erreur réanalyse forensique',
            type: 'REANALYSIS_ERROR'
          });
        case 9:
          return _context6.a(2);
      }
    }, _callee6, null, [[4, 6], [0, 8]]);
  }));
  return function (_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}());

/**
 * @route GET /api/images/batch/status
 * @desc Obtenir statut de traitement batch
 * @access Private - Requires analyst role
 */
router.get('/batch/status', auth, requireRole(['forensic_analyst', 'admin']), /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var Image, batchStatus, queueStats, _require6, analysisQueue, _t8, _t9, _t0, _t1, _t10, _t11;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          Image = require('../models/Image');
          _context7.n = 1;
          return Image.aggregate([{
            $group: {
              _id: '$status',
              count: {
                $sum: 1
              },
              lastUpdate: {
                $max: '$updatedAt'
              }
            }
          }, {
            $sort: {
              count: -1
            }
          }]);
        case 1:
          batchStatus = _context7.v;
          queueStats = null;
          _context7.p = 2;
          _require6 = require('../services/analysisQueue'), analysisQueue = _require6.analysisQueue;
          if (!analysisQueue) {
            _context7.n = 7;
            break;
          }
          _context7.n = 3;
          return analysisQueue.getWaiting().length;
        case 3:
          _t8 = _context7.v;
          _context7.n = 4;
          return analysisQueue.getActive().length;
        case 4:
          _t9 = _context7.v;
          _context7.n = 5;
          return analysisQueue.getCompleted().length;
        case 5:
          _t0 = _context7.v;
          _context7.n = 6;
          return analysisQueue.getFailed().length;
        case 6:
          _t1 = _context7.v;
          queueStats = {
            waiting: _t8,
            active: _t9,
            completed: _t0,
            failed: _t1
          };
        case 7:
          _context7.n = 9;
          break;
        case 8:
          _context7.p = 8;
          _t10 = _context7.v;
          console.warn('⚠️ Impossible de récupérer stats queue');
        case 9:
          res.json({
            success: true,
            batchProcessing: {
              imageStatus: batchStatus,
              totalImages: batchStatus.reduce(function (sum, s) {
                return sum + s.count;
              }, 0),
              queueStats: queueStats
            },
            generatedAt: new Date().toISOString()
          });
          _context7.n = 11;
          break;
        case 10:
          _context7.p = 10;
          _t11 = _context7.v;
          console.error('❌ Erreur batch status:', _t11);
          res.status(500).json({
            error: 'Erreur récupération statut batch',
            type: 'BATCH_STATUS_ERROR'
          });
        case 11:
          return _context7.a(2);
      }
    }, _callee7, null, [[2, 8], [0, 10]]);
  }));
  return function (_x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}());

/**
 * @route DELETE /api/images/cleanup/temp
 * @desc Nettoyage des fichiers temporaires (maintenance)
 * @access Private - Requires admin role
 */
router["delete"]('/cleanup/temp', auth, requireRole(['admin']), forensicLogging, /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var _req$user9, _fs4, path, _req$query$olderThan, olderThan, tempDir, cutoffTime, cleanedFiles, cleanedSize, files, _iterator, _step, file, filePath, stats, _t12, _t13;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _fs4 = require('fs').promises;
          path = require('path');
          _req$query$olderThan = req.query.olderThan, olderThan = _req$query$olderThan === void 0 ? 24 : _req$query$olderThan;
          tempDir = './uploads/temp';
          cutoffTime = Date.now() - olderThan * 60 * 60 * 1000;
          cleanedFiles = 0;
          cleanedSize = 0;
          _context8.n = 1;
          return _fs4.access(tempDir).then(function () {
            return true;
          })["catch"](function () {
            return false;
          });
        case 1:
          if (!_context8.v) {
            _context8.n = 12;
            break;
          }
          _context8.n = 2;
          return _fs4.readdir(tempDir);
        case 2:
          files = _context8.v;
          _iterator = _createForOfIteratorHelper(files);
          _context8.p = 3;
          _iterator.s();
        case 4:
          if ((_step = _iterator.n()).done) {
            _context8.n = 9;
            break;
          }
          file = _step.value;
          if (!(file === '.gitkeep')) {
            _context8.n = 5;
            break;
          }
          return _context8.a(3, 8);
        case 5:
          filePath = path.join(tempDir, file);
          _context8.n = 6;
          return _fs4.stat(filePath);
        case 6:
          stats = _context8.v;
          if (!(stats.mtime.getTime() < cutoffTime)) {
            _context8.n = 8;
            break;
          }
          cleanedSize += stats.size;
          _context8.n = 7;
          return _fs4.unlink(filePath);
        case 7:
          cleanedFiles++;
        case 8:
          _context8.n = 4;
          break;
        case 9:
          _context8.n = 11;
          break;
        case 10:
          _context8.p = 10;
          _t12 = _context8.v;
          _iterator.e(_t12);
        case 11:
          _context8.p = 11;
          _iterator.f();
          return _context8.f(11);
        case 12:
          console.log("\uD83E\uDDF9 Nettoyage temp: ".concat(cleanedFiles, " fichiers, ").concat(Math.round(cleanedSize / 1024 / 1024), "MB lib\xE9r\xE9s"));
          res.json({
            success: true,
            cleanup: {
              filesRemoved: cleanedFiles,
              sizeFreed: cleanedSize,
              directory: tempDir,
              olderThanHours: olderThan
            },
            performedBy: (_req$user9 = req.user) === null || _req$user9 === void 0 ? void 0 : _req$user9.sub,
            completedAt: new Date().toISOString()
          });
          _context8.n = 14;
          break;
        case 13:
          _context8.p = 13;
          _t13 = _context8.v;
          console.error('❌ Erreur cleanup temp:', _t13);
          res.status(500).json({
            error: 'Erreur nettoyage fichiers temporaires',
            type: 'CLEANUP_ERROR'
          });
        case 14:
          return _context8.a(2);
      }
    }, _callee8, null, [[3, 10, 11, 12], [0, 13]]);
  }));
  return function (_x13, _x14) {
    return _ref8.apply(this, arguments);
  };
}());

// =====================================
// GESTION D'ERREURS ROUTES
// =====================================

router.use(function (error, req, res, next) {
  console.error('❌ Erreur route images:', error);
  if (req.file && error) {
    var _fs5 = require('fs');
    try {
      if (_fs5.existsSync(req.file.path)) {
        _fs5.unlinkSync(req.file.path);
        console.log('🗑️ Fichier temporaire nettoyé après erreur route');
      }
    } catch (cleanupError) {
      console.error('⚠️ Erreur nettoyage fichier:', cleanupError);
    }
  }
  if (req.files && req.files.length > 0) {
    req.files.forEach(function (file) {
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
          console.log("\uD83D\uDDD1\uFE0F Fichier multiple nettoy\xE9: ".concat(file.filename));
        }
      } catch (cleanupError) {
        console.error('⚠️ Erreur nettoyage fichier multiple:', cleanupError);
      }
    });
  }
  var statusCode = error.status || 500;
  var errorResponse = {
    error: error.message || 'Erreur interne route images',
    type: error.type || 'IMAGES_ROUTE_ERROR',
    timestamp: new Date().toISOString(),
    requestId: req.requestId || 'unknown'
  };
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
    errorResponse.details = {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body
    };
  }
  res.status(statusCode).json(errorResponse);
});

// =====================================
// EXPORT DU ROUTER
// =====================================

module.exports = router;