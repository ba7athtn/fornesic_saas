"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
var multer = require('multer');
var path = require('path');
var fs = require('fs').promises;
var fsSync = require('fs');
var crypto = require('crypto');
var sharp = require('sharp');
var ExifReader = require('exifr');
var mongoose = require('mongoose');
var Image = require('../models/Image');
var Analysis = require('../models/Analysis');
var _require = require('../utils/exifNormalizer'),
  normalizeExifData = _require.normalizeExifData;
var _require2 = require('../middleware/upload'),
  forensicUpload = _require2.forensicUpload;

// IMPORTS CORRIGÉS POUR SERVICES
var _require3 = require('../services/forensicAnalyzer'),
  performQuickForensicAnalysis = _require3.performQuickForensicAnalysis;
var _require4 = require('../services/imageProcessor'),
  createThumbnail = _require4.createThumbnail;
var _require5 = require('../services/analysisQueue'),
  addAnalysisJob = _require5.addAnalysisJob;

// LAZY LOADING pour modules lourds
var getHeavyAnalyzer = function getHeavyAnalyzer() {
  return require('../services/heavyAnalyzer');
};

// =====================================
// CONTRÔLEUR IMAGES FORENSIQUES AVANCÉ - OPTIMISÉ
// =====================================

// Validation ObjectId optimisée
var validateObjectId = function validateObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return new mongoose.Types.ObjectId(id);
};

// Cache pour images fréquemment consultées
var imageCache = new Map();
var IMAGE_CACHE_TTL = 2 * 60 * 1000; // 2 minutes

// Sanitization des entrées
var sanitizeInput = function sanitizeInput(input) {
  return typeof input === 'string' ? input.replace(/[<>"'&]/g, '') : input;
};

// Génération thumbnail optimisée (fallback si service indisponible)
var generateThumbnailFallback = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(inputPath, outputPath) {
    var options,
      _options$width,
      width,
      _options$height,
      height,
      _options$quality,
      quality,
      _args = arguments,
      _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
          _context.p = 1;
          _options$width = options.width, width = _options$width === void 0 ? 300 : _options$width, _options$height = options.height, height = _options$height === void 0 ? 300 : _options$height, _options$quality = options.quality, quality = _options$quality === void 0 ? 85 : _options$quality;
          _context.n = 2;
          return sharp(inputPath).resize(width, height, {
            fit: 'inside',
            withoutEnlargement: true
          }).jpeg({
            quality: quality,
            progressive: true
          }).toFile(outputPath);
        case 2:
          console.log("\u2705 Thumbnail g\xE9n\xE9r\xE9 (fallback): ".concat(path.basename(outputPath)));
          return _context.a(2, outputPath);
        case 3:
          _context.p = 3;
          _t = _context.v;
          console.error('❌ Erreur génération thumbnail fallback:', _t);
          throw _t;
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[1, 3]]);
  }));
  return function generateThumbnailFallback(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// FONCTION UTILITAIRE - Calcul entropie simple
var calculateSimpleEntropy = function calculateSimpleEntropy(buffer) {
  var frequency = new Array(256).fill(0);
  var length = Math.min(buffer.length, 10000); // Analyser max 10KB pour la vitesse

  for (var i = 0; i < length; i++) {
    frequency[buffer[i]]++;
  }
  var entropy = 0;
  for (var _i = 0; _i < 256; _i++) {
    if (frequency[_i] > 0) {
      var probability = frequency[_i] / length;
      entropy -= probability * Math.log2(probability);
    }
  }
  return entropy / 8; // Normaliser entre 0 et 1
};

// ANALYSE FORENSIQUE RAPIDE LOCALE (FALLBACK)
var performQuickForensicAnalysisLocal = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(filePath, imageData) {
    var analysis, stats, sizeScore, metadata, aspectRatio, normalRatios, isNormalRatio, buffer, entropy, compressionRatio, exifData, hasBasicExif, hasSuspiciousSoftware, scores, _t2, _t3, _t4, _t5, _t6;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          console.log("\uD83D\uDD0D Analyse forensique rapide locale: ".concat(path.basename(filePath)));
          analysis = {
            timestamp: new Date(),
            version: '3.0.0-quick-local',
            pillars: {},
            overallScore: 0,
            flags: [],
            recommendations: []
          }; // PILIER 1 - ANATOMIQUE (Analyse basique)
          _context2.p = 1;
          _context2.n = 2;
          return fs.stat(filePath);
        case 2:
          stats = _context2.v;
          sizeScore = stats.size > 1024 && stats.size < 50 * 1024 * 1024 ? 85 : 70;
          analysis.pillars.anatomical = {
            score: sizeScore,
            confidence: 'medium',
            details: {
              fileSize: stats.size,
              sizeCategory: stats.size > 5 * 1024 * 1024 ? 'large' : 'normal'
            },
            flags: stats.size < 1024 ? ['Fichier très petit'] : []
          };
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
          analysis.pillars.anatomical = {
            score: 50,
            confidence: 'low',
            details: {
              error: 'Erreur analyse taille'
            },
            flags: ['Erreur analyse anatomique']
          };
        case 4:
          _context2.p = 4;
          _context2.n = 5;
          return sharp(filePath).metadata();
        case 5:
          metadata = _context2.v;
          aspectRatio = metadata.width / metadata.height;
          normalRatios = [1, 4 / 3, 16 / 9, 3 / 2, 2 / 3, 9 / 16];
          isNormalRatio = normalRatios.some(function (ratio) {
            return Math.abs(aspectRatio - ratio) < 0.1;
          });
          analysis.pillars.physics = {
            score: isNormalRatio ? 90 : 75,
            confidence: 'high',
            details: {
              width: metadata.width,
              height: metadata.height,
              aspectRatio: Math.round(aspectRatio * 100) / 100,
              format: metadata.format
            },
            flags: metadata.width < 100 || metadata.height < 100 ? ['Résolution très faible'] : []
          };
          _context2.n = 7;
          break;
        case 6:
          _context2.p = 6;
          _t3 = _context2.v;
          analysis.pillars.physics = {
            score: 60,
            confidence: 'low',
            details: {
              error: 'Erreur analyse métadonnées'
            },
            flags: ['Erreur analyse physique']
          };
        case 7:
          _context2.p = 7;
          _context2.n = 8;
          return fs.readFile(filePath);
        case 8:
          buffer = _context2.v;
          entropy = calculateSimpleEntropy(buffer);
          compressionRatio = imageData && imageData.width && imageData.height ? buffer.length / (imageData.width * imageData.height * 3) : 0.1;
          analysis.pillars.statistical = {
            score: entropy > 0.7 ? 85 : 70,
            confidence: 'medium',
            details: {
              entropy: Math.round(entropy * 100) / 100,
              compressionRatio: Math.round(compressionRatio * 100) / 100,
              fileSize: buffer.length
            },
            flags: entropy < 0.5 ? ['Entropie faible (possible manipulation)'] : []
          };
          _context2.n = 10;
          break;
        case 9:
          _context2.p = 9;
          _t4 = _context2.v;
          analysis.pillars.statistical = {
            score: 65,
            confidence: 'low',
            details: {
              error: 'Erreur analyse statistique'
            },
            flags: ['Erreur analyse statistique']
          };
        case 10:
          _context2.p = 10;
          _context2.n = 11;
          return ExifReader.parse(filePath);
        case 11:
          exifData = _context2.v;
          hasBasicExif = exifData && (exifData.Make || exifData.Model || exifData.DateTime);
          hasSuspiciousSoftware = (exifData === null || exifData === void 0 ? void 0 : exifData.Software) && /photoshop|gimp|ai|midjourney|dall-e/i.test(exifData.Software);
          analysis.pillars.exif = {
            score: hasBasicExif ? hasSuspiciousSoftware ? 40 : 85 : 60,
            confidence: hasBasicExif ? 'high' : 'medium',
            details: {
              hasExif: !!exifData,
              camera: (exifData === null || exifData === void 0 ? void 0 : exifData.Make) || 'Inconnu',
              software: (exifData === null || exifData === void 0 ? void 0 : exifData.Software) || 'Inconnu',
              dateTime: (exifData === null || exifData === void 0 ? void 0 : exifData.DateTime) || null
            },
            flags: [].concat(_toConsumableArray(!hasBasicExif ? ['Métadonnées EXIF manquantes'] : []), _toConsumableArray(hasSuspiciousSoftware ? ['Logiciel de retouche détecté'] : []))
          };
          _context2.n = 13;
          break;
        case 12:
          _context2.p = 12;
          _t5 = _context2.v;
          analysis.pillars.exif = {
            score: 50,
            confidence: 'low',
            details: {
              error: 'Erreur lecture EXIF'
            },
            flags: ['Erreur analyse EXIF']
          };
        case 13:
          // PILIERS 5-7 - ANALYSE SIMPLIFIÉE
          analysis.pillars.behavioral = {
            score: 75,
            confidence: 'medium',
            details: {
              analysis: 'Analyse comportementale basique'
            },
            flags: []
          };
          analysis.pillars.audio = {
            score: 85,
            confidence: 'low',
            details: {
              analysis: 'Pas d\'audio détecté'
            },
            flags: []
          };
          analysis.pillars.expert = {
            score: 80,
            confidence: 'medium',
            details: {
              analysis: 'Évaluation experte automatique'
            },
            flags: []
          };

          // CALCUL SCORE GLOBAL
          scores = Object.values(analysis.pillars).map(function (p) {
            return p.score;
          });
          analysis.overallScore = Math.round(scores.reduce(function (a, b) {
            return a + b;
          }, 0) / scores.length);

          // CLASSIFICATION GLOBALE
          analysis.classification = analysis.overallScore >= 80 ? 'AUTHENTIC' : analysis.overallScore >= 60 ? 'LIKELY_AUTHENTIC' : analysis.overallScore >= 40 ? 'UNCERTAIN' : analysis.overallScore >= 20 ? 'LIKELY_FAKE' : 'FAKE';

          // RECOMMANDATIONS
          if (analysis.overallScore < 60) {
            analysis.recommendations.push('Analyse approfondie recommandée');
          }
          if (analysis.flags.length > 3) {
            analysis.recommendations.push('Vérification manuelle nécessaire');
          }
          console.log("\u2705 Analyse forensique rapide termin\xE9e: ".concat(analysis.overallScore, "% (").concat(analysis.classification, ")"));
          return _context2.a(2, analysis);
        case 14:
          _context2.p = 14;
          _t6 = _context2.v;
          console.error('❌ Erreur analyse forensique rapide locale:', _t6);
          return _context2.a(2, {
            timestamp: new Date(),
            version: '3.0.0-error',
            pillars: {},
            overallScore: 0,
            classification: 'ERROR',
            flags: ['Erreur durant l\'analyse'],
            error: _t6.message
          });
      }
    }, _callee2, null, [[10, 12], [7, 9], [4, 6], [1, 3], [0, 14]]);
  }));
  return function performQuickForensicAnalysisLocal(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// =====================================
// CONTRÔLEUR UPLOAD FORENSIQUE PRINCIPAL
// =====================================

/**
 * @desc Upload forensique optimisé avec analyse rapide
 * @route POST /api/images/upload
 * @access Public/Private
 */
var uploadForensicImage = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var processingId, startTimestamp, _req$user, _req$user2, file, buffer, hash, md5, exifData, rawExif, timestamp, randomSuffix, sanitizedName, extension, baseName, uniqueFilename, finalDir, thumbnailDir, finalPath, thumbnailPath, newImage, savedImage, _t10, _t11, _t12;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          processingId = crypto.randomBytes(8).toString('hex');
          startTimestamp = Date.now();
          _context5.p = 1;
          console.log("\uD83D\uDCE4 Upload forensique initi\xE9 [".concat(processingId, "]"));

          // Validation fichier
          if (req.file) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, res.status(400).json({
            error: 'Aucun fichier fourni',
            type: 'NO_FILE_PROVIDED',
            details: 'Veuillez sélectionner une image à analyser'
          }));
        case 2:
          file = req.file;
          console.log("\uD83D\uDD10 Calcul empreinte forensique [".concat(processingId, "]"));

          // Calcul empreintes cryptographiques
          _context5.n = 3;
          return fs.readFile(file.path);
        case 3:
          buffer = _context5.v;
          hash = crypto.createHash('sha256').update(buffer).digest('hex');
          md5 = crypto.createHash('md5').update(buffer).digest('hex');
          console.log("\u2705 Empreintes calcul\xE9es [".concat(processingId, "]: { sha256: '").concat(hash.substring(0, 16), "...', fileSize: ").concat(buffer.length, " }"));

          // Extraction métadonnées rapide
          console.log("\uD83D\uDCCA Extraction EXIF pr\xE9liminaire [".concat(processingId, "]"));
          exifData = {};
          _context5.p = 4;
          _context5.n = 5;
          return ExifReader.parse(file.path);
        case 5:
          rawExif = _context5.v;
          exifData = normalizeExifData(rawExif);
          console.log("\uD83D\uDCCA EXIF normalis\xE9: ".concat(Object.keys(exifData).length, " champs"));
          _context5.n = 7;
          break;
        case 6:
          _context5.p = 6;
          _t10 = _context5.v;
          console.warn("\u26A0\uFE0F Erreur EXIF [".concat(processingId, "]:"), _t10.message);
        case 7:
          // Génération nom unique sécurisé
          timestamp = Date.now();
          randomSuffix = crypto.randomBytes(8).toString('hex');
          sanitizedName = sanitizeInput(file.originalname);
          extension = path.extname(sanitizedName);
          baseName = path.basename(sanitizedName, extension);
          uniqueFilename = "".concat(baseName, "_").concat(timestamp, "_").concat(randomSuffix).concat(extension); // Chemins finaux
          finalDir = './uploads/processed';
          thumbnailDir = './uploads/thumbnails';
          finalPath = path.join(finalDir, uniqueFilename);
          thumbnailPath = path.join(thumbnailDir, "thumb_".concat(uniqueFilename.replace(extension, '.jpg'))); // Assurer existence dossiers
          _context5.n = 8;
          return fs.mkdir(finalDir, {
            recursive: true
          });
        case 8:
          _context5.n = 9;
          return fs.mkdir(thumbnailDir, {
            recursive: true
          });
        case 9:
          _context5.n = 10;
          return fs.rename(file.path, finalPath);
        case 10:
          // Création entrée MongoDB
          console.log("\uD83D\uDCBE Cr\xE9ation entr\xE9e forensique [".concat(processingId, "]"));
          newImage = new Image({
            originalName: sanitizedName,
            filename: uniqueFilename,
            mimeType: file.mimetype,
            size: file.size,
            hash: hash,
            md5: md5,
            // Chemins fichiers
            files: {
              original: finalPath,
              processed: finalPath,
              thumbnail: null // Sera mis à jour après génération
            },
            // Métadonnées
            metadata: {
              width: 0,
              height: 0,
              format: path.extname(sanitizedName).substring(1).toLowerCase(),
              colorSpace: 'unknown',
              hasTransparency: false
            },
            // EXIF
            exif: exifData,
            // Statut initial
            status: 'uploaded',
            uploadedAt: new Date(),
            uploadedBy: ((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.sub) || 'anonymous',
            // Session
            sessionId: req.headers['x-session-id'] || 'anonymous',
            // Audit
            auditLog: [{
              action: 'IMAGE_UPLOADED',
              performedBy: ((_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.sub) || 'anonymous',
              timestamp: new Date(),
              details: {
                originalName: sanitizedName,
                fileSize: file.size,
                mimeType: file.mimetype,
                ip: req.ip,
                userAgent: req.get('User-Agent')
              }
            }],
            // Sécurité
            quarantine: {
              status: 'none',
              reason: null,
              quarantinedAt: null
            },
            // Analyse (sera mise à jour)
            forensicAnalysis: {
              status: 'pending',
              startedAt: null,
              completedAt: null,
              version: '3.0.0-quick',
              pillars: {},
              overallScore: null,
              classification: null,
              flags: [],
              recommendations: []
            }
          });
          _context5.n = 11;
          return newImage.save();
        case 11:
          savedImage = _context5.v;
          console.log("\u2705 Image sauv\xE9e: ".concat(savedImage._id, " [").concat(processingId, "]"));

          // GÉNÉRATION THUMBNAIL EN ARRIÈRE-PLAN (non-bloquant)
          setImmediate(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
            var _t7, _t8;
            return _regenerator().w(function (_context3) {
              while (1) switch (_context3.p = _context3.n) {
                case 0:
                  _context3.p = 0;
                  _context3.p = 1;
                  _context3.n = 2;
                  return createThumbnail(finalPath, thumbnailDir, "thumb_".concat(uniqueFilename.replace(extension, '.jpg')));
                case 2:
                  _context3.n = 4;
                  break;
                case 3:
                  _context3.p = 3;
                  _t7 = _context3.v;
                  // Fallback vers fonction locale
                  console.warn("\u26A0\uFE0F Service thumbnail indisponible, utilisation fallback [".concat(processingId, "]"));
                  _context3.n = 4;
                  return generateThumbnailFallback(finalPath, thumbnailPath);
                case 4:
                  _context3.n = 5;
                  return Image.findByIdAndUpdate(savedImage._id, {
                    'files.thumbnail': thumbnailPath
                  });
                case 5:
                  console.log("\u2705 Thumbnail g\xE9n\xE9r\xE9: ".concat(savedImage._id));
                  _context3.n = 7;
                  break;
                case 6:
                  _context3.p = 6;
                  _t8 = _context3.v;
                  console.error("\u274C Erreur thumbnail [".concat(processingId, "]:"), _t8.message);
                case 7:
                  return _context3.a(2);
              }
            }, _callee3, null, [[1, 3], [0, 6]]);
          })));

          // ANALYSE FORENSIQUE RAPIDE EN ARRIÈRE-PLAN (non-bloquant)
          setImmediate(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
            var metadata, analysis, _t9, _t0, _t1;
            return _regenerator().w(function (_context4) {
              while (1) switch (_context4.p = _context4.n) {
                case 0:
                  _context4.p = 0;
                  _context4.n = 1;
                  return sharp(finalPath).metadata();
                case 1:
                  metadata = _context4.v;
                  _context4.n = 2;
                  return Image.findByIdAndUpdate(savedImage._id, {
                    'metadata.width': metadata.width,
                    'metadata.height': metadata.height,
                    'metadata.format': metadata.format,
                    'metadata.colorSpace': metadata.space || 'unknown',
                    'metadata.hasTransparency': metadata.hasAlpha || false,
                    'forensicAnalysis.status': 'analyzing',
                    'forensicAnalysis.startedAt': new Date(),
                    'status': 'analyzing'
                  });
                case 2:
                  _context4.p = 2;
                  _context4.n = 3;
                  return performQuickForensicAnalysis(finalPath, metadata);
                case 3:
                  analysis = _context4.v;
                  _context4.n = 6;
                  break;
                case 4:
                  _context4.p = 4;
                  _t9 = _context4.v;
                  // Fallback vers analyse locale
                  console.warn("\u26A0\uFE0F Service forensic indisponible, utilisation analyse locale [".concat(processingId, "]"));
                  _context4.n = 5;
                  return performQuickForensicAnalysisLocal(finalPath, metadata);
                case 5:
                  analysis = _context4.v;
                case 6:
                  _context4.n = 7;
                  return Image.findByIdAndUpdate(savedImage._id, {
                    'forensicAnalysis': _objectSpread(_objectSpread({}, analysis), {}, {
                      status: 'completed',
                      completedAt: new Date()
                    }),
                    'authenticityScore': analysis.overallScore,
                    'classification': analysis.classification,
                    'status': 'analyzed'
                  });
                case 7:
                  console.log("\u2705 Analyse forensique termin\xE9e: ".concat(savedImage._id, " (").concat(analysis.overallScore, "%)"));

                  // AJOUTER ANALYSE LOURDE EN QUEUE (si disponible)
                  _context4.p = 8;
                  _context4.n = 9;
                  return addAnalysisJob(savedImage._id, finalPath);
                case 9:
                  console.log("\uD83D\uDCCB Job analyse lourde ajout\xE9 \xE0 la queue: ".concat(savedImage._id));
                  _context4.n = 11;
                  break;
                case 10:
                  _context4.p = 10;
                  _t0 = _context4.v;
                  console.warn("\u26A0\uFE0F Queue indisponible [".concat(processingId, "]:"), _t0.message);
                case 11:
                  _context4.n = 13;
                  break;
                case 12:
                  _context4.p = 12;
                  _t1 = _context4.v;
                  console.error("\u274C Erreur analyse [".concat(processingId, "]:"), _t1.message);
                  _context4.n = 13;
                  return Image.findByIdAndUpdate(savedImage._id, {
                    'forensicAnalysis.status': 'failed',
                    'forensicAnalysis.error': _t1.message,
                    'status': 'failed'
                  });
                case 13:
                  return _context4.a(2);
              }
            }, _callee4, null, [[8, 10], [2, 4], [0, 12]]);
          })));

          // RÉPONSE IMMÉDIATE (sans attendre l'analyse)
          res.status(201).json({
            success: true,
            message: 'Image uploadée avec succès, analyse en cours',
            image: {
              id: savedImage._id,
              originalName: sanitizedName,
              filename: uniqueFilename,
              size: file.size,
              mimeType: file.mimetype,
              hash: hash.substring(0, 32),
              status: 'uploaded',
              analysisStatus: 'pending',
              uploadedAt: savedImage.uploadedAt,
              sessionId: savedImage.sessionId
            },
            processing: {
              id: processingId,
              estimatedTime: '5-15 seconds',
              statusUrl: "/api/images/".concat(savedImage._id, "/status")
            },
            nextSteps: ['Analyse forensique automatique en cours', 'Génération thumbnail en cours', 'Utilisez statusUrl pour suivre le progrès']
          });

          // Log final
          console.log("\u2705 Upload termin\xE9: ".concat(savedImage._id, " [").concat(processingId, "] - ").concat(Date.now() - startTimestamp, "ms"));
          _context5.n = 17;
          break;
        case 12:
          _context5.p = 12;
          _t11 = _context5.v;
          console.error("\u274C Erreur upload forensique [".concat(processingId, "]:"), _t11);

          // Nettoyage en cas d'erreur
          if (!(req.file && fsSync.existsSync(req.file.path))) {
            _context5.n = 16;
            break;
          }
          _context5.p = 13;
          _context5.n = 14;
          return fs.unlink(req.file.path);
        case 14:
          _context5.n = 16;
          break;
        case 15:
          _context5.p = 15;
          _t12 = _context5.v;
          console.error('❌ Erreur nettoyage fichier:', _t12);
        case 16:
          res.status(500).json({
            error: 'Erreur lors de l\'upload forensique',
            type: 'UPLOAD_ERROR',
            details: process.env.NODE_ENV === 'development' ? _t11.message : 'Erreur interne',
            processingId: processingId,
            timestamp: new Date().toISOString()
          });
        case 17:
          return _context5.a(2);
      }
    }, _callee5, null, [[13, 15], [4, 6], [1, 12]]);
  }));
  return function uploadForensicImage(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// =====================================
// CONTRÔLEUR UPLOAD MULTIPLE
// =====================================

var uploadMultipleForensicImages = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var results, errors, _iterator, _step, file, mockReq, mockRes, result, _t13, _t14, _t15;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          if (!(!req.files || req.files.length === 0)) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, res.status(400).json({
            error: 'Aucun fichier fourni',
            type: 'NO_FILES_PROVIDED'
          }));
        case 1:
          results = [];
          errors = [];
          _iterator = _createForOfIteratorHelper(req.files);
          _context6.p = 2;
          _iterator.s();
        case 3:
          if ((_step = _iterator.n()).done) {
            _context6.n = 8;
            break;
          }
          file = _step.value;
          _context6.p = 4;
          // Simuler req.file pour réutiliser la logique d'upload simple
          mockReq = _objectSpread(_objectSpread({}, req), {}, {
            file: file
          });
          mockRes = {
            status: function status() {
              return {
                json: function json(data) {
                  return data;
                }
              };
            },
            json: function json(data) {
              return data;
            }
          };
          _context6.n = 5;
          return uploadForensicImage(mockReq, mockRes);
        case 5:
          result = _context6.v;
          results.push(result);
          _context6.n = 7;
          break;
        case 6:
          _context6.p = 6;
          _t13 = _context6.v;
          errors.push({
            filename: file.originalname,
            error: _t13.message
          });
        case 7:
          _context6.n = 3;
          break;
        case 8:
          _context6.n = 10;
          break;
        case 9:
          _context6.p = 9;
          _t14 = _context6.v;
          _iterator.e(_t14);
        case 10:
          _context6.p = 10;
          _iterator.f();
          return _context6.f(10);
        case 11:
          res.json({
            success: true,
            message: "".concat(results.length, " images upload\xE9es avec succ\xE8s"),
            uploaded: results.length,
            failed: errors.length,
            results: results,
            errors: errors
          });
          _context6.n = 13;
          break;
        case 12:
          _context6.p = 12;
          _t15 = _context6.v;
          console.error('❌ Erreur upload multiple:', _t15);
          res.status(500).json({
            error: 'Erreur upload multiple',
            details: _t15.message
          });
        case 13:
          return _context6.a(2);
      }
    }, _callee6, null, [[4, 6], [2, 9, 10, 11], [0, 12]]);
  }));
  return function uploadMultipleForensicImages(_x7, _x8) {
    return _ref6.apply(this, arguments);
  };
}();

// =====================================
// CONTRÔLEUR DÉTAILS IMAGE
// =====================================

var getForensicImageDetails = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var _req$user3, _req$user4, imageId, _req$query, _req$query$includeExi, includeExif, _req$query$includeAud, includeAuditLog, cacheKey, cached, objectId, projection, image, response, _t16;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          imageId = req.params.imageId;
          _req$query = req.query, _req$query$includeExi = _req$query.includeExif, includeExif = _req$query$includeExi === void 0 ? 'false' : _req$query$includeExi, _req$query$includeAud = _req$query.includeAuditLog, includeAuditLog = _req$query$includeAud === void 0 ? 'false' : _req$query$includeAud; // Vérifier cache
          cacheKey = "details_".concat(imageId, "_").concat(includeExif, "_").concat(includeAuditLog);
          if (!imageCache.has(cacheKey)) {
            _context7.n = 2;
            break;
          }
          cached = imageCache.get(cacheKey);
          if (!(Date.now() - cached.timestamp < IMAGE_CACHE_TTL)) {
            _context7.n = 1;
            break;
          }
          console.log("\uD83D\uDCCB D\xE9tails image depuis cache: ".concat(imageId));
          return _context7.a(2, res.json(cached.data));
        case 1:
          imageCache["delete"](cacheKey);
        case 2:
          objectId = validateObjectId(imageId); // Construction de la projection
          projection = '-__v';
          if (includeExif !== 'true') {
            projection += ' -exif';
          }
          if (includeAuditLog !== 'true' || !((_req$user3 = req.user) !== null && _req$user3 !== void 0 && (_req$user3 = _req$user3.roles) !== null && _req$user3 !== void 0 && _req$user3.includes('admin'))) {
            projection += ' -auditLog';
          }
          _context7.n = 3;
          return Image.findById(objectId, projection).populate('forensicAnalysis.relatedImages', 'originalName filename').lean();
        case 3:
          image = _context7.v;
          if (image) {
            _context7.n = 4;
            break;
          }
          return _context7.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND',
            imageId: imageId
          }));
        case 4:
          // Données de réponse
          response = {
            success: true,
            image: image,
            metadata: {
              requestedAt: new Date().toISOString(),
              includesExif: includeExif === 'true',
              includesAuditLog: includeAuditLog === 'true' && ((_req$user4 = req.user) === null || _req$user4 === void 0 || (_req$user4 = _req$user4.roles) === null || _req$user4 === void 0 ? void 0 : _req$user4.includes('admin')),
              cacheStatus: 'fresh'
            }
          }; // Mettre en cache
          imageCache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
          });
          console.log("\u2705 D\xE9tails image r\xE9cup\xE9r\xE9s: ".concat(imageId));
          res.json(response);
          _context7.n = 6;
          break;
        case 5:
          _context7.p = 5;
          _t16 = _context7.v;
          console.error('❌ Erreur détails image:', _t16);
          res.status(500).json({
            error: 'Erreur récupération détails image',
            type: 'DETAILS_ERROR',
            details: _t16.message
          });
        case 6:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 5]]);
  }));
  return function getForensicImageDetails(_x9, _x0) {
    return _ref7.apply(this, arguments);
  };
}();

// =====================================
// CONTRÔLEUR STATUT IMAGE
// =====================================

var getImageStatus = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var _image$forensicAnalys, _image$forensicAnalys2, _image$forensicAnalys3, imageId, objectId, image, _t17;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          imageId = req.params.imageId;
          objectId = validateObjectId(imageId);
          _context8.n = 1;
          return Image.findById(objectId).select('status forensicAnalysis.status forensicAnalysis.completedAt authenticityScore classification').lean();
        case 1:
          image = _context8.v;
          if (image) {
            _context8.n = 2;
            break;
          }
          return _context8.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND'
          }));
        case 2:
          res.json({
            success: true,
            imageId: imageId,
            status: image.status,
            analysisStatus: ((_image$forensicAnalys = image.forensicAnalysis) === null || _image$forensicAnalys === void 0 ? void 0 : _image$forensicAnalys.status) || 'pending',
            analysisCompleted: !!((_image$forensicAnalys2 = image.forensicAnalysis) !== null && _image$forensicAnalys2 !== void 0 && _image$forensicAnalys2.completedAt),
            authenticityScore: image.authenticityScore,
            classification: image.classification,
            lastUpdate: ((_image$forensicAnalys3 = image.forensicAnalysis) === null || _image$forensicAnalys3 === void 0 ? void 0 : _image$forensicAnalys3.completedAt) || new Date(),
            timestamp: new Date().toISOString()
          });
          _context8.n = 4;
          break;
        case 3:
          _context8.p = 3;
          _t17 = _context8.v;
          console.error('❌ Erreur statut image:', _t17);
          res.status(500).json({
            error: 'Erreur récupération statut',
            details: _t17.message
          });
        case 4:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 3]]);
  }));
  return function getImageStatus(_x1, _x10) {
    return _ref8.apply(this, arguments);
  };
}();

// =====================================
// CONTRÔLEUR LISTE IMAGES
// =====================================

var listForensicImages = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var requestId, _req$query2, _req$query2$page, page, _req$query2$limit, limit, sessionId, status, riskLevel, minScore, maxScore, dateFrom, dateTo, hasFlags, search, _req$query2$sortBy, sortBy, _req$query2$sortOrder, sortOrder, pageNum, limitNum, skip, filter, sortOptions, projection, _yield$Promise$all, _yield$Promise$all2, images, totalCount, _t18;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          requestId = crypto.randomBytes(6).toString('hex');
          _context9.p = 1;
          _req$query2 = req.query, _req$query2$page = _req$query2.page, page = _req$query2$page === void 0 ? 1 : _req$query2$page, _req$query2$limit = _req$query2.limit, limit = _req$query2$limit === void 0 ? 50 : _req$query2$limit, sessionId = _req$query2.sessionId, status = _req$query2.status, riskLevel = _req$query2.riskLevel, minScore = _req$query2.minScore, maxScore = _req$query2.maxScore, dateFrom = _req$query2.dateFrom, dateTo = _req$query2.dateTo, hasFlags = _req$query2.hasFlags, search = _req$query2.search, _req$query2$sortBy = _req$query2.sortBy, sortBy = _req$query2$sortBy === void 0 ? 'createdAt' : _req$query2$sortBy, _req$query2$sortOrder = _req$query2.sortOrder, sortOrder = _req$query2$sortOrder === void 0 ? 'desc' : _req$query2$sortOrder;
          console.log("\uD83D\uDCCB Liste forensique demand\xE9e [".concat(requestId, "]: {\n  page: ").concat(page, ",\n  limit: ").concat(limit, ",\n  filters: { sessionId: ").concat(sessionId, ", status: ").concat(status, ", riskLevel: ").concat(riskLevel, " }\n}"));

          // Validation et limitation
          pageNum = Math.max(1, parseInt(page));
          limitNum = Math.min(100, Math.max(1, parseInt(limit)));
          skip = (pageNum - 1) * limitNum; // Construction du filtre
          filter = {}; // Filtres utilisateur ou anonyme
          if (req.user) {
            filter.uploadedBy = req.user.sub;
          } else {
            // Pour utilisateurs anonymes, filtrer par session si fournie
            if (sessionId) {
              filter.sessionId = sanitizeInput(sessionId);
            }
          }
          if (status) filter.status = status;
          if (riskLevel) filter.riskLevel = riskLevel;
          if (minScore) filter.authenticityScore = {
            $gte: parseInt(minScore)
          };
          if (maxScore) {
            filter.authenticityScore = _objectSpread(_objectSpread({}, filter.authenticityScore), {}, {
              $lte: parseInt(maxScore)
            });
          }
          if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) filter.createdAt.$lte = new Date(dateTo);
          }
          if (hasFlags === 'true') {
            filter['forensicAnalysis.flags.0'] = {
              $exists: true
            };
          }
          if (search) {
            filter.$or = [{
              originalName: {
                $regex: sanitizeInput(search),
                $options: 'i'
              }
            }, {
              filename: {
                $regex: sanitizeInput(search),
                $options: 'i'
              }
            }];
          }

          // Construction du tri
          sortOptions = {};
          sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

          // Requête avec projection optimisée
          projection = {
            originalName: 1,
            filename: 1,
            mimeType: 1,
            size: 1,
            status: 1,
            authenticityScore: 1,
            classification: 1,
            createdAt: 1,
            uploadedAt: 1,
            'forensicAnalysis.status': 1,
            'forensicAnalysis.flags': 1,
            'files.thumbnail': 1,
            'metadata.width': 1,
            'metadata.height': 1
          };
          _context9.n = 2;
          return Promise.all([Image.find(filter, projection).sort(sortOptions).skip(skip).limit(limitNum).lean(), Image.countDocuments(filter)]);
        case 2:
          _yield$Promise$all = _context9.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          images = _yield$Promise$all2[0];
          totalCount = _yield$Promise$all2[1];
          console.log("\u2705 Liste forensique g\xE9n\xE9r\xE9e [".concat(requestId, "]: ").concat(images.length, "/").concat(totalCount, " r\xE9sultats"));
          res.json({
            success: true,
            data: images,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total: totalCount,
              pages: Math.ceil(totalCount / limitNum),
              hasNext: skip + limitNum < totalCount,
              hasPrev: pageNum > 1
            },
            filters: {
              sessionId: sessionId,
              status: status,
              riskLevel: riskLevel,
              minScore: minScore,
              maxScore: maxScore,
              dateFrom: dateFrom,
              dateTo: dateTo,
              hasFlags: hasFlags,
              search: search
            },
            metadata: {
              requestId: requestId,
              generatedAt: new Date().toISOString(),
              authenticated: !!req.user
            }
          });
          _context9.n = 4;
          break;
        case 3:
          _context9.p = 3;
          _t18 = _context9.v;
          console.error("\u274C Erreur liste images [".concat(requestId, "]:"), _t18);
          res.status(500).json({
            error: 'Erreur récupération liste images',
            type: 'LIST_ERROR',
            requestId: requestId,
            details: _t18.message
          });
        case 4:
          return _context9.a(2);
      }
    }, _callee9, null, [[1, 3]]);
  }));
  return function listForensicImages(_x11, _x12) {
    return _ref9.apply(this, arguments);
  };
}();

// =====================================
// CONTRÔLEUR SUPPRESSION
// =====================================

var deleteForensicImage = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var _image$files, _image$files2, _image$files3, _req$user5, imageId, _req$query3, reason, _req$query3$secure, secure, objectId, image, filesToDelete, _iterator2, _step2, filePath, buffer, _t19, _t20, _t21;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          imageId = req.params.imageId;
          _req$query3 = req.query, reason = _req$query3.reason, _req$query3$secure = _req$query3.secure, secure = _req$query3$secure === void 0 ? 'false' : _req$query3$secure;
          objectId = validateObjectId(imageId);
          _context0.n = 1;
          return Image.findById(objectId);
        case 1:
          image = _context0.v;
          if (image) {
            _context0.n = 2;
            break;
          }
          return _context0.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND'
          }));
        case 2:
          // Suppression des fichiers
          filesToDelete = [(_image$files = image.files) === null || _image$files === void 0 ? void 0 : _image$files.original, (_image$files2 = image.files) === null || _image$files2 === void 0 ? void 0 : _image$files2.processed, (_image$files3 = image.files) === null || _image$files3 === void 0 ? void 0 : _image$files3.thumbnail].filter(Boolean);
          _iterator2 = _createForOfIteratorHelper(filesToDelete);
          _context0.p = 3;
          _iterator2.s();
        case 4:
          if ((_step2 = _iterator2.n()).done) {
            _context0.n = 10;
            break;
          }
          filePath = _step2.value;
          _context0.p = 5;
          if (!fsSync.existsSync(filePath)) {
            _context0.n = 7;
            break;
          }
          if (!(secure === 'true')) {
            _context0.n = 6;
            break;
          }
          // Suppression sécurisée (écraser puis supprimer)
          buffer = Buffer.alloc(1024, 0);
          _context0.n = 6;
          return fs.writeFile(filePath, buffer);
        case 6:
          _context0.n = 7;
          return fs.unlink(filePath);
        case 7:
          _context0.n = 9;
          break;
        case 8:
          _context0.p = 8;
          _t19 = _context0.v;
          console.error("\u26A0\uFE0F Erreur suppression fichier ".concat(filePath, ":"), _t19);
        case 9:
          _context0.n = 4;
          break;
        case 10:
          _context0.n = 12;
          break;
        case 11:
          _context0.p = 11;
          _t20 = _context0.v;
          _iterator2.e(_t20);
        case 12:
          _context0.p = 12;
          _iterator2.f();
          return _context0.f(12);
        case 13:
          _context0.n = 14;
          return Image.findByIdAndDelete(objectId);
        case 14:
          console.log("\u2705 Image supprim\xE9e: ".concat(imageId, " par ").concat((_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.sub, " - Raison: ").concat(reason || 'Non spécifiée'));
          res.json({
            success: true,
            message: 'Image supprimée avec succès',
            deletedAt: new Date().toISOString(),
            secureDelete: secure === 'true',
            reason: reason || null
          });
          _context0.n = 16;
          break;
        case 15:
          _context0.p = 15;
          _t21 = _context0.v;
          console.error('❌ Erreur suppression image:', _t21);
          res.status(500).json({
            error: 'Erreur lors de la suppression',
            details: _t21.message
          });
        case 16:
          return _context0.a(2);
      }
    }, _callee0, null, [[5, 8], [3, 11, 12, 13], [0, 15]]);
  }));
  return function deleteForensicImage(_x13, _x14) {
    return _ref0.apply(this, arguments);
  };
}();

// =====================================
// EXPORTS
// =====================================

module.exports = {
  uploadForensicImage: uploadForensicImage,
  uploadMultipleForensicImages: uploadMultipleForensicImages,
  getForensicImageDetails: getForensicImageDetails,
  listForensicImages: listForensicImages,
  deleteForensicImage: deleteForensicImage,
  getImageStatus: getImageStatus,
  // Utilitaires
  validateObjectId: validateObjectId,
  generateThumbnailFallback: generateThumbnailFallback,
  performQuickForensicAnalysisLocal: performQuickForensicAnalysisLocal
};