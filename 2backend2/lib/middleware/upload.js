"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');
var fileType = require('file-type');
var sanitize = require('sanitize-filename');
var sharp = require('sharp');

// =====================================
// CONFIGURATION ENVIRONNEMENT - LIMITES ÉLEVÉES
// =====================================

var uploadConfig = {
  tempDir: process.env.UPLOAD_TEMP_DIR || path.join(__dirname, '../../../uploads/temp'),
  processedDir: process.env.UPLOAD_PROCESSED_DIR || path.join(__dirname, '../../../uploads/processed'),
  quarantineDir: process.env.UPLOAD_QUARANTINE_DIR || path.join(__dirname, '../../../uploads/quarantine'),
  maxFileSize: parseInt(process.env.MULTER_FILE_SIZE) || 524288000,
  // ✅ 500MB en bytes
  maxFiles: parseInt(process.env.MAX_FILES_PER_REQUEST) || 10,
  allowedFormats: (process.env.ALLOWED_FORMATS || 'jpg,jpeg,png,tiff,tif,webp,raw,dng,cr2,nef,arw,orf,bmp,gif').split(',').map(function (f) {
    return f.trim().toLowerCase();
  })
};

// =====================================
// CRÉATION STRUCTURE DOSSIERS SÉCURISÉE
// =====================================

var createSecureDirectories = function createSecureDirectories() {
  var dirs = [uploadConfig.tempDir, uploadConfig.processedDir, uploadConfig.quarantineDir, path.join(uploadConfig.tempDir, '../thumbnails'), path.join(uploadConfig.tempDir, '../reports')];
  dirs.forEach(function (dir) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
          mode: 493
        });
        console.log("\uD83D\uDCC1 Dossier s\xE9curis\xE9 cr\xE9\xE9: ".concat(dir));
        var gitkeepPath = path.join(dir, '.gitkeep');
        if (!fs.existsSync(gitkeepPath)) {
          fs.writeFileSync(gitkeepPath, '');
        }
      }
    } catch (error) {
      console.error("\u274C Erreur cr\xE9ation dossier ".concat(dir, ":"), error);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  });
};
createSecureDirectories();

// =====================================
// VALIDATION AVANCÉE FICHIERS
// =====================================

var advancedFileValidation = {
  verifyMagicNumbers: function verifyMagicNumbers(buffer, mimeType) {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var detectedType, mimeMapping, expectedExts;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.n = 1;
            return fileType.fromBuffer(buffer);
          case 1:
            detectedType = _context.v;
            if (detectedType) {
              _context.n = 2;
              break;
            }
            return _context.a(2, {
              valid: false,
              reason: 'Type de fichier non détectable'
            });
          case 2:
            mimeMapping = {
              'image/jpeg': ['jpg', 'jpeg'],
              'image/png': ['png'],
              'image/tiff': ['tiff', 'tif'],
              'image/webp': ['webp'],
              'image/bmp': ['bmp'],
              'image/gif': ['gif']
            };
            expectedExts = mimeMapping[mimeType] || [];
            if (expectedExts.includes(detectedType.ext)) {
              _context.n = 3;
              break;
            }
            return _context.a(2, {
              valid: false,
              reason: "Discordance type: d\xE9clar\xE9 ".concat(mimeType, ", d\xE9tect\xE9 ").concat(detectedType.mime),
              detected: detectedType
            });
          case 3:
            return _context.a(2, {
              valid: true,
              detected: detectedType
            });
        }
      }, _callee);
    }))();
  },
  analyzeExifSafety: function analyzeExifSafety(filePath) {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var exifr, exifData, risks, suspiciousSoftware, software, foundSuspicious, criticalFields, missingFields, _t;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            exifr = require('exifr');
            _context2.n = 1;
            return exifr.parse(filePath, {
              tiff: true,
              xmp: true,
              icc: true,
              iptc: true
            });
          case 1:
            exifData = _context2.v;
            risks = [];
            suspiciousSoftware = ['photoshop', 'gimp', 'paint.net', 'canva', 'midjourney', 'dall-e', 'stable diffusion', 'firefly', 'leonardo'];
            if (exifData !== null && exifData !== void 0 && exifData.Software) {
              software = exifData.Software.toLowerCase();
              foundSuspicious = suspiciousSoftware.find(function (s) {
                return software.includes(s);
              });
              if (foundSuspicious) {
                risks.push({
                  type: 'SUSPICIOUS_SOFTWARE',
                  severity: 'high',
                  details: "Logiciel d\xE9tect\xE9: ".concat(exifData.Software),
                  software: foundSuspicious
                });
              }
            }
            criticalFields = ['DateTimeOriginal', 'Make', 'Model'];
            missingFields = criticalFields.filter(function (field) {
              return !(exifData !== null && exifData !== void 0 && exifData[field]);
            });
            if (missingFields.length === criticalFields.length) {
              risks.push({
                type: 'METADATA_MISSING',
                severity: 'medium',
                details: 'Métadonnées EXIF critiques manquantes'
              });
            }
            return _context2.a(2, {
              safe: risks.length === 0,
              risks: risks,
              exifData: exifData || {}
            });
          case 2:
            _context2.p = 2;
            _t = _context2.v;
            return _context2.a(2, {
              safe: false,
              risks: [{
                type: 'EXIF_READ_ERROR',
                severity: 'low',
                details: 'Impossible de lire les métadonnées EXIF'
              }],
              exifData: {}
            });
        }
      }, _callee2, null, [[0, 2]]);
    }))();
  },
  scanForThreats: function scanForThreats(filePath) {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var buffer, threats, malwareSignatures, suspiciousStrings, contentStr, _t2;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            _context3.p = 0;
            buffer = fs.readFileSync(filePath);
            threats = [];
            malwareSignatures = [/\x4d\x5a/g,
            // Executable PE header
            /\x7f\x45\x4c\x46/g,
            // ELF header
            /\x50\x4b\x03\x04/g,
            // ZIP header (potentiel polyglot)
            /\x25\x50\x44\x46/g,
            // PDF header
            /%PDF-/g,
            // PDF signature
            /\x89PNG/g // PNG avec données suspectes
            ];
            malwareSignatures.forEach(function (signature, index) {
              var matches = buffer.toString('binary').match(signature);
              if (matches && matches.length > 1) {
                threats.push({
                  type: 'SUSPICIOUS_BINARY_PATTERN',
                  severity: 'high',
                  details: "Pattern suspect d\xE9tect\xE9: ".concat(signature.source),
                  occurrences: matches.length
                });
              }
            });
            suspiciousStrings = ['eval(', 'exec(', '<script>', 'javascript:', 'data:'];
            contentStr = buffer.toString('ascii', 0, Math.min(buffer.length, 10000));
            suspiciousStrings.forEach(function (str) {
              if (contentStr.includes(str)) {
                threats.push({
                  type: 'SUSPICIOUS_CODE_INJECTION',
                  severity: 'critical',
                  details: "Code suspect trouv\xE9: ".concat(str)
                });
              }
            });
            return _context3.a(2, {
              safe: threats.length === 0,
              threats: threats,
              scannedBytes: buffer.length
            });
          case 1:
            _context3.p = 1;
            _t2 = _context3.v;
            return _context3.a(2, {
              safe: false,
              threats: [{
                type: 'SCAN_ERROR',
                severity: 'medium',
                details: 'Impossible de scanner le fichier'
              }],
              scannedBytes: 0
            });
        }
      }, _callee3, null, [[0, 1]]);
    }))();
  },
  validateImageIntegrity: function validateImageIntegrity(filePath) {
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var metadata, issues, _t3;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.p = _context4.n) {
          case 0:
            _context4.p = 0;
            _context4.n = 1;
            return sharp(filePath).metadata();
          case 1:
            metadata = _context4.v;
            issues = [];
            if (!metadata.width || !metadata.height) {
              issues.push({
                type: 'INVALID_DIMENSIONS',
                severity: 'high',
                details: 'Dimensions invalides ou corrompues'
              });
            }
            if (metadata.width > 50000 || metadata.height > 50000) {
              issues.push({
                type: 'EXCESSIVE_DIMENSIONS',
                severity: 'medium',
                details: "Dimensions excessives: ".concat(metadata.width, "x").concat(metadata.height)
              });
            }
            if (metadata.density && (metadata.density > 10000 || metadata.density < 1)) {
              issues.push({
                type: 'SUSPICIOUS_DENSITY',
                severity: 'low',
                details: "Densit\xE9 suspecte: ".concat(metadata.density)
              });
            }
            return _context4.a(2, {
              valid: issues.length === 0,
              issues: issues,
              metadata: metadata
            });
          case 2:
            _context4.p = 2;
            _t3 = _context4.v;
            return _context4.a(2, {
              valid: false,
              issues: [{
                type: 'CORRUPTION_ERROR',
                severity: 'critical',
                details: "Image corrompue: ".concat(_t3.message)
              }],
              metadata: null
            });
        }
      }, _callee4, null, [[0, 2]]);
    }))();
  }
};

// =====================================
// CONFIGURATION MULTER SÉCURISÉE - LIMITES ÉLEVÉES
// =====================================

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    if (!fs.existsSync(uploadConfig.tempDir)) {
      try {
        fs.mkdirSync(uploadConfig.tempDir, {
          recursive: true,
          mode: 493
        });
      } catch (error) {
        return cb(new Error('Impossible de créer le dossier temporaire'));
      }
    }
    cb(null, uploadConfig.tempDir);
  },
  filename: function filename(req, file, cb) {
    try {
      var timestamp = Date.now();
      var randomBytes = crypto.randomBytes(12).toString('hex');
      var sanitizedName = sanitize(file.originalname);
      var extension = path.extname(sanitizedName).toLowerCase();
      if (!uploadConfig.allowedFormats.includes(extension.substring(1))) {
        return cb(new Error("Extension non autoris\xE9e: ".concat(extension)));
      }
      var secureName = "upload_".concat(timestamp, "_").concat(randomBytes).concat(extension);
      req.uploadMeta = {
        originalName: sanitizedName,
        secureName: secureName,
        timestamp: timestamp,
        extension: extension
      };
      cb(null, secureName);
    } catch (error) {
      cb(new Error("Erreur g\xE9n\xE9ration nom fichier: ".concat(error.message)));
    }
  }
});
var fileFilter = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, file, cb) {
    var allowedMimes, sanitizedName, extension, _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          console.log("\uD83D\uDD0D Validation fichier: ".concat(file.originalname, " (").concat(file.mimetype, ")"));
          allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/webp', 'image/bmp', 'image/gif'];
          if (allowedMimes.includes(file.mimetype)) {
            _context5.n = 1;
            break;
          }
          console.log("\u274C MIME type rejet\xE9: ".concat(file.mimetype));
          return _context5.a(2, cb(new Error("Type MIME non autoris\xE9: ".concat(file.mimetype)), false));
        case 1:
          sanitizedName = sanitize(file.originalname);
          if (!(!sanitizedName || sanitizedName.length === 0)) {
            _context5.n = 2;
            break;
          }
          return _context5.a(2, cb(new Error('Nom de fichier invalide'), false));
        case 2:
          extension = path.extname(sanitizedName).toLowerCase().substring(1);
          if (uploadConfig.allowedFormats.includes(extension)) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, cb(new Error("Extension non autoris\xE9e: .".concat(extension)), false));
        case 3:
          if (!(file.size && file.size > uploadConfig.maxFileSize)) {
            _context5.n = 4;
            break;
          }
          return _context5.a(2, cb(new Error("Fichier trop volumineux: ".concat(file.size, " bytes")), false));
        case 4:
          console.log("\u2705 Validation fichier r\xE9ussie: ".concat(file.originalname, " (").concat(file.mimetype, ")"));
          cb(null, true);
          _context5.n = 6;
          break;
        case 5:
          _context5.p = 5;
          _t4 = _context5.v;
          console.error('❌ Erreur validation fichier:', _t4);
          cb(new Error("Erreur validation: ".concat(_t4.message)), false);
        case 6:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 5]]);
  }));
  return function fileFilter(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// Configuration Multer complète avec limites TRÈS ÉLEVÉES
var multerConfig = {
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: uploadConfig.maxFileSize,
    // ✅ 500MB
    files: uploadConfig.maxFiles,
    // 10 fichiers max
    fieldSize: 100 * 1024 * 1024,
    // ✅ 100MB pour les champs
    fieldNameSize: 2000,
    // ✅ 2KB pour noms de champs
    fields: 100,
    // ✅ 100 champs max
    parts: 200,
    // ✅ 200 parties multipart max
    headerPairs: 2000 // ✅ Plus de headers autorisés
  }
};
console.log("\u2705 Configuration Multer: fileSize=".concat(Math.round(uploadConfig.maxFileSize / 1024 / 1024), "MB, files=").concat(uploadConfig.maxFiles));

// =====================================
// MIDDLEWARE POST-UPLOAD VALIDATION
// =====================================

var postUploadValidation = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res, next) {
    var validationId, filePath, validationResults, buffer, magicValidation, threatScan, criticalThreats, quarantinePath, integrityValidation, criticalIssues, exifAnalysis, _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          if (req.file) {
            _context6.n = 1;
            break;
          }
          return _context6.a(2, next());
        case 1:
          validationId = crypto.randomBytes(8).toString('hex');
          console.log("\uD83D\uDD0D Post-validation d\xE9marr\xE9e [".concat(validationId, "]: ").concat(req.file.filename));
          _context6.p = 2;
          filePath = req.file.path;
          validationResults = {
            validationId: validationId,
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
            timestamp: new Date().toISOString(),
            checks: {}
          };
          console.log("\uD83D\uDD0D V\xE9rification signatures magiques [".concat(validationId, "]"));
          buffer = fs.readFileSync(filePath);
          _context6.n = 3;
          return advancedFileValidation.verifyMagicNumbers(buffer, req.file.mimetype);
        case 3:
          magicValidation = _context6.v;
          validationResults.checks.magicNumbers = magicValidation;
          if (magicValidation.valid) {
            _context6.n = 4;
            break;
          }
          fs.unlinkSync(filePath);
          return _context6.a(2, res.status(400).json({
            error: 'Validation fichier échouée',
            details: magicValidation.reason,
            type: 'MAGIC_NUMBER_MISMATCH'
          }));
        case 4:
          console.log("\uD83D\uDEE1\uFE0F Scan s\xE9curit\xE9 [".concat(validationId, "]"));
          _context6.n = 5;
          return advancedFileValidation.scanForThreats(filePath);
        case 5:
          threatScan = _context6.v;
          validationResults.checks.threatScan = threatScan;
          if (threatScan.safe) {
            _context6.n = 6;
            break;
          }
          criticalThreats = threatScan.threats.filter(function (t) {
            return t.severity === 'critical';
          });
          if (!(criticalThreats.length > 0)) {
            _context6.n = 6;
            break;
          }
          quarantinePath = path.join(uploadConfig.quarantineDir, req.file.filename);
          fs.renameSync(filePath, quarantinePath);
          console.log("\uD83D\uDEA8 Fichier mis en quarantaine: ".concat(req.file.filename));
          return _context6.a(2, res.status(400).json({
            error: 'Fichier suspect détecté',
            details: 'Le fichier contient des éléments potentiellement dangereux',
            type: 'SECURITY_THREAT_DETECTED',
            quarantined: true
          }));
        case 6:
          console.log("\uD83D\uDDBC\uFE0F Validation int\xE9grit\xE9 image [".concat(validationId, "]"));
          _context6.n = 7;
          return advancedFileValidation.validateImageIntegrity(filePath);
        case 7:
          integrityValidation = _context6.v;
          validationResults.checks.integrity = integrityValidation;
          if (integrityValidation.valid) {
            _context6.n = 8;
            break;
          }
          criticalIssues = integrityValidation.issues.filter(function (i) {
            return i.severity === 'critical';
          });
          if (!(criticalIssues.length > 0)) {
            _context6.n = 8;
            break;
          }
          fs.unlinkSync(filePath);
          return _context6.a(2, res.status(400).json({
            error: 'Image corrompue',
            details: 'L\'image ne peut pas être traitée car elle est corrompue',
            type: 'IMAGE_CORRUPTION'
          }));
        case 8:
          console.log("\uD83D\uDCCA Analyse EXIF s\xE9curit\xE9 [".concat(validationId, "]"));
          _context6.n = 9;
          return advancedFileValidation.analyzeExifSafety(filePath);
        case 9:
          exifAnalysis = _context6.v;
          validationResults.checks.exifSafety = exifAnalysis;
          req.validationResults = validationResults;
          console.log("\u2705 Post-validation termin\xE9e [".concat(validationId, "]: ").concat(validationResults.checks.magicNumbers.valid ? 'VALID' : 'INVALID'));
          next();
          _context6.n = 11;
          break;
        case 10:
          _context6.p = 10;
          _t5 = _context6.v;
          console.error("\u274C Erreur post-validation [".concat(validationId, "]:"), _t5);
          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          res.status(500).json({
            error: 'Erreur validation post-upload',
            details: _t5.message,
            type: 'POST_VALIDATION_ERROR'
          });
        case 11:
          return _context6.a(2);
      }
    }, _callee6, null, [[2, 10]]);
  }));
  return function postUploadValidation(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

// =====================================
// GESTION D'ERREURS MULTER SPÉCIALISÉE
// =====================================

var handleMulterError = function handleMulterError(err, req, res, next) {
  console.error('❌ Erreur Multer:', err);
  if (req.file && fs.existsSync(req.file.path)) {
    try {
      fs.unlinkSync(req.file.path);
      console.log('🗑️ Fichier temporaire nettoyé après erreur');
    } catch (cleanupError) {
      console.error('⚠️ Erreur nettoyage fichier:', cleanupError);
    }
  }
  if (req.files) {
    req.files.forEach(function (file) {
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error('⚠️ Erreur nettoyage fichier multiple:', cleanupError);
        }
      }
    });
  }
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(413).json({
          error: 'Fichier trop volumineux',
          maxSize: "".concat(Math.round(uploadConfig.maxFileSize / 1024 / 1024), "MB"),
          receivedSize: err.field ? "".concat(Math.round(err.field / 1024 / 1024), "MB") : 'Inconnu',
          type: 'FILE_TOO_LARGE',
          code: 'LIMIT_FILE_SIZE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          error: 'Trop de fichiers',
          maxFiles: uploadConfig.maxFiles,
          type: 'TOO_MANY_FILES',
          code: 'LIMIT_FILE_COUNT'
        });
      case 'LIMIT_FIELD_COUNT':
        return res.status(400).json({
          error: 'Trop de champs',
          type: 'TOO_MANY_FIELDS',
          code: 'LIMIT_FIELD_COUNT'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Champ de fichier inattendu',
          field: err.field,
          type: 'UNEXPECTED_FILE',
          code: 'LIMIT_UNEXPECTED_FILE'
        });
      case 'LIMIT_PART_COUNT':
        return res.status(400).json({
          error: 'Trop de parties dans la requête',
          type: 'TOO_MANY_PARTS',
          code: 'LIMIT_PART_COUNT'
        });
      default:
        return res.status(400).json({
          error: 'Erreur upload',
          details: err.message,
          type: 'MULTER_ERROR',
          code: err.code
        });
    }
  }
  res.status(400).json({
    error: 'Erreur upload',
    details: err.message,
    type: 'UPLOAD_ERROR'
  });
};

// =====================================
// MIDDLEWARE EXPORTS
// =====================================

var single = function single(fieldName) {
  var upload = multer(multerConfig).single(fieldName);
  return [upload, handleMulterError, postUploadValidation];
};
var array = function array(fieldName) {
  var maxCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : uploadConfig.maxFiles;
  var upload = multer(multerConfig).array(fieldName, maxCount);
  return [upload, handleMulterError, postUploadValidation];
};
var forensicUpload = single;
module.exports = {
  single: single,
  array: array,
  forensicUpload: forensicUpload,
  uploadConfig: uploadConfig,
  advancedFileValidation: advancedFileValidation,
  postUploadValidation: postUploadValidation,
  handleMulterError: handleMulterError
};