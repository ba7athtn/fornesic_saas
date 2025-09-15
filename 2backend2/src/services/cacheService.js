const Redis = require('ioredis');

class CacheService {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.connectionRetries = 0;
    this.maxRetries = 5;
    
    this.connect();
  }

  async connect() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        family: 4, // IPv4
        connectTimeout: 10000,
        commandTimeout: 5000
      };

      this.redis = new Redis(redisConfig);

      this.redis.on('connect', () => {
        console.log('✅ Redis connecté');
        this.isConnected = true;
        this.connectionRetries = 0;
      });

      this.redis.on('error', (error) => {
        console.error('❌ Erreur Redis:', error.message);
        this.isConnected = false;
        
        if (this.connectionRetries < this.maxRetries) {
          this.connectionRetries++;
          console.log(`🔄 Tentative de reconnexion Redis ${this.connectionRetries}/${this.maxRetries}`);
          setTimeout(() => this.connect(), 5000 * this.connectionRetries);
        }
      });

      this.redis.on('close', () => {
        console.warn('⚠️ Connexion Redis fermée');
        this.isConnected = false;
      });

      this.redis.on('reconnecting', () => {
        console.log('🔄 Reconnexion Redis...');
      });

      await this.redis.connect();

    } catch (error) {
      console.error('❌ Impossible de se connecter à Redis:', error.message);
      this.isConnected = false;
    }
  }

  // Méthode générique SET
  async set(key, value, ttl = 3600) {
    if (!this.isConnected) {
      console.warn('⚠️ Redis non connecté, cache ignoré');
      return false;
    }

    try {
      const serializedValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : value.toString();
      
      if (ttl > 0) {
        await this.redis.setex(key, ttl, serializedValue);
      } else {
        await this.redis.set(key, serializedValue);
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Cache SET error for key ${key}:`, error.message);
      return false;
    }
  }

  // Méthode générique GET
  async get(key) {
    if (!this.isConnected) {
      return null;
    }

    try {
      const value = await this.redis.get(key);
      if (!value) return null;

      // Tenter de parser comme JSON, sinon retourner string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`❌ Cache GET error for key ${key}:`, error.message);
      return null;
    }
  }

  // Méthode générique DELETE
  async delete(key) {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.redis.del(key);
      return result > 0;
    } catch (error) {
      console.error(`❌ Cache DELETE error for key ${key}:`, error.message);
      return false;
    }
  }

  // Supprimer plusieurs clés avec pattern
  async deletePattern(pattern) {
    if (!this.isConnected) {
      return 0;
    }

    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.redis.del(...keys);
      return result;
    } catch (error) {
      console.error(`❌ Cache DELETE PATTERN error for ${pattern}:`, error.message);
      return 0;
    }
  }

  // Vérifier si une clé existe
  async exists(key) {
    if (!this.isConnected) {
      return false;
    }

    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`❌ Cache EXISTS error for key ${key}:`, error.message);
      return false;
    }
  }

  // Incrémenter une valeur
  async increment(key, amount = 1, ttl = null) {
    if (!this.isConnected) {
      return null;
    }

    try {
      const result = await this.redis.incrby(key, amount);
      
      if (ttl && ttl > 0) {
        await this.redis.expire(key, ttl);
      }
      
      return result;
    } catch (error) {
      console.error(`❌ Cache INCREMENT error for key ${key}:`, error.message);
      return null;
    }
  }

  // === MÉTHODES SPÉCIALISÉES POUR BA7ATH ===

  // Cache des analyses d'images
  async cacheImageAnalysis(imageId, analysis, ttl = 24 * 3600) {
    const key = `analysis:${imageId}`;
    return await this.set(key, {
      imageId,
      analysis,
      cachedAt: new Date().toISOString()
    }, ttl);
  }

  async getCachedImageAnalysis(imageId) {
    const key = `analysis:${imageId}`;
    const cached = await this.get(key);
    return cached ? cached.analysis : null;
  }

  // Cache des métadonnées EXIF
  async cacheImageMetadata(imageId, metadata, ttl = 7 * 24 * 3600) {
    const key = `metadata:${imageId}`;
    return await this.set(key, metadata, ttl);
  }

  async getCachedImageMetadata(imageId) {
    const key = `metadata:${imageId}`;
    return await this.get(key);
  }

  // Cache des thumbnails
  async cacheThumbnailPath(imageId, thumbnailPath, ttl = 30 * 24 * 3600) {
    const key = `thumbnail:${imageId}`;
    return await this.set(key, thumbnailPath, ttl);
  }

  async getCachedThumbnailPath(imageId) {
    const key = `thumbnail:${imageId}`;
    return await this.get(key);
  }

  // Rate limiting par utilisateur
  async checkRateLimit(userId, action, limit = 10, windowSeconds = 3600) {
    if (!this.isConnected) {
      return { allowed: true, remaining: limit };
    }

    try {
      const key = `ratelimit:${userId}:${action}`;
      const current = await this.increment(key, 1, windowSeconds);
      
      if (current === null) {
        return { allowed: true, remaining: limit - 1 };
      }

      const remaining = Math.max(0, limit - current);
      const allowed = current <= limit;
      
      return {
        allowed,
        remaining,
        current,
        limit,
        resetTime: windowSeconds
      };
    } catch (error) {
      console.error(`❌ Rate limit error for ${userId}:${action}:`, error.message);
      return { allowed: true, remaining: limit };
    }
  }

  // Sessions utilisateur
  async cacheUserSession(sessionId, sessionData, ttl = 7 * 24 * 3600) {
    const key = `session:${sessionId}`;
    return await this.set(key, sessionData, ttl);
  }

  async getCachedUserSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.get(key);
  }

  async invalidateUserSession(sessionId) {
    const key = `session:${sessionId}`;
    return await this.delete(key);
  }

  // Cache des statistiques
  async cacheStats(statsType, data, ttl = 600) { // 10 minutes
    const key = `stats:${statsType}`;
    return await this.set(key, {
      data,
      generatedAt: new Date().toISOString()
    }, ttl);
  }

  async getCachedStats(statsType) {
    const key = `stats:${statsType}`;
    const cached = await this.get(key);
    return cached ? cached.data : null;
  }

  // Queue des jobs d'analyse
  async addAnalysisJob(imageId, priority = 'normal') {
    if (!this.isConnected) {
      return false;
    }

    try {
      const queueKey = `queue:analysis:${priority}`;
      const job = {
        imageId,
        addedAt: new Date().toISOString(),
        priority
      };
      
      await this.redis.lpush(queueKey, JSON.stringify(job));
      return true;
    } catch (error) {
      console.error(`❌ Erreur ajout job analyse ${imageId}:`, error.message);
      return false;
    }
  }

  async getNextAnalysisJob(priority = 'normal') {
    if (!this.isConnected) {
      return null;
    }

    try {
      const queueKey = `queue:analysis:${priority}`;
      const job = await this.redis.rpop(queueKey);
      return job ? JSON.parse(job) : null;
    } catch (error) {
      console.error(`❌ Erreur récupération job analyse:`, error.message);
      return null;
    }
  }

  // Notifications temps réel
  async publishNotification(channel, data) {
    if (!this.isConnected) {
      return false;
    }

    try {
      await this.redis.publish(channel, JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      console.error(`❌ Erreur publication notification:`, error.message);
      return false;
    }
  }

  // Nettoyage du cache
  async cleanup() {
    if (!this.isConnected) {
      return { cleaned: 0 };
    }

    try {
      const patterns = [
        'analysis:*', // Analyses anciennes
        'session:*',  // Sessions expirées
        'ratelimit:*' // Rate limits anciens
      ];

      let totalCleaned = 0;
      for (const pattern of patterns) {
        const cleaned = await this.deletePattern(pattern);
        totalCleaned += cleaned;
      }

      console.log(`🧹 Cache cleanup: ${totalCleaned} clés supprimées`);
      return { cleaned: totalCleaned };
    } catch (error) {
      console.error('❌ Erreur cleanup cache:', error.message);
      return { cleaned: 0 };
    }
  }

  // Statistiques du cache
  async getStats() {
    if (!this.isConnected) {
      return null;
    }

    try {
      const info = await this.redis.info('memory');
      const dbInfo = await this.redis.info('keyspace');
      
      return {
        connected: this.isConnected,
        memory: this.parseRedisMemoryInfo(info),
        keyspace: this.parseRedisKeyspaceInfo(dbInfo),
        uptime: await this.redis.get('uptime') || 0
      };
    } catch (error) {
      console.error('❌ Erreur stats Redis:', error.message);
      return null;
    }
  }

  parseRedisMemoryInfo(info) {
    const lines = info.split('\n');
    const memory = {};
    
    for (const line of lines) {
      if (line.includes('used_memory_human:')) {
        memory.used = line.split(':')[1].trim();
      }
      if (line.includes('used_memory_peak_human:')) {
        memory.peak = line.split(':')[1].trim();
      }
    }
    
    return memory;
  }

  parseRedisKeyspaceInfo(info) {
    const lines = info.split('\n');
    let totalKeys = 0;
    
    for (const line of lines) {
      if (line.includes('db0:')) {
        const match = line.match(/keys=(\d+)/);
        if (match) {
          totalKeys = parseInt(match[1]);
        }
      }
    }
    
    return { totalKeys };
  }

  // Fermer la connexion proprement
  async disconnect() {
    if (this.redis && this.isConnected) {
      await this.redis.quit();
      console.log('✅ Redis déconnecté proprement');
    }
  }
}

module.exports = new CacheService();
