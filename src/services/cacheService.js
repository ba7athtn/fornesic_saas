// src/services/cacheService.js
"use strict";

const Redis = require('ioredis');
const config = require('../config');

class CacheService {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.connectionRetries = 0;

    // TTL par domaine (surclassable via config.cache.ttl)
    const ttlCfg = config.cache?.ttl || {};
    this.CACHE_TTL = {
      exif: ttlCfg.exif ?? 3600,                 // 1h - métadonnées EXIF stables
      analysis: ttlCfg.analysis ?? 1800,         // 30min - résultats forensiques
      reports: ttlCfg.reports ?? 600,            // 10min - rapports générés
      thumbnails: ttlCfg.thumbnails ?? 86400,    // 24h - images optimisées
      manipulation: ttlCfg.manipulation ?? 900,  // 15min - détection manipulation
      ai_detection: ttlCfg.ai_detection ?? 1200, // 20min - analyses IA
      sessions: ttlCfg.sessions ?? 604800,       // 7j - sessions utilisateur
      stats: ttlCfg.stats ?? 600,                // 10min - statistiques
      forensic_analyzer: ttlCfg.forensic_analyzer ?? 1800, // 30min
      batch_reports: ttlCfg.batch_reports ?? 3600,         // 1h
      metadata: ttlCfg.metadata ?? 3600,
      thumbnail: ttlCfg.thumbnail ?? 86400
    };

    this.connect();
  }

  async connect() {
    try {
      const redisCfg = config.redis || {};
      const redisOptions = {
        host: redisCfg.host || process.env.REDIS_HOST || 'localhost',
        port: Number(redisCfg.port || process.env.REDIS_PORT || 6379),
        password: redisCfg.password || process.env.REDIS_PASSWORD || undefined,
        db: Number(redisCfg.db || process.env.REDIS_DB || 0),
        family: 4,
        connectTimeout: Number(redisCfg.connectTimeout || 10000),
        lazyConnect: true,
        keepAlive: Number(redisCfg.keepAlive || 30000),
        retryStrategy: (times) => Math.min(times * 200, 5000),
        maxRetriesPerRequest: Number(redisCfg.maxRetriesPerRequest || 5),
        autoResendUnfulfilledCommands: false,
        autoResubscribe: false,
        enableAutoPipelining: true,
        tls: redisCfg.tls || undefined
      };

      this.redis = new Redis(redisOptions);

      this.redis.on('connect', () => {
        console.log('✅ Redis connecté - CacheService ready');
        this.isConnected = true;
        this.connectionRetries = 0;
      });

      this.redis.on('error', (error) => {
        console.error('❌ Erreur Redis:', error.message);
        this.isConnected = false;
      });

      this.redis.on('end', () => {
        console.warn('⚠️ Connexion Redis terminée');
        this.isConnected = false;
      });

      await this.redis.connect();
    } catch (error) {
      console.error('❌ Impossible de se connecter à Redis:', error.message);
      this.isConnected = false;
    }
  }

  // =========================
  // Helpers génériques
  // =========================

  async set(key, value, ttl = 3600) {
    if (!this.isConnected) {
      console.warn('⚠️ Redis non connecté, cache ignoré');
      return false;
    }
    try {
      const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      if (ttl > 0) {
        await this.redis.set(key, serializedValue, 'EX', ttl);
      } else {
        await this.redis.set(key, serializedValue);
      }
      return true;
    } catch (error) {
      console.error(`❌ Cache SET error for key ${key}:`, error.message);
      return false;
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const value = await this.redis.get(key);
      if (value == null) return null;
      try { return JSON.parse(value); } catch { return value; }
    } catch (error) {
      console.error(`❌ Cache GET error for key ${key}:`, error.message);
      return null;
    }
  }

  async delete(key) {
    if (!this.isConnected) return false;
    try {
      const result = await this.redis.del(key);
      return result > 0;
    } catch (error) {
      console.error(`❌ Cache DELETE error for key ${key}:`, error.message);
      return false;
    }
  }

  async ttl(key) {
    if (!this.isConnected) return -2;
    try {
      return await this.redis.ttl(key); // -2 n'existe pas, -1 pas d’TTL, >=0 TTL restant
    } catch (e) {
      console.error(`❌ TTL error for key ${key}:`, e.message);
      return -2;
    }
  }

  async ttlWithType(type, key) {
    return this.ttl(`${type}:${key}`);
  }

  // =========================
  // Clés typées
  // =========================

  async getWithType(type, key) {
    const fullKey = `${type}:${key}`;
    return this.get(fullKey);
  }

  async setWithType(type, key, value, customTTL = null) {
    const fullKey = `${type}:${key}`;
    const ttl = customTTL || this.CACHE_TTL[type] || 600;
    return this.set(fullKey, value, ttl);
  }

  async deleteWithType(type, key) {
    const fullKey = `${type}:${key}`;
    return this.delete(fullKey);
  }

  // =========================
  // Suppressions par motif (SCAN + UNLINK)
  // =========================

  async deletePattern(pattern) {
    if (!this.isConnected) return 0;
    try {
      let cursor = '0';
      let total = 0;
      do {
        const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 1000);
        cursor = nextCursor;
        if (keys.length) {
          if (typeof this.redis.unlink === 'function') {
            total += await this.redis.unlink(...keys);
          } else {
            total += await this.redis.del(...keys);
          }
        }
      } while (cursor !== '0');
      return total;
    } catch (error) {
      console.error(`❌ Cache DELETE PATTERN error for ${pattern}:`, error.message);
      return 0;
    }
  }

  // =========================
  // Existence / INCR
  // =========================

  async exists(key) {
    if (!this.isConnected) return false;
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`❌ Cache EXISTS error for key ${key}:`, error.message);
      return false;
    }
  }

  async increment(key, amount = 1, ttl = null) {
    if (!this.isConnected) return null;
    try {
      const result = await this.redis.incrby(key, amount);
      if (ttl && ttl > 0) await this.redis.expire(key, ttl);
      return result;
    } catch (error) {
      console.error(`❌ Cache INCREMENT error for key ${key}:`, error.message);
      return null;
    }
  }

  // =========================
  // Méthodes spécialisées
  // =========================

  // Analyses d'images
  async cacheImageAnalysis(imageId, analysis, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.analysis;
    return this.setWithType('analysis', imageId, { imageId, analysis, cachedAt: new Date().toISOString() }, actualTTL);
  }
  async getCachedImageAnalysis(imageId) {
    const cached = await this.getWithType('analysis', imageId);
    return cached ? cached.analysis : null;
  }

  // EXIF
  async cacheExifData(imageHash, exifData, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.exif;
    return this.setWithType('exif', imageHash, exifData, actualTTL);
  }
  async getCachedExifData(imageHash) {
    return this.getWithType('exif', imageHash);
  }

  // ForensicAnalyzer
  async cacheForensicAnalysis(imageHash, analysisResult, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.forensic_analyzer;
    return this.setWithType('forensic_analyzer', imageHash, analysisResult, actualTTL);
  }
  async getCachedForensicAnalysis(imageHash) {
    return this.getWithType('forensic_analyzer', imageHash);
  }

  // ManipulationDetector
  async cacheManipulationAnalysis(imageHash, manipulationResult, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.manipulation;
    return this.setWithType('manipulation', imageHash, manipulationResult, actualTTL);
  }
  async getCachedManipulationAnalysis(imageHash) {
    return this.getWithType('manipulation', imageHash);
  }

  // IA detection
  async cacheAIDetection(imageHash, aiResult, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.ai_detection;
    return this.setWithType('ai_detection', imageHash, aiResult, actualTTL);
  }
  async getCachedAIDetection(imageHash) {
    return this.getWithType('ai_detection', imageHash);
  }

  // Métadonnées
  async cacheImageMetadata(imageId, metadata, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.metadata;
    return this.setWithType('metadata', imageId, metadata, actualTTL);
  }
  async getCachedImageMetadata(imageId) {
    return this.getWithType('metadata', imageId);
  }

  // Thumbnails
  async cacheThumbnailPath(imageId, thumbnailPath, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.thumbnail;
    return this.setWithType('thumbnail', imageId, thumbnailPath, actualTTL);
  }
  async getCachedThumbnailPath(imageId) {
    return this.getWithType('thumbnail', imageId);
  }

  // Rate limiting (expose TTL réel pour Retry-After)
  async checkRateLimit(userId, action, limit = 10, windowSeconds = 3600) {
    if (!this.isConnected) {
      return {
        allowed: true,
        remaining: limit,
        current: 0,
        limit,
        resetTime: windowSeconds,
        resetAt: new Date(Date.now() + windowSeconds * 1000).toISOString()
      };
    }
    try {
      const key = `ratelimit:${userId}:${action}`;
      const current = await this.increment(key, 1, windowSeconds);
      if (current === null) {
        return {
          allowed: true,
          remaining: limit - 1,
          current: 1,
          limit,
          resetTime: windowSeconds,
          resetAt: new Date(Date.now() + windowSeconds * 1000).toISOString()
        };
      }
      const remaining = Math.max(0, limit - current);
      const allowed = current <= limit;
      let ttl = await this.ttl(key);
      if (ttl < 0) ttl = windowSeconds;
      return {
        allowed,
        remaining,
        current,
        limit,
        resetTime: ttl,
        resetAt: new Date(Date.now() + ttl * 1000).toISOString()
      };
    } catch (error) {
      console.error(`❌ Rate limit error for ${userId}:${action}:`, error.message);
      return {
        allowed: true,
        remaining: limit,
        current: 0,
        limit,
        resetTime: windowSeconds,
        resetAt: new Date(Date.now() + windowSeconds * 1000).toISOString()
      };
    }
  }

  async resetRateLimit(userId, action) {
    const key = `ratelimit:${userId}:${action}`;
    return this.delete(key);
  }

  // Sessions utilisateur
  async cacheUserSession(sessionId, sessionData, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.sessions;
    return this.setWithType('session', sessionId, sessionData, actualTTL);
  }
  async getCachedUserSession(sessionId) {
    return this.getWithType('session', sessionId);
  }
  async invalidateUserSession(sessionId) {
    return this.deleteWithType('session', sessionId);
  }

  // Stats
  async cacheStats(statsType, data, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.stats;
    return this.setWithType('stats', statsType, { data, generatedAt: new Date().toISOString() }, actualTTL);
  }
  async getCachedStats(statsType) {
    const cached = await this.getWithType('stats', statsType);
    return cached ? cached.data : null;
  }

  // Rapports
  async cacheReport(reportKey, reportData, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.reports;
    return this.setWithType('reports', reportKey, { ...reportData, cachedAt: new Date().toISOString() }, actualTTL);
  }
  async getCachedReport(reportKey) {
    return this.getWithType('reports', reportKey);
  }

  // Rapports batch
  async cacheBatchReport(sessionId, reportData, ttl = null) {
    const actualTTL = ttl || this.CACHE_TTL.batch_reports;
    const key = `batch_${sessionId}`;
    return this.setWithType('reports', key, reportData, actualTTL);
  }
  async getCachedBatchReport(sessionId) {
    const key = `batch_${sessionId}`;
    return this.getWithType('reports', key);
  }

  // Queues d'analyse simples (si besoin local, sinon utiliser Bull)
  async addAnalysisJob(imageId, priority = 'normal') {
    if (!this.isConnected) return false;
    try {
      const queueKey = `queue:analysis:${priority}`;
      const job = { imageId, addedAt: new Date().toISOString(), priority };
      await this.redis.lpush(queueKey, JSON.stringify(job));
      return true;
    } catch (error) {
      console.error(`❌ Erreur ajout job analyse ${imageId}:`, error.message);
      return false;
    }
  }
  async getNextAnalysisJob(priority = 'normal') {
    if (!this.isConnected) return null;
    try {
      const queueKey = `queue:analysis:${priority}`;
      const job = await this.redis.rpop(queueKey);
      return job ? JSON.parse(job) : null;
    } catch (error) {
      console.error('❌ Erreur récupération job analyse:', error.message);
      return null;
    }
  }

  // Pub/Sub notifications
  async publishNotification(channel, data) {
    if (!this.isConnected) return false;
    try {
      await this.redis.publish(channel, JSON.stringify({ ...data, timestamp: new Date().toISOString() }));
      return true;
    } catch (error) {
      console.error(`❌ Erreur publication notification:`, error.message);
      return false;
    }
  }

  // Nettoyage (SCAN + UNLINK) avec métriques
  async cleanup() {
    if (!this.isConnected) return { cleaned: 0 };
    try {
      const patterns = [
        'analysis:*',
        'session:*',
        'ratelimit:*',
        'reports:*',
        'stats:*',
        'exif:*',
        'thumbnail:*',
        'manipulation:*',
        'ai_detection:*',
        'forensic_analyzer:*',
        'metadata:*'
      ];
      let totalCleaned = 0;
      const details = {};
      for (const pattern of patterns) {
        const cleaned = await this.deletePattern(pattern);
        totalCleaned += cleaned;
        details[pattern] = cleaned;
      }
      console.log(`🧹 Cache cleanup: ${totalCleaned} clés supprimées`, details);
      return { cleaned: totalCleaned, details };
    } catch (error) {
      console.error('❌ Erreur cleanup cache:', error.message);
      return { cleaned: 0 };
    }
  }

  // Stats
  async getStats() {
    if (!this.isConnected) return null;
    try {
      const infoMemory = await this.redis.info('memory');
      const infoKeyspace = await this.redis.info('keyspace');

      // Compter clés par type
      const keysByType = {};
      const types = Object.keys(this.CACHE_TTL);
      for (const type of types) {
        keysByType[type] = await this._countByScan(`${type}:*`);
      }

      return {
        connected: this.isConnected,
        memory: this.parseRedisMemoryInfo(infoMemory),
        keyspace: this.parseRedisKeyspaceInfo(infoKeyspace),
        keysByType,
        ttlConfig: this.CACHE_TTL,
        connectionRetries: this.connectionRetries
      };
    } catch (error) {
      console.error('❌ Erreur stats Redis:', error.message);
      return null;
    }
  }

  async _countByScan(pattern) {
    let cursor = '0';
    let total = 0;
    do {
      const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 1000);
      cursor = nextCursor;
      total += keys.length;
    } while (cursor !== '0');
    return total;
  }

  parseRedisMemoryInfo(info) {
    const lines = info.split('\n');
    const memory = {};
    for (const line of lines) {
      if (line.startsWith('used_memory_human:')) {
        memory.used = line.split(':')?.trim();
      }
      if (line.startsWith('used_memory_peak_human:')) {
        memory.peak = line.split(':')?.trim();
      }
    }
    return memory;
  }

  parseRedisKeyspaceInfo(info) {
    // Exemple: db0:keys=123,expires=5,avg_ttl=0
    const lines = info.split('\n');
    let totalKeys = 0;
    for (const line of lines) {
      const m = line.match(/^db\d+:keys=(\d+),/);
      if (m) {
        totalKeys += parseInt(m, 10);
      }
    }
    return { totalKeys };
  }

  // Health check
  async healthCheck() {
    try {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      return { status: 'healthy', connected: this.isConnected, latency: `${latency}ms`, timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'unhealthy', connected: false, error: error.message, timestamp: new Date().toISOString() };
    }
  }

  // Fermeture propre
  async disconnect() {
    if (this.redis) {
      try {
        await this.redis.quit();
        console.log('✅ Redis déconnecté proprement');
      } catch (e) {
        console.error('❌ Erreur à la déconnexion Redis:', e.message);
      }
      this.isConnected = false;
    }
  }
}

module.exports = new CacheService();
