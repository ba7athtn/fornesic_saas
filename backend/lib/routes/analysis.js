"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var express = require('express');
var router = express.Router();
var rateLimit = require('express-rate-limit');

// Contrôleurs forensiques
var _require = require('../controllers/analysisController'),
  getComprehensiveAnalysis = _require.getComprehensiveAnalysis,
  initiateForensicAnalysis = _require.initiateForensicAnalysis,
  getAnalysisStatus = _require.getAnalysisStatus,
  compareForensicAnalyses = _require.compareForensicAnalyses,
  getForensicStatistics = _require.getForensicStatistics;

// Middlewares
var _require2 = require('../middleware/auth'),
  auth = _require2.auth,
  requireRole = _require2.requireRole,
  requirePrivacyMode = _require2.requirePrivacyMode,
  forensicLogging = _require2.forensicLogging;
var _require3 = require('../middleware/validation'),
  validateForensicObjectId = _require3.validateForensicObjectId,
  validateForensicQuery = _require3.validateForensicQuery,
  validateForensicBody = _require3.validateForensicBody;

// =====================================
// RATE LIMITING FORENSIQUE - CORRIGÉ
// =====================================

var forensicAnalysisRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 50,
  // Maximum 50 analyses par fenêtre
  message: {
    error: 'Trop de demandes d\'analyse forensique',
    type: 'FORENSIC_RATE_LIMIT_EXCEEDED',
    retryAfter: 900 // 15 minutes en secondes
  },
  standardHeaders: true,
  legacyHeaders: false,
  // CORRIGÉ - KeyGenerator simple
  keyGenerator: function keyGenerator(req) {
    var _req$user;
    return "".concat(req.ip, "-").concat(((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.sub) || 'anonymous');
  },
  validate: {
    keyGeneratorIpFallback: false // Désactive le warning IPv6
  },
  handler: function handler(req, res) {
    var _req$user2;
    console.warn('🚨 Rate limit forensique dépassé:', {
      ip: req.ip,
      userId: (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.sub,
      endpoint: req.path,
      timestamp: new Date().toISOString()
    });
    res.status(429).json({
      error: 'Limite de requêtes forensiques dépassée',
      type: 'FORENSIC_RATE_LIMIT_EXCEEDED',
      maxRequests: 50,
      windowMinutes: 15,
      retryAfter: 900,
      timestamp: new Date().toISOString()
    });
  }
});

// =====================================
// ROUTES ANALYSE FORENSIQUE AVANCÉE
// =====================================

/**
 * @route GET /api/analysis/:imageId
 * @desc Obtenir l'analyse forensique complète d'une image avec tous les 7 piliers
 * @access Private - Requires authentication
 * @param {string} imageId - ID MongoDB de l'image
 * @query {string} includePillars - Piliers à inclure (comma-separated ou 'all')
 * @query {string} format - Format de réponse (json, summary)
 */
router.get('/:imageId', auth, forensicLogging, validateForensicObjectId('imageId'), validateForensicQuery, getComprehensiveAnalysis);

/**
 * @route POST /api/analysis/:imageId
 * @desc Initier une nouvelle analyse forensique avec configuration des 7 piliers
 * @access Private - Requires forensic role
 * @param {string} imageId - ID MongoDB de l'image
 * @body {object} enabledPillars - Configuration des piliers à activer
 * @body {object} customWeights - Poids personnalisés pour chaque pilier
 * @body {string} privacyMode - Mode de confidentialité (JUDICIAL, COMMERCIAL, RESEARCH)
 */
router.post('/:imageId', forensicAnalysisRateLimit, auth, requireRole(['forensic_analyst', 'admin']), forensicLogging, validateForensicObjectId('imageId'), validateForensicBody, initiateForensicAnalysis);

/**
 * @route GET /api/analysis/:analysisId/status
 * @desc Obtenir le statut en temps réel d'une analyse forensique
 * @access Private
 * @param {string} analysisId - ID de l'analyse
 */
router.get('/:analysisId/status', auth, validateForensicObjectId('analysisId'), getAnalysisStatus);

/**
 * @route POST /api/analysis/compare
 * @desc Comparer deux analyses forensiques avec détection de patterns
 * @access Private - Requires forensic role
 * @body {string} imageId1 - ID de la première image
 * @body {string} imageId2 - ID de la seconde image
 * @body {string} comparisonMode - Mode de comparaison (comprehensive, quick, pillars)
 */
router.post('/compare', forensicAnalysisRateLimit, auth, requireRole(['forensic_analyst', 'expert', 'admin']), forensicLogging, validateForensicBody, compareForensicAnalyses);

/**
 * @route GET /api/analysis/statistics
 * @desc Obtenir statistiques globales d'analyse avec métriques forensiques
 * @access Private - Requires analyst role
 * @query {string} period - Période d'analyse (7d, 30d, 90d)
 * @query {string} breakdown - Type de répartition (risk, pillar, time)
 */
router.get('/statistics', auth, requireRole(['forensic_analyst', 'admin', 'auditor']), validateForensicQuery, getForensicStatistics);

/**
 * @route GET /api/analysis/session/:sessionId
 * @desc Obtenir résumé forensique d'une session complète
 * @access Private
 * @param {string} sessionId - ID de la session
 */
router.get('/session/:sessionId', auth, forensicLogging, validateForensicQuery, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var sessionId, _req$query$includeDet, includeDetails, _require4, getSessionSummary, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          sessionId = req.params.sessionId;
          _req$query$includeDet = req.query.includeDetails, includeDetails = _req$query$includeDet === void 0 ? 'false' : _req$query$includeDet; // Import du contrôleur legacy adapté
          _require4 = require('../controllers/analysisController'), getSessionSummary = _require4.getSessionSummary; // Adapter la requête pour le nouveau système
          req.params.sessionId = sessionId;
          req.query.includeDetails = includeDetails;
          _context.n = 1;
          return getSessionSummary(req, res);
        case 1:
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          console.error('❌ Erreur session analysis:', _t);
          res.status(500).json({
            error: 'Erreur récupération analyse session',
            type: 'SESSION_ANALYSIS_ERROR'
          });
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

/**
 * @route POST /api/analysis/batch
 * @desc Lancer analyse batch pour plusieurs images
 * @access Private - Requires forensic role
 * @body {array} imageIds - Liste des IDs d'images
 * @body {object} batchConfig - Configuration batch
 */
router.post('/batch', forensicAnalysisRateLimit, auth, requireRole(['forensic_analyst', 'admin']), requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']), forensicLogging, validateForensicBody, /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$body, imageIds, _req$body$batchConfig, batchConfig, batchId, results, concurrencyLimit, i, batch, batchPromises, batchResults, successCount, errorCount, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _req$body = req.body, imageIds = _req$body.imageIds, _req$body$batchConfig = _req$body.batchConfig, batchConfig = _req$body$batchConfig === void 0 ? {} : _req$body$batchConfig;
          if (!(!imageIds || !Array.isArray(imageIds) || imageIds.length === 0)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, res.status(400).json({
            error: 'Liste d\'IDs d\'images requise',
            type: 'MISSING_IMAGE_IDS'
          }));
        case 1:
          if (!(imageIds.length > 50)) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, res.status(400).json({
            error: 'Maximum 50 images par batch',
            type: 'BATCH_SIZE_EXCEEDED',
            maxSize: 50,
            provided: imageIds.length
          }));
        case 2:
          batchId = require('crypto').randomBytes(8).toString('hex');
          results = []; // Lancer analyses en parallèle avec limite
          concurrencyLimit = 5;
          i = 0;
        case 3:
          if (!(i < imageIds.length)) {
            _context3.n = 6;
            break;
          }
          batch = imageIds.slice(i, i + concurrencyLimit);
          batchPromises = batch.map(/*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(imageId) {
              var _require5, _initiateForensicAnalysis, mockReq, mockRes, result, _t2;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.p = _context2.n) {
                  case 0:
                    _context2.p = 0;
                    // Simuler initiation analyse
                    _require5 = require('../controllers/analysisController'), _initiateForensicAnalysis = _require5.initiateForensicAnalysis;
                    mockReq = {
                      params: {
                        imageId: imageId
                      },
                      body: {
                        enabledPillars: batchConfig.enabledPillars || {},
                        privacyMode: req.privacyMode,
                        priority: 'batch'
                      },
                      user: req.user,
                      ip: req.ip,
                      privacyMode: req.privacyMode
                    };
                    mockRes = {
                      status: function status() {
                        return mockRes;
                      },
                      json: function json(data) {
                        return data;
                      }
                    };
                    _context2.n = 1;
                    return _initiateForensicAnalysis(mockReq, mockRes);
                  case 1:
                    result = _context2.v;
                    return _context2.a(2, {
                      imageId: imageId,
                      success: true,
                      analysisId: result === null || result === void 0 ? void 0 : result.analysisId
                    });
                  case 2:
                    _context2.p = 2;
                    _t2 = _context2.v;
                    return _context2.a(2, {
                      imageId: imageId,
                      success: false,
                      error: _t2.message
                    });
                }
              }, _callee2, null, [[0, 2]]);
            }));
            return function (_x5) {
              return _ref3.apply(this, arguments);
            };
          }());
          _context3.n = 4;
          return Promise.allSettled(batchPromises);
        case 4:
          batchResults = _context3.v;
          results.push.apply(results, _toConsumableArray(batchResults.map(function (r) {
            return r.value || {
              success: false,
              error: 'Promise rejected'
            };
          })));
        case 5:
          i += concurrencyLimit;
          _context3.n = 3;
          break;
        case 6:
          successCount = results.filter(function (r) {
            return r.success;
          }).length;
          errorCount = results.length - successCount;
          res.status(202).json({
            success: true,
            message: "Analyse batch initi\xE9e: ".concat(successCount, " succ\xE8s, ").concat(errorCount, " erreurs"),
            batchId: batchId,
            summary: {
              total: imageIds.length,
              successful: successCount,
              failed: errorCount
            },
            results: results,
            trackingUrl: "/api/analysis/batch/".concat(batchId, "/status"),
            timestamp: new Date().toISOString()
          });
          _context3.n = 8;
          break;
        case 7:
          _context3.p = 7;
          _t3 = _context3.v;
          console.error('❌ Erreur batch analysis:', _t3);
          res.status(500).json({
            error: 'Erreur analyse batch',
            type: 'BATCH_ANALYSIS_ERROR'
          });
        case 8:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 7]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

/**
 * @route POST /api/analysis/search
 * @desc Recherche forensique avancée par métadonnées et résultats
 * @access Private - Requires analyst role
 * @body {object} criteria - Critères de recherche
 */
router.post('/search', auth, requireRole(['forensic_analyst', 'admin']), validateForensicBody, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var _req$body2, camera, dateRange, gpsRadius, software, minAuthenticityScore, maxRiskScore, flagTypes, pillarScores, Image, Analysis, query, analysisQuery, images, filteredImages, _require6, calculateLocationDistance, formattedResults, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _req$body2 = req.body, camera = _req$body2.camera, dateRange = _req$body2.dateRange, gpsRadius = _req$body2.gpsRadius, software = _req$body2.software, minAuthenticityScore = _req$body2.minAuthenticityScore, maxRiskScore = _req$body2.maxRiskScore, flagTypes = _req$body2.flagTypes, pillarScores = _req$body2.pillarScores;
          Image = require('../models/Image');
          Analysis = require('../models/Analysis'); // Construire requête MongoDB complexe
          query = {};
          analysisQuery = {}; // Filtres EXIF
          if (camera !== null && camera !== void 0 && camera.make) query['exifData.camera.make'] = new RegExp(camera.make, 'i');
          if (camera !== null && camera !== void 0 && camera.model) query['exifData.camera.model'] = new RegExp(camera.model, 'i');
          if (software) query['exifData.software.creator'] = new RegExp(software, 'i');

          // Filtres temporels
          if (dateRange !== null && dateRange !== void 0 && dateRange.start && dateRange !== null && dateRange !== void 0 && dateRange.end) {
            query['exifData.timestamps.dateTimeOriginal'] = {
              $gte: new Date(dateRange.start),
              $lte: new Date(dateRange.end)
            };
          }

          // Filtres scores
          if (minAuthenticityScore) {
            query.authenticityScore = {
              $gte: minAuthenticityScore
            };
          }

          // Filtres flags
          if (flagTypes && flagTypes.length > 0) {
            query['forensicAnalysis.flags.type'] = {
              $in: flagTypes
            };
          }

          // Exécuter recherche avec limite
          _context4.n = 1;
          return Image.find(query).select('originalName exifData authenticityScore riskClassification forensicAnalysis.flags createdAt').sort({
            createdAt: -1
          }).limit(100).lean();
        case 1:
          images = _context4.v;
          // Post-filtrage GPS si nécessaire
          filteredImages = images;
          if (gpsRadius !== null && gpsRadius !== void 0 && gpsRadius.lat && gpsRadius !== null && gpsRadius !== void 0 && gpsRadius.lng && gpsRadius !== null && gpsRadius !== void 0 && gpsRadius.radius) {
            _require6 = require('../utils/geoUtils'), calculateLocationDistance = _require6.calculateLocationDistance;
            filteredImages = images.filter(function (img) {
              var _img$exifData;
              var gps = (_img$exifData = img.exifData) === null || _img$exifData === void 0 ? void 0 : _img$exifData.gps;
              if (!(gps !== null && gps !== void 0 && gps.latitude) || !(gps !== null && gps !== void 0 && gps.longitude)) return false;
              var distance = calculateLocationDistance({
                latitude: gpsRadius.lat,
                longitude: gpsRadius.lng
              }, gps);
              return distance <= gpsRadius.radius;
            });
          }

          // Formater résultats
          formattedResults = filteredImages.map(function (img) {
            var _img$exifData2, _img$exifData3, _img$riskClassificati, _img$forensicAnalysis;
            return {
              id: img._id,
              filename: img.originalName,
              camera: (_img$exifData2 = img.exifData) !== null && _img$exifData2 !== void 0 && _img$exifData2.camera ? "".concat(img.exifData.camera.make || '', " ").concat(img.exifData.camera.model || '').trim() : null,
              timestamp: (_img$exifData3 = img.exifData) === null || _img$exifData3 === void 0 || (_img$exifData3 = _img$exifData3.timestamps) === null || _img$exifData3 === void 0 ? void 0 : _img$exifData3.dateTimeOriginal,
              authenticityScore: img.authenticityScore || 0,
              riskLevel: (_img$riskClassificati = img.riskClassification) === null || _img$riskClassificati === void 0 ? void 0 : _img$riskClassificati.level,
              flagsCount: ((_img$forensicAnalysis = img.forensicAnalysis) === null || _img$forensicAnalysis === void 0 || (_img$forensicAnalysis = _img$forensicAnalysis.flags) === null || _img$forensicAnalysis === void 0 ? void 0 : _img$forensicAnalysis.length) || 0,
              uploadDate: img.createdAt
            };
          });
          res.json({
            total: formattedResults.length,
            results: formattedResults,
            searchCriteria: {
              camera: camera,
              dateRange: dateRange,
              gpsRadius: gpsRadius,
              software: software,
              minAuthenticityScore: minAuthenticityScore
            },
            timestamp: new Date().toISOString()
          });
          _context4.n = 3;
          break;
        case 2:
          _context4.p = 2;
          _t4 = _context4.v;
          console.error('❌ Erreur forensic search:', _t4);
          res.status(500).json({
            error: 'Erreur recherche forensique',
            type: 'FORENSIC_SEARCH_ERROR'
          });
        case 3:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return function (_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}());

// =====================================
// GESTION D'ERREURS ROUTES
// =====================================

router.use(function (error, req, res, next) {
  console.error('❌ Erreur route analysis:', error);
  res.status(error.status || 500).json(_objectSpread({
    error: error.message || 'Erreur interne route analysis',
    type: 'ANALYSIS_ROUTE_ERROR',
    timestamp: new Date().toISOString()
  }, process.env.NODE_ENV === 'development' && {
    stack: error.stack
  }));
});
module.exports = router;