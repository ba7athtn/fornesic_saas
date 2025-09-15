const fs = require('fs');
const path = require('path');

console.log('🔍 Test des permissions d\'écriture...');

const uploadDir = path.join(__dirname, 'uploads', 'temp');
const testFile = path.join(uploadDir, `test-${Date.now()}.txt`);

console.log('📁 Dossier de test:', uploadDir);
console.log('📄 Fichier de test:', testFile);

fs.writeFile(testFile, 'Test d\'écriture réussi!', (err) => {
  if (err) {
    console.error('❌ Erreur écriture:', err.message);
    console.error('Code d\'erreur:', err.code);
    process.exit(1);
  } else {
    console.log('✅ Écriture réussie!');
    
    // Nettoyage
    fs.unlink(testFile, (unlinkErr) => {
      if (unlinkErr) {
        console.warn('⚠️ Erreur suppression:', unlinkErr.message);
      } else {
        console.log('🧹 Fichier de test supprimé');
      }
      process.exit(0);
    });
  }
});
