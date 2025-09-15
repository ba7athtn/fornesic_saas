const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Contrôleurs rapports forensiques
const {
  generateForensicReport,
  generateBatchReport,
  getReportPreview,
  listAvailableReports,
  downloadExistingReport,
  exportForensicData
} = require('../controllers/reportController');

// Middlewares
const { auth, requireRole, requirePrivacyMode, forensicLogging } = require('../middleware/auth');
const { validateForensicObjectId, validateForensicQuery, validateForensicBody } = require('../middleware/validation');

// =====================================
// RATE LIMITING RAPPORTS - CORRIGÉ
// =====================================

const reportGenerationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 20, // 20 rapports par heure max
  message: {
    error: 'Limite de génération de rapports dépassée',
    type: 'REPORT_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Alternative: Utiliser skip pour personnaliser si nécessaire
  skip: (req) => {
    // Permettre aux admins de bypasser le rate limiting
    return req.user?.roles?.includes('admin');
  }
});

// Rate limiting spécialisé pour exports
const exportRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 10, // 10 exports par heure max
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
router.get('/:imageId/generate',
  reportGenerationRateLimit,
  auth,
  requireRole(['forensic_analyst', 'expert', 'admin']),
  forensicLogging,
  validateForensicObjectId('imageId'),
  validateForensicQuery,
  generateForensicReport
);

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
router.get('/session/:sessionId/batch',
  reportGenerationRateLimit,
  auth,
  requireRole(['forensic_analyst', 'admin']),
  forensicLogging,
  validateForensicQuery,
  generateBatchReport
);

/**
 * @route GET /api/reports/:imageId/preview
 * @desc Obtenir aperçu rapport avant génération
 * @access Private
 * @param {string} imageId - ID MongoDB de l'image
 */
router.get('/:imageId/preview',
  auth,
  validateForensicObjectId('imageId'),
  getReportPreview
);

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
router.get('/',
  auth,
  validateForensicQuery,
  listAvailableReports
);

/**
 * @route GET /api/reports/:reportId/download
 * @desc Télécharger rapport existant
 * @access Private (avec contrôles d'accès spécifiques)
 * @param {string} reportId - ID du rapport
 * @query {string} format - Format spécifique à télécharger
 */
router.get('/:reportId/download',
  auth,
  forensicLogging,
  validateForensicObjectId('reportId'),
  downloadExistingReport
);

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
router.get('/:imageId/export',
  exportRateLimit, // Rate limiting spécifique pour exports
  auth,
  requireRole(['forensic_analyst', 'expert', 'admin']),
  requirePrivacyMode(['JUDICIAL', 'COMMERCIAL']), // Pas d'export en RESEARCH
  forensicLogging,
  validateForensicObjectId('imageId'),
  validateForensicQuery,
  exportForensicData
);

/**
 * @route POST /api/reports/custom
 * @desc Générer rapport personnalisé avec configuration avancée
 * @access Private - Requires expert role
 * @body {array} imageIds - Liste des IDs d'images
 * @body {object} customConfig - Configuration personnalisée
 * @body {object} layout - Configuration mise en page
 * @body {object} filters - Filtres de données
 */
router.post('/custom',
  reportGenerationRateLimit,
  auth,
  requireRole(['expert', 'admin']),
  requirePrivacyMode(['JUDICIAL']), // Rapports custom uniquement en mode JUDICIAL
  forensicLogging,
  validateForensicBody,
  async (req, res) => {
    try {
      const {
        imageIds,
        customConfig = {},
        layout = {},
        filters = {}
      } = req.body;

      if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
        return res.status(400).json({
          error: 'Liste d\'IDs d\'images requise',
          type: 'MISSING_IMAGE_IDS'
        });
      }

      if (imageIds.length > 20) {
        return res.status(400).json({
          error: 'Maximum 20 images pour rapport personnalisé',
          type: 'TOO_MANY_IMAGES',
          maxImages: 20
        });
      }

      // Validation configuration personnalisée
      const validLayouts = ['single-column', 'two-column', 'comparison', 'timeline'];
      if (layout.type && !validLayouts.includes(layout.type)) {
        return res.status(400).json({
          error: 'Type de mise en page invalide',
          type: 'INVALID_LAYOUT',
          validLayouts: validLayouts
        });
      }

      const customReportId = require('crypto').randomBytes(8).toString('hex');

      // Configuration par défaut pour rapport personnalisé
      const defaultCustomConfig = {
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

      const finalConfig = { ...defaultCustomConfig, ...customConfig };

      // Simuler génération rapport custom (à implémenter)
      setTimeout(async () => {
        try {
          // Ici, implémenter la vraie génération custom
          console.log(`🎨 Génération rapport custom: ${customReportId}`);

          // Pour l'instant, créer une entrée de base
          const Report = require('../models/Report');
          const customReport = new Report({
            reportId: `CUSTOM-${customReportId}`,
            sessionId: `custom-${Date.now()}`,
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
                userId: req.user?.sub,
                ip: req.ip,
                timestamp: new Date()
              }
            },
            status: 'generating'
          });

          await customReport.save();
          console.log(`✅ Rapport custom initié: ${customReportId}`);

        } catch (error) {
          console.error(`❌ Erreur génération custom ${customReportId}:`, error);
        }
      }, 1000);

      res.status(202).json({
        success: true,
        message: 'Génération rapport personnalisé initiée',
        customReportId: customReportId,
        config: finalConfig,
        estimatedCompletion: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // +10min
        trackingUrl: `/api/reports/custom/${customReportId}/status`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur custom report:', error);
      res.status(500).json({
        error: 'Erreur génération rapport personnalisé',
        type: 'CUSTOM_REPORT_ERROR'
      });
    }
  }
);

/**
 * @route GET /api/reports/custom/:customReportId/status
 * @desc Obtenir statut génération rapport personnalisé
 * @access Private
 * @param {string} customReportId - ID du rapport personnalisé
 */
router.get('/custom/:customReportId/status',
  auth,
  async (req, res) => {
    try {
      const { customReportId } = req.params;
      const Report = require('../models/Report');

      const report = await Report.findOne({
        reportId: `CUSTOM-${customReportId}`
      }).select('status progress generation.processingTime issues');

      if (!report) {
        return res.status(404).json({
          error: 'Rapport personnalisé non trouvé',
          type: 'CUSTOM_REPORT_NOT_FOUND'
        });
      }

      res.json({
        customReportId: customReportId,
        status: report.status,
        progress: report.progress || 0,
        processingTime: report.generation?.processingTime,
        issues: report.issues?.filter(i => !i.resolved) || [],
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Erreur custom report status:', error);
      res.status(500).json({
        error: 'Erreur statut rapport personnalisé',
        type: 'CUSTOM_STATUS_ERROR'
      });
    }
  }
);

/**
 * @route GET /api/reports/templates
 * @desc Obtenir liste des templates disponibles avec aperçu
 * @access Private
 */
router.get('/templates',
  auth,
  async (req, res) => {
    try {
      const templates = {
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
  }
);

// =====================================
// GESTION D'ERREURS ROUTES
// =====================================

router.use((error, req, res, next) => {
  console.error('❌ Erreur route reports:', error);
  res.status(error.status || 500).json({
    error: error.message || 'Erreur interne route reports',
    type: 'REPORTS_ROUTE_ERROR',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = router;
