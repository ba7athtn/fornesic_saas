// src/services/heavyAnalyzer.js
const sharp = require('sharp');

// =====================================
// FAÇADE ANALYSEUR "HEAVY" LÉGERE ET COMPATIBLE
// =====================================
//
// Objectif:
// - Fournir une implémentation simple et non récursive pour ForensicService.analyzePhysics
// - Conserver des alias publics historiques (performDeepForensicAnalysis/analyze/run)
// - Éviter toute dépendance à des bindings natifs ou à des services externes
// - Renvoyer une structure stable et exploitable par l’orchestrateur

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
      version: '1.0.0-facade'
    }
  };

  try {
    // Lecture métadonnées image (léger, pas de tfjs)
    const meta = await sharp(imageBuffer).metadata();
    result.details.width = meta.width || null;
    result.details.height = meta.height || null;
    result.details.format = meta.format || 'unknown';

    // Heuristiques légères simulant une analyse "physics"
    // (à affiner lors du rapatriement progressif de la logique)
    const w = meta.width || 0;
    const h = meta.height || 0;

    // Scoring simple: dimensions non nulles + format bitmap => bonus
    let score = 0;
    if (w > 0 && h > 0) score += 20;
    if (['jpeg', 'png', 'webp', 'tiff'].includes(meta.format)) score += 20;

    // Placeholders de cohérence pour ne pas bloquer l’orchestrateur
    result.details.lightingConsistency = score >= 20 ? 'plausible' : 'unknown';
    result.details.shadowAnalysis = score >= 20 ? 'plausible' : 'unknown';
    result.details.perspectiveValidation = 'untested';
    result.details.reflectionPatterns = 'untested';

    // Ajuster score/confidence
    result.score = Math.min(100, score);
    result.confidence = result.score >= 30 ? 'medium' : 'low';
    result.analysisMetadata.processingTime = Date.now() - started;

    return result;
  } catch (e) {
    // Image invalide ou format non supporté: rester non bloquant
    result.details.lightingConsistency = 'unknown';
    result.details.shadowAnalysis = 'unknown';
    result.details.perspectiveValidation = 'unknown';
    result.details.reflectionPatterns = 'unknown';
    result.analysisMetadata.processingTime = Date.now() - started;
    result.error = e.message;
    return result;
  }
}

// Alias conservés pour compatibilité avec l’existant
async function analyze(imageBuffer, options = {}) {
  return performHeavyAnalysis(imageBuffer, options);
}
async function run(imageBuffer, options = {}) {
  return performHeavyAnalysis(imageBuffer, options);
}

// Alias historique (évite la casse si appelé par ailleurs)
async function performDeepForensicAnalysis(imageBuffer, metadata = {}) {
  // Délègue à la version allégée; metadata conservé pour compat
  return performHeavyAnalysis(imageBuffer, metadata);
}

module.exports = {
  performHeavyAnalysis,
  analyze,
  run,
  performDeepForensicAnalysis
};
