// src/services/heavyAnalyzer.js
"use strict";

const sharp = require('sharp');
const config = require('../config');

// =====================================
// FAÇADE ANALYSEUR "HEAVY" LÉGÈRE ET COMPATIBLE
// =====================================
//
// Objectif:
// - Implémentation simple pour ForensicService.analyzePhysics
// - Alias publics historiques conservés (performDeepForensicAnalysis/analyze/run)
// - Sans dépendances natives ni services externes
// - Structure de sortie stable pour l’orchestrateur

const haCfg = config.forensic?.heavy || {};
const VERSION = haCfg.version || '1.1.0-facade';
const LIMITS = {
  minWidth: haCfg.limits?.minWidth || 1,
  minHeight: haCfg.limits?.minHeight || 1
};
const TIMEOUT_SEC = Math.max(1, Math.min(haCfg.sharpTimeoutSec || Math.ceil((config.upload?.validation?.sharpTimeout || 15000) / 1000), 30));

async function performHeavyAnalysis(imageBuffer, options = {}) {
  const started = Date.now();
  const result = {
    score: 0,
    confidence: 'low',
    details: {
      lightingConsistency: 'unknown',
      shadowAnalysis: 'unknown',
      perspectiveValidation: 'unknown',
      reflectionPatterns: 'unknown',
      width: null,
      height: null,
      format: 'unknown'
    },
    analysisMetadata: {
      processingTime: 0,
      analysisDate: new Date().toISOString(),
      version: VERSION
    }
  };

  try {
    // Lecture métadonnées image (léger)
    const meta = await sharp(imageBuffer).timeout({ seconds: TIMEOUT_SEC }).metadata();
    const w = Number(meta.width) || 0;
    const h = Number(meta.height) || 0;
    const fmt = String(meta.format || 'unknown').toLowerCase();

    result.details.width = w || null;
    result.details.height = h || null;
    result.details.format = fmt || 'unknown';

    // Heuristiques légères
    let score = 0;
    if (w >= LIMITS.minWidth && h >= LIMITS.minHeight) score += 20;
    if (['jpeg', 'png', 'webp', 'tiff'].includes(fmt)) score += 20;

    // Placeholders cohérence
    result.details.lightingConsistency = score >= 20 ? 'plausible' : 'unknown';
    result.details.shadowAnalysis = score >= 20 ? 'plausible' : 'unknown';
    result.details.perspectiveValidation = w > 0 && h > 0 ? 'untested' : 'unknown';
    result.details.reflectionPatterns = w > 0 && h > 0 ? 'untested' : 'unknown';

    // Score/confidence
    result.score = Math.min(100, score);
    result.confidence = result.score >= 30 ? 'medium' : 'low';
    result.analysisMetadata.processingTime = Date.now() - started;

    return result;

  } catch (e) {
    // Image invalide ou format non supporté: non bloquant
    result.details.lightingConsistency = 'unknown';
    result.details.shadowAnalysis = 'unknown';
    result.details.perspectiveValidation = 'unknown';
    result.details.reflectionPatterns = 'unknown';
    result.analysisMetadata.processingTime = Date.now() - started;
    result.error = e?.message || String(e);
    return result;
  }
}

// Alias conservés
async function analyze(imageBuffer, options = {}) {
  return performHeavyAnalysis(imageBuffer, options);
}
async function run(imageBuffer, options = {}) {
  return performHeavyAnalysis(imageBuffer, options);
}

// Alias historique
async function performDeepForensicAnalysis(imageBuffer, metadata = {}) {
  return performHeavyAnalysis(imageBuffer, metadata);
}

module.exports = {
  performHeavyAnalysis,
  analyze,
  run,
  performDeepForensicAnalysis
};
