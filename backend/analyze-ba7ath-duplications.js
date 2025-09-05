const fs = require('fs');
const path = require('path');

function analyzeBa7athBackend() {
    // ✅ CHEMIN CORRECT - backend/src comme spécifié par l'utilisateur
    const srcPath = './src';
    const analysis = {
        duplicatedServices: [],
        recurringPatterns: [],
        refactoringRecommendations: [],
        codeMetrics: {}
    };

    console.log('🔍 Analysing Ba7ath Backend/src for duplications...\n');

    // Vérification préalable de la structure
    if (!fs.existsSync(srcPath)) {
        console.error('❌ ERREUR: Dossier ./src introuvable.');
        console.log('📂 Structure actuelle détectée:');
        const items = fs.readdirSync('./').filter(item => {
            try {
                return fs.statSync(item).isDirectory();
            } catch { return false; }
        });
        console.log(items);
        return null;
    }

    // Récupération récursive de tous les fichiers JS dans src/
    const files = [];
    function getAllFiles(dirPath) {
        try {
            const items = fs.readdirSync(dirPath);
            items.forEach(item => {
                const fullPath = path.join(dirPath, item);
                const stats = fs.statSync(fullPath);
                if (stats.isDirectory()) {
                    getAllFiles(fullPath);
                } else if (item.endsWith('.js')) {
                    files.push(fullPath);
                }
            });
        } catch (error) {
            console.warn(`⚠️ Impossible de lire: ${dirPath}`);
        }
    }
    getAllFiles(srcPath);

    console.log(`📁 Fichiers JS trouvés dans src/: ${files.length}`);
    if (files.length === 0) {
        console.error('❌ Aucun fichier .js dans ./src');
        return null;
    }

    let jwtAuthCount = 0;
    let validationCount = 0;
    let forensicAnalysisCount = 0;
    let exifCount = 0;
    let uploadCount = 0;
    let authMiddlewareCount = 0;

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const fileName = file.replace('./src/', '');
        
        // Authentification JWT
        if (content.includes('jwt.verify') || content.includes('jwt.sign') || content.includes('jsonwebtoken')) {
            jwtAuthCount++;
            analysis.duplicatedServices.push({
                type: 'JWT_AUTHENTICATION',
                file: fileName,
                lines: content.split('\n').map((line, idx) => 
                    line.includes('jwt') ? idx + 1 : null).filter(x => x),
                suggestion: 'Centraliser dans src/services/authService.js'
            });
        }

        // Validation
        if (content.match(/validation|validate|check.*req\.body|req\.params/g)) {
            validationCount++;
            analysis.recurringPatterns.push({
                type: 'VALIDATION_LOGIC',
                file: fileName,
                occurrences: (content.match(/validat|check.*req\./g) || []).length,
                suggestion: 'Centraliser dans src/services/validators.js'
            });
        }

        // Analyse EXIF
        if (content.includes('exif') || content.includes('metadata') || content.includes('ExifImage')) {
            exifCount++;
            analysis.duplicatedServices.push({
                type: 'EXIF_ANALYSIS',
                file: fileName,
                suggestion: 'Centraliser dans src/services/exifService.js'
            });
        }

        // Upload fichiers
        if (content.includes('multer') || content.includes('upload') || content.includes('file.mimetype')) {
            uploadCount++;
            analysis.duplicatedServices.push({
                type: 'FILE_UPLOAD',
                file: fileName,
                suggestion: 'Unifier dans src/middleware/uploadMiddleware.js'
            });
        }

        // Middleware auth
        if (content.includes('req.user') || content.includes('authorization') || content.includes('Bearer')) {
            authMiddlewareCount++;
            analysis.duplicatedServices.push({
                type: 'AUTH_MIDDLEWARE',
                file: fileName,
                suggestion: 'Centraliser dans src/middleware/authMiddleware.js'
            });
        }

        // Analyse forensique
        if (content.includes('forensic') || content.includes('manipulation') || content.includes('statistical')) {
            forensicAnalysisCount++;
            analysis.recurringPatterns.push({
                type: 'FORENSIC_ANALYSIS',
                file: fileName,
                suggestion: 'Harmoniser dans src/services/forensicService.js'
            });
        }
    });

    // Recommandations avec chemins CORRECTS
    const recommendations = [];
    
    if (exifCount > 1) {
        recommendations.push({
            priority: 'CRITICAL',
            type: 'UNIFY_EXIF_ANALYSIS',
            description: `EXIF analysis scattered in ${exifCount} files`,
            action: 'Centraliser dans src/services/exifService.js',
            estimatedSavings: `${exifCount * 25} lignes de code`,
            files: analysis.duplicatedServices.filter(s => s.type === 'EXIF_ANALYSIS').map(s => s.file)
        });
    }

    if (forensicAnalysisCount > 1) {
        recommendations.push({
            priority: 'CRITICAL', 
            type: 'HARMONIZE_FORENSIC_ALGORITHMS',
            description: `Forensic analysis algorithms in ${forensicAnalysisCount} files`,
            action: 'Harmoniser dans src/services/forensicService.js',
            estimatedSavings: `${forensicAnalysisCount * 35} lignes de code`,
            files: analysis.recurringPatterns.filter(s => s.type === 'FORENSIC_ANALYSIS').map(s => s.file)
        });
    }

    if (uploadCount > 1) {
        recommendations.push({
            priority: 'HIGH',
            type: 'HARMONIZE_UPLOAD_LOGIC', 
            description: `File upload logic in ${uploadCount} files`,
            action: 'Unifier dans src/middleware/uploadMiddleware.js',
            estimatedSavings: `${uploadCount * 20} lignes de code`,
            files: analysis.duplicatedServices.filter(s => s.type === 'FILE_UPLOAD').map(s => s.file)
        });
    }

    if (jwtAuthCount > 1) {
        recommendations.push({
            priority: 'HIGH',
            type: 'CENTRALIZE_JWT_SERVICE',
            description: `JWT logic found in ${jwtAuthCount} files`, 
            action: 'Centraliser dans src/services/authService.js',
            estimatedSavings: `${jwtAuthCount * 15} lignes de code`,
            files: analysis.duplicatedServices.filter(s => s.type === 'JWT_AUTHENTICATION').map(s => s.file)
        });
    }

    analysis.refactoringRecommendations = recommendations;
    analysis.codeMetrics = {
        analyzedPath: srcPath,
        totalFiles: files.length,
        jwtDuplicationsCount: jwtAuthCount,
        exifDuplicationsCount: exifCount,
        uploadDuplicationsCount: uploadCount,
        authMiddlewareDuplicationsCount: authMiddlewareCount,
        forensicDuplicationsCount: forensicAnalysisCount,
        totalEstimatedSavings: recommendations.reduce((sum, rec) => 
            sum + parseInt(rec.estimatedSavings.match(/\d+/)[0] || 0), 0) + ' lignes de code'
    };

    return analysis;
}

// Exécution
console.log('🚀 Ba7ath Backend/src Duplication Analysis - VERSION CORRIGÉE\n');

try {
    const report = analyzeBa7athBackend();
    
    if (!report) {
        console.log('❌ Analyse impossible - vérifiez la structure src/');
        process.exit(1);
    }
    
    // Sauvegarde
    fs.writeFileSync('ba7ath-src-analysis-CORRECT.json', JSON.stringify(report, null, 2));
    
    console.log('📊 ANALYSE TERMINÉE - Ba7ath Backend/src\n');
    console.log(`📁 Dossier analysé: ${report.codeMetrics.analyzedPath}`);
    console.log(`📄 Rapport: ba7ath-src-analysis-CORRECT.json\n`);
    
    console.log('🔍 RÉSULTATS:');
    console.log(`├─ Fichiers analysés: ${report.codeMetrics.totalFiles}`);
    console.log(`├─ Services dupliqués: ${report.duplicatedServices.length}`);
    console.log(`├─ Patterns récurrents: ${report.recurringPatterns.length}`);
    console.log(`└─ Recommandations: ${report.refactoringRecommendations.length}\n`);
    
    report.refactoringRecommendations.forEach((rec, i) => {
        console.log(`${i + 1}. [${rec.priority}] ${rec.description}`);
        console.log(`   🎯 ${rec.action}`);
        console.log(`   💰 ${rec.estimatedSavings}`);
        console.log(`   📁 ${rec.files.join(', ')}\n`);
    });
    
    console.log(`💡 TOTAL ÉCONOMIES: ${report.codeMetrics.totalEstimatedSavings}`);
    console.log('✅ ANALYSE CORRECTE du dossier backend/src terminée !');
    
} catch (error) {
    console.error('❌ Erreur:', error.message);
}
