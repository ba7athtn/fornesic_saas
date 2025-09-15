// cleanup-sessions.js
const mongoose = require('mongoose');

async function cleanupNullTokenSessions() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ba7ath-forensic');
    console.log('🔌 Connecté à MongoDB');
    
    const result = await mongoose.connection.db.collection('sessions').deleteMany({ 
      $or: [
        { token: null },
        { token: { $exists: false } }
      ]
    });
    
    console.log(`🗑️ Supprimé ${result.deletedCount} sessions avec token null/undefined`);
    
    // Optionnel: supprimer TOUTES les sessions pour repartir proprement
    // const allSessions = await mongoose.connection.db.collection('sessions').deleteMany({});
    // console.log(`🧹 Supprimé ${allSessions.deletedCount} sessions au total`);
    
    await mongoose.disconnect();
    console.log('✅ Nettoyage terminé');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
    process.exit(1);
  }
}

cleanupNullTokenSessions();
