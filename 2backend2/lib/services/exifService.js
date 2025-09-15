"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
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
var fs = require('fs').promises;
var fsSync = require('fs');
var path = require('path');
var crypto = require('crypto');
var sharp = require('sharp');

// =====================================
// SERVICE EXIF FORENSIQUE COMPLET
// =====================================
var ExifForensicService = /*#__PURE__*/function () {
  function ExifForensicService() {
    _classCallCheck(this, ExifForensicService);
    this.exifr = null;
    this.piexifjs = null;
    this.cache = new Map();
    this.maxCacheSize = 1000;
    this.initialized = false;
    this.supportedFormats = ['jpg', 'jpeg', 'tiff', 'tif', 'webp', 'png', 'dng', 'cr2', 'nef', 'arw', 'orf'];
    this.initializeLibraries();
  }
  return _createClass(ExifForensicService, [{
    key: "initializeLibraries",
    value: function () {
      var _initializeLibraries = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              try {
                console.log('📊 Initialisation service EXIF forensique...');

                // Essayer d'importer exifr (recommandé)
                try {
                  this.exifr = require('exifr');
                  console.log('✅ ExifR initialisé');
                } catch (error) {
                  console.warn('⚠️ ExifR non disponible');
                }

                // Essayer d'importer piexifjs (fallback)
                try {
                  this.piexifjs = require('piexifjs');
                  console.log('✅ PiexifJS initialisé');
                } catch (error) {
                  console.warn('⚠️ PiexifJS non disponible');
                }
                this.initialized = true;
                console.log('✅ Service EXIF forensique initialisé');
              } catch (error) {
                console.error('❌ Erreur initialisation EXIF service:', error);
                this.initialized = false;
              }
            case 1:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function initializeLibraries() {
        return _initializeLibraries.apply(this, arguments);
      }
      return initializeLibraries;
    }()
    /**
     * Extraction EXIF complète avec analyse forensique
     */
  }, {
    key: "extractForensicExifData",
    value: (function () {
      var _extractForensicExifData = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(filePath) {
        var options,
          startTime,
          cacheKey,
          stats,
          forensicResult,
          fileBuffer,
          exifrData,
          sharpData,
          piexifData,
          basicData,
          consistencyAnalysis,
          manipulationAnalysis,
          _args2 = arguments,
          _t,
          _t2,
          _t3,
          _t4,
          _t5;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
              startTime = Date.now();
              cacheKey = this.generateCacheKey(filePath);
              _context2.p = 1;
              if (!(this.cache.has(cacheKey) && !options.forceRefresh)) {
                _context2.n = 2;
                break;
              }
              console.log("\uD83D\uDCCA EXIF r\xE9cup\xE9r\xE9 du cache: ".concat(path.basename(filePath)));
              return _context2.a(2, this.cache.get(cacheKey));
            case 2:
              if (fsSync.existsSync(filePath)) {
                _context2.n = 3;
                break;
              }
              throw new Error("Fichier introuvable: ".concat(filePath));
            case 3:
              _context2.n = 4;
              return fs.stat(filePath);
            case 4:
              stats = _context2.v;
              if (!(stats.size === 0)) {
                _context2.n = 5;
                break;
              }
              throw new Error('Fichier vide');
            case 5:
              if (!(stats.size > 500 * 1024 * 1024)) {
                _context2.n = 6;
                break;
              }
              throw new Error('Fichier trop volumineux pour extraction EXIF');
            case 6:
              console.log("\uD83D\uDCCA Extraction EXIF forensique: ".concat(path.basename(filePath), " (").concat(this.formatBytes(stats.size), ")"));

              // Structure de résultat forensique complète
              forensicResult = {
                // Métadonnées de base
                file: {
                  path: filePath,
                  name: path.basename(filePath),
                  size: stats.size,
                  extension: path.extname(filePath).toLowerCase(),
                  created: stats.birthtime,
                  modified: stats.mtime,
                  accessed: stats.atime
                },
                // Données EXIF extraites
                camera: {},
                technical: {},
                timestamps: {},
                gps: {},
                software: {},
                dimensions: {},
                makernotes: {},
                icc: {},
                iptc: {},
                xmp: {},
                // Analyse forensique
                forensicAnalysis: {
                  authenticity: {
                    score: 100,
                    flags: [],
                    confidence: 'high'
                  },
                  consistency: {
                    temporal: true,
                    technical: true,
                    geographic: true
                  },
                  manipulation: {
                    detected: false,
                    indicators: [],
                    confidence: 'low'
                  }
                },
                // Hash et signature
                integrity: {
                  sha256: '',
                  md5: '',
                  signature: '',
                  verified: true
                },
                // Métadonnées extraction
                extractionMetadata: {
                  method: 'unknown',
                  version: '3.0.0-forensic',
                  processingTime: 0,
                  errors: [],
                  warnings: [],
                  extractedAt: new Date().toISOString()
                }
              }; // Calcul hash du fichier
              _context2.n = 7;
              return fs.readFile(filePath);
            case 7:
              fileBuffer = _context2.v;
              forensicResult.integrity.sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
              forensicResult.integrity.md5 = crypto.createHash('md5').update(fileBuffer).digest('hex');

              // 1. Extraction avec ExifR (méthode principale)
              if (!this.exifr) {
                _context2.n = 11;
                break;
              }
              _context2.p = 8;
              _context2.n = 9;
              return this.extractWithExifR(filePath, fileBuffer);
            case 9:
              exifrData = _context2.v;
              this.mergeExifData(forensicResult, exifrData);
              forensicResult.extractionMetadata.method = 'exifr';
              _context2.n = 11;
              break;
            case 10:
              _context2.p = 10;
              _t = _context2.v;
              forensicResult.extractionMetadata.errors.push("ExifR: ".concat(_t.message));
            case 11:
              _context2.p = 11;
              _context2.n = 12;
              return this.extractWithSharp(filePath);
            case 12:
              sharpData = _context2.v;
              this.mergeExifData(forensicResult, sharpData);
              if (!forensicResult.extractionMetadata.method || forensicResult.extractionMetadata.method === 'unknown') {
                forensicResult.extractionMetadata.method = 'sharp';
              }
              _context2.n = 14;
              break;
            case 13:
              _context2.p = 13;
              _t2 = _context2.v;
              forensicResult.extractionMetadata.errors.push("Sharp: ".concat(_t2.message));
            case 14:
              if (!(this.piexifjs && this.isJPEG(filePath))) {
                _context2.n = 18;
                break;
              }
              _context2.p = 15;
              _context2.n = 16;
              return this.extractWithPiexif(fileBuffer);
            case 16:
              piexifData = _context2.v;
              this.mergeExifData(forensicResult, piexifData);
              _context2.n = 18;
              break;
            case 17:
              _context2.p = 17;
              _t3 = _context2.v;
              forensicResult.extractionMetadata.errors.push("Piexif: ".concat(_t3.message));
            case 18:
              _context2.p = 18;
              _context2.n = 19;
              return this.extractBasicFileInfo(filePath, stats);
            case 19:
              basicData = _context2.v;
              this.mergeExifData(forensicResult, basicData);
              _context2.n = 21;
              break;
            case 20:
              _context2.p = 20;
              _t4 = _context2.v;
              forensicResult.extractionMetadata.errors.push("Basic: ".concat(_t4.message));
            case 21:
              _context2.n = 22;
              return this.performForensicAnalysis(forensicResult, fileBuffer);
            case 22:
              forensicResult.forensicAnalysis = _context2.v;
              _context2.n = 23;
              return this.validateConsistency(forensicResult);
            case 23:
              consistencyAnalysis = _context2.v;
              forensicResult.forensicAnalysis.consistency = consistencyAnalysis;

              // 7. Détection de manipulation
              _context2.n = 24;
              return this.detectExifManipulation(forensicResult);
            case 24:
              manipulationAnalysis = _context2.v;
              forensicResult.forensicAnalysis.manipulation = manipulationAnalysis;

              // 8. Calcul score d'authenticité final
              forensicResult.forensicAnalysis.authenticity = this.calculateAuthenticityScore(forensicResult);

              // Finalisation
              forensicResult.extractionMetadata.processingTime = Date.now() - startTime;

              // Cache le résultat
              this.updateCache(cacheKey, forensicResult);
              console.log("\u2705 EXIF forensique extrait: ".concat(path.basename(filePath), " - Score: ").concat(forensicResult.forensicAnalysis.authenticity.score, "% (").concat(forensicResult.extractionMetadata.processingTime, "ms)"));
              return _context2.a(2, forensicResult);
            case 25:
              _context2.p = 25;
              _t5 = _context2.v;
              console.error("\u274C Erreur extraction EXIF forensique ".concat(filePath, ":"), _t5);
              return _context2.a(2, {
                file: {
                  path: filePath,
                  name: path.basename(filePath),
                  error: _t5.message
                },
                forensicAnalysis: {
                  authenticity: {
                    score: 0,
                    confidence: 'error'
                  }
                },
                extractionMetadata: {
                  processingTime: Date.now() - startTime,
                  errors: [_t5.message],
                  extractedAt: new Date().toISOString()
                }
              });
          }
        }, _callee2, this, [[18, 20], [15, 17], [11, 13], [8, 10], [1, 25]]);
      }));
      function extractForensicExifData(_x) {
        return _extractForensicExifData.apply(this, arguments);
      }
      return extractForensicExifData;
    }()
    /**
     * Extraction avec ExifR (méthode principale)
     */
    )
  }, {
    key: "extractWithExifR",
    value: (function () {
      var _extractWithExifR = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(filePath, fileBuffer) {
        var options, rawData, _t6;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              if (this.exifr) {
                _context3.n = 1;
                break;
              }
              throw new Error('ExifR non disponible');
            case 1:
              options = {
                // Sections complètes
                tiff: true,
                exif: true,
                gps: true,
                interop: true,
                makernote: true,
                iptc: true,
                icc: true,
                jfif: true,
                ihdr: true,
                // Comportement
                mergeOutput: false,
                translateKeys: false,
                translateValues: true,
                reviveValues: true,
                sanitize: false,
                // Performance
                chunked: false,
                firstChunkSize: undefined,
                chunkLimit: undefined,
                // Sélection de champs (complet)
                pick: [
                // === APPAREIL PHOTO ===
                'Make', 'Model', 'LensModel', 'LensMake', 'LensSerialNumber', 'SerialNumber', 'InternalSerialNumber', 'CameraSerialNumber', 'BodySerialNumber', 'LensSerialNumber',
                // === PARAMÈTRES TECHNIQUES ===
                'ISO', 'ISOSpeedRatings', 'RecommendedExposureIndex', 'FNumber', 'ApertureValue', 'MaxApertureValue', 'ExposureTime', 'ShutterSpeedValue', 'FocalLength', 'FocalLengthIn35mmFormat', 'DigitalZoomRatio', 'SceneCaptureType', 'ExposureProgram', 'ExposureMode', 'ExposureCompensation', 'MeteringMode', 'LightSource', 'Flash', 'FlashMode', 'WhiteBalance', 'ColorSpace', 'ColorMode', 'Saturation', 'Sharpness', 'Contrast', 'BrightnessValue', 'SubjectDistance', 'SubjectDistanceRange',
                // === TIMESTAMPS ===
                'DateTime', 'DateTimeOriginal', 'DateTimeDigitized', 'CreateDate', 'ModifyDate', 'MetadataDate', 'OffsetTime', 'OffsetTimeOriginal', 'OffsetTimeDigitized', 'TimeZone', 'TimeZoneOffset', 'SubSecTime', 'SubSecTimeOriginal', 'SubSecTimeDigitized',
                // === GPS ===
                'GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSAltitudeRef', 'GPSSpeed', 'GPSSpeedRef', 'GPSImgDirection', 'GPSImgDirectionRef', 'GPSDestBearing', 'GPSDestBearingRef', 'GPSTrack', 'GPSTrackRef', 'GPSDateStamp', 'GPSTimeStamp', 'GPSProcessingMethod', 'GPSVersionID', 'GPSMapDatum', 'GPSAreaInformation', 'GPSDifferential', 'GPSHPositioningError',
                // === SOFTWARE ===
                'Software', 'ProcessingSoftware', 'Creator', 'Artist', 'Copyright', 'ImageDescription', 'UserComment', 'CameraOwnerName', 'OwnerName', 'HostComputer', 'ProcessingVersion', 'ProcessingDate',
                // === DIMENSIONS ET FORMAT ===
                'ImageWidth', 'ImageHeight', 'ImageLength', 'ExifImageWidth', 'ExifImageHeight', 'PixelXDimension', 'PixelYDimension', 'XResolution', 'YResolution', 'ResolutionUnit', 'Orientation', 'Rotation', 'Mirror', 'BitsPerSample', 'SamplesPerPixel', 'PhotometricInterpretation', 'Compression', 'CompressedBitsPerPixel',
                // === QUALITÉ ET COMPRESSION ===
                'Quality', 'CompressionLevel', 'JPEGQuality', 'ThumbnailOffset', 'ThumbnailLength', 'ThumbnailImage', 'PreviewImageStart', 'PreviewImageLength',
                // === MAKERNOTES SPÉCIFIQUES ===
                // Canon
                'CanonModelID', 'CanonFirmwareVersion', 'CanonImageNumber', 'CanonSerialNumber', 'CanonColorSpace', 'CanonWhiteBalance',
                // Nikon
                'NikonColorSpace', 'NikonFlashSetting', 'NikonFocusMode', 'NikonISOSetting', 'NikonQuality', 'NikonWhiteBalance',
                // Sony
                'SonyModelID', 'SonyColorSpace', 'SonyWhiteBalance', 'SonyQuality', 'SonyFlashMode',
                // === IPTC ===
                'Keywords', 'Category', 'SupplementalCategories', 'Caption-Abstract', 'Writer-Editor', 'Headline', 'SpecialInstructions', 'CreationDate', 'CreationTime', 'DigitalCreationDate', 'DigitalCreationTime', 'Byline', 'BylineTitle', 'Credit', 'Source', 'ObjectName', 'City', 'Province-State', 'Country-PrimaryLocationName',
                // === XMP ===
                'Title', 'Description', 'Subject', 'Creator', 'Rights', 'Format', 'Identifier', 'CreatorTool', 'CreateDate', 'ModifyDate', 'MetadataDate', 'DocumentID', 'InstanceID', 'OriginalDocumentID',
                // === SÉCURITÉ ET FORENSIQUE ===
                'SecurityClassification', 'ImageUniqueID', 'CameraID', 'LensID', 'FlashPixVersion', 'ExifVersion', 'FlashpixVersion', 'InteropVersion', 'ComponentsConfiguration', 'MakerNoteVersion']
              };
              _context3.p = 2;
              _context3.n = 3;
              return this.exifr.parse(filePath, options);
            case 3:
              rawData = _context3.v;
              if (rawData) {
                _context3.n = 4;
                break;
              }
              throw new Error('Aucune donnée EXIF trouvée');
            case 4:
              return _context3.a(2, {
                camera: this.extractCameraInfo(rawData),
                technical: this.extractTechnicalInfo(rawData),
                timestamps: this.extractTimestamps(rawData),
                gps: this.extractGPSInfo(rawData),
                software: this.extractSoftwareInfo(rawData),
                dimensions: this.extractDimensions(rawData),
                makernotes: this.extractMakernotes(rawData),
                icc: this.extractICCProfile(rawData),
                iptc: this.extractIPTCInfo(rawData),
                xmp: this.extractXMPInfo(rawData),
                raw: options.includeRaw ? rawData : undefined
              });
            case 5:
              _context3.p = 5;
              _t6 = _context3.v;
              throw new Error("ExifR extraction failed: ".concat(_t6.message));
            case 6:
              return _context3.a(2);
          }
        }, _callee3, this, [[2, 5]]);
      }));
      function extractWithExifR(_x2, _x3) {
        return _extractWithExifR.apply(this, arguments);
      }
      return extractWithExifR;
    }()
    /**
     * Extraction avec Sharp (fallback et complément)
     */
    )
  }, {
    key: "extractWithSharp",
    value: (function () {
      var _extractWithSharp = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(filePath) {
        var metadata, _t7;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              _context4.n = 1;
              return sharp(filePath).metadata();
            case 1:
              metadata = _context4.v;
              return _context4.a(2, {
                dimensions: {
                  width: metadata.width,
                  height: metadata.height,
                  channels: metadata.channels,
                  depth: metadata.depth,
                  format: metadata.format,
                  space: metadata.space,
                  density: metadata.density,
                  hasProfile: metadata.hasProfile,
                  hasAlpha: metadata.hasAlpha,
                  isProgressive: metadata.isProgressive
                },
                technical: {
                  orientation: metadata.orientation,
                  compression: this.getCompressionInfo(metadata),
                  chromaSubsampling: metadata.chromaSubsampling,
                  loop: metadata.loop,
                  delay: metadata.delay,
                  pagePrimary: metadata.pagePrimary
                },
                icc: {
                  profile: metadata.icc ? {
                    description: metadata.icc.description,
                    manufacturer: metadata.icc.manufacturer,
                    model: metadata.icc.model,
                    copyright: metadata.icc.copyright
                  } : null
                }
              });
            case 2:
              _context4.p = 2;
              _t7 = _context4.v;
              throw new Error("Sharp extraction failed: ".concat(_t7.message));
            case 3:
              return _context4.a(2);
          }
        }, _callee4, this, [[0, 2]]);
      }));
      function extractWithSharp(_x4) {
        return _extractWithSharp.apply(this, arguments);
      }
      return extractWithSharp;
    }()
    /**
     * Extraction avec PiexifJS (spécialement pour JPEG)
     */
    )
  }, {
    key: "extractWithPiexif",
    value: (function () {
      var _extractWithPiexif = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(fileBuffer) {
        var dataUrl, exifObj, _t8;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              if (this.piexifjs) {
                _context5.n = 1;
                break;
              }
              throw new Error('PiexifJS non disponible');
            case 1:
              _context5.p = 1;
              dataUrl = "data:image/jpeg;base64,".concat(fileBuffer.toString('base64'));
              exifObj = this.piexifjs.load(dataUrl);
              if (!(!exifObj || Object.keys(exifObj).length === 0)) {
                _context5.n = 2;
                break;
              }
              throw new Error('Aucune donnée EXIF trouvée avec PiexifJS');
            case 2:
              return _context5.a(2, this.convertPiexifData(exifObj));
            case 3:
              _context5.p = 3;
              _t8 = _context5.v;
              throw new Error("PiexifJS extraction failed: ".concat(_t8.message));
            case 4:
              return _context5.a(2);
          }
        }, _callee5, this, [[1, 3]]);
      }));
      function extractWithPiexif(_x5) {
        return _extractWithPiexif.apply(this, arguments);
      }
      return extractWithPiexif;
    }()
    /**
     * Extraction données de base du fichier
     */
    )
  }, {
    key: "extractBasicFileInfo",
    value: (function () {
      var _extractBasicFileInfo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(filePath, stats) {
        var ext, fileBuffer;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              ext = path.extname(filePath).toLowerCase();
              _context6.n = 1;
              return fs.readFile(filePath);
            case 1:
              fileBuffer = _context6.v;
              return _context6.a(2, {
                file: {
                  path: filePath,
                  name: path.basename(filePath),
                  extension: ext,
                  size: stats.size,
                  created: stats.birthtime,
                  modified: stats.mtime,
                  accessed: stats.atime
                },
                technical: {
                  mimeType: this.detectMimeType(ext, fileBuffer),
                  signature: this.detectFileSignature(fileBuffer),
                  encoding: this.detectEncoding(fileBuffer)
                },
                integrity: {
                  sha256: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
                  md5: crypto.createHash('md5').update(fileBuffer).digest('hex')
                }
              });
          }
        }, _callee6, this);
      }));
      function extractBasicFileInfo(_x6, _x7) {
        return _extractBasicFileInfo.apply(this, arguments);
      }
      return extractBasicFileInfo;
    }() // =====================================
    // MÉTHODES D'EXTRACTION SPÉCIALISÉES
    // =====================================
    )
  }, {
    key: "extractCameraInfo",
    value: function extractCameraInfo(rawData) {
      return {
        make: rawData.Make || null,
        model: rawData.Model || null,
        lens: {
          model: rawData.LensModel || rawData.LensMake || null,
          make: rawData.LensMake || null,
          serialNumber: rawData.LensSerialNumber || null,
          focalLength: rawData.FocalLength || null,
          focalLength35mm: rawData.FocalLengthIn35mmFormat || null,
          maxAperture: rawData.MaxApertureValue || null
        },
        serialNumber: rawData.SerialNumber || rawData.InternalSerialNumber || rawData.CameraSerialNumber || rawData.BodySerialNumber || null,
        firmware: rawData.FirmwareVersion || rawData.CanonFirmwareVersion || null,
        ownerName: rawData.CameraOwnerName || rawData.OwnerName || rawData.Artist || null,
        modelID: rawData.CanonModelID || rawData.NikonModelID || rawData.SonyModelID || null
      };
    }
  }, {
    key: "extractTechnicalInfo",
    value: function extractTechnicalInfo(rawData) {
      return {
        // Exposition
        iso: rawData.ISO || rawData.ISOSpeedRatings || rawData.RecommendedExposureIndex || null,
        aperture: rawData.FNumber || rawData.ApertureValue || null,
        shutterSpeed: rawData.ExposureTime || rawData.ShutterSpeedValue || null,
        exposureCompensation: rawData.ExposureCompensation || null,
        exposureProgram: this.translateExposureProgram(rawData.ExposureProgram),
        exposureMode: this.translateExposureMode(rawData.ExposureMode),
        meteringMode: this.translateMeteringMode(rawData.MeteringMode),
        // Flash
        flash: {
          fired: rawData.Flash ? this.parseFlashValue(rawData.Flash) : null,
          mode: rawData.FlashMode || null,
          compensation: rawData.FlashCompensation || null,
          redEyeReduction: rawData.Flash ? this.hasRedEyeReduction(rawData.Flash) : null
        },
        // Mise au point
        focusMode: rawData.FocusMode || rawData.AFMode || null,
        subjectDistance: rawData.SubjectDistance || null,
        subjectDistanceRange: rawData.SubjectDistanceRange || null,
        // Couleur et qualité
        whiteBalance: this.translateWhiteBalance(rawData.WhiteBalance),
        colorSpace: this.translateColorSpace(rawData.ColorSpace),
        colorMode: rawData.ColorMode || null,
        saturation: rawData.Saturation || null,
        contrast: rawData.Contrast || null,
        sharpness: rawData.Sharpness || null,
        brightness: rawData.BrightnessValue || null,
        // Zoom et format
        digitalZoom: rawData.DigitalZoomRatio || null,
        sceneMode: rawData.SceneCaptureType || rawData.SceneMode || null,
        imageStabilization: rawData.ImageStabilization || rawData.VR || null,
        // Qualité
        quality: rawData.Quality || rawData.JPEGQuality || null,
        compression: rawData.Compression || null,
        compressedBitsPerPixel: rawData.CompressedBitsPerPixel || null
      };
    }
  }, {
    key: "extractTimestamps",
    value: function extractTimestamps(rawData) {
      return {
        dateTimeOriginal: this.parseDateTime(rawData.DateTimeOriginal, rawData.SubSecTimeOriginal),
        createDate: this.parseDateTime(rawData.CreateDate || rawData.DateTime, rawData.SubSecTime),
        modifyDate: this.parseDateTime(rawData.ModifyDate, rawData.SubSecTime),
        digitizedDate: this.parseDateTime(rawData.DateTimeDigitized, rawData.SubSecTimeDigitized),
        metadataDate: this.parseDateTime(rawData.MetadataDate),
        // Fuseaux horaires
        offsetTime: rawData.OffsetTime || null,
        offsetTimeOriginal: rawData.OffsetTimeOriginal || null,
        offsetTimeDigitized: rawData.OffsetTimeDigitized || null,
        timeZone: rawData.TimeZone || null,
        // Sous-secondes
        subSecTime: rawData.SubSecTime || null,
        subSecTimeOriginal: rawData.SubSecTimeOriginal || null,
        subSecTimeDigitized: rawData.SubSecTimeDigitized || null
      };
    }
  }, {
    key: "extractGPSInfo",
    value: function extractGPSInfo(rawData) {
      var gps = {
        latitude: rawData.GPSLatitude || null,
        longitude: rawData.GPSLongitude || null,
        altitude: rawData.GPSAltitude || null,
        altitudeRef: rawData.GPSAltitudeRef || null,
        // Direction et mouvement
        direction: rawData.GPSImgDirection || null,
        directionRef: rawData.GPSImgDirectionRef || null,
        speed: rawData.GPSSpeed || null,
        speedRef: rawData.GPSSpeedRef || null,
        track: rawData.GPSTrack || null,
        trackRef: rawData.GPSTrackRef || null,
        // Destination
        destBearing: rawData.GPSDestBearing || null,
        destBearingRef: rawData.GPSDestBearingRef || null,
        // Timestamp GPS
        dateStamp: rawData.GPSDateStamp || null,
        timeStamp: rawData.GPSTimeStamp || null,
        timestamp: this.parseGPSTimestamp(rawData.GPSDateStamp, rawData.GPSTimeStamp),
        // Métadonnées GPS
        processingMethod: rawData.GPSProcessingMethod || null,
        versionID: rawData.GPSVersionID || null,
        mapDatum: rawData.GPSMapDatum || null,
        areaInformation: rawData.GPSAreaInformation || null,
        differential: rawData.GPSDifferential || null,
        hPositioningError: rawData.GPSHPositioningError || null
      };

      // Calculer coordonnées si disponibles
      if (gps.latitude !== null && gps.longitude !== null) {
        gps.coordinates = {
          decimal: {
            latitude: gps.latitude,
            longitude: gps.longitude
          },
          dms: {
            latitude: this.decimalToDMS(gps.latitude, 'lat'),
            longitude: this.decimalToDMS(gps.longitude, 'lng')
          }
        };
      }
      return gps;
    }
  }, {
    key: "extractSoftwareInfo",
    value: function extractSoftwareInfo(rawData) {
      return {
        creator: rawData.Software || rawData.CreatorTool || rawData.Creator || null,
        processingHistory: this.extractProcessingHistory(rawData),
        hostComputer: rawData.HostComputer || null,
        processingVersion: rawData.ProcessingVersion || null,
        processingDate: rawData.ProcessingDate || null,
        // Copyright et droits
        copyright: rawData.Copyright || rawData.Rights || null,
        artist: rawData.Artist || rawData.Creator || null,
        description: rawData.ImageDescription || rawData.Description || null,
        userComment: rawData.UserComment || null,
        // Versions
        exifVersion: rawData.ExifVersion || null,
        flashpixVersion: rawData.FlashpixVersion || null,
        interopVersion: rawData.InteropVersion || null,
        // Identification unique
        documentID: rawData.DocumentID || null,
        instanceID: rawData.InstanceID || null,
        originalDocumentID: rawData.OriginalDocumentID || null,
        imageUniqueID: rawData.ImageUniqueID || null
      };
    }
  }, {
    key: "extractDimensions",
    value: function extractDimensions(rawData) {
      return {
        // Dimensions principales
        width: rawData.ImageWidth || rawData.ExifImageWidth || rawData.PixelXDimension || null,
        height: rawData.ImageHeight || rawData.ImageLength || rawData.ExifImageHeight || rawData.PixelYDimension || null,
        // Résolution
        xResolution: rawData.XResolution || null,
        yResolution: rawData.YResolution || null,
        resolutionUnit: this.translateResolutionUnit(rawData.ResolutionUnit),
        // Orientation et rotation
        orientation: rawData.Orientation || null,
        rotation: rawData.Rotation || null,
        mirror: rawData.Mirror || null,
        // Caractéristiques pixel
        bitsPerSample: rawData.BitsPerSample || null,
        samplesPerPixel: rawData.SamplesPerPixel || null,
        photometricInterpretation: rawData.PhotometricInterpretation || null,
        // Thumbnails et previews
        thumbnailOffset: rawData.ThumbnailOffset || null,
        thumbnailLength: rawData.ThumbnailLength || null,
        previewImageStart: rawData.PreviewImageStart || null,
        previewImageLength: rawData.PreviewImageLength || null
      };
    }
  }, {
    key: "extractMakernotes",
    value: function extractMakernotes(rawData) {
      var makernotes = {
        manufacturer: rawData.Make ? rawData.Make.toLowerCase() : null,
        data: {}
      };

      // Canon makernotes
      if (makernotes.manufacturer && makernotes.manufacturer.includes('canon')) {
        makernotes.data.canon = {
          modelID: rawData.CanonModelID,
          imageNumber: rawData.CanonImageNumber,
          serialNumber: rawData.CanonSerialNumber,
          firmwareVersion: rawData.CanonFirmwareVersion,
          colorSpace: rawData.CanonColorSpace,
          whiteBalance: rawData.CanonWhiteBalance
        };
      }

      // Nikon makernotes
      if (makernotes.manufacturer && makernotes.manufacturer.includes('nikon')) {
        makernotes.data.nikon = {
          colorSpace: rawData.NikonColorSpace,
          flashSetting: rawData.NikonFlashSetting,
          focusMode: rawData.NikonFocusMode,
          isoSetting: rawData.NikonISOSetting,
          quality: rawData.NikonQuality,
          whiteBalance: rawData.NikonWhiteBalance
        };
      }

      // Sony makernotes
      if (makernotes.manufacturer && makernotes.manufacturer.includes('sony')) {
        makernotes.data.sony = {
          modelID: rawData.SonyModelID,
          colorSpace: rawData.SonyColorSpace,
          whiteBalance: rawData.SonyWhiteBalance,
          quality: rawData.SonyQuality,
          flashMode: rawData.SonyFlashMode
        };
      }
      return makernotes;
    }
  }, {
    key: "extractICCProfile",
    value: function extractICCProfile(rawData) {
      return {
        description: rawData.ProfileDescription || null,
        manufacturer: rawData.ProfileManufacturer || null,
        model: rawData.ProfileModel || null,
        copyright: rawData.ProfileCopyright || null,
        colorSpace: rawData.ColorSpace || null,
        connectionSpace: rawData.ConnectionSpace || null,
        deviceClass: rawData.DeviceClass || null,
        renderingIntent: rawData.RenderingIntent || null
      };
    }
  }, {
    key: "extractIPTCInfo",
    value: function extractIPTCInfo(rawData) {
      return {
        // Identification
        headline: rawData.Headline || rawData.ObjectName || null,
        caption: rawData['Caption-Abstract'] || rawData.Description || null,
        keywords: rawData.Keywords || null,
        category: rawData.Category || null,
        supplementalCategories: rawData.SupplementalCategories || null,
        // Personnes
        byline: rawData.Byline || rawData.Creator || null,
        bylineTitle: rawData.BylineTitle || null,
        credit: rawData.Credit || null,
        source: rawData.Source || null,
        // Dates IPTC
        creationDate: rawData.CreationDate || null,
        creationTime: rawData.CreationTime || null,
        digitalCreationDate: rawData.DigitalCreationDate || null,
        digitalCreationTime: rawData.DigitalCreationTime || null,
        // Localisation
        city: rawData.City || null,
        provinceState: rawData['Province-State'] || null,
        countryName: rawData['Country-PrimaryLocationName'] || null,
        // Instructions
        specialInstructions: rawData.SpecialInstructions || null,
        writerEditor: rawData['Writer-Editor'] || null
      };
    }
  }, {
    key: "extractXMPInfo",
    value: function extractXMPInfo(rawData) {
      return {
        // Dublin Core
        title: rawData.Title || null,
        description: rawData.Description || null,
        subject: rawData.Subject || null,
        creator: rawData.Creator || null,
        rights: rawData.Rights || null,
        format: rawData.Format || null,
        identifier: rawData.Identifier || null,
        // Dates XMP
        createDate: rawData.CreateDate || null,
        modifyDate: rawData.ModifyDate || null,
        metadataDate: rawData.MetadataDate || null,
        // Outils
        creatorTool: rawData.CreatorTool || null,
        // Identification
        documentID: rawData.DocumentID || null,
        instanceID: rawData.InstanceID || null,
        originalDocumentID: rawData.OriginalDocumentID || null
      };
    }

    // =====================================
    // ANALYSE FORENSIQUE
    // =====================================
  }, {
    key: "performForensicAnalysis",
    value: function () {
      var _performForensicAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(forensicResult, fileBuffer) {
        var analysis, temporalAnalysis, _analysis$authenticit, technicalAnalysis, _analysis$authenticit2, geographicAnalysis, _analysis$authenticit3, manipulationSigns, _analysis$authenticit4, doubleProcessing, _analysis$manipulatio, metadataAnomalies, _analysis$authenticit5, _t9;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              analysis = {
                authenticity: {
                  score: 100,
                  flags: [],
                  confidence: 'high'
                },
                consistency: {
                  temporal: true,
                  technical: true,
                  geographic: true,
                  details: {}
                },
                manipulation: {
                  detected: false,
                  indicators: [],
                  confidence: 'low',
                  types: []
                }
              }; // Analyse cohérence temporelle
              temporalAnalysis = this.analyzeTemporalConsistency(forensicResult.timestamps);
              analysis.consistency.temporal = temporalAnalysis.consistent;
              analysis.consistency.details.temporal = temporalAnalysis;
              if (!temporalAnalysis.consistent) {
                analysis.authenticity.score -= 20;
                (_analysis$authenticit = analysis.authenticity.flags).push.apply(_analysis$authenticit, _toConsumableArray(temporalAnalysis.anomalies));
              }

              // Analyse cohérence technique
              technicalAnalysis = this.analyzeTechnicalConsistency(forensicResult.technical, forensicResult.camera);
              analysis.consistency.technical = technicalAnalysis.consistent;
              analysis.consistency.details.technical = technicalAnalysis;
              if (!technicalAnalysis.consistent) {
                analysis.authenticity.score -= 15;
                (_analysis$authenticit2 = analysis.authenticity.flags).push.apply(_analysis$authenticit2, _toConsumableArray(technicalAnalysis.anomalies));
              }

              // Analyse cohérence géographique
              geographicAnalysis = this.analyzeGeographicConsistency(forensicResult.gps, forensicResult.timestamps);
              analysis.consistency.geographic = geographicAnalysis.consistent;
              analysis.consistency.details.geographic = geographicAnalysis;
              if (!geographicAnalysis.consistent) {
                analysis.authenticity.score -= 10;
                (_analysis$authenticit3 = analysis.authenticity.flags).push.apply(_analysis$authenticit3, _toConsumableArray(geographicAnalysis.anomalies));
              }

              // Détection signatures de manipulation
              manipulationSigns = this.detectManipulationSignatures(forensicResult);
              if (manipulationSigns.detected) {
                analysis.manipulation.detected = true;
                analysis.manipulation.indicators = manipulationSigns.signatures;
                analysis.manipulation.types = manipulationSigns.types;
                analysis.manipulation.confidence = manipulationSigns.confidence;
                analysis.authenticity.score -= 30;
                (_analysis$authenticit4 = analysis.authenticity.flags).push.apply(_analysis$authenticit4, _toConsumableArray(manipulationSigns.signatures));
              }

              // Détection de double enregistrement/modification
              doubleProcessing = this.detectDoubleProcessing(forensicResult);
              if (doubleProcessing.detected) {
                analysis.manipulation.detected = true;
                (_analysis$manipulatio = analysis.manipulation.indicators).push.apply(_analysis$manipulatio, _toConsumableArray(doubleProcessing.indicators));
                analysis.authenticity.score -= 25;
              }

              // Analyse anomalies de métadonnées
              metadataAnomalies = this.detectMetadataAnomalies(forensicResult);
              if (metadataAnomalies.length > 0) {
                analysis.authenticity.score -= metadataAnomalies.length * 5;
                (_analysis$authenticit5 = analysis.authenticity.flags).push.apply(_analysis$authenticit5, _toConsumableArray(metadataAnomalies));
              }
              analysis.authenticity.score = Math.max(0, analysis.authenticity.score);
              analysis.authenticity.confidence = this.calculateAnalysisConfidence(analysis);
              return _context7.a(2, analysis);
            case 1:
              _context7.p = 1;
              _t9 = _context7.v;
              console.error('Erreur analyse forensique EXIF:', _t9);
              return _context7.a(2, {
                authenticity: {
                  score: 0,
                  confidence: 'error',
                  flags: ['FORENSIC_ANALYSIS_ERROR']
                },
                error: _t9.message
              });
          }
        }, _callee7, this, [[0, 1]]);
      }));
      function performForensicAnalysis(_x8, _x9) {
        return _performForensicAnalysis.apply(this, arguments);
      }
      return performForensicAnalysis;
    }()
  }, {
    key: "analyzeTemporalConsistency",
    value: function analyzeTemporalConsistency(timestamps) {
      var anomalies = [];
      var consistent = true;
      if (!timestamps) {
        return {
          consistent: false,
          anomalies: ['NO_TIMESTAMP_DATA']
        };
      }

      // Vérifier cohérence entre timestamps
      if (timestamps.dateTimeOriginal && timestamps.createDate) {
        var original = new Date(timestamps.dateTimeOriginal);
        var create = new Date(timestamps.createDate);
        var diff = Math.abs(original - create);
        if (diff > 300000) {
          // Plus de 5 minutes
          anomalies.push('TIMESTAMP_LARGE_DIFFERENCE');
          consistent = false;
        }
      }

      // Vérifier timestamps dans le futur
      var now = new Date();
      var futureThreshold = 24 * 60 * 60 * 1000; // 24 heures de tolérance

      Object.entries(timestamps).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          timestamp = _ref2[1];
        if (timestamp && typeof timestamp === 'string') {
          try {
            var date = new Date(timestamp);
            if (date > now && date - now > futureThreshold) {
              anomalies.push("FUTURE_TIMESTAMP_".concat(key.toUpperCase()));
              consistent = false;
            }
          } catch (e) {
            anomalies.push("INVALID_TIMESTAMP_".concat(key.toUpperCase()));
            consistent = false;
          }
        }
      });

      // Vérifier ordre logique des timestamps
      if (timestamps.dateTimeOriginal && timestamps.modifyDate) {
        var _original = new Date(timestamps.dateTimeOriginal);
        var modified = new Date(timestamps.modifyDate);
        if (modified < _original) {
          anomalies.push('MODIFY_DATE_BEFORE_ORIGINAL');
          consistent = false;
        }
      }

      // Vérifier cohérence fuseaux horaires
      if (timestamps.offsetTime && timestamps.offsetTimeOriginal) {
        if (timestamps.offsetTime !== timestamps.offsetTimeOriginal) {
          // Peut être normal mais suspect si grande différence
          var offsetDiff = this.parseTimezoneOffset(timestamps.offsetTime) - this.parseTimezoneOffset(timestamps.offsetTimeOriginal);
          if (Math.abs(offsetDiff) > 12) {
            // Plus de 12 heures de différence
            anomalies.push('LARGE_TIMEZONE_DIFFERENCE');
            consistent = false;
          }
        }
      }
      return {
        consistent: consistent,
        anomalies: anomalies,
        analysis: 'temporal_consistency_check'
      };
    }
  }, {
    key: "analyzeTechnicalConsistency",
    value: function analyzeTechnicalConsistency(technical, camera) {
      var anomalies = [];
      var consistent = true;
      if (!technical) {
        return {
          consistent: false,
          anomalies: ['NO_TECHNICAL_DATA']
        };
      }

      // Vérifier cohérence exposition
      if (technical.iso && technical.aperture && technical.shutterSpeed) {
        // Règles basiques de cohérence d'exposition
        var iso = parseFloat(technical.iso);
        var aperture = parseFloat(technical.aperture);
        var shutterSpeed = this.parseShutterSpeed(technical.shutterSpeed);
        if (iso && aperture && shutterSpeed) {
          // ISO impossible
          if (iso < 25 || iso > 409600) {
            anomalies.push('IMPOSSIBLE_ISO_VALUE');
            consistent = false;
          }

          // Ouverture impossible
          if (aperture < 0.5 || aperture > 64) {
            anomalies.push('IMPOSSIBLE_APERTURE_VALUE');
            consistent = false;
          }

          // Vitesse impossible
          if (shutterSpeed > 30 || shutterSpeed < 0.000001) {
            anomalies.push('IMPOSSIBLE_SHUTTER_SPEED');
            consistent = false;
          }
        }
      }

      // Vérifier cohérence appareil/objectif
      if (camera && camera.make && camera.lens && camera.lens.make) {
        var cameraMake = camera.make.toLowerCase();
        var lensMake = camera.lens.make.toLowerCase();

        // Vérifier compatibilité basique marque/objectif
        var incompatibleCombinations = [['canon', 'nikon'], ['nikon', 'canon'], ['sony', 'canon'], ['canon', 'sony']];
        for (var _i = 0, _incompatibleCombinat = incompatibleCombinations; _i < _incompatibleCombinat.length; _i++) {
          var _incompatibleCombinat2 = _slicedToArray(_incompatibleCombinat[_i], 2),
            camMake = _incompatibleCombinat2[0],
            lensMake2 = _incompatibleCombinat2[1];
          if (cameraMake.includes(camMake) && lensMake.includes(lensMake2)) {
            anomalies.push('INCOMPATIBLE_CAMERA_LENS');
            consistent = false;
            break;
          }
        }
      }

      // Vérifier cohérence colorimétrique
      if (technical.whiteBalance && technical.colorSpace) {
        // Certaines combinaisons sont suspectes
        if (technical.colorSpace === 'uncalibrated' && technical.whiteBalance === 'auto') {
          anomalies.push('SUSPICIOUS_COLOR_COMBINATION');
          consistent = false;
        }
      }

      // Vérifier valeurs flash
      if (technical.flash && technical.flash.fired !== undefined) {
        var flashFired = technical.flash.fired;
        var flashMode = technical.flash.mode;

        // Flash tiré mais mode désactivé
        if (flashFired && flashMode && flashMode.toLowerCase().includes('off')) {
          anomalies.push('FLASH_INCONSISTENCY');
          consistent = false;
        }
      }
      return {
        consistent: consistent,
        anomalies: anomalies,
        analysis: 'technical_consistency_check'
      };
    }
  }, {
    key: "analyzeGeographicConsistency",
    value: function analyzeGeographicConsistency(gps, timestamps) {
      var anomalies = [];
      var consistent = true;
      if (!gps || !gps.latitude && !gps.longitude) {
        return {
          consistent: true,
          anomalies: [],
          analysis: 'no_gps_data'
        };
      }

      // Vérifier coordonnées valides
      if (gps.latitude !== null && Math.abs(gps.latitude) > 90) {
        anomalies.push('INVALID_GPS_LATITUDE');
        consistent = false;
      }
      if (gps.longitude !== null && Math.abs(gps.longitude) > 180) {
        anomalies.push('INVALID_GPS_LONGITUDE');
        consistent = false;
      }

      // Vérifier altitude réaliste
      if (gps.altitude !== null) {
        if (gps.altitude < -500 || gps.altitude > 10000) {
          anomalies.push('UNUSUAL_GPS_ALTITUDE');
          consistent = false;
        }
      }

      // Vérifier cohérence timestamp GPS avec timestamp image
      if (gps.timestamp && timestamps && timestamps.dateTimeOriginal) {
        var gpsTime = new Date(gps.timestamp);
        var imageTime = new Date(timestamps.dateTimeOriginal);
        var timeDiff = Math.abs(gpsTime - imageTime);

        // Plus de 1 heure de différence
        if (timeDiff > 3600000) {
          anomalies.push('GPS_IMAGE_TIME_MISMATCH');
          consistent = false;
        }
      }

      // Vérifier précision suspecte (coordonnées trop rondes)
      if (gps.latitude !== null && gps.longitude !== null) {
        var latStr = gps.latitude.toString();
        var lngStr = gps.longitude.toString();

        // Coordonnées exactement rondes (très suspect)
        if (gps.latitude % 1 === 0 && gps.longitude % 1 === 0) {
          anomalies.push('SUSPICIOUS_ROUND_COORDINATES');
          consistent = false;
        }

        // Trop de précision (plus de 8 décimales = suspect)
        if (this.countDecimalPlaces(gps.latitude) > 8 || this.countDecimalPlaces(gps.longitude) > 8) {
          anomalies.push('EXCESSIVE_GPS_PRECISION');
          consistent = false;
        }
      }

      // Vérifier cohérence vitesse
      if (gps.speed !== null && gps.speed > 500) {
        // Plus de 500 km/h
        anomalies.push('IMPOSSIBLE_GPS_SPEED');
        consistent = false;
      }
      return {
        consistent: consistent,
        anomalies: anomalies,
        analysis: 'geographic_consistency_check'
      };
    }
  }, {
    key: "detectManipulationSignatures",
    value: function detectManipulationSignatures(forensicResult) {
      var signatures = [];
      var types = [];
      var detected = false;
      var confidence = 'low';

      // Logiciels de manipulation suspects
      var suspiciousSoftware = ['photoshop', 'gimp', 'paint.net', 'facetune', 'snapseed', 'lightroom', 'capture one', 'luminar', 'skylum', 'affinity photo', 'pixelmator', 'canva', 'picasa', 'photoscape', 'fotor'];
      if (forensicResult.software && forensicResult.software.creator) {
        var software = forensicResult.software.creator.toLowerCase();
        var _iterator = _createForOfIteratorHelper(suspiciousSoftware),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var suspect = _step.value;
            if (software.includes(suspect)) {
              signatures.push("MANIPULATION_SOFTWARE_".concat(suspect.toUpperCase().replace(/\s+/g, '_')));
              types.push('software_editing');
              detected = true;
              confidence = 'medium';
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      // Historique de traitement suspect
      if (forensicResult.software && forensicResult.software.processingHistory) {
        var history = forensicResult.software.processingHistory;
        if (Array.isArray(history) && history.length > 3) {
          signatures.push('MULTIPLE_PROCESSING_STEPS');
          types.push('complex_editing');
          detected = true;
        }
      }

      // Absence de métadonnées critiques
      var criticalMissing = [];
      if (!forensicResult.camera.make) criticalMissing.push('camera_make');
      if (!forensicResult.timestamps.dateTimeOriginal) criticalMissing.push('timestamp_original');
      if (!forensicResult.technical.iso && !forensicResult.technical.aperture) criticalMissing.push('exposure_data');
      if (criticalMissing.length >= 2) {
        signatures.push('CRITICAL_METADATA_MISSING');
        types.push('metadata_stripping');
        detected = true;
        confidence = 'high';
      }

      // Incohérences de version EXIF
      if (forensicResult.software) {
        var exifVersion = forensicResult.software.exifVersion;
        var flashpixVersion = forensicResult.software.flashpixVersion;

        // Versions EXIF anachroniques
        if (exifVersion && this.isAnachronisticExifVersion(exifVersion, forensicResult.timestamps.dateTimeOriginal)) {
          signatures.push('ANACHRONISTIC_EXIF_VERSION');
          types.push('version_mismatch');
          detected = true;
        }
      }

      // Signatures de générateurs d'IA
      var aiSignatures = ['stable diffusion', 'dall-e', 'midjourney', 'firefly', 'leonardo', 'runway ml', 'artbreeder', 'deepart', 'dreamstudio'];
      if (forensicResult.software && forensicResult.software.creator) {
        var creator = forensicResult.software.creator.toLowerCase();
        var _iterator2 = _createForOfIteratorHelper(aiSignatures),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var aiSig = _step2.value;
            if (creator.includes(aiSig)) {
              signatures.push("AI_GENERATED_".concat(aiSig.toUpperCase().replace(/\s+/g, '_')));
              types.push('ai_generation');
              detected = true;
              confidence = 'very_high';
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      // Patterns de noms de fichiers suspects
      if (forensicResult.file && forensicResult.file.name) {
        var filename = forensicResult.file.name.toLowerCase();
        var suspiciousPatterns = [/screenshot/i, /untitled/i, /download/i, /^image\d+$/i, /^img\d+$/i, /temp/i, /test/i, /generated/i, /synthetic/i, /fake/i, /edited/i, /modified/i];
        for (var _i2 = 0, _suspiciousPatterns = suspiciousPatterns; _i2 < _suspiciousPatterns.length; _i2++) {
          var pattern = _suspiciousPatterns[_i2];
          if (pattern.test(filename)) {
            signatures.push('SUSPICIOUS_FILENAME_PATTERN');
            types.push('suspicious_naming');
            detected = true;
            break;
          }
        }
      }
      return {
        detected: detected,
        signatures: signatures,
        types: _toConsumableArray(new Set(types)),
        // Remove duplicates
        confidence: confidence
      };
    }
  }, {
    key: "detectDoubleProcessing",
    value: function detectDoubleProcessing(forensicResult) {
      var indicators = [];
      var detected = false;

      // Double compression JPEG (patterns dans metadata)
      if (forensicResult.technical && forensicResult.technical.quality) {
        // Patterns typiques de double compression
        var quality = parseInt(forensicResult.technical.quality);
        if (quality && (quality === 85 || quality === 95)) {
          // Ces valeurs sont souvent utilisées par défaut lors de recompression
          indicators.push('TYPICAL_RECOMPRESSION_QUALITY');
          detected = true;
        }
      }

      // Timestamps multiples de modification
      if (forensicResult.timestamps) {
        var modifyCount = Object.keys(forensicResult.timestamps).filter(function (key) {
          return key.includes('modify') || key.includes('digitized');
        }).length;
        if (modifyCount > 2) {
          indicators.push('MULTIPLE_MODIFICATION_TIMESTAMPS');
          detected = true;
        }
      }

      // Présence de métadonnées de logiciels multiples
      if (forensicResult.software && forensicResult.software.processingHistory) {
        if (forensicResult.software.processingHistory.length > 1) {
          indicators.push('MULTIPLE_SOFTWARE_PROCESSING');
          detected = true;
        }
      }
      return {
        detected: detected,
        indicators: indicators
      };
    }
  }, {
    key: "detectMetadataAnomalies",
    value: function detectMetadataAnomalies(forensicResult) {
      var anomalies = [];

      // Métadonnées trop parfaites
      if (forensicResult.gps && forensicResult.gps.latitude && forensicResult.gps.longitude) {
        var lat = forensicResult.gps.latitude;
        var lng = forensicResult.gps.longitude;

        // Coordonnées exactement sur des lignes de grille
        if (lat % 0.01 === 0 && lng % 0.01 === 0) {
          anomalies.push('GRID_ALIGNED_GPS');
        }
      }

      // Paramètres techniques trop parfaits
      if (forensicResult.technical) {
        var tech = forensicResult.technical;

        // ISO exactement puissance de 2
        if (tech.iso && this.isPowerOfTwo(tech.iso) && tech.iso > 100) {
          anomalies.push('PERFECT_POWER_OF_TWO_ISO');
        }

        // Vitesse d'obturation exactement fractionnaire
        if (tech.shutterSpeed && typeof tech.shutterSpeed === 'string') {
          if (/^1\/\d+$/.test(tech.shutterSpeed)) {
            var denominator = parseInt(tech.shutterSpeed.split('/')[1]);
            if (this.isPowerOfTwo(denominator)) {
              anomalies.push('PERFECT_FRACTIONAL_SHUTTER');
            }
          }
        }
      }

      // Absence de bruit dans les métadonnées
      if (forensicResult.extractionMetadata && forensicResult.extractionMetadata.errors.length === 0) {
        // C'est suspect si aucune erreur d'extraction
        if (Object.keys(forensicResult.camera).length === 0 && Object.keys(forensicResult.technical).length === 0) {
          anomalies.push('SUSPICIOUSLY_CLEAN_EXTRACTION');
        }
      }
      return anomalies;
    }
  }, {
    key: "calculateAnalysisConfidence",
    value: function calculateAnalysisConfidence(analysis) {
      var flagsCount = analysis.authenticity.flags.length;
      var score = analysis.authenticity.score;
      if (analysis.manipulation.detected && analysis.manipulation.confidence === 'very_high') {
        return 'very_high';
      }
      if (score <= 30 && flagsCount >= 3) return 'high';
      if (score <= 50 && flagsCount >= 2) return 'medium';
      if (score <= 70 && flagsCount >= 1) return 'low';
      if (flagsCount === 0 && score >= 90) return 'high';
      return 'medium';
    }

    // =====================================
    // MÉTHODES DE VALIDATION ET COHÉRENCE
    // =====================================
  }, {
    key: "validateConsistency",
    value: function () {
      var _validateConsistency = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(forensicResult) {
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              return _context8.a(2, {
                temporal: this.analyzeTemporalConsistency(forensicResult.timestamps),
                technical: this.analyzeTechnicalConsistency(forensicResult.technical, forensicResult.camera),
                geographic: this.analyzeGeographicConsistency(forensicResult.gps, forensicResult.timestamps)
              });
          }
        }, _callee8, this);
      }));
      function validateConsistency(_x0) {
        return _validateConsistency.apply(this, arguments);
      }
      return validateConsistency;
    }()
  }, {
    key: "detectExifManipulation",
    value: function () {
      var _detectExifManipulation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(forensicResult) {
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              return _context9.a(2, this.detectManipulationSignatures(forensicResult));
          }
        }, _callee9, this);
      }));
      function detectExifManipulation(_x1) {
        return _detectExifManipulation.apply(this, arguments);
      }
      return detectExifManipulation;
    }()
  }, {
    key: "calculateAuthenticityScore",
    value: function calculateAuthenticityScore(forensicResult) {
      var score = 100;
      var flags = [];

      // Appliquer pénalités basées sur l'analyse forensique
      if (forensicResult.forensicAnalysis) {
        score = forensicResult.forensicAnalysis.authenticity.score;
        flags.push.apply(flags, _toConsumableArray(forensicResult.forensicAnalysis.authenticity.flags));
      }
      var confidence = score > 80 ? 'high' : score > 50 ? 'medium' : 'low';
      return {
        score: score,
        flags: flags,
        confidence: confidence
      };
    }

    // =====================================
    // MÉTHODES UTILITAIRES
    // =====================================
  }, {
    key: "generateCacheKey",
    value: function generateCacheKey(filePath) {
      var stats = fsSync.existsSync(filePath) ? fsSync.statSync(filePath) : null;
      var key = "".concat(filePath, "-").concat(stats ? stats.mtime.getTime() : Date.now());
      return crypto.createHash('md5').update(key).digest('hex');
    }
  }, {
    key: "updateCache",
    value: function updateCache(key, data) {
      if (this.cache.size >= this.maxCacheSize) {
        // Supprimer les plus anciens
        var firstKey = this.cache.keys().next().value;
        this.cache["delete"](firstKey);
      }
      this.cache.set(key, data);
    }
  }, {
    key: "mergeExifData",
    value: function mergeExifData(target, source) {
      for (var _i3 = 0, _Object$entries = Object.entries(source); _i3 < _Object$entries.length; _i3++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i3], 2),
          category = _Object$entries$_i[0],
          data = _Object$entries$_i[1];
        if (data && _typeof(data) === 'object' && !Array.isArray(data)) {
          if (!target[category]) target[category] = {};
          Object.assign(target[category], data);
        } else if (data !== undefined && data !== null) {
          target[category] = data;
        }
      }
    }
  }, {
    key: "convertPiexifData",
    value: function convertPiexifData(exifObj) {
      // Conversion des données PiexifJS vers notre format
      var converted = {
        camera: {},
        technical: {},
        timestamps: {},
        gps: {}
      };

      // Mapper les données EXIF de PiexifJS
      if (exifObj['0th']) {
        var ifd0 = exifObj['0th'];
        converted.camera.make = ifd0[this.piexifjs.ImageIFD.Make];
        converted.camera.model = ifd0[this.piexifjs.ImageIFD.Model];
        converted.software.creator = ifd0[this.piexifjs.ImageIFD.Software];
      }
      if (exifObj.Exif) {
        var exif = exifObj.Exif;
        converted.timestamps.dateTimeOriginal = exif[this.piexifjs.ExifIFD.DateTimeOriginal];
        converted.technical.iso = exif[this.piexifjs.ExifIFD.ISOSpeedRatings];
        converted.technical.aperture = exif[this.piexifjs.ExifIFD.FNumber];
        converted.technical.shutterSpeed = exif[this.piexifjs.ExifIFD.ExposureTime];
      }
      if (exifObj.GPS) {
        var gps = exifObj.GPS;
        converted.gps.latitude = this.convertGPSCoordinate(gps[this.piexifjs.GPSIFD.GPSLatitude], gps[this.piexifjs.GPSIFD.GPSLatitudeRef]);
        converted.gps.longitude = this.convertGPSCoordinate(gps[this.piexifjs.GPSIFD.GPSLongitude], gps[this.piexifjs.GPSIFD.GPSLongitudeRef]);
      }
      return converted;
    }
  }, {
    key: "isJPEG",
    value: function isJPEG(filePath) {
      var ext = path.extname(filePath).toLowerCase();
      return ['.jpg', '.jpeg'].includes(ext);
    }
  }, {
    key: "detectMimeType",
    value: function detectMimeType(extension, buffer) {
      var signature = buffer.toString('hex', 0, 8).toUpperCase();

      // Détection par signature
      if (signature.startsWith('FFD8FF')) return 'image/jpeg';
      if (signature.startsWith('89504E47')) return 'image/png';
      if (signature.startsWith('47494638')) return 'image/gif';
      if (signature.startsWith('52494646')) return 'image/webp';
      if (signature.startsWith('49492A00') || signature.startsWith('4D4D002A')) return 'image/tiff';

      // Fallback par extension
      var mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.tiff': 'image/tiff',
        '.tif': 'image/tiff',
        '.bmp': 'image/bmp',
        '.svg': 'image/svg+xml'
      };
      return mimeTypes[extension] || 'application/octet-stream';
    }
  }, {
    key: "detectFileSignature",
    value: function detectFileSignature(buffer) {
      var signature = buffer.toString('hex', 0, 16).toUpperCase();
      return signature;
    }
  }, {
    key: "detectEncoding",
    value: function detectEncoding(buffer) {
      // Détection basique d'encodage
      if (buffer.includes(0x00)) return 'binary';
      try {
        buffer.toString('utf8');
        return 'utf8';
      } catch (e) {
        return 'binary';
      }
    }
  }, {
    key: "getCompressionInfo",
    value: function getCompressionInfo(metadata) {
      if (metadata.format === 'jpeg') return 'JPEG';
      if (metadata.format === 'png') return 'PNG (Lossless)';
      if (metadata.format === 'tiff') return 'TIFF';
      if (metadata.format === 'webp') return 'WebP';
      return metadata.format || 'Unknown';
    }
  }, {
    key: "parseDateTime",
    value: function parseDateTime(dateTimeString) {
      var subSeconds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (!dateTimeString) return null;
      try {
        var dateStr = dateTimeString;

        // Ajouter sous-secondes si disponibles
        if (subSeconds) {
          dateStr += ".".concat(subSeconds);
        }

        // Gestion des formats EXIF standard
        if (dateStr.includes(':') && !dateStr.includes('T')) {
          // Format EXIF: "2023:12:25 14:30:45"
          dateStr = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
        }
        var date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date.toISOString();
      } catch (error) {
        return null;
      }
    }
  }, {
    key: "parseGPSTimestamp",
    value: function parseGPSTimestamp(dateStamp, timeStamp) {
      if (!dateStamp || !timeStamp) return null;
      try {
        // GPS date format: "2023:12:25"
        // GPS time format: [14, 30, 45] ou "14:30:45"
        var dateStr = dateStamp.replace(/:/g, '-');
        var timeStr;
        if (Array.isArray(timeStamp)) {
          timeStr = timeStamp.map(function (t) {
            return String(t).padStart(2, '0');
          }).join(':');
        } else {
          timeStr = timeStamp;
        }
        var dateTimeStr = "".concat(dateStr, "T").concat(timeStr, "Z");
        var date = new Date(dateTimeStr);
        return isNaN(date.getTime()) ? null : date.toISOString();
      } catch (error) {
        return null;
      }
    }
  }, {
    key: "decimalToDMS",
    value: function decimalToDMS(decimal, type) {
      var absolute = Math.abs(decimal);
      var degrees = Math.floor(absolute);
      var minutes = Math.floor((absolute - degrees) * 60);
      var seconds = ((absolute - degrees) * 60 - minutes) * 60;
      var direction;
      if (type === 'lat') {
        direction = decimal >= 0 ? 'N' : 'S';
      } else {
        direction = decimal >= 0 ? 'E' : 'W';
      }
      return "".concat(degrees, "\xB0").concat(minutes, "'").concat(seconds.toFixed(3), "\"").concat(direction);
    }
  }, {
    key: "convertGPSCoordinate",
    value: function convertGPSCoordinate(coordinate, ref) {
      if (!coordinate || !Array.isArray(coordinate)) return null;
      var _coordinate = _slicedToArray(coordinate, 3),
        degrees = _coordinate[0],
        minutes = _coordinate[1],
        seconds = _coordinate[2];
      var decimal = degrees + minutes / 60 + seconds / 3600;
      if (ref === 'S' || ref === 'W') {
        decimal = -decimal;
      }
      return decimal;
    }
  }, {
    key: "extractProcessingHistory",
    value: function extractProcessingHistory(rawData) {
      var history = [];

      // Historique from XMP
      if (rawData.ProcessingSoftware) {
        history.push(rawData.ProcessingSoftware);
      }

      // Historique from IPTC
      if (rawData.Software) {
        history.push(rawData.Software);
      }
      return history.length > 0 ? history : null;
    }
  }, {
    key: "parseFlashValue",
    value: function parseFlashValue(flash) {
      if (typeof flash !== 'number') return null;
      return (flash & 0x01) === 0x01; // Bit 0 indicates if flash fired
    }
  }, {
    key: "hasRedEyeReduction",
    value: function hasRedEyeReduction(flash) {
      if (typeof flash !== 'number') return null;
      return (flash & 0x40) === 0x40; // Bit 6 indicates red-eye reduction
    }
  }, {
    key: "parseShutterSpeed",
    value: function parseShutterSpeed(shutterSpeed) {
      if (!shutterSpeed) return null;
      if (typeof shutterSpeed === 'string') {
        if (shutterSpeed.includes('/')) {
          var _shutterSpeed$split = shutterSpeed.split('/'),
            _shutterSpeed$split2 = _slicedToArray(_shutterSpeed$split, 2),
            numerator = _shutterSpeed$split2[0],
            denominator = _shutterSpeed$split2[1];
          return parseFloat(numerator) / parseFloat(denominator);
        }
        return parseFloat(shutterSpeed);
      }
      return parseFloat(shutterSpeed);
    }
  }, {
    key: "parseTimezoneOffset",
    value: function parseTimezoneOffset(offsetString) {
      if (!offsetString) return 0;
      var match = offsetString.match(/([+-])(\d{2}):?(\d{2})/);
      if (!match) return 0;
      var _match = _slicedToArray(match, 4),
        sign = _match[1],
        hours = _match[2],
        minutes = _match[3];
      var totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
      return sign === '+' ? totalMinutes : -totalMinutes;
    }
  }, {
    key: "countDecimalPlaces",
    value: function countDecimalPlaces(number) {
      if (!number || typeof number !== 'number') return 0;
      var str = number.toString();
      if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
        return str.split('.')[1].length;
      } else if (str.indexOf('e-') !== -1) {
        var parts = str.split('e-');
        return parseInt(parts[1], 10);
      }
      return 0;
    }
  }, {
    key: "isPowerOfTwo",
    value: function isPowerOfTwo(n) {
      return n && (n & n - 1) === 0;
    }
  }, {
    key: "isAnachronisticExifVersion",
    value: function isAnachronisticExifVersion(version, imageDate) {
      if (!version || !imageDate) return false;
      var date = new Date(imageDate);
      var year = date.getFullYear();

      // Versions EXIF avec dates d'introduction
      var versionDates = {
        '0100': 1995,
        // EXIF 1.0
        '0110': 1996,
        // EXIF 1.1
        '0200': 1998,
        // EXIF 2.0
        '0210': 1999,
        // EXIF 2.1
        '0220': 2002,
        // EXIF 2.2
        '0221': 2003,
        // EXIF 2.21
        '0230': 2010,
        // EXIF 2.3
        '0231': 2016,
        // EXIF 2.31
        '0232': 2019 // EXIF 2.32
      };
      var versionYear = versionDates[version];
      return versionYear && year < versionYear;
    }

    // Traductions des valeurs EXIF
  }, {
    key: "translateExposureProgram",
    value: function translateExposureProgram(program) {
      var programs = {
        0: 'Not defined',
        1: 'Manual',
        2: 'Normal program',
        3: 'Aperture priority',
        4: 'Shutter priority',
        5: 'Creative program',
        6: 'Action program',
        7: 'Portrait mode',
        8: 'Landscape mode'
      };
      return programs[program] || "Unknown (".concat(program, ")");
    }
  }, {
    key: "translateExposureMode",
    value: function translateExposureMode(mode) {
      var modes = {
        0: 'Auto exposure',
        1: 'Manual exposure',
        2: 'Auto bracket'
      };
      return modes[mode] || "Unknown (".concat(mode, ")");
    }
  }, {
    key: "translateMeteringMode",
    value: function translateMeteringMode(mode) {
      var modes = {
        0: 'Unknown',
        1: 'Average',
        2: 'Center weighted average',
        3: 'Spot',
        4: 'Multi spot',
        5: 'Pattern',
        6: 'Partial'
      };
      return modes[mode] || "Unknown (".concat(mode, ")");
    }
  }, {
    key: "translateWhiteBalance",
    value: function translateWhiteBalance(wb) {
      var balances = {
        0: 'Auto white balance',
        1: 'Manual white balance'
      };
      return balances[wb] || "Unknown (".concat(wb, ")");
    }
  }, {
    key: "translateColorSpace",
    value: function translateColorSpace(space) {
      var spaces = {
        1: 'sRGB',
        2: 'Adobe RGB',
        65535: 'Uncalibrated'
      };
      return spaces[space] || "Unknown (".concat(space, ")");
    }
  }, {
    key: "translateResolutionUnit",
    value: function translateResolutionUnit(unit) {
      var units = {
        1: 'No absolute unit',
        2: 'Inches',
        3: 'Centimeters'
      };
      return units[unit] || "Unknown (".concat(unit, ")");
    }
  }, {
    key: "formatBytes",
    value: function formatBytes(bytes) {
      if (bytes === 0) return '0 B';
      var k = 1024;
      var sizes = ['B', 'KB', 'MB', 'GB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // =====================================
    // MÉTHODES PUBLIQUES SUPPLÉMENTAIRES
    // =====================================

    /**
     * Créer un résumé des métadonnées pour affichage rapide
     */
  }, {
    key: "createForensicSummary",
    value: function createForensicSummary(forensicResult) {
      var _forensicResult$times, _forensicResult$times2, _forensicResult$softw;
      if (!forensicResult) return null;
      var summary = {
        camera: null,
        settings: null,
        location: null,
        timestamp: null,
        software: null,
        authenticity: {
          score: 0,
          level: 'unknown',
          confidence: 'low'
        },
        flags: {
          count: 0,
          critical: 0
        }
      };

      // Appareil
      if (forensicResult.camera && forensicResult.camera.make && forensicResult.camera.model) {
        summary.camera = "".concat(forensicResult.camera.make, " ").concat(forensicResult.camera.model);
      }

      // Paramètres
      if (forensicResult.technical) {
        var tech = forensicResult.technical;
        var parts = [];
        if (tech.iso) parts.push("ISO ".concat(tech.iso));
        if (tech.aperture) parts.push("f/".concat(tech.aperture));
        if (tech.shutterSpeed) parts.push(tech.shutterSpeed);
        if (parts.length > 0) summary.settings = parts.join(' • ');
      }

      // Localisation
      if (forensicResult.gps && forensicResult.gps.latitude && forensicResult.gps.longitude) {
        summary.location = "".concat(forensicResult.gps.latitude.toFixed(6), ", ").concat(forensicResult.gps.longitude.toFixed(6));
      }

      // Timestamp
      summary.timestamp = ((_forensicResult$times = forensicResult.timestamps) === null || _forensicResult$times === void 0 ? void 0 : _forensicResult$times.dateTimeOriginal) || ((_forensicResult$times2 = forensicResult.timestamps) === null || _forensicResult$times2 === void 0 ? void 0 : _forensicResult$times2.createDate);

      // Logiciel
      summary.software = (_forensicResult$softw = forensicResult.software) === null || _forensicResult$softw === void 0 ? void 0 : _forensicResult$softw.creator;

      // Authenticité
      if (forensicResult.forensicAnalysis && forensicResult.forensicAnalysis.authenticity) {
        var auth = forensicResult.forensicAnalysis.authenticity;
        summary.authenticity.score = auth.score;
        summary.authenticity.confidence = auth.confidence;
        if (auth.score >= 80) summary.authenticity.level = 'high';else if (auth.score >= 60) summary.authenticity.level = 'medium';else if (auth.score >= 40) summary.authenticity.level = 'low';else summary.authenticity.level = 'very_low';
        summary.flags.count = auth.flags ? auth.flags.length : 0;
        summary.flags.critical = auth.flags ? auth.flags.filter(function (f) {
          return f.includes('CRITICAL') || f.includes('MANIPULATION');
        }).length : 0;
      }
      return summary;
    }

    /**
     * Valider format de fichier supporté
     */
  }, {
    key: "isFormatSupported",
    value: function isFormatSupported(filePath) {
      var ext = path.extname(filePath).toLowerCase().substring(1);
      return this.supportedFormats.includes(ext);
    }

    /**
     * Obtenir statistiques du cache
     */
  }, {
    key: "getCacheStats",
    value: function getCacheStats() {
      return {
        size: this.cache.size,
        maxSize: this.maxCacheSize,
        hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
      };
    }

    /**
     * Nettoyer le cache
     */
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.cache.clear();
      console.log('🧹 Cache EXIF nettoyé');
    }

    /**
     * Obtenir informations sur les librairies disponibles
     */
  }, {
    key: "getLibrariesInfo",
    value: function getLibrariesInfo() {
      return {
        initialized: this.initialized,
        exifr: !!this.exifr,
        piexifjs: !!this.piexifjs,
        sharp: true,
        // Toujours disponible
        supportedFormats: this.supportedFormats
      };
    }
  }]);
}(); // =====================================
// EXPORT SINGLETON
// =====================================
module.exports = new ExifForensicService();