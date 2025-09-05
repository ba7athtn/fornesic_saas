"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var PDFDocument = require('pdfkit');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

// =====================================
// GÉNÉRATEUR PDF FORENSIQUE ROBUSTE - VERSION 4.0 CORRIGÉE
// =====================================
var ForensicPDFGenerator = /*#__PURE__*/function () {
  function ForensicPDFGenerator() {
    _classCallCheck(this, ForensicPDFGenerator);
    this.version = '4.0.0-production';
    this.colors = {
      primary: '#1a365d',
      secondary: '#3182ce',
      success: '#38a169',
      warning: '#d69e2e',
      danger: '#e53e3e',
      info: '#3182ce',
      text: '#2d3748',
      lightGray: '#f7fafc',
      gray: '#718096'
    };
    this.fonts = {
      regular: 'Helvetica',
      bold: 'Helvetica-Bold',
      italic: 'Helvetica-Oblique'
    };
    this.pageConfig = {
      size: 'A4',
      width: 595.28,
      height: 841.89,
      margins: {
        top: 60,
        bottom: 60,
        left: 50,
        right: 50
      }
    };
  }

  /**
   * Génération PDF forensique avec gestion d'erreur robuste
   */
  return _createClass(ForensicPDFGenerator, [{
    key: "generateForensicPdfReport",
    value: (function () {
      var _generateForensicPdfReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data, outputPath) {
        var _this = this;
        var options,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              options = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
              return _context.a(2, new Promise(function (resolve, reject) {
                try {
                  console.log("\uD83D\uDCC4 G\xE9n\xE9ration PDF forensique: ".concat(path.basename(outputPath)));

                  // Validation entrée robuste
                  var validationResult = _this.validateInputData(data, outputPath);
                  if (!validationResult.valid) {
                    throw new Error("Validation \xE9chou\xE9e: ".concat(validationResult.errors.join(', ')));
                  }

                  // Préparation données
                  var reportData = _this.prepareReportData(data, options);

                  // Création document PDF
                  var doc = new PDFDocument({
                    size: _this.pageConfig.size,
                    margins: _this.pageConfig.margins,
                    bufferPages: true,
                    autoFirstPage: true,
                    info: {
                      Title: "Rapport Forensique - ".concat(reportData.imageName),
                      Author: 'Ba7ath Forensic Platform',
                      Creator: "Ba7ath PDF Generator v".concat(_this.version),
                      CreationDate: new Date(),
                      Keywords: 'forensic,analysis,security,authentication'
                    }
                  });

                  // Création dossier de sortie
                  _this.ensureDirectoryExists(path.dirname(outputPath));

                  // Stream vers fichier
                  var stream = fs.createWriteStream(outputPath);
                  doc.pipe(stream);

                  // Génération contenu PDF complet
                  _this.generateCompleteReport(doc, reportData);

                  // Finalisation
                  doc.end();

                  // Gestion événements stream
                  stream.on('finish', function () {
                    try {
                      var stats = fs.statSync(outputPath);
                      console.log("\u2705 PDF g\xE9n\xE9r\xE9: ".concat(outputPath, " (").concat(_this.formatFileSize(stats.size), ")"));
                      resolve({
                        path: outputPath,
                        size: stats.size,
                        pages: doc.bufferedPageRange().count,
                        success: true
                      });
                    } catch (statError) {
                      reject(new Error("Erreur v\xE9rification fichier: ".concat(statError.message)));
                    }
                  });
                  stream.on('error', function (streamError) {
                    console.error("\u274C Erreur \xE9criture PDF: ".concat(streamError.message));
                    _this.cleanupFile(outputPath);
                    reject(new Error("\xC9criture PDF \xE9chou\xE9e: ".concat(streamError.message)));
                  });

                  // Timeout sécurité
                  var timeout = setTimeout(function () {
                    doc.end();
                    _this.cleanupFile(outputPath);
                    reject(new Error('Timeout génération PDF (60 secondes)'));
                  }, 60000);
                  stream.on('finish', function () {
                    return clearTimeout(timeout);
                  });
                } catch (error) {
                  console.error("\u274C Erreur g\xE9n\xE9ration PDF: ".concat(error.message));
                  _this.cleanupFile(outputPath);
                  reject(error);
                }
              }));
          }
        }, _callee);
      }));
      function generateForensicPdfReport(_x, _x2) {
        return _generateForensicPdfReport.apply(this, arguments);
      }
      return generateForensicPdfReport;
    }()
    /**
     * Génération du rapport complet
     */
    )
  }, {
    key: "generateCompleteReport",
    value: function generateCompleteReport(doc, data) {
      var currentPage = 1;
      try {
        // PAGE 1: Header + Résumé exécutif
        this.addReportHeader(doc, data);
        this.addExecutiveSummary(doc, data);
        this.addPageFooter(doc, currentPage++);

        // PAGE 2: Informations fichier
        this.addNewPage(doc);
        this.addFileInformation(doc, data);
        this.addPageFooter(doc, currentPage++);

        // PAGE 3: Analyse EXIF
        this.addNewPage(doc);
        this.addExifAnalysis(doc, data);
        this.addPageFooter(doc, currentPage++);

        // PAGE 4: Analyse forensique
        this.addNewPage(doc);
        this.addForensicAnalysis(doc, data);
        this.addPageFooter(doc, currentPage++);

        // PAGE 5: Méthodologie
        this.addNewPage(doc);
        this.addMethodologySection(doc, data);
        this.addPageFooter(doc, currentPage++);

        // PAGE 6: Conclusions
        this.addNewPage(doc);
        this.addConclusionsAndRecommendations(doc, data);
        this.addPageFooter(doc, currentPage++);
      } catch (error) {
        console.error("\u274C Erreur g\xE9n\xE9ration contenu: ".concat(error.message));
        throw error;
      }
    }

    /**
     * Header du rapport
     */
  }, {
    key: "addReportHeader",
    value: function addReportHeader(doc, data) {
      var _this2 = this;
      var startY = doc.y;

      // Titre principal
      doc.fontSize(24).font(this.fonts.bold).fillColor(this.colors.primary).text('BA7ATH FORENSIC ANALYSIS', {
        align: 'center'
      });
      doc.moveDown(0.3);

      // Sous-titre
      doc.fontSize(16).font(this.fonts.regular).fillColor(this.colors.text).text('Rapport d\'Analyse Forensique Numérique', {
        align: 'center'
      });
      doc.moveDown(0.2);

      // Description
      doc.fontSize(12).fillColor(this.colors.gray).text('Analyse Professionnelle Conforme aux Standards ISO/IEC 27037', {
        align: 'center'
      });
      doc.moveDown(0.8);

      // Informations du rapport
      var reportInfo = [['Généré le:', new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })], ['ID Rapport:', data.reportId], ['Version:', this.version], ['Fichier analysé:', this.safeTruncate(data.imageName, 40)]];
      var infoY = doc.y;
      reportInfo.forEach(function (_ref, index) {
        var _ref2 = _slicedToArray(_ref, 2),
          label = _ref2[0],
          value = _ref2[1];
        var y = infoY + index * 15;
        doc.fontSize(10).font(_this2.fonts.bold).fillColor(_this2.colors.text).text(label, 50, y);
        doc.font(_this2.fonts.regular).text(value, 130, y);
      });
      doc.y = infoY + reportInfo.length * 15 + 20;

      // Ligne de séparation
      this.addSeparatorLine(doc);
      doc.moveDown(1);
    }

    /**
     * Résumé exécutif
     */
  }, {
    key: "addExecutiveSummary",
    value: function addExecutiveSummary(doc, data) {
      var _this3 = this;
      this.addSectionTitle(doc, 'RÉSUMÉ EXÉCUTIF');
      var authenticityScore = data.authenticityScore || 0;
      var riskLevel = this.calculateRiskLevel(authenticityScore);
      var flags = data.securityFlags || [];

      // Score central dans un cadre
      var boxY = doc.y + 10;
      var boxHeight = 80;
      var centerX = this.pageConfig.width / 2 - 60;

      // Cadre du score
      doc.roundedRect(centerX, boxY, 120, boxHeight, 5).strokeColor(riskLevel.color).lineWidth(2).stroke();

      // Score
      doc.fontSize(32).font(this.fonts.bold).fillColor(riskLevel.color).text("".concat(authenticityScore, "/100"), centerX + 10, boxY + 15, {
        width: 100,
        align: 'center'
      });

      // Label
      doc.fontSize(12).font(this.fonts.regular).fillColor(this.colors.text).text('Score d\'Authenticité', centerX + 10, boxY + 55, {
        width: 100,
        align: 'center'
      });
      doc.y = boxY + boxHeight + 20;

      // Niveau de risque
      doc.fontSize(18).font(this.fonts.bold).fillColor(riskLevel.color).text("Niveau de Risque: ".concat(riskLevel.label), {
        align: 'center'
      });
      doc.moveDown(1);

      // Informations principales
      var mainInfo = [['Fichier:', this.safeTruncate(data.imageName, 50)], ['Taille:', this.formatFileSize(data.fileSize)], ['Format:', data.mimeType || 'Non spécifié'], ['Analyse:', new Date().toLocaleDateString('fr-FR')]];
      mainInfo.forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          label = _ref4[0],
          value = _ref4[1];
        doc.fontSize(11).font(_this3.fonts.bold).fillColor(_this3.colors.text).text("".concat(label, " "), {
          continued: true
        }).font(_this3.fonts.regular).text(value);
      });
      doc.moveDown(1);

      // Alertes si présentes
      if (flags.length > 0) {
        var criticalCount = flags.filter(function (f) {
          return f.severity === 'critical';
        }).length;
        var warningCount = flags.filter(function (f) {
          return f.severity === 'warning';
        }).length;
        doc.fontSize(14).font(this.fonts.bold).fillColor(this.colors.danger).text("\u26A0\uFE0F ALERTES D\xC9TECT\xC9ES: ".concat(flags.length));
        doc.moveDown(0.3);
        if (criticalCount > 0) {
          doc.fontSize(11).fillColor(this.colors.danger).text("\u2022 ".concat(criticalCount, " alerte(s) critique(s) - Action imm\xE9diate requise"));
        }
        if (warningCount > 0) {
          doc.fontSize(11).fillColor(this.colors.warning).text("\u2022 ".concat(warningCount, " avertissement(s) - Vigilance recommand\xE9e"));
        }
        doc.moveDown(0.8);
      }

      // Évaluation rapide
      var assessment = this.generateQuickAssessment(authenticityScore, flags);
      doc.fontSize(12).font(this.fonts.bold).fillColor(assessment.color).text(assessment.text, {
        align: 'left'
      });
    }

    /**
     * Informations du fichier
     */
  }, {
    key: "addFileInformation",
    value: function addFileInformation(doc, data) {
      this.addSectionTitle(doc, 'INFORMATIONS DÉTAILLÉES DU FICHIER');

      // Informations de base
      this.addSubsectionTitle(doc, 'Propriétés du Fichier');
      var fileInfo = [['Nom original:', this.safeTruncate(data.originalName, 60)], ['Nom sécurisé:', this.safeTruncate(data.filename, 60)], ['Taille (octets):', (data.fileSize || 0).toLocaleString('fr-FR')], ['Taille (lisible):', this.formatFileSize(data.fileSize)], ['Type MIME:', data.mimeType || 'Non spécifié'], ['Extension:', data.extension || 'Inconnue'], ['Date upload:', data.uploadDate ? new Date(data.uploadDate).toLocaleDateString('fr-FR') : 'Inconnue'], ['Statut:', data.status || 'Analysé']];
      this.addInfoTable(doc, fileInfo);
      doc.moveDown(1);

      // Sécurité et intégrité
      if (data.hash) {
        this.addSubsectionTitle(doc, 'Sécurité et Intégrité');
        doc.fontSize(10).fillColor(this.colors.success).text('✓ Intégrité du fichier vérifiée par empreinte cryptographique');
        doc.fontSize(9).fillColor(this.colors.gray).text("SHA-256: ".concat(this.safeTruncate(data.hash, 64)));
        doc.moveDown(0.5);
      }
    }

    /**
     * Analyse EXIF
     */
  }, {
    key: "addExifAnalysis",
    value: function addExifAnalysis(doc, data) {
      var _this4 = this;
      this.addSectionTitle(doc, 'ANALYSE DES MÉTADONNÉES EXIF');
      var exifData = data.exifData;
      if (!exifData || Object.keys(exifData).length === 0) {
        // Absence d'EXIF
        doc.fontSize(16).font(this.fonts.bold).fillColor(this.colors.danger).text('❌ AUCUNE MÉTADONNÉE EXIF DÉTECTÉE');
        doc.moveDown(0.5);
        doc.fontSize(11).font(this.fonts.regular).fillColor(this.colors.text).text('Cette absence est HAUTEMENT SUSPECTE pour une photographie authentique.');
        doc.moveDown(1);
        this.addSubsectionTitle(doc, 'Implications Forensiques');
        var implications = ['🤖 Probabilité élevée de génération par IA', '🗑️ Suppression volontaire des métadonnées', '📱 Capture d\'écran ou export depuis logiciel', '🔧 Traitement par logiciel effaçant les EXIF', '🎨 Source non photographique (rendu, synthèse)'];
        implications.forEach(function (implication) {
          doc.fontSize(10).fillColor(_this4.colors.text).text(implication);
        });
      } else {
        // EXIF présent
        var completenessScore = 0;
        var totalFields = 0;

        // Analyse appareil photo
        if (exifData.camera) {
          this.addSubsectionTitle(doc, 'Informations Appareil Photo');
          var cameraFields = [['Marque:', exifData.camera.make], ['Modèle:', exifData.camera.model], ['Objectif:', exifData.camera.lens], ['N° série:', exifData.camera.serialNumber]];
          cameraFields.forEach(function (_ref5) {
            var _ref6 = _slicedToArray(_ref5, 2),
              label = _ref6[0],
              value = _ref6[1];
            totalFields++;
            if (value) {
              completenessScore++;
              doc.fontSize(10).fillColor(_this4.colors.success).text("\u2713 ".concat(label, " ").concat(value));
            } else {
              doc.fontSize(10).fillColor(_this4.colors.warning).text("\u26A0\uFE0F ".concat(label, " Non sp\xE9cifi\xE9"));
            }
          });
          doc.moveDown(0.5);
        }

        // Paramètres techniques
        if (exifData.technical) {
          this.addSubsectionTitle(doc, 'Paramètres Photographiques');
          var techFields = [['ISO:', exifData.technical.iso], ['Ouverture:', exifData.technical.aperture], ['Vitesse:', exifData.technical.shutterSpeed], ['Focale:', exifData.technical.focalLength], ['Flash:', exifData.technical.flash], ['Balance blancs:', exifData.technical.whiteBalance]];
          techFields.forEach(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2),
              label = _ref8[0],
              value = _ref8[1];
            totalFields++;
            if (value) {
              completenessScore++;
              doc.fontSize(10).fillColor(_this4.colors.success).text("\u2713 ".concat(label, " ").concat(value));
            } else {
              doc.fontSize(10).fillColor(_this4.colors.warning).text("\u26A0\uFE0F ".concat(label, " Non sp\xE9cifi\xE9"));
            }
          });
          doc.moveDown(0.5);
        }

        // Score de complétude
        var completenessPercent = totalFields > 0 ? Math.round(completenessScore / totalFields * 100) : 0;
        var completenessColor = completenessPercent >= 70 ? this.colors.success : completenessPercent >= 40 ? this.colors.warning : this.colors.danger;
        doc.fontSize(13).font(this.fonts.bold).fillColor(completenessColor).text("\uD83D\uDCCA Score de Compl\xE9tude EXIF: ".concat(completenessPercent, "% (").concat(completenessScore, "/").concat(totalFields, ")"));
        doc.moveDown(0.3);
        var completenessMessage = completenessPercent >= 70 ? '✅ Métadonnées riches - Compatible avec photo authentique' : completenessPercent >= 40 ? '⚠️ Métadonnées partielles - Vérification supplémentaire requise' : '❌ Métadonnées insuffisantes - Hautement suspect';
        doc.fontSize(10).font(this.fonts.regular).fillColor(completenessColor).text(completenessMessage);
      }
    }

    /**
     * Analyse forensique
     */
  }, {
    key: "addForensicAnalysis",
    value: function addForensicAnalysis(doc, data) {
      var _this5 = this,
        _forensicData$authent,
        _forensicData$aiDetec,
        _forensicData$manipul;
      this.addSectionTitle(doc, 'ANALYSE FORENSIQUE AVANCÉE');
      var forensicData = data.forensicAnalysis;
      if (!forensicData) {
        doc.fontSize(11).text('Aucune analyse forensique disponible.');
        return;
      }

      // Méthodologie
      this.addSubsectionTitle(doc, 'Méthodologie Appliquée');
      var methods = ['1. Analyse statistique des pixels et détection d\'anomalies', '2. Détection d\'artefacts de compression/recompression', '3. Analyse de cohérence du bruit naturel', '4. Détection de signatures de génération IA', '5. Recherche de traces de manipulation', '6. Calcul de scores d\'authenticité pondérés'];
      methods.forEach(function (method) {
        doc.fontSize(9).fillColor(_this5.colors.text).text(method);
      });
      doc.moveDown(1);

      // Scores principaux
      var scores = [{
        label: 'Authenticité Globale',
        icon: '🛡️',
        score: ((_forensicData$authent = forensicData.authenticity) === null || _forensicData$authent === void 0 ? void 0 : _forensicData$authent.score) || 0,
        interpretation: this.interpretAuthenticityScore
      }, {
        label: 'Détection IA/Génération',
        icon: '🤖',
        score: ((_forensicData$aiDetec = forensicData.aiDetection) === null || _forensicData$aiDetec === void 0 ? void 0 : _forensicData$aiDetec.generated) || 0,
        interpretation: this.interpretAIScore
      }, {
        label: 'Manipulation Globale',
        icon: '✂️',
        score: ((_forensicData$manipul = forensicData.manipulationDetection) === null || _forensicData$manipul === void 0 ? void 0 : _forensicData$manipul.overall) || 0,
        interpretation: this.interpretManipulationScore
      }];
      scores.forEach(function (scoreInfo) {
        var color = _this5.getScoreColor(scoreInfo.score);
        doc.fontSize(11).font(_this5.fonts.bold).fillColor(color).text("".concat(scoreInfo.icon, " ").concat(scoreInfo.label, ": ").concat(scoreInfo.score, "/100"));
        doc.fontSize(9).font(_this5.fonts.regular).fillColor(_this5.colors.text).text("Interpr\xE9tation: ".concat(scoreInfo.interpretation(scoreInfo.score)));
        doc.moveDown(0.4);
      });

      // Alertes détaillées
      if (data.securityFlags && data.securityFlags.length > 0) {
        this.addSubsectionTitle(doc, 'Alertes Forensiques');
        data.securityFlags.slice(0, 5).forEach(function (flag) {
          // Limiter à 5 alertes
          var severityIcon = _this5.getSeverityIcon(flag.severity);
          var severityColor = _this5.getSeverityColor(flag.severity);
          doc.fontSize(10).font(_this5.fonts.bold).fillColor(severityColor).text("".concat(severityIcon, " [").concat(flag.severity.toUpperCase(), "] ").concat(_this5.formatFlagType(flag.type)));
          doc.fontSize(9).font(_this5.fonts.regular).fillColor(_this5.colors.text).text("Message: ".concat(flag.message || 'Aucun détail disponible'));
          if (flag.confidence) {
            doc.text("Confiance: ".concat(flag.confidence, "%"));
          }
          doc.moveDown(0.3);
        });
      }
    }

    /**
     * Section méthodologie
     */
  }, {
    key: "addMethodologySection",
    value: function addMethodologySection(doc, data) {
      var _this6 = this;
      this.addSectionTitle(doc, 'MÉTHODOLOGIE DÉTAILLÉE');
      doc.fontSize(10).font(this.fonts.regular).fillColor(this.colors.text).text('Cette analyse est conforme aux standards ISO/IEC 27037 et NIST SP 800-86 pour l\'investigation numérique forensique.');
      doc.moveDown(1);
      var methodologySteps = [{
        title: '🔍 Extraction et Validation des Données',
        content: ['Extraction sécurisée des métadonnées EXIF selon standard TIFF/EXIF 2.32', 'Calcul et vérification d\'empreintes cryptographiques pour l\'intégrité', 'Validation de cohérence des timestamps selon ISO 8601', 'Vérification des paramètres techniques contre les limites physiques']
      }, {
        title: '📊 Analyse Statistique des Pixels',
        content: ['Analyse des histogrammes de distribution RGB/luminance', 'Détection de patterns de bruit naturel vs artificiel', 'Analyse des artefacts de compression JPEG 8x8', 'Vérification de cohérence des espaces chromatiques']
      }, {
        title: '🤖 Détection de Génération IA',
        content: ['Recherche de signatures GAN (réseaux adversaires)', 'Analyse spectrale de motifs artificiels', 'Vérification de cohérence des lois physiques d\'éclairage', 'Comparaison avec base de données de signatures connues']
      }];
      methodologySteps.forEach(function (step) {
        _this6.addSubsectionTitle(doc, step.title);
        step.content.forEach(function (item) {
          doc.fontSize(9).fillColor(_this6.colors.text).text("\u2022 ".concat(item));
        });
        doc.moveDown(0.6);
      });

      // Limitations
      this.addSubsectionTitle(doc, '⚠️ Limitations et Fiabilité');
      var limitations = ['Analyse automatisée - Ne remplace pas l\'expertise humaine qualifiée', 'Techniques sophistiquées peuvent échapper à la détection', 'Résultats indicatifs - Interprétation contextuelle requise', 'Fiabilité dépendante de la qualité des métadonnées sources'];
      limitations.forEach(function (limitation) {
        doc.fontSize(9).fillColor(_this6.colors.warning).text("\u2022 ".concat(limitation));
      });
    }

    /**
     * Conclusions et recommandations
     */
  }, {
    key: "addConclusionsAndRecommendations",
    value: function addConclusionsAndRecommendations(doc, data) {
      var _data$forensicAnalysi,
        _this7 = this;
      this.addSectionTitle(doc, 'CONCLUSIONS ET RECOMMANDATIONS');
      var authenticityScore = data.authenticityScore || 0;
      var flags = data.securityFlags || [];
      var criticalCount = flags.filter(function (f) {
        return f.severity === 'critical';
      }).length;

      // Synthèse
      this.addSubsectionTitle(doc, 'Synthèse de l\'Analyse');
      var synthesis = ["\uD83C\uDFAF Score d'authenticit\xE9 global: ".concat(authenticityScore, "/100"), "\uD83D\uDEA8 Alertes totales: ".concat(flags.length, " (").concat(criticalCount, " critiques)"), "\uD83D\uDCCA M\xE9tadonn\xE9es EXIF: ".concat(data.exifData && Object.keys(data.exifData).length > 0 ? 'Présentes' : 'Absentes'), "\uD83E\uDD16 Probabilit\xE9 g\xE9n\xE9ration IA: ".concat(((_data$forensicAnalysi = data.forensicAnalysis) === null || _data$forensicAnalysi === void 0 || (_data$forensicAnalysi = _data$forensicAnalysi.aiDetection) === null || _data$forensicAnalysi === void 0 ? void 0 : _data$forensicAnalysi.generated) || 0, "%")];
      synthesis.forEach(function (item) {
        doc.fontSize(10).fillColor(_this7.colors.text).text(item);
      });
      doc.moveDown(1);

      // Évaluation finale
      var finalAssessment = this.generateFinalAssessment(authenticityScore, criticalCount);
      doc.fontSize(14).font(this.fonts.bold).fillColor(finalAssessment.color).text(finalAssessment.verdict);
      doc.moveDown(0.5);
      doc.fontSize(10).font(this.fonts.regular).fillColor(this.colors.text).text("Niveau de confiance: ".concat(finalAssessment.confidence));
      doc.moveDown(1);

      // Recommandations
      this.addSubsectionTitle(doc, 'Recommandations d\'Action');
      finalAssessment.recommendations.forEach(function (recommendation) {
        var isUrgent = recommendation.includes('OBLIGATOIRE') || recommendation.includes('IMMÉDIATE');
        doc.fontSize(9).fillColor(isUrgent ? _this7.colors.danger : _this7.colors.text).text(recommendation);
      });
      doc.moveDown(1);

      // Avertissement légal
      this.addSubsectionTitle(doc, '⚖️ Avertissement Légal');
      var legalText = 'Ce rapport constitue une pré-analyse technique automatisée. Il ne remplace pas une expertise judiciaire officielle et ne peut être utilisé seul comme preuve devant un tribunal. Pour validation formelle dans un contexte légal, une consultation d\'expert forensique certifié est impérative.';
      doc.fontSize(9).fillColor(this.colors.gray).text(legalText, {
        align: 'justify'
      });
    }

    // =====================================
    // MÉTHODES UTILITAIRES
    // =====================================

    /**
     * Validation robuste des données d'entrée
     */
  }, {
    key: "validateInputData",
    value: function validateInputData(data, outputPath) {
      var errors = [];
      if (!data || _typeof(data) !== 'object') {
        errors.push('Données du rapport requises');
      }
      if (!outputPath || typeof outputPath !== 'string') {
        errors.push('Chemin de sortie requis');
      }
      if (data && !data.originalName && !data.filename) {
        errors.push('Nom de fichier requis');
      }
      try {
        if (outputPath) {
          var dir = path.dirname(outputPath);
          if (!path.isAbsolute(outputPath) && !fs.existsSync(dir)) {
            errors.push('Répertoire de destination invalide');
          }
        }
      } catch (pathError) {
        errors.push("Chemin invalide: ".concat(pathError.message));
      }
      return {
        valid: errors.length === 0,
        errors: errors
      };
    }

    /**
     * Préparation sécurisée des données
     */
  }, {
    key: "prepareReportData",
    value: function prepareReportData(data, options) {
      var _data$forensicAnalysi2, _data$forensicAnalysi3;
      return {
        reportId: this.generateSecureReportId(),
        imageName: data.originalName || data.filename || 'Image inconnue',
        originalName: data.originalName || 'Non spécifié',
        filename: data.filename || 'Non spécifié',
        fileSize: data.size || 0,
        mimeType: data.mimeType || 'Non spécifié',
        extension: data.originalName ? path.extname(data.originalName) : 'Inconnue',
        uploadDate: data.uploadDate || data.createdAt,
        status: data.status || 'Analysé',
        hash: data.hash,
        authenticityScore: data.authenticityScore || ((_data$forensicAnalysi2 = data.forensicAnalysis) === null || _data$forensicAnalysi2 === void 0 || (_data$forensicAnalysi2 = _data$forensicAnalysi2.authenticity) === null || _data$forensicAnalysi2 === void 0 ? void 0 : _data$forensicAnalysi2.score) || 0,
        exifData: data.exifData || {},
        forensicAnalysis: data.forensicAnalysis || {},
        securityFlags: ((_data$forensicAnalysi3 = data.forensicAnalysis) === null || _data$forensicAnalysi3 === void 0 ? void 0 : _data$forensicAnalysi3.flags) || [],
        options: options
      };
    }

    /**
     * Ajout sécurisé d'une nouvelle page
     */
  }, {
    key: "addNewPage",
    value: function addNewPage(doc) {
      try {
        doc.addPage();
      } catch (error) {
        console.error('Erreur ajout page:', error);
        throw new Error('Impossible d\'ajouter une nouvelle page');
      }
    }

    /**
     * Ajout titre de section
     */
  }, {
    key: "addSectionTitle",
    value: function addSectionTitle(doc, title) {
      doc.moveDown(0.5);
      doc.fontSize(16).font(this.fonts.bold).fillColor(this.colors.primary).text(title);
      this.addSeparatorLine(doc);
      doc.moveDown(0.5);
    }

    /**
     * Ajout sous-titre de section
     */
  }, {
    key: "addSubsectionTitle",
    value: function addSubsectionTitle(doc, title) {
      doc.moveDown(0.3);
      doc.fontSize(12).font(this.fonts.bold).fillColor(this.colors.text).text(title);
      doc.moveDown(0.2);
    }

    /**
     * Ligne de séparation
     */
  }, {
    key: "addSeparatorLine",
    value: function addSeparatorLine(doc) {
      var y = doc.y + 5;
      var startX = this.pageConfig.margins.left;
      var endX = this.pageConfig.width - this.pageConfig.margins.right;
      doc.moveTo(startX, y).lineTo(endX, y).strokeColor(this.colors.secondary).lineWidth(1).stroke();
      doc.y = y + 10;
    }

    /**
     * Footer de page
     */
  }, {
    key: "addPageFooter",
    value: function addPageFooter(doc, pageNumber) {
      var footerY = this.pageConfig.height - 40;
      doc.fontSize(8).font(this.fonts.regular).fillColor(this.colors.gray).text("Ba7ath Forensic Platform v".concat(this.version, " | Page ").concat(pageNumber), this.pageConfig.margins.left, footerY, {
        width: this.pageConfig.width - this.pageConfig.margins.left - this.pageConfig.margins.right,
        align: 'center'
      });
    }

    /**
     * Tableau d'informations
     */
  }, {
    key: "addInfoTable",
    value: function addInfoTable(doc, items) {
      var _this8 = this;
      items.forEach(function (_ref9) {
        var _ref0 = _slicedToArray(_ref9, 2),
          label = _ref0[0],
          value = _ref0[1];
        doc.fontSize(10).font(_this8.fonts.bold).fillColor(_this8.colors.text).text("".concat(label, " "), {
          continued: true
        }).font(_this8.fonts.regular).text(_this8.safeTruncate(value, 60));
      });
      doc.moveDown(0.5);
    }

    /**
     * Génération évaluation rapide
     */
  }, {
    key: "generateQuickAssessment",
    value: function generateQuickAssessment(score, flags) {
      var criticalCount = flags.filter(function (f) {
        return f.severity === 'critical';
      }).length;
      if (score >= 80 && criticalCount === 0) {
        return {
          text: '✅ IMAGE PROBABLEMENT AUTHENTIQUE - Faibles indices de manipulation',
          color: this.colors.success
        };
      } else if (score >= 50) {
        return {
          text: '⚠️ IMAGE SUSPECTE - Analyse approfondie recommandée',
          color: this.colors.warning
        };
      } else {
        return {
          text: '❌ IMAGE HAUTEMENT SUSPECTE - Manipulation probable',
          color: this.colors.danger
        };
      }
    }

    /**
     * Évaluation finale
     */
  }, {
    key: "generateFinalAssessment",
    value: function generateFinalAssessment(score, criticalCount) {
      if (score >= 80 && criticalCount === 0) {
        return {
          verdict: '✅ IMAGE AUTHENTIQUE',
          confidence: 'ÉLEVÉ',
          color: this.colors.success,
          recommendations: ['✓ Image utilisable avec un niveau de confiance élevé', '📋 Conserver la chaîne de custody pour traçabilité', '🔍 Vérification de la source recommandée']
        };
      } else if (score >= 50) {
        return {
          verdict: '⚠️ IMAGE DOUTEUSE',
          confidence: 'MOYEN',
          color: this.colors.warning,
          recommendations: ['🔬 Analyse experte complémentaire FORTEMENT recommandée', '🔍 Vérification approfondie de la chaîne de custody OBLIGATOIRE', '⚠️ Utilisation avec PRUDENCE pour usage critique']
        };
      } else {
        return {
          verdict: '❌ IMAGE SUSPECTE',
          confidence: 'FAIBLE',
          color: this.colors.danger,
          recommendations: ['🚨 Expertise forensique approfondie par spécialiste OBLIGATOIRE', '⛔ Considérer l\'image comme HAUTEMENT SUSPECTE', '👨‍💼 Consultation d\'expert forensique certifié REQUISE', '⚖️ NE PAS utiliser comme preuve sans validation experte']
        };
      }
    }

    /**
     * Calcul niveau de risque
     */
  }, {
    key: "calculateRiskLevel",
    value: function calculateRiskLevel(score) {
      if (score >= 80) return {
        label: 'FAIBLE',
        color: this.colors.success
      };
      if (score >= 60) return {
        label: 'MODÉRÉ',
        color: this.colors.warning
      };
      if (score >= 30) return {
        label: 'ÉLEVÉ',
        color: this.colors.danger
      };
      return {
        label: 'CRITIQUE',
        color: '#dc2626'
      };
    }

    /**
     * Couleur selon score
     */
  }, {
    key: "getScoreColor",
    value: function getScoreColor(score) {
      if (score >= 70) return this.colors.success;
      if (score >= 40) return this.colors.warning;
      return this.colors.danger;
    }

    /**
     * Icône selon sévérité
     */
  }, {
    key: "getSeverityIcon",
    value: function getSeverityIcon(severity) {
      var icons = {
        'critical': '🔴',
        'warning': '🟡',
        'info': '🔵'
      };
      return icons[severity] || '⚪';
    }

    /**
     * Couleur selon sévérité
     */
  }, {
    key: "getSeverityColor",
    value: function getSeverityColor(severity) {
      var colors = {
        'critical': this.colors.danger,
        'warning': this.colors.warning,
        'info': this.colors.info
      };
      return colors[severity] || this.colors.text;
    }

    /**
     * Formatage type de flag
     */
  }, {
    key: "formatFlagType",
    value: function formatFlagType(type) {
      return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, function (l) {
        return l.toUpperCase();
      });
    }

    /**
     * Interprétations des scores
     */
  }, {
    key: "interpretAuthenticityScore",
    value: function interpretAuthenticityScore(score) {
      if (score >= 90) return 'Excellente - Très faible probabilité de manipulation';
      if (score >= 70) return 'Bonne - Indices de manipulation minimes';
      if (score >= 50) return 'Correcte - Quelques anomalies détectées';
      if (score >= 30) return 'Faible - Manipulation probable';
      return 'Très faible - Manipulation quasi-certaine';
    }
  }, {
    key: "interpretAIScore",
    value: function interpretAIScore(score) {
      if (score <= 10) return 'Très faible probabilité de génération IA';
      if (score <= 30) return 'Probabilité faible de génération IA';
      if (score <= 70) return 'Probabilité modérée de génération IA';
      return 'Forte probabilité de génération IA';
    }
  }, {
    key: "interpretManipulationScore",
    value: function interpretManipulationScore(score) {
      if (score <= 25) return 'Aucun signe de manipulation majeure';
      if (score <= 50) return 'Signes modérés de manipulation locale';
      if (score <= 75) return 'Manipulation significative détectée';
      return 'Manipulation extensive - Altération majeure';
    }

    /**
     * Utilitaires
     */
  }, {
    key: "safeTruncate",
    value: function safeTruncate(text, maxLength) {
      if (!text || typeof text !== 'string') return 'N/A';
      var cleaned = text.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Nettoyer caractères de contrôle
      return cleaned.length > maxLength ? cleaned.substring(0, maxLength - 3) + '...' : cleaned;
    }
  }, {
    key: "formatFileSize",
    value: function formatFileSize(bytes) {
      if (!bytes || isNaN(bytes)) return '0 B';
      var k = 1024;
      var sizes = ['B', 'KB', 'MB', 'GB'];
      var i = Math.floor(Math.log(bytes) / Math.log(k));
      return "".concat((bytes / Math.pow(k, i)).toFixed(1), " ").concat(sizes[i]);
    }
  }, {
    key: "generateSecureReportId",
    value: function generateSecureReportId() {
      var timestamp = Date.now().toString(36).toUpperCase();
      var random = crypto.randomBytes(4).toString('hex').toUpperCase();
      return "BA7ATH-".concat(timestamp, "-").concat(random);
    }
  }, {
    key: "ensureDirectoryExists",
    value: function ensureDirectoryExists(dirPath) {
      try {
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, {
            recursive: true
          });
        }
      } catch (error) {
        throw new Error("Impossible de cr\xE9er le r\xE9pertoire: ".concat(error.message));
      }
    }
  }, {
    key: "cleanupFile",
    value: function cleanupFile(filePath) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("\uD83D\uDDD1\uFE0F Fichier nettoy\xE9: ".concat(filePath));
        }
      } catch (error) {
        console.error("Erreur nettoyage ".concat(filePath, ":"), error.message);
      }
    }
  }]);
}(); // =====================================
// INTERFACE PUBLIQUE
// =====================================
var generator = new ForensicPDFGenerator();

/**
 * Interface publique pour génération PDF
 */
function generateForensicPdfReport(_x3, _x4) {
  return _generateForensicPdfReport2.apply(this, arguments);
}
/**
 * Alias pour compatibilité
 */
function _generateForensicPdfReport2() {
  _generateForensicPdfReport2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(data, outputPath) {
    var options,
      _args2 = arguments;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
          return _context2.a(2, generator.generateForensicPdfReport(data, outputPath, options));
      }
    }, _callee2);
  }));
  return _generateForensicPdfReport2.apply(this, arguments);
}
function generatePdfReport(_x5, _x6) {
  return _generatePdfReport.apply(this, arguments);
}
function _generatePdfReport() {
  _generatePdfReport = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(data, outputPath) {
    var options,
      _args3 = arguments;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
          return _context3.a(2, generateForensicPdfReport(data, outputPath, options));
      }
    }, _callee3);
  }));
  return _generatePdfReport.apply(this, arguments);
}
module.exports = {
  generateForensicPdfReport: generateForensicPdfReport,
  generatePdfReport: generatePdfReport,
  ForensicPDFGenerator: ForensicPDFGenerator
};