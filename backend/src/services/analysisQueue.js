const Bull = require('bull');
const redis = require('redis');

// Configuration Redis (optionnel, utilise mémoire par défaut)
const analysisQueue = new Bull('forensic analysis', {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1',
  },
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  }
});

// ✅ Processeur d'analyse forensique asynchrone
analysisQueue.process('forensic-analysis', 5, async (job) => {
  const { imageId, filePath } = job.data;
  
  try {
    console.log(`🔍 Début analyse forensique asynchrone: ${imageId}`);
    
    // Mettre à jour le statut
    const Image = require('../models/Image');
    await Image.findByIdAndUpdate(imageId, { 
      status: 'analyzing',
      'forensicAnalysis.startedAt': new Date()
    });
    
    // ✅ Simuler analyse (remplacez par votre vraie logique)
    await performForensicAnalysis(filePath, imageId, (progress) => {
      job.progress(progress);
    });
    
    // Marquer comme terminé
    await Image.findByIdAndUpdate(imageId, { 
      status: 'analyzed',
      'forensicAnalysis.completedAt': new Date()
    });
    
    console.log(`✅ Analyse forensique terminée: ${imageId}`);
    return { success: true, imageId };
    
  } catch (error) {
    console.error(`❌ Erreur analyse forensique ${imageId}:`, error);
    
    // Marquer comme échoué
    await Image.findByIdAndUpdate(imageId, { 
      status: 'failed',
      'forensicAnalysis.error': error.message
    });
    
    throw error;
  }
});

// ✅ Fonction d'analyse forensique (remplacez par votre logique)
async function performForensicAnalysis(filePath, imageId, progressCallback) {
  // Simuler les 7 piliers d'analyse
  const pillars = [
    'anatomical', 'physics', 'statistical', 'exif', 
    'behavioral', 'audio', 'expert'
  ];
  
  for (let i = 0; i < pillars.length; i++) {
    const pillar = pillars[i];
    console.log(`🔍 Analyse ${pillar} pour ${imageId}`);
    
    // Simuler traitement (remplacez par votre vraie logique)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const progress = Math.round(((i + 1) / pillars.length) * 100);
    progressCallback(progress);
    
    console.log(`✅ ${pillar} terminé (${progress}%)`);
  }
}

// ✅ Fonction pour ajouter une tâche à la queue
const addAnalysisJob = (imageId, filePath) => {
  return analysisQueue.add('forensic-analysis', {
    imageId,
    filePath
  }, {
    priority: 1,
    delay: 0
  });
};

module.exports = {
  analysisQueue,
  addAnalysisJob
};
