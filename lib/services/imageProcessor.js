"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
// SERVICE TRAITEMENT D'IMAGES FORENSIQUE
// =====================================
var ImageProcessor = /*#__PURE__*/function () {
  function ImageProcessor() {
    _classCallCheck(this, ImageProcessor);
    this.version = '3.0.0-service';
    this.maxFileSize = 100 * 1024 * 1024; // 100MB
    this.supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'gif', 'bmp'];
    console.log("\uD83D\uDCF8 ImageProcessor initialis\xE9 v".concat(this.version));
  }

  /**
   * Création de thumbnail optimisée
   */
  return _createClass(ImageProcessor, [{
    key: "createThumbnail",
    value: (function () {
      var _createThumbnail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(inputPath, outputDir, filename) {
        var options,
          startTime,
          config,
          outputPath,
          processor,
          stats,
          processingTime,
          _args = arguments,
          _t,
          _t2;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              options = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
              startTime = Date.now();
              _context.p = 1;
              config = _objectSpread({
                width: 300,
                height: 300,
                quality: 80,
                format: 'jpeg',
                fit: 'inside',
                withoutEnlargement: true,
                preserveMetadata: false
              }, options); // Assurer que le dossier de sortie existe
              _context.n = 2;
              return fs.mkdir(outputDir, {
                recursive: true
              });
            case 2:
              outputPath = path.join(outputDir, filename);
              console.log("\uD83D\uDCF8 Cr\xE9ation thumbnail: ".concat(path.basename(inputPath), " \u2192 ").concat(filename));

              // Vérifier que le fichier source existe
              _context.n = 3;
              return fs.access(inputPath);
            case 3:
              processor = sharp(inputPath, {
                failOnError: false,
                limitInputPixels: 268402689
              }); // Redimensionnement
              processor = processor.resize(config.width, config.height, {
                fit: config.fit,
                withoutEnlargement: config.withoutEnlargement,
                background: {
                  r: 255,
                  g: 255,
                  b: 255,
                  alpha: 1
                }
              });

              // Application du format de sortie
              _t = config.format.toLowerCase();
              _context.n = _t === 'jpeg' ? 4 : _t === 'jpg' ? 4 : _t === 'png' ? 5 : _t === 'webp' ? 6 : 7;
              break;
            case 4:
              processor = processor.jpeg({
                quality: config.quality,
                progressive: true,
                mozjpeg: true
              });
              return _context.a(3, 8);
            case 5:
              processor = processor.png({
                quality: config.quality,
                compressionLevel: 6
              });
              return _context.a(3, 8);
            case 6:
              processor = processor.webp({
                quality: config.quality
              });
              return _context.a(3, 8);
            case 7:
              processor = processor.jpeg({
                quality: config.quality,
                progressive: true
              });
            case 8:
              // Gestion métadonnées
              if (config.preserveMetadata) {
                processor = processor.withMetadata();
              } else {
                processor = processor.withMetadata({});
              }

              // Traitement avec timeout
              _context.n = 9;
              return this.processWithTimeout(processor, outputPath, 30000);
            case 9:
              _context.n = 10;
              return fs.stat(outputPath);
            case 10:
              stats = _context.v;
              processingTime = Date.now() - startTime;
              console.log("\u2705 Thumbnail cr\xE9\xE9: ".concat(filename, " (").concat(this.formatFileSize(stats.size), ", ").concat(processingTime, "ms)"));
              return _context.a(2, {
                success: true,
                outputPath: outputPath,
                filename: filename,
                size: stats.size,
                processingTime: processingTime
              });
            case 11:
              _context.p = 11;
              _t2 = _context.v;
              console.error("\u274C Erreur cr\xE9ation thumbnail: ".concat(_t2.message));
              throw new Error("\xC9chec cr\xE9ation thumbnail: ".concat(_t2.message));
            case 12:
              return _context.a(2);
          }
        }, _callee, this, [[1, 11]]);
      }));
      function createThumbnail(_x, _x2, _x3) {
        return _createThumbnail.apply(this, arguments);
      }
      return createThumbnail;
    }()
    /**
     * Extraction de métadonnées d'image
     */
    )
  }, {
    key: "extractImageMetadata",
    value: (function () {
      var _extractImageMetadata = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(imagePath) {
        var metadata, stats, colorAnalysis, result, _t3;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              console.log("\uD83D\uDD0D Extraction m\xE9tadonn\xE9es: ".concat(path.basename(imagePath)));

              // Métadonnées Sharp
              _context2.n = 1;
              return sharp(imagePath).metadata();
            case 1:
              metadata = _context2.v;
              _context2.n = 2;
              return fs.stat(imagePath);
            case 2:
              stats = _context2.v;
              _context2.n = 3;
              return this.analyzeColors(imagePath);
            case 3:
              colorAnalysis = _context2.v;
              result = {
                // Informations de base
                filename: path.basename(imagePath),
                filepath: imagePath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                // Propriétés image
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                space: metadata.space,
                channels: metadata.channels,
                depth: metadata.depth,
                density: metadata.density,
                hasAlpha: metadata.hasAlpha,
                hasProfile: metadata.hasProfile,
                isProgressive: metadata.isProgressive,
                orientation: metadata.orientation,
                // Analyse couleur
                colors: colorAnalysis,
                // Calculs dérivés
                aspectRatio: metadata.width / metadata.height,
                megapixels: metadata.width * metadata.height / 1000000,
                // Métadonnées extraction
                extractedAt: new Date().toISOString(),
                extractorVersion: this.version
              };
              console.log("\u2705 M\xE9tadonn\xE9es extraites: ".concat(metadata.width, "x").concat(metadata.height, ", ").concat(metadata.format));
              return _context2.a(2, result);
            case 4:
              _context2.p = 4;
              _t3 = _context2.v;
              console.error("\u274C Erreur extraction m\xE9tadonn\xE9es: ".concat(_t3.message));
              throw new Error("Extraction m\xE9tadonn\xE9es \xE9chou\xE9e: ".concat(_t3.message));
            case 5:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 4]]);
      }));
      function extractImageMetadata(_x4) {
        return _extractImageMetadata.apply(this, arguments);
      }
      return extractImageMetadata;
    }()
    /**
     * Optimisation d'image
     */
    )
  }, {
    key: "optimizeImage",
    value: (function () {
      var _optimizeImage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(inputPath, outputPath) {
        var options,
          startTime,
          config,
          originalStats,
          originalMetadata,
          processor,
          outputFormat,
          optimizedStats,
          reduction,
          processingTime,
          _args3 = arguments,
          _t4,
          _t5;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
              startTime = Date.now();
              _context3.p = 1;
              config = _objectSpread({
                quality: 85,
                progressive: true,
                stripMetadata: false,
                format: null,
                // Auto-detect
                maxWidth: null,
                maxHeight: null
              }, options);
              console.log("\uD83D\uDE80 Optimisation image: ".concat(path.basename(inputPath)));

              // Assurer que le dossier de sortie existe
              _context3.n = 2;
              return fs.mkdir(path.dirname(outputPath), {
                recursive: true
              });
            case 2:
              _context3.n = 3;
              return fs.stat(inputPath);
            case 3:
              originalStats = _context3.v;
              _context3.n = 4;
              return sharp(inputPath).metadata();
            case 4:
              originalMetadata = _context3.v;
              processor = sharp(inputPath, {
                failOnError: false,
                limitInputPixels: 268402689
              }); // Redimensionnement si nécessaire
              if (config.maxWidth || config.maxHeight) {
                processor = processor.resize(config.maxWidth, config.maxHeight, {
                  fit: 'inside',
                  withoutEnlargement: true
                });
              }

              // Gestion métadonnées
              if (config.stripMetadata) {
                processor = processor.withMetadata({});
              } else {
                processor = processor.withMetadata();
              }

              // Format de sortie
              outputFormat = config.format || originalMetadata.format;
              _t4 = outputFormat.toLowerCase();
              _context3.n = _t4 === 'jpeg' ? 5 : _t4 === 'jpg' ? 5 : _t4 === 'png' ? 6 : _t4 === 'webp' ? 7 : 8;
              break;
            case 5:
              processor = processor.jpeg({
                quality: config.quality,
                progressive: config.progressive,
                mozjpeg: true,
                trellisQuantisation: true,
                overshootDeringing: true
              });
              return _context3.a(3, 9);
            case 6:
              processor = processor.png({
                compressionLevel: 9,
                adaptiveFiltering: true
              });
              return _context3.a(3, 9);
            case 7:
              processor = processor.webp({
                quality: config.quality,
                nearLossless: true
              });
              return _context3.a(3, 9);
            case 8:
              processor = processor.jpeg({
                quality: config.quality,
                progressive: config.progressive
              });
            case 9:
              _context3.n = 10;
              return this.processWithTimeout(processor, outputPath, 60000);
            case 10:
              _context3.n = 11;
              return fs.stat(outputPath);
            case 11:
              optimizedStats = _context3.v;
              reduction = (originalStats.size - optimizedStats.size) / originalStats.size * 100;
              processingTime = Date.now() - startTime;
              console.log("\u2705 Image optimis\xE9e: ".concat(this.formatFileSize(optimizedStats.size), " (-").concat(reduction.toFixed(1), "%, ").concat(processingTime, "ms)"));
              return _context3.a(2, {
                success: true,
                inputPath: inputPath,
                outputPath: outputPath,
                original: {
                  size: originalStats.size,
                  width: originalMetadata.width,
                  height: originalMetadata.height
                },
                optimized: {
                  size: optimizedStats.size
                },
                optimization: {
                  sizeReduction: reduction,
                  processingTime: processingTime
                }
              });
            case 12:
              _context3.p = 12;
              _t5 = _context3.v;
              console.error("\u274C Erreur optimisation: ".concat(_t5.message));
              throw new Error("Optimisation \xE9chou\xE9e: ".concat(_t5.message));
            case 13:
              return _context3.a(2);
          }
        }, _callee3, this, [[1, 12]]);
      }));
      function optimizeImage(_x5, _x6) {
        return _optimizeImage.apply(this, arguments);
      }
      return optimizeImage;
    }()
    /**
     * Redimensionnement d'image
     */
    )
  }, {
    key: "resizeImage",
    value: (function () {
      var _resizeImage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(inputPath, outputPath) {
        var options,
          config,
          processor,
          _args4 = arguments,
          _t6,
          _t7;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              options = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : {};
              _context4.p = 1;
              config = _objectSpread({
                width: null,
                height: null,
                fit: 'cover',
                quality: 85,
                format: null
              }, options);
              console.log("\uD83D\uDD04 Redimensionnement: ".concat(path.basename(inputPath)));
              _context4.n = 2;
              return fs.mkdir(path.dirname(outputPath), {
                recursive: true
              });
            case 2:
              processor = sharp(inputPath);
              if (config.width || config.height) {
                processor = processor.resize(config.width, config.height, {
                  fit: config.fit,
                  withoutEnlargement: true
                });
              }

              // Appliquer format si spécifié
              if (!config.format) {
                _context4.n = 6;
                break;
              }
              _t6 = config.format.toLowerCase();
              _context4.n = _t6 === 'jpeg' ? 3 : _t6 === 'jpg' ? 3 : _t6 === 'png' ? 4 : _t6 === 'webp' ? 5 : 6;
              break;
            case 3:
              processor = processor.jpeg({
                quality: config.quality
              });
              return _context4.a(3, 6);
            case 4:
              processor = processor.png();
              return _context4.a(3, 6);
            case 5:
              processor = processor.webp({
                quality: config.quality
              });
              return _context4.a(3, 6);
            case 6:
              _context4.n = 7;
              return processor.toFile(outputPath);
            case 7:
              console.log("\u2705 Image redimensionn\xE9e: ".concat(outputPath));
              return _context4.a(2, {
                success: true,
                outputPath: outputPath
              });
            case 8:
              _context4.p = 8;
              _t7 = _context4.v;
              console.error("\u274C Erreur redimensionnement: ".concat(_t7.message));
              throw _t7;
            case 9:
              return _context4.a(2);
          }
        }, _callee4, null, [[1, 8]]);
      }));
      function resizeImage(_x7, _x8) {
        return _resizeImage.apply(this, arguments);
      }
      return resizeImage;
    }() // =====================================
    // MÉTHODES UTILITAIRES
    // =====================================
    )
  }, {
    key: "analyzeColors",
    value: function () {
      var _analyzeColors = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(imagePath) {
        var _yield$sharp$resize$r, dominant, _t8;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              _context5.n = 1;
              return sharp(imagePath).resize(50, 50).raw().toBuffer({
                resolveWithObject: true
              });
            case 1:
              _yield$sharp$resize$r = _context5.v;
              dominant = _yield$sharp$resize$r.dominant;
              return _context5.a(2, {
                hasColors: true,
                analysis: 'basic_color_analysis'
              });
            case 2:
              _context5.p = 2;
              _t8 = _context5.v;
              return _context5.a(2, {
                hasColors: false,
                error: _t8.message
              });
          }
        }, _callee5, null, [[0, 2]]);
      }));
      function analyzeColors(_x9) {
        return _analyzeColors.apply(this, arguments);
      }
      return analyzeColors;
    }()
  }, {
    key: "processWithTimeout",
    value: function () {
      var _processWithTimeout = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(processor, outputPath, timeoutMs) {
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              return _context6.a(2, new Promise(function (resolve, reject) {
                var timeout = setTimeout(function () {
                  reject(new Error("Timeout processing (".concat(timeoutMs, "ms)")));
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
        }, _callee6);
      }));
      function processWithTimeout(_x0, _x1, _x10) {
        return _processWithTimeout.apply(this, arguments);
      }
      return processWithTimeout;
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
}(); // Export singleton
var imageProcessor = new ImageProcessor();

// Fonctions publiques
function createThumbnail(_x11, _x12, _x13) {
  return _createThumbnail2.apply(this, arguments);
}
function _createThumbnail2() {
  _createThumbnail2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(inputPath, outputDir, filename) {
    var options,
      _args7 = arguments;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          options = _args7.length > 3 && _args7[3] !== undefined ? _args7[3] : {};
          return _context7.a(2, imageProcessor.createThumbnail(inputPath, outputDir, filename, options));
      }
    }, _callee7);
  }));
  return _createThumbnail2.apply(this, arguments);
}
function extractImageMetadata(_x14) {
  return _extractImageMetadata2.apply(this, arguments);
}
function _extractImageMetadata2() {
  _extractImageMetadata2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(imagePath) {
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.n) {
        case 0:
          return _context8.a(2, imageProcessor.extractImageMetadata(imagePath));
      }
    }, _callee8);
  }));
  return _extractImageMetadata2.apply(this, arguments);
}
function optimizeImage(_x15, _x16) {
  return _optimizeImage2.apply(this, arguments);
}
function _optimizeImage2() {
  _optimizeImage2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(inputPath, outputPath) {
    var options,
      _args9 = arguments;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          options = _args9.length > 2 && _args9[2] !== undefined ? _args9[2] : {};
          return _context9.a(2, imageProcessor.optimizeImage(inputPath, outputPath, options));
      }
    }, _callee9);
  }));
  return _optimizeImage2.apply(this, arguments);
}
function resizeImage(_x17, _x18) {
  return _resizeImage2.apply(this, arguments);
}
function _resizeImage2() {
  _resizeImage2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(inputPath, outputPath) {
    var options,
      _args0 = arguments;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          options = _args0.length > 2 && _args0[2] !== undefined ? _args0[2] : {};
          return _context0.a(2, imageProcessor.resizeImage(inputPath, outputPath, options));
      }
    }, _callee0);
  }));
  return _resizeImage2.apply(this, arguments);
}
module.exports = {
  createThumbnail: createThumbnail,
  extractImageMetadata: extractImageMetadata,
  optimizeImage: optimizeImage,
  resizeImage: resizeImage,
  ImageProcessor: ImageProcessor
};