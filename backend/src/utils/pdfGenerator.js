const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// =====================================
// GÉNÉRATEUR PDF FORENSIQUE ROBUSTE - VERSION 4.0 CORRIGÉE
// =====================================

class ForensicPDFGenerator {
    constructor() {
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
            margins: { top: 60, bottom: 60, left: 50, right: 50 }
        };
    }

    /**
     * Génération PDF forensique avec gestion d'erreur robuste
     */
    async generateForensicPdfReport(data, outputPath, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                console.log(`📄 Génération PDF forensique: ${path.basename(outputPath)}`);
                
                // Validation entrée robuste
                const validationResult = this.validateInputData(data, outputPath);
                if (!validationResult.valid) {
                    throw new Error(`Validation échouée: ${validationResult.errors.join(', ')}`);
                }

                // Préparation données
                const reportData = this.prepareReportData(data, options);
                
                // Création document PDF
                const doc = new PDFDocument({
                    size: this.pageConfig.size,
                    margins: this.pageConfig.margins,
                    bufferPages: true,
                    autoFirstPage: true,
                    info: {
                        Title: `Rapport Forensique - ${reportData.imageName}`,
                        Author: 'Ba7ath Forensic Platform',
                        Creator: `Ba7ath PDF Generator v${this.version}`,
                        CreationDate: new Date(),
                        Keywords: 'forensic,analysis,security,authentication'
                    }
                });

                // Création dossier de sortie
                this.ensureDirectoryExists(path.dirname(outputPath));

                // Stream vers fichier
                const stream = fs.createWriteStream(outputPath);
                doc.pipe(stream);

                // Génération contenu PDF complet
                this.generateCompleteReport(doc, reportData);

                // Finalisation
                doc.end();

                // Gestion événements stream
                stream.on('finish', () => {
                    try {
                        const stats = fs.statSync(outputPath);
                        console.log(`✅ PDF généré: ${outputPath} (${this.formatFileSize(stats.size)})`);
                        resolve({
                            path: outputPath,
                            size: stats.size,
                            pages: doc.bufferedPageRange().count,
                            success: true
                        });
                    } catch (statError) {
                        reject(new Error(`Erreur vérification fichier: ${statError.message}`));
                    }
                });

                stream.on('error', (streamError) => {
                    console.error(`❌ Erreur écriture PDF: ${streamError.message}`);
                    this.cleanupFile(outputPath);
                    reject(new Error(`Écriture PDF échouée: ${streamError.message}`));
                });

                // Timeout sécurité
                const timeout = setTimeout(() => {
                    doc.end();
                    this.cleanupFile(outputPath);
                    reject(new Error('Timeout génération PDF (60 secondes)'));
                }, 60000);

                stream.on('finish', () => clearTimeout(timeout));

            } catch (error) {
                console.error(`❌ Erreur génération PDF: ${error.message}`);
                this.cleanupFile(outputPath);
                reject(error);
            }
        });
    }

    /**
     * Génération du rapport complet
     */
    generateCompleteReport(doc, data) {
        let currentPage = 1;
        
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
            console.error(`❌ Erreur génération contenu: ${error.message}`);
            throw error;
        }
    }

    /**
     * Header du rapport
     */
    addReportHeader(doc, data) {
        const startY = doc.y;

        // Titre principal
        doc.fontSize(24)
           .font(this.fonts.bold)
           .fillColor(this.colors.primary)
           .text('BA7ATH FORENSIC ANALYSIS', { align: 'center' });

        doc.moveDown(0.3);

        // Sous-titre
        doc.fontSize(16)
           .font(this.fonts.regular)
           .fillColor(this.colors.text)
           .text('Rapport d\'Analyse Forensique Numérique', { align: 'center' });

        doc.moveDown(0.2);

        // Description
        doc.fontSize(12)
           .fillColor(this.colors.gray)
           .text('Analyse Professionnelle Conforme aux Standards ISO/IEC 27037', { align: 'center' });

        doc.moveDown(0.8);

        // Informations du rapport
        const reportInfo = [
            ['Généré le:', new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })],
            ['ID Rapport:', data.reportId],
            ['Version:', this.version],
            ['Fichier analysé:', this.safeTruncate(data.imageName, 40)]
        ];

        let infoY = doc.y;
        reportInfo.forEach(([label, value], index) => {
            const y = infoY + (index * 15);
            doc.fontSize(10)
               .font(this.fonts.bold)
               .fillColor(this.colors.text)
               .text(label, 50, y);
            
            doc.font(this.fonts.regular)
               .text(value, 130, y);
        });

        doc.y = infoY + (reportInfo.length * 15) + 20;

        // Ligne de séparation
        this.addSeparatorLine(doc);
        doc.moveDown(1);
    }

    /**
     * Résumé exécutif
     */
    addExecutiveSummary(doc, data) {
        this.addSectionTitle(doc, 'RÉSUMÉ EXÉCUTIF');

        const authenticityScore = data.authenticityScore || 0;
        const riskLevel = this.calculateRiskLevel(authenticityScore);
        const flags = data.securityFlags || [];

        // Score central dans un cadre
        const boxY = doc.y + 10;
        const boxHeight = 80;
        const centerX = (this.pageConfig.width / 2) - 60;

        // Cadre du score
        doc.roundedRect(centerX, boxY, 120, boxHeight, 5)
           .strokeColor(riskLevel.color)
           .lineWidth(2)
           .stroke();

        // Score
        doc.fontSize(32)
           .font(this.fonts.bold)
           .fillColor(riskLevel.color)
           .text(`${authenticityScore}/100`, centerX + 10, boxY + 15, { width: 100, align: 'center' });

        // Label
        doc.fontSize(12)
           .font(this.fonts.regular)
           .fillColor(this.colors.text)
           .text('Score d\'Authenticité', centerX + 10, boxY + 55, { width: 100, align: 'center' });

        doc.y = boxY + boxHeight + 20;

        // Niveau de risque
        doc.fontSize(18)
           .font(this.fonts.bold)
           .fillColor(riskLevel.color)
           .text(`Niveau de Risque: ${riskLevel.label}`, { align: 'center' });

        doc.moveDown(1);

        // Informations principales
        const mainInfo = [
            ['Fichier:', this.safeTruncate(data.imageName, 50)],
            ['Taille:', this.formatFileSize(data.fileSize)],
            ['Format:', data.mimeType || 'Non spécifié'],
            ['Analyse:', new Date().toLocaleDateString('fr-FR')]
        ];

        mainInfo.forEach(([label, value]) => {
            doc.fontSize(11)
               .font(this.fonts.bold)
               .fillColor(this.colors.text)
               .text(`${label} `, { continued: true })
               .font(this.fonts.regular)
               .text(value);
        });

        doc.moveDown(1);

        // Alertes si présentes
        if (flags.length > 0) {
            const criticalCount = flags.filter(f => f.severity === 'critical').length;
            const warningCount = flags.filter(f => f.severity === 'warning').length;

            doc.fontSize(14)
               .font(this.fonts.bold)
               .fillColor(this.colors.danger)
               .text(`⚠️ ALERTES DÉTECTÉES: ${flags.length}`);

            doc.moveDown(0.3);

            if (criticalCount > 0) {
                doc.fontSize(11)
                   .fillColor(this.colors.danger)
                   .text(`• ${criticalCount} alerte(s) critique(s) - Action immédiate requise`);
            }

            if (warningCount > 0) {
                doc.fontSize(11)
                   .fillColor(this.colors.warning)
                   .text(`• ${warningCount} avertissement(s) - Vigilance recommandée`);
            }

            doc.moveDown(0.8);
        }

        // Évaluation rapide
        const assessment = this.generateQuickAssessment(authenticityScore, flags);
        doc.fontSize(12)
           .font(this.fonts.bold)
           .fillColor(assessment.color)
           .text(assessment.text, { align: 'left' });
    }

    /**
     * Informations du fichier
     */
    addFileInformation(doc, data) {
        this.addSectionTitle(doc, 'INFORMATIONS DÉTAILLÉES DU FICHIER');

        // Informations de base
        this.addSubsectionTitle(doc, 'Propriétés du Fichier');

        const fileInfo = [
            ['Nom original:', this.safeTruncate(data.originalName, 60)],
            ['Nom sécurisé:', this.safeTruncate(data.filename, 60)],
            ['Taille (octets):', (data.fileSize || 0).toLocaleString('fr-FR')],
            ['Taille (lisible):', this.formatFileSize(data.fileSize)],
            ['Type MIME:', data.mimeType || 'Non spécifié'],
            ['Extension:', data.extension || 'Inconnue'],
            ['Date upload:', data.uploadDate ? new Date(data.uploadDate).toLocaleDateString('fr-FR') : 'Inconnue'],
            ['Statut:', data.status || 'Analysé']
        ];

        this.addInfoTable(doc, fileInfo);

        doc.moveDown(1);

        // Sécurité et intégrité
        if (data.hash) {
            this.addSubsectionTitle(doc, 'Sécurité et Intégrité');
            
            doc.fontSize(10)
               .fillColor(this.colors.success)
               .text('✓ Intégrité du fichier vérifiée par empreinte cryptographique');
            
            doc.fontSize(9)
               .fillColor(this.colors.gray)
               .text(`SHA-256: ${this.safeTruncate(data.hash, 64)}`);
            
            doc.moveDown(0.5);
        }
    }

    /**
     * Analyse EXIF
     */
    addExifAnalysis(doc, data) {
        this.addSectionTitle(doc, 'ANALYSE DES MÉTADONNÉES EXIF');

        const exifData = data.exifData;

        if (!exifData || Object.keys(exifData).length === 0) {
            // Absence d'EXIF
            doc.fontSize(16)
               .font(this.fonts.bold)
               .fillColor(this.colors.danger)
               .text('❌ AUCUNE MÉTADONNÉE EXIF DÉTECTÉE');

            doc.moveDown(0.5);

            doc.fontSize(11)
               .font(this.fonts.regular)
               .fillColor(this.colors.text)
               .text('Cette absence est HAUTEMENT SUSPECTE pour une photographie authentique.');

            doc.moveDown(1);

            this.addSubsectionTitle(doc, 'Implications Forensiques');

            const implications = [
                '🤖 Probabilité élevée de génération par IA',
                '🗑️ Suppression volontaire des métadonnées',
                '📱 Capture d\'écran ou export depuis logiciel',
                '🔧 Traitement par logiciel effaçant les EXIF',
                '🎨 Source non photographique (rendu, synthèse)'
            ];

            implications.forEach(implication => {
                doc.fontSize(10)
                   .fillColor(this.colors.text)
                   .text(implication);
            });

        } else {
            // EXIF présent
            let completenessScore = 0;
            let totalFields = 0;

            // Analyse appareil photo
            if (exifData.camera) {
                this.addSubsectionTitle(doc, 'Informations Appareil Photo');
                
                const cameraFields = [
                    ['Marque:', exifData.camera.make],
                    ['Modèle:', exifData.camera.model],
                    ['Objectif:', exifData.camera.lens],
                    ['N° série:', exifData.camera.serialNumber]
                ];

                cameraFields.forEach(([label, value]) => {
                    totalFields++;
                    if (value) {
                        completenessScore++;
                        doc.fontSize(10).fillColor(this.colors.success).text(`✓ ${label} ${value}`);
                    } else {
                        doc.fontSize(10).fillColor(this.colors.warning).text(`⚠️ ${label} Non spécifié`);
                    }
                });

                doc.moveDown(0.5);
            }

            // Paramètres techniques
            if (exifData.technical) {
                this.addSubsectionTitle(doc, 'Paramètres Photographiques');
                
                const techFields = [
                    ['ISO:', exifData.technical.iso],
                    ['Ouverture:', exifData.technical.aperture],
                    ['Vitesse:', exifData.technical.shutterSpeed],
                    ['Focale:', exifData.technical.focalLength],
                    ['Flash:', exifData.technical.flash],
                    ['Balance blancs:', exifData.technical.whiteBalance]
                ];

                techFields.forEach(([label, value]) => {
                    totalFields++;
                    if (value) {
                        completenessScore++;
                        doc.fontSize(10).fillColor(this.colors.success).text(`✓ ${label} ${value}`);
                    } else {
                        doc.fontSize(10).fillColor(this.colors.warning).text(`⚠️ ${label} Non spécifié`);
                    }
                });

                doc.moveDown(0.5);
            }

            // Score de complétude
            const completenessPercent = totalFields > 0 ? Math.round((completenessScore / totalFields) * 100) : 0;
            const completenessColor = completenessPercent >= 70 ? this.colors.success : 
                                    completenessPercent >= 40 ? this.colors.warning : this.colors.danger;

            doc.fontSize(13)
               .font(this.fonts.bold)
               .fillColor(completenessColor)
               .text(`📊 Score de Complétude EXIF: ${completenessPercent}% (${completenessScore}/${totalFields})`);

            doc.moveDown(0.3);

            const completenessMessage = completenessPercent >= 70 ? 
                '✅ Métadonnées riches - Compatible avec photo authentique' :
                completenessPercent >= 40 ?
                '⚠️ Métadonnées partielles - Vérification supplémentaire requise' :
                '❌ Métadonnées insuffisantes - Hautement suspect';

            doc.fontSize(10)
               .font(this.fonts.regular)
               .fillColor(completenessColor)
               .text(completenessMessage);
        }
    }

    /**
     * Analyse forensique
     */
    addForensicAnalysis(doc, data) {
        this.addSectionTitle(doc, 'ANALYSE FORENSIQUE AVANCÉE');

        const forensicData = data.forensicAnalysis;

        if (!forensicData) {
            doc.fontSize(11)
               .text('Aucune analyse forensique disponible.');
            return;
        }

        // Méthodologie
        this.addSubsectionTitle(doc, 'Méthodologie Appliquée');

        const methods = [
            '1. Analyse statistique des pixels et détection d\'anomalies',
            '2. Détection d\'artefacts de compression/recompression',
            '3. Analyse de cohérence du bruit naturel',
            '4. Détection de signatures de génération IA',
            '5. Recherche de traces de manipulation',
            '6. Calcul de scores d\'authenticité pondérés'
        ];

        methods.forEach(method => {
            doc.fontSize(9)
               .fillColor(this.colors.text)
               .text(method);
        });

        doc.moveDown(1);

        // Scores principaux
        const scores = [
            {
                label: 'Authenticité Globale',
                icon: '🛡️',
                score: forensicData.authenticity?.score || 0,
                interpretation: this.interpretAuthenticityScore
            },
            {
                label: 'Détection IA/Génération',
                icon: '🤖',
                score: forensicData.aiDetection?.generated || 0,
                interpretation: this.interpretAIScore
            },
            {
                label: 'Manipulation Globale',
                icon: '✂️',
                score: forensicData.manipulationDetection?.overall || 0,
                interpretation: this.interpretManipulationScore
            }
        ];

        scores.forEach(scoreInfo => {
            const color = this.getScoreColor(scoreInfo.score);
            
            doc.fontSize(11)
               .font(this.fonts.bold)
               .fillColor(color)
               .text(`${scoreInfo.icon} ${scoreInfo.label}: ${scoreInfo.score}/100`);
            
            doc.fontSize(9)
               .font(this.fonts.regular)
               .fillColor(this.colors.text)
               .text(`Interprétation: ${scoreInfo.interpretation(scoreInfo.score)}`);
            
            doc.moveDown(0.4);
        });

        // Alertes détaillées
        if (data.securityFlags && data.securityFlags.length > 0) {
            this.addSubsectionTitle(doc, 'Alertes Forensiques');

            data.securityFlags.slice(0, 5).forEach(flag => { // Limiter à 5 alertes
                const severityIcon = this.getSeverityIcon(flag.severity);
                const severityColor = this.getSeverityColor(flag.severity);

                doc.fontSize(10)
                   .font(this.fonts.bold)
                   .fillColor(severityColor)
                   .text(`${severityIcon} [${flag.severity.toUpperCase()}] ${this.formatFlagType(flag.type)}`);

                doc.fontSize(9)
                   .font(this.fonts.regular)
                   .fillColor(this.colors.text)
                   .text(`Message: ${flag.message || 'Aucun détail disponible'}`);

                if (flag.confidence) {
                    doc.text(`Confiance: ${flag.confidence}%`);
                }

                doc.moveDown(0.3);
            });
        }
    }

    /**
     * Section méthodologie
     */
    addMethodologySection(doc, data) {
        this.addSectionTitle(doc, 'MÉTHODOLOGIE DÉTAILLÉE');

        doc.fontSize(10)
           .font(this.fonts.regular)
           .fillColor(this.colors.text)
           .text('Cette analyse est conforme aux standards ISO/IEC 27037 et NIST SP 800-86 pour l\'investigation numérique forensique.');

        doc.moveDown(1);

        const methodologySteps = [
            {
                title: '🔍 Extraction et Validation des Données',
                content: [
                    'Extraction sécurisée des métadonnées EXIF selon standard TIFF/EXIF 2.32',
                    'Calcul et vérification d\'empreintes cryptographiques pour l\'intégrité',
                    'Validation de cohérence des timestamps selon ISO 8601',
                    'Vérification des paramètres techniques contre les limites physiques'
                ]
            },
            {
                title: '📊 Analyse Statistique des Pixels',
                content: [
                    'Analyse des histogrammes de distribution RGB/luminance',
                    'Détection de patterns de bruit naturel vs artificiel',
                    'Analyse des artefacts de compression JPEG 8x8',
                    'Vérification de cohérence des espaces chromatiques'
                ]
            },
            {
                title: '🤖 Détection de Génération IA',
                content: [
                    'Recherche de signatures GAN (réseaux adversaires)',
                    'Analyse spectrale de motifs artificiels',
                    'Vérification de cohérence des lois physiques d\'éclairage',
                    'Comparaison avec base de données de signatures connues'
                ]
            }
        ];

        methodologySteps.forEach(step => {
            this.addSubsectionTitle(doc, step.title);
            
            step.content.forEach(item => {
                doc.fontSize(9)
                   .fillColor(this.colors.text)
                   .text(`• ${item}`);
            });
            
            doc.moveDown(0.6);
        });

        // Limitations
        this.addSubsectionTitle(doc, '⚠️ Limitations et Fiabilité');

        const limitations = [
            'Analyse automatisée - Ne remplace pas l\'expertise humaine qualifiée',
            'Techniques sophistiquées peuvent échapper à la détection',
            'Résultats indicatifs - Interprétation contextuelle requise',
            'Fiabilité dépendante de la qualité des métadonnées sources'
        ];

        limitations.forEach(limitation => {
            doc.fontSize(9)
               .fillColor(this.colors.warning)
               .text(`• ${limitation}`);
        });
    }

    /**
     * Conclusions et recommandations
     */
    addConclusionsAndRecommendations(doc, data) {
        this.addSectionTitle(doc, 'CONCLUSIONS ET RECOMMANDATIONS');

        const authenticityScore = data.authenticityScore || 0;
        const flags = data.securityFlags || [];
        const criticalCount = flags.filter(f => f.severity === 'critical').length;

        // Synthèse
        this.addSubsectionTitle(doc, 'Synthèse de l\'Analyse');

        const synthesis = [
            `🎯 Score d'authenticité global: ${authenticityScore}/100`,
            `🚨 Alertes totales: ${flags.length} (${criticalCount} critiques)`,
            `📊 Métadonnées EXIF: ${data.exifData && Object.keys(data.exifData).length > 0 ? 'Présentes' : 'Absentes'}`,
            `🤖 Probabilité génération IA: ${data.forensicAnalysis?.aiDetection?.generated || 0}%`
        ];

        synthesis.forEach(item => {
            doc.fontSize(10)
               .fillColor(this.colors.text)
               .text(item);
        });

        doc.moveDown(1);

        // Évaluation finale
        const finalAssessment = this.generateFinalAssessment(authenticityScore, criticalCount);
        
        doc.fontSize(14)
           .font(this.fonts.bold)
           .fillColor(finalAssessment.color)
           .text(finalAssessment.verdict);

        doc.moveDown(0.5);

        doc.fontSize(10)
           .font(this.fonts.regular)
           .fillColor(this.colors.text)
           .text(`Niveau de confiance: ${finalAssessment.confidence}`);

        doc.moveDown(1);

        // Recommandations
        this.addSubsectionTitle(doc, 'Recommandations d\'Action');

        finalAssessment.recommendations.forEach(recommendation => {
            const isUrgent = recommendation.includes('OBLIGATOIRE') || recommendation.includes('IMMÉDIATE');
            doc.fontSize(9)
               .fillColor(isUrgent ? this.colors.danger : this.colors.text)
               .text(recommendation);
        });

        doc.moveDown(1);

        // Avertissement légal
        this.addSubsectionTitle(doc, '⚖️ Avertissement Légal');

        const legalText = 'Ce rapport constitue une pré-analyse technique automatisée. Il ne remplace pas une expertise judiciaire officielle et ne peut être utilisé seul comme preuve devant un tribunal. Pour validation formelle dans un contexte légal, une consultation d\'expert forensique certifié est impérative.';

        doc.fontSize(9)
           .fillColor(this.colors.gray)
           .text(legalText, { align: 'justify' });
    }

    // =====================================
    // MÉTHODES UTILITAIRES
    // =====================================

    /**
     * Validation robuste des données d'entrée
     */
    validateInputData(data, outputPath) {
        const errors = [];

        if (!data || typeof data !== 'object') {
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
                const dir = path.dirname(outputPath);
                if (!path.isAbsolute(outputPath) && !fs.existsSync(dir)) {
                    errors.push('Répertoire de destination invalide');
                }
            }
        } catch (pathError) {
            errors.push(`Chemin invalide: ${pathError.message}`);
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Préparation sécurisée des données
     */
    prepareReportData(data, options) {
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
            authenticityScore: data.authenticityScore || data.forensicAnalysis?.authenticity?.score || 0,
            exifData: data.exifData || {},
            forensicAnalysis: data.forensicAnalysis || {},
            securityFlags: data.forensicAnalysis?.flags || [],
            options: options
        };
    }

    /**
     * Ajout sécurisé d'une nouvelle page
     */
    addNewPage(doc) {
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
    addSectionTitle(doc, title) {
        doc.moveDown(0.5);
        
        doc.fontSize(16)
           .font(this.fonts.bold)
           .fillColor(this.colors.primary)
           .text(title);
        
        this.addSeparatorLine(doc);
        doc.moveDown(0.5);
    }

    /**
     * Ajout sous-titre de section
     */
    addSubsectionTitle(doc, title) {
        doc.moveDown(0.3);
        
        doc.fontSize(12)
           .font(this.fonts.bold)
           .fillColor(this.colors.text)
           .text(title);
        
        doc.moveDown(0.2);
    }

    /**
     * Ligne de séparation
     */
    addSeparatorLine(doc) {
        const y = doc.y + 5;
        const startX = this.pageConfig.margins.left;
        const endX = this.pageConfig.width - this.pageConfig.margins.right;

        doc.moveTo(startX, y)
           .lineTo(endX, y)
           .strokeColor(this.colors.secondary)
           .lineWidth(1)
           .stroke();
        
        doc.y = y + 10;
    }

    /**
     * Footer de page
     */
    addPageFooter(doc, pageNumber) {
        const footerY = this.pageConfig.height - 40;
        
        doc.fontSize(8)
           .font(this.fonts.regular)
           .fillColor(this.colors.gray)
           .text(
               `Ba7ath Forensic Platform v${this.version} | Page ${pageNumber}`,
               this.pageConfig.margins.left,
               footerY,
               {
                   width: this.pageConfig.width - this.pageConfig.margins.left - this.pageConfig.margins.right,
                   align: 'center'
               }
           );
    }

    /**
     * Tableau d'informations
     */
    addInfoTable(doc, items) {
        items.forEach(([label, value]) => {
            doc.fontSize(10)
               .font(this.fonts.bold)
               .fillColor(this.colors.text)
               .text(`${label} `, { continued: true })
               .font(this.fonts.regular)
               .text(this.safeTruncate(value, 60));
        });
        
        doc.moveDown(0.5);
    }

    /**
     * Génération évaluation rapide
     */
    generateQuickAssessment(score, flags) {
        const criticalCount = flags.filter(f => f.severity === 'critical').length;

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
    generateFinalAssessment(score, criticalCount) {
        if (score >= 80 && criticalCount === 0) {
            return {
                verdict: '✅ IMAGE AUTHENTIQUE',
                confidence: 'ÉLEVÉ',
                color: this.colors.success,
                recommendations: [
                    '✓ Image utilisable avec un niveau de confiance élevé',
                    '📋 Conserver la chaîne de custody pour traçabilité',
                    '🔍 Vérification de la source recommandée'
                ]
            };
        } else if (score >= 50) {
            return {
                verdict: '⚠️ IMAGE DOUTEUSE',
                confidence: 'MOYEN',
                color: this.colors.warning,
                recommendations: [
                    '🔬 Analyse experte complémentaire FORTEMENT recommandée',
                    '🔍 Vérification approfondie de la chaîne de custody OBLIGATOIRE',
                    '⚠️ Utilisation avec PRUDENCE pour usage critique'
                ]
            };
        } else {
            return {
                verdict: '❌ IMAGE SUSPECTE',
                confidence: 'FAIBLE',
                color: this.colors.danger,
                recommendations: [
                    '🚨 Expertise forensique approfondie par spécialiste OBLIGATOIRE',
                    '⛔ Considérer l\'image comme HAUTEMENT SUSPECTE',
                    '👨‍💼 Consultation d\'expert forensique certifié REQUISE',
                    '⚖️ NE PAS utiliser comme preuve sans validation experte'
                ]
            };
        }
    }

    /**
     * Calcul niveau de risque
     */
    calculateRiskLevel(score) {
        if (score >= 80) return { label: 'FAIBLE', color: this.colors.success };
        if (score >= 60) return { label: 'MODÉRÉ', color: this.colors.warning };
        if (score >= 30) return { label: 'ÉLEVÉ', color: this.colors.danger };
        return { label: 'CRITIQUE', color: '#dc2626' };
    }

    /**
     * Couleur selon score
     */
    getScoreColor(score) {
        if (score >= 70) return this.colors.success;
        if (score >= 40) return this.colors.warning;
        return this.colors.danger;
    }

    /**
     * Icône selon sévérité
     */
    getSeverityIcon(severity) {
        const icons = {
            'critical': '🔴',
            'warning': '🟡',
            'info': '🔵'
        };
        return icons[severity] || '⚪';
    }

    /**
     * Couleur selon sévérité
     */
    getSeverityColor(severity) {
        const colors = {
            'critical': this.colors.danger,
            'warning': this.colors.warning,
            'info': this.colors.info
        };
        return colors[severity] || this.colors.text;
    }

    /**
     * Formatage type de flag
     */
    formatFlagType(type) {
        return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Interprétations des scores
     */
    interpretAuthenticityScore(score) {
        if (score >= 90) return 'Excellente - Très faible probabilité de manipulation';
        if (score >= 70) return 'Bonne - Indices de manipulation minimes';
        if (score >= 50) return 'Correcte - Quelques anomalies détectées';
        if (score >= 30) return 'Faible - Manipulation probable';
        return 'Très faible - Manipulation quasi-certaine';
    }

    interpretAIScore(score) {
        if (score <= 10) return 'Très faible probabilité de génération IA';
        if (score <= 30) return 'Probabilité faible de génération IA';
        if (score <= 70) return 'Probabilité modérée de génération IA';
        return 'Forte probabilité de génération IA';
    }

    interpretManipulationScore(score) {
        if (score <= 25) return 'Aucun signe de manipulation majeure';
        if (score <= 50) return 'Signes modérés de manipulation locale';
        if (score <= 75) return 'Manipulation significative détectée';
        return 'Manipulation extensive - Altération majeure';
    }

    /**
     * Utilitaires
     */
    safeTruncate(text, maxLength) {
        if (!text || typeof text !== 'string') return 'N/A';
        const cleaned = text.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Nettoyer caractères de contrôle
        return cleaned.length > maxLength ? cleaned.substring(0, maxLength - 3) + '...' : cleaned;
    }

    formatFileSize(bytes) {
        if (!bytes || isNaN(bytes)) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
    }

    generateSecureReportId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `BA7ATH-${timestamp}-${random}`;
    }

    ensureDirectoryExists(dirPath) {
        try {
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        } catch (error) {
            throw new Error(`Impossible de créer le répertoire: ${error.message}`);
        }
    }

    cleanupFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🗑️ Fichier nettoyé: ${filePath}`);
            }
        } catch (error) {
            console.error(`Erreur nettoyage ${filePath}:`, error.message);
        }
    }
}

// =====================================
// INTERFACE PUBLIQUE
// =====================================

const generator = new ForensicPDFGenerator();

/**
 * Interface publique pour génération PDF
 */
async function generateForensicPdfReport(data, outputPath, options = {}) {
    return generator.generateForensicPdfReport(data, outputPath, options);
}

/**
 * Alias pour compatibilité
 */
async function generatePdfReport(data, outputPath, options = {}) {
    return generateForensicPdfReport(data, outputPath, options);
}

module.exports = {
    generateForensicPdfReport,
    generatePdfReport,
    ForensicPDFGenerator
};
