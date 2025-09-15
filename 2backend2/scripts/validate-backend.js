const fs = require('fs');
const path = require('path');

// =====================================
// SCRIPT VALIDATION BACKEND BA7ATH
// =====================================

console.log('\n🔍 Ba7ath Backend Validation Tool v1.0.0\n');

// Couleurs console sans dépendance externe
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

const colorize = (text, color) => `${colors[color] || ''}${text}${colors.reset}`;

// Fichiers critiques requis
const requiredFiles = [
  // Core
  { path: 'server.js', critical: true, type: 'server' },
  { path: '.env', critical: false, type: 'config' },
  { path: 'package.json', critical: true, type: 'config' },
  
  // Models
  { path: 'src/models/Image.js', critical: true, type: 'model' },
  { path: 'src/models/Analysis.js', critical: false, type: 'model' },
  
  // Controllers
  { path: 'src/controllers/imageController.js', critical: true, type: 'controller' },
  
  // Routes
  { path: 'src/routes/images.js', critical: true, type: 'route' },
  
  // Middleware
  { path: 'src/middleware/auth.js', critical: true, type: 'middleware' },
  { path: 'src/middleware/upload.js', critical: true, type: 'middleware' },
  { path: 'src/middleware/validation.js', critical: true, type: 'middleware' },
  
  // Services
  { path: 'src/services/forensicAnalyzer.js', critical: true, type: 'service' },
  { path: 'src/services/imageProcessor.js', critical: true, type: 'service' },
  { path: 'src/services/analysisQueue.js', critical: true, type: 'service' },
  { path: 'src/services/heavyAnalyzer.js', critical: false, type: 'service' },
  { path: 'src/services/aiDetectionService.js', critical: false, type: 'service' },
  { path: 'src/services/exifService.js', critical: false, type: 'service' },
  { path: 'src/services/geoLocationService.js', critical: false, type: 'service' },
  { path: 'src/services/manipulationDetector.js', critical: false, type: 'service' },
  
  // Utils
  { path: 'src/utils/exifNormalizer.js', critical: true, type: 'util' },
  { path: 'src/utils/pdfGenerator.js', critical: false, type: 'util' },
  
  // Directories
  { path: 'uploads', critical: true, type: 'directory' },
  { path: 'uploads/temp', critical: true, type: 'directory' },
  { path: 'uploads/processed', critical: true, type: 'directory' },
  { path: 'uploads/thumbnails', critical: true, type: 'directory' }
];

// Dépendances NPM critiques
const requiredDependencies = [
  'express', 'mongoose', 'multer', 'sharp', 'exifr', 'cors', 
  'helmet', 'morgan', 'bull', 'redis', 'pdfkit', 'dotenv'
];

let totalFiles = 0;
let presentFiles = 0;
let criticalMissing = 0;
let warnings = [];
let errors = [];

console.log(colorize('📂 Vérification des fichiers...', 'yellow'));
console.log('');

// Vérification fichiers
requiredFiles.forEach(file => {
  totalFiles++;
  
  try {
    const exists = fs.existsSync(file.path);
    
    if (exists) {
      presentFiles++;
      const stats = fs.statSync(file.path);
      const isDir = stats.isDirectory();
      const size = isDir ? 'DIR' : `${Math.round(stats.size / 1024)}KB`;
      
      console.log(`${colorize('✅', 'green')} ${file.path.padEnd(40)} ${size.padStart(8)} [${file.type}]`);
    } else {
      if (file.critical) {
        criticalMissing++;
        errors.push(`CRITIQUE: ${file.path} manquant`);
        console.log(`${colorize('❌', 'red')} ${file.path.padEnd(40)} ${colorize('MANQUANT', 'red')} [${file.type}] ${colorize('CRITIQUE', 'red')}`);
      } else {
        warnings.push(`Optionnel: ${file.path} manquant`);
        console.log(`${colorize('⚠️', 'yellow')}  ${file.path.padEnd(40)} ${colorize('MANQUANT', 'yellow')} [${file.type}] optionnel`);
      }
    }
  } catch (error) {
    console.log(`${colorize('❌', 'red')} ${file.path.padEnd(40)} ${colorize('ERREUR', 'red')} [${error.message}]`);
    if (file.critical) {
      criticalMissing++;
      errors.push(`Erreur accès: ${file.path}`);
    }
  }
});

// Vérification package.json dependencies
console.log('\n' + colorize('📦 Vérification des dépendances...', 'yellow'));
console.log('');

let packageJson = {};
let missingDeps = 0;

try {
  const packagePath = 'package.json';
  if (fs.existsSync(packagePath)) {
    packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`${colorize('✅', 'green')} Package.json trouvé`);
  } else {
    console.log(`${colorize('❌', 'red')} Package.json non trouvé`);
    errors.push('package.json manquant');
    criticalMissing++;
  }
} catch (error) {
  console.log(`${colorize('❌', 'red')} Erreur lecture package.json: ${error.message}`);
  errors.push('Erreur lecture package.json');
  criticalMissing++;
}

const installedDeps = Object.keys(packageJson.dependencies || {});

requiredDependencies.forEach(dep => {
  if (installedDeps.includes(dep)) {
    const version = packageJson.dependencies[dep];
    console.log(`${colorize('✅', 'green')} ${dep.padEnd(25)} ${version}`);
  } else {
    missingDeps++;
    console.log(`${colorize('❌', 'red')} ${dep.padEnd(25)} ${colorize('MANQUANT', 'red')}`);
    errors.push(`Dépendance manquante: ${dep}`);
  }
});

// Tests de connectivité basiques
console.log('\n' + colorize('🔌 Tests de disponibilité des modules...', 'yellow'));
console.log('');

const testModules = [
  'mongoose', 'redis', 'sharp', 'exifr', 'bull', 'pdfkit'
];

testModules.forEach(module => {
  try {
    require.resolve(module);
    console.log(`${colorize('✅', 'green')} ${module} disponible`);
  } catch (e) {
    console.log(`${colorize('⚠️', 'yellow')} ${module} non installé`);
    warnings.push(`Module ${module} non disponible`);
  }
});

// Test structure des dossiers critiques
console.log('\n' + colorize('📁 Vérification structure projet...', 'yellow'));
console.log('');

const requiredDirs = [
  'src', 'src/controllers', 'src/routes', 'src/middleware', 
  'src/models', 'src/services', 'src/utils', 'uploads'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    console.log(`${colorize('✅', 'green')} Dossier ${dir}/ existe`);
  } else {
    console.log(`${colorize('⚠️', 'yellow')} Dossier ${dir}/ manquant`);
    warnings.push(`Dossier ${dir} manquant`);
  }
});

// Résumé final
console.log('\n' + colorize('📊 RÉSUMÉ DE VALIDATION', 'blue'));
console.log(''.padEnd(50, '='));

console.log(`Fichiers présents: ${colorize(presentFiles, 'green')}/${totalFiles}`);
console.log(`Fichiers critiques manquants: ${colorize(criticalMissing, criticalMissing > 0 ? 'red' : 'green')}`);
console.log(`Avertissements: ${colorize(warnings.length, warnings.length > 0 ? 'yellow' : 'green')}`);
console.log(`Dépendances manquantes: ${colorize(missingDeps, missingDeps > 0 ? 'red' : 'green')}`);

// Affichage des détails des erreurs
if (errors.length > 0) {
  console.log('\n' + colorize('❌ ERREURS DÉTECTÉES:', 'red'));
  errors.forEach(error => {
    console.log(`  • ${error}`);
  });
}

if (warnings.length > 0 && criticalMissing === 0) {
  console.log('\n' + colorize('⚠️ AVERTISSEMENTS:', 'yellow'));
  warnings.slice(0, 5).forEach(warning => {
    console.log(`  • ${warning}`);
  });
  if (warnings.length > 5) {
    console.log(`  • ... et ${warnings.length - 5} autres avertissements`);
  }
}

// Instructions de réparation
if (criticalMissing > 0 || missingDeps > 0) {
  console.log('\n' + colorize('🔧 ACTIONS RECOMMANDÉES:', 'cyan'));
  
  if (missingDeps > 0) {
    console.log('  1. Installer les dépendances manquantes:');
    console.log('     npm install');
  }
  
  if (criticalMissing > 0) {
    console.log('  2. Créer les fichiers/dossiers manquants critiques');
    console.log('  3. Vérifier la structure du projet');
  }
}

// Status final
console.log('\n' + ''.padEnd(50, '='));

if (criticalMissing === 0 && missingDeps === 0) {
  console.log(colorize('🎉 BACKEND VALIDE - Prêt pour production !', 'green'));
  console.log(colorize('✨ Tous les composants critiques sont présents', 'green'));
  process.exit(0);
} else if (criticalMissing > 0) {
  console.log(colorize('❌ BACKEND INVALIDE - Fichiers critiques manquants', 'red'));
  console.log(colorize('🚨 Corrigez les erreurs critiques avant de continuer', 'red'));
  process.exit(1);
} else if (missingDeps > 0) {
  console.log(colorize('❌ BACKEND INVALIDE - Dépendances manquantes', 'red'));
  console.log(colorize('📦 Exécutez: npm install', 'yellow'));
  process.exit(1);
} else {
  console.log(colorize('⚠️ BACKEND PARTIELLEMENT VALIDE', 'yellow'));
  console.log(colorize('✅ Fonctionnel mais quelques composants optionnels manquent', 'yellow'));
  process.exit(0);
}
