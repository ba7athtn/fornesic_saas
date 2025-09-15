// src/services/rateLimitService.js
"use strict";

const cacheService = require('./cacheService');

class RateLimitService {
  // Construit une identité composite stable: ip + userId + clientId (header)
  static buildIdentity(req) {
    const xff = (req.headers['x-forwarded-for'] || '').toString();
    const ipFromXff = xff ? xff.split(',').map(s => s.trim()).find(Boolean) : null;
    const ip =
      ipFromXff ||
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'anonymous';

    const userId = req.user?.sub || req.user?.id || 'anon';
    const clientId =
      req.headers['x-client-id'] ||
      req.headers['x-api-key'] ||
      req.headers['x-app-id'] ||
      'web';

    return `${ip}:${userId}:${clientId}`;
  }

  // Politique compacte: "<limit>;w=<window>"
  static buildPolicy(limit, windowSeconds) {
    return `${limit};w=${windowSeconds}`;
  }

  // Fabrique de middleware de rate limit (Redis)
  static createLimiter(action, limit, windowSeconds, { exposeLegacyHeaders = true, customMessage } = {}) {
    return async (req, res, next) => {
      try {
        const identifier = RateLimitService.buildIdentity(req);
        const check = await cacheService.checkRateLimit(identifier, action, limit, windowSeconds);

        const remaining = Number(check?.remaining ?? 0);
        const resetTime = Number(check?.resetTime ?? windowSeconds);
        const current = Number(check?.current ?? 0);
        const allowed = check?.allowed !== false;

        const limitInt = Number(limit);
        const windowInt = Number(windowSeconds);

        // En-têtes conformes au draft IETF + complémentaires
        res.setHeader('RateLimit', `${Math.max(0, remaining)};w=${windowInt}`);
        res.setHeader('RateLimit-Policy', RateLimitService.buildPolicy(limitInt, windowInt));
        res.setHeader('RateLimit-Limit', String(limitInt));
        res.setHeader('RateLimit-Remaining', String(Math.max(0, remaining)));
        res.setHeader('RateLimit-Reset', String(Math.max(0, resetTime)));

        // Retry-After si bloqué
        if (!allowed) {
          res.setHeader('Retry-After', String(Math.max(1, resetTime)));
        }

        // En-têtes X-* pour compat legacy (optionnel)
        if (exposeLegacyHeaders) {
          res.setHeader('X-RateLimit-Action', action);
          res.setHeader('X-RateLimit-Limit', String(limitInt));
          res.setHeader('X-RateLimit-Window', String(windowInt));
          res.setHeader('X-RateLimit-Remaining', String(Math.max(0, remaining)));
          res.setHeader('X-RateLimit-Reset', String(Math.max(0, resetTime)));
        }

        if (!allowed) {
          return res.status(429).json({
            error: customMessage || 'Trop de requêtes',
            type: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.max(1, resetTime),
            remaining: Math.max(0, remaining),
            limit: limitInt,
            window: windowInt,
            action,
            message: RateLimitService.getRateLimitMessage(action, limitInt, windowInt),
            timestamp: new Date().toISOString()
          });
        }

        // Optionnel: exposer l'état courant aux handlers
        res.locals.rateLimit = {
          action,
          limit: limitInt,
          windowSeconds: windowInt,
          remaining,
          current,
          resetTime,
          identifier
        };
        return next();
      } catch (error) {
        // Fallback permissif si Redis indisponible
        console.error('❌ Erreur rate limiting:', {
          action,
          error: error.message,
          identifier: req.user?.sub || req.ip
        });
        return next();
      }
    };
  }

  // ✅ NOUVELLE MÉTHODE AJOUTÉE - createCustomLimit
  /**
   * Crée un limiteur personnalisé avec options flexibles
   * @param {Object} options - Configuration du limiteur
   * @param {string} options.action - Action à limiter (défaut: 'custom')
   * @param {number} options.limit - Nombre de requêtes autorisées (défaut: 100)
   * @param {number} options.windowMs - Fenêtre de temps en millisecondes
   * @param {number} options.windowSeconds - Fenêtre de temps en secondes
   * @param {number} options.window - Alias pour windowSeconds
   * @param {boolean} options.exposeLegacyHeaders - Exposer les headers X-RateLimit-* (défaut: true)
   * @param {string} options.message - Message d'erreur personnalisé
   * @returns {Function} Middleware Express
   */
  static createCustomLimit(options = {}) {
    const config = {
      action: String(options.action || 'custom'),
      limit: Math.max(1, parseInt(options.limit, 10) || 100),
      windowSeconds:
        options.windowSeconds ||
        options.window ||
        (options.windowMs ? Math.floor(options.windowMs / 1000) : 3600),
      exposeLegacyHeaders: options.exposeLegacyHeaders !== false,
      customMessage: options.message
    };

    if (process.env.DEBUG_AUTH === 'true' || process.env.NODE_ENV !== 'production') {
      console.log(`🔧 Création limiteur personnalisé: ${config.action} (${config.limit}/${config.windowSeconds}s)`);
    }

    return this.createLimiter(
      config.action,
      config.limit,
      config.windowSeconds,
      {
        exposeLegacyHeaders: config.exposeLegacyHeaders,
        customMessage: config.customMessage
      }
    );
  }

  static getRateLimitMessage(action, limit, windowSeconds) {
    const units = [
      { seconds: 3600, name: 'heure' },
      { seconds: 60,  name: 'minute' },
      { seconds: 1,   name: 'seconde' }
    ];
    const unit = units.find(u => windowSeconds >= u.seconds) || units[units.length - 1];
    const timeValue = Math.max(1, Math.floor(windowSeconds / unit.seconds));

    const messages = {
      register: `Limite d'inscription: ${limit} tentatives par ${timeValue} ${unit.name}(s)`,
      login: `Limite de connexion: ${limit} essais par ${timeValue} ${unit.name}(s)`,
      refresh: `Limite de rafraîchissement: ${limit} renouvellements par ${timeValue} ${unit.name}(s)`,
      password_reset: `Limite de réinitialisation: ${limit} demandes par ${timeValue} ${unit.name}(s)`,
      upload: `Limite d'upload: ${limit} fichiers par ${timeValue} ${unit.name}(s)`,
      analysis: `Limite d'analyse: ${limit} analyses par ${timeValue} ${unit.name}(s)`,
      report: `Limite de rapports: ${limit} générations par ${timeValue} ${unit.name}(s)`,
      download: `Limite de téléchargement: ${limit} fichiers par ${timeValue} ${unit.name}(s)`,
      search: `Limite de recherche: ${limit} requêtes par ${timeValue} ${unit.name}(s)`,
      validation: `Limite de validation: ${limit} demandes par ${timeValue} ${unit.name}(s)`,
      admin: `Limite admin: ${limit} requêtes par ${timeValue} ${unit.name}(s)`,
      batch: `Limite batch: ${limit} requêtes par ${timeValue} ${unit.name}(s)`,
      python_analysis: `Limite analyse Python: ${limit} analyses par ${timeValue} ${unit.name}(s)`,
      comparison: `Limite de comparaison: ${limit} comparaisons par ${timeValue} ${unit.name}(s)`,
      email_verification: `Limite vérification email: ${limit} demandes par ${timeValue} ${unit.name}(s)`,
      report_generation: `Limite génération rapport: ${limit} rapports par ${timeValue} ${unit.name}(s)`,
      export: `Limite d'export: ${limit} exports par ${timeValue} ${unit.name}(s)`,
      custom_report: `Limite rapport personnalisé: ${limit} rapports par ${timeValue} ${unit.name}(s)`,
      batch_report: `Limite batch report: ${limit} lots de rapports par ${timeValue} ${unit.name}(s)`,
      global: `Limite globale: ${limit} requêtes par ${timeValue} ${unit.name}(s)`,
      custom: `Limite personnalisée: ${limit} requêtes par ${timeValue} ${unit.name}(s)`
    };

    return messages[action] || `Limite atteinte: ${limit} requêtes par ${timeValue} ${unit.name}(s)`;
  }

  // Préconfigurations courantes (auth et API)
  static get register()      { return this.createLimiter('register',         3, 3600); }
  static get login()         { return this.createLimiter('login',            5,  900); }
  static get refresh()       { return this.createLimiter('refresh',         10, 3600); }
  static get passwordReset() { return this.createLimiter('password_reset',   3, 3600); }
  static get upload()        { return this.createLimiter('upload',          20, 3600); }
  static get analysis()      { return this.createLimiter('analysis',        30, 3600); }
  static get report()        { return this.createLimiter('report',          10, 3600); }
  static get auth()          { return this.createLimiter('auth',            10,  300); }

  // Alias créateurs
  static createRegisterLimit()       { return this.register; }
  static createLoginLimit()          { return this.login; }
  static createRefreshLimit()        { return this.refresh; }
  static createPasswordResetLimit()  { return this.passwordReset; }
  static createUploadLimit()         { return this.upload; }
  static createAnalysisLimit()       { return this.analysis; }
  static createReportLimit()         { return this.report; }
  static createAuthLimit()           { return this.auth; }

  // Autres actions spécialisées
  static createDownloadLimit()         { return this.createLimiter('download',          50, 3600); }
  static createSearchLimit()           { return this.createLimiter('search',           100, 3600); }
  static createValidationLimit()       { return this.createLimiter('validation',        20, 3600); }
  static createAdminLimit()            { return this.createLimiter('admin',            100, 3600); }
  static createBatchLimit()            { return this.createLimiter('batch',             20, 3600); }
  static createPythonAnalysisLimit()   { return this.createLimiter('python_analysis',   30, 3600); }
  static createComparisonLimit()       { return this.createLimiter('comparison',        30, 3600); }
  static createEmailVerificationLimit(){ return this.createLimiter('email_verification',10, 3600); }
  static createReportGenerationLimit() { return this.createLimiter('report_generation', 15, 3600); }
  static createExportLimit()           { return this.createLimiter('export',            10, 3600); }
  static createCustomReportLimit()     { return this.createLimiter('custom_report',      5, 3600); }
  static createBatchReportLimit()      { return this.createLimiter('batch_report',       3, 3600); }

  // Global et adaptatif
  static globalLimiter()               { return this.createLimiter('global',           100,  900); }

  static createAdaptiveLimiter(baseAction, baseLimits = { limit: 100, window: 900 }) {
    return async (req, res, next) => {
      const roles = req.user?.roles;
      const userRole =
        (Array.isArray(roles) && roles) ||
        (typeof roles === 'string' && roles) ||
        req.user?.role ||
        'user';

      const roleMultipliers = { admin: 10, premium: 5, professional: 3, user: 1 };
      const multiplier = roleMultipliers[userRole] || 1;

      const baseLimit = Number(baseLimits.limit ?? 100);
      const baseWindow = Number(baseLimits.window ?? 900);

      const adjustedLimit = Math.max(1, baseLimit * multiplier);
      const windowSeconds = Math.max(1, baseWindow);

      const limiter = this.createLimiter(`${baseAction}_${userRole}`, adjustedLimit, windowSeconds);
      return limiter(req, res, next);
    };
  }

  // Diagnostics/administration
  static async getRateLimitStatus(identifier, action) {
    try {
      if (typeof cacheService.getRateLimitStatus === 'function') {
        return await cacheService.getRateLimitStatus(identifier, action);
      }
      return null;
    } catch (error) {
      console.error('❌ Erreur statut rate limit:', error);
      return null;
    }
  }

  static async resetRateLimit(identifier, action) {
    try {
      if (typeof cacheService.resetRateLimit === 'function') {
        return await cacheService.resetRateLimit(identifier, action);
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur reset rate limit:', error);
      return false;
    }
  }

  static async getGlobalStats() {
    try {
      if (typeof cacheService.getRateLimitStats === 'function') {
        return await cacheService.getRateLimitStats();
      }
      if (typeof cacheService.getStats === 'function') {
        return await cacheService.getStats();
      }
      return null;
    } catch (error) {
      console.error('❌ Erreur stats rate limiting:', error);
      return null;
    }
  }
}

module.exports = RateLimitService;
