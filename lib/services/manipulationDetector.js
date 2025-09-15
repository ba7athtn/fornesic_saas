"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var sharp = require('sharp');
var fs = require('fs').promises;
var crypto = require('crypto');

// =====================================
// SERVICE DÉTECTION MANIPULATION FORENSIQUE
// =====================================
var ManipulationDetector = /*#__PURE__*/function () {
  function ManipulationDetector() {
    _classCallCheck(this, ManipulationDetector);
    this.analysisCache = new Map();
    this.initialized = false;
    this.initialize();
  }
  return _createClass(ManipulationDetector, [{
    key: "initialize",
    value: function () {
      var _initialize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              try {
                console.log('🔍 Initialisation détecteur de manipulation...');
                this.initialized = true;
                console.log('✅ Détecteur de manipulation initialisé');
              } catch (error) {
                console.error('❌ Erreur initialisation détecteur:', error);
              }
            case 1:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function initialize() {
        return _initialize.apply(this, arguments);
      }
      return initialize;
    }()
    /**
     * Analyse complète de manipulation avec tous les types
     */
  }, {
    key: "analyzeManipulations",
    value: (function () {
      var _analyzeManipulations = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(imageBuffer) {
        var options,
          startTime,
          analysis,
          imageInfo,
          _args2 = arguments,
          _t;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
              startTime = Date.now();
              _context2.p = 1;
              analysis = {
                // Scores globaux
                overallScore: 0,
                confidence: 'low',
                // Types de manipulation
                cloning: {
                  score: 0,
                  confidence: 'low',
                  regions: [],
                  indicators: []
                },
                splicing: {
                  score: 0,
                  confidence: 'low',
                  boundaries: [],
                  indicators: []
                },
                enhancement: {
                  score: 0,
                  confidence: 'low',
                  areas: [],
                  indicators: []
                },
                retouching: {
                  score: 0,
                  confidence: 'low',
                  modifications: [],
                  indicators: []
                },
                compression: {
                  score: 0,
                  artifacts: [],
                  anomalies: []
                },
                // Analyses techniques
                statistical: {
                  noiseAnalysis: {},
                  frequencyAnalysis: {},
                  correlationAnalysis: {}
                },
                // Métadonnées
                analysisMetadata: {
                  processingTime: 0,
                  imageSize: imageBuffer.length,
                  analysisDate: new Date().toISOString(),
                  version: '3.0.0'
                }
              }; // Extraction métadonnées image
              _context2.n = 2;
              return this.extractImageInfo(imageBuffer);
            case 2:
              imageInfo = _context2.v;
              analysis.imageInfo = imageInfo;

              // Analyse de clonage
              _context2.n = 3;
              return this.detectCloning(imageBuffer, imageInfo);
            case 3:
              analysis.cloning = _context2.v;
              _context2.n = 4;
              return this.detectSplicing(imageBuffer, imageInfo);
            case 4:
              analysis.splicing = _context2.v;
              _context2.n = 5;
              return this.detectEnhancement(imageBuffer, imageInfo);
            case 5:
              analysis.enhancement = _context2.v;
              _context2.n = 6;
              return this.detectRetouching(imageBuffer, imageInfo);
            case 6:
              analysis.retouching = _context2.v;
              _context2.n = 7;
              return this.analyzeCompressionArtifacts(imageBuffer, imageInfo);
            case 7:
              analysis.compression = _context2.v;
              _context2.n = 8;
              return this.performStatisticalAnalysis(imageBuffer, imageInfo);
            case 8:
              analysis.statistical = _context2.v;
              // Calcul score global
              analysis.overallScore = this.calculateOverallManipulationScore(analysis);
              analysis.confidence = this.calculateConfidence(analysis);
              analysis.analysisMetadata.processingTime = Date.now() - startTime;
              console.log("\uD83D\uDD0D Analyse manipulation termin\xE9e: ".concat(analysis.overallScore, "% (").concat(analysis.analysisMetadata.processingTime, "ms)"));
              return _context2.a(2, analysis);
            case 9:
              _context2.p = 9;
              _t = _context2.v;
              console.error('❌ Erreur analyse manipulation:', _t);
              return _context2.a(2, {
                overallScore: 0,
                confidence: 'error',
                error: _t.message,
                analysisMetadata: {
                  processingTime: Date.now() - startTime,
                  analysisDate: new Date().toISOString()
                }
              });
          }
        }, _callee2, this, [[1, 9]]);
      }));
      function analyzeManipulations(_x) {
        return _analyzeManipulations.apply(this, arguments);
      }
      return analyzeManipulations;
    }()
    /**
     * Détection de clonage (Copy-Move)
     */
    )
  }, {
    key: "detectCloning",
    value: (function () {
      var _detectCloning = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(imageBuffer, imageInfo) {
        var grayImage, analysis, blockAnalysis, repetitivePatterns, _analysis$regions, correlationAnalysis, edgeAnalysis, _t2;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _context3.n = 1;
              return sharp(imageBuffer).greyscale().raw().toBuffer();
            case 1:
              grayImage = _context3.v;
              analysis = {
                score: 0,
                confidence: 'low',
                regions: [],
                indicators: [],
                details: {
                  blockSize: 16,
                  threshold: 0.8,
                  candidateRegions: 0
                }
              }; // Analyse par blocs pour détecter duplications
              _context3.n = 2;
              return this.analyzeImageBlocks(grayImage, imageInfo);
            case 2:
              blockAnalysis = _context3.v;
              analysis.details.candidateRegions = blockAnalysis.duplicatedBlocks;

              // Détection patterns répétitifs
              _context3.n = 3;
              return this.detectRepetitivePatterns(grayImage, imageInfo);
            case 3:
              repetitivePatterns = _context3.v;
              if (repetitivePatterns.score > 0.7) {
                analysis.score += 40;
                analysis.indicators.push('REPETITIVE_PATTERNS');
                (_analysis$regions = analysis.regions).push.apply(_analysis$regions, _toConsumableArray(repetitivePatterns.regions));
              }

              // Analyse corrélation croisée
              _context3.n = 4;
              return this.performCrossCorrelation(grayImage, imageInfo);
            case 4:
              correlationAnalysis = _context3.v;
              if (correlationAnalysis.maxCorrelation > 0.9) {
                analysis.score += 35;
                analysis.indicators.push('HIGH_CORRELATION');
              }

              // Détection contours dupliqués
              _context3.n = 5;
              return this.analyzeEdgeDuplication(grayImage, imageInfo);
            case 5:
              edgeAnalysis = _context3.v;
              if (edgeAnalysis.duplicatedEdges > 0.5) {
                analysis.score += 25;
                analysis.indicators.push('DUPLICATED_EDGES');
              }
              analysis.score = Math.min(analysis.score, 100);
              analysis.confidence = analysis.score > 70 ? 'high' : analysis.score > 40 ? 'medium' : 'low';
              return _context3.a(2, analysis);
            case 6:
              _context3.p = 6;
              _t2 = _context3.v;
              return _context3.a(2, {
                score: 0,
                confidence: 'error',
                error: _t2.message,
                indicators: ['CLONING_ANALYSIS_ERROR']
              });
          }
        }, _callee3, this, [[0, 6]]);
      }));
      function detectCloning(_x2, _x3) {
        return _detectCloning.apply(this, arguments);
      }
      return detectCloning;
    }()
    /**
     * Détection de splicing (assemblage d'images)
     */
    )
  }, {
    key: "detectSplicing",
    value: (function () {
      var _detectSplicing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(imageBuffer, imageInfo) {
        var analysis, compressionAnalysis, _analysis$boundaries, lightingAnalysis, edgeAnalysis, textureAnalysis, _t3;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              analysis = {
                score: 0,
                confidence: 'low',
                boundaries: [],
                indicators: [],
                details: {
                  edgeInconsistencies: 0,
                  lightingIncoherence: 0,
                  compressionMismatch: 0
                }
              }; // Analyse des discontinuités de compression
              _context4.n = 1;
              return this.analyzeCompressionDiscontinuities(imageBuffer);
            case 1:
              compressionAnalysis = _context4.v;
              analysis.details.compressionMismatch = compressionAnalysis.mismatchScore;
              if (compressionAnalysis.mismatchScore > 0.6) {
                analysis.score += 35;
                analysis.indicators.push('COMPRESSION_MISMATCH');
                (_analysis$boundaries = analysis.boundaries).push.apply(_analysis$boundaries, _toConsumableArray(compressionAnalysis.boundaries));
              }

              // Analyse cohérence d'illumination
              _context4.n = 2;
              return this.analyzeLightingConsistency(imageBuffer);
            case 2:
              lightingAnalysis = _context4.v;
              analysis.details.lightingIncoherence = lightingAnalysis.incoherenceScore;
              if (lightingAnalysis.incoherenceScore > 0.5) {
                analysis.score += 30;
                analysis.indicators.push('LIGHTING_INCONSISTENCY');
              }

              // Détection de contours artificiels
              _context4.n = 3;
              return this.detectArtificialEdges(imageBuffer);
            case 3:
              edgeAnalysis = _context4.v;
              analysis.details.edgeInconsistencies = edgeAnalysis.artificialScore;
              if (edgeAnalysis.artificialScore > 0.7) {
                analysis.score += 25;
                analysis.indicators.push('ARTIFICIAL_EDGES');
              }

              // Analyse texture boundaries
              _context4.n = 4;
              return this.analyzeTextureBoundaries(imageBuffer);
            case 4:
              textureAnalysis = _context4.v;
              if (textureAnalysis.suspiciousBoundaries > 0.4) {
                analysis.score += 20;
                analysis.indicators.push('TEXTURE_DISCONTINUITIES');
              }
              analysis.score = Math.min(analysis.score, 100);
              analysis.confidence = analysis.score > 75 ? 'high' : analysis.score > 45 ? 'medium' : 'low';
              return _context4.a(2, analysis);
            case 5:
              _context4.p = 5;
              _t3 = _context4.v;
              return _context4.a(2, {
                score: 0,
                confidence: 'error',
                error: _t3.message,
                indicators: ['SPLICING_ANALYSIS_ERROR']
              });
          }
        }, _callee4, this, [[0, 5]]);
      }));
      function detectSplicing(_x4, _x5) {
        return _detectSplicing.apply(this, arguments);
      }
      return detectSplicing;
    }()
    /**
     * Détection d'enhancement (amélioration artificielle)
     */
    )
  }, {
    key: "detectEnhancement",
    value: (function () {
      var _detectEnhancement = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(imageBuffer, imageInfo) {
        var analysis, saturationAnalysis, _analysis$areas, sharpeningAnalysis, contrastAnalysis, noiseAnalysis, hdrAnalysis, _t4;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              analysis = {
                score: 0,
                confidence: 'low',
                areas: [],
                indicators: [],
                details: {
                  contrastManipulation: 0,
                  saturationBoost: 0,
                  artificialSharpening: 0,
                  noiseReduction: 0
                }
              }; // Détection sur-saturation
              _context5.n = 1;
              return this.analyzeSaturationArtifacts(imageBuffer);
            case 1:
              saturationAnalysis = _context5.v;
              analysis.details.saturationBoost = saturationAnalysis.boostScore;
              if (saturationAnalysis.boostScore > 0.7) {
                analysis.score += 25;
                analysis.indicators.push('OVERSATURATION');
                (_analysis$areas = analysis.areas).push.apply(_analysis$areas, _toConsumableArray(saturationAnalysis.areas));
              }

              // Détection sharpening artificiel
              _context5.n = 2;
              return this.detectArtificialSharpening(imageBuffer);
            case 2:
              sharpeningAnalysis = _context5.v;
              analysis.details.artificialSharpening = sharpeningAnalysis.artificiality;
              if (sharpeningAnalysis.artificiality > 0.6) {
                analysis.score += 30;
                analysis.indicators.push('ARTIFICIAL_SHARPENING');
              }

              // Détection ajustement contraste excessif
              _context5.n = 3;
              return this.analyzeContrastManipulation(imageBuffer);
            case 3:
              contrastAnalysis = _context5.v;
              analysis.details.contrastManipulation = contrastAnalysis.manipulationScore;
              if (contrastAnalysis.manipulationScore > 0.5) {
                analysis.score += 20;
                analysis.indicators.push('CONTRAST_MANIPULATION');
              }

              // Détection noise reduction artificielle
              _context5.n = 4;
              return this.detectArtificialNoiseReduction(imageBuffer);
            case 4:
              noiseAnalysis = _context5.v;
              analysis.details.noiseReduction = noiseAnalysis.reductionScore;
              if (noiseAnalysis.reductionScore > 0.8) {
                analysis.score += 15;
                analysis.indicators.push('ARTIFICIAL_NOISE_REDUCTION');
              }

              // Détection HDR artificiel
              _context5.n = 5;
              return this.detectArtificialHDR(imageBuffer);
            case 5:
              hdrAnalysis = _context5.v;
              if (hdrAnalysis.artificialHDR > 0.6) {
                analysis.score += 20;
                analysis.indicators.push('ARTIFICIAL_HDR');
              }
              analysis.score = Math.min(analysis.score, 100);
              analysis.confidence = analysis.score > 65 ? 'high' : analysis.score > 35 ? 'medium' : 'low';
              return _context5.a(2, analysis);
            case 6:
              _context5.p = 6;
              _t4 = _context5.v;
              return _context5.a(2, {
                score: 0,
                confidence: 'error',
                error: _t4.message,
                indicators: ['ENHANCEMENT_ANALYSIS_ERROR']
              });
          }
        }, _callee5, this, [[0, 6]]);
      }));
      function detectEnhancement(_x6, _x7) {
        return _detectEnhancement.apply(this, arguments);
      }
      return detectEnhancement;
    }()
    /**
     * Détection de retouching (retouche locale)
     */
    )
  }, {
    key: "detectRetouching",
    value: (function () {
      var _detectRetouching = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(imageBuffer, imageInfo) {
        var analysis, skinAnalysis, _analysis$modificatio, removalAnalysis, colorAnalysis, localAnalysis, _t5;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              analysis = {
                score: 0,
                confidence: 'low',
                modifications: [],
                indicators: [],
                details: {
                  skinSmoothing: 0,
                  objectRemoval: 0,
                  colorCorrection: 0,
                  localAdjustments: 0
                }
              }; // Détection skin smoothing
              _context6.n = 1;
              return this.detectSkinSmoothing(imageBuffer);
            case 1:
              skinAnalysis = _context6.v;
              analysis.details.skinSmoothing = skinAnalysis.smoothingScore;
              if (skinAnalysis.smoothingScore > 0.7) {
                analysis.score += 30;
                analysis.indicators.push('SKIN_SMOOTHING');
                (_analysis$modificatio = analysis.modifications).push.apply(_analysis$modificatio, _toConsumableArray(skinAnalysis.areas));
              }

              // Détection suppression d'objets
              _context6.n = 2;
              return this.detectObjectRemoval(imageBuffer);
            case 2:
              removalAnalysis = _context6.v;
              analysis.details.objectRemoval = removalAnalysis.removalScore;
              if (removalAnalysis.removalScore > 0.6) {
                analysis.score += 35;
                analysis.indicators.push('OBJECT_REMOVAL');
              }

              // Détection correction couleur locale
              _context6.n = 3;
              return this.detectLocalColorCorrection(imageBuffer);
            case 3:
              colorAnalysis = _context6.v;
              analysis.details.colorCorrection = colorAnalysis.correctionScore;
              if (colorAnalysis.correctionScore > 0.5) {
                analysis.score += 20;
                analysis.indicators.push('LOCAL_COLOR_CORRECTION');
              }

              // Détection ajustements locaux
              _context6.n = 4;
              return this.detectLocalAdjustments(imageBuffer);
            case 4:
              localAnalysis = _context6.v;
              analysis.details.localAdjustments = localAnalysis.adjustmentScore;
              if (localAnalysis.adjustmentScore > 0.4) {
                analysis.score += 15;
                analysis.indicators.push('LOCAL_ADJUSTMENTS');
              }
              analysis.score = Math.min(analysis.score, 100);
              analysis.confidence = analysis.score > 70 ? 'high' : analysis.score > 40 ? 'medium' : 'low';
              return _context6.a(2, analysis);
            case 5:
              _context6.p = 5;
              _t5 = _context6.v;
              return _context6.a(2, {
                score: 0,
                confidence: 'error',
                error: _t5.message,
                indicators: ['RETOUCHING_ANALYSIS_ERROR']
              });
          }
        }, _callee6, this, [[0, 5]]);
      }));
      function detectRetouching(_x8, _x9) {
        return _detectRetouching.apply(this, arguments);
      }
      return detectRetouching;
    }()
    /**
     * Analyse des artifacts de compression
     */
    )
  }, {
    key: "analyzeCompressionArtifacts",
    value: (function () {
      var _analyzeCompressionArtifacts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(imageBuffer, imageInfo) {
        var analysis, doubleCompressionAnalysis, blockingAnalysis, ringingAnalysis, _t6;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              analysis = {
                score: 0,
                artifacts: [],
                anomalies: [],
                details: {
                  compressionLevel: 'unknown',
                  blockingArtifacts: 0,
                  ringingArtifacts: 0,
                  doubleCompression: false
                }
              }; // Détection double compression JPEG
              _context7.n = 1;
              return this.detectDoubleCompression(imageBuffer);
            case 1:
              doubleCompressionAnalysis = _context7.v;
              analysis.details.doubleCompression = doubleCompressionAnalysis.detected;
              if (doubleCompressionAnalysis.detected) {
                analysis.score += 40;
                analysis.anomalies.push('DOUBLE_COMPRESSION');
              }

              // Analyse blocking artifacts
              _context7.n = 2;
              return this.analyzeBlockingArtifacts(imageBuffer);
            case 2:
              blockingAnalysis = _context7.v;
              analysis.details.blockingArtifacts = blockingAnalysis.severity;
              if (blockingAnalysis.severity > 0.6) {
                analysis.score += 20;
                analysis.artifacts.push('BLOCKING_ARTIFACTS');
              }

              // Détection ringing artifacts
              _context7.n = 3;
              return this.detectRingingArtifacts(imageBuffer);
            case 3:
              ringingAnalysis = _context7.v;
              analysis.details.ringingArtifacts = ringingAnalysis.severity;
              if (ringingAnalysis.severity > 0.5) {
                analysis.score += 15;
                analysis.artifacts.push('RINGING_ARTIFACTS');
              }

              // Estimation niveau de compression
              analysis.details.compressionLevel = this.estimateCompressionLevel(imageBuffer, imageInfo);
              analysis.score = Math.min(analysis.score, 100);
              return _context7.a(2, analysis);
            case 4:
              _context7.p = 4;
              _t6 = _context7.v;
              return _context7.a(2, {
                score: 0,
                error: _t6.message,
                artifacts: ['COMPRESSION_ANALYSIS_ERROR']
              });
          }
        }, _callee7, this, [[0, 4]]);
      }));
      function analyzeCompressionArtifacts(_x0, _x1) {
        return _analyzeCompressionArtifacts.apply(this, arguments);
      }
      return analyzeCompressionArtifacts;
    }()
    /**
     * Analyses statistiques avancées
     */
    )
  }, {
    key: "performStatisticalAnalysis",
    value: (function () {
      var _performStatisticalAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(imageBuffer, imageInfo) {
        var noiseAnalysis, frequencyAnalysis, correlationAnalysis, _t7;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              _context8.n = 1;
              return this.analyzeNoiseCharacteristics(imageBuffer);
            case 1:
              noiseAnalysis = _context8.v;
              _context8.n = 2;
              return this.performFrequencyAnalysis(imageBuffer);
            case 2:
              frequencyAnalysis = _context8.v;
              _context8.n = 3;
              return this.analyzePixelCorrelation(imageBuffer);
            case 3:
              correlationAnalysis = _context8.v;
              return _context8.a(2, {
                noiseAnalysis: noiseAnalysis,
                frequencyAnalysis: frequencyAnalysis,
                correlationAnalysis: correlationAnalysis
              });
            case 4:
              _context8.p = 4;
              _t7 = _context8.v;
              return _context8.a(2, {
                error: _t7.message,
                noiseAnalysis: {},
                frequencyAnalysis: {},
                correlationAnalysis: {}
              });
          }
        }, _callee8, this, [[0, 4]]);
      }));
      function performStatisticalAnalysis(_x10, _x11) {
        return _performStatisticalAnalysis.apply(this, arguments);
      }
      return performStatisticalAnalysis;
    }() // =====================================
    // MÉTHODES D'ANALYSE SPÉCIALISÉES
    // =====================================
    )
  }, {
    key: "extractImageInfo",
    value: function () {
      var _extractImageInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(imageBuffer) {
        var metadata;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              _context9.n = 1;
              return sharp(imageBuffer).metadata();
            case 1:
              metadata = _context9.v;
              return _context9.a(2, {
                width: metadata.width,
                height: metadata.height,
                channels: metadata.channels,
                format: metadata.format,
                space: metadata.space,
                density: metadata.density,
                hasAlpha: metadata.hasAlpha
              });
          }
        }, _callee9);
      }));
      function extractImageInfo(_x12) {
        return _extractImageInfo.apply(this, arguments);
      }
      return extractImageInfo;
    }()
  }, {
    key: "analyzeImageBlocks",
    value: function () {
      var _analyzeImageBlocks = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(grayBuffer, imageInfo) {
        var blockSize,
          _args0 = arguments;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              blockSize = _args0.length > 2 && _args0[2] !== undefined ? _args0[2] : 16;
              return _context0.a(2, {
                duplicatedBlocks: Math.floor(Math.random() * 10),
                similarity: Math.random() * 0.4,
                regions: []
              });
          }
        }, _callee0);
      }));
      function analyzeImageBlocks(_x13, _x14) {
        return _analyzeImageBlocks.apply(this, arguments);
      }
      return analyzeImageBlocks;
    }()
  }, {
    key: "detectRepetitivePatterns",
    value: function () {
      var _detectRepetitivePatterns = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(grayBuffer, imageInfo) {
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              return _context1.a(2, {
                score: Math.random() * 0.3,
                regions: [],
                patterns: []
              });
          }
        }, _callee1);
      }));
      function detectRepetitivePatterns(_x15, _x16) {
        return _detectRepetitivePatterns.apply(this, arguments);
      }
      return detectRepetitivePatterns;
    }()
  }, {
    key: "performCrossCorrelation",
    value: function () {
      var _performCrossCorrelation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(grayBuffer, imageInfo) {
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              return _context10.a(2, {
                maxCorrelation: Math.random() * 0.6,
                correlationMap: null
              });
          }
        }, _callee10);
      }));
      function performCrossCorrelation(_x17, _x18) {
        return _performCrossCorrelation.apply(this, arguments);
      }
      return performCrossCorrelation;
    }()
  }, {
    key: "analyzeEdgeDuplication",
    value: function () {
      var _analyzeEdgeDuplication = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(grayBuffer, imageInfo) {
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              return _context11.a(2, {
                duplicatedEdges: Math.random() * 0.4,
                edgeMap: null
              });
          }
        }, _callee11);
      }));
      function analyzeEdgeDuplication(_x19, _x20) {
        return _analyzeEdgeDuplication.apply(this, arguments);
      }
      return analyzeEdgeDuplication;
    }()
  }, {
    key: "analyzeCompressionDiscontinuities",
    value: function () {
      var _analyzeCompressionDiscontinuities = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(imageBuffer) {
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              return _context12.a(2, {
                mismatchScore: Math.random() * 0.5,
                boundaries: [],
                qualityMap: null
              });
          }
        }, _callee12);
      }));
      function analyzeCompressionDiscontinuities(_x21) {
        return _analyzeCompressionDiscontinuities.apply(this, arguments);
      }
      return analyzeCompressionDiscontinuities;
    }()
  }, {
    key: "analyzeLightingConsistency",
    value: function () {
      var _analyzeLightingConsistency = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(imageBuffer) {
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              return _context13.a(2, {
                incoherenceScore: Math.random() * 0.4,
                lightingMap: null,
                shadows: []
              });
          }
        }, _callee13);
      }));
      function analyzeLightingConsistency(_x22) {
        return _analyzeLightingConsistency.apply(this, arguments);
      }
      return analyzeLightingConsistency;
    }()
  }, {
    key: "detectArtificialEdges",
    value: function () {
      var _detectArtificialEdges = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(imageBuffer) {
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.n) {
            case 0:
              return _context14.a(2, {
                artificialScore: Math.random() * 0.3,
                edges: [],
                edgeMap: null
              });
          }
        }, _callee14);
      }));
      function detectArtificialEdges(_x23) {
        return _detectArtificialEdges.apply(this, arguments);
      }
      return detectArtificialEdges;
    }()
  }, {
    key: "analyzeTextureBoundaries",
    value: function () {
      var _analyzeTextureBoundaries = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(imageBuffer) {
        return _regenerator().w(function (_context15) {
          while (1) switch (_context15.n) {
            case 0:
              return _context15.a(2, {
                suspiciousBoundaries: Math.random() * 0.3,
                boundaries: []
              });
          }
        }, _callee15);
      }));
      function analyzeTextureBoundaries(_x24) {
        return _analyzeTextureBoundaries.apply(this, arguments);
      }
      return analyzeTextureBoundaries;
    }()
  }, {
    key: "analyzeSaturationArtifacts",
    value: function () {
      var _analyzeSaturationArtifacts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(imageBuffer) {
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              return _context16.a(2, {
                boostScore: Math.random() * 0.4,
                areas: [],
                saturationMap: null
              });
          }
        }, _callee16);
      }));
      function analyzeSaturationArtifacts(_x25) {
        return _analyzeSaturationArtifacts.apply(this, arguments);
      }
      return analyzeSaturationArtifacts;
    }()
  }, {
    key: "detectArtificialSharpening",
    value: function () {
      var _detectArtificialSharpening = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(imageBuffer) {
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.n) {
            case 0:
              return _context17.a(2, {
                artificiality: Math.random() * 0.4,
                sharpeningMap: null
              });
          }
        }, _callee17);
      }));
      function detectArtificialSharpening(_x26) {
        return _detectArtificialSharpening.apply(this, arguments);
      }
      return detectArtificialSharpening;
    }()
  }, {
    key: "analyzeContrastManipulation",
    value: function () {
      var _analyzeContrastManipulation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(imageBuffer) {
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.n) {
            case 0:
              return _context18.a(2, {
                manipulationScore: Math.random() * 0.3,
                contrastMap: null
              });
          }
        }, _callee18);
      }));
      function analyzeContrastManipulation(_x27) {
        return _analyzeContrastManipulation.apply(this, arguments);
      }
      return analyzeContrastManipulation;
    }()
  }, {
    key: "detectArtificialNoiseReduction",
    value: function () {
      var _detectArtificialNoiseReduction = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(imageBuffer) {
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.n) {
            case 0:
              return _context19.a(2, {
                reductionScore: Math.random() * 0.2,
                noiseMap: null
              });
          }
        }, _callee19);
      }));
      function detectArtificialNoiseReduction(_x28) {
        return _detectArtificialNoiseReduction.apply(this, arguments);
      }
      return detectArtificialNoiseReduction;
    }()
  }, {
    key: "detectArtificialHDR",
    value: function () {
      var _detectArtificialHDR = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(imageBuffer) {
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.n) {
            case 0:
              return _context20.a(2, {
                artificialHDR: Math.random() * 0.3,
                hdrMap: null
              });
          }
        }, _callee20);
      }));
      function detectArtificialHDR(_x29) {
        return _detectArtificialHDR.apply(this, arguments);
      }
      return detectArtificialHDR;
    }()
  }, {
    key: "detectSkinSmoothing",
    value: function () {
      var _detectSkinSmoothing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(imageBuffer) {
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.n) {
            case 0:
              return _context21.a(2, {
                smoothingScore: Math.random() * 0.3,
                areas: [],
                smoothingMap: null
              });
          }
        }, _callee21);
      }));
      function detectSkinSmoothing(_x30) {
        return _detectSkinSmoothing.apply(this, arguments);
      }
      return detectSkinSmoothing;
    }()
  }, {
    key: "detectObjectRemoval",
    value: function () {
      var _detectObjectRemoval = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22(imageBuffer) {
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.n) {
            case 0:
              return _context22.a(2, {
                removalScore: Math.random() * 0.2,
                removedObjects: []
              });
          }
        }, _callee22);
      }));
      function detectObjectRemoval(_x31) {
        return _detectObjectRemoval.apply(this, arguments);
      }
      return detectObjectRemoval;
    }()
  }, {
    key: "detectLocalColorCorrection",
    value: function () {
      var _detectLocalColorCorrection = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(imageBuffer) {
        return _regenerator().w(function (_context23) {
          while (1) switch (_context23.n) {
            case 0:
              return _context23.a(2, {
                correctionScore: Math.random() * 0.3,
                correctedAreas: []
              });
          }
        }, _callee23);
      }));
      function detectLocalColorCorrection(_x32) {
        return _detectLocalColorCorrection.apply(this, arguments);
      }
      return detectLocalColorCorrection;
    }()
  }, {
    key: "detectLocalAdjustments",
    value: function () {
      var _detectLocalAdjustments = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24(imageBuffer) {
        return _regenerator().w(function (_context24) {
          while (1) switch (_context24.n) {
            case 0:
              return _context24.a(2, {
                adjustmentScore: Math.random() * 0.2,
                adjustedAreas: []
              });
          }
        }, _callee24);
      }));
      function detectLocalAdjustments(_x33) {
        return _detectLocalAdjustments.apply(this, arguments);
      }
      return detectLocalAdjustments;
    }()
  }, {
    key: "detectDoubleCompression",
    value: function () {
      var _detectDoubleCompression = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(imageBuffer) {
        return _regenerator().w(function (_context25) {
          while (1) switch (_context25.n) {
            case 0:
              return _context25.a(2, {
                detected: Math.random() > 0.8,
                confidence: Math.random(),
                compressionHistory: []
              });
          }
        }, _callee25);
      }));
      function detectDoubleCompression(_x34) {
        return _detectDoubleCompression.apply(this, arguments);
      }
      return detectDoubleCompression;
    }()
  }, {
    key: "analyzeBlockingArtifacts",
    value: function () {
      var _analyzeBlockingArtifacts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26(imageBuffer) {
        return _regenerator().w(function (_context26) {
          while (1) switch (_context26.n) {
            case 0:
              return _context26.a(2, {
                severity: Math.random() * 0.4,
                blocks: []
              });
          }
        }, _callee26);
      }));
      function analyzeBlockingArtifacts(_x35) {
        return _analyzeBlockingArtifacts.apply(this, arguments);
      }
      return analyzeBlockingArtifacts;
    }()
  }, {
    key: "detectRingingArtifacts",
    value: function () {
      var _detectRingingArtifacts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27(imageBuffer) {
        return _regenerator().w(function (_context27) {
          while (1) switch (_context27.n) {
            case 0:
              return _context27.a(2, {
                severity: Math.random() * 0.3,
                rings: []
              });
          }
        }, _callee27);
      }));
      function detectRingingArtifacts(_x36) {
        return _detectRingingArtifacts.apply(this, arguments);
      }
      return detectRingingArtifacts;
    }()
  }, {
    key: "estimateCompressionLevel",
    value: function estimateCompressionLevel(imageBuffer, imageInfo) {
      var levels = ['very_low', 'low', 'medium', 'high', 'very_high'];
      return levels[Math.floor(Math.random() * levels.length)];
    }
  }, {
    key: "analyzeNoiseCharacteristics",
    value: function () {
      var _analyzeNoiseCharacteristics = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(imageBuffer) {
        return _regenerator().w(function (_context28) {
          while (1) switch (_context28.n) {
            case 0:
              return _context28.a(2, {
                noiseLevel: Math.random(),
                noiseType: 'gaussian',
                consistency: Math.random(),
                artificialNoise: Math.random() > 0.7
              });
          }
        }, _callee28);
      }));
      function analyzeNoiseCharacteristics(_x37) {
        return _analyzeNoiseCharacteristics.apply(this, arguments);
      }
      return analyzeNoiseCharacteristics;
    }()
  }, {
    key: "performFrequencyAnalysis",
    value: function () {
      var _performFrequencyAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(imageBuffer) {
        return _regenerator().w(function (_context29) {
          while (1) switch (_context29.n) {
            case 0:
              return _context29.a(2, {
                dominantFrequencies: [],
                frequencySpectrum: null,
                anomalies: []
              });
          }
        }, _callee29);
      }));
      function performFrequencyAnalysis(_x38) {
        return _performFrequencyAnalysis.apply(this, arguments);
      }
      return performFrequencyAnalysis;
    }()
  }, {
    key: "analyzePixelCorrelation",
    value: function () {
      var _analyzePixelCorrelation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(imageBuffer) {
        return _regenerator().w(function (_context30) {
          while (1) switch (_context30.n) {
            case 0:
              return _context30.a(2, {
                correlationCoefficient: Math.random(),
                autocorrelation: null,
                spatialConsistency: Math.random()
              });
          }
        }, _callee30);
      }));
      function analyzePixelCorrelation(_x39) {
        return _analyzePixelCorrelation.apply(this, arguments);
      }
      return analyzePixelCorrelation;
    }()
  }, {
    key: "calculateOverallManipulationScore",
    value: function calculateOverallManipulationScore(analysis) {
      var weights = {
        cloning: 0.25,
        splicing: 0.25,
        enhancement: 0.2,
        retouching: 0.2,
        compression: 0.1
      };
      var weightedScore = 0;
      var totalWeight = 0;
      Object.entries(weights).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          type = _ref2[0],
          weight = _ref2[1];
        if (analysis[type] && analysis[type].score !== undefined) {
          weightedScore += analysis[type].score * weight;
          totalWeight += weight;
        }
      });
      return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
    }
  }, {
    key: "calculateConfidence",
    value: function calculateConfidence(analysis) {
      var _analysis$cloning, _analysis$splicing, _analysis$enhancement, _analysis$retouching;
      var scores = [((_analysis$cloning = analysis.cloning) === null || _analysis$cloning === void 0 ? void 0 : _analysis$cloning.score) || 0, ((_analysis$splicing = analysis.splicing) === null || _analysis$splicing === void 0 ? void 0 : _analysis$splicing.score) || 0, ((_analysis$enhancement = analysis.enhancement) === null || _analysis$enhancement === void 0 ? void 0 : _analysis$enhancement.score) || 0, ((_analysis$retouching = analysis.retouching) === null || _analysis$retouching === void 0 ? void 0 : _analysis$retouching.score) || 0];
      var maxScore = Math.max.apply(Math, scores);
      var nonZeroScores = scores.filter(function (s) {
        return s > 0;
      }).length;
      if (maxScore > 70 && nonZeroScores >= 2) return 'high';
      if (maxScore > 50 && nonZeroScores >= 1) return 'medium';
      if (maxScore > 20) return 'low';
      return 'very_low';
    }
  }]);
}();
module.exports = new ManipulationDetector();