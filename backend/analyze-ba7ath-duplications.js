// analyze-ba7ath-duplications.js
const fs = require('fs');
const path = require('path');

function analyzeBa7athBackend() {
  // ✅ Chemins robustes (Windows/Linux)
  const ROOT_DIR = __dirname;
  const srcPath = path.join(ROOT_DIR, 'src');

  // Ignorer des chemins RELATIFS À src/ (pas de préfixe src/)
  const IGNORE_PATHS = [
    // Services centralisés
    'services/forensicService.js',
    'services/exifService.js',
    // Dossiers de tests/mocks/fixtures
    'tests/',
    '__tests__/',
    '__mocks__/',
    'fixtures/',
  ];

  const isIgnoredRel = (relPath) =>
    IGNORE_PATHS.some(p => relPath === p || relPath.startsWith(p));

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
    const items = fs.readdirSync(ROOT_DIR).filter(item => {
      try { return fs.statSync(path.join(ROOT_DIR, item)).isDirectory(); } catch { return false; }
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

  // Compteurs
  let jwtAuthCount = 0;
  let validationCount = 0;
  let forensicAnalysisCount = 0;
  let exifCount = 0;
  let uploadCount = 0;
  let authMiddlewareCount = 0;

  // Regex affinées
  const reJWT = /\bjsonwebtoken\b|\bjwt\.sign\b|\bjwt\.verify\b/;
  const reValidation = /\b(validate|validation)\b|check\s*.*req\.(body|params|query)/i;
  const reEXIF = /\b(exif|ExifImage|exifr|exiftool)\b|metadata\s*\./i;
  const reUpload = /\bmulter\b|file\.mimetype\b|\breq\.file\b|\bupload\.(single|array|fields)\b/i;
  const reAuthMW = /\bauthorization\b|\bBearer\b|\breq\.user\b/i;
  const reForensicAlgo = /\b(detectManipulation|analyzeStatistical|processGeoLocation|executePythonAnalysis|performHeavyAnalysis|forensicService|aiDetectionService)\b/i;

  files.forEach(file => {
    // Chemin relatif à src/ et normalisé (Windows/Linux)
    const rel = path.relative(srcPath, file).replace(/\\/g, '/');
    if (!rel || rel.startsWith('..')) return; // sécurité
    if (isIgnoredRel(rel)) return;

    let content = '';
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      return;
    }

    // Authentification JWT
    if (reJWT.test(content)) {
      jwtAuthCount++;
      analysis.duplicatedServices.push({
        type: 'JWT_AUTHENTICATION',
        file: rel,
        lines: content.split('\n').map((line, idx) => reJWT.test(line) ? idx + 1 : null).filter(Boolean),
        suggestion: 'Centraliser dans src/services/authService.js'
      });
    }

    // Validation
    const valMatch = content.match(reValidation);
    if (valMatch) {
      const occurrences = (content.match(/validat|check\s*.*req\./gi) || []).length;
      validationCount++;
      analysis.recurringPatterns.push({
        type: 'VALIDATION_LOGIC',
        file: rel,
        occurrences,
        suggestion: 'Centraliser dans src/services/validators.js'
      });
    }

    // Analyse EXIF
    if (reEXIF.test(content)) {
      exifCount++;
      analysis.duplicatedServices.push({
        type: 'EXIF_ANALYSIS',
        file: rel,
        suggestion: 'Centraliser dans src/services/exifService.js'
      });
    }

    // Upload fichiers
    if (reUpload.test(content)) {
      uploadCount++;
      analysis.duplicatedServices.push({
        type: 'FILE_UPLOAD',
        file: rel,
        suggestion: 'Unifier dans src/middleware/uploadMiddleware.js'
      });
    }

    // Middleware auth
    if (reAuthMW.test(content)) {
      authMiddlewareCount++;
      analysis.duplicatedServices.push({
        type: 'AUTH_MIDDLEWARE',
        file: rel,
        suggestion: 'Centraliser dans src/middleware/authMiddleware.js'
      });
    }

    // Analyse forensique: heuristique resserrée
    if (reForensicAlgo.test(content)) {
      forensicAnalysisCount++;
      analysis.recurringPatterns.push({
        type: 'FORENSIC_ANALYSIS',
        file: rel,
        suggestion: 'Harmoniser dans src/services/forensicService.js'
      });
    }
  });

  // Recommandations
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

  // Helper robuste pour extraire une valeur numérique depuis estimatedSavings
  function getSaving(rec) {
    const m = (rec && rec.estimatedSavings ? String(rec.estimatedSavings) : '').match(/\d+/);
    return m ? parseInt(m, 10) : 0;
  }

  analysis.refactoringRecommendations = recommendations;
  analysis.codeMetrics = {
    analyzedPath: './src',
    totalFiles: files.length,
    jwtDuplicationsCount: jwtAuthCount,
    exifDuplicationsCount: exifCount,
    uploadDuplicationsCount: uploadCount,
    authMiddlewareDuplicationsCount: authMiddlewareCount,
    forensicDuplicationsCount: forensicAnalysisCount,
    totalEstimatedSavings: recommendations.reduce((sum, rec) => sum + getSaving(rec), 0) + ' lignes de code'
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
