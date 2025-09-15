"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var express = require('express');
var router = express.Router();
var rateLimit = require('express-rate-limit');

// Contrôleurs rapports forensiques
var _require = require('../controllers/reportController'),
  generateForensicReport = _require.generateForensicReport,
  generateBatchReport = _require.generateBatchReport,
  getReportPreview = _require.getReportPreview,
  listAvailableReports = _require.listAvailableReports,
  downloadExistingReport = _require.downloadExistingReport,
  exportForensicData = _require.exportForensicData;

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
// RATE LIMITING RAPPORTS - CORRIGÉ
// =====================================

var reportGenerationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  // 1 heure
  max: 20,
  // 20 rapports par heure max
  message: {
    error: 'Limite de génération de rapports dépassée',
    type: 'REPORT_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Alternative: Utiliser skip pour personnaliser si nécessaire
  skip: function skip(req) {
    var _req$user;
    // Permettre aux admins de bypasser le rate limiting
    return (_req$user = req.user) === null || _req$user === void 0 || (_req$user = _req$user.roles) === null || _req$user === void 0 ? void 0 : _req$user.includes('admin');
  }
});

// Rate limiting spécialisé pour exports
var exportRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  // 1 heure
  max: 10,
  // 10 exports par heure max
  message: {
    error: 'Limite d\'export dépassée',
    type: 'EXPORT_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// =====================================
// ROUTES RAPPORTS FORENSIQUES
// =====================================

/**
 * @route GET /api/reports/:imageId/generate
 * @desc Générer rapport forensique complet avec tous les piliers
 * @access Private - Requires analyst role
 * @param {string} imageId - ID MongoDB de l'image
 * @query {string} template - Template (executive, technical, legal, summary, detailed)
 * @query {string} format - Format (pdf, json, html, csv, docx)
 * @query {string} language - Langue (fr, en, es, de)
 * @query {boolean} includeRawData - Inclure données brutes
 * @query {string} includePillars - Piliers à inclure (all ou comma-separated)
 * @query {string} includeChainOfCustody - Inclure chain of custody (auto, true, false)
 */
router.get('/:imageId/generate', reportGenerationRateLimit, auth, requireRole(['forensic_analyst', 'expert', 'admin']), forensicLogging, validateForensicObjectId('imageId'), validateForensicQuery, generateForensicReport);

/**
 * @route GET /api/reports/session/:sessionId/batch
 * @desc Générer rapport batch pour session complète
 * @access Private - Requires analyst role
 * @param {string} sessionId - ID de la session
 * @query {string} template - Template de rapport
 * @query {string} format - Format de sortie
 * @query {boolean} includeSummaryStats - Inclure statistiques résumées
 * @query {boolean} includeIndividualAnalyses - Inclure analyses individuelles
 */
router.get('/session/:sessionId/batch', reportGenerationRateLimit, auth, requireRole(['forensic_analyst', 'admin']), forensicLogging, validateForensicQuery, generateBatchReport);

/**
 * @route GET /api/reports/:imageId/preview
 * @desc Obtenir aperçu rapport avant génération
 * @access Private
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/preview', auth, validateForensicObjectId('imageId'), getReportPreview);

/**
 * @route GET /api/reports
 * @desc Lister rapports disponibles avec filtres
 * @access Private
 * @query {string} sessionId - Filtrer par session
 * @query {string} reportType - Type de rapport (single, batch, session, comparison)
 * @query {string} status - Statut (generating, completed, failed)
 * @query {string} category - Catégorie (routine, investigation, legal, audit)
 * @query {string} dateFrom - Date de début
 * @query {string} dateTo - Date de fin
 * @query {number} page - Page
 * @query {number} limit - Limite par page
 */
router.get('/', auth, validateForensicQuery, listAvailableReports);

/**
 * @route GET /api/reports/:reportId/download
 * @desc Télécharger rapport existant
 * @access Private (avec contrôles d'accès spécifiques)
 * @param {string} reportId - ID du rapport
 * @query {string} format - Format spécifique à télécharger
 */
router.get('/:reportId/download', auth, forensicLogging, validateForensicObjectId('reportId'), downloadExistingReport);

/**
 * @route GET /api/reports/:imageId/export
 * @desc Exporter données forensiques brutes
 * @access Private - Requires specific permissions
 * @param {string} imageId - ID MongoDB de l'image
 * @query {string} format - Format export (json, csv, xml)
 * @query {boolean} includeRawExif - Inclure EXIF brut
 * @query {boolean} includePillarsDetails - Inclure détails piliers
 * @query {boolean} includeChainOfCustody - Inclure chain of custody (JUDICIAL uniquement)
 */
router.get('/:imageId/export', exportRateLimit,
// Rate limiting spécifique pour exports
auth, requireRole(['forensic_analyst', 'expert', 'admin']), requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']),
// Pas d'export en RESEARCH
forensicLogging, validateForensicObjectId('imageId'), validateForensicQuery, exportForensicData);

/**
 * @route POST /api/reports/custom
 * @desc Générer rapport personnalisé avec configuration avancée
 * @access Private - Requires expert role
 * @body {array} imageIds - Liste des IDs d'images
 * @body {object} customConfig - Configuration personnalisée
 * @body {object} layout - Configuration mise en page
 * @body {object} filters - Filtres de données
 */
router.post('/custom', reportGenerationRateLimit, auth, requireRole(['expert', 'admin']), requirePrivacyMode(['JUDICIAL']),
// Rapports custom uniquement en mode JUDICIAL
forensicLogging, validateForensicBody, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var _req$body, imageIds, _req$body$customConfi, customConfig, _req$body$layout, layout, _req$body$filters, filters, validLayouts, customReportId, defaultCustomConfig, finalConfig, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _req$body = req.body, imageIds = _req$body.imageIds, _req$body$customConfi = _req$body.customConfig, customConfig = _req$body$customConfi === void 0 ? {} : _req$body$customConfi, _req$body$layout = _req$body.layout, layout = _req$body$layout === void 0 ? {} : _req$body$layout, _req$body$filters = _req$body.filters, filters = _req$body$filters === void 0 ? {} : _req$body$filters;
          if (!(!imageIds || !Array.isArray(imageIds) || imageIds.length === 0)) {
            _context2.n = 1;
            break;
          }
          return _context2.a(2, res.status(400).json({
            error: 'Liste d\'IDs d\'images requise',
            type: 'MISSING_IMAGE_IDS'
          }));
        case 1:
          if (!(imageIds.length > 20)) {
            _context2.n = 2;
            break;
          }
          return _context2.a(2, res.status(400).json({
            error: 'Maximum 20 images pour rapport personnalisé',
            type: 'TOO_MANY_IMAGES',
            maxImages: 20
          }));
        case 2:
          // Validation configuration personnalisée
          validLayouts = ['single-column', 'two-column', 'comparison', 'timeline'];
          if (!(layout.type && !validLayouts.includes(layout.type))) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(400).json({
            error: 'Type de mise en page invalide',
            type: 'INVALID_LAYOUT',
            validLayouts: validLayouts
          }));
        case 3:
          customReportId = require('crypto').randomBytes(8).toString('hex'); // Configuration par défaut pour rapport personnalisé
          defaultCustomConfig = {
            template: 'custom',
            format: 'pdf',
            language: 'fr',
            sections: {
              coverPage: true,
              executiveSummary: true,
              methodology: true,
              individualAnalyses: true,
              comparativeAnalysis: imageIds.length > 1,
              conclusions: true,
              appendices: true
            },
            advanced: {
              includeStatisticalCharts: true,
              includePillarBreakdown: true,
              includeRiskMatrix: true,
              includeTimelineAnalysis: imageIds.length > 1,
              customBranding: layout.branding || false
            }
          };
          finalConfig = _objectSpread(_objectSpread({}, defaultCustomConfig), customConfig); // Simuler génération rapport custom (à implémenter)
          setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
            var _req$user2, Report, customReport, _t;
            return _regenerator().w(function (_context) {
              while (1) switch (_context.p = _context.n) {
                case 0:
                  _context.p = 0;
                  // Ici, implémenter la vraie génération custom
                  console.log("\uD83C\uDFA8 G\xE9n\xE9ration rapport custom: ".concat(customReportId));

                  // Pour l'instant, créer une entrée de base
                  Report = require('../models/Report');
                  customReport = new Report({
                    reportId: "CUSTOM-".concat(customReportId),
                    sessionId: "custom-".concat(Date.now()),
                    reportType: 'custom',
                    category: 'investigation',
                    classification: 'restricted',
                    images: imageIds,
                    configuration: {
                      template: 'custom',
                      customConfig: finalConfig,
                      layout: layout,
                      filters: filters
                    },
                    generation: {
                      requestedBy: {
                        userId: (_req$user2 = req.user) === null || _req$user2 === void 0 ? void 0 : _req$user2.sub,
                        ip: req.ip,
                        timestamp: new Date()
                      }
                    },
                    status: 'generating'
                  });
                  _context.n = 1;
                  return customReport.save();
                case 1:
                  console.log("\u2705 Rapport custom initi\xE9: ".concat(customReportId));
                  _context.n = 3;
                  break;
                case 2:
                  _context.p = 2;
                  _t = _context.v;
                  console.error("\u274C Erreur g\xE9n\xE9ration custom ".concat(customReportId, ":"), _t);
                case 3:
                  return _context.a(2);
              }
            }, _callee, null, [[0, 2]]);
          })), 1000);
          res.status(202).json({
            success: true,
            message: 'Génération rapport personnalisé initiée',
            customReportId: customReportId,
            config: finalConfig,
            estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
            // +10min
            trackingUrl: "/api/reports/custom/".concat(customReportId, "/status"),
            timestamp: new Date().toISOString()
          });
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          console.error('❌ Erreur custom report:', _t2);
          res.status(500).json({
            error: 'Erreur génération rapport personnalisé',
            type: 'CUSTOM_REPORT_ERROR'
          });
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 4]]);
  }));
  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

/**
 * @route GET /api/reports/custom/:customReportId/status
 * @desc Obtenir statut génération rapport personnalisé
 * @access Private
 * @param {string} customReportId - ID du rapport personnalisé
 */
router.get('/custom/:customReportId/status', auth, /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _report$generation, _report$issues, customReportId, Report, report, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          customReportId = req.params.customReportId;
          Report = require('../models/Report');
          _context3.n = 1;
          return Report.findOne({
            reportId: "CUSTOM-".concat(customReportId)
          }).select('status progress generation.processingTime issues');
        case 1:
          report = _context3.v;
          if (report) {
            _context3.n = 2;
            break;
          }
          return _context3.a(2, res.status(404).json({
            error: 'Rapport personnalisé non trouvé',
            type: 'CUSTOM_REPORT_NOT_FOUND'
          }));
        case 2:
          res.json({
            customReportId: customReportId,
            status: report.status,
            progress: report.progress || 0,
            processingTime: (_report$generation = report.generation) === null || _report$generation === void 0 ? void 0 : _report$generation.processingTime,
            issues: ((_report$issues = report.issues) === null || _report$issues === void 0 ? void 0 : _report$issues.filter(function (i) {
              return !i.resolved;
            })) || [],
            timestamp: new Date().toISOString()
          });
          _context3.n = 4;
          break;
        case 3:
          _context3.p = 3;
          _t3 = _context3.v;
          console.error('❌ Erreur custom report status:', _t3);
          res.status(500).json({
            error: 'Erreur statut rapport personnalisé',
            type: 'CUSTOM_STATUS_ERROR'
          });
        case 4:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 3]]);
  }));
  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}());

/**
 * @route GET /api/reports/templates
 * @desc Obtenir liste des templates disponibles avec aperçu
 * @access Private
 */
router.get('/templates', auth, /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var templates;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          try {
            templates = {
              executive: {
                name: 'Résumé Exécutif',
                description: 'Rapport synthétique pour direction et décideurs',
                sections: ['Résumé', 'Conclusions principales', 'Recommandations'],
                estimatedPages: '2-4 pages',
                audience: 'Direction, Management',
                generationTime: '30-45 secondes'
              },
              technical: {
                name: 'Analyse Technique',
                description: 'Rapport détaillé pour experts techniques',
                sections: ['Méthodologie', 'Analyse détaillée des 7 piliers', 'Données techniques'],
                estimatedPages: '10-15 pages',
                audience: 'Experts forensiques, Analystes',
                generationTime: '60-90 secondes'
              },
              legal: {
                name: 'Rapport Judiciaire',
                description: 'Rapport conforme aux standards légaux',
                sections: ['Chain of custody', 'Méthodologie certifiée', 'Conclusions juridiques'],
                estimatedPages: '8-12 pages',
                audience: 'Tribunaux, Avocats, Forces de l\'ordre',
                generationTime: '90-120 secondes'
              },
              summary: {
                name: 'Résumé Rapide',
                description: 'Vue d\'ensemble concise des résultats',
                sections: ['Scores principaux', 'Flags critiques', 'Recommandation'],
                estimatedPages: '1-2 pages',
                audience: 'Utilisation rapide, Screening',
                generationTime: '15-30 secondes'
              },
              detailed: {
                name: 'Analyse Complète',
                description: 'Rapport exhaustif avec toutes les données',
                sections: ['Tous les piliers', 'EXIF complet', 'Historique traitement'],
                estimatedPages: '15-25 pages',
                audience: 'Investigation approfondie, Expertise',
                generationTime: '120-180 secondes'
              },
              comparison: {
                name: 'Rapport Comparatif',
                description: 'Analyse comparative entre plusieurs images',
                sections: ['Comparaisons croisées', 'Similarités', 'Divergences'],
                estimatedPages: '6-10 pages',
                audience: 'Analyse de séries, Détection patterns',
                generationTime: '90-150 secondes'
              }
            };
            res.json({
              templates: templates,
              defaultTemplate: 'executive',
              recommendedByRole: {
                'forensic_analyst': 'technical',
                'expert': 'detailed',
                'admin': 'executive',
                'legal': 'legal'
              },
              timestamp: new Date().toISOString()
            });
          } catch (error) {
            console.error('❌ Erreur templates list:', error);
            res.status(500).json({
              error: 'Erreur récupération templates',
              type: 'TEMPLATES_ERROR'
            });
          }
        case 1:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return function (_x5, _x6) {
    return _ref4.apply(this, arguments);
  };
}());

// =====================================
// GESTION D'ERREURS ROUTES
// =====================================

router.use(function (error, req, res, next) {
  console.error('❌ Erreur route reports:', error);
  res.status(error.status || 500).json(_objectSpread({
    error: error.message || 'Erreur interne route reports',
    type: 'REPORTS_ROUTE_ERROR',
    timestamp: new Date().toISOString()
  }, process.env.NODE_ENV === 'development' && {
    stack: error.stack
  }));
});
module.exports = router;