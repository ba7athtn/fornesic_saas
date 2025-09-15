"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
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
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var path = require('path');
var fs = require('fs').promises;
var fsSync = require('fs');
var mongoose = require('mongoose');
var crypto = require('crypto');
var _require = require('../utils/pdfGenerator'),
  generateForensicPdfReport = _require.generateForensicPdfReport;
var Image = require('../models/Image');
var Analysis = require('../models/Analysis');
var Report = require('../models/Report');

// =====================================
// CONTRÔLEUR RAPPORTS FORENSIQUES COMPLET - OPTIMISÉ
// =====================================

// Validation ObjectId optimisée
var validateObjectId = function validateObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return new mongoose.Types.ObjectId(id);
};

// Cache pour rapports fréquemment demandés
var reportCache = new Map();
var REPORT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Sanitization des entrées
var sanitizeInput = function sanitizeInput(input) {
  return typeof input === 'string' ? input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/[<>'"&]/g, function (_char) {
    var entities = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[_char] || _char;
  }) : input;
};

// Rate limiting pour génération de rapports
var reportGenerationAttempts = new Map();
var MAX_REPORTS_PER_HOUR = 10;

/**
 * Générer rapport forensique complet avec tous les piliers
 */
exports.generateForensicReport = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var startTime, requestId, _req$user, _req$user2, _req$user3, _req$user4, imageId, _req$query, _req$query$template, template, _req$query$format, format, _req$query$language, language, _req$query$includeRaw, includeRawData, _req$query$includePil, includePillars, _req$query$includeCha, includeChainOfCustody, userId, now, userAttempts, recentAttempts, objectId, cacheKey, cached, _yield$Promise$all, _yield$Promise$all2, image, analysis, sanitizedTemplate, sanitizedFormat, sanitizedLanguage, validTemplates, validFormats, reportsDir, timestamp, sanitizedFilename, reportFilename, reportPath, reportData, reportRecord, generatedFilePath, fileSize, htmlContent, csvContent, fileStats, _t2, _t3, _t4, _t5, _t6, _t7, _t8, _t9, _t0, _t1, _t10, _t11, _t12, _t13, _t14, _t15, _t16;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          startTime = Date.now();
          requestId = crypto.randomBytes(8).toString('hex');
          _context3.p = 1;
          imageId = req.params.imageId;
          _req$query = req.query, _req$query$template = _req$query.template, template = _req$query$template === void 0 ? 'executive' : _req$query$template, _req$query$format = _req$query.format, format = _req$query$format === void 0 ? 'pdf' : _req$query$format, _req$query$language = _req$query.language, language = _req$query$language === void 0 ? 'fr' : _req$query$language, _req$query$includeRaw = _req$query.includeRawData, includeRawData = _req$query$includeRaw === void 0 ? 'false' : _req$query$includeRaw, _req$query$includePil = _req$query.includePillars, includePillars = _req$query$includePil === void 0 ? 'all' : _req$query$includePil, _req$query$includeCha = _req$query.includeChainOfCustody, includeChainOfCustody = _req$query$includeCha === void 0 ? 'auto' : _req$query$includeCha;
          console.log("\uD83D\uDCC4 G\xE9n\xE9ration rapport forensique: ".concat(imageId, " [").concat(requestId, "]"));

          // Rate limiting par utilisateur
          userId = ((_req$user = req.user) === null || _req$user === void 0 ? void 0 : _req$user.sub) || req.ip;
          now = Date.now();
          userAttempts = reportGenerationAttempts.get(userId) || [];
          recentAttempts = userAttempts.filter(function (time) {
            return now - time < 3600000;
          }); // 1 heure
          if (!(recentAttempts.length >= MAX_REPORTS_PER_HOUR)) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, res.status(429).json({
            error: 'Limite de génération de rapports dépassée',
            type: 'RATE_LIMIT_EXCEEDED',
            resetTime: new Date(Math.min.apply(Math, _toConsumableArray(recentAttempts)) + 3600000).toISOString(),
            requestId: requestId
          }));
        case 2:
          reportGenerationAttempts.set(userId, [].concat(_toConsumableArray(recentAttempts), [now]));
          objectId = req.forensicObjectId || validateObjectId(imageId); // Vérification cache
          cacheKey = "report-".concat(imageId, "-").concat(template, "-").concat(format, "-").concat(includePillars);
          if (!reportCache.has(cacheKey)) {
            _context3.n = 4;
            break;
          }
          cached = reportCache.get(cacheKey);
          if (!(Date.now() - cached.timestamp < REPORT_CACHE_TTL)) {
            _context3.n = 3;
            break;
          }
          console.log("\uD83D\uDCBE Cache hit pour rapport: ".concat(imageId, " [").concat(requestId, "]"));
          return _context3.a(2, res.download(cached.filepath, cached.filename));
        case 3:
          reportCache["delete"](cacheKey);
        case 4:
          _context3.n = 5;
          return Promise.all([Image.findById(objectId).lean(), Analysis.findOne({
            imageId: objectId
          }).lean()]);
        case 5:
          _yield$Promise$all = _context3.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          image = _yield$Promise$all2[0];
          analysis = _yield$Promise$all2[1];
          if (image) {
            _context3.n = 6;
            break;
          }
          return _context3.a(2, res.status(404).json({
            error: 'Image non trouvée pour génération de rapport',
            type: 'IMAGE_NOT_FOUND',
            imageId: imageId,
            requestId: requestId
          }));
        case 6:
          if (!(image.status !== 'analyzed' || !analysis && !image.forensicAnalysis)) {
            _context3.n = 7;
            break;
          }
          return _context3.a(2, res.status(400).json({
            error: 'Analyse forensique non disponible',
            type: 'ANALYSIS_NOT_AVAILABLE',
            status: image.status,
            message: 'L\'image doit être analysée avant génération de rapport',
            requestId: requestId
          }));
        case 7:
          // Sanitization des paramètres
          sanitizedTemplate = sanitizeInput(template);
          sanitizedFormat = sanitizeInput(format);
          sanitizedLanguage = sanitizeInput(language); // Validation template et format
          validTemplates = ['executive', 'technical', 'legal', 'summary', 'detailed', 'comparison'];
          validFormats = ['pdf', 'json', 'html', 'csv', 'docx'];
          if (validTemplates.includes(sanitizedTemplate)) {
            _context3.n = 8;
            break;
          }
          return _context3.a(2, res.status(400).json({
            error: 'Template de rapport invalide',
            type: 'INVALID_TEMPLATE',
            validTemplates: validTemplates,
            requestId: requestId
          }));
        case 8:
          if (validFormats.includes(sanitizedFormat)) {
            _context3.n = 9;
            break;
          }
          return _context3.a(2, res.status(400).json({
            error: 'Format de rapport invalide',
            type: 'INVALID_FORMAT',
            validFormats: validFormats,
            requestId: requestId
          }));
        case 9:
          // Préparer dossier rapports sécurisé
          reportsDir = path.join(process.env.UPLOAD_REPORTS_DIR || './uploads/reports');
          if (!fsSync.existsSync(reportsDir)) {
            fsSync.mkdirSync(reportsDir, {
              recursive: true,
              mode: 493
            });
          }

          // Générer nom fichier sécurisé
          timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          sanitizedFilename = sanitizeInput(image.originalName).replace(/[^a-zA-Z0-9.-]/g, '_');
          reportFilename = "rapport-forensique_".concat(timestamp, "_").concat(sanitizedFilename, "_").concat(requestId, ".").concat(sanitizedFormat);
          reportPath = path.join(reportsDir, reportFilename); // Construire données complètes du rapport
          reportData = buildComprehensiveReportData(image, analysis, {
            template: sanitizedTemplate,
            format: sanitizedFormat,
            language: sanitizedLanguage,
            includeRawData: includeRawData === 'true',
            includePillars: includePillars === 'all' ? ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'] : includePillars.split(',').map(function (p) {
              return p.trim();
            }),
            includeChainOfCustody: includeChainOfCustody === 'auto' ? req.privacyMode === 'JUDICIAL' : includeChainOfCustody === 'true',
            requestId: requestId,
            generatedBy: ((_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.sub) || 'anonymous',
            generatedFor: req.privacyMode || 'COMMERCIAL'
          }); // Créer entrée rapport en base
          reportRecord = new Report({
            sessionId: image.sessionId,
            reportType: 'single',
            category: sanitizedTemplate === 'legal' ? 'legal' : 'routine',
            classification: req.privacyMode === 'JUDICIAL' ? 'restricted' : 'internal',
            formats: [{
              type: sanitizedFormat,
              generated: false,
              filepath: null,
              fileSize: 0
            }],
            images: [objectId],
            primaryImage: objectId,
            configuration: {
              template: sanitizedTemplate,
              language: sanitizedLanguage,
              includeOptions: {
                rawData: includeRawData === 'true',
                pillarAnalysis: true,
                technicalDetails: sanitizedTemplate === 'technical',
                chainOfCustody: reportData.includeChainOfCustody
              }
            },
            generation: {
              requestedBy: {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                userId: (_req$user3 = req.user) === null || _req$user3 === void 0 ? void 0 : _req$user3.sub,
                timestamp: new Date()
              },
              versions: {
                reportGenerator: '3.0.0-forensic',
                analysisEngine: (analysis === null || analysis === void 0 ? void 0 : analysis.analysisVersion) || '2.1.0'
              }
            },
            status: 'generating',
            progress: 0,
            privacy: {
              mode: req.privacyMode || 'COMMERCIAL',
              anonymized: false,
              gdprCompliant: true
            },
            chainOfCustody: {
              entries: [{
                timestamp: new Date(),
                action: 'REPORT_GENERATION_INITIATED',
                performedBy: ((_req$user4 = req.user) === null || _req$user4 === void 0 ? void 0 : _req$user4.sub) || 'anonymous',
                method: 'API_REQUEST',
                hash: crypto.createHash('sha256').update(JSON.stringify(reportData)).digest('hex').substring(0, 16),
                notes: "Template: ".concat(sanitizedTemplate, ", Format: ").concat(sanitizedFormat)
              }]
            }
          });
          _context3.n = 10;
          return reportRecord.save();
        case 10:
          // Générer rapport selon le format
          console.log("\uD83D\uDD04 G\xE9n\xE9ration ".concat(sanitizedFormat.toUpperCase(), " en cours [").concat(requestId, "]"));
          fileSize = 0;
          _context3.p = 11;
          _t2 = sanitizedFormat;
          _context3.n = _t2 === 'pdf' ? 12 : _t2 === 'json' ? 14 : _t2 === 'html' ? 16 : _t2 === 'csv' ? 19 : _t2 === 'docx' ? 22 : 24;
          break;
        case 12:
          _context3.n = 13;
          return generateForensicPdfReport(reportData, reportPath, {
            template: sanitizedTemplate,
            language: sanitizedLanguage,
            includeCharts: true,
            includeImages: sanitizedTemplate !== 'summary'
          });
        case 13:
          generatedFilePath = _context3.v;
          return _context3.a(3, 25);
        case 14:
          _context3.n = 15;
          return fs.writeFile(reportPath, JSON.stringify(reportData, null, 2), 'utf8');
        case 15:
          generatedFilePath = reportPath;
          return _context3.a(3, 25);
        case 16:
          _context3.n = 17;
          return generateHtmlReport(reportData);
        case 17:
          htmlContent = _context3.v;
          _context3.n = 18;
          return fs.writeFile(reportPath, htmlContent, 'utf8');
        case 18:
          generatedFilePath = reportPath;
          return _context3.a(3, 25);
        case 19:
          _context3.n = 20;
          return generateCsvReport(reportData);
        case 20:
          csvContent = _context3.v;
          _context3.n = 21;
          return fs.writeFile(reportPath, csvContent, 'utf8');
        case 21:
          generatedFilePath = reportPath;
          return _context3.a(3, 25);
        case 22:
          _context3.n = 23;
          return generateDocxReport(reportData, reportPath);
        case 23:
          generatedFilePath = _context3.v;
          return _context3.a(3, 25);
        case 24:
          throw new Error("Format ".concat(sanitizedFormat, " non support\xE9"));
        case 25:
          if (fsSync.existsSync(generatedFilePath)) {
            _context3.n = 26;
            break;
          }
          throw new Error("Fichier ".concat(sanitizedFormat, " non g\xE9n\xE9r\xE9"));
        case 26:
          _context3.n = 27;
          return fs.stat(generatedFilePath);
        case 27:
          fileStats = _context3.v;
          fileSize = fileStats.size;

          // Mise en cache
          reportCache.set(cacheKey, {
            filepath: generatedFilePath,
            filename: reportFilename,
            timestamp: Date.now()
          });

          // Mettre à jour rapport en base
          _t3 = Report;
          _t4 = reportRecord._id;
          _t5 = generatedFilePath;
          _t6 = fileSize;
          _t7 = new Date();
          _t8 = crypto.createHash('sha256');
          _context3.n = 28;
          return fs.readFile(generatedFilePath);
        case 28:
          _t9 = _t8.update.call(_t8, _context3.v).digest('hex');
          _t0 = Date.now() - startTime;
          _t1 = new Date();
          _t10 = crypto.createHash('sha256');
          _context3.n = 29;
          return fs.readFile(generatedFilePath);
        case 29:
          _t11 = _t10.update.call(_t10, _context3.v).digest('hex').substring(0, 16);
          _t12 = "".concat(sanitizedFormat.toUpperCase(), " report successfully generated (").concat(formatBytes(fileSize), ")");
          _t13 = {
            timestamp: _t1,
            action: 'REPORT_GENERATED',
            performedBy: 'system',
            hash: _t11,
            notes: _t12
          };
          _t14 = {
            'chainOfCustody.entries': _t13
          };
          _context3.n = 30;
          return _t3.findByIdAndUpdate.call(_t3, _t4, {
            'formats.0.generated': true,
            'formats.0.filepath': _t5,
            'formats.0.fileSize': _t6,
            'formats.0.generatedAt': _t7,
            'formats.0.checksum': _t9,
            status: 'completed',
            progress: 100,
            'generation.processingTime': _t0,
            $push: _t14
          });
        case 30:
          console.log("\u2705 Rapport g\xE9n\xE9r\xE9: ".concat(formatBytes(fileSize), " [").concat(requestId, "]"));

          // Headers sécurisés pour téléchargement
          res.setHeader('Content-Type', getContentType(sanitizedFormat));
          res.setHeader('Content-Length', fileSize);
          res.setHeader('Content-Disposition', "attachment; filename=\"".concat(reportFilename, "\""));
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('X-Report-Generated', new Date().toISOString());
          res.setHeader('X-Report-ID', reportRecord._id.toString());
          res.setHeader('X-Request-ID', requestId);
          res.setHeader('X-Processing-Time', Date.now() - startTime + 'ms');

          // Téléchargement avec nettoyage automatique
          res.download(generatedFilePath, reportFilename, /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(downloadError) {
              var _req$user5;
              return _regenerator().w(function (_context2) {
                while (1) switch (_context2.n) {
                  case 0:
                    if (!downloadError) {
                      _context2.n = 1;
                      break;
                    }
                    console.error("\u274C Erreur t\xE9l\xE9chargement [".concat(requestId, "]:"), downloadError);
                    if (!res.headersSent) {
                      res.status(500).json({
                        error: 'Erreur lors du téléchargement',
                        type: 'DOWNLOAD_ERROR',
                        requestId: requestId
                      });
                    }
                    _context2.n = 3;
                    break;
                  case 1:
                    _context2.n = 2;
                    return Report.findByIdAndUpdate(reportRecord._id, {
                      $inc: {
                        'access.downloadCount': 1
                      },
                      'access.lastAccessed': new Date(),
                      $push: {
                        'access.accessLog': {
                          timestamp: new Date(),
                          action: 'download',
                          ip: req.ip,
                          userAgent: req.get('User-Agent'),
                          userId: (_req$user5 = req.user) === null || _req$user5 === void 0 ? void 0 : _req$user5.sub,
                          success: true
                        }
                      }
                    });
                  case 2:
                    console.log("\u2705 T\xE9l\xE9chargement r\xE9ussi: ".concat(reportFilename, " [").concat(requestId, "]"));
                  case 3:
                    // Nettoyage automatique après délai
                    setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
                      var _t;
                      return _regenerator().w(function (_context) {
                        while (1) switch (_context.p = _context.n) {
                          case 0:
                            _context.p = 0;
                            if (!fsSync.existsSync(generatedFilePath)) {
                              _context.n = 2;
                              break;
                            }
                            _context.n = 1;
                            return fs.unlink(generatedFilePath);
                          case 1:
                            console.log("\uD83D\uDDD1\uFE0F Fichier temporaire supprim\xE9: ".concat(reportFilename));
                          case 2:
                            _context.n = 4;
                            break;
                          case 3:
                            _context.p = 3;
                            _t = _context.v;
                            console.error("\u274C Erreur nettoyage [".concat(requestId, "]:"), _t);
                          case 4:
                            return _context.a(2);
                        }
                      }, _callee, null, [[0, 3]]);
                    })), 30000); // 30 secondes
                  case 4:
                    return _context2.a(2);
                }
              }, _callee2);
            }));
            return function (_x3) {
              return _ref2.apply(this, arguments);
            };
          }());
          _context3.n = 34;
          break;
        case 31:
          _context3.p = 31;
          _t15 = _context3.v;
          console.error("\u274C Erreur g\xE9n\xE9ration ".concat(sanitizedFormat, " [").concat(requestId, "]:"), _t15);

          // Marquer rapport comme échoué
          _context3.n = 32;
          return Report.findByIdAndUpdate(reportRecord._id, {
            status: 'failed',
            $push: {
              issues: {
                level: 'critical',
                message: "\xC9chec g\xE9n\xE9ration ".concat(sanitizedFormat, ": ").concat(_t15.message),
                timestamp: new Date()
              }
            }
          });
        case 32:
          if (!(generatedFilePath && fsSync.existsSync(generatedFilePath))) {
            _context3.n = 33;
            break;
          }
          _context3.n = 33;
          return fs.unlink(generatedFilePath);
        case 33:
          return _context3.a(2, res.status(500).json({
            error: 'Erreur lors de la génération du rapport',
            type: 'REPORT_GENERATION_ERROR',
            format: sanitizedFormat,
            details: process.env.NODE_ENV === 'development' ? _t15.message : 'Erreur interne',
            requestId: requestId,
            timestamp: new Date().toISOString()
          }));
        case 34:
          _context3.n = 36;
          break;
        case 35:
          _context3.p = 35;
          _t16 = _context3.v;
          console.error("\u274C Erreur generateForensicReport [".concat(requestId, "]:"), {
            imageId: req.params.imageId,
            error: _t16.message,
            stack: process.env.NODE_ENV === 'development' ? _t16.stack : undefined,
            processingTime: Date.now() - startTime + 'ms'
          });
          res.status(500).json({
            error: 'Erreur serveur lors de la génération du rapport',
            type: 'SERVER_ERROR',
            requestId: requestId,
            timestamp: new Date().toISOString()
          });
        case 36:
          return _context3.a(2);
      }
    }, _callee3, null, [[11, 31], [1, 35]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Générer rapport batch pour une session complète
 */
exports.generateBatchReport = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var startTime, requestId, _req$user6, _images, _images$, _req$user7, sessionId, _req$query2, _req$query2$template, template, _req$query2$format, format, _req$query2$language, language, _req$query2$includeSu, includeSummaryStats, _req$query2$includeIn, includeIndividualAnalyses, sanitizedSessionId, sanitizedTemplate, sanitizedFormat, images, imageIds, analyses, sessionStats, batchReportData, batchReport, timestamp, reportFilename, reportsDir, reportPath, generatedPath, htmlContent, csvContent, fileStats, _t17, _t18;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          startTime = Date.now();
          requestId = crypto.randomBytes(8).toString('hex');
          _context6.p = 1;
          sessionId = req.params.sessionId;
          _req$query2 = req.query, _req$query2$template = _req$query2.template, template = _req$query2$template === void 0 ? 'executive' : _req$query2$template, _req$query2$format = _req$query2.format, format = _req$query2$format === void 0 ? 'pdf' : _req$query2$format, _req$query2$language = _req$query2.language, language = _req$query2$language === void 0 ? 'fr' : _req$query2$language, _req$query2$includeSu = _req$query2.includeSummaryStats, includeSummaryStats = _req$query2$includeSu === void 0 ? 'true' : _req$query2$includeSu, _req$query2$includeIn = _req$query2.includeIndividualAnalyses, includeIndividualAnalyses = _req$query2$includeIn === void 0 ? 'false' : _req$query2$includeIn;
          console.log("\uD83D\uDCCA G\xE9n\xE9ration rapport batch session: ".concat(sessionId, " [").concat(requestId, "]"));

          // Sanitization des paramètres
          sanitizedSessionId = sanitizeInput(sessionId);
          sanitizedTemplate = sanitizeInput(template);
          sanitizedFormat = sanitizeInput(format); // Récupérer toutes les images analysées de la session
          _context6.n = 2;
          return Image.find({
            sessionId: sanitizedSessionId,
            status: 'analyzed'
          }).lean();
        case 2:
          images = _context6.v;
          if (!(images.length === 0)) {
            _context6.n = 3;
            break;
          }
          return _context6.a(2, res.status(404).json({
            error: 'Aucune image analysée trouvée pour cette session',
            type: 'NO_ANALYZED_IMAGES',
            sessionId: sanitizedSessionId,
            requestId: requestId
          }));
        case 3:
          // Récupérer analyses correspondantes
          imageIds = images.map(function (img) {
            return img._id;
          });
          _context6.n = 4;
          return Analysis.find({
            imageId: {
              $in: imageIds
            }
          }).lean();
        case 4:
          analyses = _context6.v;
          console.log("\uD83D\uDCCB Session ".concat(sanitizedSessionId, ": ").concat(images.length, " images, ").concat(analyses.length, " analyses [").concat(requestId, "]"));

          // Calculer statistiques session
          sessionStats = calculateSessionStatistics(images, analyses); // Construire données rapport batch
          batchReportData = {
            reportType: 'batch',
            sessionId: sanitizedSessionId,
            requestId: requestId,
            generatedAt: new Date().toISOString(),
            generatedBy: ((_req$user6 = req.user) === null || _req$user6 === void 0 ? void 0 : _req$user6.sub) || 'anonymous',
            privacyMode: req.privacyMode || 'COMMERCIAL',
            sessionSummary: {
              totalImages: images.length,
              analyzedImages: analyses.length,
              sessionPeriod: {
                startDate: (_images = images[images.length - 1]) === null || _images === void 0 ? void 0 : _images.createdAt,
                endDate: (_images$ = images[0]) === null || _images$ === void 0 ? void 0 : _images$.createdAt
              },
              averageProcessingTime: analyses.reduce(function (sum, a) {
                var _a$analysisMetadata;
                return sum + (((_a$analysisMetadata = a.analysisMetadata) === null || _a$analysisMetadata === void 0 ? void 0 : _a$analysisMetadata.processingTime) || 0);
              }, 0) / analyses.length
            },
            statisticalSummary: sessionStats,
            riskAssessment: {
              overallRiskLevel: determineOverallRisk(sessionStats),
              recommendation: generateBatchRecommendation(sessionStats),
              urgencyLevel: determineBatchUrgency(sessionStats),
              requiresExpertReview: sessionStats.criticalFlags > 0 || sessionStats.highRiskImages > images.length * 0.1
            },
            forensicBreakdown: generateForensicBreakdown(analyses),
            individualImages: includeIndividualAnalyses === 'true' ? images.map(function (img) {
              return buildImageSummary(img, analyses.find(function (a) {
                return a.imageId.toString() === img._id.toString();
              }));
            }) : images.map(function (img) {
              var _img$riskClassificati, _img$forensicAnalysis;
              return {
                id: img._id,
                filename: img.originalName,
                authenticityScore: img.authenticityScore,
                riskLevel: (_img$riskClassificati = img.riskClassification) === null || _img$riskClassificati === void 0 ? void 0 : _img$riskClassificati.level,
                flagsCount: ((_img$forensicAnalysis = img.forensicAnalysis) === null || _img$forensicAnalysis === void 0 || (_img$forensicAnalysis = _img$forensicAnalysis.flags) === null || _img$forensicAnalysis === void 0 ? void 0 : _img$forensicAnalysis.length) || 0
              };
            }),
            metadata: {
              reportVersion: '3.0.0-batch',
              template: sanitizedTemplate,
              format: sanitizedFormat,
              language: language,
              includesSummaryStats: includeSummaryStats === 'true',
              includesIndividualAnalyses: includeIndividualAnalyses === 'true'
            }
          }; // Créer enregistrement rapport
          batchReport = new Report({
            sessionId: sanitizedSessionId,
            reportType: 'batch',
            category: 'routine',
            formats: [{
              type: sanitizedFormat,
              generated: false
            }],
            images: imageIds,
            configuration: {
              template: sanitizedTemplate,
              language: language,
              sections: {
                executiveSummary: true,
                detailedAnalysis: includeIndividualAnalyses === 'true',
                statisticalSummary: includeSummaryStats === 'true'
              }
            },
            statistics: {
              totalImages: images.length,
              analyzedImages: analyses.length,
              averageAuthenticityScore: sessionStats.averageScore,
              totalFlags: sessionStats.totalFlags,
              processingTime: Date.now() - startTime
            },
            status: 'generating',
            generation: {
              requestedBy: {
                userId: (_req$user7 = req.user) === null || _req$user7 === void 0 ? void 0 : _req$user7.sub,
                ip: req.ip,
                timestamp: new Date()
              }
            }
          });
          _context6.n = 5;
          return batchReport.save();
        case 5:
          // Générer fichier rapport
          timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          reportFilename = "rapport-batch_".concat(sanitizedSessionId, "_").concat(timestamp, "_").concat(requestId, ".").concat(sanitizedFormat);
          reportsDir = path.join(process.env.UPLOAD_REPORTS_DIR || './uploads/reports');
          reportPath = path.join(reportsDir, reportFilename);
          _t17 = sanitizedFormat;
          _context6.n = _t17 === 'pdf' ? 6 : _t17 === 'json' ? 8 : _t17 === 'html' ? 10 : _t17 === 'csv' ? 13 : 16;
          break;
        case 6:
          _context6.n = 7;
          return generateBatchPdfReport(batchReportData, reportPath);
        case 7:
          generatedPath = _context6.v;
          return _context6.a(3, 17);
        case 8:
          _context6.n = 9;
          return fs.writeFile(reportPath, JSON.stringify(batchReportData, null, 2));
        case 9:
          generatedPath = reportPath;
          return _context6.a(3, 17);
        case 10:
          _context6.n = 11;
          return generateBatchHtmlReport(batchReportData);
        case 11:
          htmlContent = _context6.v;
          _context6.n = 12;
          return fs.writeFile(reportPath, htmlContent);
        case 12:
          generatedPath = reportPath;
          return _context6.a(3, 17);
        case 13:
          _context6.n = 14;
          return generateBatchCsvReport(batchReportData);
        case 14:
          csvContent = _context6.v;
          _context6.n = 15;
          return fs.writeFile(reportPath, csvContent);
        case 15:
          generatedPath = reportPath;
          return _context6.a(3, 17);
        case 16:
          throw new Error("Format batch ".concat(sanitizedFormat, " non support\xE9"));
        case 17:
          _context6.n = 18;
          return fs.stat(generatedPath);
        case 18:
          fileStats = _context6.v;
          _context6.n = 19;
          return Report.findByIdAndUpdate(batchReport._id, {
            'formats.0.generated': true,
            'formats.0.filepath': generatedPath,
            'formats.0.fileSize': fileStats.size,
            'formats.0.generatedAt': new Date(),
            status: 'completed',
            progress: 100,
            'generation.processingTime': Date.now() - startTime
          });
        case 19:
          // Téléchargement
          res.setHeader('Content-Type', getContentType(sanitizedFormat));
          res.setHeader('Content-Length', fileStats.size);
          res.setHeader('Content-Disposition', "attachment; filename=\"".concat(reportFilename, "\""));
          res.setHeader('X-Report-Type', 'batch');
          res.setHeader('X-Images-Count', images.length.toString());
          res.download(generatedPath, reportFilename, /*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(error) {
              var _req$user8;
              return _regenerator().w(function (_context5) {
                while (1) switch (_context5.n) {
                  case 0:
                    if (error) {
                      _context5.n = 2;
                      break;
                    }
                    _context5.n = 1;
                    return batchReport.recordAccess('download', {
                      ip: req.ip,
                      userId: (_req$user8 = req.user) === null || _req$user8 === void 0 ? void 0 : _req$user8.sub
                    });
                  case 1:
                    console.log("\u2705 Rapport batch t\xE9l\xE9charg\xE9: ".concat(sanitizedSessionId, " [").concat(requestId, "]"));
                  case 2:
                    // Nettoyage
                    setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
                      return _regenerator().w(function (_context4) {
                        while (1) switch (_context4.n) {
                          case 0:
                            if (!fsSync.existsSync(generatedPath)) {
                              _context4.n = 1;
                              break;
                            }
                            _context4.n = 1;
                            return fs.unlink(generatedPath);
                          case 1:
                            return _context4.a(2);
                        }
                      }, _callee4);
                    })), 30000);
                  case 3:
                    return _context5.a(2);
                }
              }, _callee5);
            }));
            return function (_x6) {
              return _ref5.apply(this, arguments);
            };
          }());
          _context6.n = 21;
          break;
        case 20:
          _context6.p = 20;
          _t18 = _context6.v;
          console.error("\u274C Erreur generateBatchReport [".concat(requestId, "]:"), _t18);
          res.status(500).json({
            error: 'Erreur génération rapport batch',
            type: 'BATCH_REPORT_ERROR',
            requestId: requestId
          });
        case 21:
          return _context6.a(2);
      }
    }, _callee6, null, [[1, 20]]);
  }));
  return function (_x4, _x5) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Obtenir résumé d'un rapport avant génération
 */
exports.getReportPreview = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var _analysisData$aggrega, _analysisData$aggrega2, _image$riskClassifica, _analysisData$aggrega3, _image$riskClassifica2, _analysisData$consoli, _analysisData$consoli2, _analysisData$consoli3, _analysisData$analysi, imageId, requestId, objectId, _yield$Promise$all3, _yield$Promise$all4, image, analysis, analysisData, preview, _t19;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _context7.p = 0;
          imageId = req.params.imageId;
          requestId = crypto.randomBytes(6).toString('hex');
          objectId = req.forensicObjectId || validateObjectId(imageId);
          _context7.n = 1;
          return Promise.all([Image.findById(objectId).select('originalName status authenticityScore riskClassification forensicAnalysis createdAt size exifData').lean(), Analysis.findOne({
            imageId: objectId
          }).select('aggregatedScore consolidatedFlags analysisMetadata').lean()]);
        case 1:
          _yield$Promise$all3 = _context7.v;
          _yield$Promise$all4 = _slicedToArray(_yield$Promise$all3, 2);
          image = _yield$Promise$all4[0];
          analysis = _yield$Promise$all4[1];
          if (image) {
            _context7.n = 2;
            break;
          }
          return _context7.a(2, res.status(404).json({
            error: 'Image non trouvée',
            type: 'IMAGE_NOT_FOUND',
            requestId: requestId
          }));
        case 2:
          analysisData = analysis || extractLegacyAnalysis(image.forensicAnalysis);
          preview = {
            imageInformation: {
              filename: image.originalName,
              fileSize: formatBytes(image.size),
              uploadDate: image.createdAt,
              status: image.status
            },
            analysisResults: {
              available: image.status === 'analyzed',
              authenticityScore: (analysisData === null || analysisData === void 0 || (_analysisData$aggrega = analysisData.aggregatedScore) === null || _analysisData$aggrega === void 0 ? void 0 : _analysisData$aggrega.authenticity) || image.authenticityScore || 0,
              riskLevel: (analysisData === null || analysisData === void 0 || (_analysisData$aggrega2 = analysisData.aggregatedScore) === null || _analysisData$aggrega2 === void 0 ? void 0 : _analysisData$aggrega2.riskLevel) || ((_image$riskClassifica = image.riskClassification) === null || _image$riskClassifica === void 0 ? void 0 : _image$riskClassifica.level) || 'UNKNOWN',
              confidence: (analysisData === null || analysisData === void 0 || (_analysisData$aggrega3 = analysisData.aggregatedScore) === null || _analysisData$aggrega3 === void 0 ? void 0 : _analysisData$aggrega3.confidence) || ((_image$riskClassifica2 = image.riskClassification) === null || _image$riskClassifica2 === void 0 ? void 0 : _image$riskClassifica2.confidence) || 'low'
            },
            securityFlags: {
              total: (analysisData === null || analysisData === void 0 || (_analysisData$consoli = analysisData.consolidatedFlags) === null || _analysisData$consoli === void 0 ? void 0 : _analysisData$consoli.length) || 0,
              critical: (analysisData === null || analysisData === void 0 || (_analysisData$consoli2 = analysisData.consolidatedFlags) === null || _analysisData$consoli2 === void 0 ? void 0 : _analysisData$consoli2.filter(function (f) {
                return f.severity === 'critical';
              }).length) || 0,
              warning: (analysisData === null || analysisData === void 0 || (_analysisData$consoli3 = analysisData.consolidatedFlags) === null || _analysisData$consoli3 === void 0 ? void 0 : _analysisData$consoli3.filter(function (f) {
                return f.severity === 'warning';
              }).length) || 0
            },
            forensicPillars: {
              anatomical: !!(analysisData !== null && analysisData !== void 0 && analysisData.anatomicalAnalysis),
              physics: !!(analysisData !== null && analysisData !== void 0 && analysisData.physicsAnalysis),
              statistical: !!(analysisData !== null && analysisData !== void 0 && analysisData.statisticalAnalysis),
              exif: !!(analysisData !== null && analysisData !== void 0 && analysisData.exifForensics),
              behavioral: !!(analysisData !== null && analysisData !== void 0 && analysisData.behavioralAnalysis),
              audio: !!(analysisData !== null && analysisData !== void 0 && analysisData.audioForensics),
              expert: !!(analysisData !== null && analysisData !== void 0 && analysisData.expertAnalysis)
            },
            metadata: {
              hasExifData: !!(image.exifData && Object.keys(image.exifData).length > 0),
              processingTime: analysisData === null || analysisData === void 0 || (_analysisData$analysi = analysisData.analysisMetadata) === null || _analysisData$analysi === void 0 ? void 0 : _analysisData$analysi.processingTime,
              analysisVersion: (analysisData === null || analysisData === void 0 ? void 0 : analysisData.analysisVersion) || '2.1.0'
            },
            reportOptions: {
              availableTemplates: ['executive', 'technical', 'legal', 'summary', 'detailed'],
              availableFormats: ['pdf', 'json', 'html', 'csv'],
              estimatedSizes: {
                pdf: '2-4 MB',
                json: '500 KB - 1 MB',
                html: '1-2 MB',
                csv: '100-500 KB'
              },
              estimatedGenerationTime: '30-60 seconds'
            },
            recommendations: {
              suggestedTemplate: determineSuggestedTemplate(analysisData),
              suggestedFormat: 'pdf',
              includeChainOfCustody: req.privacyMode === 'JUDICIAL',
              includeRawData: false
            },
            requestId: requestId,
            timestamp: new Date().toISOString()
          };
          res.json(preview);
          _context7.n = 4;
          break;
        case 3:
          _context7.p = 3;
          _t19 = _context7.v;
          console.error('❌ Erreur getReportPreview:', _t19);
          res.status(500).json({
            error: 'Erreur génération aperçu rapport',
            type: 'PREVIEW_ERROR'
          });
        case 4:
          return _context7.a(2);
      }
    }, _callee7, null, [[0, 3]]);
  }));
  return function (_x7, _x8) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * Lister rapports disponibles avec filtres
 */
exports.listAvailableReports = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var _req$query3, sessionId, _req$query3$reportTyp, reportType, _req$query3$status, status, category, dateFrom, dateTo, _req$query3$page, page, _req$query3$limit, limit, requestId, sanitizedSessionId, sanitizedReportType, sanitizedStatus, sanitizedCategory, filter, pageNum, limitNum, skip, _yield$Promise$all5, _yield$Promise$all6, reports, totalCount, formattedReports, listStats, response, _t20;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _req$query3 = req.query, sessionId = _req$query3.sessionId, _req$query3$reportTyp = _req$query3.reportType, reportType = _req$query3$reportTyp === void 0 ? 'all' : _req$query3$reportTyp, _req$query3$status = _req$query3.status, status = _req$query3$status === void 0 ? 'completed' : _req$query3$status, category = _req$query3.category, dateFrom = _req$query3.dateFrom, dateTo = _req$query3.dateTo, _req$query3$page = _req$query3.page, page = _req$query3$page === void 0 ? 1 : _req$query3$page, _req$query3$limit = _req$query3.limit, limit = _req$query3$limit === void 0 ? 20 : _req$query3$limit;
          requestId = crypto.randomBytes(6).toString('hex');
          console.log("\uD83D\uDCCB Liste rapports demand\xE9e [".concat(requestId, "]"));

          // Sanitization des paramètres
          sanitizedSessionId = sanitizeInput(sessionId);
          sanitizedReportType = sanitizeInput(reportType);
          sanitizedStatus = sanitizeInput(status);
          sanitizedCategory = sanitizeInput(category); // Construction filtre
          filter = {};
          if (sanitizedSessionId) filter.sessionId = sanitizedSessionId;
          if (sanitizedReportType !== 'all') filter.reportType = sanitizedReportType;
          if (sanitizedStatus !== 'all') filter.status = sanitizedStatus;
          if (sanitizedCategory) filter.category = sanitizedCategory;
          if (dateFrom || dateTo) {
            filter.generatedAt = {};
            if (dateFrom) filter.generatedAt.$gte = new Date(dateFrom);
            if (dateTo) filter.generatedAt.$lte = new Date(dateTo);
          }

          // Pagination
          pageNum = Math.max(1, parseInt(page));
          limitNum = Math.min(100, Math.max(1, parseInt(limit)));
          skip = (pageNum - 1) * limitNum; // Exécution requêtes
          _context8.n = 1;
          return Promise.all([Report.find(filter).select('reportId reportType category status generatedAt formats statistics executiveSummary images').populate('images', 'originalName').sort({
            generatedAt: -1
          }).skip(skip).limit(limitNum).lean(), Report.countDocuments(filter)]);
        case 1:
          _yield$Promise$all5 = _context8.v;
          _yield$Promise$all6 = _slicedToArray(_yield$Promise$all5, 2);
          reports = _yield$Promise$all6[0];
          totalCount = _yield$Promise$all6[1];
          // Formatage résultats
          formattedReports = reports.map(function (report) {
            var _report$formats, _report$images, _report$images2, _report$executiveSumm, _report$statistics, _report$executiveSumm2;
            return {
              id: report._id,
              reportId: report.reportId,
              type: report.reportType,
              category: report.category,
              status: report.status,
              generatedAt: report.generatedAt,
              formats: ((_report$formats = report.formats) === null || _report$formats === void 0 ? void 0 : _report$formats.map(function (f) {
                return {
                  type: f.type,
                  available: f.generated,
                  size: f.fileSize ? formatBytes(f.fileSize) : null
                };
              })) || [],
              images: {
                count: ((_report$images = report.images) === null || _report$images === void 0 ? void 0 : _report$images.length) || 0,
                samples: ((_report$images2 = report.images) === null || _report$images2 === void 0 ? void 0 : _report$images2.slice(0, 3).map(function (img) {
                  return img.originalName;
                })) || []
              },
              summary: {
                overallRisk: (_report$executiveSumm = report.executiveSummary) === null || _report$executiveSumm === void 0 ? void 0 : _report$executiveSumm.overallRisk,
                totalImages: (_report$statistics = report.statistics) === null || _report$statistics === void 0 ? void 0 : _report$statistics.totalImages,
                criticalIssues: ((_report$executiveSumm2 = report.executiveSummary) === null || _report$executiveSumm2 === void 0 || (_report$executiveSumm2 = _report$executiveSumm2.criticalIssues) === null || _report$executiveSumm2 === void 0 ? void 0 : _report$executiveSumm2.length) || 0
              },
              downloadUrl: "/api/reports/".concat(report._id, "/download")
            };
          }); // Statistiques liste
          listStats = {
            total: totalCount,
            byType: {},
            byStatus: {},
            byCategory: {}
          };
          reports.forEach(function (report) {
            listStats.byType[report.reportType] = (listStats.byType[report.reportType] || 0) + 1;
            listStats.byStatus[report.status] = (listStats.byStatus[report.status] || 0) + 1;
            listStats.byCategory[report.category] = (listStats.byCategory[report.category] || 0) + 1;
          });
          response = {
            reports: formattedReports,
            pagination: {
              page: pageNum,
              limit: limitNum,
              total: totalCount,
              pages: Math.ceil(totalCount / limitNum)
            },
            statistics: listStats,
            filtering: {
              applied: {
                sessionId: sanitizedSessionId,
                reportType: sanitizedReportType,
                status: sanitizedStatus,
                category: sanitizedCategory,
                dateFrom: dateFrom,
                dateTo: dateTo
              },
              available: {
                reportTypes: ['single', 'batch', 'session', 'comparison'],
                statuses: ['generating', 'completed', 'failed'],
                categories: ['routine', 'investigation', 'legal', 'audit']
              }
            },
            requestId: requestId,
            timestamp: new Date().toISOString()
          };
          res.json(response);
          console.log("\u2705 Liste rapports: ".concat(formattedReports.length, "/").concat(totalCount, " [").concat(requestId, "]"));
          _context8.n = 3;
          break;
        case 2:
          _context8.p = 2;
          _t20 = _context8.v;
          console.error('❌ Erreur listAvailableReports:', _t20);
          res.status(500).json({
            error: 'Erreur récupération liste rapports',
            type: 'LIST_ERROR'
          });
        case 3:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return function (_x9, _x0) {
    return _ref8.apply(this, arguments);
  };
}();

/**
 * Télécharger un rapport existant
 */
exports.downloadExistingReport = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var _report$access, _report$formats$, _req$user9, reportId, format, report, requestedFormat, formatInfo, filename, _t21;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          reportId = req.params.reportId;
          format = req.query.format;
          _context9.n = 1;
          return Report.findById(reportId);
        case 1:
          report = _context9.v;
          if (report) {
            _context9.n = 2;
            break;
          }
          return _context9.a(2, res.status(404).json({
            error: 'Rapport non trouvé',
            type: 'REPORT_NOT_FOUND'
          }));
        case 2:
          if (!((_report$access = report.access) !== null && _report$access !== void 0 && (_report$access = _report$access.permissions) !== null && _report$access !== void 0 && _report$access.requiresAuth && !req.user)) {
            _context9.n = 3;
            break;
          }
          return _context9.a(2, res.status(401).json({
            error: 'Authentification requise',
            type: 'AUTH_REQUIRED'
          }));
        case 3:
          if (!report.isExpired) {
            _context9.n = 4;
            break;
          }
          return _context9.a(2, res.status(410).json({
            error: 'Rapport expiré',
            type: 'REPORT_EXPIRED',
            expiredAt: report.access.expiresAt
          }));
        case 4:
          // Trouver format demandé
          requestedFormat = format || ((_report$formats$ = report.formats[0]) === null || _report$formats$ === void 0 ? void 0 : _report$formats$.type);
          formatInfo = report.formats.find(function (f) {
            return f.type === requestedFormat;
          });
          if (!(!formatInfo || !formatInfo.generated)) {
            _context9.n = 5;
            break;
          }
          return _context9.a(2, res.status(404).json({
            error: 'Format non disponible',
            type: 'FORMAT_NOT_AVAILABLE',
            availableFormats: report.formats.filter(function (f) {
              return f.generated;
            }).map(function (f) {
              return f.type;
            })
          }));
        case 5:
          if (!(!formatInfo.filepath || !fsSync.existsSync(formatInfo.filepath))) {
            _context9.n = 6;
            break;
          }
          return _context9.a(2, res.status(404).json({
            error: 'Fichier rapport introuvable',
            type: 'FILE_NOT_FOUND'
          }));
        case 6:
          _context9.n = 7;
          return report.recordAccess('download', {
            ip: req.ip,
            userId: (_req$user9 = req.user) === null || _req$user9 === void 0 ? void 0 : _req$user9.sub,
            userAgent: req.get('User-Agent')
          });
        case 7:
          // Téléchargement
          filename = "rapport_".concat(report.reportId, "_").concat(requestedFormat, ".").concat(requestedFormat);
          res.setHeader('Content-Type', getContentType(requestedFormat));
          res.setHeader('Content-Length', formatInfo.fileSize);
          res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
          res.setHeader('X-Report-ID', report.reportId);
          res.download(formatInfo.filepath, filename, function (error) {
            if (error) {
              console.error('❌ Erreur téléchargement rapport:', error);
            } else {
              console.log("\u2705 Rapport t\xE9l\xE9charg\xE9: ".concat(report.reportId, " (").concat(requestedFormat, ")"));
            }
          });
          _context9.n = 9;
          break;
        case 8:
          _context9.p = 8;
          _t21 = _context9.v;
          console.error('❌ Erreur downloadExistingReport:', _t21);
          res.status(500).json({
            error: 'Erreur téléchargement rapport',
            type: 'DOWNLOAD_ERROR'
          });
        case 9:
          return _context9.a(2);
      }
    }, _callee9, null, [[0, 8]]);
  }));
  return function (_x1, _x10) {
    return _ref9.apply(this, arguments);
  };
}();

/**
 * Exporter données forensiques brutes
 */
exports.exportForensicData = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var _req$user0, imageId, _req$query4, _req$query4$format, format, _req$query4$includeRa, includeRawExif, _req$query4$includePi, includePillarsDetails, _req$query4$includeCh, includeChainOfCustody, objectId, _yield$Promise$all7, _yield$Promise$all8, image, analysis, sanitizedFormat, exportData, timestamp, sanitizedOriginalName, filename, csvData, xmlData, _t22, _t23;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          imageId = req.params.imageId;
          _req$query4 = req.query, _req$query4$format = _req$query4.format, format = _req$query4$format === void 0 ? 'json' : _req$query4$format, _req$query4$includeRa = _req$query4.includeRawExif, includeRawExif = _req$query4$includeRa === void 0 ? 'false' : _req$query4$includeRa, _req$query4$includePi = _req$query4.includePillarsDetails, includePillarsDetails = _req$query4$includePi === void 0 ? 'true' : _req$query4$includePi, _req$query4$includeCh = _req$query4.includeChainOfCustody, includeChainOfCustody = _req$query4$includeCh === void 0 ? 'false' : _req$query4$includeCh;
          objectId = req.forensicObjectId || validateObjectId(imageId);
          _context0.n = 1;
          return Promise.all([Image.findById(objectId).lean(), Analysis.findOne({
            imageId: objectId
          }).lean()]);
        case 1:
          _yield$Promise$all7 = _context0.v;
          _yield$Promise$all8 = _slicedToArray(_yield$Promise$all7, 2);
          image = _yield$Promise$all8[0];
          analysis = _yield$Promise$all8[1];
          if (image) {
            _context0.n = 2;
            break;
          }
          return _context0.a(2, res.status(404).json({
            error: 'Image non trouvée pour export',
            type: 'IMAGE_NOT_FOUND'
          }));
        case 2:
          // Sanitization des paramètres
          sanitizedFormat = sanitizeInput(format); // Construire données export selon privacy mode
          exportData = buildForensicExportData(image, analysis, {
            includeRawExif: includeRawExif === 'true' && req.privacyMode !== 'RESEARCH',
            includePillarsDetails: includePillarsDetails === 'true',
            includeChainOfCustody: includeChainOfCustody === 'true' && req.privacyMode === 'JUDICIAL',
            privacyMode: req.privacyMode || 'COMMERCIAL',
            requestedBy: ((_req$user0 = req.user) === null || _req$user0 === void 0 ? void 0 : _req$user0.sub) || 'anonymous'
          });
          timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          sanitizedOriginalName = sanitizeInput(image.originalName).replace(/[^a-zA-Z0-9.-]/g, '_');
          filename = "export-forensique_".concat(sanitizedOriginalName, "_").concat(timestamp, ".").concat(sanitizedFormat);
          _t22 = sanitizedFormat;
          _context0.n = _t22 === 'json' ? 3 : _t22 === 'csv' ? 4 : _t22 === 'xml' ? 5 : 6;
          break;
        case 3:
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
          res.json(exportData);
          return _context0.a(3, 7);
        case 4:
          csvData = convertToCSV(exportData);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
          res.send(csvData);
          return _context0.a(3, 7);
        case 5:
          xmlData = convertToXML(exportData);
          res.setHeader('Content-Type', 'application/xml');
          res.setHeader('Content-Disposition', "attachment; filename=\"".concat(filename, "\""));
          res.send(xmlData);
          return _context0.a(3, 7);
        case 6:
          return _context0.a(2, res.status(400).json({
            error: 'Format export non supporté',
            supportedFormats: ['json', 'csv', 'xml']
          }));
        case 7:
          console.log("\u2705 Export forensique: ".concat(imageId, " (").concat(sanitizedFormat, ")"));
          _context0.n = 9;
          break;
        case 8:
          _context0.p = 8;
          _t23 = _context0.v;
          console.error('❌ Erreur exportForensicData:', _t23);
          res.status(500).json({
            error: 'Erreur export données forensiques',
            type: 'EXPORT_ERROR'
          });
        case 9:
          return _context0.a(2);
      }
    }, _callee0, null, [[0, 8]]);
  }));
  return function (_x11, _x12) {
    return _ref0.apply(this, arguments);
  };
}();

// =====================================
// FONCTIONS UTILITAIRES OPTIMISÉES
// =====================================

function buildComprehensiveReportData(image, analysis, options) {
  var _image$hash, _analysisData$aggrega4, _analysisData$aggrega5, _image$riskClassifica3, _analysisData$aggrega6, _analysisData$consoli4, _analysisData$consoli5, _analysisData$consoli6, _analysisData$consoli7;
  var analysisData = analysis || extractLegacyAnalysis(image.forensicAnalysis);
  return {
    // Métadonnées rapport
    reportMetadata: {
      reportId: options.requestId,
      generatedAt: new Date().toISOString(),
      generatedBy: options.generatedBy,
      reportVersion: '3.0.0-forensic',
      template: options.template,
      format: options.format,
      language: options.language,
      privacyMode: options.generatedFor
    },
    // Informations image
    imageInformation: {
      id: image._id.toString(),
      filename: image.originalName,
      fileSize: image.size,
      mimeType: image.mimeType,
      uploadDate: image.createdAt,
      hash: options.generatedFor === 'JUDICIAL' ? image.hash : ((_image$hash = image.hash) === null || _image$hash === void 0 ? void 0 : _image$hash.substring(0, 20)) + '...',
      status: image.status
    },
    // Évaluation globale
    overallAssessment: {
      authenticityScore: (analysisData === null || analysisData === void 0 || (_analysisData$aggrega4 = analysisData.aggregatedScore) === null || _analysisData$aggrega4 === void 0 ? void 0 : _analysisData$aggrega4.authenticity) || image.authenticityScore || 0,
      riskLevel: (analysisData === null || analysisData === void 0 || (_analysisData$aggrega5 = analysisData.aggregatedScore) === null || _analysisData$aggrega5 === void 0 ? void 0 : _analysisData$aggrega5.riskLevel) || ((_image$riskClassifica3 = image.riskClassification) === null || _image$riskClassifica3 === void 0 ? void 0 : _image$riskClassifica3.level) || 'UNKNOWN',
      confidence: (analysisData === null || analysisData === void 0 || (_analysisData$aggrega6 = analysisData.aggregatedScore) === null || _analysisData$aggrega6 === void 0 ? void 0 : _analysisData$aggrega6.confidence) || 'medium',
      recommendation: generateRecommendationText(analysisData === null || analysisData === void 0 ? void 0 : analysisData.aggregatedScore),
      lastUpdated: (analysis === null || analysis === void 0 ? void 0 : analysis.updatedAt) || image.updatedAt
    },
    // Analyse des piliers
    forensicPillars: options.includePillars.reduce(function (pillars, pillarName) {
      var pillarData = analysisData === null || analysisData === void 0 ? void 0 : analysisData["".concat(pillarName, "Analysis")];
      if (pillarData) {
        pillars[pillarName] = {
          analyzed: true,
          overallScore: pillarData.overallScore,
          findings: extractPillarFindings(pillarData),
          confidence: calculatePillarConfidence(pillarData)
        };
      } else {
        pillars[pillarName] = {
          analyzed: false
        };
      }
      return pillars;
    }, {}),
    // Flags sécurité
    securityFlags: {
      total: (analysisData === null || analysisData === void 0 || (_analysisData$consoli4 = analysisData.consolidatedFlags) === null || _analysisData$consoli4 === void 0 ? void 0 : _analysisData$consoli4.length) || 0,
      flags: (analysisData === null || analysisData === void 0 ? void 0 : analysisData.consolidatedFlags) || [],
      distribution: {
        critical: (analysisData === null || analysisData === void 0 || (_analysisData$consoli5 = analysisData.consolidatedFlags) === null || _analysisData$consoli5 === void 0 ? void 0 : _analysisData$consoli5.filter(function (f) {
          return f.severity === 'critical';
        }).length) || 0,
        warning: (analysisData === null || analysisData === void 0 || (_analysisData$consoli6 = analysisData.consolidatedFlags) === null || _analysisData$consoli6 === void 0 ? void 0 : _analysisData$consoli6.filter(function (f) {
          return f.severity === 'warning';
        }).length) || 0,
        info: (analysisData === null || analysisData === void 0 || (_analysisData$consoli7 = analysisData.consolidatedFlags) === null || _analysisData$consoli7 === void 0 ? void 0 : _analysisData$consoli7.filter(function (f) {
          return f.severity === 'info';
        }).length) || 0
      }
    },
    // Métadonnées EXIF (selon privacy)
    exifMetadata: options.generatedFor !== 'RESEARCH' ? image.exifData : null,
    // Données brutes (si demandées)
    rawData: options.includeRawData ? {
      sessionId: image.sessionId,
      uploadMetadata: image.uploadMetadata,
      processingSteps: image.processingSteps
    } : null,
    // Chain of custody (si autorisée)
    chainOfCustody: options.includeChainOfCustody ? (analysis === null || analysis === void 0 ? void 0 : analysis.chainOfCustody) || [] : null
  };
}
function extractLegacyAnalysis(forensicAnalysis) {
  var _forensicAnalysis$aut, _forensicAnalysis$aut2;
  if (!forensicAnalysis) return null;
  return {
    aggregatedScore: {
      authenticity: (_forensicAnalysis$aut = forensicAnalysis.authenticity) === null || _forensicAnalysis$aut === void 0 ? void 0 : _forensicAnalysis$aut.score,
      confidence: (_forensicAnalysis$aut2 = forensicAnalysis.authenticity) === null || _forensicAnalysis$aut2 === void 0 ? void 0 : _forensicAnalysis$aut2.confidence
    },
    consolidatedFlags: forensicAnalysis.flags || []
  };
}
function calculateSessionStatistics(images, analyses) {
  var scores = images.map(function (img) {
    return img.authenticityScore;
  }).filter(function (s) {
    return s !== null;
  });
  var flags = analyses.reduce(function (total, analysis) {
    var _analysis$consolidate;
    return total + (((_analysis$consolidate = analysis.consolidatedFlags) === null || _analysis$consolidate === void 0 ? void 0 : _analysis$consolidate.length) || 0);
  }, 0);
  return {
    totalImages: images.length,
    analyzedImages: analyses.length,
    averageScore: scores.length > 0 ? Math.round(scores.reduce(function (sum, score) {
      return sum + score;
    }, 0) / scores.length) : 0,
    scoreDistribution: {
      high: scores.filter(function (s) {
        return s >= 80;
      }).length,
      medium: scores.filter(function (s) {
        return s >= 50 && s < 80;
      }).length,
      low: scores.filter(function (s) {
        return s < 50;
      }).length
    },
    totalFlags: flags,
    criticalFlags: analyses.reduce(function (total, analysis) {
      var _analysis$consolidate2;
      return total + (((_analysis$consolidate2 = analysis.consolidatedFlags) === null || _analysis$consolidate2 === void 0 ? void 0 : _analysis$consolidate2.filter(function (f) {
        return f.severity === 'critical';
      }).length) || 0);
    }, 0),
    highRiskImages: images.filter(function (img) {
      return (img.authenticityScore || 0) < 50;
    }).length
  };
}
function determineOverallRisk(stats) {
  var highRiskRatio = stats.highRiskImages / stats.totalImages;
  var criticalFlagRatio = stats.criticalFlags / Math.max(stats.totalImages, 1);
  if (criticalFlagRatio > 0.1 || highRiskRatio > 0.3) return 'critical';
  if (criticalFlagRatio > 0.05 || highRiskRatio > 0.1) return 'high';
  if (stats.criticalFlags > 0 || highRiskRatio > 0) return 'medium';
  return 'low';
}
function generateBatchRecommendation(stats) {
  var overallRisk = determineOverallRisk(stats);
  var recommendations = {
    'critical': '🚨 ACTION IMMÉDIATE: Plusieurs images hautement suspectes détectées. Expertise forensique obligatoire.',
    'high': '⚠️ ATTENTION: Images à risque détectées. Vérification experte recommandée.',
    'medium': '🔍 VIGILANCE: Quelques anomalies détectées. Analyse supplémentaire suggérée.',
    'low': '✅ ACCEPTABLE: Niveau de risque global faible. Surveillance de routine.'
  };
  return recommendations[overallRisk] || 'Évaluation non disponible.';
}
function determineBatchUrgency(stats) {
  if (stats.criticalFlags > 0) return 'critical';
  if (stats.highRiskImages > stats.totalImages * 0.1) return 'high';
  if (stats.totalFlags > stats.totalImages * 0.5) return 'medium';
  return 'low';
}
function generateForensicBreakdown(analyses) {
  var pillars = ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'];
  return pillars.reduce(function (breakdown, pillar) {
    var pillarAnalyses = analyses.map(function (a) {
      return a["".concat(pillar, "Analysis")];
    }).filter(Boolean);
    breakdown[pillar] = {
      analyzed: pillarAnalyses.length,
      averageScore: pillarAnalyses.length > 0 ? Math.round(pillarAnalyses.reduce(function (sum, p) {
        return sum + (p.overallScore || 0);
      }, 0) / pillarAnalyses.length) : 0,
      flagged: pillarAnalyses.filter(function (p) {
        return (p.overallScore || 100) < 70;
      }).length
    };
    return breakdown;
  }, {});
}
function buildImageSummary(image, analysis) {
  var _analysis$aggregatedS, _image$riskClassifica4, _analysis$aggregatedS2, _analysis$consolidate3, _analysis$consolidate4;
  return {
    id: image._id,
    filename: image.originalName,
    fileSize: formatBytes(image.size),
    uploadDate: image.createdAt,
    status: image.status,
    authenticityScore: image.authenticityScore || (analysis === null || analysis === void 0 || (_analysis$aggregatedS = analysis.aggregatedScore) === null || _analysis$aggregatedS === void 0 ? void 0 : _analysis$aggregatedS.authenticity) || 0,
    riskLevel: ((_image$riskClassifica4 = image.riskClassification) === null || _image$riskClassifica4 === void 0 ? void 0 : _image$riskClassifica4.level) || (analysis === null || analysis === void 0 || (_analysis$aggregatedS2 = analysis.aggregatedScore) === null || _analysis$aggregatedS2 === void 0 ? void 0 : _analysis$aggregatedS2.riskLevel) || 'UNKNOWN',
    flagsCount: (analysis === null || analysis === void 0 || (_analysis$consolidate3 = analysis.consolidatedFlags) === null || _analysis$consolidate3 === void 0 ? void 0 : _analysis$consolidate3.length) || 0,
    criticalFlags: (analysis === null || analysis === void 0 || (_analysis$consolidate4 = analysis.consolidatedFlags) === null || _analysis$consolidate4 === void 0 ? void 0 : _analysis$consolidate4.filter(function (f) {
      return f.severity === 'critical';
    }).length) || 0
  };
}
function determineSuggestedTemplate(analysisData) {
  var _analysisData$aggrega7;
  var flags = (analysisData === null || analysisData === void 0 ? void 0 : analysisData.consolidatedFlags) || [];
  var criticalFlags = flags.filter(function (f) {
    return f.severity === 'critical';
  }).length;
  var score = (analysisData === null || analysisData === void 0 || (_analysisData$aggrega7 = analysisData.aggregatedScore) === null || _analysisData$aggrega7 === void 0 ? void 0 : _analysisData$aggrega7.authenticity) || 0;
  if (criticalFlags > 0 || score < 30) return 'legal';
  if (score < 50 || flags.length > 5) return 'detailed';
  if (score > 80 && flags.length === 0) return 'summary';
  return 'executive';
}
function buildForensicExportData(image, analysis, options) {
  var _image$hash2;
  var baseData = {
    exportMetadata: {
      exportedAt: new Date().toISOString(),
      exportVersion: '3.0.0',
      privacyMode: options.privacyMode,
      requestedBy: options.requestedBy
    },
    imageInformation: {
      id: image._id,
      filename: image.originalName,
      size: image.size,
      mimeType: image.mimeType,
      uploadDate: image.createdAt,
      hash: options.privacyMode === 'JUDICIAL' ? image.hash : ((_image$hash2 = image.hash) === null || _image$hash2 === void 0 ? void 0 : _image$hash2.substring(0, 16)) + '...'
    },
    forensicResults: analysis ? {
      analysisVersion: analysis.analysisVersion,
      aggregatedScore: analysis.aggregatedScore,
      flags: analysis.consolidatedFlags
    } : extractLegacyAnalysis(image.forensicAnalysis)
  };
  if (options.includeRawExif) {
    baseData.exifData = image.exifData;
  }
  if (options.includePillarsDetails && analysis) {
    baseData.pillarResults = {
      anatomical: analysis.anatomicalAnalysis,
      physics: analysis.physicsAnalysis,
      statistical: analysis.statisticalAnalysis,
      exif: analysis.exifForensics,
      behavioral: analysis.behavioralAnalysis,
      audio: analysis.audioForensics,
      expert: analysis.expertAnalysis
    };
  }
  if (options.includeChainOfCustody) {
    baseData.chainOfCustody = (analysis === null || analysis === void 0 ? void 0 : analysis.chainOfCustody) || [];
  }
  return baseData;
}
function getContentType(format) {
  var contentTypes = {
    'pdf': 'application/pdf',
    'json': 'application/json',
    'html': 'text/html',
    'csv': 'text/csv',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xml': 'application/xml'
  };
  return contentTypes[format] || 'application/octet-stream';
}
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
function extractPillarFindings(pillarData) {
  if (!pillarData) return [];
  var findings = [];
  if (pillarData.anomalies) findings.push.apply(findings, _toConsumableArray(pillarData.anomalies));
  if (pillarData.violations) findings.push.apply(findings, _toConsumableArray(pillarData.violations));
  if (pillarData.flags) findings.push.apply(findings, _toConsumableArray(pillarData.flags));
  return findings;
}
function calculatePillarConfidence(pillarData) {
  if (!pillarData) return 'low';
  var score = pillarData.overallScore || 0;
  var hasFindings = extractPillarFindings(pillarData).length > 0;
  if (score > 80 && hasFindings) return 'high';
  if (score > 60 || hasFindings) return 'medium';
  return 'low';
}
function generateRecommendationText(aggregatedScore) {
  if (!aggregatedScore) return 'Analyse incomplète - Évaluation impossible';
  var score = aggregatedScore.authenticity || 0;
  if (score >= 90) return 'Image hautement authentique - Utilisation recommandée';
  if (score >= 80) return 'Image authentique - Utilisation sécurisée';
  if (score >= 70) return 'Image probablement authentique - Utilisation avec vigilance standard';
  if (score >= 50) return 'Authenticité incertaine - Vérification supplémentaire recommandée';
  if (score >= 30) return '⚠️ Image suspecte - Investigation forensique approfondie nécessaire';
  return '🚨 Image hautement suspecte - Ne pas utiliser sans expertise forensique complète';
}

// Placeholders pour les fonctions de génération spécialisées
function generateHtmlReport(_x13) {
  return _generateHtmlReport.apply(this, arguments);
}
function _generateHtmlReport() {
  _generateHtmlReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(reportData) {
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.n) {
        case 0:
          return _context1.a(2, "<!DOCTYPE html>\n<html>\n<head><title>Rapport Forensique</title></head>\n<body>\n<h1>Rapport Forensique</h1>\n<pre>".concat(JSON.stringify(reportData, null, 2), "</pre>\n</body>\n</html>"));
      }
    }, _callee1);
  }));
  return _generateHtmlReport.apply(this, arguments);
}
function generateCsvReport(_x14) {
  return _generateCsvReport.apply(this, arguments);
}
function _generateCsvReport() {
  _generateCsvReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(reportData) {
    var rows;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.n) {
        case 0:
          rows = ['Métrique,Valeur', "Nom fichier,".concat(reportData.imageInformation.filename), "Score authenticit\xE9,".concat(reportData.overallAssessment.authenticityScore), "Niveau risque,".concat(reportData.overallAssessment.riskLevel), "Nombre flags,".concat(reportData.securityFlags.total)];
          return _context10.a(2, rows.join('\n'));
      }
    }, _callee10);
  }));
  return _generateCsvReport.apply(this, arguments);
}
function generateDocxReport(_x15, _x16) {
  return _generateDocxReport.apply(this, arguments);
}
function _generateDocxReport() {
  _generateDocxReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(reportData, reportPath) {
    var content;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.n) {
        case 0:
          // Placeholder - implémentation DOCX à faire
          content = JSON.stringify(reportData, null, 2);
          _context11.n = 1;
          return fs.writeFile(reportPath, content);
        case 1:
          return _context11.a(2, reportPath);
      }
    }, _callee11);
  }));
  return _generateDocxReport.apply(this, arguments);
}
function generateBatchPdfReport(_x17, _x18) {
  return _generateBatchPdfReport.apply(this, arguments);
}
function _generateBatchPdfReport() {
  _generateBatchPdfReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(batchData, reportPath) {
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          _context12.n = 1;
          return generateForensicPdfReport(batchData, reportPath, {
            template: 'batch'
          });
        case 1:
          return _context12.a(2, _context12.v);
      }
    }, _callee12);
  }));
  return _generateBatchPdfReport.apply(this, arguments);
}
function generateBatchHtmlReport(_x19) {
  return _generateBatchHtmlReport.apply(this, arguments);
}
function _generateBatchHtmlReport() {
  _generateBatchHtmlReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(batchData) {
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.n) {
        case 0:
          return _context13.a(2, "<!DOCTYPE html>\n<html>\n<head><title>Rapport Batch Forensique</title></head>\n<body>\n<h1>Rapport Batch Forensique</h1>\n<pre>".concat(JSON.stringify(batchData, null, 2), "</pre>\n</body>\n</html>"));
      }
    }, _callee13);
  }));
  return _generateBatchHtmlReport.apply(this, arguments);
}
function generateBatchCsvReport(_x20) {
  return _generateBatchCsvReport.apply(this, arguments);
}
function _generateBatchCsvReport() {
  _generateBatchCsvReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(batchData) {
    var rows;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          rows = ['Session ID,Total Images,Images Analysées,Score Moyen,Images Haute Risk,Flags Total', "".concat(batchData.sessionId, ",").concat(batchData.sessionSummary.totalImages, ",").concat(batchData.sessionSummary.analyzedImages, ",").concat(batchData.statisticalSummary.averageScore, ",").concat(batchData.statisticalSummary.highRiskImages, ",").concat(batchData.statisticalSummary.totalFlags)];
          return _context14.a(2, rows.join('\n'));
      }
    }, _callee14);
  }));
  return _generateBatchCsvReport.apply(this, arguments);
}
function convertToCSV(data) {
  // Implémentation simple CSV
  return Object.entries(data).map(function (_ref1) {
    var _ref10 = _slicedToArray(_ref1, 2),
      key = _ref10[0],
      value = _ref10[1];
    return "".concat(key, ",\"").concat(_typeof(value) === 'object' ? JSON.stringify(value) : value, "\"");
  }).join('\n');
}
function convertToXML(data) {
  // Implémentation simple XML
  var xmlContent = Object.entries(data).map(function (_ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
      key = _ref12[0],
      value = _ref12[1];
    return "  <".concat(key, ">").concat(_typeof(value) === 'object' ? JSON.stringify(value) : value, "</").concat(key, ">");
  }).join('\n');
  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<forensicExport>\n".concat(xmlContent, "\n</forensicExport>");
}

// Nettoyage périodique du cache
setInterval(function () {
  var now = Date.now();
  var _iterator = _createForOfIteratorHelper(reportCache),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        key = _step$value[0],
        value = _step$value[1];
      if (now - value.timestamp > REPORT_CACHE_TTL) {
        reportCache["delete"](key);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}, REPORT_CACHE_TTL); // Nettoyer toutes les 10 minutes

module.exports = exports;