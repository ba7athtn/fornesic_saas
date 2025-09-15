// src/services/forensicService.js
const fs = require('fs');
const path = require('path');

class ForensicService {
  constructor(deps = {}, config = {}) {
    // Dépendances injectables (pas de require top-level pour éviter tfjs-node en test)
    this.aiService = deps.aiService || null;
    this.manipulationService = deps.manipulationService || null;
    this.heavyService = deps.heavyService || null;
    this.geoService = deps.geoService || null;
    this.pythonService = deps.pythonService || null;
    this.statsService = deps.statsService || null;

    this.config = { analysis: { parallel: true, ...config.analysis } };
    this.version = '1.2.0';
  }

  async analyzeImage(imageInput, options = {}) {
    const started = Date.now();
    const { parallel = this.config.analysis.parallel, include = {} } = options;
    const buffer = await this.resolveInput(imageInput);

    // Masque include: true par défaut, on skip si include[key] === false
    const mk = (key, fn) => (include[key] === false ? null : fn);

    const tasks = {
      aiDetection: mk('aiDetection', () => this.safeCall(() => this.processAiDetection(buffer, options))),
      manipulation: mk('manipulation', () => this.safeCall(() => this.detectManipulation(buffer, options))),
      physics: mk('physics', () => this.safeCall(() => this.analyzePhysics(buffer, options))),
      geolocation: mk('geolocation', () => this.safeCall(() => this.processGeoLocation(buffer, options))),
      pythonAnalysis: mk('pythonAnalysis', () => this.safeCall(() => this.executePythonAnalysis(buffer, options))),
      statistical: mk('statistical', () => this.safeCall(() => this.analyzeStatistical(buffer, options)))
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

  // IA — lazy load pour éviter tfjs-node à l’import
  async processAiDetection(imageBuffer, options = {}) {
    if (this.aiService?.detectAIGenerated) {
      return this.aiService.detectAIGenerated(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./aiDetectionService', ['detectAIGenerated', 'analyze', 'run']);
    return fn ? fn(imageBuffer, options) : null;
  }

  async detectManipulation(imageBuffer, options = {}) {
    if (this.manipulationService?.detectManipulation) {
      return this.manipulationService.detectManipulation(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./manipulationDetector', ['detectManipulation', 'analyzeManipulation', 'analyze', 'run']);
    return fn ? fn(imageBuffer, options) : null;
  }

  async analyzePhysics(imageBuffer, options = {}) {
    if (this.heavyService?.performHeavyAnalysis) {
      return this.heavyService.performHeavyAnalysis(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./heavyAnalyzer', ['performHeavyAnalysis', 'analyze', 'run']);
    return fn ? fn(imageBuffer, options) : null;
  }

  async processGeoLocation(imageBuffer, options = {}) {
    if (this.geoService?.processGeoLocation) {
      return this.geoService.processGeoLocation(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./geoLocationService', ['processGeoLocation', 'analyze', 'geolocate']);
    return fn ? fn(imageBuffer, options) : null;
  }

  async executePythonAnalysis(imageBuffer, options = {}) {
    if (this.pythonService?.executePythonAnalysis) {
      return this.pythonService.executePythonAnalysis(imageBuffer, options);
    }
    const fn = await this.lazyLoadFunction('./pythonBridge', ['executePythonAnalysis', 'analyze', 'run']);
    return fn ? fn(imageBuffer, options) : null;
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
      return inner ? inner(imageBuffer, options) : null;
    }
    return null;
  }

  generateUnifiedReport(results) {
    return { summary: 'Unified forensic report', results, ts: new Date().toISOString() };
  }

  getMetadata() {
    return { name: 'ForensicService', version: this.version };
  }

  // Utils
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
}

module.exports = { ForensicService };
