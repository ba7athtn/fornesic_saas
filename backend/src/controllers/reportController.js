const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const mongoose = require('mongoose');
const crypto = require('crypto');

const { generateForensicPdfReport } = require('../utils/pdfGenerator');
const Image = require('../models/Image');
const Analysis = require('../models/Analysis');
const Report = require('../models/Report');

// =====================================
// CONTRÔLEUR RAPPORTS FORENSIQUES COMPLET - OPTIMISÉ
// =====================================

// Validation ObjectId optimisée
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return new mongoose.Types.ObjectId(id);
};

// Cache pour rapports fréquemment demandés
const reportCache = new Map();
const REPORT_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Sanitization des entrées
const sanitizeInput = (input) => {
  return typeof input === 'string' 
    ? input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/[<>'"&]/g, (char) => {
          const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
          return entities[char] || char;
        })
    : input;
};

// Rate limiting pour génération de rapports
const reportGenerationAttempts = new Map();
const MAX_REPORTS_PER_HOUR = 10;

/**
 * Générer rapport forensique complet avec tous les piliers
 */
exports.generateForensicReport = async (req, res) => {
  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  try {
    const { imageId } = req.params;
    const { 
      template = 'executive', 
      format = 'pdf', 
      language = 'fr', 
      includeRawData = 'false', 
      includePillars = 'all', 
      includeChainOfCustody = 'auto' 
    } = req.query;

    console.log(`📄 Génération rapport forensique: ${imageId} [${requestId}]`);

    // Rate limiting par utilisateur
    const userId = req.user?.sub || req.ip;
    const now = Date.now();
    const userAttempts = reportGenerationAttempts.get(userId) || [];
    const recentAttempts = userAttempts.filter(time => now - time < 3600000); // 1 heure

    if (recentAttempts.length >= MAX_REPORTS_PER_HOUR) {
      return res.status(429).json({
        error: 'Limite de génération de rapports dépassée',
        type: 'RATE_LIMIT_EXCEEDED',
        resetTime: new Date(Math.min(...recentAttempts) + 3600000).toISOString(),
        requestId: requestId
      });
    }

    reportGenerationAttempts.set(userId, [...recentAttempts, now]);

    const objectId = req.forensicObjectId || validateObjectId(imageId);

    // Vérification cache
    const cacheKey = `report-${imageId}-${template}-${format}-${includePillars}`;
    if (reportCache.has(cacheKey)) {
      const cached = reportCache.get(cacheKey);
      if (Date.now() - cached.timestamp < REPORT_CACHE_TTL) {
        console.log(`💾 Cache hit pour rapport: ${imageId} [${requestId}]`);
        return res.download(cached.filepath, cached.filename);
      }
      reportCache.delete(cacheKey);
    }

    // Récupération données complètes en parallèle
    const [image, analysis] = await Promise.all([
      Image.findById(objectId).lean(),
      Analysis.findOne({ imageId: objectId }).lean()
    ]);

    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée pour génération de rapport',
        type: 'IMAGE_NOT_FOUND',
        imageId: imageId,
        requestId: requestId
      });
    }

    if (image.status !== 'analyzed' || (!analysis && !image.forensicAnalysis)) {
      return res.status(400).json({
        error: 'Analyse forensique non disponible',
        type: 'ANALYSIS_NOT_AVAILABLE',
        status: image.status,
        message: 'L\'image doit être analysée avant génération de rapport',
        requestId: requestId
      });
    }

    // Sanitization des paramètres
    const sanitizedTemplate = sanitizeInput(template);
    const sanitizedFormat = sanitizeInput(format);
    const sanitizedLanguage = sanitizeInput(language);

    // Validation template et format
    const validTemplates = ['executive', 'technical', 'legal', 'summary', 'detailed', 'comparison'];
    const validFormats = ['pdf', 'json', 'html', 'csv', 'docx'];

    if (!validTemplates.includes(sanitizedTemplate)) {
      return res.status(400).json({
        error: 'Template de rapport invalide',
        type: 'INVALID_TEMPLATE',
        validTemplates: validTemplates,
        requestId: requestId
      });
    }

    if (!validFormats.includes(sanitizedFormat)) {
      return res.status(400).json({
        error: 'Format de rapport invalide',
        type: 'INVALID_FORMAT',
        validFormats: validFormats,
        requestId: requestId
      });
    }

    // Préparer dossier rapports sécurisé
    const reportsDir = path.join(process.env.UPLOAD_REPORTS_DIR || './uploads/reports');
    if (!fsSync.existsSync(reportsDir)) {
      fsSync.mkdirSync(reportsDir, { recursive: true, mode: 0o755 });
    }

    // Générer nom fichier sécurisé
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedFilename = sanitizeInput(image.originalName).replace(/[^a-zA-Z0-9.-]/g, '_');
    const reportFilename = `rapport-forensique_${timestamp}_${sanitizedFilename}_${requestId}.${sanitizedFormat}`;
    const reportPath = path.join(reportsDir, reportFilename);

    // Construire données complètes du rapport
    const reportData = buildComprehensiveReportData(
      image,
      analysis,
      {
        template: sanitizedTemplate,
        format: sanitizedFormat,
        language: sanitizedLanguage,
        includeRawData: includeRawData === 'true',
        includePillars: includePillars === 'all' 
          ? ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert']
          : includePillars.split(',').map(p => p.trim()),
        includeChainOfCustody: includeChainOfCustody === 'auto' 
          ? req.privacyMode === 'JUDICIAL' 
          : includeChainOfCustody === 'true',
        requestId: requestId,
        generatedBy: req.user?.sub || 'anonymous',
        generatedFor: req.privacyMode || 'COMMERCIAL'
      }
    );

    // Créer entrée rapport en base
    const reportRecord = new Report({
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
          userId: req.user?.sub,
          timestamp: new Date()
        },
        versions: {
          reportGenerator: '3.0.0-forensic',
          analysisEngine: analysis?.analysisVersion || '2.1.0'
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
          performedBy: req.user?.sub || 'anonymous',
          method: 'API_REQUEST',
          hash: crypto.createHash('sha256').update(JSON.stringify(reportData)).digest('hex').substring(0, 16),
          notes: `Template: ${sanitizedTemplate}, Format: ${sanitizedFormat}`
        }]
      }
    });

    await reportRecord.save();

    // Générer rapport selon le format
    console.log(`🔄 Génération ${sanitizedFormat.toUpperCase()} en cours [${requestId}]`);
    let generatedFilePath;
    let fileSize = 0;

    try {
      switch (sanitizedFormat) {
        case 'pdf':
          generatedFilePath = await generateForensicPdfReport(reportData, reportPath, {
            template: sanitizedTemplate,
            language: sanitizedLanguage,
            includeCharts: true,
            includeImages: sanitizedTemplate !== 'summary'
          });
          break;

        case 'json':
          await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2), 'utf8');
          generatedFilePath = reportPath;
          break;

        case 'html':
          const htmlContent = await generateHtmlReport(reportData);
          await fs.writeFile(reportPath, htmlContent, 'utf8');
          generatedFilePath = reportPath;
          break;

        case 'csv':
          const csvContent = await generateCsvReport(reportData);
          await fs.writeFile(reportPath, csvContent, 'utf8');
          generatedFilePath = reportPath;
          break;

        case 'docx':
          generatedFilePath = await generateDocxReport(reportData, reportPath);
          break;

        default:
          throw new Error(`Format ${sanitizedFormat} non supporté`);
      }

      // Vérifier fichier créé
      if (!fsSync.existsSync(generatedFilePath)) {
        throw new Error(`Fichier ${sanitizedFormat} non généré`);
      }

      const fileStats = await fs.stat(generatedFilePath);
      fileSize = fileStats.size;

      // Mise en cache
      reportCache.set(cacheKey, {
        filepath: generatedFilePath,
        filename: reportFilename,
        timestamp: Date.now()
      });

      // Mettre à jour rapport en base
      await Report.findByIdAndUpdate(reportRecord._id, {
        'formats.0.generated': true,
        'formats.0.filepath': generatedFilePath,
        'formats.0.fileSize': fileSize,
        'formats.0.generatedAt': new Date(),
        'formats.0.checksum': crypto.createHash('sha256').update(await fs.readFile(generatedFilePath)).digest('hex'),
        status: 'completed',
        progress: 100,
        'generation.processingTime': Date.now() - startTime,
        $push: {
          'chainOfCustody.entries': {
            timestamp: new Date(),
            action: 'REPORT_GENERATED',
            performedBy: 'system',
            hash: crypto.createHash('sha256').update(await fs.readFile(generatedFilePath)).digest('hex').substring(0, 16),
            notes: `${sanitizedFormat.toUpperCase()} report successfully generated (${formatBytes(fileSize)})`
          }
        }
      });

      console.log(`✅ Rapport généré: ${formatBytes(fileSize)} [${requestId}]`);

      // Headers sécurisés pour téléchargement
      res.setHeader('Content-Type', getContentType(sanitizedFormat));
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Disposition', `attachment; filename="${reportFilename}"`);
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('X-Report-Generated', new Date().toISOString());
      res.setHeader('X-Report-ID', reportRecord._id.toString());
      res.setHeader('X-Request-ID', requestId);
      res.setHeader('X-Processing-Time', Date.now() - startTime + 'ms');

      // Téléchargement avec nettoyage automatique
      res.download(generatedFilePath, reportFilename, async (downloadError) => {
        if (downloadError) {
          console.error(`❌ Erreur téléchargement [${requestId}]:`, downloadError);
          if (!res.headersSent) {
            res.status(500).json({
              error: 'Erreur lors du téléchargement',
              type: 'DOWNLOAD_ERROR',
              requestId: requestId
            });
          }
        } else {
          // Enregistrer accès
          await Report.findByIdAndUpdate(reportRecord._id, {
            $inc: { 'access.downloadCount': 1 },
            'access.lastAccessed': new Date(),
            $push: {
              'access.accessLog': {
                timestamp: new Date(),
                action: 'download',
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                userId: req.user?.sub,
                success: true
              }
            }
          });

          console.log(`✅ Téléchargement réussi: ${reportFilename} [${requestId}]`);
        }

        // Nettoyage automatique après délai
        setTimeout(async () => {
          try {
            if (fsSync.existsSync(generatedFilePath)) {
              await fs.unlink(generatedFilePath);
              console.log(`🗑️ Fichier temporaire supprimé: ${reportFilename}`);
            }
          } catch (cleanupError) {
            console.error(`❌ Erreur nettoyage [${requestId}]:`, cleanupError);
          }
        }, 30000); // 30 secondes
      });

    } catch (generationError) {
      console.error(`❌ Erreur génération ${sanitizedFormat} [${requestId}]:`, generationError);

      // Marquer rapport comme échoué
      await Report.findByIdAndUpdate(reportRecord._id, {
        status: 'failed',
        $push: {
          issues: {
            level: 'critical',
            message: `Échec génération ${sanitizedFormat}: ${generationError.message}`,
            timestamp: new Date()
          }
        }
      });

      // Nettoyer fichier partiel
      if (generatedFilePath && fsSync.existsSync(generatedFilePath)) {
        await fs.unlink(generatedFilePath);
      }

      return res.status(500).json({
        error: 'Erreur lors de la génération du rapport',
        type: 'REPORT_GENERATION_ERROR',
        format: sanitizedFormat,
        details: process.env.NODE_ENV === 'development' ? generationError.message : 'Erreur interne',
        requestId: requestId,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error(`❌ Erreur generateForensicReport [${requestId}]:`, {
      imageId: req.params.imageId,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      processingTime: Date.now() - startTime + 'ms'
    });

    res.status(500).json({
      error: 'Erreur serveur lors de la génération du rapport',
      type: 'SERVER_ERROR',
      requestId: requestId,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Générer rapport batch pour une session complète
 */
exports.generateBatchReport = async (req, res) => {
  const startTime = Date.now();
  const requestId = crypto.randomBytes(8).toString('hex');

  try {
    const { sessionId } = req.params;
    const { 
      template = 'executive', 
      format = 'pdf', 
      language = 'fr', 
      includeSummaryStats = 'true', 
      includeIndividualAnalyses = 'false' 
    } = req.query;

    console.log(`📊 Génération rapport batch session: ${sessionId} [${requestId}]`);

    // Sanitization des paramètres
    const sanitizedSessionId = sanitizeInput(sessionId);
    const sanitizedTemplate = sanitizeInput(template);
    const sanitizedFormat = sanitizeInput(format);

    // Récupérer toutes les images analysées de la session
    const images = await Image.find({ 
      sessionId: sanitizedSessionId, 
      status: 'analyzed' 
    }).lean();

    if (images.length === 0) {
      return res.status(404).json({
        error: 'Aucune image analysée trouvée pour cette session',
        type: 'NO_ANALYZED_IMAGES',
        sessionId: sanitizedSessionId,
        requestId: requestId
      });
    }

    // Récupérer analyses correspondantes
    const imageIds = images.map(img => img._id);
    const analyses = await Analysis.find({ imageId: { $in: imageIds } }).lean();

    console.log(`📋 Session ${sanitizedSessionId}: ${images.length} images, ${analyses.length} analyses [${requestId}]`);

    // Calculer statistiques session
    const sessionStats = calculateSessionStatistics(images, analyses);

    // Construire données rapport batch
    const batchReportData = {
      reportType: 'batch',
      sessionId: sanitizedSessionId,
      requestId: requestId,
      generatedAt: new Date().toISOString(),
      generatedBy: req.user?.sub || 'anonymous',
      privacyMode: req.privacyMode || 'COMMERCIAL',
      sessionSummary: {
        totalImages: images.length,
        analyzedImages: analyses.length,
        sessionPeriod: {
          startDate: images[images.length - 1]?.createdAt,
          endDate: images[0]?.createdAt
        },
        averageProcessingTime: analyses.reduce((sum, a) => sum + (a.analysisMetadata?.processingTime || 0), 0) / analyses.length
      },
      statisticalSummary: sessionStats,
      riskAssessment: {
        overallRiskLevel: determineOverallRisk(sessionStats),
        recommendation: generateBatchRecommendation(sessionStats),
        urgencyLevel: determineBatchUrgency(sessionStats),
        requiresExpertReview: sessionStats.criticalFlags > 0 || sessionStats.highRiskImages > images.length * 0.1
      },
      forensicBreakdown: generateForensicBreakdown(analyses),
      individualImages: includeIndividualAnalyses === 'true'
        ? images.map(img => buildImageSummary(img, analyses.find(a => a.imageId.toString() === img._id.toString())))
        : images.map(img => ({
            id: img._id,
            filename: img.originalName,
            authenticityScore: img.authenticityScore,
            riskLevel: img.riskClassification?.level,
            flagsCount: img.forensicAnalysis?.flags?.length || 0
          })),
      metadata: {
        reportVersion: '3.0.0-batch',
        template: sanitizedTemplate,
        format: sanitizedFormat,
        language: language,
        includesSummaryStats: includeSummaryStats === 'true',
        includesIndividualAnalyses: includeIndividualAnalyses === 'true'
      }
    };

    // Créer enregistrement rapport
    const batchReport = new Report({
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
          userId: req.user?.sub,
          ip: req.ip,
          timestamp: new Date()
        }
      }
    });

    await batchReport.save();

    // Générer fichier rapport
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFilename = `rapport-batch_${sanitizedSessionId}_${timestamp}_${requestId}.${sanitizedFormat}`;
    const reportsDir = path.join(process.env.UPLOAD_REPORTS_DIR || './uploads/reports');
    const reportPath = path.join(reportsDir, reportFilename);

    let generatedPath;

    switch (sanitizedFormat) {
      case 'pdf':
        generatedPath = await generateBatchPdfReport(batchReportData, reportPath);
        break;
      case 'json':
        await fs.writeFile(reportPath, JSON.stringify(batchReportData, null, 2));
        generatedPath = reportPath;
        break;
      case 'html':
        const htmlContent = await generateBatchHtmlReport(batchReportData);
        await fs.writeFile(reportPath, htmlContent);
        generatedPath = reportPath;
        break;
      case 'csv':
        const csvContent = await generateBatchCsvReport(batchReportData);
        await fs.writeFile(reportPath, csvContent);
        generatedPath = reportPath;
        break;
      default:
        throw new Error(`Format batch ${sanitizedFormat} non supporté`);
    }

    const fileStats = await fs.stat(generatedPath);

    // Mettre à jour rapport
    await Report.findByIdAndUpdate(batchReport._id, {
      'formats.0.generated': true,
      'formats.0.filepath': generatedPath,
      'formats.0.fileSize': fileStats.size,
      'formats.0.generatedAt': new Date(),
      status: 'completed',
      progress: 100,
      'generation.processingTime': Date.now() - startTime
    });

    // Téléchargement
    res.setHeader('Content-Type', getContentType(sanitizedFormat));
    res.setHeader('Content-Length', fileStats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${reportFilename}"`);
    res.setHeader('X-Report-Type', 'batch');
    res.setHeader('X-Images-Count', images.length.toString());

    res.download(generatedPath, reportFilename, async (error) => {
      if (!error) {
        await batchReport.recordAccess('download', {
          ip: req.ip,
          userId: req.user?.sub
        });
        console.log(`✅ Rapport batch téléchargé: ${sanitizedSessionId} [${requestId}]`);
      }

      // Nettoyage
      setTimeout(async () => {
        if (fsSync.existsSync(generatedPath)) {
          await fs.unlink(generatedPath);
        }
      }, 30000);
    });

  } catch (error) {
    console.error(`❌ Erreur generateBatchReport [${requestId}]:`, error);
    res.status(500).json({
      error: 'Erreur génération rapport batch',
      type: 'BATCH_REPORT_ERROR',
      requestId: requestId
    });
  }
};

/**
 * Obtenir résumé d'un rapport avant génération
 */
exports.getReportPreview = async (req, res) => {
  try {
    const { imageId } = req.params;
    const requestId = crypto.randomBytes(6).toString('hex');

    const objectId = req.forensicObjectId || validateObjectId(imageId);

    const [image, analysis] = await Promise.all([
      Image.findById(objectId)
        .select('originalName status authenticityScore riskClassification forensicAnalysis createdAt size exifData')
        .lean(),
      Analysis.findOne({ imageId: objectId })
        .select('aggregatedScore consolidatedFlags analysisMetadata')
        .lean()
    ]);

    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée',
        type: 'IMAGE_NOT_FOUND',
        requestId: requestId
      });
    }

    const analysisData = analysis || extractLegacyAnalysis(image.forensicAnalysis);

    const preview = {
      imageInformation: {
        filename: image.originalName,
        fileSize: formatBytes(image.size),
        uploadDate: image.createdAt,
        status: image.status
      },
      analysisResults: {
        available: image.status === 'analyzed',
        authenticityScore: analysisData?.aggregatedScore?.authenticity || image.authenticityScore || 0,
        riskLevel: analysisData?.aggregatedScore?.riskLevel || image.riskClassification?.level || 'UNKNOWN',
        confidence: analysisData?.aggregatedScore?.confidence || image.riskClassification?.confidence || 'low'
      },
      securityFlags: {
        total: analysisData?.consolidatedFlags?.length || 0,
        critical: analysisData?.consolidatedFlags?.filter(f => f.severity === 'critical').length || 0,
        warning: analysisData?.consolidatedFlags?.filter(f => f.severity === 'warning').length || 0
      },
      forensicPillars: {
        anatomical: !!analysisData?.anatomicalAnalysis,
        physics: !!analysisData?.physicsAnalysis,
        statistical: !!analysisData?.statisticalAnalysis,
        exif: !!analysisData?.exifForensics,
        behavioral: !!analysisData?.behavioralAnalysis,
        audio: !!analysisData?.audioForensics,
        expert: !!analysisData?.expertAnalysis
      },
      metadata: {
        hasExifData: !!(image.exifData && Object.keys(image.exifData).length > 0),
        processingTime: analysisData?.analysisMetadata?.processingTime,
        analysisVersion: analysisData?.analysisVersion || '2.1.0'
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

  } catch (error) {
    console.error('❌ Erreur getReportPreview:', error);
    res.status(500).json({
      error: 'Erreur génération aperçu rapport',
      type: 'PREVIEW_ERROR'
    });
  }
};

/**
 * Lister rapports disponibles avec filtres
 */
exports.listAvailableReports = async (req, res) => {
  try {
    const { 
      sessionId, 
      reportType = 'all', 
      status = 'completed', 
      category, 
      dateFrom, 
      dateTo, 
      page = 1, 
      limit = 20 
    } = req.query;

    const requestId = crypto.randomBytes(6).toString('hex');

    console.log(`📋 Liste rapports demandée [${requestId}]`);

    // Sanitization des paramètres
    const sanitizedSessionId = sanitizeInput(sessionId);
    const sanitizedReportType = sanitizeInput(reportType);
    const sanitizedStatus = sanitizeInput(status);
    const sanitizedCategory = sanitizeInput(category);

    // Construction filtre
    const filter = {};
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
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Exécution requêtes
    const [reports, totalCount] = await Promise.all([
      Report.find(filter)
        .select('reportId reportType category status generatedAt formats statistics executiveSummary images')
        .populate('images', 'originalName')
        .sort({ generatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Report.countDocuments(filter)
    ]);

    // Formatage résultats
    const formattedReports = reports.map(report => ({
      id: report._id,
      reportId: report.reportId,
      type: report.reportType,
      category: report.category,
      status: report.status,
      generatedAt: report.generatedAt,
      formats: report.formats?.map(f => ({
        type: f.type,
        available: f.generated,
        size: f.fileSize ? formatBytes(f.fileSize) : null
      })) || [],
      images: {
        count: report.images?.length || 0,
        samples: report.images?.slice(0, 3).map(img => img.originalName) || []
      },
      summary: {
        overallRisk: report.executiveSummary?.overallRisk,
        totalImages: report.statistics?.totalImages,
        criticalIssues: report.executiveSummary?.criticalIssues?.length || 0
      },
      downloadUrl: `/api/reports/${report._id}/download`
    }));

    // Statistiques liste
    const listStats = {
      total: totalCount,
      byType: {},
      byStatus: {},
      byCategory: {}
    };

    reports.forEach(report => {
      listStats.byType[report.reportType] = (listStats.byType[report.reportType] || 0) + 1;
      listStats.byStatus[report.status] = (listStats.byStatus[report.status] || 0) + 1;
      listStats.byCategory[report.category] = (listStats.byCategory[report.category] || 0) + 1;
    });

    const response = {
      reports: formattedReports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum)
      },
      statistics: listStats,
      filtering: {
        applied: { sessionId: sanitizedSessionId, reportType: sanitizedReportType, status: sanitizedStatus, category: sanitizedCategory, dateFrom, dateTo },
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
    console.log(`✅ Liste rapports: ${formattedReports.length}/${totalCount} [${requestId}]`);

  } catch (error) {
    console.error('❌ Erreur listAvailableReports:', error);
    res.status(500).json({
      error: 'Erreur récupération liste rapports',
      type: 'LIST_ERROR'
    });
  }
};

/**
 * Télécharger un rapport existant
 */
exports.downloadExistingReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { format } = req.query;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        error: 'Rapport non trouvé',
        type: 'REPORT_NOT_FOUND'
      });
    }

    // Vérifier permissions
    if (report.access?.permissions?.requiresAuth && !req.user) {
      return res.status(401).json({
        error: 'Authentification requise',
        type: 'AUTH_REQUIRED'
      });
    }

    // Vérifier expiration
    if (report.isExpired) {
      return res.status(410).json({
        error: 'Rapport expiré',
        type: 'REPORT_EXPIRED',
        expiredAt: report.access.expiresAt
      });
    }

    // Trouver format demandé
    const requestedFormat = format || report.formats[0]?.type;
    const formatInfo = report.formats.find(f => f.type === requestedFormat);

    if (!formatInfo || !formatInfo.generated) {
      return res.status(404).json({
        error: 'Format non disponible',
        type: 'FORMAT_NOT_AVAILABLE',
        availableFormats: report.formats.filter(f => f.generated).map(f => f.type)
      });
    }

    // Vérifier fichier existe
    if (!formatInfo.filepath || !fsSync.existsSync(formatInfo.filepath)) {
      return res.status(404).json({
        error: 'Fichier rapport introuvable',
        type: 'FILE_NOT_FOUND'
      });
    }

    // Enregistrer accès
    await report.recordAccess('download', {
      ip: req.ip,
      userId: req.user?.sub,
      userAgent: req.get('User-Agent')
    });

    // Téléchargement
    const filename = `rapport_${report.reportId}_${requestedFormat}.${requestedFormat}`;
    res.setHeader('Content-Type', getContentType(requestedFormat));
    res.setHeader('Content-Length', formatInfo.fileSize);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Report-ID', report.reportId);

    res.download(formatInfo.filepath, filename, (error) => {
      if (error) {
        console.error('❌ Erreur téléchargement rapport:', error);
      } else {
        console.log(`✅ Rapport téléchargé: ${report.reportId} (${requestedFormat})`);
      }
    });

  } catch (error) {
    console.error('❌ Erreur downloadExistingReport:', error);
    res.status(500).json({
      error: 'Erreur téléchargement rapport',
      type: 'DOWNLOAD_ERROR'
    });
  }
};

/**
 * Exporter données forensiques brutes
 */
exports.exportForensicData = async (req, res) => {
  try {
    const { imageId } = req.params;
    const { 
      format = 'json', 
      includeRawExif = 'false', 
      includePillarsDetails = 'true', 
      includeChainOfCustody = 'false' 
    } = req.query;

    const objectId = req.forensicObjectId || validateObjectId(imageId);

    const [image, analysis] = await Promise.all([
      Image.findById(objectId).lean(),
      Analysis.findOne({ imageId: objectId }).lean()
    ]);

    if (!image) {
      return res.status(404).json({
        error: 'Image non trouvée pour export',
        type: 'IMAGE_NOT_FOUND'
      });
    }

    // Sanitization des paramètres
    const sanitizedFormat = sanitizeInput(format);

    // Construire données export selon privacy mode
    const exportData = buildForensicExportData(image, analysis, {
      includeRawExif: includeRawExif === 'true' && req.privacyMode !== 'RESEARCH',
      includePillarsDetails: includePillarsDetails === 'true',
      includeChainOfCustody: includeChainOfCustody === 'true' && req.privacyMode === 'JUDICIAL',
      privacyMode: req.privacyMode || 'COMMERCIAL',
      requestedBy: req.user?.sub || 'anonymous'
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedOriginalName = sanitizeInput(image.originalName).replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `export-forensique_${sanitizedOriginalName}_${timestamp}.${sanitizedFormat}`;

    switch (sanitizedFormat) {
      case 'json':
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.json(exportData);
        break;

      case 'csv':
        const csvData = convertToCSV(exportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csvData);
        break;

      case 'xml':
        const xmlData = convertToXML(exportData);
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(xmlData);
        break;

      default:
        return res.status(400).json({
          error: 'Format export non supporté',
          supportedFormats: ['json', 'csv', 'xml']
        });
    }

    console.log(`✅ Export forensique: ${imageId} (${sanitizedFormat})`);

  } catch (error) {
    console.error('❌ Erreur exportForensicData:', error);
    res.status(500).json({
      error: 'Erreur export données forensiques',
      type: 'EXPORT_ERROR'
    });
  }
};

// =====================================
// FONCTIONS UTILITAIRES OPTIMISÉES
// =====================================

function buildComprehensiveReportData(image, analysis, options) {
  const analysisData = analysis || extractLegacyAnalysis(image.forensicAnalysis);

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
      hash: options.generatedFor === 'JUDICIAL' ? image.hash : image.hash?.substring(0, 20) + '...',
      status: image.status
    },

    // Évaluation globale
    overallAssessment: {
      authenticityScore: analysisData?.aggregatedScore?.authenticity || image.authenticityScore || 0,
      riskLevel: analysisData?.aggregatedScore?.riskLevel || image.riskClassification?.level || 'UNKNOWN',
      confidence: analysisData?.aggregatedScore?.confidence || 'medium',
      recommendation: generateRecommendationText(analysisData?.aggregatedScore),
      lastUpdated: analysis?.updatedAt || image.updatedAt
    },

    // Analyse des piliers
    forensicPillars: options.includePillars.reduce((pillars, pillarName) => {
      const pillarData = analysisData?.[`${pillarName}Analysis`];
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
      total: analysisData?.consolidatedFlags?.length || 0,
      flags: analysisData?.consolidatedFlags || [],
      distribution: {
        critical: analysisData?.consolidatedFlags?.filter(f => f.severity === 'critical').length || 0,
        warning: analysisData?.consolidatedFlags?.filter(f => f.severity === 'warning').length || 0,
        info: analysisData?.consolidatedFlags?.filter(f => f.severity === 'info').length || 0
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
    chainOfCustody: options.includeChainOfCustody ? (analysis?.chainOfCustody || []) : null
  };
}

function extractLegacyAnalysis(forensicAnalysis) {
  if (!forensicAnalysis) return null;

  return {
    aggregatedScore: {
      authenticity: forensicAnalysis.authenticity?.score,
      confidence: forensicAnalysis.authenticity?.confidence
    },
    consolidatedFlags: forensicAnalysis.flags || []
  };
}

function calculateSessionStatistics(images, analyses) {
  const scores = images.map(img => img.authenticityScore).filter(s => s !== null);
  const flags = analyses.reduce((total, analysis) => total + (analysis.consolidatedFlags?.length || 0), 0);

  return {
    totalImages: images.length,
    analyzedImages: analyses.length,
    averageScore: scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
    scoreDistribution: {
      high: scores.filter(s => s >= 80).length,
      medium: scores.filter(s => s >= 50 && s < 80).length,
      low: scores.filter(s => s < 50).length
    },
    totalFlags: flags,
    criticalFlags: analyses.reduce((total, analysis) => total + (analysis.consolidatedFlags?.filter(f => f.severity === 'critical').length || 0), 0),
    highRiskImages: images.filter(img => (img.authenticityScore || 0) < 50).length
  };
}

function determineOverallRisk(stats) {
  const highRiskRatio = stats.highRiskImages / stats.totalImages;
  const criticalFlagRatio = stats.criticalFlags / Math.max(stats.totalImages, 1);

  if (criticalFlagRatio > 0.1 || highRiskRatio > 0.3) return 'critical';
  if (criticalFlagRatio > 0.05 || highRiskRatio > 0.1) return 'high';
  if (stats.criticalFlags > 0 || highRiskRatio > 0) return 'medium';
  return 'low';
}

function generateBatchRecommendation(stats) {
  const overallRisk = determineOverallRisk(stats);
  
  const recommendations = {
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
  const pillars = ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'];
  
  return pillars.reduce((breakdown, pillar) => {
    const pillarAnalyses = analyses.map(a => a[`${pillar}Analysis`]).filter(Boolean);
    
    breakdown[pillar] = {
      analyzed: pillarAnalyses.length,
      averageScore: pillarAnalyses.length > 0 ? Math.round(pillarAnalyses.reduce((sum, p) => sum + (p.overallScore || 0), 0) / pillarAnalyses.length) : 0,
      flagged: pillarAnalyses.filter(p => (p.overallScore || 100) < 70).length
    };
    
    return breakdown;
  }, {});
}

function buildImageSummary(image, analysis) {
  return {
    id: image._id,
    filename: image.originalName,
    fileSize: formatBytes(image.size),
    uploadDate: image.createdAt,
    status: image.status,
    authenticityScore: image.authenticityScore || analysis?.aggregatedScore?.authenticity || 0,
    riskLevel: image.riskClassification?.level || analysis?.aggregatedScore?.riskLevel || 'UNKNOWN',
    flagsCount: analysis?.consolidatedFlags?.length || 0,
    criticalFlags: analysis?.consolidatedFlags?.filter(f => f.severity === 'critical').length || 0
  };
}

function determineSuggestedTemplate(analysisData) {
  const flags = analysisData?.consolidatedFlags || [];
  const criticalFlags = flags.filter(f => f.severity === 'critical').length;
  const score = analysisData?.aggregatedScore?.authenticity || 0;

  if (criticalFlags > 0 || score < 30) return 'legal';
  if (score < 50 || flags.length > 5) return 'detailed';
  if (score > 80 && flags.length === 0) return 'summary';
  return 'executive';
}

function buildForensicExportData(image, analysis, options) {
  const baseData = {
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
      hash: options.privacyMode === 'JUDICIAL' ? image.hash : image.hash?.substring(0, 16) + '...'
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
    baseData.chainOfCustody = analysis?.chainOfCustody || [];
  }

  return baseData;
}

function getContentType(format) {
  const contentTypes = {
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
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function extractPillarFindings(pillarData) {
  if (!pillarData) return [];
  
  const findings = [];
  
  if (pillarData.anomalies) findings.push(...pillarData.anomalies);
  if (pillarData.violations) findings.push(...pillarData.violations);
  if (pillarData.flags) findings.push(...pillarData.flags);
  
  return findings;
}

function calculatePillarConfidence(pillarData) {
  if (!pillarData) return 'low';
  
  const score = pillarData.overallScore || 0;
  const hasFindings = extractPillarFindings(pillarData).length > 0;
  
  if (score > 80 && hasFindings) return 'high';
  if (score > 60 || hasFindings) return 'medium';
  return 'low';
}

function generateRecommendationText(aggregatedScore) {
  if (!aggregatedScore) return 'Analyse incomplète - Évaluation impossible';
  
  const score = aggregatedScore.authenticity || 0;
  
  if (score >= 90) return 'Image hautement authentique - Utilisation recommandée';
  if (score >= 80) return 'Image authentique - Utilisation sécurisée';
  if (score >= 70) return 'Image probablement authentique - Utilisation avec vigilance standard';
  if (score >= 50) return 'Authenticité incertaine - Vérification supplémentaire recommandée';
  if (score >= 30) return '⚠️ Image suspecte - Investigation forensique approfondie nécessaire';
  return '🚨 Image hautement suspecte - Ne pas utiliser sans expertise forensique complète';
}

// Placeholders pour les fonctions de génération spécialisées
async function generateHtmlReport(reportData) {
  return `<!DOCTYPE html>
<html>
<head><title>Rapport Forensique</title></head>
<body>
<h1>Rapport Forensique</h1>
<pre>${JSON.stringify(reportData, null, 2)}</pre>
</body>
</html>`;
}

async function generateCsvReport(reportData) {
  const rows = [
    'Métrique,Valeur',
    `Nom fichier,${reportData.imageInformation.filename}`,
    `Score authenticité,${reportData.overallAssessment.authenticityScore}`,
    `Niveau risque,${reportData.overallAssessment.riskLevel}`,
    `Nombre flags,${reportData.securityFlags.total}`
  ];
  
  return rows.join('\n');
}

async function generateDocxReport(reportData, reportPath) {
  // Placeholder - implémentation DOCX à faire
  const content = JSON.stringify(reportData, null, 2);
  await fs.writeFile(reportPath, content);
  return reportPath;
}

async function generateBatchPdfReport(batchData, reportPath) {
  // Placeholder - utiliser générateur PDF batch
  return await generateForensicPdfReport(batchData, reportPath, { 
    template: 'batch' 
  });
}

async function generateBatchHtmlReport(batchData) {
  return `<!DOCTYPE html>
<html>
<head><title>Rapport Batch Forensique</title></head>
<body>
<h1>Rapport Batch Forensique</h1>
<pre>${JSON.stringify(batchData, null, 2)}</pre>
</body>
</html>`;
}

async function generateBatchCsvReport(batchData) {
  const rows = [
    'Session ID,Total Images,Images Analysées,Score Moyen,Images Haute Risk,Flags Total',
    `${batchData.sessionId},${batchData.sessionSummary.totalImages},${batchData.sessionSummary.analyzedImages},${batchData.statisticalSummary.averageScore},${batchData.statisticalSummary.highRiskImages},${batchData.statisticalSummary.totalFlags}`
  ];
  
  return rows.join('\n');
}

function convertToCSV(data) {
  // Implémentation simple CSV
  return Object.entries(data)
    .map(([key, value]) => `${key},"${typeof value === 'object' ? JSON.stringify(value) : value}"`)
    .join('\n');
}

function convertToXML(data) {
  // Implémentation simple XML
  const xmlContent = Object.entries(data)
    .map(([key, value]) => `  <${key}>${typeof value === 'object' ? JSON.stringify(value) : value}</${key}>`)
    .join('\n');
    
  return `<?xml version="1.0" encoding="UTF-8"?>
<forensicExport>
${xmlContent}
</forensicExport>`;
}

// Nettoyage périodique du cache
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of reportCache) {
    if (now - value.timestamp > REPORT_CACHE_TTL) {
      reportCache.delete(key);
    }
  }
}, REPORT_CACHE_TTL); // Nettoyer toutes les 10 minutes

module.exports = exports;
