// src/services/reportService.js
"use strict";

const cacheService = require('./cacheService');
const pythonBridge = require('./pythonBridge');
const analysisQueue = require('./analysisQueue');
const Image = require('../models/Image');
const Analysis = require('../models/Analysis');
const Report = require('../models/Report');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

class ReportService {
  constructor() {
    this.cacheService = cacheService;
    this.pythonBridge = pythonBridge;
    this.analysisQueue = analysisQueue;
  }

  /**
   * Générer rapport avec cache Ba7ath
   */
  async generateReport(imageId, options) {
    const startTime = Date.now();

    // Normaliser options
    const opts = this.sanitizeOptions(options || {});
    const cacheKey = this.buildCacheKey(imageId, opts);

    // 1) Cache
    const cached = await this.cacheService.getCachedReport(cacheKey);
    if (cached) {
      console.log(`💾 Cache hit Ba7ath: ${imageId}`);
      return cached;
    }

    // 2) Données source
    const [image, analysis] = await Promise.all([
      Image.findById(imageId).lean(),
      Analysis.findOne({ imageId }).lean()
    ]);

    if (!image) throw new Error('Image non trouvée');

    // 3) Construire payload rapport
    const reportData = this.buildReportData(image, analysis, opts);

    // 4) Générer par format
    const result = await this.generateByFormat(reportData, opts);

    // 5) Métadonnées
    result.processingTime = Date.now() - startTime;
    result.reportId = opts.requestId || crypto.randomBytes(8).toString('hex');
    result.imageId = imageId;

    // 6) Cache résultat
    await this.cacheService.cacheReport(cacheKey, result, this.cacheService.CACHE_TTL?.reports || 3600);

    // 7) Optionnel: sauvegarde en DB
    await this.saveReportRecord(result, opts, image).catch(() => {});

    return result;
  }

  /**
   * Queue batch via analysisQueue réel
   */
  async queueBatchReport(sessionId, options) {
    const opts = this.sanitizeOptions(options || {});
    const imageCount = await Image.countDocuments({ sessionId, status: 'analyzed' });

    if (imageCount === 0) throw new Error('Aucune image analysée pour cette session');

    const job = await this.analysisQueue.add(
      'batch-report-generation',
      { sessionId, options: opts, imageCount },
      { priority: opts.urgent ? 10 : 1, attempts: 3, backoff: 'exponential' }
    );

    return { id: job.id, status: 'queued', sessionId, estimatedImages: imageCount };
  }

  /**
   * Génération par format
   */
  async generateByFormat(reportData, options) {
    const format = String(options.format || 'pdf').toLowerCase();

    switch (format) {
      case 'pdf':
      case 'docx':
        return await this.generateViaPython(reportData, options);
      case 'json':
        return this.generateJsonReport(reportData, options);
      case 'csv':
        return this.generateCsvReport(reportData, options);
      case 'html':
        return this.generateHtmlReport(reportData, options);
      default:
        throw new Error(`Format ${format} non supporté`);
    }
  }

  /**
   * Génération via pythonBridge
   */
  async generateViaPython(reportData, options) {
    const outDir = process.env.UPLOAD_REPORTS_DIR || path.resolve(process.cwd(), 'uploads', 'reports');

    const result = await this.pythonBridge.executeScript(
      'generate_report.py',
      {
        data: reportData,
        format: options.format,
        template: options.template,
        language: options.language,
        outputDir: outDir
      },
      { timeout: 300000 }
    );

    if (!result.success) {
      throw new Error(`Erreur Python: ${result.data?.error || 'Génération échouée'}`);
    }

    return {
      filepath: result.data.filepath,
      filename: result.data.filename,
      fileSize: result.data.fileSize,
      contentType: this.getContentType(options.format),
      format: options.format
    };
  }

  /**
   * Construction données rapport
   */
  buildReportData(image, analysis, options) {
    const analysisData = analysis || this.extractLegacyAnalysis(image.forensicAnalysis);

    return {
      reportMetadata: {
        reportId: options.requestId || crypto.randomBytes(8).toString('hex'),
        generatedAt: new Date().toISOString(),
        generatedBy: options.userId || 'anonymous',
        reportVersion: '3.0.0-ba7ath',
        template: options.template,
        format: options.format,
        language: options.language,
        privacyMode: options.privacyMode
      },
      imageInformation: {
        id: image._id.toString(),
        filename: image.originalName,
        fileSize: image.size,
        mimeType: image.mimeType,
        uploadDate: image.createdAt,
        hash: this.sanitizeHash(image.hash, options.privacyMode),
        status: image.status
      },
      overallAssessment: {
        authenticityScore: analysisData?.aggregatedScore?.authenticity || image.authenticityScore || 0,
        riskLevel: analysisData?.aggregatedScore?.riskLevel || image.riskClassification?.level || 'UNKNOWN',
        confidence: analysisData?.aggregatedScore?.confidence || 'medium',
        recommendation: this.generateRecommendation(analysisData?.aggregatedScore),
        lastUpdated: analysis?.updatedAt || image.updatedAt
      },
      forensicPillars: this.buildPillarsData(analysisData, options),
      securityFlags: {
        total: analysisData?.consolidatedFlags?.length || 0,
        flags: analysisData?.consolidatedFlags || []
      }
    };
  }

  // --- Formats légers ---

  generateJsonReport(reportData, options) {
    const content = JSON.stringify(reportData, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `rapport-forensique_${timestamp}.json`;

    return {
      data: content,
      filename,
      contentType: 'application/json',
      format: 'json',
      fileSize: Buffer.byteLength(content, 'utf8')
    };
  }

  generateCsvReport(reportData, options) {
    const rows = [
      'Métrique,Valeur',
      `Nom fichier,${reportData.imageInformation.filename}`,
      `Score authenticité,${reportData.overallAssessment.authenticityScore}`,
      `Niveau risque,${reportData.overallAssessment.riskLevel}`,
      `Nombre flags,${reportData.securityFlags.total}`
    ];

    const content = rows.join('\n');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `rapport-forensique_${timestamp}.csv`;

    return {
      data: content,
      filename,
      contentType: 'text/csv',
      format: 'csv',
      fileSize: Buffer.byteLength(content, 'utf8')
    };
  }

  generateHtmlReport(reportData, options) {
    const content = `<!DOCTYPE html>
<html lang="${options.language || 'fr'}">
<head>
  <meta charset="UTF-8">
  <title>Rapport Forensique Ba7ath - ${reportData.imageInformation.filename}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .header { border-bottom: 2px solid #333; padding-bottom: 20px; }
    .score { font-size: 24px; font-weight: bold; color: ${reportData.overallAssessment.authenticityScore > 70 ? 'green' : 'red'}; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔍 Rapport Forensique Ba7ath</h1>
    <p><strong>Fichier:</strong> ${reportData.imageInformation.filename}</p>
    <p><strong>Généré le:</strong> ${new Date().toLocaleString()}</p>
  </div>
  <div class="section">
    <h2>Évaluation Globale</h2>
    <div class="score">Score d'Authenticité: ${reportData.overallAssessment.authenticityScore}%</div>
    <p><strong>Niveau de Risque:</strong> ${reportData.overallAssessment.riskLevel}</p>
    <p><strong>Recommandation:</strong> ${reportData.overallAssessment.recommendation}</p>
  </div>
  <div class="section">
    <h2>Flags de Sécurité</h2>
    <p><strong>Total:</strong> ${reportData.securityFlags.total} flags détectés</p>
  </div>
</body>
</html>`;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `rapport-forensique_${timestamp}.html`;

    return {
      data: content,
      filename,
      contentType: 'text/html',
      format: 'html',
      fileSize: Buffer.byteLength(content, 'utf8')
    };
  }

  // --- Utilitaires ---

  buildCacheKey(imageId, options) {
    const key = `${imageId}-${options.template}-${options.format}-${options.includePillars}-${options.language}-${options.privacyMode}`;
    return crypto.createHash('md5').update(key).digest('hex').substring(0, 16);
  }

  sanitizeOptions(options) {
    return {
      template: options.template || 'executive',
      format: options.format || 'pdf',
      language: options.language || 'fr',
      includeRawData: Boolean(options.includeRawData),
      includePillars: options.includePillars !== false, // par défaut true
      userId: options.userId,
      privacyMode: options.privacyMode || 'COMMERCIAL',
      requestId: options.requestId || crypto.randomBytes(8).toString('hex'),
      urgent: Boolean(options.urgent)
    };
  }

  extractLegacyAnalysis(forensicAnalysis) {
    if (!forensicAnalysis) return null;
    return {
      aggregatedScore: {
        authenticity: forensicAnalysis.authenticity?.score,
        confidence: forensicAnalysis.authenticity?.confidence,
        riskLevel: forensicAnalysis.riskLevel || 'UNKNOWN'
      },
      consolidatedFlags: forensicAnalysis.flags || []
    };
  }

  buildPillarsData(analysisData, options) {
    const pillars = ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'];
    return pillars.reduce((acc, pillar) => {
      const pillarData = analysisData?.[`${pillar}Analysis`];
      acc[pillar] = {
        analyzed: !!pillarData,
        overallScore: pillarData?.overallScore || 0
      };
      return acc;
    }, {});
  }

  sanitizeHash(hash, privacyMode) {
    if (privacyMode === 'JUDICIAL') return hash || null;
    return hash ? hash.substring(0, 20) + '...' : null;
  }

  generateRecommendation(aggregatedScore) {
    if (!aggregatedScore) return 'Analyse incomplète';
    const score = aggregatedScore.authenticity || 0;

    if (score >= 90) return '✅ Image hautement authentique - Utilisation recommandée';
    if (score >= 80) return '✅ Image authentique - Utilisation sécurisée';
    if (score >= 50) return '⚠️ Authenticité incertaine - Vérification recommandée';
    return '🚨 Image suspecte - Investigation forensique nécessaire';
  }

  getContentType(format) {
    const map = {
      pdf: 'application/pdf',
      json: 'application/json',
      html: 'text/html',
      csv: 'text/csv',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return map[String(format).toLowerCase()] || 'application/octet-stream';
  }

  async saveReportRecord(result, options, image) {
    try {
      // Persist minimal footprint; adapter selon votre schéma
      await Report.create({
        imageId: image._id,
        reportId: result.reportId,
        format: result.format,
        filename: result.filename,
        filepath: result.filepath,
        size: result.fileSize,
        contentType: result.contentType,
        processingTime: result.processingTime,
        createdAt: new Date()
      });
      console.log(`📝 Rapport sauvegardé: ${result.reportId}`);
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error.message);
      return false;
    }
  }

  async getHealthStatus() {
    try {
      const cacheHealth = await this.cacheService.healthCheck();
      return {
        reportService: 'healthy',
        cacheService: cacheHealth.status,
        analysisQueue: this.analysisQueue ? 'healthy' : 'unavailable',
        pythonBridge: this.pythonBridge ? 'healthy' : 'unavailable'
      };
    } catch (error) {
      return { reportService: 'unhealthy', error: error.message };
    }
  }
}

module.exports = new ReportService();
