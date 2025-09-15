"use strict";

const Bull = require('bull');

// ✅ CONFIG
const config = require('../config');

// =====================================
// CONFIG REDIS + QUEUE
// =====================================

const redisCfg = config.redis || {};
const qCfg = config.forensic?.queue || {};

const QUEUE_NAME = qCfg.name || 'forensic:analysis';
const CONCURRENCY = qCfg.concurrency || 5;
const REMOVE_ON_COMPLETE = qCfg.removeOnComplete ?? 50;
const REMOVE_ON_FAIL = qCfg.removeOnFail ?? 20;
const ATTEMPTS = qCfg.attempts || 3;
const BACKOFF_TYPE = qCfg.backoff?.type || 'exponential';
const BACKOFF_DELAY = qCfg.backoff?.delay || 2000;
const STALL_INTERVAL = qCfg.stallInterval || 5000;

// Redis connection options
const redisOptions = {
  port: Number(redisCfg.port) || 6379,
  host: redisCfg.host || '127.0.0.1',
  password: redisCfg.password || undefined,
  db: Number(redisCfg.db) || 0,
  tls: redisCfg.tls || undefined
};

const analysisQueue = new Bull(QUEUE_NAME, {
  redis: redisOptions,
  defaultJobOptions: {
    removeOnComplete: REMOVE_ON_COMPLETE,
    removeOnFail: REMOVE_ON_FAIL,
    attempts: ATTEMPTS,
    backoff: { type: BACKOFF_TYPE, delay: BACKOFF_DELAY },
    timeout: qCfg.jobTimeoutMs || 10 * 60 * 1000 // 10 min
  },
  settings: {
    stalledInterval: STALL_INTERVAL
  }
});

// =====================================
// PROCESSEUR D'ANALYSE FORENSIQUE
// =====================================

analysisQueue.process('forensic-analysis', CONCURRENCY, async (job) => {
  const { imageId, filePath, userId, batchId, uploadedAt } = job.data;

  const Image = require('../models/Image');

  try {
    console.log(`🔍 Début analyse forensique: ${imageId} (job ${job.id})`);

    await Image.findByIdAndUpdate(imageId, {
      status: 'analyzing',
      'forensicAnalysis.startedAt': new Date(),
      'forensicAnalysis.jobId': job.id,
      'forensicAnalysis.batchId': batchId || null,
      'forensicAnalysis.uploadedAt': uploadedAt || null
    });

    // Appel logique d’analyse forensique centralisée
    // Remplacer performForensicAnalysis par votre pipeline réel (services/forensicService, etc.)
    await performForensicAnalysis(filePath, imageId, (progress) => job.progress(progress));

    await Image.findByIdAndUpdate(imageId, {
      status: 'analyzed',
      'forensicAnalysis.completedAt': new Date(),
      'forensicAnalysis.error': null
    });

    console.log(`✅ Analyse forensique terminée: ${imageId} (job ${job.id})`);
    return { success: true, imageId, jobId: job.id };
  } catch (error) {
    console.error(`❌ Erreur analyse forensique ${imageId} (job ${job.id}):`, error?.message || error);

    await Image.findByIdAndUpdate(imageId, {
      status: 'failed',
      'forensicAnalysis.error': error.message || String(error),
      'forensicAnalysis.completedAt': new Date()
    });

    throw error;
  }
});

// =====================================
// LOGIQUE D'ANALYSE (STUB À REMPLACER)
// =====================================

async function performForensicAnalysis(filePath, imageId, progressCallback) {
  // Simuler les 7 piliers d'analyse (remplacez par votre pipeline réel)
  const pillars = ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'];

  for (let i = 0; i < pillars.length; i++) {
    const pillar = pillars[i];
    console.log(`🔬 [${imageId}] Analyse ${pillar}...`);
    await new Promise(res => setTimeout(res, 1000 + Math.random() * 2000));
    const progress = Math.round(((i + 1) / pillars.length) * 100);
    if (typeof progressCallback === 'function') progressCallback(progress);
    console.log(`✅ [${imageId}] ${pillar} terminé (${progress}%)`);
  }
}

// =====================================
// API: AJOUTER UN JOB
// Signature alignée avec routes/images.js: addAnalysisJob(jobId, payload)
// payload attendu: { priority, fileData:{originalname,imageId,...}, userId, batchId, uploadedAt, ... }
// =====================================

const addAnalysisJob = (jobId, payload) => {
  const priority = payload?.priority === 'batch_upload' ? 2 : 1;
  const delay = payload?.delayMs || 0;

  // Mapper payload vers data du job
  const data = {
    imageId: payload?.fileData?.imageId || payload?.imageId,
    filePath: payload?.fileData?.path || payload?.filePath,
    userId: payload?.userId,
    batchId: payload?.batchId,
    uploadedAt: payload?.uploadedAt || new Date().toISOString(),
    meta: {
      originalname: payload?.fileData?.originalname,
      mimetype: payload?.fileData?.mimetype,
      size: payload?.fileData?.size
    }
  };

  if (!data.imageId || !data.filePath) {
    throw new Error('INVALID_JOB_DATA: imageId et filePath requis');
  }

  return analysisQueue.add('forensic-analysis', data, {
    jobId,
    priority,
    delay
  });
};

// =====================================
// ÉVÉNEMENTS ET OBSERVABILITÉ
// =====================================

analysisQueue.on('completed', (job, result) => {
  console.log(`🎯 Job ${job.id} complété`, result);
});

analysisQueue.on('failed', (job, err) => {
  console.error(`💥 Job ${job?.id} échoué:`, err?.message || err);
});

analysisQueue.on('stalled', (job) => {
  console.warn(`⏸️ Job ${job.id} stalled`);
});

analysisQueue.on('progress', (job, progress) => {
  if (Number.isFinite(progress)) {
    console.log(`📈 Job ${job.id} progress ${progress}%`);
  }
});

// =====================================
// EXPORTS
// =====================================

module.exports = {
  analysisQueue,
  addAnalysisJob
};
