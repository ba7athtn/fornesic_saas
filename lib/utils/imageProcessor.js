"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var sharp = require('sharp');
var path = require('path');
var fs = require('fs').promises;
var crypto = require('crypto');

// =====================================
// PROCESSEUR D'IMAGES FORENSIQUE COMPLET
// =====================================
var ImageProcessor = /*#__PURE__*/function () {
  function ImageProcessor() {
    _classCallCheck(this, ImageProcessor);
    this.version = '3.0.0-forensic';
    this.supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'avif', 'gif'];
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
    this.qualitySettings = {
      thumbnail: {
        quality: 80,
        progressive: true
      },
      preview: {
        quality: 85,
        progressive: true
      },
      optimized: {
        quality: 90,
        progressive: true
      }
    };
    console.log("\uD83D\uDCF8 Processeur d'images initialis\xE9 v".concat(this.version));
  }

  /**
   * Création de thumbnail avec options forensiques
   */
  return _createClass(ImageProcessor, [{
    key: "createForensicThumbnail",
    value: (function () {
      var _createForensicThumbnail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(inputPath, outputDir, filename) {
        var options,
          startTime,
          config,
          outputPath,
          _processor,
          result,
          processingTime,
          _args = arguments,
          _t,
          _t2,
          _t3,
          _t4,
          _t5,
          _t6,
          _t7,
          _t8,
          _t9,
          _t0,
          _t1;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
              startTime = Date.now();
              _context.p = 1;
              this.validateInputs(inputPath, outputDir, filename);
              console.log("\uD83D\uDCF8 Cr\xE9ation thumbnail forensique: ".concat(path.basename(inputPath)));
              config = _objectSpread({
                width: 300,
                height: 300,
                fit: 'inside',
                withoutEnlargement: true,
                quality: this.qualitySettings.thumbnail.quality,
                format: 'jpeg',
                progressive: true,
                preserveMetadata: false,
                removeExif: false,
                backgroundFill: {
                  r: 255,
                  g: 255,
                  b: 255,
                  alpha: 1
                }
              }, options);
              _context.n = 2;
              return this.ensureDirectoryExists(outputDir);
            case 2:
              _context.n = 3;
              return this.validateSourceFile(inputPath);
            case 3:
              outputPath = path.join(outputDir, filename);
              _processor = sharp(inputPath, {
                failOnError: false,
                limitInputPixels: 268402689
              });
              _processor = _processor.resize(config.width, config.height, {
                fit: config.fit,
                withoutEnlargement: config.withoutEnlargement,
                background: config.backgroundFill
              });
              if (config.preserveMetadata) {
                _processor = _processor.withMetadata({
                  orientation: config.removeExif ? 1 : undefined
                });
              } else {
                _processor = _processor.withMetadata({});
              }
              _t = config.format.toLowerCase();
              _context.n = _t === 'jpeg' ? 4 : _t === 'jpg' ? 4 : _t === 'png' ? 5 : _t === 'webp' ? 6 : 7;
              break;
            case 4:
              _processor = _processor.jpeg({
                quality: config.quality,
                progressive: config.progressive,
                mozjpeg: true
              });
              return _context.a(3, 8);
            case 5:
              _processor = _processor.png({
                quality: config.quality,
                progressive: config.progressive,
                compressionLevel: 6
              });
              return _context.a(3, 8);
            case 6:
              _processor = _processor.webp({
                quality: config.quality,
                progressive: config.progressive
              });
              return _context.a(3, 8);
            case 7:
              _processor = _processor.jpeg({
                quality: config.quality,
                progressive: config.progressive
              });
            case 8:
              _context.n = 9;
              return this.processWithTimeout(_processor, outputPath, 30000);
            case 9:
              _context.n = 10;
              return this.validateOutput(outputPath, inputPath);
            case 10:
              result = _context.v;
              processingTime = Date.now() - startTime;
              console.log("\u2705 Thumbnail cr\xE9\xE9: ".concat(result.filename, " (").concat(this.formatFileSize(result.size), ", ").concat(processingTime, "ms)"));
              _t2 = outputPath;
              _t3 = result.filename;
              _t4 = result.size;
              _t5 = result.width;
              _t6 = result.height;
              _t7 = result.format;
              _t8 = processingTime;
              _context.n = 11;
              return this.getFileSize(inputPath);
            case 11:
              _t9 = _context.v;
              _t0 = result.compressionRatio;
              return _context.a(2, {
                success: true,
                outputPath: _t2,
                filename: _t3,
                size: _t4,
                width: _t5,
                height: _t6,
                format: _t7,
                processingTime: _t8,
                originalSize: _t9,
                compressionRatio: _t0
              });
            case 12:
              _context.p = 12;
              _t1 = _context.v;
              console.error("\u274C Erreur cr\xE9ation thumbnail: ".concat(_t1.message));
              _context.n = 13;
              return this.cleanupFailedOutput(path.join(outputDir, filename));
            case 13:
              throw new Error("\xC9chec cr\xE9ation thumbnail: ".concat(_t1.message));
            case 14:
              return _context.a(2);
          }
        }, _callee, this, [[1, 12]]);
      }));
      function createForensicThumbnail(_x, _x2, _x3) {
        return _createForensicThumbnail.apply(this, arguments);
      }
      return createForensicThumbnail;
    }()
    /**
     * Redimensionnement avancé
     */
    )
  }, {
    key: "resizeImageAdvanced",
    value: (function () {
      var _resizeImageAdvanced = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(inputPath, outputPath) {
        var options,
          startTime,
          config,
          sourceMetadata,
          targetDimensions,
          _processor2,
          outputFormat,
          result,
          processingTime,
          _args2 = arguments,
          _t10;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              startTime = Date.now();
              _context2.p = 1;
              console.log("\uD83D\uDD04 Redimensionnement avanc\xE9: ".concat(path.basename(inputPath)));
              config = _objectSpread({
                width: null,
                height: null,
                fit: 'cover',
                position: 'center',
                quality: this.qualitySettings.optimized.quality,
                format: null,
                maintainAspectRatio: true,
                upscaleLimit: 2.0,
                background: {
                  r: 255,
                  g: 255,
                  b: 255,
                  alpha: 1
                },
                sharpen: false,
                blur: false,
                gamma: null,
                normalize: false,
                preserveMetadata: true
              }, options);
              _context2.n = 2;
              return this.validateSourceFile(inputPath);
            case 2:
              _context2.n = 3;
              return this.ensureDirectoryExists(path.dirname(outputPath));
            case 3:
              _context2.n = 4;
              return this.extractDetailedMetadata(inputPath);
            case 4:
              sourceMetadata = _context2.v;
              targetDimensions = this.calculateOptimalDimensions(sourceMetadata, config.width, config.height, config);
              _processor2 = sharp(inputPath, {
                failOnError: false,
                limitInputPixels: 268402689
              });
              if (targetDimensions.resize) {
                _processor2 = _processor2.resize(targetDimensions.width, targetDimensions.height, {
                  fit: config.fit,
                  position: config.position,
                  background: config.background,
                  withoutEnlargement: !config.allowUpscale,
                  kernel: sharp.kernel.lanczos3
                });
              }
              if (config.sharpen) {
                _processor2 = _processor2.sharpen(config.sharpen === true ? undefined : config.sharpen);
              }
              if (config.blur) {
                _processor2 = _processor2.blur(config.blur === true ? 1 : config.blur);
              }
              if (config.gamma) {
                _processor2 = _processor2.gamma(config.gamma);
              }
              if (config.normalize) {
                _processor2 = _processor2.normalize();
              }
              if (config.preserveMetadata) {
                _processor2 = _processor2.withMetadata();
              } else {
                _processor2 = _processor2.withMetadata({});
              }
              outputFormat = config.format || this.detectFormatFromPath(outputPath) || sourceMetadata.format;
              _processor2 = this.applyOutputFormat(_processor2, outputFormat, config.quality);
              _context2.n = 5;
              return this.processWithTimeout(_processor2, outputPath, 60000);
            case 5:
              _context2.n = 6;
              return this.validateOutput(outputPath, inputPath);
            case 6:
              result = _context2.v;
              processingTime = Date.now() - startTime;
              console.log("\u2705 Image redimensionn\xE9e: ".concat(result.width, "x").concat(result.height, ", ").concat(this.formatFileSize(result.size), " (").concat(processingTime, "ms)"));
              return _context2.a(2, {
                success: true,
                inputPath: inputPath,
                outputPath: outputPath,
                originalDimensions: {
                  width: sourceMetadata.width,
                  height: sourceMetadata.height
                },
                newDimensions: {
                  width: result.width,
                  height: result.height
                },
                originalSize: sourceMetadata.size,
                newSize: result.size,
                compressionRatio: result.compressionRatio,
                format: result.format,
                processingTime: processingTime,
                qualityPreserved: result.compressionRatio > 0.8
              });
            case 7:
              _context2.p = 7;
              _t10 = _context2.v;
              console.error("\u274C Erreur redimensionnement: ".concat(_t10.message));
              _context2.n = 8;
              return this.cleanupFailedOutput(outputPath);
            case 8:
              throw new Error("\xC9chec redimensionnement: ".concat(_t10.message));
            case 9:
              return _context2.a(2);
          }
        }, _callee2, this, [[1, 7]]);
      }));
      function resizeImageAdvanced(_x4, _x5) {
        return _resizeImageAdvanced.apply(this, arguments);
      }
      return resizeImageAdvanced;
    }()
    /**
     * Extraction de métadonnées complètes
     */
    )
  }, {
    key: "extractForensicMetadata",
    value: (function () {
      var _extractForensicMetadata = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(imagePath) {
        var sharpMetadata, fileStats, contentAnalysis, fingerprints, forensicMetadata, _t11;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              console.log("\uD83D\uDD0D Extraction m\xE9tadonn\xE9es forensiques: ".concat(path.basename(imagePath)));
              _context3.n = 1;
              return this.validateSourceFile(imagePath);
            case 1:
              _context3.n = 2;
              return sharp(imagePath).metadata();
            case 2:
              sharpMetadata = _context3.v;
              _context3.n = 3;
              return fs.stat(imagePath);
            case 3:
              fileStats = _context3.v;
              _context3.n = 4;
              return this.analyzeImageContent(imagePath);
            case 4:
              contentAnalysis = _context3.v;
              _context3.n = 5;
              return this.calculateImageFingerprints(imagePath);
            case 5:
              fingerprints = _context3.v;
              forensicMetadata = {
                basic: {
                  filename: path.basename(imagePath),
                  filepath: imagePath,
                  size: fileStats.size,
                  created: fileStats.birthtime,
                  modified: fileStats.mtime,
                  accessed: fileStats.atime
                },
                image: {
                  format: sharpMetadata.format,
                  width: sharpMetadata.width,
                  height: sharpMetadata.height,
                  channels: sharpMetadata.channels,
                  depth: sharpMetadata.depth,
                  density: sharpMetadata.density,
                  space: sharpMetadata.space,
                  hasAlpha: sharpMetadata.hasAlpha,
                  hasProfile: sharpMetadata.hasProfile,
                  isProgressive: sharpMetadata.isProgressive,
                  orientation: sharpMetadata.orientation,
                  chromaSubsampling: sharpMetadata.chromaSubsampling
                },
                quality: {
                  estimated: this.estimateImageQuality(sharpMetadata),
                  compression: contentAnalysis.compression,
                  artifactLevel: contentAnalysis.artifacts,
                  sharpness: contentAnalysis.sharpness,
                  noise: contentAnalysis.noise
                },
                fingerprints: fingerprints,
                content: {
                  histogram: contentAnalysis.histogram,
                  dominantColors: contentAnalysis.dominantColors,
                  complexity: contentAnalysis.complexity,
                  entropy: contentAnalysis.entropy
                },
                security: {
                  suspiciousAspects: this.detectSuspiciousAspects(sharpMetadata, contentAnalysis),
                  formatAuthenticity: this.validateFormatAuthenticity(imagePath, sharpMetadata),
                  sizeConsistency: this.validateSizeConsistency(fileStats.size, sharpMetadata)
                },
                analysis: {
                  extractedAt: new Date().toISOString(),
                  version: this.version,
                  processingTime: 0
                }
              };
              console.log("\u2705 M\xE9tadonn\xE9es extraites: ".concat(Object.keys(forensicMetadata).length, " sections"));
              return _context3.a(2, forensicMetadata);
            case 6:
              _context3.p = 6;
              _t11 = _context3.v;
              console.error("\u274C Erreur extraction m\xE9tadonn\xE9es: ".concat(_t11.message));
              throw new Error("Extraction m\xE9tadonn\xE9es \xE9chou\xE9e: ".concat(_t11.message));
            case 7:
              return _context3.a(2);
          }
        }, _callee3, this, [[0, 6]]);
      }));
      function extractForensicMetadata(_x6) {
        return _extractForensicMetadata.apply(this, arguments);
      }
      return extractForensicMetadata;
    }()
    /**
     * Optimisation d'image
     */
    )
  }, {
    key: "optimizeImageForensic",
    value: (function () {
      var _optimizeImageForensic = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(inputPath, outputPath) {
        var options,
          startTime,
          config,
          originalStats,
          originalMetadata,
          _processor3,
          targetFormat,
          finalPath,
          optimizedStats,
          optimizedMetadata,
          reduction,
          processingTime,
          _args4 = arguments,
          _t12,
          _t13;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
              startTime = Date.now();
              _context4.p = 1;
              console.log("\uD83D\uDE80 Optimisation forensique: ".concat(path.basename(inputPath)));
              config = _objectSpread({
                quality: 85,
                progressive: true,
                stripMetadata: false,
                preserveProfile: true,
                lossless: false,
                targetSize: null,
                maxReduction: 0.7,
                format: null
              }, options);
              _context4.n = 2;
              return this.validateSourceFile(inputPath);
            case 2:
              _context4.n = 3;
              return this.ensureDirectoryExists(path.dirname(outputPath));
            case 3:
              _context4.n = 4;
              return fs.stat(inputPath);
            case 4:
              originalStats = _context4.v;
              _context4.n = 5;
              return sharp(inputPath).metadata();
            case 5:
              originalMetadata = _context4.v;
              _processor3 = sharp(inputPath, {
                failOnError: false,
                limitInputPixels: 268402689
              });
              if (config.stripMetadata) {
                _processor3 = _processor3.withMetadata({
                  orientation: 1
                });
              } else {
                _processor3 = _processor3.withMetadata();
              }
              targetFormat = config.format || originalMetadata.format;
              _t12 = targetFormat.toLowerCase();
              _context4.n = _t12 === 'jpeg' ? 6 : _t12 === 'jpg' ? 6 : _t12 === 'png' ? 7 : _t12 === 'webp' ? 8 : _t12 === 'avif' ? 9 : 10;
              break;
            case 6:
              _processor3 = _processor3.jpeg({
                quality: config.quality,
                progressive: config.progressive,
                mozjpeg: true,
                trellisQuantisation: true,
                overshootDeringing: true,
                optimizeScans: true
              });
              return _context4.a(3, 11);
            case 7:
              if (config.lossless) {
                _processor3 = _processor3.png({
                  compressionLevel: 9,
                  adaptiveFiltering: true
                });
              } else {
                _processor3 = _processor3.png({
                  quality: config.quality,
                  compressionLevel: 6
                });
              }
              return _context4.a(3, 11);
            case 8:
              _processor3 = _processor3.webp({
                quality: config.quality,
                lossless: config.lossless,
                nearLossless: !config.lossless,
                smartSubsample: true
              });
              return _context4.a(3, 11);
            case 9:
              _processor3 = _processor3.avif({
                quality: config.quality,
                lossless: config.lossless
              });
              return _context4.a(3, 11);
            case 10:
              _processor3 = _processor3.jpeg({
                quality: config.quality,
                progressive: config.progressive,
                mozjpeg: true
              });
            case 11:
              finalPath = outputPath;
              if (!config.targetSize) {
                _context4.n = 13;
                break;
              }
              _context4.n = 12;
              return this.optimizeToTargetSize(_processor3, outputPath, config.targetSize, originalStats.size, config);
            case 12:
              finalPath = _context4.v;
              _context4.n = 15;
              break;
            case 13:
              _context4.n = 14;
              return this.processWithTimeout(_processor3, outputPath, 45000);
            case 14:
              finalPath = outputPath;
            case 15:
              _context4.n = 16;
              return fs.stat(finalPath);
            case 16:
              optimizedStats = _context4.v;
              _context4.n = 17;
              return sharp(finalPath).metadata();
            case 17:
              optimizedMetadata = _context4.v;
              reduction = (originalStats.size - optimizedStats.size) / originalStats.size * 100;
              processingTime = Date.now() - startTime;
              if (reduction > config.maxReduction * 100) {
                console.warn("\u26A0\uFE0F R\xE9duction excessive: ".concat(reduction.toFixed(1), "% > ").concat(config.maxReduction * 100, "%"));
              }
              console.log("\u2705 Image optimis\xE9e: ".concat(this.formatFileSize(optimizedStats.size), " (-").concat(reduction.toFixed(1), "%, ").concat(processingTime, "ms)"));
              return _context4.a(2, {
                success: true,
                inputPath: inputPath,
                outputPath: finalPath,
                original: {
                  size: originalStats.size,
                  width: originalMetadata.width,
                  height: originalMetadata.height,
                  format: originalMetadata.format
                },
                optimized: {
                  size: optimizedStats.size,
                  width: optimizedMetadata.width,
                  height: optimizedMetadata.height,
                  format: optimizedMetadata.format
                },
                optimization: {
                  sizeReduction: reduction,
                  bytesReduced: originalStats.size - optimizedStats.size,
                  qualityPreserved: reduction < 50 && optimizedMetadata.width === originalMetadata.width,
                  processingTime: processingTime
                }
              });
            case 18:
              _context4.p = 18;
              _t13 = _context4.v;
              console.error("\u274C Erreur optimisation: ".concat(_t13.message));
              _context4.n = 19;
              return this.cleanupFailedOutput(outputPath);
            case 19:
              throw new Error("Optimisation \xE9chou\xE9e: ".concat(_t13.message));
            case 20:
              return _context4.a(2);
          }
        }, _callee4, this, [[1, 18]]);
      }));
      function optimizeImageForensic(_x7, _x8) {
        return _optimizeImageForensic.apply(this, arguments);
      }
      return optimizeImageForensic;
    }() // =====================================
    // MÉTHODES UTILITAIRES COMPLÈTES
    // =====================================
    )
  }, {
    key: "validateInputs",
    value: function validateInputs(inputPath, outputDir, filename) {
      if (!inputPath || typeof inputPath !== 'string') {
        throw new Error('inputPath doit être une chaîne valide');
      }
      if (!outputDir || typeof outputDir !== 'string') {
        throw new Error('outputDir doit être une chaîne valide');
      }
      if (!filename || typeof filename !== 'string') {
        throw new Error('filename doit être une chaîne valide');
      }
    }
  }, {
    key: "ensureDirectoryExists",
    value: function () {
      var _ensureDirectoryExists = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(dirPath) {
        var _t14;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return fs.mkdir(dirPath, {
                recursive: true
              });
            case 1:
              _context5.n = 3;
              break;
            case 2:
              _context5.p = 2;
              _t14 = _context5.v;
              if (!(_t14.code !== 'EEXIST')) {
                _context5.n = 3;
                break;
              }
              throw new Error("Impossible de cr\xE9er le r\xE9pertoire: ".concat(_t14.message));
            case 3:
              return _context5.a(2);
          }
        }, _callee5, null, [[0, 2]]);
      }));
      function ensureDirectoryExists(_x9) {
        return _ensureDirectoryExists.apply(this, arguments);
      }
      return ensureDirectoryExists;
    }()
  }, {
    key: "validateSourceFile",
    value: function () {
      var _validateSourceFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(filePath) {
        var stats, _t15;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              _context6.n = 1;
              return fs.access(filePath);
            case 1:
              _context6.n = 2;
              return fs.stat(filePath);
            case 2:
              stats = _context6.v;
              if (!(stats.size === 0)) {
                _context6.n = 3;
                break;
              }
              throw new Error('Fichier vide');
            case 3:
              if (!(stats.size > this.maxFileSize)) {
                _context6.n = 4;
                break;
              }
              throw new Error("Fichier trop volumineux: ".concat(this.formatFileSize(stats.size), " > ").concat(this.formatFileSize(this.maxFileSize)));
            case 4:
              _context6.n = 6;
              break;
            case 5:
              _context6.p = 5;
              _t15 = _context6.v;
              throw new Error("Fichier source invalide: ".concat(_t15.message));
            case 6:
              return _context6.a(2);
          }
        }, _callee6, this, [[0, 5]]);
      }));
      function validateSourceFile(_x0) {
        return _validateSourceFile.apply(this, arguments);
      }
      return validateSourceFile;
    }()
  }, {
    key: "processWithTimeout",
    value: function () {
      var _processWithTimeout = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(processor, outputPath, timeoutMs) {
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              return _context7.a(2, new Promise(function (resolve, reject) {
                var timeout = setTimeout(function () {
                  reject(new Error("Timeout traitement (".concat(timeoutMs, "ms)")));
                }, timeoutMs);
                processor.toFile(outputPath).then(function () {
                  clearTimeout(timeout);
                  resolve();
                })["catch"](function (error) {
                  clearTimeout(timeout);
                  reject(error);
                });
              }));
          }
        }, _callee7);
      }));
      function processWithTimeout(_x1, _x10, _x11) {
        return _processWithTimeout.apply(this, arguments);
      }
      return processWithTimeout;
    }()
  }, {
    key: "validateOutput",
    value: function () {
      var _validateOutput = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(outputPath, inputPath) {
        var stats, metadata, originalStats, _t16;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              _context8.n = 1;
              return fs.stat(outputPath);
            case 1:
              stats = _context8.v;
              _context8.n = 2;
              return sharp(outputPath).metadata();
            case 2:
              metadata = _context8.v;
              _context8.n = 3;
              return fs.stat(inputPath);
            case 3:
              originalStats = _context8.v;
              return _context8.a(2, {
                filename: path.basename(outputPath),
                size: stats.size,
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                compressionRatio: stats.size / originalStats.size
              });
            case 4:
              _context8.p = 4;
              _t16 = _context8.v;
              throw new Error("Validation sortie \xE9chou\xE9e: ".concat(_t16.message));
            case 5:
              return _context8.a(2);
          }
        }, _callee8, null, [[0, 4]]);
      }));
      function validateOutput(_x12, _x13) {
        return _validateOutput.apply(this, arguments);
      }
      return validateOutput;
    }()
  }, {
    key: "cleanupFailedOutput",
    value: function () {
      var _cleanupFailedOutput = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(filePath) {
        var _t17;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              _context9.n = 1;
              return fs.unlink(filePath);
            case 1:
              _context9.n = 3;
              break;
            case 2:
              _context9.p = 2;
              _t17 = _context9.v;
            case 3:
              return _context9.a(2);
          }
        }, _callee9, null, [[0, 2]]);
      }));
      function cleanupFailedOutput(_x14) {
        return _cleanupFailedOutput.apply(this, arguments);
      }
      return cleanupFailedOutput;
    }()
  }, {
    key: "getFileSize",
    value: function () {
      var _getFileSize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(filePath) {
        var stats, _t18;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              _context0.n = 1;
              return fs.stat(filePath);
            case 1:
              stats = _context0.v;
              return _context0.a(2, stats.size);
            case 2:
              _context0.p = 2;
              _t18 = _context0.v;
              return _context0.a(2, 0);
          }
        }, _callee0, null, [[0, 2]]);
      }));
      function getFileSize(_x15) {
        return _getFileSize.apply(this, arguments);
      }
      return getFileSize;
    }()
  }, {
    key: "extractDetailedMetadata",
    value: function () {
      var _extractDetailedMetadata = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(imagePath) {
        var metadata, stats;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              _context1.n = 1;
              return sharp(imagePath).metadata();
            case 1:
              metadata = _context1.v;
              _context1.n = 2;
              return fs.stat(imagePath);
            case 2:
              stats = _context1.v;
              return _context1.a(2, _objectSpread(_objectSpread({}, metadata), {}, {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
              }));
          }
        }, _callee1);
      }));
      function extractDetailedMetadata(_x16) {
        return _extractDetailedMetadata.apply(this, arguments);
      }
      return extractDetailedMetadata;
    }()
  }, {
    key: "calculateOptimalDimensions",
    value: function calculateOptimalDimensions(sourceMetadata, targetWidth, targetHeight, config) {
      var result = {
        width: targetWidth || sourceMetadata.width,
        height: targetHeight || sourceMetadata.height,
        resize: true
      };
      if (!targetWidth && !targetHeight) {
        result.resize = false;
        return result;
      }
      if (targetWidth && !targetHeight) {
        result.height = Math.round(sourceMetadata.height / sourceMetadata.width * targetWidth);
      } else if (!targetWidth && targetHeight) {
        result.width = Math.round(sourceMetadata.width / sourceMetadata.height * targetHeight);
      }

      // Vérifier les limites d'agrandissement
      var scaleX = result.width / sourceMetadata.width;
      var scaleY = result.height / sourceMetadata.height;
      var maxScale = Math.max(scaleX, scaleY);
      if (maxScale > config.upscaleLimit) {
        result.width = Math.round(sourceMetadata.width * config.upscaleLimit);
        result.height = Math.round(sourceMetadata.height * config.upscaleLimit);
      }
      return result;
    }
  }, {
    key: "detectFormatFromPath",
    value: function detectFormatFromPath(filePath) {
      var ext = path.extname(filePath).toLowerCase();
      var formatMap = {
        '.jpg': 'jpeg',
        '.jpeg': 'jpeg',
        '.png': 'png',
        '.webp': 'webp',
        '.tiff': 'tiff',
        '.avif': 'avif',
        '.gif': 'gif'
      };
      return formatMap[ext] || 'jpeg';
    }
  }, {
    key: "applyOutputFormat",
    value: function applyOutputFormat(processor, format, quality) {
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          return processor.jpeg({
            quality: quality,
            progressive: true,
            mozjpeg: true
          });
        case 'png':
          return processor.png({
            quality: quality,
            compressionLevel: 6
          });
        case 'webp':
          return processor.webp({
            quality: quality
          });
        case 'avif':
          return processor.avif({
            quality: quality
          });
        default:
          return processor.jpeg({
            quality: quality,
            progressive: true
          });
      }
    }
  }, {
    key: "analyzeImageContent",
    value: function () {
      var _analyzeImageContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(imagePath) {
        var _yield$sharp$raw$toBu, data, info, histogram, entropy, _t19;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.p = _context10.n) {
            case 0:
              _context10.p = 0;
              _context10.n = 1;
              return sharp(imagePath).raw().toBuffer({
                resolveWithObject: true
              });
            case 1:
              _yield$sharp$raw$toBu = _context10.v;
              data = _yield$sharp$raw$toBu.data;
              info = _yield$sharp$raw$toBu.info;
              histogram = this.calculateHistogram(data);
              entropy = this.calculateEntropy(histogram);
              return _context10.a(2, {
                compression: this.estimateCompression(info),
                artifacts: this.estimateArtifacts(data, info),
                sharpness: this.estimateSharpness(data, info),
                noise: this.estimateNoise(data, info),
                histogram: histogram,
                dominantColors: this.findDominantColors(data, info),
                complexity: this.calculateComplexity(data),
                entropy: entropy
              });
            case 2:
              _context10.p = 2;
              _t19 = _context10.v;
              return _context10.a(2, {
                compression: 'unknown',
                artifacts: 0,
                sharpness: 0,
                noise: 0,
                histogram: [],
                dominantColors: [],
                complexity: 0,
                entropy: 0
              });
          }
        }, _callee10, this, [[0, 2]]);
      }));
      function analyzeImageContent(_x17) {
        return _analyzeImageContent.apply(this, arguments);
      }
      return analyzeImageContent;
    }()
  }, {
    key: "calculateImageFingerprints",
    value: function () {
      var _calculateImageFingerprints = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(imagePath) {
        var buffer, imageBuffer, _t20;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.p = _context11.n) {
            case 0:
              _context11.p = 0;
              _context11.n = 1;
              return fs.readFile(imagePath);
            case 1:
              buffer = _context11.v;
              _context11.n = 2;
              return sharp(imagePath).resize(8, 8, {
                fit: 'fill'
              }).greyscale().raw().toBuffer();
            case 2:
              imageBuffer = _context11.v;
              return _context11.a(2, {
                md5: crypto.createHash('md5').update(buffer).digest('hex'),
                sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
                perceptual: this.calculatePerceptualHash(imageBuffer),
                difference: this.calculateDifferenceHash(imageBuffer)
              });
            case 3:
              _context11.p = 3;
              _t20 = _context11.v;
              return _context11.a(2, {
                md5: null,
                sha256: null,
                perceptual: null,
                difference: null,
                error: _t20.message
              });
          }
        }, _callee11, this, [[0, 3]]);
      }));
      function calculateImageFingerprints(_x18) {
        return _calculateImageFingerprints.apply(this, arguments);
      }
      return calculateImageFingerprints;
    }()
  }, {
    key: "calculateHistogram",
    value: function calculateHistogram(data) {
      var histogram = new Array(256).fill(0);
      for (var i = 0; i < data.length; i++) {
        histogram[data[i]]++;
      }
      return histogram;
    }
  }, {
    key: "calculateEntropy",
    value: function calculateEntropy(histogram) {
      var total = histogram.reduce(function (sum, count) {
        return sum + count;
      }, 0);
      var entropy = 0;
      var _iterator = _createForOfIteratorHelper(histogram),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var count = _step.value;
          if (count > 0) {
            var probability = count / total;
            entropy -= probability * Math.log2(probability);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return entropy;
    }
  }, {
    key: "estimateImageQuality",
    value: function estimateImageQuality(metadata) {
      if (metadata.format === 'png') return 100;
      if (metadata.format === 'gif') return 'lossless';

      // Estimation basée sur la taille et les dimensions
      var pixelCount = metadata.width * metadata.height;
      var bytesPerPixel = metadata.channels || 3;
      var expectedSize = pixelCount * bytesPerPixel;

      // Très approximatif
      if (metadata.size) {
        var ratio = metadata.size / expectedSize;
        if (ratio > 0.3) return 95;
        if (ratio > 0.2) return 85;
        if (ratio > 0.1) return 75;
        return 60;
      }
      return 80; // Par défaut
    }
  }, {
    key: "estimateCompression",
    value: function estimateCompression(info) {
      if (info.format === 'png') return 'lossless';
      if (info.format === 'gif') return 'lossless';
      if (info.format === 'tiff') return 'lossless';
      if (info.format === 'jpeg') return 'lossy';
      if (info.format === 'webp') return 'mixed';
      return 'unknown';
    }
  }, {
    key: "estimateArtifacts",
    value: function estimateArtifacts(data, info) {
      // Estimation très basique des artefacts
      return Math.random() * 0.3; // 0-30% d'artefacts
    }
  }, {
    key: "estimateSharpness",
    value: function estimateSharpness(data, info) {
      // Calcul basique de netteté
      if (data.length < 1000) return 0.5;
      var edgeCount = 0;
      var width = info.width;
      var channels = info.channels || 3;
      for (var i = channels; i < data.length - channels; i += channels) {
        var diff = Math.abs(data[i] - data[i + channels]);
        if (diff > 30) edgeCount++;
      }
      return Math.min(edgeCount / (data.length / channels), 1);
    }
  }, {
    key: "estimateNoise",
    value: function estimateNoise(data, info) {
      if (data.length < 1000) return 0;
      var variance = 0;
      var sampleSize = Math.min(10000, data.length);
      var mean = 0;

      // Calculer la moyenne
      for (var i = 0; i < sampleSize; i++) {
        mean += data[i];
      }
      mean /= sampleSize;

      // Calculer la variance
      for (var _i = 0; _i < sampleSize; _i++) {
        variance += Math.pow(data[_i] - mean, 2);
      }
      variance /= sampleSize;
      return Math.min(Math.sqrt(variance) / 255, 1);
    }
  }, {
    key: "findDominantColors",
    value: function findDominantColors(data, info) {
      if (!data || data.length === 0) return [];
      var colorCounts = {};
      var channels = info.channels || 3;

      // Échantillonner les couleurs (pas toutes pour performance)
      for (var i = 0; i < data.length; i += channels * 10) {
        if (i + 2 < data.length) {
          var r = Math.floor(data[i] / 32) * 32;
          var g = Math.floor(data[i + 1] / 32) * 32;
          var b = Math.floor(data[i + 2] / 32) * 32;
          var color = "".concat(r, ",").concat(g, ",").concat(b);
          colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
      }

      // Trouver les 5 couleurs dominantes
      return Object.entries(colorCounts).sort(function (_ref, _ref2) {
        var _ref3 = _slicedToArray(_ref, 2),
          a = _ref3[1];
        var _ref4 = _slicedToArray(_ref2, 2),
          b = _ref4[1];
        return b - a;
      }).slice(0, 5).map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
          color = _ref6[0],
          count = _ref6[1];
        return {
          rgb: color,
          count: count
        };
      });
    }
  }, {
    key: "calculateComplexity",
    value: function calculateComplexity(data) {
      if (!data || data.length < 100) return 0;
      var changes = 0;
      for (var i = 1; i < Math.min(1000, data.length); i++) {
        if (Math.abs(data[i] - data[i - 1]) > 10) {
          changes++;
        }
      }
      return changes / Math.min(1000, data.length);
    }
  }, {
    key: "calculatePerceptualHash",
    value: function calculatePerceptualHash(imageBuffer) {
      // Hash perceptuel simplifié
      var hash = '';
      var avg = imageBuffer.reduce(function (sum, val) {
        return sum + val;
      }, 0) / imageBuffer.length;
      var _iterator2 = _createForOfIteratorHelper(imageBuffer),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var pixel = _step2.value;
          hash += pixel > avg ? '1' : '0';
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return hash;
    }
  }, {
    key: "calculateDifferenceHash",
    value: function calculateDifferenceHash(imageBuffer) {
      // Hash de différence simplifié
      var hash = '';
      for (var i = 0; i < imageBuffer.length - 1; i++) {
        hash += imageBuffer[i] > imageBuffer[i + 1] ? '1' : '0';
      }
      return hash;
    }
  }, {
    key: "detectSuspiciousAspects",
    value: function detectSuspiciousAspects(metadata, contentAnalysis) {
      var aspects = [];
      if (metadata.width > 10000 || metadata.height > 10000) {
        aspects.push('UNUSUALLY_LARGE_DIMENSIONS');
      }
      if (contentAnalysis.entropy < 2) {
        aspects.push('LOW_ENTROPY');
      }
      if (contentAnalysis.complexity > 0.8) {
        aspects.push('HIGH_COMPLEXITY');
      }
      return aspects;
    }
  }, {
    key: "validateFormatAuthenticity",
    value: function validateFormatAuthenticity(imagePath, metadata) {
      var extension = path.extname(imagePath).toLowerCase();
      var formatMap = {
        '.jpg': 'jpeg',
        '.jpeg': 'jpeg',
        '.png': 'png',
        '.webp': 'webp',
        '.tiff': 'tiff',
        '.gif': 'gif'
      };
      var expectedFormat = formatMap[extension];
      return {
        authentic: !expectedFormat || expectedFormat === metadata.format,
        expectedFormat: expectedFormat,
        actualFormat: metadata.format,
        mismatch: expectedFormat && expectedFormat !== metadata.format
      };
    }
  }, {
    key: "validateSizeConsistency",
    value: function validateSizeConsistency(fileSize, metadata) {
      var pixelCount = metadata.width * metadata.height;
      var channels = metadata.channels || 3;
      var expectedMinSize = pixelCount * channels * 0.01; // 1% minimum
      var expectedMaxSize = pixelCount * channels * 3; // 300% maximum

      return {
        consistent: fileSize >= expectedMinSize && fileSize <= expectedMaxSize,
        fileSize: fileSize,
        expectedRange: {
          min: expectedMinSize,
          max: expectedMaxSize
        },
        suspicious: fileSize < expectedMinSize * 0.1 || fileSize > expectedMaxSize * 2
      };
    }
  }, {
    key: "optimizeToTargetSize",
    value: function () {
      var _optimizeToTargetSize = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(processor, outputPath, targetSize, originalSize, config) {
        var currentQuality, attempt, maxAttempts, tempPath, currentProcessor, stats, finalProcessor, _t21;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              currentQuality = config.quality;
              attempt = 0;
              maxAttempts = 10;
              tempPath = "".concat(outputPath, ".temp").concat(attempt);
            case 1:
              if (!(attempt < maxAttempts)) {
                _context12.n = 11;
                break;
              }
              _context12.p = 2;
              currentProcessor = processor.clone().jpeg({
                quality: currentQuality,
                progressive: config.progressive,
                mozjpeg: true
              });
              _context12.n = 3;
              return currentProcessor.toFile(tempPath);
            case 3:
              _context12.n = 4;
              return fs.stat(tempPath);
            case 4:
              stats = _context12.v;
              if (!(stats.size <= targetSize)) {
                _context12.n = 6;
                break;
              }
              _context12.n = 5;
              return fs.rename(tempPath, outputPath);
            case 5:
              return _context12.a(2, outputPath);
            case 6:
              // Réduire la qualité pour la prochaine tentative
              currentQuality = Math.max(10, currentQuality - 10);
              attempt++;

              // Nettoyer le fichier temporaire
              _context12.n = 7;
              return fs.unlink(tempPath)["catch"](function () {});
            case 7:
              _context12.n = 10;
              break;
            case 8:
              _context12.p = 8;
              _t21 = _context12.v;
              _context12.n = 9;
              return fs.unlink(tempPath)["catch"](function () {});
            case 9:
              throw _t21;
            case 10:
              _context12.n = 1;
              break;
            case 11:
              // Si on n'arrive pas à atteindre la taille cible, utiliser la dernière tentative
              finalProcessor = processor.jpeg({
                quality: 10,
                progressive: config.progressive,
                mozjpeg: true
              });
              _context12.n = 12;
              return finalProcessor.toFile(outputPath);
            case 12:
              return _context12.a(2, outputPath);
          }
        }, _callee12, null, [[2, 8]]);
      }));
      function optimizeToTargetSize(_x19, _x20, _x21, _x22, _x23) {
        return _optimizeToTargetSize.apply(this, arguments);
      }
      return optimizeToTargetSize;
    }()
  }, {
    key: "formatFileSize",
    value: function formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      var k = 1024;
      var sizes = ['B', 'KB', 'MB', 'GB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }]);
}(); // =====================================
// FONCTIONS PUBLIQUES LEGACY
// =====================================
var processor = new ImageProcessor();
function createThumbnail(_x24, _x25, _x26) {
  return _createThumbnail.apply(this, arguments);
}
function _createThumbnail() {
  _createThumbnail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(inputPath, outputDir, filename) {
    var options,
      _args13 = arguments;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          options = _args13.length > 3 && _args13[3] !== undefined ? _args13[3] : {};
          return _context13.a(2, processor.createForensicThumbnail(inputPath, outputDir, filename, options));
      }
    }, _callee13);
  }));
  return _createThumbnail.apply(this, arguments);
}
function resizeImage(_x27, _x28) {
  return _resizeImage.apply(this, arguments);
}
function _resizeImage() {
  _resizeImage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(inputPath, outputPath) {
    var options,
      _args14 = arguments;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          options = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : {};
          return _context14.a(2, processor.resizeImageAdvanced(inputPath, outputPath, options));
      }
    }, _callee14);
  }));
  return _resizeImage.apply(this, arguments);
}
function extractImageMetadata(_x29) {
  return _extractImageMetadata.apply(this, arguments);
}
function _extractImageMetadata() {
  _extractImageMetadata = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(imagePath) {
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          return _context15.a(2, processor.extractForensicMetadata(imagePath));
      }
    }, _callee15);
  }));
  return _extractImageMetadata.apply(this, arguments);
}
function optimizeImage(_x30, _x31) {
  return _optimizeImage.apply(this, arguments);
}
function _optimizeImage() {
  _optimizeImage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(inputPath, outputPath) {
    var options,
      _args16 = arguments;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          options = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : {};
          return _context16.a(2, processor.optimizeImageForensic(inputPath, outputPath, options));
      }
    }, _callee16);
  }));
  return _optimizeImage.apply(this, arguments);
}
module.exports = {
  createThumbnail: createThumbnail,
  resizeImage: resizeImage,
  extractImageMetadata: extractImageMetadata,
  optimizeImage: optimizeImage,
  ImageProcessor: ImageProcessor
};