'use strict';

// Idempotent guards (éviter redeclaration en hot-reload)
const crypto = global.__crypto || require('crypto');
global.__crypto = crypto;

const jwt = global.__jwt || require('jsonwebtoken');
global.__jwt = jwt;

// ✅ CONFIG
const config = require('../config');

// Dépendances modèles
const User = require('../models/User');
const Session = require('../models/Session');

// Service de cache (optionnel)
let cacheService = null;
try {
  cacheService = require('./cacheService');
  console.log('✅ CacheService intégré à AuthService');
} catch {
  console.warn('⚠️ CacheService non disponible, fallback mode');
  cacheService = null;
}

class AuthService {
  constructor() {
    // Secrets et paramètres — désormais depuis config.js
    const jwtCfg = config.auth?.jwt || {};
    this.jwtSecret = jwtCfg.secret || process.env.JWT_SECRET; // rétrocompat
    this.jwtAccessSecret = jwtCfg.accessSecret || this.jwtSecret;
    this.jwtRefreshSecret = jwtCfg.refreshSecret || process.env.JWT_REFRESH_SECRET;
    this.jwtEmailSecret = jwtCfg.emailSecret || this.jwtAccessSecret;

    this.jwtExpiresIn = jwtCfg.accessTtl || process.env.JWT_EXPIRES_IN || '1h';
    this.refreshExpiresIn = jwtCfg.refreshTtl || process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    this.issuer = jwtCfg.issuer || process.env.JWT_ISSUER || 'ba7ath-auth';
    this.audience = jwtCfg.audience || process.env.JWT_AUDIENCE || 'ba7ath-api';
    this.kid = jwtCfg.kid || process.env.JWT_KID || undefined;
    this.refreshKid = jwtCfg.refreshKid || process.env.JWT_REFRESH_KID || undefined;

    // OTP depuis config
    const otpCfg = config.auth?.otp || {};
    this.otpTtlMinutes = Number(otpCfg.ttlMinutes || process.env.OTP_TTL_MINUTES || 15);
    this.otpAttemptsLimit = Number(otpCfg.attemptsLimit || process.env.OTP_ATTEMPTS_LIMIT || 5);
    this.otpSecret = otpCfg.secret || process.env.OTP_SECRET || this.jwtEmailSecret;

    // Rate limit auth
    const rlCfg = config.auth?.rateLimit || {};
    this.authRateLimitMax = Number(rlCfg.max || process.env.RATE_LIMIT_AUTH_MAX || 10);
    this.authRateLimitWindow = Number(rlCfg.window || process.env.RATE_LIMIT_AUTH_WINDOW || 300);

    // Cache service (instance)
    this.cacheService = cacheService;

    this.validateEnvironment();
  }

  // Validation d'environnement renforcée
  validateEnvironment() {
    const missing = [];
    if (!this.jwtAccessSecret) missing.push('JWT_ACCESS_SECRET (auth.jwt.accessSecret)');
    if (!this.jwtRefreshSecret) missing.push('JWT_REFRESH_SECRET (auth.jwt.refreshSecret)');
    if (missing.length) {
      console.error('❌ Variables JWT manquantes:', missing.join(', '));
      process.exit(1);
    }
    if ((this.jwtAccessSecret || '').length < 32 || (this.jwtRefreshSecret || '').length < 32) {
      console.error('❌ JWT_ACCESS_SECRET/JWT_REFRESH_SECRET doivent faire au moins 32 caractères');
      process.exit(1);
    }
  }

  // =========================
  // BRUTE FORCE (clé unifiée)
  // =========================
  bfKey(key, namespace = 'login_generic') {
    const safeKey = String(key || '').toLowerCase();
    return `brute_force:${namespace}:${safeKey}`;
  }

  async incrementBruteForceCounter(key, ns = 'login_generic') {
    try {
      if (!this.cacheService) return 1;
      const cacheKey = this.bfKey(key, ns);
      return await this.cacheService.increment(cacheKey, 1, 900); // TTL 15 min
    } catch (e) {
      console.warn('⚠️ BF increment error:', e.message);
      return 1;
    }
  }

  async resetBruteForceCounter(key, ns = 'login_generic') {
    try {
      if (!this.cacheService) return true;
      const cacheKey = this.bfKey(key, ns);
      await this.cacheService.delete(cacheKey);
      return true;
    } catch (e) {
      console.warn('⚠️ BF reset error:', e.message);
      return false;
    }
  }

  async detectBruteForce(key, ns = 'login_generic', threshold = 5) {
    try {
      if (!this.cacheService) return { isSuspicious: false, attemptsCount: 0, blockUntil: null };
      const cacheKey = this.bfKey(key, ns);
      const current = await this.cacheService.get(cacheKey);
      const attemptsCount = Number(current) || 0;
      const isSuspicious = attemptsCount >= threshold;
      let blockUntil = null;
      if (isSuspicious && this.cacheService.ttl) {
        const ttl = await this.cacheService.ttl(cacheKey);
        if (ttl > 0) blockUntil = new Date(Date.now() + ttl * 1000).toISOString();
      } else if (isSuspicious) {
        blockUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
      return { isSuspicious, attemptsCount, blockUntil };
    } catch (e) {
      console.warn('⚠️ BF detect error:', e.message);
      return { isSuspicious: false, attemptsCount: 0, blockUntil: null };
    }
  }

  // =========================
  // OTP HMAC + tentatives
  // =========================
  otpKeyForEmail(email) {
    const h = crypto.createHash('sha256').update(String(email || '').toLowerCase()).digest('hex').substring(0, 32);
    return `otp:email:${h}`;
  }
  otpAttemptsKeyForEmail(email) {
    const h = crypto.createHash('sha256').update(String(email || '').toLowerCase()).digest('hex').substring(0, 32);
    return `otp_attempts:email:${h}`;
  }
  generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
  hmacOtp(code) {
    return crypto.createHmac('sha256', this.otpSecret).update(String(code)).digest('hex');
  }

  async setOtpForEmail(email, code, ttlMinutes = this.otpTtlMinutes) {
    if (!this.cacheService) return false;
    const key = this.otpKeyForEmail(email);
    const ttl = Math.max(60, ttlMinutes * 60);
    const hmac = this.hmacOtp(code);
    return this.cacheService.setWithType('otp', key, { hmac }, ttl);
  }
  async getOtpForEmail(email) {
    if (!this.cacheService) return null;
    return this.cacheService.getWithType('otp', this.otpKeyForEmail(email));
  }
  async deleteOtpForEmail(email) {
    if (!this.cacheService) return true;
    return this.cacheService.deleteWithType('otp', this.otpKeyForEmail(email));
  }
  async incrementOtpAttempts(email) {
    if (!this.cacheService) return 1;
    return this.cacheService.increment(this.otpAttemptsKeyForEmail(email), 1, 600); // 10 min
  }
  async resetOtpAttempts(email) {
    if (!this.cacheService) return true;
    return this.cacheService.delete(this.otpAttemptsKeyForEmail(email));
  }

  async createAndStoreOtp(email) {
    const code = this.generateOtp();
    await this.setOtpForEmail(email, code);
    return code;
  }

  async verifyEmailByOtp(email, code) {
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
    if (!user) return { success: false, error: 'Utilisateur introuvable' };

    const attempts = await this.incrementOtpAttempts(email);
    if (attempts > this.otpAttemptsLimit) {
      return { success: false, error: 'Trop de tentatives, réessayez plus tard', type: 'OTP_RATE_LIMIT' };
    }
    const rec = await this.getOtpForEmail(email);
    if (!rec?.hmac) return { success: false, error: 'OTP invalide ou expiré', type: 'OTP_EXPIRED' };

    const computed = this.hmacOtp(code);
    const ok = crypto.timingSafeEqual(Buffer.from(rec.hmac), Buffer.from(computed));
    if (!ok) return { success: false, error: 'OTP incorrect', type: 'OTP_INVALID' };

    user.security = user.security || {};
    user.security.emailVerified = true;
    user.security.emailVerifiedAt = new Date();
    await user.save();
    await Promise.allSettled([this.deleteOtpForEmail(email), this.resetOtpAttempts(email)]);
    return { success: true, userId: user.id };
  }

  // =========================
  // IDENTIFIANT CLIENT
  // =========================
  generateClientIdentifier(req, deviceId) {
    try {
      const ip = (req?.ip || req?.headers?.['x-forwarded-for'] || '').toString();
      const ua = (req?.get ? req.get('User-Agent') : (req?.headers?.['user-agent'] || '')).toString();
      const did = (deviceId || '').toString();
      const lang = (req?.headers?.['accept-language'] || '').toString();
      const basis = JSON.stringify({
        ip: ip.substring(0, 64),
        ua: ua.substring(0, 256),
        did: did.substring(0, 128),
        lang: lang.substring(0, 64)
      });
      return crypto.createHash('sha256').update(basis).digest('hex').substring(0, 16);
    } catch {
      return crypto.randomBytes(8).toString('hex');
    }
  }

  getClientIdentifier(req, deviceId) {
    return this.generateClientIdentifier(req, deviceId);
  }

  // =========================
  // JWT / SESSIONS
  // =========================
  generateTokens(userId, userData = {}) {
    const now = Math.floor(Date.now() / 1000);
    const jti = crypto.randomBytes(16).toString('hex');
    const roles = userData.roles || [userData.role || 'user'];
    const scopes = Array.isArray(userData.scopes) ? userData.scopes : [];

    const baseHeader = {};
    if (this.kid && typeof this.kid === 'string' && this.kid.length > 0) {
      baseHeader.kid = this.kid;
    }
    const refreshHeader = {};
    if (this.refreshKid && typeof this.refreshKid === 'string' && this.refreshKid.length > 0) {
      refreshHeader.kid = this.refreshKid;
    }

    const signOptionsAccess = {
      expiresIn: this.jwtExpiresIn,
      algorithm: 'HS256',
      ...(Object.keys(baseHeader).length ? { header: baseHeader } : {})
    };
    const signOptionsRefresh = {
      expiresIn: this.refreshExpiresIn,
      algorithm: 'HS256',
      ...(Object.keys(refreshHeader).length ? { header: refreshHeader } : {})
    };

    const payload = {
      sub: userId,
      type: 'access',
      iat: now,
      iss: this.issuer,
      aud: this.audience,
      jti,
      roles,
      scopes,
      subscription: userData.subscription,
      status: userData.status
    };
    const accessToken = jwt.sign(payload, this.jwtAccessSecret, signOptionsAccess);

    const refreshPayload = {
      sub: userId,
      type: 'refresh',
      iat: now,
      iss: this.issuer,
      aud: this.audience,
      jti: crypto.randomBytes(16).toString('hex'),
      roles
    };
    const refreshToken = jwt.sign(refreshPayload, this.jwtRefreshSecret, signOptionsRefresh);

    return { accessToken, refreshToken };
  }

  // ✅ Création de session avec tokens assignés AVANT insertion
  async createSession(userId, deviceInfo, loginMethod = 'password', userData = {}) {
    try {
      console.log(`🔐 Création session pour utilisateur: ${userId}`);

      const { accessToken, refreshToken } = this.generateTokens(userId, userData);
      if (!accessToken || !refreshToken) throw new Error('Échec génération tokens JWT');

      console.log(`✅ Tokens générés - Access: ${accessToken.substring(0, 20)}...`);

      const tokenHash = crypto.createHash('sha256').update(accessToken).digest('hex');
      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      const days = Number(config.auth?.session?.days || 7);
      const expiresAt = new Date(Date.now() + days * 24 * 3600 * 1000);

      const sessionData = {
        userId,
        token: accessToken,
        refreshToken: refreshToken,
        tokenHash,
        refreshTokenHash,
        deviceInfo: {
          ...deviceInfo,
          fingerprint: this.generateDeviceFingerprint(deviceInfo)
        },
        loginMethod,
        expiresAt,
        isActive: true,
        activity: { lastActivity: new Date(), actionsCount: 1 }
      };

      console.log(`🔧 Données session préparées pour userId: ${userId}`);

      const session = new Session(sessionData);

      if (typeof this.analyzeSessionSecurity === 'function') {
        await this.analyzeSessionSecurity(session);
      }

      await session.save();
      console.log(`✅ Session sauvegardée: ${session._id}`);

      return {
        success: true,
        session: {
          _id: session._id,
          userId: session.userId,
          expiresAt: session.expiresAt,
          deviceInfo: session.deviceInfo,
          loginMethod: session.loginMethod,
          isActive: session.isActive
        },
        tokens: { accessToken, refreshToken }
      };
    } catch (error) {
      console.error('❌ Erreur createSession:', error);
      throw error;
    }
  }

  async validateAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtAccessSecret, { issuer: this.issuer, audience: this.audience });
      if (decoded.type !== 'access') {
        return { valid: false, error: { message: 'Type de token invalide', code: 'INVALID_TOKEN_TYPE', status: 401 } };
      }
      const session = { userId: decoded.sub, isValid: true, updateActivity: () => Promise.resolve() };
      return { valid: true, user: session.userId, session, decoded };
    } catch (error) {
      let code = 'TOKEN_INVALID'; let status = 401;
      if (error.name === 'TokenExpiredError') code = 'TOKEN_EXPIRED';
      else if (error.name === 'JsonWebTokenError') code = 'MALFORMED_TOKEN';
      return { valid: false, error: { message: error.message, code, status } };
    }
  }

  enrichUserContext(decoded, req) {
    const requestId = (req && (req.requestId || req.headers?.['x-request-id'])) || crypto.randomBytes(8).toString('hex');
    return {
      ...decoded,
      authMethod: 'jwt',
      authTimestamp: new Date().toISOString(),
      tokenIssuedAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : undefined,
      tokenExpiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : undefined,
      requestId,
      ipAddress: req?.ip,
      userAgent: req?.get ? req.get('User-Agent') : undefined
    };
  }

  generateDeviceFingerprint(deviceInfo = {}) {
    const payload = {
      userAgent: deviceInfo.userAgent || '',
      ip: deviceInfo.ip || '',
      platform: deviceInfo.platform || ''
    };
    return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex').substring(0, 16);
  }

  async analyzeSessionSecurity(session) {
    const flags = [];
    const existing = await Session.find({
      userId: session.userId,
      'deviceInfo.fingerprint': { $ne: session.deviceInfo.fingerprint },
      isActive: true
    });
    if (existing.length === 0) flags.push('new_device');

    if (session.deviceInfo.ip && (session.deviceInfo.ip.startsWith('10.') || session.deviceInfo.ip.includes('proxy'))) {
      flags.push('suspicious_ip');
    }

    if (session.deviceInfo.location) {
      const last = await Session.findOne({
        userId: session.userId,
        isActive: true,
        'deviceInfo.location': { $exists: true }
      }).sort({ createdAt: -1 });
      if (last && this.calculateDistance(session.deviceInfo.location, last.deviceInfo.location) > 1000) {
        flags.push('suspicious_location');
      }
    }

    session.security = session.security || {};
    session.security.flags = flags;
    if (session.calculateRiskScore) session.calculateRiskScore();
  }

  calculateDistance(pos1, pos2) {
    const R = 6371; // km
    const dLat = this.deg2rad((pos2.latitude || 0) - (pos1.latitude || 0));
    const dLon = this.deg2rad((pos2.longitude || 0) - (pos1.longitude || 0));
    const a = Math.sin(dLat/2)**2 + Math.cos(this.deg2rad(pos1.latitude || 0)) * Math.cos(this.deg2rad(pos2.latitude || 0)) * Math.sin(dLon/2)**2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  deg2rad(d) { 
    return d * (Math.PI / 180); 
  }

  generateApiKey() { 
    return crypto.randomBytes(32).toString('hex'); 
  }

  generateApiSecret() { 
    return crypto.randomBytes(64).toString('hex'); 
  }

  // ✅ Validation des mots de passe
  validatePasswordStrength(password) {
    const minLength = Number(config.auth?.password?.minLength || 8);
    const requireUpper = config.auth?.password?.requireUpper !== false;
    const requireLower = config.auth?.password?.requireLower !== false;
    const requireDigit = config.auth?.password?.requireDigit !== false;

    const requirements = [];
    if (!password || password.length < minLength) requirements.push(`Au moins ${minLength} caractères`);
    if (requireUpper && !/[A-Z]/.test(password)) requirements.push('Au moins une majuscule');
    if (requireLower && !/[a-z]/.test(password)) requirements.push('Au moins une minuscule');
    if (requireDigit && !/\d/.test(password)) requirements.push('Au moins un chiffre');

    return { valid: requirements.length === 0, requirements };
  }
}

// Instance de base exportée
const baseAuthService = new AuthService();

// =========================
// Extension: refresh/rotation, révocation, rate limiting, utilitaires
// =========================
class AuthServiceExt extends AuthService {
  constructor(base) {
    super();
    Object.assign(this, base);
  }

  async refreshTokens(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret, { issuer: this.issuer, audience: this.audience });
      if (decoded.type !== 'refresh') throw new Error('Type de token invalide');

      if (this.cacheService) {
        const usedKey = `rt:used:${decoded.jti}`;
        const used = await this.cacheService.getWithType('auth', usedKey);
        if (used) throw new Error('Refresh déjà utilisé');
        await this.cacheService.setWithType('auth', usedKey, true, 7 * 24 * 3600);
      }

      const user = await User.findById(decoded.sub);
      if (!user) throw new Error('Utilisateur introuvable');

      const userData = {
        roles: user.roles || [user.role],
        role: user.role,
        subscription: user.subscription,
        status: user.status
      };

      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(decoded.sub, userData);

      return { success: true, tokens: { accessToken, refreshToken: newRefreshToken }, user };
    } catch (error) {
      console.error('❌ Erreur refresh token:', error.message);
      return { success: false, error: error.message };
    }
  }

  async revokeSession(token, reason = 'user_logout', revokedBy = null) {
    try {
      let session = await Session.findOne({ token, isActive: true });

      if (!session) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        session = await Session.findOne({ tokenHash, isActive: true });
      }

      if (session) {
        if (typeof session.revoke === 'function') {
          await session.revoke(reason, revokedBy);
        } else {
          session.isActive = false;
          session.revokedAt = new Date();
          session.revokedBy = revokedBy;
          session.revokedReason = reason;
          await session.save();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur révocation session:', error);
      return false;
    }
  }

  async revokeAllUserSessions(userId, reason = 'security', excludeSessionId = null) {
    try {
      const filter = { userId, isActive: true };
      if (excludeSessionId) filter._id = { $ne: excludeSessionId };

      const result = await Session.updateMany(filter, {
        $set: { isActive: false, revokedAt: new Date(), revokedReason: reason }
      });

      console.log(`🔐 Sessions révoquées pour utilisateur ${userId}: ${result.modifiedCount}`);
      return result;
    } catch (error) {
      console.error('❌ Erreur révocation sessions:', error);
      throw error;
    }
  }

  async checkAuthRateLimit(identifier, action = 'auth') {
    const limit = this.authRateLimitMax;
    const window = this.authRateLimitWindow;
    if (this.cacheService?.checkRateLimit) {
      const res = await this.cacheService.checkRateLimit(identifier, action, limit, window);
      return res;
    }
    return { allowed: true, remaining: limit - 1, resetTime: window, current: 0, limit };
  }

  formatAuthError(type, message, details = {}, requestId = null) {
    return {
      error: message,
      type,
      timestamp: new Date().toISOString(),
      requestId: requestId || crypto.randomBytes(8).toString('hex'),
      ...(Object.keys(details).length > 0 && { details })
    };
  }

  async cleanupExpiredSessions() {
    try {
      const result = await Session.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { isActive: false }
        ]
      });
      console.log(`🧹 Nettoyage sessions: ${result.deletedCount} sessions supprimées`);
      return result;
    } catch (e) {
      console.error('❌ Erreur nettoyage sessions:', e);
      throw e;
    }
  }

  async getSessionStats() {
    try {
      const stats = await Session.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: 1 }, byLoginMethod: { $push: '$loginMethod' } } }
      ]);
      return stats || { total: 0, byLoginMethod: [] };
    } catch (e) {
      console.error('❌ Erreur stats sessions:', e);
      return null;
    }
  }

  async verifyEmailByToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtEmailSecret, { issuer: this.issuer, audience: this.audience });
      if (decoded.type !== 'email_verify' || !decoded.sub) {
        return { success: false, error: 'Type de token invalide' };
      }

      if (this.cacheService) {
        const usedKey = `email_token_used:${decoded.jti || ''}`;
        const used = await this.cacheService.getWithType('auth', usedKey);
        if (used) return { success: false, error: 'Lien déjà utilisé' };
        await this.cacheService.setWithType('auth', usedKey, true, 24 * 3600);
      }

      const user = await User.findById(decoded.sub);
      if (!user) return { success: false, error: 'Utilisateur introuvable' };

      user.security = user.security || {};
      if (user.security.emailVerified) {
        return { success: true, userId: user.id, alreadyVerified: true };
      }
      user.security.emailVerified = true;
      user.security.emailVerifiedAt = new Date();
      await user.save();

      return { success: true, userId: user.id };
    } catch (e) {
      return { success: false, error: e.message || 'Token invalide ou expiré' };
    }
  }

  createEmailVerificationLink(userId, email) {
    const now = Math.floor(Date.now() / 1000);
    const jti = crypto.randomBytes(16).toString('hex');
    const payload = {
      sub: userId,
      email: String(email || '').toLowerCase(),
      type: 'email_verify',
      iat: now,
      iss: this.issuer,
      aud: this.audience,
      jti
    };
    const ttl = config.auth?.emailVerifyTtl || process.env.EMAIL_VERIFY_TTL || '15m';
    const token = jwt.sign(payload, this.jwtEmailSecret, { algorithm: 'HS256', expiresIn: ttl });
    return token;
  }
}

// Export final: instance étendue
module.exports = new AuthServiceExt(baseAuthService);
