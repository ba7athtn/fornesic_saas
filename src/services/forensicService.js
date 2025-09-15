// src/services/forensicService.js
"use strict";

const fs = require('fs');
const path = require('path');

const config = require('../config');

class ForensicService {
  constructor(deps = {}, cfg = {}) {
    // Dépendances injectables
    this.aiService = deps.aiService || null;
    this.manipulationService = deps.manipulationService || null;
    this.heavyService = deps.heavyService || null;
    this.geoService = deps.geoService || null;
    this.pythonService = deps.pythonService || null;
    this.statsService = deps.statsService || null;
    this.exifService = deps.exifService || null;            // optionnel
    this.quickAnalyzer = deps.quickAnalyzer || null;        // optionnel (forensicAnalyzer)

    // Config fusionnée
    const svcCfg = config.forensic?.service || {};
    this.config = {
      analysis: {
        parallel: true,
        ...svcCfg.analysis,
        ...cfg.analysis
      },
      include: svcCfg.include || {}
    };
    this.version = '1.3.0';
  }

  async analyzeImage(imageInput, options = {}) {
    const started = Date.now();
    const parallel = options.parallel ?? this.config.analysis.parallel;
    const include = { ...this.config.include, ...(options.include || {}) };
    const buffer = await this.resolveInput(imageInput);

    // Masque include: true par défaut, on skip si include[key] === false
    const mk = (key, fn) => (include[key] === false ? null : fn);

    const tasks = {
      aiDetection: mk('aiDetection', () => this.safeCall(() => this.processAiDetection(buffer, options))),
      manipulation: mk('manipulation', () => this.safeCall(() => this.detectManipulation(buffer, options))),
      physics: mk('physics', () => this.safeCall(() => this.analyzePhysics(buffer, options))),
      geolocation: mk('geolocation', () => this.safeCall(() => this.processGeoLocation(buffer, options))),
      pythonAnalysis: mk('pythonAnalysis', () => this.safeCall(() => this.executePythonAnalysis(buffer, options))),
      statistical: mk('statistical', () => this.safeCall(() => this.analyzeStatistical(buffer, options))),
      // Hooks optionnels
      exif: mk('exif', () => this.safeCall(() => this.extractExif(buffer, options))),
      quickForensic: mk('quickForensic', () => this.safeCall(() => this.runQuickForensic(buffer, options)))
    };

    const active = Object.entries(tasks).filter(([, fn]) => typeof fn === 'function');

    let results = {};
    if (parallel) {
      const values = await Promise.all(active.map(([, fn]) => fn()));
      results = Object.fromEntries(active.map(([k], i) => [k, values[i]]));
    } else {
      for (const [k, fn] of active) results[k] = await fn();
    }

    return {
      ...results,
      analysisMetadata: {
        processingTime: Date.now() - started,
        analysisDate: new Date().toISOString(),
        serviceVersion: this.version
      }
    };
  }

  // ======================
  // IA — lazy load
  // ======================
  async processAiDetection(imageBuffer, options = {}) {
    if (this.aiService?.detectAIGenerated) {
      return this.aiService.detectAIGenerated(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./aiDetectionService', ['detectAIGenerated', 'analyze', 'run']);
    return fn ? fn(imageBuffer, options) : { ok: false, error: 'AI service unavailable' };
  }

  async detectManipulation(imageBuffer, options = {}) {
    if (this.manipulationService?.detectManipulation) {
      return this.manipulationService.detectManipulation(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./manipulationDetector', ['detectManipulation', 'analyzeManipulation', 'analyze', 'run']);
    return fn ? fn(imageBuffer, options) : { ok: false, error: 'Manipulation service unavailable' };
  }

  async analyzePhysics(imageBuffer, options = {}) {
    if (this.heavyService?.performHeavyAnalysis) {
      return this.heavyService.performHeavyAnalysis(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./heavyAnalyzer', ['performHeavyAnalysis', 'analyze', 'run']);
    return fn ? fn(imageBuffer, options) : { ok: false, error: 'Heavy analyzer unavailable' };
  }

  async processGeoLocation(imageBuffer, options = {}) {
    if (this.geoService?.processGeoLocation) {
      return this.geoService.processGeoLocation(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./geoLocationService', ['processGeoLocation', 'analyze', 'geolocate']);
    return fn ? fn(imageBuffer, options) : { ok: false, error: 'Geo service unavailable' };
  }

  async executePythonAnalysis(imageBuffer, options = {}) {
    if (this.pythonService?.executePythonAnalysis) {
      return this.pythonService.executePythonAnalysis(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./pythonBridge', ['executePythonAnalysis', 'analyze', 'run']);
    return fn ? fn(imageBuffer, options) : { ok: false, error: 'Python bridge unavailable' };
  }

  async analyzeStatistical(imageBuffer, options = {}) {
    if (this.statsService?.analyzeStatistical) {
      return this.statsService.analyzeStatistical(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('../utils/forensicAnalyzer', ['analyzeStatistical', 'analyze', 'run'],
      async () => await this.lazyLoadFunction('../utils/imageProcessor', ['analyzeStatistical']));
    if (typeof fn === 'function') return fn(imageBuffer, options);
    if (fn && typeof fn.then === 'function') {
      const inner = await fn;
      return inner ? inner(imageBuffer, options) : { ok: false, error: 'Statistical analyzer unavailable' };
    }
    return { ok: false, error: 'Statistical analyzer not found' };
  }

  // ======================
  // Hooks optionnels
  // ======================
  async extractExif(imageBuffer, options = {}) {
    try {
      // Si un exifService injecté expose extractForensicExifDataFromBuffer, utiliser-le, sinon fallback au fichier temporaire
      if (this.exifService?.extractForensicExifDataFromBuffer) {
        return this.exifService.extractForensicExifDataFromBuffer(imageBuffer, options);
      }
      if (this.exifService?.extractForensicExifData) {
        // Écrire dans un fichier temporaire
        const tmpPath = await this.writeTemp(imageBuffer, 'exif');
        try {
          return await this.exifService.extractForensicExifData(tmpPath, options);
        } finally {
          await this.safeUnlink(tmpPath);
        }
      }
      // Lazy-load exifService si disponible
      const exifMod = await this.lazyLoadModule('./exifService');
      if (exifMod?.extractForensicExifData) {
        const tmpPath = await this.writeTemp(imageBuffer, 'exif');
        try {
          return await exifMod.extractForensicExifData(tmpPath, options);
        } finally {
          await this.safeUnlink(tmpPath);
        }
      }
      return { ok: false, error: 'EXIF service unavailable' };
    } catch (e) {
      return { ok: false, error: e?.message || 'EXIF hook error' };
    }
  }

  async runQuickForensic(imageBuffer, options = {}) {
    try {
      if (this.quickAnalyzer?.performQuickForensicAnalysis) {
        const tmp = await this.writeTemp(imageBuffer, 'fa');
        try {
          return await this.quickAnalyzer.performQuickForensicAnalysis(tmp, options?.metadata || {});
        } finally {
          await this.safeUnlink(tmp);
        }
      }
      // Lazy load src/utils/forensicAnalyzer.js (ou services/forensicAnalyzer.js selon arbo)
      let mod = await this.lazyLoadModule('../utils/forensicAnalyzer');
      if (!mod?.performQuickForensicAnalysis) {
        mod = await this.lazyLoadModule('./forensicAnalyzer');
      }
      if (mod?.performQuickForensicAnalysis) {
        const tmp = await this.writeTemp(imageBuffer, 'fa');
        try {
          return await mod.performQuickForensicAnalysis(tmp, options?.metadata || {});
        } finally {
          await this.safeUnlink(tmp);
        }
      }
      return { ok: false, error: 'Quick forensic analyzer unavailable' };
    } catch (e) {
      return { ok: false, error: e?.message || 'Quick forensic hook error' };
    }
  }

  // ======================
  // Utils
  // ======================
  async resolveInput(input) {
    if (!input) throw new Error('ForensicService: image input manquant');
    if (Buffer.isBuffer(input)) {
      if (input.length === 0) throw new Error('ForensicService: buffer vide');
      return input;
    }
    if (typeof input === 'string') return fs.promises.readFile(path.resolve(input));
    if (input.buffer && Buffer.isBuffer(input.buffer)) {
      if (input.buffer.length === 0) throw new Error('ForensicService: buffer vide');
      return input.buffer;
    }
    if (input.path && typeof input.path === 'string') return fs.promises.readFile(path.resolve(input.path));
    throw new Error('ForensicService: format input non supporté');
  }

  async writeTemp(buffer, prefix = 'img') {
    const os = require('os');
    const p = path.join(os.tmpdir(), `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}.bin`);
    await fs.promises.writeFile(p, buffer);
    return p;
  }

  async safeUnlink(p) {
    try { await fs.promises.unlink(p); } catch {}
  }

  async safeCall(fn) {
    try { return await fn(); } catch (e) { return { ok: false, error: e?.message || String(e) }; }
  }

  async lazyLoadFunction(modulePath, candidateNames = [], fallbackLoader = null) {
    try {
      const mod = require(modulePath);
      for (const name of candidateNames) {
        if (typeof mod[name] === 'function') return mod[name];
      }
      if (typeof mod === 'function') return mod;
      if (fallbackLoader) return await fallbackLoader();
      return null;
    } catch {
      if (fallbackLoader) return await fallbackLoader();
      return null;
    }
  }

  async lazyLoadModule(modulePath) {
    try {
      return require(modulePath);
    } catch {
      return null;
    }
  }
}

module.exports = { ForensicService };
