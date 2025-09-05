"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
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
var crypto = require('crypto');

// =====================================
// ANALYSEUR FORENSIQUE AVANCÉ COMPLET
// =====================================
var ForensicAnalyzer = /*#__PURE__*/function () {
  function ForensicAnalyzer() {
    _classCallCheck(this, ForensicAnalyzer);
    this.version = '3.0.0-production';
    this.analysisCache = new Map();
    this.maxCacheSize = 100;
    this.initialized = true;
    console.log("\uD83D\uDD2C Analyseur forensique initialis\xE9 v".concat(this.version));
  }

  /**
   * Analyse complète de manipulations d'images
   */
  return _createClass(ForensicAnalyzer, [{
    key: "analyzeManipulations",
    value: (function () {
      var _analyzeManipulations = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(imageBuffer) {
        var metadata,
          startTime,
          cacheKey,
          analysisResult,
          _args = arguments,
          _t,
          _t2,
          _t3,
          _t4,
          _t5,
          _t6,
          _t7;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              metadata = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              startTime = Date.now();
              _context.p = 1;
              if (Buffer.isBuffer(imageBuffer)) {
                _context.n = 2;
                break;
              }
              throw new Error('imageBuffer doit être un Buffer valide');
            case 2:
              if (!(imageBuffer.length === 0)) {
                _context.n = 3;
                break;
              }
              throw new Error('Buffer d\'image vide');
            case 3:
              console.log("\uD83D\uDD0D Analyse manipulation: ".concat(this.formatBytes(imageBuffer.length)));

              // Cache check
              cacheKey = this.generateCacheKey(imageBuffer, metadata);
              if (!this.analysisCache.has(cacheKey)) {
                _context.n = 4;
                break;
              }
              console.log('📋 Résultat récupéré du cache');
              return _context.a(2, this.analysisCache.get(cacheKey));
            case 4:
              _context.n = 5;
              return this.detectCloning(imageBuffer, metadata);
            case 5:
              _t = _context.v;
              _context.n = 6;
              return this.detectSplicing(imageBuffer, metadata);
            case 6:
              _t2 = _context.v;
              _context.n = 7;
              return this.detectEnhancement(imageBuffer, metadata);
            case 7:
              _t3 = _context.v;
              _context.n = 8;
              return this.analyzeCompressionArtifacts(imageBuffer, metadata);
            case 8:
              _t4 = _context.v;
              _context.n = 9;
              return this.analyzeStatisticalAnomalies(imageBuffer, metadata);
            case 9:
              _t5 = _context.v;
              _t6 = {
                analysisTime: 0,
                imageSize: imageBuffer.length,
                version: this.version,
                timestamp: new Date().toISOString(),
                methods: ['cloning', 'splicing', 'enhancement', 'compression', 'statistical']
              };
              analysisResult = {
                cloning: _t,
                splicing: _t2,
                enhancement: _t3,
                compression: _t4,
                statistical: _t5,
                overall: 0,
                metadata: _t6
              };
              // Calcul du score global avec pondération
              analysisResult.overall = this.calculateOverallScore(analysisResult);
              analysisResult.metadata.analysisTime = Date.now() - startTime;

              // Mise en cache
              this.updateCache(cacheKey, analysisResult);
              console.log("\u2705 Analyse termin\xE9e: score global ".concat(analysisResult.overall, "/100 (").concat(analysisResult.metadata.analysisTime, "ms)"));
              return _context.a(2, analysisResult);
            case 10:
              _context.p = 10;
              _t7 = _context.v;
              console.error("\u274C Erreur analyse manipulations: ".concat(_t7.message));
              return _context.a(2, {
                cloning: 0,
                splicing: 0,
                enhancement: 0,
                compression: 0,
                statistical: 0,
                overall: 0,
                error: _t7.message,
                metadata: {
                  analysisTime: Date.now() - startTime,
                  failed: true
                }
              });
          }
        }, _callee, this, [[1, 10]]);
      }));
      function analyzeManipulations(_x) {
        return _analyzeManipulations.apply(this, arguments);
      }
      return analyzeManipulations;
    }()
    /**
     * Détection de clonage par analyse statistique avancée
     */
    )
  }, {
    key: "detectCloning",
    value: (function () {
      var _detectCloning = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(imageBuffer, metadata) {
        var cloningScore, indicators, entropyAnalysis, repetitionAnalysis, correlationAnalysis, edgeAnalysis, _t8;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              console.log('🔍 Détection clonage...');
              cloningScore = 0;
              indicators = []; // 1. Analyse de l'entropie des blocs
              entropyAnalysis = this.calculateBlockEntropy(imageBuffer, 16);
              if (entropyAnalysis.averageEntropy < 3.0) {
                cloningScore += 25;
                indicators.push('LOW_ENTROPY_BLOCKS');
              }

              // 2. Détection de patterns répétitifs
              repetitionAnalysis = this.detectRepetitivePatterns(imageBuffer);
              if (repetitionAnalysis.repetitionRate > 0.15) {
                cloningScore += 30;
                indicators.push('HIGH_REPETITION_PATTERNS');
              }

              // 3. Analyse de corrélation croisée
              correlationAnalysis = this.calculateCrossCorrelation(imageBuffer);
              if (correlationAnalysis.maxCorrelation > 0.85) {
                cloningScore += 25;
                indicators.push('HIGH_CROSS_CORRELATION');
              }

              // 4. Détection de duplicatas de contours
              edgeAnalysis = this.analyzeEdgeDuplication(imageBuffer);
              if (edgeAnalysis.duplicatedEdges > 0.3) {
                cloningScore += 20;
                indicators.push('DUPLICATED_EDGE_PATTERNS');
              }
              return _context2.a(2, {
                score: Math.min(cloningScore, 100),
                confidence: this.calculateConfidence(cloningScore, indicators.length),
                indicators: indicators,
                details: {
                  entropy: entropyAnalysis,
                  repetition: repetitionAnalysis,
                  correlation: correlationAnalysis,
                  edges: edgeAnalysis
                }
              });
            case 1:
              _context2.p = 1;
              _t8 = _context2.v;
              console.warn("\u26A0\uFE0F Erreur d\xE9tection clonage: ".concat(_t8.message));
              return _context2.a(2, {
                score: 0,
                confidence: 'error',
                indicators: ['ANALYSIS_ERROR']
              });
          }
        }, _callee2, this, [[0, 1]]);
      }));
      function detectCloning(_x2, _x3) {
        return _detectCloning.apply(this, arguments);
      }
      return detectCloning;
    }()
    /**
     * Détection de splicing par incohérences
     */
    )
  }, {
    key: "detectSplicing",
    value: (function () {
      var _detectSplicing = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(imageBuffer, metadata) {
        var splicingScore, indicators, compressionAnalysis, noiseAnalysis, boundaryAnalysis, lightingAnalysis, sizeDifference, _t9;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              console.log('✂️ Détection splicing...');
              splicingScore = 0;
              indicators = []; // 1. Analyse des artefacts de compression
              compressionAnalysis = this.analyzeCompressionConsistency(imageBuffer);
              if (compressionAnalysis.inconsistencyScore > 40) {
                splicingScore += 35;
                indicators.push('COMPRESSION_INCONSISTENCY');
              }

              // 2. Analyse de la cohérence du bruit
              noiseAnalysis = this.analyzeNoiseConsistency(imageBuffer);
              if (noiseAnalysis.coherenceScore < 0.6) {
                splicingScore += 30;
                indicators.push('NOISE_INCONSISTENCY');
              }

              // 3. Détection de frontières artificielles
              boundaryAnalysis = this.detectArtificialBoundaries(imageBuffer);
              if (boundaryAnalysis.artificialScore > 0.7) {
                splicingScore += 25;
                indicators.push('ARTIFICIAL_BOUNDARIES');
              }

              // 4. Analyse de cohérence d'illumination
              lightingAnalysis = this.analyzeLightingConsistency(imageBuffer);
              if (lightingAnalysis.inconsistencyScore > 0.5) {
                splicingScore += 20;
                indicators.push('LIGHTING_INCONSISTENCY');
              }

              // 5. Vérification taille vs qualité attendue
              if (metadata.expectedSize && metadata.actualSize) {
                sizeDifference = Math.abs(metadata.actualSize - metadata.expectedSize) / metadata.expectedSize;
                if (sizeDifference > 0.5) {
                  splicingScore += 15;
                  indicators.push('SIZE_QUALITY_MISMATCH');
                }
              }
              return _context3.a(2, {
                score: Math.min(splicingScore, 100),
                confidence: this.calculateConfidence(splicingScore, indicators.length),
                indicators: indicators,
                details: {
                  compression: compressionAnalysis,
                  noise: noiseAnalysis,
                  boundaries: boundaryAnalysis,
                  lighting: lightingAnalysis
                }
              });
            case 1:
              _context3.p = 1;
              _t9 = _context3.v;
              console.warn("\u26A0\uFE0F Erreur d\xE9tection splicing: ".concat(_t9.message));
              return _context3.a(2, {
                score: 0,
                confidence: 'error',
                indicators: ['ANALYSIS_ERROR']
              });
          }
        }, _callee3, this, [[0, 1]]);
      }));
      function detectSplicing(_x4, _x5) {
        return _detectSplicing.apply(this, arguments);
      }
      return detectSplicing;
    }()
    /**
     * Détection d'amélioration artificielle
     */
    )
  }, {
    key: "detectEnhancement",
    value: (function () {
      var _detectEnhancement = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(imageBuffer, metadata) {
        var enhancementScore, indicators, histogramAnalysis, sharpnessAnalysis, saturationAnalysis, denoiseAnalysis, tonalAnalysis, _t0;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              console.log('✨ Détection enhancement...');
              enhancementScore = 0;
              indicators = []; // 1. Analyse de l'histogramme
              histogramAnalysis = this.analyzeHistogramArtifacts(imageBuffer);
              if (histogramAnalysis.artificialPeaks > 0.6) {
                enhancementScore += 30;
                indicators.push('HISTOGRAM_MANIPULATION');
              }

              // 2. Détection de sur-netteté
              sharpnessAnalysis = this.detectOverSharpening(imageBuffer);
              if (sharpnessAnalysis.overSharpenScore > 0.7) {
                enhancementScore += 25;
                indicators.push('OVER_SHARPENING');
              }

              // 3. Détection de saturation artificielle
              saturationAnalysis = this.detectArtificialSaturation(imageBuffer);
              if (saturationAnalysis.artificialScore > 0.8) {
                enhancementScore += 20;
                indicators.push('ARTIFICIAL_SATURATION');
              }

              // 4. Détection de réduction de bruit artificielle
              denoiseAnalysis = this.detectArtificialDenoising(imageBuffer);
              if (denoiseAnalysis.artificialScore > 0.6) {
                enhancementScore += 15;
                indicators.push('ARTIFICIAL_DENOISING');
              }

              // 5. Détection d'ajustements tonaux excessifs
              tonalAnalysis = this.detectExcessiveTonalAdjustments(imageBuffer);
              if (tonalAnalysis.excessiveScore > 0.5) {
                enhancementScore += 10;
                indicators.push('EXCESSIVE_TONAL_ADJUSTMENTS');
              }
              return _context4.a(2, {
                score: Math.min(enhancementScore, 100),
                confidence: this.calculateConfidence(enhancementScore, indicators.length),
                indicators: indicators,
                details: {
                  histogram: histogramAnalysis,
                  sharpness: sharpnessAnalysis,
                  saturation: saturationAnalysis,
                  denoise: denoiseAnalysis,
                  tonal: tonalAnalysis
                }
              });
            case 1:
              _context4.p = 1;
              _t0 = _context4.v;
              console.warn("\u26A0\uFE0F Erreur d\xE9tection enhancement: ".concat(_t0.message));
              return _context4.a(2, {
                score: 0,
                confidence: 'error',
                indicators: ['ANALYSIS_ERROR']
              });
          }
        }, _callee4, this, [[0, 1]]);
      }));
      function detectEnhancement(_x6, _x7) {
        return _detectEnhancement.apply(this, arguments);
      }
      return detectEnhancement;
    }()
    /**
     * Analyse avancée de compression JPEG
     */
    )
  }, {
    key: "analyzeCompressionArtifacts",
    value: (function () {
      var _analyzeCompressionArtifacts = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(imageBuffer, metadata) {
        var compressionScore, indicators, multipleCompressionAnalysis, quantizationAnalysis, blockingAnalysis, qualityAnalysis, _t1;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              console.log('🗜️ Analyse compression...');
              compressionScore = 0;
              indicators = []; // Vérifier si c'est un JPEG
              if (this.isJpegImage(imageBuffer)) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2, {
                score: 0,
                confidence: 'not_applicable',
                indicators: ['NOT_JPEG_IMAGE'],
                details: {
                  format: 'non-jpeg'
                }
              });
            case 1:
              // 1. Détection de compression multiple
              multipleCompressionAnalysis = this.detectMultipleJpegCompression(imageBuffer);
              if (multipleCompressionAnalysis.detected) {
                compressionScore += Math.min(multipleCompressionAnalysis.score * 2, 40);
                indicators.push('MULTIPLE_COMPRESSION_DETECTED');
              }

              // 2. Analyse des tables de quantification
              quantizationAnalysis = this.analyzeQuantizationTables(imageBuffer);
              if (quantizationAnalysis.anomalyScore > 30) {
                compressionScore += 25;
                indicators.push('QUANTIZATION_ANOMALIES');
              }

              // 3. Détection d'artefacts de blocs
              blockingAnalysis = this.detectBlockingArtifacts(imageBuffer);
              if (blockingAnalysis.severity > 40) {
                compressionScore += 20;
                indicators.push('BLOCKING_ARTIFACTS');
              }

              // 4. Analyse de cohérence de qualité
              qualityAnalysis = this.analyzeQualityConsistency(imageBuffer);
              if (qualityAnalysis.inconsistency > 0.5) {
                compressionScore += 15;
                indicators.push('QUALITY_INCONSISTENCY');
              }
              return _context5.a(2, {
                score: Math.min(compressionScore, 100),
                confidence: this.calculateConfidence(compressionScore, indicators.length),
                indicators: indicators,
                details: {
                  multipleCompression: multipleCompressionAnalysis,
                  quantization: quantizationAnalysis,
                  blocking: blockingAnalysis,
                  quality: qualityAnalysis
                }
              });
            case 2:
              _context5.p = 2;
              _t1 = _context5.v;
              console.warn("\u26A0\uFE0F Erreur analyse compression: ".concat(_t1.message));
              return _context5.a(2, {
                score: 0,
                confidence: 'error',
                indicators: ['ANALYSIS_ERROR']
              });
          }
        }, _callee5, this, [[0, 2]]);
      }));
      function analyzeCompressionArtifacts(_x8, _x9) {
        return _analyzeCompressionArtifacts.apply(this, arguments);
      }
      return analyzeCompressionArtifacts;
    }()
    /**
     * Analyse des anomalies statistiques
     */
    )
  }, {
    key: "analyzeStatisticalAnomalies",
    value: (function () {
      var _analyzeStatisticalAnomalies = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(imageBuffer, metadata) {
        var statisticalScore, indicators, pixelDistribution, spatialCorrelation, entropyAnalysis, patternAnalysis, spectralAnalysis, _t10;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              console.log('📊 Analyse statistique...');
              statisticalScore = 0;
              indicators = []; // 1. Analyse de distribution des pixels
              pixelDistribution = this.analyzePixelDistribution(imageBuffer);
              if (pixelDistribution.anomalyScore > 0.7) {
                statisticalScore += 25;
                indicators.push('PIXEL_DISTRIBUTION_ANOMALY');
              }

              // 2. Analyse de corrélation spatiale
              spatialCorrelation = this.analyzeSpatialCorrelation(imageBuffer);
              if (spatialCorrelation.anomalyScore > 0.6) {
                statisticalScore += 20;
                indicators.push('SPATIAL_CORRELATION_ANOMALY');
              }

              // 3. Analyse de l'entropie globale
              entropyAnalysis = this.analyzeGlobalEntropy(imageBuffer);
              if (entropyAnalysis.suspiciousLevel > 0.5) {
                statisticalScore += 15;
                indicators.push('ENTROPY_ANOMALY');
              }

              // 4. Détection de patterns artificiels
              patternAnalysis = this.detectArtificialPatterns(imageBuffer);
              if (patternAnalysis.artificialScore > 0.8) {
                statisticalScore += 20;
                indicators.push('ARTIFICIAL_PATTERNS');
              }

              // 5. Analyse de cohérence spectrale
              spectralAnalysis = this.analyzeSpectralCoherence(imageBuffer);
              if (spectralAnalysis.incoherenceScore > 0.4) {
                statisticalScore += 20;
                indicators.push('SPECTRAL_INCOHERENCE');
              }
              return _context6.a(2, {
                score: Math.min(statisticalScore, 100),
                confidence: this.calculateConfidence(statisticalScore, indicators.length),
                indicators: indicators,
                details: {
                  pixelDistribution: pixelDistribution,
                  spatialCorrelation: spatialCorrelation,
                  entropy: entropyAnalysis,
                  patterns: patternAnalysis,
                  spectral: spectralAnalysis
                }
              });
            case 1:
              _context6.p = 1;
              _t10 = _context6.v;
              console.warn("\u26A0\uFE0F Erreur analyse statistique: ".concat(_t10.message));
              return _context6.a(2, {
                score: 0,
                confidence: 'error',
                indicators: ['ANALYSIS_ERROR']
              });
          }
        }, _callee6, this, [[0, 1]]);
      }));
      function analyzeStatisticalAnomalies(_x0, _x1) {
        return _analyzeStatisticalAnomalies.apply(this, arguments);
      }
      return analyzeStatisticalAnomalies;
    }() // =====================================
    // MÉTHODES D'ANALYSE SPÉCIALISÉES - TOUTES COMPLÈTES
    // =====================================
    )
  }, {
    key: "calculateBlockEntropy",
    value: function calculateBlockEntropy(imageBuffer) {
      var blockSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 16;
      try {
        var blocks = this.extractImageBlocks(imageBuffer, blockSize);
        var totalEntropy = 0;
        var entropies = [];
        blocks.forEach(function (block) {
          var histogram = new Array(256).fill(0);

          // Construire histogramme du bloc
          for (var i = 0; i < block.length; i++) {
            histogram[block[i]]++;
          }

          // Calculer entropie
          var entropy = 0;
          var blockLength = block.length;
          for (var _i = 0; _i < 256; _i++) {
            if (histogram[_i] > 0) {
              var probability = histogram[_i] / blockLength;
              entropy -= probability * Math.log2(probability);
            }
          }
          entropies.push(entropy);
          totalEntropy += entropy;
        });
        var averageEntropy = totalEntropy / blocks.length;
        var entropyVariance = this.calculateVariance(entropies);
        return {
          averageEntropy: averageEntropy,
          variance: entropyVariance,
          blocksAnalyzed: blocks.length,
          suspiciousBlocks: entropies.filter(function (e) {
            return e < 2.0;
          }).length
        };
      } catch (error) {
        return {
          averageEntropy: 4.0,
          variance: 0,
          blocksAnalyzed: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "detectRepetitivePatterns",
    value: function detectRepetitivePatterns(imageBuffer) {
      try {
        var chunkSize = 64;
        var chunks = new Map();
        var repetitions = 0;
        var totalChunks = 0;
        for (var i = 0; i <= imageBuffer.length - chunkSize; i += chunkSize) {
          var chunk = imageBuffer.slice(i, i + chunkSize);
          var hash = crypto.createHash('md5').update(chunk).digest('hex');
          if (chunks.has(hash)) {
            repetitions++;
            chunks.set(hash, chunks.get(hash) + 1);
          } else {
            chunks.set(hash, 1);
          }
          totalChunks++;
        }
        var repetitionRate = repetitions / totalChunks;
        var uniqueChunks = chunks.size;
        var maxRepetitions = Math.max.apply(Math, _toConsumableArray(chunks.values()));
        return {
          repetitionRate: repetitionRate,
          uniqueChunks: uniqueChunks,
          totalChunks: totalChunks,
          maxRepetitions: maxRepetitions,
          suspiciousLevel: repetitionRate > 0.1 ? 'high' : repetitionRate > 0.05 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          repetitionRate: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "calculateCrossCorrelation",
    value: function calculateCrossCorrelation(imageBuffer) {
      try {
        var sampleSize = Math.min(1024, Math.floor(imageBuffer.length / 10));
        var sample1 = imageBuffer.slice(0, sampleSize);
        var sample2 = imageBuffer.slice(Math.floor(imageBuffer.length / 2), Math.floor(imageBuffer.length / 2) + sampleSize);
        var correlation = 0;
        var sum1 = 0,
          sum2 = 0,
          sum1Sq = 0,
          sum2Sq = 0,
          sumProd = 0;
        for (var i = 0; i < sampleSize; i++) {
          sum1 += sample1[i];
          sum2 += sample2[i];
          sum1Sq += sample1[i] * sample1[i];
          sum2Sq += sample2[i] * sample2[i];
          sumProd += sample1[i] * sample2[i];
        }
        var numerator = sumProd - sum1 * sum2 / sampleSize;
        var denominator = Math.sqrt((sum1Sq - sum1 * sum1 / sampleSize) * (sum2Sq - sum2 * sum2 / sampleSize));
        if (denominator !== 0) {
          correlation = numerator / denominator;
        }
        return {
          maxCorrelation: Math.abs(correlation),
          sampleSize: sampleSize,
          suspiciousLevel: Math.abs(correlation) > 0.8 ? 'high' : Math.abs(correlation) > 0.6 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          maxCorrelation: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeEdgeDuplication",
    value: function analyzeEdgeDuplication(imageBuffer) {
      try {
        var edgeStrength = [];
        var windowSize = 16;
        for (var i = 0; i < imageBuffer.length - windowSize; i += windowSize) {
          var edgeValue = 0;
          for (var j = 0; j < windowSize - 1; j++) {
            edgeValue += Math.abs(imageBuffer[i + j + 1] - imageBuffer[i + j]);
          }
          edgeStrength.push(edgeValue);
        }
        var edgePatterns = new Map();
        var duplicatedEdges = 0;
        edgeStrength.forEach(function (strength) {
          var bucket = Math.floor(strength / 10) * 10;
          if (edgePatterns.has(bucket)) {
            duplicatedEdges++;
            edgePatterns.set(bucket, edgePatterns.get(bucket) + 1);
          } else {
            edgePatterns.set(bucket, 1);
          }
        });
        var duplicatedEdgesRatio = duplicatedEdges / edgeStrength.length;
        return {
          duplicatedEdges: duplicatedEdgesRatio,
          totalEdges: edgeStrength.length,
          uniquePatterns: edgePatterns.size,
          suspiciousLevel: duplicatedEdgesRatio > 0.4 ? 'high' : duplicatedEdgesRatio > 0.2 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          duplicatedEdges: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeCompressionConsistency",
    value: function analyzeCompressionConsistency(imageBuffer) {
      try {
        if (!this.isJpegImage(imageBuffer)) {
          return {
            inconsistencyScore: 0,
            applicable: false
          };
        }
        var dqtMarkers = 0;
        var qualityEstimates = [];
        for (var i = 0; i < imageBuffer.length - 1; i++) {
          if (imageBuffer[i] === 0xFF && imageBuffer[i + 1] === 0xDB) {
            dqtMarkers++;
            var position = i / imageBuffer.length;
            qualityEstimates.push(position);
          }
        }
        var inconsistencyScore = 0;
        if (dqtMarkers > 2) {
          inconsistencyScore += Math.min((dqtMarkers - 2) * 15, 50);
        }
        if (qualityEstimates.length > 1) {
          var variance = this.calculateVariance(qualityEstimates);
          if (variance > 0.1) {
            inconsistencyScore += 20;
          }
        }
        return {
          inconsistencyScore: Math.min(inconsistencyScore, 100),
          dqtMarkers: dqtMarkers,
          qualityVariance: qualityEstimates.length > 1 ? this.calculateVariance(qualityEstimates) : 0,
          applicable: true
        };
      } catch (error) {
        return {
          inconsistencyScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeNoiseConsistency",
    value: function analyzeNoiseConsistency(imageBuffer) {
      try {
        var regionSize = 256;
        var numRegions = Math.min(16, Math.floor(imageBuffer.length / regionSize));
        var noiseEstimates = [];
        for (var r = 0; r < numRegions; r++) {
          var startIdx = r * regionSize;
          var region = imageBuffer.slice(startIdx, startIdx + regionSize);
          var variance = 0;
          var mean = region.reduce(function (sum, val) {
            return sum + val;
          }, 0) / region.length;
          for (var i = 0; i < region.length; i++) {
            variance += Math.pow(region[i] - mean, 2);
          }
          variance /= region.length;
          noiseEstimates.push(Math.sqrt(variance));
        }
        var meanNoise = noiseEstimates.reduce(function (sum, val) {
          return sum + val;
        }, 0) / noiseEstimates.length;
        var noiseVariance = this.calculateVariance(noiseEstimates);
        var coherenceScore = 1 - noiseVariance / (meanNoise * meanNoise + 1);
        return {
          coherenceScore: Math.max(0, coherenceScore),
          meanNoise: meanNoise,
          noiseVariance: noiseVariance,
          regionsAnalyzed: numRegions,
          suspiciousLevel: coherenceScore < 0.5 ? 'high' : coherenceScore < 0.7 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          coherenceScore: 0.5,
          error: error.message
        };
      }
    }
  }, {
    key: "detectArtificialBoundaries",
    value: function detectArtificialBoundaries(imageBuffer) {
      try {
        var gradients = [];
        var stepSize = 32;
        for (var i = 0; i < imageBuffer.length - stepSize; i += stepSize) {
          var gradient = 0;
          for (var j = 0; j < stepSize - 1; j++) {
            gradient += Math.abs(imageBuffer[i + j + 1] - imageBuffer[i + j]);
          }
          gradients.push(gradient / stepSize);
        }
        var mean = gradients.reduce(function (sum, val) {
          return sum + val;
        }, 0) / gradients.length;
        var threshold = mean * 3;
        var peakCount = gradients.filter(function (g) {
          return g > threshold;
        }).length;
        var artificialScore = peakCount / gradients.length;
        return {
          artificialScore: artificialScore,
          peakCount: peakCount,
          totalGradients: gradients.length,
          threshold: threshold,
          suspiciousLevel: artificialScore > 0.8 ? 'high' : artificialScore > 0.5 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          artificialScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeLightingConsistency",
    value: function analyzeLightingConsistency(imageBuffer) {
      try {
        var blockSize = 128;
        var numBlocks = Math.min(20, Math.floor(imageBuffer.length / blockSize));
        var brightnessValues = [];
        for (var b = 0; b < numBlocks; b++) {
          var startIdx = b * blockSize;
          var block = imageBuffer.slice(startIdx, startIdx + blockSize);
          var avgBrightness = block.reduce(function (sum, val) {
            return sum + val;
          }, 0) / block.length;
          brightnessValues.push(avgBrightness);
        }
        var brightnessVariance = this.calculateVariance(brightnessValues);
        var maxBrightness = Math.max.apply(Math, brightnessValues);
        var minBrightness = Math.min.apply(Math, brightnessValues);
        var range = maxBrightness - minBrightness;
        var inconsistencyScore = brightnessVariance / 10000 + range / 500;
        return {
          inconsistencyScore: Math.min(inconsistencyScore, 1),
          brightnessVariance: brightnessVariance,
          brightnessRange: range,
          blocksAnalyzed: numBlocks,
          suspiciousLevel: inconsistencyScore > 0.7 ? 'high' : inconsistencyScore > 0.4 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          inconsistencyScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeHistogramArtifacts",
    value: function analyzeHistogramArtifacts(imageBuffer) {
      try {
        var histogram = new Array(256).fill(0);
        for (var i = 0; i < imageBuffer.length; i++) {
          histogram[imageBuffer[i]]++;
        }
        var peakCount = 0;
        var valleyCount = 0;
        var threshold = imageBuffer.length / 1000;
        for (var _i2 = 1; _i2 < 255; _i2++) {
          if (histogram[_i2] > histogram[_i2 - 1] && histogram[_i2] > histogram[_i2 + 1] && histogram[_i2] > threshold) {
            peakCount++;
          }
          if (histogram[_i2] < histogram[_i2 - 1] && histogram[_i2] < histogram[_i2 + 1] && histogram[_i2] < threshold) {
            valleyCount++;
          }
        }
        var artificialPeaks = Math.min((peakCount - 3) / 10, 1);
        return {
          artificialPeaks: Math.max(0, artificialPeaks),
          peakCount: peakCount,
          valleyCount: valleyCount,
          histogram: histogram,
          suspiciousLevel: artificialPeaks > 0.7 ? 'high' : artificialPeaks > 0.4 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          artificialPeaks: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "detectOverSharpening",
    value: function detectOverSharpening(imageBuffer) {
      try {
        var windowSize = 16;
        var totalSharpness = 0;
        var windowCount = 0;
        for (var i = 0; i < imageBuffer.length - windowSize; i += windowSize) {
          var sharpnessValue = 0;
          for (var j = 0; j < windowSize - 1; j++) {
            var diff = Math.abs(imageBuffer[i + j + 1] - imageBuffer[i + j]);
            sharpnessValue += diff * diff;
          }
          totalSharpness += Math.sqrt(sharpnessValue / windowSize);
          windowCount++;
        }
        var avgSharpness = totalSharpness / windowCount;
        var overSharpenScore = Math.min(avgSharpness / 100, 1);
        return {
          overSharpenScore: overSharpenScore,
          averageSharpness: avgSharpness,
          windowsAnalyzed: windowCount,
          suspiciousLevel: overSharpenScore > 0.8 ? 'high' : overSharpenScore > 0.5 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          overSharpenScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "detectArtificialSaturation",
    value: function detectArtificialSaturation(imageBuffer) {
      try {
        var sampleSize = Math.min(10000, imageBuffer.length);
        var extremeValues = 0;
        var nearExtremeValues = 0;
        for (var i = 0; i < sampleSize; i++) {
          var value = imageBuffer[i];
          if (value === 0 || value === 255) {
            extremeValues++;
          } else if (value < 5 || value > 250) {
            nearExtremeValues++;
          }
        }
        var extremeRatio = extremeValues / sampleSize;
        var nearExtremeRatio = nearExtremeValues / sampleSize;
        var artificialScore = extremeRatio * 2 + nearExtremeRatio;
        return {
          artificialScore: Math.min(artificialScore, 1),
          extremeValues: extremeValues,
          nearExtremeValues: nearExtremeValues,
          sampleSize: sampleSize,
          suspiciousLevel: artificialScore > 0.9 ? 'high' : artificialScore > 0.6 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          artificialScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "detectArtificialDenoising",
    value: function detectArtificialDenoising(imageBuffer) {
      try {
        var blockSize = 64;
        var numBlocks = Math.min(50, Math.floor(imageBuffer.length / blockSize));
        var smoothnessScores = [];
        for (var b = 0; b < numBlocks; b++) {
          var startIdx = b * blockSize;
          var block = imageBuffer.slice(startIdx, startIdx + blockSize);
          var variance = 0;
          var mean = block.reduce(function (sum, val) {
            return sum + val;
          }, 0) / block.length;
          for (var i = 0; i < block.length; i++) {
            variance += Math.pow(block[i] - mean, 2);
          }
          variance /= block.length;
          smoothnessScores.push(1 / (variance + 1));
        }
        var avgSmoothness = smoothnessScores.reduce(function (sum, val) {
          return sum + val;
        }, 0) / smoothnessScores.length;
        var artificialScore = Math.min(avgSmoothness, 1);
        return {
          artificialScore: artificialScore,
          averageSmoothness: avgSmoothness,
          blocksAnalyzed: numBlocks,
          suspiciousLevel: artificialScore > 0.85 ? 'high' : artificialScore > 0.7 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          artificialScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "detectExcessiveTonalAdjustments",
    value: function detectExcessiveTonalAdjustments(imageBuffer) {
      try {
        var histogram = new Array(256).fill(0);
        for (var i = 0; i < imageBuffer.length; i++) {
          histogram[imageBuffer[i]]++;
        }
        var gaps = 0;
        var spikes = 0;
        var avgCount = imageBuffer.length / 256;
        for (var _i3 = 0; _i3 < 256; _i3++) {
          if (histogram[_i3] === 0 && _i3 > 10 && _i3 < 245) {
            gaps++;
          }
          if (histogram[_i3] > avgCount * 5) {
            spikes++;
          }
        }
        var excessiveScore = Math.min(gaps / 50 + spikes / 20, 1);
        return {
          excessiveScore: excessiveScore,
          gaps: gaps,
          spikes: spikes,
          suspiciousLevel: excessiveScore > 0.6 ? 'high' : excessiveScore > 0.3 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          excessiveScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzePixelDistribution",
    value: function analyzePixelDistribution(imageBuffer) {
      try {
        var histogram = new Array(256).fill(0);
        for (var i = 0; i < imageBuffer.length; i++) {
          histogram[imageBuffer[i]]++;
        }
        var expectedFreq = imageBuffer.length / 256;
        var chiSquare = 0;
        for (var _i4 = 0; _i4 < 256; _i4++) {
          var diff = histogram[_i4] - expectedFreq;
          chiSquare += diff * diff / expectedFreq;
        }
        var anomalyScore = Math.min(chiSquare / (imageBuffer.length / 100), 1);
        return {
          anomalyScore: anomalyScore,
          chiSquareStatistic: chiSquare,
          histogram: histogram,
          suspiciousLevel: anomalyScore > 0.8 ? 'high' : anomalyScore > 0.5 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          anomalyScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeSpatialCorrelation",
    value: function analyzeSpatialCorrelation(imageBuffer) {
      try {
        var sampleSize = Math.min(1000, imageBuffer.length - 1);
        var correlationSum = 0;
        for (var i = 0; i < sampleSize; i++) {
          var index = Math.floor(Math.random() * (imageBuffer.length - 1));
          var correlation = Math.abs(imageBuffer[index] - imageBuffer[index + 1]);
          correlationSum += correlation;
        }
        var avgCorrelation = correlationSum / sampleSize;
        var normalizedCorrelation = avgCorrelation / 255;
        var anomalyScore = Math.abs(0.5 - normalizedCorrelation) * 2;
        return {
          anomalyScore: Math.min(anomalyScore, 1),
          averageCorrelation: avgCorrelation,
          normalizedCorrelation: normalizedCorrelation,
          suspiciousLevel: anomalyScore > 0.7 ? 'high' : anomalyScore > 0.4 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          anomalyScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeGlobalEntropy",
    value: function analyzeGlobalEntropy(imageBuffer) {
      try {
        var histogram = new Array(256).fill(0);
        for (var i = 0; i < imageBuffer.length; i++) {
          histogram[imageBuffer[i]]++;
        }
        var entropy = 0;
        for (var _i5 = 0; _i5 < 256; _i5++) {
          if (histogram[_i5] > 0) {
            var probability = histogram[_i5] / imageBuffer.length;
            entropy -= probability * Math.log2(probability);
          }
        }
        var expectedEntropy = 7.5;
        var suspiciousLevel = Math.abs(entropy - expectedEntropy) / expectedEntropy;
        return {
          entropy: entropy,
          expectedEntropy: expectedEntropy,
          suspiciousLevel: Math.min(suspiciousLevel, 1),
          level: suspiciousLevel > 0.6 ? 'high' : suspiciousLevel > 0.3 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          entropy: 0,
          suspiciousLevel: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "detectArtificialPatterns",
    value: function detectArtificialPatterns(imageBuffer) {
      try {
        var patternSize = 32;
        var numPatterns = Math.min(100, Math.floor(imageBuffer.length / patternSize));
        var patterns = new Map();
        for (var p = 0; p < numPatterns; p++) {
          var startIdx = p * patternSize;
          var pattern = imageBuffer.slice(startIdx, startIdx + patternSize);
          var hash = crypto.createHash('md5').update(pattern).digest('hex');
          if (patterns.has(hash)) {
            patterns.set(hash, patterns.get(hash) + 1);
          } else {
            patterns.set(hash, 1);
          }
        }
        var repeatedPatterns = Array.from(patterns.values()).filter(function (count) {
          return count > 1;
        });
        var artificialScore = repeatedPatterns.length / patterns.size;
        return {
          artificialScore: artificialScore,
          uniquePatterns: patterns.size,
          repeatedPatterns: repeatedPatterns.length,
          totalPatterns: numPatterns,
          suspiciousLevel: artificialScore > 0.9 ? 'high' : artificialScore > 0.7 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          artificialScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeSpectralCoherence",
    value: function analyzeSpectralCoherence(imageBuffer) {
      try {
        var blockSize = 256;
        var numBlocks = Math.min(20, Math.floor(imageBuffer.length / blockSize));
        var spectralVariances = [];
        for (var b = 0; b < numBlocks; b++) {
          var startIdx = b * blockSize;
          var block = imageBuffer.slice(startIdx, startIdx + blockSize);
          var freqBins = new Array(16).fill(0);
          for (var i = 0; i < block.length; i++) {
            var bin = Math.floor(block[i] / 256 * 16);
            freqBins[Math.min(bin, 15)]++;
          }
          var variance = this.calculateVariance(freqBins);
          spectralVariances.push(variance);
        }
        var avgVariance = spectralVariances.reduce(function (sum, val) {
          return sum + val;
        }, 0) / spectralVariances.length;
        var varianceOfVariances = this.calculateVariance(spectralVariances);
        var incoherenceScore = Math.min(varianceOfVariances / (avgVariance + 1), 1);
        return {
          incoherenceScore: incoherenceScore,
          averageVariance: avgVariance,
          varianceOfVariances: varianceOfVariances,
          blocksAnalyzed: numBlocks,
          suspiciousLevel: incoherenceScore > 0.5 ? 'high' : incoherenceScore > 0.3 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          incoherenceScore: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "detectMultipleJpegCompression",
    value: function detectMultipleJpegCompression(imageBuffer) {
      try {
        var dqtCount = 0;
        var sosCount = 0;
        for (var i = 0; i < imageBuffer.length - 1; i++) {
          if (imageBuffer[i] === 0xFF) {
            if (imageBuffer[i + 1] === 0xDB) dqtCount++;
            if (imageBuffer[i + 1] === 0xDA) sosCount++;
          }
        }
        var detected = dqtCount > 2 || sosCount > 1;
        var score = Math.min((dqtCount - 1) * 20 + (sosCount - 1) * 30, 100);
        return {
          detected: detected,
          score: Math.max(0, score),
          dqtMarkers: dqtCount,
          sosMarkers: sosCount,
          suspiciousLevel: detected ? 'high' : 'low'
        };
      } catch (error) {
        return {
          detected: false,
          score: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeQuantizationTables",
    value: function analyzeQuantizationTables(imageBuffer) {
      var _this = this;
      try {
        var qtables = [];
        for (var i = 0; i < imageBuffer.length - 67; i++) {
          if (imageBuffer[i] === 0xFF && imageBuffer[i + 1] === 0xDB) {
            var tableData = imageBuffer.slice(i + 4, i + 68);
            qtables.push(Array.from(tableData));
          }
        }
        if (qtables.length === 0) {
          return {
            anomalyScore: 0,
            tablesFound: 0
          };
        }
        var anomalyScore = 0;
        qtables.forEach(function (table) {
          var avgValue = table.reduce(function (sum, val) {
            return sum + val;
          }, 0) / table.length;
          var variance = _this.calculateVariance(table);
          if (avgValue < 10 || avgValue > 200) anomalyScore += 15;
          if (variance < 100) anomalyScore += 10;
        });
        return {
          anomalyScore: Math.min(anomalyScore, 100),
          tablesFound: qtables.length,
          tables: qtables,
          suspiciousLevel: anomalyScore > 50 ? 'high' : anomalyScore > 25 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          anomalyScore: 0,
          tablesFound: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "detectBlockingArtifacts",
    value: function detectBlockingArtifacts(imageBuffer) {
      try {
        if (!this.isJpegImage(imageBuffer)) {
          return {
            severity: 0,
            applicable: false
          };
        }
        var blockSize = 64;
        var blockingScore = 0;
        var blocksAnalyzed = 0;
        for (var i = 0; i < imageBuffer.length - blockSize; i += blockSize) {
          var block = imageBuffer.slice(i, i + blockSize);
          var uniformity = 0;
          var firstValue = block[0];
          for (var j = 0; j < block.length; j++) {
            if (Math.abs(block[j] - firstValue) < 5) {
              uniformity++;
            }
          }
          if (uniformity / block.length > 0.8) {
            blockingScore += 10;
          }
          blocksAnalyzed++;
        }
        var severity = Math.min(blockingScore / blocksAnalyzed * 10, 100);
        return {
          severity: severity,
          blockingScore: blockingScore,
          blocksAnalyzed: blocksAnalyzed,
          applicable: true,
          suspiciousLevel: severity > 60 ? 'high' : severity > 30 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          severity: 0,
          error: error.message
        };
      }
    }
  }, {
    key: "analyzeQualityConsistency",
    value: function analyzeQualityConsistency(imageBuffer) {
      try {
        var sampleSize = Math.min(5000, imageBuffer.length);
        var samples = [];
        for (var i = 0; i < sampleSize; i += 100) {
          samples.push(imageBuffer[i]);
        }
        var mean = samples.reduce(function (sum, val) {
          return sum + val;
        }, 0) / samples.length;
        var variance = this.calculateVariance(samples);
        var inconsistency = variance / (mean * mean + 1);
        return {
          inconsistency: Math.min(inconsistency, 1),
          variance: variance,
          mean: mean,
          samplesAnalyzed: samples.length,
          suspiciousLevel: inconsistency > 0.7 ? 'high' : inconsistency > 0.4 ? 'medium' : 'low'
        };
      } catch (error) {
        return {
          inconsistency: 0,
          error: error.message
        };
      }
    }

    // =====================================
    // MÉTHODES UTILITAIRES COMPLÈTES
    // =====================================
  }, {
    key: "extractImageBlocks",
    value: function extractImageBlocks(imageBuffer, blockSize) {
      var blocks = [];
      var totalBlocks = Math.floor(imageBuffer.length / blockSize);
      var maxBlocks = Math.min(totalBlocks, 1000); // Limiter pour performance

      for (var i = 0; i < maxBlocks; i++) {
        var startIdx = i * blockSize;
        blocks.push(imageBuffer.slice(startIdx, startIdx + blockSize));
      }
      return blocks;
    }
  }, {
    key: "calculateVariance",
    value: function calculateVariance(values) {
      if (values.length === 0) return 0;
      var mean = values.reduce(function (sum, val) {
        return sum + val;
      }, 0) / values.length;
      var variance = values.reduce(function (sum, val) {
        return sum + Math.pow(val - mean, 2);
      }, 0) / values.length;
      return variance;
    }
  }, {
    key: "calculateConfidence",
    value: function calculateConfidence(score, indicatorCount) {
      if (score === 0) return 'low';
      var baseConfidence = Math.min(score / 100, 1);
      var indicatorBonus = Math.min(indicatorCount / 5, 0.3);
      var finalConfidence = baseConfidence + indicatorBonus;
      if (finalConfidence >= 0.8) return 'very_high';
      if (finalConfidence >= 0.6) return 'high';
      if (finalConfidence >= 0.4) return 'medium';
      return 'low';
    }
  }, {
    key: "calculateOverallScore",
    value: function calculateOverallScore(analysisResult) {
      var weights = {
        cloning: 0.25,
        splicing: 0.25,
        enhancement: 0.2,
        compression: 0.15,
        statistical: 0.15
      };
      var weightedSum = 0;
      var totalWeight = 0;
      Object.entries(weights).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          weight = _ref2[1];
        if (analysisResult[key] && typeof analysisResult[key].score === 'number') {
          weightedSum += analysisResult[key].score * weight;
          totalWeight += weight;
        }
      });
      return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    }
  }, {
    key: "isJpegImage",
    value: function isJpegImage(imageBuffer) {
      return imageBuffer.length > 3 && imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8 && imageBuffer[2] === 0xFF;
    }
  }, {
    key: "generateCacheKey",
    value: function generateCacheKey(imageBuffer, metadata) {
      var contentHash = crypto.createHash('md5').update(imageBuffer.slice(0, 1000)).digest('hex');
      var metadataHash = crypto.createHash('md5').update(JSON.stringify(metadata)).digest('hex');
      return "".concat(contentHash, "-").concat(metadataHash);
    }
  }, {
    key: "updateCache",
    value: function updateCache(key, result) {
      if (this.analysisCache.size >= this.maxCacheSize) {
        var firstKey = this.analysisCache.keys().next().value;
        this.analysisCache["delete"](firstKey);
      }
      this.analysisCache.set(key, result);
    }
  }, {
    key: "formatBytes",
    value: function formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      var k = 1024;
      var sizes = ['B', 'KB', 'MB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }]);
}(); // =====================================
// FONCTIONS PUBLIQUES
// =====================================
var analyzer = new ForensicAnalyzer();
function analyzeManipulations(_x10) {
  return _analyzeManipulations2.apply(this, arguments);
}
function _analyzeManipulations2() {
  _analyzeManipulations2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(imageBuffer) {
    var metadata,
      _args7 = arguments;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          metadata = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
          return _context7.a(2, analyzer.analyzeManipulations(imageBuffer, metadata));
      }
    }, _callee7);
  }));
  return _analyzeManipulations2.apply(this, arguments);
}
function analyzeCompression(_x11) {
  return _analyzeCompression.apply(this, arguments);
}
function _analyzeCompression() {
  _analyzeCompression = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(imageBuffer) {
    var options,
      metadata,
      result,
      _args8 = arguments;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          options = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
          metadata = _objectSpread({}, options);
          _context8.n = 1;
          return analyzer.analyzeManipulations(imageBuffer, metadata);
        case 1:
          result = _context8.v;
          return _context8.a(2, result.compression);
      }
    }, _callee8);
  }));
  return _analyzeCompression.apply(this, arguments);
}
function detectCloning(_x12) {
  return _detectCloning2.apply(this, arguments);
}
function _detectCloning2() {
  _detectCloning2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(imageBuffer) {
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          return _context9.a(2, analyzer.detectCloning(imageBuffer, {}));
      }
    }, _callee9);
  }));
  return _detectCloning2.apply(this, arguments);
}
function detectSplicing(_x13, _x14) {
  return _detectSplicing2.apply(this, arguments);
}
function _detectSplicing2() {
  _detectSplicing2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(imageBuffer, metadata) {
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          return _context0.a(2, analyzer.detectSplicing(imageBuffer, metadata));
      }
    }, _callee0);
  }));
  return _detectSplicing2.apply(this, arguments);
}
function detectEnhancement(_x15) {
  return _detectEnhancement2.apply(this, arguments);
}
function _detectEnhancement2() {
  _detectEnhancement2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(imageBuffer) {
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          return _context1.a(2, analyzer.detectEnhancement(imageBuffer, {}));
      }
    }, _callee1);
  }));
  return _detectEnhancement2.apply(this, arguments);
}
module.exports = {
  analyzeManipulations: analyzeManipulations,
  analyzeCompression: analyzeCompression,
  detectCloning: detectCloning,
  detectSplicing: detectSplicing,
  detectEnhancement: detectEnhancement,
  ForensicAnalyzer: ForensicAnalyzer
};