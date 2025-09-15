console.log('🔍 Test des imports routes/images...\n');

const imports = [
  { name: 'rateLimitService', path: './src/services/rateLimitService' },
  { name: 'middlewareService', path: './src/services/middlewareService' },
  { name: 'cacheService', path: './src/services/cacheService' },
  { name: 'forensicValidationService', path: './src/services/forensicValidationService' },
  { name: 'imageProcessor', path: './src/services/imageProcessor' },
  { name: 'forensicService', path: './src/services/forensicService' },
  { name: 'imageController', path: './src/controllers/imageController' },
  { name: 'auth middleware', path: './src/middleware/auth' },
  { name: 'validation middleware', path: './src/middleware/validation' },
  { name: 'upload middleware', path: './src/middleware/upload' }
];

let failedImports = [];

for (const imp of imports) {
  try {
    const module = require(imp.path);
    console.log(`✅ ${imp.name} - OK`);
    
    if (imp.name === 'imageController') {
      const exports = Object.keys(module);
      console.log(`   Exports: ${exports.join(', ')}`);
      
      // Vérifier les fonctions spécifiques
      const required = ['uploadForensicImage', 'uploadMultipleForensicImages', 'getForensicImageDetails'];
      const missing = required.filter(fn => !module[fn]);
      if (missing.length > 0) {
        console.log(`   ❌ Exports manquants: ${missing.join(', ')}`);
        failedImports.push(`${imp.name}: exports manquants`);
      }
    }
    
    if (imp.name === 'auth middleware') {
      const exports = Object.keys(module);
      console.log(`   Exports: ${exports.join(', ')}`);
      
      const required = ['auth', 'optionalAuth', 'requireRole'];
      const missing = required.filter(fn => !module[fn]);
      if (missing.length > 0) {
        console.log(`   ❌ Exports manquants: ${missing.join(', ')}`);
        failedImports.push(`${imp.name}: exports manquants`);
      }
    }
    
  } catch (error) {
    console.error(`❌ ${imp.name} - ÉCHEC:`, error.message);
    failedImports.push(imp.name);
  }
}

console.log('\n📊 Résumé:');
if (failedImports.length === 0) {
  console.log('✅ Tous les imports fonctionnent !');
} else {
  console.log(`❌ Imports défaillants: ${failedImports.join(', ')}`);
  console.log('\n🔧 Action requise: Corrigez ces modules avant de relancer les routes images.');
}
