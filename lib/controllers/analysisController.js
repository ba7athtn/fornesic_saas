"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var mongoose = require('mongoose');
var Image = require('../models/Image');
var Analysis = require('../models/Analysis');
var crypto = require('crypto');

// =====================================
// CONTRÔLEUR ANALYSE FORENSIQUE AVANCÉE - OPTIMISÉ
// =====================================

// Validation ObjectId optimisée
var validateObjectId = function validateObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return new mongoose.Types.ObjectId(id);
};

// Cache pour analyses fréquentes
var analysisCache = new Map();
var CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Sanitization des entrées
var sanitizeInput = function sanitizeInput(input) {
  return typeof input === 'string' ? input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') : input;
};

/**
 * Obtenir l'analyse complète d'une image avec tous les piliers forensiques
 */
exports.getComprehensiveAnalysis = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var startTime, requestId, _image$riskClassifica, _image$riskClassifica2, _image$forensicAnalys, _image$hash, _analysisData$aggrega, _analysisData$aggrega2, _analysisData$aggrega3, _analysisData$consoli, _analysisData$consoli2, _analysisData$consoli3, _analysisData$consoli4, _req$user, imageId, _req$query, _req$query$includePil, includePillars, _req$query$format, format, objectId, cacheKey, cached, _yield$Promise$all, _yield$Promise$all2, image, analysis, statusMessages, analysisData, requestedPillars, forensicResponse, _req$user2, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          startTime = Date.now();
          requestId = crypto.randomBytes(8).toString('hex');
          _context.p = 1;
          imageId = req.params.imageId;
          _req$query = req.query, _req$query$includePil = _req$query.includePillars, includePillars = _req$query$includePil === void 0 ? 'all' : _req$query$includePil, _req$query$format = _req$query.format, format = _req$query$format === void 0 ? 'json' : _req$query$format; // Validation ObjectId optimisée
          objectId = req.forensicObjectId || validateObjectId(imageId);
          console.log("\uD83D\uDD0D R\xE9cup\xE9ration analyse compl\xE8te: ".concat(imageId, " [").concat(requestId, "]"));

          // Vérification cache
          cacheKey = "analysis-".concat(imageId, "-").concat(includePillars);
          if (!analysisCache.has(cacheKey)) {
            _context.n = 3;
            break;
          }
          cached = analysisCache.get(cacheKey);
          if (!(Date.now() - cached.timestamp < CACHE_TTL)) {
            _context.n = 2;
            break;
          }
          console.log("\uD83D\uDCBE Cache hit pour analyse: ".concat(imageId, " [").concat(requestId, "]"));
          return _context.a(2, res.json(cached.data));
        case 2:
          analysisCache["delete"](cacheKey);
        case 3:
          _context.n = 4;
          return Promise.all([Image.findById(objectId).select('originalName status authenticityScore riskClassification forensicAnalysis exifData createdAt size hash').lean(), Analysis.findOne({
            imageId: objectId
          }).lean()]);
        case 4:
          _yield$Promise$all = _context.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          image = _yield$Promise$all2[0];
          analysis = _yield$Promise$all2[1];
          if (image) {
            _context.n = 5;
            break;
          }
          return _context.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND',
            imageId: imageId,
            requestId: requestId,
            timestamp: new Date().toISOString()
          }));
        case 5:
          if (!(image.status !== 'analyzed')) {
            _context.n = 6;
            break;
          }
          statusMessages = {
            'uploaded': 'Image uploadée, analyse non démarrée',
            'processing': 'Analyse en cours - Veuillez patienter',
            'error': 'Erreur lors de l\'analyse',
            'quarantined': 'Image mise en quarantaine pour sécurité'
          };
          return _context.a(2, res.status(202).json({
            error: 'Analyse non disponible',
            type: 'ANALYSIS_NOT_READY',
            status: image.status,
            message: statusMessages[image.status] || 'Statut inconnu',
            estimatedCompletion: image.status === 'processing' ? new Date(Date.now() + 300000).toISOString() : null,
            // +5min
            requestId: requestId,
            timestamp: new Date().toISOString()
          }));
        case 6:
          if (!(!analysis && !image.forensicAnalysis)) {
            _context.n = 7;
            break;
          }
          return _context.a(2, res.status(404).json({
            error: 'Données d\'analyse manquantes',
            type: 'ANALYSIS_DATA_MISSING',
            details: 'L\'image est marquée comme analysée mais les données sont indisponibles',
            requestId: requestId,
            timestamp: new Date().toISOString()
          }));
        case 7:
          // Utiliser Analysis moderne ou fallback sur forensicAnalysis legacy
          analysisData = analysis || {
            imageId: objectId,
            aggregatedScore: {
              authenticity: image.authenticityScore,
              riskLevel: (_image$riskClassifica = image.riskClassification) === null || _image$riskClassifica === void 0 ? void 0 : _image$riskClassifica.level,
              confidence: (_image$riskClassifica2 = image.riskClassification) === null || _image$riskClassifica2 === void 0 ? void 0 : _image$riskClassifica2.confidence
            },
            // Mapper forensicAnalysis legacy vers structure moderne
            anatomicalAnalysis: extractPillarData(image.forensicAnalysis, 'anatomical'),
            physicsAnalysis: extractPillarData(image.forensicAnalysis, 'physics'),
            statisticalAnalysis: extractPillarData(image.forensicAnalysis, 'statistical'),
            exifForensics: extractPillarData(image.forensicAnalysis, 'exif'),
            behavioralAnalysis: extractPillarData(image.forensicAnalysis, 'behavioral'),
            audioForensics: extractPillarData(image.forensicAnalysis, 'audio'),
            expertAnalysis: extractPillarData(image.forensicAnalysis, 'expert'),
            consolidatedFlags: ((_image$forensicAnalys = image.forensicAnalysis) === null || _image$forensicAnalys === void 0 ? void 0 : _image$forensicAnalys.flags) || []
          }; // Filtrer piliers demandés
          requestedPillars = includePillars === 'all' ? ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'] : includePillars.split(',').map(function (p) {
            return p.trim();
          }); // Construire réponse forensique complète
          forensicResponse = {
            // Métadonnées de requête
            requestMetadata: {
              requestId: requestId,
              imageId: imageId,
              requestedAt: new Date().toISOString(),
              processingTime: Date.now() - startTime + 'ms',
              requestedPillars: requestedPillars,
              privacyMode: req.privacyMode || process.env.PRIVACY_MODE || 'COMMERCIAL'
            },
            // Informations image
            imageInformation: {
              id: image._id,
              filename: image.originalName,
              uploadDate: image.createdAt,
              fileSize: formatBytes(image.size),
              status: image.status,
              hash: req.privacyMode === 'JUDICIAL' ? image.hash : ((_image$hash = image.hash) === null || _image$hash === void 0 ? void 0 : _image$hash.substring(0, 16)) + '...' // Hash partiel pour privacy
            },
            // Score global
            overallAssessment: {
              authenticityScore: ((_analysisData$aggrega = analysisData.aggregatedScore) === null || _analysisData$aggrega === void 0 ? void 0 : _analysisData$aggrega.authenticity) || 0,
              riskLevel: ((_analysisData$aggrega2 = analysisData.aggregatedScore) === null || _analysisData$aggrega2 === void 0 ? void 0 : _analysisData$aggrega2.riskLevel) || 'UNCERTAIN',
              confidence: ((_analysisData$aggrega3 = analysisData.aggregatedScore) === null || _analysisData$aggrega3 === void 0 ? void 0 : _analysisData$aggrega3.confidence) || 'low',
              recommendation: generateRecommendation(analysisData.aggregatedScore),
              lastUpdated: (analysis === null || analysis === void 0 ? void 0 : analysis.updatedAt) || image.updatedAt
            },
            // Analyse des 7 piliers
            forensicPillars: {},
            // Flags consolidés
            securityFlags: {
              total: ((_analysisData$consoli = analysisData.consolidatedFlags) === null || _analysisData$consoli === void 0 ? void 0 : _analysisData$consoli.length) || 0,
              critical: ((_analysisData$consoli2 = analysisData.consolidatedFlags) === null || _analysisData$consoli2 === void 0 ? void 0 : _analysisData$consoli2.filter(function (f) {
                return f.severity === 'critical';
              }).length) || 0,
              warning: ((_analysisData$consoli3 = analysisData.consolidatedFlags) === null || _analysisData$consoli3 === void 0 ? void 0 : _analysisData$consoli3.filter(function (f) {
                return f.severity === 'warning';
              }).length) || 0,
              info: ((_analysisData$consoli4 = analysisData.consolidatedFlags) === null || _analysisData$consoli4 === void 0 ? void 0 : _analysisData$consoli4.filter(function (f) {
                return f.severity === 'info';
              }).length) || 0,
              flags: analysisData.consolidatedFlags || []
            },
            // Métadonnées EXIF (si autorisées)
            exifMetadata: req.privacyMode !== 'RESEARCH' ? image.exifData || null : null,
            // Chain of custody (si mode judiciaire)
            chainOfCustody: req.privacyMode === 'JUDICIAL' ? (analysis === null || analysis === void 0 ? void 0 : analysis.chainOfCustody) || [] : null
          }; // Ajouter données des piliers demandés
          requestedPillars.forEach(function (pillar) {
            if (analysisData["".concat(pillar, "Analysis")]) {
              forensicResponse.forensicPillars[pillar] = {
                analyzed: true,
                overallScore: analysisData["".concat(pillar, "Analysis")].overallScore || null,
                findings: extractPillarFindings(analysisData["".concat(pillar, "Analysis")]),
                confidence: calculatePillarConfidence(analysisData["".concat(pillar, "Analysis")])
              };
            } else {
              forensicResponse.forensicPillars[pillar] = {
                analyzed: false,
                reason: 'Pillar not available in analysis data'
              };
            }
          });

          // Mise en cache
          analysisCache.set(cacheKey, {
            data: forensicResponse,
            timestamp: Date.now()
          });

          // Ajouter entry à la chain of custody
          if (!req.chainOfCustodyEntry) {
            _context.n = 8;
            break;
          }
          _context.n = 8;
          return addChainOfCustodyEntry(analysis === null || analysis === void 0 ? void 0 : analysis._id, req.chainOfCustodyEntry);
        case 8:
          // Headers de réponse forensique
          res.setHeader('X-Forensic-Analysis-Version', (analysis === null || analysis === void 0 ? void 0 : analysis.analysisVersion) || '2.1.0');
          res.setHeader('X-Request-Id', requestId);
          res.setHeader('X-Analysis-Timestamp', analysisData.createdAt || new Date().toISOString());
          res.setHeader('X-Privacy-Mode', req.privacyMode || 'COMMERCIAL');

          // Logging forensique sécurisé
          console.log("\u2705 Analyse r\xE9cup\xE9r\xE9e: ".concat(imageId), {
            requestId: requestId,
            pillars: requestedPillars.length,
            flags: forensicResponse.securityFlags.total,
            processingTime: Date.now() - startTime + 'ms',
            userId: ((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.sub) || 'anonymous'
          });
          res.json(forensicResponse);
          _context.n = 10;
          break;
        case 9:
          _context.p = 9;
          _t = _context.v;
          console.error("\u274C Erreur r\xE9cup\xE9ration analyse [".concat(requestId, "]:"), {
            imageId: req.params.imageId,
            error: _t.message,
            stack: process.env.NODE_ENV === 'development' ? _t.stack : undefined,
            userId: (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.sub,
            processingTime: Date.now() - startTime + 'ms'
          });
          res.status(500).json(_objectSpread({
            error: 'Erreur serveur lors de la récupération de l\'analyse',
            type: 'ANALYSIS_RETRIEVAL_ERROR',
            requestId: requestId,
            timestamp: new Date().toISOString()
          }, process.env.NODE_ENV === 'development' && {
            details: _t.message
          }));
        case 10:
          return _context.a(2);
      }
    }, _callee, null, [[1, 9]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Démarrer une nouvelle analyse forensique avec configuration des 7 piliers
 */
exports.initiateForensicAnalysis = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var startTime, requestId, _req$user3, _req$user4, imageId, _req$body, _req$body$enabledPill, enabledPillars, _req$body$privacyMode, privacyMode, _req$body$priority, priority, _req$body$customWeigh, customWeights, sanitizedPrivacyMode, sanitizedPriority, objectId, image, defaultPillarsConfig, finalPillarsConfig, defaultWeights, finalWeights, totalWeight, newAnalysis, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          startTime = Date.now();
          requestId = crypto.randomBytes(8).toString('hex');
          _context2.p = 1;
          imageId = req.params.imageId;
          _req$body = req.body, _req$body$enabledPill = _req$body.enabledPillars, enabledPillars = _req$body$enabledPill === void 0 ? {} : _req$body$enabledPill, _req$body$privacyMode = _req$body.privacyMode, privacyMode = _req$body$privacyMode === void 0 ? 'COMMERCIAL' : _req$body$privacyMode, _req$body$priority = _req$body.priority, priority = _req$body$priority === void 0 ? 'normal' : _req$body$priority, _req$body$customWeigh = _req$body.customWeights, customWeights = _req$body$customWeigh === void 0 ? {} : _req$body$customWeigh; // Sanitization des entrées
          sanitizedPrivacyMode = sanitizeInput(privacyMode);
          sanitizedPriority = sanitizeInput(priority);
          objectId = req.forensicObjectId || validateObjectId(imageId);
          console.log("\uD83D\uDE80 D\xE9marrage analyse forensique: ".concat(imageId, " [").concat(requestId, "]"));

          // Vérifier que l'image existe
          _context2.n = 2;
          return Image.findById(objectId);
        case 2:
          image = _context2.v;
          if (image) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(404).json({
            error: 'Image non trouvée pour analyse',
            type: 'IMAGE_NOT_FOUND',
            imageId: imageId,
            requestId: requestId
          }));
        case 3:
          if (!(image.status === 'processing')) {
            _context2.n = 4;
            break;
          }
          return _context2.a(2, res.status(409).json({
            error: 'Analyse déjà en cours',
            type: 'ANALYSIS_IN_PROGRESS',
            message: 'Une analyse est déjà en cours pour cette image',
            estimatedCompletion: new Date(Date.now() + 300000).toISOString(),
            requestId: requestId
          }));
        case 4:
          if (!(image.status === 'quarantined')) {
            _context2.n = 5;
            break;
          }
          return _context2.a(2, res.status(423).json({
            error: 'Image en quarantaine',
            type: 'IMAGE_QUARANTINED',
            message: 'Cette image a été mise en quarantaine pour des raisons de sécurité',
            requestId: requestId
          }));
        case 5:
          // Configuration par défaut des piliers
          defaultPillarsConfig = {
            anatomical: true,
            physics: true,
            statistical: true,
            exif: true,
            behavioral: true,
            audio: false,
            // Désactivé par défaut pour images
            expert: false // Nécessite intervention manuelle
          };
          finalPillarsConfig = _objectSpread(_objectSpread({}, defaultPillarsConfig), enabledPillars); // Weights par défaut selon notre méthodologie
          defaultWeights = {
            anatomical: 0.15,
            physics: 0.20,
            statistical: 0.20,
            exif: 0.25,
            behavioral: 0.10,
            audio: 0.05,
            expert: 0.05
          };
          finalWeights = _objectSpread(_objectSpread({}, defaultWeights), customWeights); // Valider que la somme des weights = 1.0
          totalWeight = Object.values(finalWeights).reduce(function (sum, weight) {
            return sum + weight;
          }, 0);
          if (!(Math.abs(totalWeight - 1.0) > 0.01)) {
            _context2.n = 6;
            break;
          }
          return _context2.a(2, res.status(400).json({
            error: 'Configuration des poids invalide',
            type: 'INVALID_WEIGHTS_CONFIG',
            details: "La somme des poids doit \xEAtre \xE9gale \xE0 1.0 (actuel: ".concat(totalWeight, ")"),
            requestId: requestId
          }));
        case 6:
          // Créer nouvelle analyse
          newAnalysis = new Analysis({
            imageId: objectId,
            analysisVersion: '3.0.0-forensic',
            enabledPillars: finalPillarsConfig,
            pillarWeights: finalWeights,
            privacyMode: sanitizedPrivacyMode,
            status: 'pending',
            analysisMetadata: {
              startTime: new Date(),
              requestedBy: ((_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.sub) || 'anonymous',
              priority: sanitizedPriority,
              requestId: requestId
            }
          });
          _context2.n = 7;
          return newAnalysis.save();
        case 7:
          _context2.n = 8;
          return Image.findByIdAndUpdate(objectId, {
            status: 'processing',
            $push: {
              auditLog: {
                action: 'FORENSIC_ANALYSIS_INITIATED',
                performedBy: ((_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.sub) || 'system',
                details: {
                  requestId: requestId,
                  enabledPillars: Object.keys(finalPillarsConfig).filter(function (k) {
                    return finalPillarsConfig[k];
                  }),
                  priority: sanitizedPriority
                }
              }
            }
          });
        case 8:
          // Lancer analyse asynchrone
          setImmediate(function () {
            executeForensicAnalysis(newAnalysis._id, objectId, finalPillarsConfig, finalWeights)["catch"](function (error) {
              console.error("\u274C Erreur analyse async ".concat(imageId, ":"), error);
            });
          });

          // Réponse immédiate
          res.status(202).json({
            success: true,
            message: 'Analyse forensique initiée avec succès',
            analysisId: newAnalysis._id,
            imageId: imageId,
            requestId: requestId,
            estimatedCompletion: new Date(Date.now() + 300000).toISOString(),
            // +5min
            enabledPillars: Object.keys(finalPillarsConfig).filter(function (k) {
              return finalPillarsConfig[k];
            }),
            status: 'pending',
            trackingUrl: "/api/analysis/".concat(newAnalysis._id, "/status"),
            timestamp: new Date().toISOString()
          });
          console.log("\u2705 Analyse initi\xE9e: ".concat(imageId, " \u2192 ").concat(newAnalysis._id, " [").concat(requestId, "]"));
          _context2.n = 10;
          break;
        case 9:
          _context2.p = 9;
          _t2 = _context2.v;
          console.error("\u274C Erreur initiation analyse [".concat(requestId, "]:"), _t2);
          res.status(500).json(_objectSpread({
            error: 'Erreur lors de l\'initiation de l\'analyse',
            type: 'ANALYSIS_INITIATION_ERROR',
            requestId: requestId,
            timestamp: new Date().toISOString()
          }, process.env.NODE_ENV === 'development' && {
            details: _t2.message
          }));
        case 10:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 9]]);
  }));
  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Obtenir le statut en temps réel d'une analyse forensique
 */
exports.getAnalysisStatus = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _analysis$analysisMet, _analysis$analysisMet2, _analysis$analysisMet3, analysisId, requestId, analysis, statusResponse, _analysis$aggregatedS, _analysis$aggregatedS2, _analysis$aggregatedS3, _analysis$consolidate, _analysis$consolidate2, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          analysisId = req.params.analysisId;
          requestId = crypto.randomBytes(6).toString('hex');
          _context3.n = 1;
          return Analysis.findById(analysisId).select('status analysisMetadata enabledPillars aggregatedScore consolidatedFlags').lean();
        case 1:
          analysis = _context3.v;
          if (analysis) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, res.status(404).json({
            error: 'Analyse non trouvée',
            type: 'ANALYSIS_NOT_FOUND',
            analysisId: analysisId,
            requestId: requestId
          }));
        case 2:
          statusResponse = {
            analysisId: analysisId,
            status: analysis.status,
            progress: calculateAnalysisProgress(analysis),
            currentPhase: getCurrentPhase(analysis),
            enabledPillars: analysis.enabledPillars,
            estimatedTimeRemaining: estimateTimeRemaining(analysis),
            processingTime: ((_analysis$analysisMet = analysis.analysisMetadata) === null || _analysis$analysisMet === void 0 ? void 0 : _analysis$analysisMet.processingTime) || null,
            completedAt: ((_analysis$analysisMet2 = analysis.analysisMetadata) === null || _analysis$analysisMet2 === void 0 ? void 0 : _analysis$analysisMet2.endTime) || null,
            errors: ((_analysis$analysisMet3 = analysis.analysisMetadata) === null || _analysis$analysisMet3 === void 0 ? void 0 : _analysis$analysisMet3.errorsDuringAnalysis) || [],
            requestId: requestId,
            timestamp: new Date().toISOString()
          }; // Ajouter résultats si terminé
          if (analysis.status === 'completed') {
            statusResponse.results = {
              authenticityScore: (_analysis$aggregatedS = analysis.aggregatedScore) === null || _analysis$aggregatedS === void 0 ? void 0 : _analysis$aggregatedS.authenticity,
              riskLevel: (_analysis$aggregatedS2 = analysis.aggregatedScore) === null || _analysis$aggregatedS2 === void 0 ? void 0 : _analysis$aggregatedS2.riskLevel,
              confidence: (_analysis$aggregatedS3 = analysis.aggregatedScore) === null || _analysis$aggregatedS3 === void 0 ? void 0 : _analysis$aggregatedS3.confidence,
              flagsCount: ((_analysis$consolidate = analysis.consolidatedFlags) === null || _analysis$consolidate === void 0 ? void 0 : _analysis$consolidate.length) || 0,
              criticalFlags: ((_analysis$consolidate2 = analysis.consolidatedFlags) === null || _analysis$consolidate2 === void 0 ? void 0 : _analysis$consolidate2.filter(function (f) {
                return f.severity === 'critical';
              }).length) || 0
            };
          }
          res.json(statusResponse);
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t3 = _context3.v;
          console.error('❌ Erreur getAnalysisStatus:', _t3);
          res.status(500).json({
            error: 'Erreur lors de la récupération du statut',
            type: 'STATUS_RETRIEVAL_ERROR'
          });
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 3]]);
  }));
  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Comparer deux analyses forensiques détaillées
 */
exports.compareForensicAnalyses = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var startTime, requestId, _analysis1$aggregated, _analysis2$aggregated, _analysis1$aggregated2, _analysis2$aggregated2, _analysis1$aggregated3, _analysis2$aggregated3, _analysis1$aggregated4, _analysis2$aggregated4, _analysis1$aggregated5, _analysis2$aggregated5, _req$body2, imageId1, imageId2, _req$body2$comparison, comparisonMode, _yield$Promise$all3, _yield$Promise$all4, analysis1, analysis2, image1, image2, comparison, pillars, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          startTime = Date.now();
          requestId = crypto.randomBytes(8).toString('hex');
          _context4.p = 1;
          _req$body2 = req.body, imageId1 = _req$body2.imageId1, imageId2 = _req$body2.imageId2, _req$body2$comparison = _req$body2.comparisonMode, comparisonMode = _req$body2$comparison === void 0 ? 'comprehensive' : _req$body2$comparison; // Validation
          if (!(!imageId1 || !imageId2)) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, res.status(400).json({
            error: 'Deux IDs d\'images requis pour comparaison',
            type: 'MISSING_IMAGE_IDS',
            requestId: requestId
          }));
        case 2:
          if (!(imageId1 === imageId2)) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, res.status(400).json({
            error: 'Impossible de comparer une image avec elle-même',
            type: 'IDENTICAL_IMAGE_IDS',
            requestId: requestId
          }));
        case 3:
          _context4.n = 4;
          return Promise.all([Analysis.findOne({
            imageId: imageId1
          }).lean(), Analysis.findOne({
            imageId: imageId2
          }).lean(), Image.findById(imageId1).select('originalName hash size exifData').lean(), Image.findById(imageId2).select('originalName hash size exifData').lean()]);
        case 4:
          _yield$Promise$all3 = _context4.v;
          _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 4);
          analysis1 = _yield$Promise$all4[0];
          analysis2 = _yield$Promise$all4[1];
          image1 = _yield$Promise$all4[2];
          image2 = _yield$Promise$all4[3];
          if (!(!image1 || !image2)) {
            _context4.n = 5;
            break;
          }
          return _context4.a(2, res.status(404).json({
            error: 'Une ou plusieurs images non trouvées',
            type: 'IMAGES_NOT_FOUND',
            found: {
              image1: !!image1,
              image2: !!image2
            },
            requestId: requestId
          }));
        case 5:
          if (!(!analysis1 || !analysis2)) {
            _context4.n = 6;
            break;
          }
          return _context4.a(2, res.status(400).json({
            error: 'Analyses forensiques manquantes',
            type: 'ANALYSES_NOT_AVAILABLE',
            available: {
              analysis1: !!analysis1,
              analysis2: !!analysis2
            },
            requestId: requestId
          }));
        case 6:
          // Comparaison forensique approfondie
          comparison = {
            requestMetadata: {
              requestId: requestId,
              comparisonMode: comparisonMode,
              comparedAt: new Date().toISOString(),
              processingTime: null // Sera mis à jour à la fin
            },
            images: {
              image1: {
                id: imageId1,
                filename: image1.originalName,
                size: image1.size
              },
              image2: {
                id: imageId2,
                filename: image2.originalName,
                size: image2.size
              }
            },
            // Comparaison technique
            technicalComparison: {
              identical: image1.hash === image2.hash,
              sizeVariation: Math.abs(image1.size - image2.size),
              nameSimilarity: calculateNameSimilarity(image1.originalName, image2.originalName)
            },
            // Comparaison scores forensiques
            forensicComparison: {
              authenticityDelta: Math.abs((((_analysis1$aggregated = analysis1.aggregatedScore) === null || _analysis1$aggregated === void 0 ? void 0 : _analysis1$aggregated.authenticity) || 0) - (((_analysis2$aggregated = analysis2.aggregatedScore) === null || _analysis2$aggregated === void 0 ? void 0 : _analysis2$aggregated.authenticity) || 0)),
              riskLevelComparison: {
                image1: (_analysis1$aggregated2 = analysis1.aggregatedScore) === null || _analysis1$aggregated2 === void 0 ? void 0 : _analysis1$aggregated2.riskLevel,
                image2: (_analysis2$aggregated2 = analysis2.aggregatedScore) === null || _analysis2$aggregated2 === void 0 ? void 0 : _analysis2$aggregated2.riskLevel,
                concordant: ((_analysis1$aggregated3 = analysis1.aggregatedScore) === null || _analysis1$aggregated3 === void 0 ? void 0 : _analysis1$aggregated3.riskLevel) === ((_analysis2$aggregated3 = analysis2.aggregatedScore) === null || _analysis2$aggregated3 === void 0 ? void 0 : _analysis2$aggregated3.riskLevel)
              },
              confidenceComparison: {
                image1: (_analysis1$aggregated4 = analysis1.aggregatedScore) === null || _analysis1$aggregated4 === void 0 ? void 0 : _analysis1$aggregated4.confidence,
                image2: (_analysis2$aggregated4 = analysis2.aggregatedScore) === null || _analysis2$aggregated4 === void 0 ? void 0 : _analysis2$aggregated4.confidence,
                concordant: ((_analysis1$aggregated5 = analysis1.aggregatedScore) === null || _analysis1$aggregated5 === void 0 ? void 0 : _analysis1$aggregated5.confidence) === ((_analysis2$aggregated5 = analysis2.aggregatedScore) === null || _analysis2$aggregated5 === void 0 ? void 0 : _analysis2$aggregated5.confidence)
              }
            },
            // Comparaison par piliers
            pillarComparison: {},
            // Comparaison flags
            flagsComparison: compareFlags(analysis1.consolidatedFlags, analysis2.consolidatedFlags),
            // EXIF comparison
            exifComparison: image1.exifData && image2.exifData ? compareExifData(image1.exifData, image2.exifData) : null,
            // Évaluation globale
            overallAssessment: {
              suspiciousPattern: false,
              recommendation: '',
              confidence: 'medium'
            }
          }; // Comparer chaque pilier
          pillars = ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'];
          pillars.forEach(function (pillar) {
            var pillar1 = analysis1["".concat(pillar, "Analysis")];
            var pillar2 = analysis2["".concat(pillar, "Analysis")];
            if (pillar1 && pillar2) {
              comparison.pillarComparison[pillar] = {
                scoreDelta: Math.abs((pillar1.overallScore || 0) - (pillar2.overallScore || 0)),
                concordantFlags: comparePillarFlags(pillar1, pillar2),
                similarity: calculatePillarSimilarity(pillar1, pillar2)
              };
            }
          });

          // Évaluation globale de la comparaison
          comparison.overallAssessment = generateComparisonAssessment(comparison);
          comparison.requestMetadata.processingTime = Date.now() - startTime + 'ms';
          console.log("\u2705 Comparaison forensique: ".concat(imageId1, " vs ").concat(imageId2, " [").concat(requestId, "]"));
          res.json(comparison);
          _context4.n = 8;
          break;
        case 7:
          _context4.p = 7;
          _t4 = _context4.v;
          console.error("\u274C Erreur comparaison forensique [".concat(requestId, "]:"), _t4);
          res.status(500).json({
            error: 'Erreur lors de la comparaison forensique',
            type: 'COMPARISON_ERROR',
            requestId: requestId,
            timestamp: new Date().toISOString()
          });
        case 8:
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 7]]);
  }));
  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Obtenir statistiques globales d'analyse avec métriques forensiques
 */
exports.getForensicStatistics = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var _globalStats$, _globalStats$2, _globalStats$3, _globalStats$4, _globalStats$5, _globalStats$6, _pillarStats$, _pillarStats$2, _pillarStats$3, _pillarStats$4, _pillarStats$5, _pillarStats$6, _pillarStats$7, _req$query2, _req$query2$period, period, _req$query2$breakdown, breakdown, requestId, periodMs, startDate, _yield$Promise$all5, _yield$Promise$all6, globalStats, riskDistribution, pillarStats, recentActivity, statistics, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _req$query2 = req.query, _req$query2$period = _req$query2.period, period = _req$query2$period === void 0 ? '30d' : _req$query2$period, _req$query2$breakdown = _req$query2.breakdown, breakdown = _req$query2$breakdown === void 0 ? 'risk' : _req$query2$breakdown;
          requestId = crypto.randomBytes(6).toString('hex'); // Calculer période
          periodMs = parsePeriod(period);
          startDate = new Date(Date.now() - periodMs); // Agrégations MongoDB optimisées
          _context5.n = 1;
          return Promise.all([
          // Statistiques globales
          Analysis.aggregate([{
            $match: {
              createdAt: {
                $gte: startDate
              }
            }
          }, {
            $group: {
              _id: null,
              totalAnalyses: {
                $sum: 1
              },
              completedAnalyses: {
                $sum: {
                  $cond: [{
                    $eq: ['$status', 'completed']
                  }, 1, 0]
                }
              },
              averageScore: {
                $avg: '$aggregatedScore.authenticity'
              },
              totalFlags: {
                $sum: {
                  $size: {
                    $ifNull: ['$consolidatedFlags', []]
                  }
                }
              },
              averageProcessingTime: {
                $avg: '$analysisMetadata.processingTime'
              }
            }
          }]),
          // Distribution des niveaux de risque
          Analysis.aggregate([{
            $match: {
              createdAt: {
                $gte: startDate
              },
              status: 'completed'
            }
          }, {
            $group: {
              _id: '$aggregatedScore.riskLevel',
              count: {
                $sum: 1
              }
            }
          }]),
          // Statistiques par pilier
          Analysis.aggregate([{
            $match: {
              createdAt: {
                $gte: startDate
              },
              status: 'completed'
            }
          }, {
            $project: {
              anatomical: '$anatomicalAnalysis.overallScore',
              physics: '$physicsAnalysis.overallScore',
              statistical: '$statisticalAnalysis.overallScore',
              exif: '$exifForensics.overallScore',
              behavioral: '$behavioralAnalysis.overallScore',
              audio: '$audioForensics.overallScore',
              expert: '$expertAnalysis.overallScore'
            }
          }, {
            $group: {
              _id: null,
              avgAnatomical: {
                $avg: '$anatomical'
              },
              avgPhysics: {
                $avg: '$physics'
              },
              avgStatistical: {
                $avg: '$statistical'
              },
              avgExif: {
                $avg: '$exif'
              },
              avgBehavioral: {
                $avg: '$behavioral'
              },
              avgAudio: {
                $avg: '$audio'
              },
              avgExpert: {
                $avg: '$expert'
              }
            }
          }]),
          // Activité récente
          Analysis.find({
            createdAt: {
              $gte: startDate
            }
          }).sort({
            createdAt: -1
          }).limit(10).select('imageId aggregatedScore status createdAt').populate('imageId', 'originalName').lean()]);
        case 1:
          _yield$Promise$all5 = _context5.v;
          _yield$Promise$all6 = _slicedToArray(_yield$Promise$all5, 4);
          globalStats = _yield$Promise$all6[0];
          riskDistribution = _yield$Promise$all6[1];
          pillarStats = _yield$Promise$all6[2];
          recentActivity = _yield$Promise$all6[3];
          statistics = {
            requestMetadata: {
              requestId: requestId,
              period: period,
              startDate: startDate.toISOString(),
              endDate: new Date().toISOString(),
              breakdown: breakdown
            },
            overview: {
              totalAnalyses: ((_globalStats$ = globalStats[0]) === null || _globalStats$ === void 0 ? void 0 : _globalStats$.totalAnalyses) || 0,
              completedAnalyses: ((_globalStats$2 = globalStats[0]) === null || _globalStats$2 === void 0 ? void 0 : _globalStats$2.completedAnalyses) || 0,
              completionRate: ((_globalStats$3 = globalStats[0]) === null || _globalStats$3 === void 0 ? void 0 : _globalStats$3.totalAnalyses) > 0 ? Math.round(globalStats[0].completedAnalyses / globalStats[0].totalAnalyses * 100) : 0,
              averageAuthenticityScore: Math.round(((_globalStats$4 = globalStats[0]) === null || _globalStats$4 === void 0 ? void 0 : _globalStats$4.averageScore) || 0),
              totalSecurityFlags: ((_globalStats$5 = globalStats[0]) === null || _globalStats$5 === void 0 ? void 0 : _globalStats$5.totalFlags) || 0,
              averageProcessingTime: Math.round(((_globalStats$6 = globalStats[0]) === null || _globalStats$6 === void 0 ? void 0 : _globalStats$6.averageProcessingTime) || 0)
            },
            riskDistribution: riskDistribution.reduce(function (acc, item) {
              acc[item._id || 'UNKNOWN'] = item.count;
              return acc;
            }, {}),
            pillarPerformance: {
              anatomical: Math.round(((_pillarStats$ = pillarStats[0]) === null || _pillarStats$ === void 0 ? void 0 : _pillarStats$.avgAnatomical) || 0),
              physics: Math.round(((_pillarStats$2 = pillarStats[0]) === null || _pillarStats$2 === void 0 ? void 0 : _pillarStats$2.avgPhysics) || 0),
              statistical: Math.round(((_pillarStats$3 = pillarStats[0]) === null || _pillarStats$3 === void 0 ? void 0 : _pillarStats$3.avgStatistical) || 0),
              exif: Math.round(((_pillarStats$4 = pillarStats[0]) === null || _pillarStats$4 === void 0 ? void 0 : _pillarStats$4.avgExif) || 0),
              behavioral: Math.round(((_pillarStats$5 = pillarStats[0]) === null || _pillarStats$5 === void 0 ? void 0 : _pillarStats$5.avgBehavioral) || 0),
              audio: Math.round(((_pillarStats$6 = pillarStats[0]) === null || _pillarStats$6 === void 0 ? void 0 : _pillarStats$6.avgAudio) || 0),
              expert: Math.round(((_pillarStats$7 = pillarStats[0]) === null || _pillarStats$7 === void 0 ? void 0 : _pillarStats$7.avgExpert) || 0)
            },
            recentActivity: recentActivity.map(function (analysis) {
              var _analysis$imageId, _analysis$imageId2, _analysis$aggregatedS4, _analysis$aggregatedS5;
              return {
                id: analysis._id,
                imageId: (_analysis$imageId = analysis.imageId) === null || _analysis$imageId === void 0 ? void 0 : _analysis$imageId._id,
                imageName: (_analysis$imageId2 = analysis.imageId) === null || _analysis$imageId2 === void 0 ? void 0 : _analysis$imageId2.originalName,
                authenticityScore: (_analysis$aggregatedS4 = analysis.aggregatedScore) === null || _analysis$aggregatedS4 === void 0 ? void 0 : _analysis$aggregatedS4.authenticity,
                riskLevel: (_analysis$aggregatedS5 = analysis.aggregatedScore) === null || _analysis$aggregatedS5 === void 0 ? void 0 : _analysis$aggregatedS5.riskLevel,
                status: analysis.status,
                analyzedAt: analysis.createdAt
              };
            }),
            generatedAt: new Date().toISOString()
          };
          res.json(statistics);
          _context5.n = 3;
          break;
        case 2:
          _context5.p = 2;
          _t5 = _context5.v;
          console.error('❌ Erreur statistiques forensiques:', _t5);
          res.status(500).json({
            error: 'Erreur lors de la génération des statistiques',
            type: 'STATISTICS_ERROR'
          });
        case 3:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return function (_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Obtenir le résumé d'une session
 */
exports.getSessionSummary = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var sessionId, _req$query$includeDet, includeDetails, sanitizedSessionId, analyses, completedAnalyses, totalScore, averageScore, classificationCounts, flagCounts, sessionSummary, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          sessionId = req.params.sessionId;
          _req$query$includeDet = req.query.includeDetails, includeDetails = _req$query$includeDet === void 0 ? 'false' : _req$query$includeDet;
          sanitizedSessionId = sanitizeInput(sessionId); // Récupérer toutes les analyses de la session
          _context6.n = 1;
          return Analysis.find({
            'metadata.sessionId': sanitizedSessionId
          }).populate('image', 'originalName filename size mimeType').lean();
        case 1:
          analyses = _context6.v;
          if (!(analyses.length === 0)) {
            _context6.n = 2;
            break;
          }
          return _context6.a(2, res.status(404).json({
            success: false,
            error: 'Aucune analyse trouvée pour cette session',
            type: 'SESSION_NOT_FOUND',
            sessionId: sessionId
          }));
        case 2:
          // Calcul des statistiques de session
          completedAnalyses = analyses.filter(function (a) {
            return a.status === 'completed';
          });
          totalScore = completedAnalyses.reduce(function (sum, a) {
            return sum + (a.overallScore || 0);
          }, 0);
          averageScore = completedAnalyses.length > 0 ? totalScore / completedAnalyses.length : 0; // Répartition des classifications
          classificationCounts = {};
          completedAnalyses.forEach(function (analysis) {
            var classification = analysis.classification || 'UNKNOWN';
            classificationCounts[classification] = (classificationCounts[classification] || 0) + 1;
          });

          // Flags les plus fréquents
          flagCounts = {};
          completedAnalyses.forEach(function (analysis) {
            (analysis.flags || []).forEach(function (flag) {
              flagCounts[flag] = (flagCounts[flag] || 0) + 1;
            });
          });
          sessionSummary = {
            success: true,
            sessionId: sessionId,
            summary: {
              totalAnalyses: analyses.length,
              completedAnalyses: completedAnalyses.length,
              pendingAnalyses: analyses.filter(function (a) {
                return a.status === 'pending';
              }).length,
              failedAnalyses: analyses.filter(function (a) {
                return a.status === 'failed';
              }).length,
              averageScore: Math.round(averageScore),
              classifications: classificationCounts,
              mostCommonFlags: Object.entries(flagCounts).sort(function (_ref7, _ref8) {
                var _ref9 = _slicedToArray(_ref7, 2),
                  a = _ref9[1];
                var _ref0 = _slicedToArray(_ref8, 2),
                  b = _ref0[1];
                return b - a;
              }).slice(0, 5).map(function (_ref1) {
                var _ref10 = _slicedToArray(_ref1, 2),
                  flag = _ref10[0],
                  count = _ref10[1];
                return {
                  flag: flag,
                  count: count
                };
              }),
              sessionStarted: analyses.reduce(function (earliest, a) {
                return a.requestedAt < earliest ? a.requestedAt : earliest;
              }, analyses[0].requestedAt),
              lastActivity: analyses.reduce(function (latest, a) {
                return (a.completedAt || a.requestedAt) > latest ? a.completedAt || a.requestedAt : latest;
              }, analyses[0].requestedAt)
            }
          }; // Ajouter détails si demandé
          if (includeDetails === 'true') {
            sessionSummary.details = analyses.map(function (analysis) {
              return {
                id: analysis._id,
                imageId: analysis.image._id,
                imageName: analysis.image.originalName,
                status: analysis.status,
                overallScore: analysis.overallScore,
                classification: analysis.classification,
                requestedAt: analysis.requestedAt,
                completedAt: analysis.completedAt
              };
            });
          }
          res.json(sessionSummary);
          _context6.n = 4;
          break;
        case 3:
          _context6.p = 3;
          _t6 = _context6.v;
          console.error('❌ Erreur session summary:', _t6);
          res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération du résumé de session',
            type: 'SESSION_SUMMARY_ERROR'
          });
        case 4:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 3]]);
  }));
  return function (_x1, _x10) {
    return _ref6.apply(this, arguments);
  };
}();

// =====================================
// FONCTIONS UTILITAIRES OPTIMISÉES
// =====================================

function extractPillarData(forensicAnalysis, pillarName) {
  if (!forensicAnalysis) return null;

  // Mapper les données legacy vers la nouvelle structure
  var mapping = {
    'anatomical': forensicAnalysis.anatomicalAnalysis,
    'physics': forensicAnalysis.physicsViolations,
    'statistical': forensicAnalysis.statisticalAnomalies,
    'exif': forensicAnalysis.exifInconsistencies,
    'behavioral': forensicAnalysis.behavioralAnomalies,
    'audio': forensicAnalysis.audioAnalysis,
    'expert': forensicAnalysis.expertFlags
  };
  return mapping[pillarName] || null;
}
function extractPillarFindings(pillarData) {
  if (!pillarData) return [];
  var findings = [];

  // Extraire findings selon la structure du pilier
  if (pillarData.anomalies) {
    findings.push.apply(findings, _toConsumableArray(pillarData.anomalies));
  }
  if (pillarData.violations) {
    findings.push.apply(findings, _toConsumableArray(pillarData.violations));
  }
  if (pillarData.flags) {
    findings.push.apply(findings, _toConsumableArray(pillarData.flags));
  }
  return findings;
}
function calculatePillarConfidence(pillarData) {
  if (!pillarData) return 'low';
  var score = pillarData.overallScore || 0;
  var hasMultipleIndicators = extractPillarFindings(pillarData).length > 2;
  if (score > 80 && hasMultipleIndicators) return 'high';
  if (score > 60 || hasMultipleIndicators) return 'medium';
  return 'low';
}
function generateRecommendation(aggregatedScore) {
  if (!aggregatedScore) return 'Analyse incomplète - Évaluation impossible';
  var score = aggregatedScore.authenticity || 0;
  var riskLevel = aggregatedScore.riskLevel;
  var recommendations = {
    'AUTHENTIC': 'Image authentique - Utilisation recommandée',
    'LIKELY_AUTHENTIC': 'Image probablement authentique - Utilisation acceptable avec vigilance',
    'UNCERTAIN': '⚠️ Authenticité incertaine - Investigation supplémentaire recommandée',
    'LIKELY_FAKE': '🚨 Image probablement falsifiée - Vérification experte obligatoire',
    'FAKE': '🛑 Image détectée comme falsifiée - Ne pas utiliser sans expertise forensique'
  };
  return recommendations[riskLevel] || 'Évaluation non disponible';
}
function addChainOfCustodyEntry(_x11, _x12) {
  return _addChainOfCustodyEntry.apply(this, arguments);
}
function _addChainOfCustodyEntry() {
  _addChainOfCustodyEntry = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(analysisId, entry) {
    var _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          if (!(!analysisId || !entry)) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2);
        case 1:
          _context7.p = 1;
          _context7.n = 2;
          return Analysis.findByIdAndUpdate(analysisId, {
            $push: {
              'chainOfCustody.entries': {
                timestamp: new Date(),
                action: entry.action,
                performedBy: entry.performedBy,
                details: entry.details
              }
            }
          });
        case 2:
          _context7.n = 4;
          break;
        case 3:
          _context7.p = 3;
          _t7 = _context7.v;
          console.error('❌ Erreur ajout chain of custody:', _t7);
        case 4:
          return _context7.a(2);
      }
    }, _callee7, null, [[1, 3]]);
  }));
  return _addChainOfCustodyEntry.apply(this, arguments);
}
function executeForensicAnalysis(_x13, _x14, _x15, _x16) {
  return _executeForensicAnalysis.apply(this, arguments);
}
function _executeForensicAnalysis() {
  _executeForensicAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(analysisId, imageId, pillarsConfig, weights) {
    var analysisResults, _i3, _Object$entries2, _Object$entries2$_i, pillar, enabled, aggregatedScore, consolidatedFlags, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          console.log("\uD83D\uDD2C Ex\xE9cution analyse forensique: ".concat(analysisId));

          // Mise à jour statut
          _context8.n = 1;
          return Analysis.findByIdAndUpdate(analysisId, {
            status: 'running',
            'analysisMetadata.startTime': new Date()
          });
        case 1:
          // Simuler analyse des piliers (remplacer par vraie implémentation)
          analysisResults = {};
          _i3 = 0, _Object$entries2 = Object.entries(pillarsConfig);
        case 2:
          if (!(_i3 < _Object$entries2.length)) {
            _context8.n = 5;
            break;
          }
          _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2), pillar = _Object$entries2$_i[0], enabled = _Object$entries2$_i[1];
          if (!enabled) {
            _context8.n = 4;
            break;
          }
          _context8.n = 3;
          return simulatePillarAnalysis(pillar, imageId);
        case 3:
          analysisResults["".concat(pillar, "Analysis")] = _context8.v;
        case 4:
          _i3++;
          _context8.n = 2;
          break;
        case 5:
          // Calculer score agrégé
          aggregatedScore = calculateAggregatedScore(analysisResults, weights); // Générer flags consolidés
          consolidatedFlags = generateConsolidatedFlags(analysisResults); // Sauvegarder résultats
          _context8.n = 6;
          return Analysis.findByIdAndUpdate(analysisId, _objectSpread(_objectSpread({}, analysisResults), {}, {
            aggregatedScore: aggregatedScore,
            consolidatedFlags: consolidatedFlags,
            status: 'completed',
            'analysisMetadata.endTime': new Date(),
            'analysisMetadata.processingTime': Date.now() - new Date().getTime()
          }));
        case 6:
          _context8.n = 7;
          return Image.findByIdAndUpdate(imageId, {
            status: 'analyzed',
            authenticityScore: aggregatedScore.authenticity,
            'riskClassification.level': aggregatedScore.riskLevel,
            'riskClassification.confidence': aggregatedScore.confidence
          });
        case 7:
          console.log("\u2705 Analyse termin\xE9e: ".concat(analysisId));
          _context8.n = 10;
          break;
        case 8:
          _context8.p = 8;
          _t8 = _context8.v;
          console.error("\u274C Erreur ex\xE9cution analyse ".concat(analysisId, ":"), _t8);
          _context8.n = 9;
          return Analysis.findByIdAndUpdate(analysisId, {
            status: 'failed',
            'analysisMetadata.errorsDuringAnalysis': [{
              pillar: 'system',
              error: _t8.message,
              timestamp: new Date(),
              recoverable: false
            }]
          });
        case 9:
          _context8.n = 10;
          return Image.findByIdAndUpdate(imageId, {
            status: 'error',
            error: "Analysis failed: ".concat(_t8.message)
          });
        case 10:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 8]]);
  }));
  return _executeForensicAnalysis.apply(this, arguments);
}
function simulatePillarAnalysis(_x17, _x18) {
  return _simulatePillarAnalysis.apply(this, arguments);
}
function _simulatePillarAnalysis() {
  _simulatePillarAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(pillar, imageId) {
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          return _context9.a(2, new Promise(function (resolve) {
            setTimeout(function () {
              resolve({
                overallScore: Math.floor(Math.random() * 40 + 60),
                // 60-100
                analysisTime: Math.floor(Math.random() * 5000 + 1000),
                // 1-6s
                findings: ["".concat(pillar, " analysis completed")],
                confidence: Math.random() > 0.7 ? 'high' : 'medium'
              });
            }, Math.random() * 2000 + 500); // 0.5-2.5s
          }));
      }
    }, _callee9);
  }));
  return _simulatePillarAnalysis.apply(this, arguments);
}
function calculateAggregatedScore(results, weights) {
  var totalScore = 0;
  var totalWeight = 0;
  for (var _i = 0, _Object$entries = Object.entries(weights); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
      pillar = _Object$entries$_i[0],
      weight = _Object$entries$_i[1];
    var pillarResult = results["".concat(pillar, "Analysis")];
    if (pillarResult && pillarResult.overallScore !== null) {
      totalScore += pillarResult.overallScore * weight;
      totalWeight += weight;
    }
  }
  var finalScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  var riskLevel = 'UNCERTAIN';
  if (finalScore >= 80) riskLevel = 'AUTHENTIC';else if (finalScore >= 60) riskLevel = 'LIKELY_AUTHENTIC';else if (finalScore >= 40) riskLevel = 'UNCERTAIN';else if (finalScore >= 20) riskLevel = 'LIKELY_FAKE';else riskLevel = 'FAKE';
  return {
    authenticity: finalScore,
    riskLevel: riskLevel,
    confidence: totalWeight > 0.7 ? 'high' : 'medium'
  };
}
function generateConsolidatedFlags(results) {
  var flags = [];
  Object.entries(results).forEach(function (_ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
      pillarName = _ref12[0],
      data = _ref12[1];
    if (data && data.overallScore < 50) {
      flags.push({
        type: "".concat(pillarName.toUpperCase(), "_ANOMALY"),
        severity: data.overallScore < 30 ? 'critical' : 'warning',
        pillarSource: [pillarName.replace('Analysis', '')],
        confidence: 85,
        message: "Anomalie d\xE9tect\xE9e lors de l'analyse ".concat(pillarName),
        timestamp: new Date()
      });
    }
  });
  return flags;
}
function compareFlags(flags1, flags2) {
  var types1 = new Set((flags1 || []).map(function (f) {
    return f.type;
  }));
  var types2 = new Set((flags2 || []).map(function (f) {
    return f.type;
  }));
  var commonTypes = _toConsumableArray(types1).filter(function (type) {
    return types2.has(type);
  });
  var unique1 = _toConsumableArray(types1).filter(function (type) {
    return !types2.has(type);
  });
  var unique2 = _toConsumableArray(types2).filter(function (type) {
    return !types1.has(type);
  });
  return {
    commonFlags: commonTypes.length,
    uniqueFlags1: unique1.length,
    uniqueFlags2: unique2.length,
    similarity: commonTypes.length / Math.max(types1.size, types2.size, 1)
  };
}
function compareExifData(exif1, exif2) {
  var _exif1$camera, _exif2$camera, _exif1$camera2, _exif2$camera2, _exif1$technical, _exif2$technical, _exif1$timestamps, _exif2$timestamps;
  return {
    sameCameraMake: ((_exif1$camera = exif1.camera) === null || _exif1$camera === void 0 ? void 0 : _exif1$camera.make) === ((_exif2$camera = exif2.camera) === null || _exif2$camera === void 0 ? void 0 : _exif2$camera.make),
    sameCameraModel: ((_exif1$camera2 = exif1.camera) === null || _exif1$camera2 === void 0 ? void 0 : _exif1$camera2.model) === ((_exif2$camera2 = exif2.camera) === null || _exif2$camera2 === void 0 ? void 0 : _exif2$camera2.model),
    sameOrientation: ((_exif1$technical = exif1.technical) === null || _exif1$technical === void 0 ? void 0 : _exif1$technical.orientation) === ((_exif2$technical = exif2.technical) === null || _exif2$technical === void 0 ? void 0 : _exif2$technical.orientation),
    timestampDelta: (_exif1$timestamps = exif1.timestamps) !== null && _exif1$timestamps !== void 0 && _exif1$timestamps.dateTimeOriginal && (_exif2$timestamps = exif2.timestamps) !== null && _exif2$timestamps !== void 0 && _exif2$timestamps.dateTimeOriginal ? Math.abs(new Date(exif1.timestamps.dateTimeOriginal) - new Date(exif2.timestamps.dateTimeOriginal)) : null
  };
}
function calculateNameSimilarity(name1, name2) {
  if (!name1 || !name2) return 0;
  var clean1 = name1.toLowerCase().replace(/[^a-z0-9]/g, '');
  var clean2 = name2.toLowerCase().replace(/[^a-z0-9]/g, '');
  var maxLength = Math.max(clean1.length, clean2.length);
  if (maxLength === 0) return 1;
  var distance = levenshteinDistance(clean1, clean2);
  return Math.max(0, (maxLength - distance) / maxLength);
}
function levenshteinDistance(str1, str2) {
  var matrix = Array(str2.length + 1).fill(null).map(function () {
    return Array(str1.length + 1).fill(null);
  });
  for (var i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (var j = 0; j <= str2.length; j++) matrix[j][0] = j;
  for (var _j = 1; _j <= str2.length; _j++) {
    for (var _i2 = 1; _i2 <= str1.length; _i2++) {
      var substitutionCost = str1[_i2 - 1] === str2[_j - 1] ? 0 : 1;
      matrix[_j][_i2] = Math.min(matrix[_j][_i2 - 1] + 1, matrix[_j - 1][_i2] + 1, matrix[_j - 1][_i2 - 1] + substitutionCost);
    }
  }
  return matrix[str2.length][str1.length];
}
function calculateAnalysisProgress(analysis) {
  switch (analysis.status) {
    case 'completed':
      return 100;
    case 'running':
      return 60;
    case 'pending':
      return 10;
    case 'failed':
      return 0;
    default:
      return 0;
  }
}
function getCurrentPhase(analysis) {
  if (analysis.status === 'completed') return 'Analysis completed';
  if (analysis.status === 'failed') return 'Analysis failed';
  if (analysis.status === 'running') return 'Processing forensic pillars...';
  return 'Waiting to start';
}
function estimateTimeRemaining(analysis) {
  if (analysis.status === 'completed' || analysis.status === 'failed') return 0;
  if (analysis.status === 'running') return 180; // 3 minutes
  return 300; // 5 minutes
}
function parsePeriod(period) {
  var units = {
    d: 86400000,
    h: 3600000,
    m: 60000
  };
  var match = period.match(/^(\d+)([dhm])$/);
  if (!match) return 30 * 86400000; // 30 days default
  return parseInt(match[1]) * (units[match[2]] || 86400000);
}
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function comparePillarFlags(pillar1, pillar2) {
  // Logique de comparaison spécifique par pilier
  return Math.random() > 0.5; // Placeholder
}
function calculatePillarSimilarity(pillar1, pillar2) {
  var score1 = pillar1.overallScore || 0;
  var score2 = pillar2.overallScore || 0;
  return 1 - Math.abs(score1 - score2) / 100;
}
function generateComparisonAssessment(comparison) {
  var technicalComparison = comparison.technicalComparison,
    forensicComparison = comparison.forensicComparison;
  var suspiciousPattern = false;
  var recommendation = '';
  var confidence = 'medium';

  // Détection patterns suspects
  if (technicalComparison.identical) {
    suspiciousPattern = true;
    recommendation = '🚨 Images identiques détectées - Possible duplication';
    confidence = 'high';
  } else if (forensicComparison.authenticityDelta < 5 && (forensicComparison.riskLevelComparison.image1 === 'FAKE' || forensicComparison.riskLevelComparison.image2 === 'FAKE')) {
    suspiciousPattern = true;
    recommendation = '⚠️ Pattern suspect: scores similaires avec contenu falsifié';
    confidence = 'high';
  } else if (forensicComparison.riskLevelComparison.concordant && forensicComparison.riskLevelComparison.image1 === 'AUTHENTIC') {
    recommendation = '✅ Images cohérentes et authentiques';
    confidence = 'medium';
  } else {
    recommendation = 'Comparaison terminée - Examiner les détails par pilier';
    confidence = 'medium';
  }
  return {
    suspiciousPattern: suspiciousPattern,
    recommendation: recommendation,
    confidence: confidence
  };
}
module.exports = exports;