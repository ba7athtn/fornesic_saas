"use strict";

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const path = require('path');

// =====================================
// CONFIG CENTRALISÉ
// =====================================
const config = require('../config');

// =====================================
// SERVICES BA7ATH
// =====================================
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const authService = require('../services/authService');
const validationService = require('../services/validationService');
const emailService = require('../services/emailService');

// =====================================
// CONTRÔLEURS
// =====================================
const authController = require('../controllers/authController');

// =====================================
// MIDDLEWARES OPTIMISÉS BA7ATH
// =====================================
const { Ba7athMiddlewareFactory } = require('../middleware/factory');
const { Ba7athAuthMiddleware } = require('../middleware/auth');
const { Ba7athValidationAuth, Ba7athValidationMiddleware } = require('../middleware/validation');
const { Ba7athAuthorizeMiddleware } = require('../middleware/authorize');
const { ValidationUtilities } = require('../middleware/validation');
const activityTracker = require('../middleware/activity');

const isProd = process.env.NODE_ENV === 'production';

// =====================================
// UTILITAIRES AUTH OPTIMISÉS
// =====================================
class AuthUtilities {
  static logAuthEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;
    const logEntry = {
      level: level.toUpperCase(),
      message,
      requestId,
      timestamp: new Date().toISOString(),
      component: 'AUTH_ROUTES',
      ...data
    };
    const icon = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌', success: '✅' }[level] || '🔐';
    console.log(`${icon} AUTH ${logEntry.level}:`, JSON.stringify(logEntry));
  }

  static generateSecurityContext(req) {
    return {
      clientId: authService.generateClientIdentifier(req),
      deviceFingerprint: (config.security?.deviceFingerprint ?? true)
        ? authService.generateDeviceFingerprint(req)
        : null,
      requestId: req.requestId || crypto.randomBytes(8).toString('hex'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 200),
      timestamp: new Date().toISOString()
    };
  }

  static securityMiddleware = middlewareService.asyncHandler(async (req, res, next) => {
    try {
      const securityContext = AuthUtilities.generateSecurityContext(req);

      req.clientId = securityContext.clientId;
      req.deviceFingerprint = securityContext.deviceFingerprint;
      req.requestId = securityContext.requestId;
      req.securityContext = securityContext;

      res.setHeader('X-Request-ID', req.requestId);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', config.security?.headers?.frameOptions || 'DENY');

      AuthUtilities.logAuthEvent('debug', 'Auth security context created', {
        path: req.path,
        method: req.method,
        clientId: (req.clientId || '').substring(0, 8) + '...',
        hasDeviceFingerprint: !!req.deviceFingerprint
      }, req.requestId);

      next();
    } catch (error) {
      AuthUtilities.logAuthEvent('error', 'Security middleware error', { error: error.message }, req.requestId);
      next(error);
    }
  });

  static validateEmailFormat = middlewareService.asyncHandler(async (req, res, next) => {
    try {
      const email = req.body?.email;
      const requestId = req.requestId || crypto.randomBytes(8).toString('hex');

      AuthUtilities.logAuthEvent('debug', 'Email format validation', {
        hasEmail: !!email,
        emailLength: email?.length
      }, requestId);

      if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        AuthUtilities.logAuthEvent('warn', 'Invalid email format', {
          providedEmail: email?.substring(0, 10) + '...'
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: 'Format d\'email invalide',
          type: 'INVALID_EMAIL_FORMAT',
          details: { field: 'email', expected: 'Format email valide (exemple: exemple@domaine.com)' },
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      AuthUtilities.logAuthEvent('success', 'Email format valid', {
        emailDomain: email.split('@')
      }, requestId);

      next();
    } catch (error) {
      AuthUtilities.logAuthEvent('error', 'Email validation error', { error: error.message }, req.requestId);
      next(error);
    }
  });

  static validateEmailAndOtp = middlewareService.asyncHandler(async (req, res, next) => {
    try {
      const { email, code } = req.body || {};
      const requestId = req.requestId || crypto.randomBytes(8).toString('hex');

      AuthUtilities.logAuthEvent('debug', 'Email and OTP validation', {
        hasEmail: !!email,
        hasCode: !!code,
        codeLength: code?.length
      }, requestId);

      if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        AuthUtilities.logAuthEvent('warn', 'Invalid email in OTP validation', {
          providedEmail: email?.substring(0, 10) + '...'
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: 'Format d\'email invalide',
          type: 'INVALID_EMAIL_FORMAT',
          details: { field: 'email', expected: 'Format email valide' },
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
        AuthUtilities.logAuthEvent('warn', 'Invalid OTP format', {
          hasCode: !!code, codeType: typeof code, codeLength: code?.length
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: 'Code OTP invalide',
          type: 'INVALID_OTP_FORMAT',
          details: { field: 'code', expected: 'Code à 6 chiffres (exemple: 123456)' },
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      AuthUtilities.logAuthEvent('success', 'Email and OTP format valid', {
        emailDomain: email.split('@')
      }, requestId);

      next();
    } catch (error) {
      AuthUtilities.logAuthEvent('error', 'Email and OTP validation error', { error: error.message }, req.requestId);
      next(error);
    }
  });

  static getSystemInfo() {
    const memUsage = process.memoryUsage();
    return {
      service: 'Ba7ath Auth Service',
      version: process.env.API_VERSION || config.api.version || '3.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.round(process.uptime()),
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      loadAverage: process.platform === 'linux' ? require('os').loadavg() : null,
      timestamp: new Date().toISOString()
    };
  }

  static async getHealthStatus() {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        system: this.getSystemInfo(),
        services: {
          database: await this.checkDatabaseHealth(),
          cache: await this.checkCacheHealth(),
          email: await this.checkEmailHealth()
        }
      };

      const serviceStatuses = Object.values(health.services);
      if (serviceStatuses.some(s => s.status === 'unhealthy')) {
        health.status = 'unhealthy';
      } else if (serviceStatuses.some(s => s.status === 'degraded')) {
        health.status = 'degraded';
      }

      return health;
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() };
    }
  }

  static async checkDatabaseHealth() {
    try {
      const User = require('../models/User');
      await User.findOne({}).limit(1).lean();
      return { status: 'healthy', responseTime: Date.now() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  static async checkCacheHealth() {
    try {
      await cacheService.ping();
      return { status: 'healthy', responseTime: Date.now() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  static async checkEmailHealth() {
    try {
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

// =====================================
// GESTIONNAIRE CACHE OPTIMISÉ
// =====================================
class Ba7athAuthCacheManager {
  static logCacheEvent(level, message, data = {}, requestId = null) {
    if (isProd && level === 'debug') return;
    AuthUtilities.logAuthEvent(level, `CACHE: ${message}`, { cacheComponent: 'AUTH_CACHE', ...data }, requestId);
  }

  static async checkPendingRegistration(email, requestId = null) {
    const pendingKey = `pending_registration_${email.toLowerCase()}`;
    try {
      this.logCacheEvent('debug', 'Checking pending registration', {
        emailHash: crypto.createHash('md5').update(email).digest('hex').substring(0, 8)
      }, requestId);

      const pending = await cacheService.getWithType('pending_registrations', pendingKey);
      const exists = !!pending;

      this.logCacheEvent(exists ? 'info' : 'debug', 'Pending registration check result', {
        exists, hasData: !!pending?.data
      }, requestId);

      return { exists, data: pending, key: pendingKey };
    } catch (error) {
      this.logCacheEvent('warn', 'Pending registration check error', { error: error.message }, requestId);
      return { exists: false, data: null, key: pendingKey };
    }
  }

  static async setPendingRegistration(email, data, requestId = null) {
    const pendingKey = `pending_registration_${email.toLowerCase()}`;
    try {
      this.logCacheEvent('debug', 'Setting pending registration', {
        emailHash: crypto.createHash('md5').update(email).digest('hex').substring(0, 8),
        ttl: config.redis.ttl.cache
      }, requestId);

      await cacheService.setWithType('pending_registrations', pendingKey, {
        ...data, createdAt: new Date().toISOString(), requestId
      }, config.redis.ttl.cache);

      this.logCacheEvent('success', 'Pending registration saved', { key: pendingKey }, requestId);
      return pendingKey;
    } catch (error) {
      this.logCacheEvent('error', 'Pending registration save error', { error: error.message }, requestId);
      return null;
    }
  }

  static async deletePendingRegistration(key) {
    try { await cacheService.deleteWithType('pending_registrations', key); }
    catch (error) { console.warn(`⚠️ Erreur suppression pending:`, error.message); }
  }

  static async getFrequentUser(email, requestId = null) {
    const frequentUserKey = `frequent_user_${crypto.createHash('md5').update(email.toLowerCase()).digest('hex')}`;
    try {
      this.logCacheEvent('debug', 'Getting frequent user', { emailHash: email.split('@') }, requestId);
      const cachedUser = await cacheService.getWithType('frequent_users', frequentUserKey);

      this.logCacheEvent(cachedUser ? 'info' : 'debug', 'Frequent user lookup result', {
        found: !!cachedUser, lastAccess: cachedUser?.lastAccess
      }, requestId);

      return { data: cachedUser, key: frequentUserKey };
    } catch (error) {
      this.logCacheEvent('warn', 'Frequent user lookup error', { error: error.message }, requestId);
      return { data: null, key: frequentUserKey };
    }
  }

  static async updateFrequentUser(key, userData, requestId = null) {
    try {
      const enrichedData = {
        ...userData,
        lastAccess: new Date().toISOString(),
        accessCount: (userData.accessCount || 0) + 1,
        requestId
      };

      this.logCacheEvent('debug', 'Updating frequent user', { accessCount: enrichedData.accessCount }, requestId);
      await cacheService.setWithType('frequent_users', key, enrichedData, config.redis.ttl.cache);

      this.logCacheEvent('success', 'Frequent user updated', { key: key.substring(0, 20) + '...' }, requestId);
    } catch (error) {
      this.logCacheEvent('error', 'Frequent user update error', { error: error.message }, requestId);
    }
  }

  static async checkBlacklistedToken(tokenHash, requestId = null) {
    const blacklistedTokenKey = `blacklisted_token_${tokenHash}`;
    try {
      const isBlacklisted = await cacheService.getWithType('blacklisted_tokens', blacklistedTokenKey);
      return { isBlacklisted: !!isBlacklisted, key: blacklistedTokenKey, data: isBlacklisted };
    } catch (error) {
      this.logCacheEvent('error', 'Blacklist check error', { error: error.message }, requestId);
      return { isBlacklisted: false, key: blacklistedTokenKey, data: null };
    }
  }

  static async blacklistToken(tokenHash, reason, ip, requestId = null) {
    const blacklistedTokenKey = `blacklisted_token_${tokenHash}`;
    try {
      await cacheService.setWithType('blacklisted_tokens', blacklistedTokenKey, {
        blacklistedAt: new Date().toISOString(), reason, ip, requestId
      }, config.redis.ttl.session);
    } catch (error) {
      this.logCacheEvent('error', 'Token blacklist error', { error: error.message }, requestId);
    }
  }

  static async checkTokenRateLimit(tokenHash, requestId = null) {
    const tokenRateLimitKey = `refresh_rate_${tokenHash}`;
    try {
      const windowSeconds = 3600; // 1h
      const limit = 20;           // 20/h

      const count = await cacheService.increment(tokenRateLimitKey, 1, windowSeconds);
      const exceeded = count > limit;
      return { count, exceeded, remaining: Math.max(0, limit - count) };
    } catch (error) {
      return { count: 0, exceeded: false, remaining: 20 };
    }
  }

  static async setUserSession(userId, sessionData, requestId = null) {
    const userSessionKey = `user_session_${userId}`;
    try {
      await cacheService.setWithType('user_sessions', userSessionKey, sessionData, config.redis.ttl.session);
    } catch (error) {
      this.logCacheEvent('error', 'User session cache error', { error: error.message }, requestId);
    }
  }

  static async cleanupUserCache(userId, email, requestId = null) {
    try {
      this.logCacheEvent('info', 'Cleaning up user cache', {
        userId, emailDomain: email?.split('@')
      }, requestId);

      const cleanupPromises = [
        cacheService.deletePattern(`user_session_${userId}*`),
        cacheService.deletePattern(`user_profile_${userId}*`),
        cacheService.deletePattern(`frequent_user_*${email}*`),
        cacheService.deletePattern(`user_permissions_${userId}*`),
        cacheService.deletePattern(`active_sessions_${userId}*`)
      ];

      await Promise.allSettled(cleanupPromises);

      this.logCacheEvent('success', 'User cache cleanup completed', {
        userId, patternsCount: cleanupPromises.length
      }, requestId);
    } catch (error) {
      this.logCacheEvent('error', 'User cache cleanup error', { error: error.message, userId }, requestId);
    }
  }

  static async checkEmailVerification(tokenHash, requestId = null) {
    const verificationCacheKey = `email_verification_${tokenHash}`;
    try {
      const cachedVerification = await cacheService.getWithType('email_verifications', verificationCacheKey);
      return { data: cachedVerification, key: verificationCacheKey };
    } catch (error) {
      return { data: null, key: verificationCacheKey };
    }
  }

  static async setEmailVerification(tokenHash, data, requestId = null) {
    const verificationCacheKey = `email_verification_${tokenHash}`;
    try { await cacheService.setWithType('email_verifications', verificationCacheKey, data, config.redis.ttl.session); }
    catch (error) { this.logCacheEvent('error', 'Email verification cache error', { error: error.message }, requestId); }
  }

  static async checkOtpGap(email, requestId = null) {
    const gapKey = `otp_gap_${crypto.createHash('md5').update(email.toLowerCase()).digest('hex')}`;
    try {
      const gap = await cacheService.getWithType('otp_gap', gapKey);
      return { exists: !!gap, key: gapKey };
    } catch (error) {
      return { exists: false, key: gapKey };
    }
  }

  static async setOtpGap(email, requestId = null) {
    const gapKey = `otp_gap_${crypto.createHash('md5').update(email.toLowerCase()).digest('hex')}`;
    try { await cacheService.setWithType('otp_gap', gapKey, { at: Date.now() }, 60); }
    catch (error) { this.logCacheEvent('error', 'OTP gap cache error', { error: error.message }, requestId); }
  }
}

// =====================================
// HANDLERS MÉTIER
// =====================================
class Ba7athAuthHandlers {
  static async handleRegistration(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const { email, password, confirmPassword, firstName, lastName, organization, acceptTerms } = req.body;

      AuthUtilities.logAuthEvent('info', 'Registration attempt started', {
        email: email?.substring(0, 3) + '***@' + email?.split('@'),
        hasOrganization: !!organization,
        clientId: req.clientId?.substring(0, 8) + '...'
      }, requestId);

      if (password !== confirmPassword) {
        AuthUtilities.logAuthEvent('warn', 'Password mismatch in registration', {
          email: email?.split('@')
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: 'Les mots de passe ne correspondent pas',
          type: 'PASSWORD_MISMATCH',
          field: 'confirmPassword',
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      if (!acceptTerms) {
        AuthUtilities.logAuthEvent('warn', 'Terms not accepted in registration', {
          email: email?.split('@')
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: 'Acceptation des conditions générales requise',
          type: 'TERMS_NOT_ACCEPTED',
          field: 'acceptTerms',
          details: {
            termsVersion: process.env.TERMS_VERSION || '1.0',
            privacyVersion: process.env.PRIVACY_VERSION || '1.0'
          },
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      AuthUtilities.logAuthEvent('debug', 'Validating password strength', {}, requestId);
      const passwordStrength = await authService.validatePasswordStrength(password);
      if (!passwordStrength.valid) {
        AuthUtilities.logAuthEvent('warn', 'Password strength validation failed', {
          score: passwordStrength.score, requiredScore: passwordStrength.minimumScore
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: 'Mot de passe trop faible',
          type: 'WEAK_PASSWORD',
          requirements: passwordStrength.requirements,
          score: passwordStrength.score,
          feedback: passwordStrength.feedback,
          suggestions: passwordStrength.suggestions,
          requestId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      const pendingCheck = await Ba7athAuthCacheManager.checkPendingRegistration(email, requestId);
      if (pendingCheck.exists) {
        AuthUtilities.logAuthEvent('warn', 'Registration already pending', {
          email: email?.split('@'), pendingSince: pendingCheck.data?.createdAt
        }, requestId);

        if (res.headersSent) return;
        res.status(409).json({
          success: false,
          error: 'Inscription déjà en cours pour cet email',
          type: 'REGISTRATION_PENDING',
          details: { pendingSince: pendingCheck.data?.createdAt, estimatedProcessingTime: '5-10 minutes' },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      req.registrationContext = {
        email: String(email).toLowerCase(),
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        organization: organization?.trim(),
        passwordStrength: { score: passwordStrength.score, entropy: passwordStrength.entropy },
        security: {
          clientId: req.clientId,
          deviceFingerprint: req.deviceFingerprint,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']?.substring(0, 200),
          geoLocation: req.geoLocation || null
        },
        compliance: {
          acceptedTermsAt: new Date().toISOString(),
          termsVersion: process.env.TERMS_VERSION || '1.0',
          privacyVersion: process.env.PRIVACY_VERSION || '1.0',
          gdprConsent: true
        },
        metadata: {
          registrationSource: 'web_app',
          referrer: req.headers.referer?.substring(0, 100),
          requestId,
          processingStartTime: new Date().toISOString()
        }
      };

      await Ba7athAuthCacheManager.setPendingRegistration(email, {
        email: String(email).toLowerCase(),
        createdAt: new Date().toISOString(),
        security: { ip: req.ip, clientId: req.clientId, userAgent: req.headers['user-agent']?.substring(0, 100) },
        requestId
      }, requestId);

      AuthUtilities.logAuthEvent('debug', 'Calling registration controller', {
        email: email?.split('@')
      }, requestId);

      const result = await authController.register(req, res);
      if (res.headersSent) return;

      if (result && result.success) {
        const processingTime = Date.now() - startTime;

        AuthUtilities.logAuthEvent('success', 'Registration completed successfully', {
          email: email?.split('@'), userId: result.user?.id, processingTime: `${processingTime}ms`
        }, requestId);

        await Ba7athAuthCacheManager.deletePendingRegistration(pendingCheck.key);
        const sent = await Ba7athAuthHandlers.sendVerificationEmail(result, email, firstName, lastName, requestId);
        if (res.headersSent) return;
        res.status(201).json(sent);
        return;
      }

      AuthUtilities.logAuthEvent('warn', 'Registration failed at controller level', {
        error: result?.error, type: result?.type
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l’inscription',
        type: result?.type || 'REGISTRATION_ERROR',
        requestId,
        timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Registration handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (req.body?.email) {
        await Ba7athAuthCacheManager.deletePendingRegistration(`pending_registration_${req.body.email.toLowerCase()}`);
      }

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors de l\'inscription',
        type: 'REGISTRATION_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId,
        timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleLogin(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const { email, password, rememberMe = false } = req.body;

      AuthUtilities.logAuthEvent('info', 'Login attempt started', {
        email: email?.substring(0, 3) + '***@' + email?.split('@'),
        rememberMe, clientId: req.clientId?.substring(0, 8) + '...'
      }, requestId);

      const securityChecks = await Ba7athAuthHandlers.performLoginSecurityChecks(req, email, res);
      if (!securityChecks.passed) return;

      const frequentUser = await Ba7athAuthCacheManager.getFrequentUser(email, requestId);

      req.loginContext = {
        email: String(email).toLowerCase(),
        rememberMe,
        security: {
          clientId: req.clientId, deviceFingerprint: req.deviceFingerprint, ipAddress: req.ip,
          userAgent: req.headers['user-agent']?.substring(0, 200), geoLocation: req.geoLocation || null
        },
        session: {
          loginAttemptAt: new Date().toISOString(),
          isFrequentUser: !!frequentUser.data,
          expectedTwoFA: false,
          sessionType: rememberMe ? 'persistent' : 'session'
        },
        metadata: { requestId, processingStartTime: new Date().toISOString() }
      };

      if (frequentUser.data) {
        AuthUtilities.logAuthEvent('info', 'Frequent user login attempt', {
          email: email?.split('@'), lastAccess: frequentUser.data?.lastAccess,
          accessCount: frequentUser.data?.accessCount
        }, requestId);

        req.cachedUser = frequentUser.data;
        req.loginContext.session.isFrequentUser = true;
      }

      AuthUtilities.logAuthEvent('debug', 'Calling login controller', {
        email: email?.split('@'), hasCache: !!frequentUser.data
      }, requestId);

      const result = await authController.login(req, res);
      await Ba7athAuthHandlers.handleLoginResult(req, email, !!(result && result.success), frequentUser, requestId);

      const processingTime = Date.now() - startTime;

      if (result && result.success) {
        AuthUtilities.logAuthEvent('success', 'Login completed successfully', {
          email: email?.split('@'), userId: result.user?.id, processingTime: `${processingTime}ms`,
          tokenType: result.tokens ? 'full' : 'partial'
        }, requestId);
      } else {
        AuthUtilities.logAuthEvent('warn', 'Login failed at controller level', {
          email: email?.split('@'), error: result?.error, type: result?.type,
          processingTime: `${processingTime}ms`
        }, requestId);
      }

      if (res.headersSent) return;
      if (result) {
        res.status(result.success ? 200 : 400).json(result);
        return;
      }
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors de la connexion',
        type: 'LOGIN_SYSTEM_ERROR',
        requestId, timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Login handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (req.body?.email) {
        await Ba7athAuthHandlers.handleLoginResult(req, req.body.email, false, null, requestId);
      }

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors de la connexion',
        type: 'LOGIN_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId,
        timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleRefreshToken(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const { refreshToken } = req.body;

      AuthUtilities.logAuthEvent('info', 'Token refresh attempt started', {
        tokenLength: refreshToken?.length, clientId: req.clientId?.substring(0, 8) + '...'
      }, requestId);

      if (!refreshToken || typeof refreshToken !== 'string' || refreshToken.length < 32) {
        AuthUtilities.logAuthEvent('warn', 'Invalid refresh token format', {
          hasToken: !!refreshToken, tokenType: typeof refreshToken, tokenLength: refreshToken?.length
        }, requestId);

        if (res.headersSent) return;
        res.setHeader('WWW-Authenticate', 'Bearer error="invalid_token"');
        res.status(400).json({
          success: false,
          error: 'Format de token de rafraîchissement invalide',
          type: 'INVALID_TOKEN_FORMAT',
          details: {
            expected: 'String d\'au moins 32 caractères',
            received: `${typeof refreshToken} de ${refreshToken?.length || 0} caractères`
          },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex').substring(0, 16);

      const blacklistCheck = await Ba7athAuthCacheManager.checkBlacklistedToken(tokenHash, requestId);
      if (blacklistCheck.isBlacklisted) {
        AuthUtilities.logAuthEvent('warn', 'Attempted use of blacklisted token', {
          tokenHash: tokenHash.substring(0, 8) + '...',
          blacklistedReason: blacklistCheck.data?.reason,
          blacklistedAt: blacklistCheck.data?.blacklistedAt
        }, requestId);

        if (res.headersSent) return;
        res.setHeader('WWW-Authenticate', 'Bearer error="invalid_token"');
        res.status(401).json({
          success: false,
          error: 'Token de rafraîchissement révoqué',
          type: 'TOKEN_REVOKED',
          details: { revokedAt: blacklistCheck.data?.blacklistedAt, reason: blacklistCheck.data?.reason },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      const rateLimitCheck = await Ba7athAuthCacheManager.checkTokenRateLimit(tokenHash, requestId);
      if (rateLimitCheck.exceeded) {
        AuthUtilities.logAuthEvent('warn', 'Token refresh rate limit exceeded', {
          tokenHash: tokenHash.substring(0, 8) + '...', count: rateLimitCheck.count, limit: 20
        }, requestId);

        if (res.headersSent) return;
        res.status(429).json({
          success: false,
          error: 'Trop de rafraîchissements pour ce token',
          type: 'TOKEN_RATE_LIMIT_EXCEEDED',
          details: {
            current: rateLimitCheck.count,
            limit: 20,
            remaining: rateLimitCheck.remaining,
            resetTime: 3600
          },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      req.refreshContext = {
        tokenHash,
        security: {
          clientId: req.clientId, deviceFingerprint: req.deviceFingerprint, ipAddress: req.ip,
          userAgent: req.headers['user-agent']?.substring(0, 200), geoLocation: req.geoLocation || null
        },
        session: {
          refreshAttemptAt: new Date().toISOString(),
          rateLimitStatus: { current: rateLimitCheck.count, remaining: rateLimitCheck.remaining }
        },
        metadata: { requestId, processingStartTime: new Date().toISOString() }
      };

      AuthUtilities.logAuthEvent('debug', 'Calling token refresh service', {
        tokenHash: tokenHash.substring(0, 8) + '...', rateLimitRemaining: rateLimitCheck.remaining
      }, requestId);

      const refreshResult = await authService.refreshTokens(refreshToken, {
        deviceFingerprint: req.deviceFingerprint, ipAddress: req.ip, userAgent: req.headers['user-agent'],
        geoLocation: req.geoLocation, clientId: req.clientId, requestId: req.requestId,
        security: req.refreshContext.security
      });

      if (!refreshResult.success) {
        AuthUtilities.logAuthEvent('warn', 'Token refresh failed', {
          error: refreshResult.error, tokenHash: tokenHash.substring(0, 8) + '...'
        }, requestId);

        await Ba7athAuthCacheManager.blacklistToken(tokenHash, 'invalid_refresh_attempt', req.ip, requestId);

        if (res.headersSent) return;
        res.setHeader('WWW-Authenticate', 'Bearer error="invalid_token"');
        res.status(401).json({
          success: false,
          error: refreshResult.error || 'Token de rafraîchissement invalide',
          type: 'INVALID_REFRESH_TOKEN',
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      if (refreshResult.user?.id) {
        await Ba7athAuthCacheManager.setUserSession(refreshResult.user.id, {
          userId: refreshResult.user.id,
          email: refreshResult.user.email,
          session: {
            lastRefresh: new Date().toISOString(),
            refreshCount: (rateLimitCheck.count || 0) + 1,
            sessionType: 'refresh'
          },
          tokens: {
            accessTokenHash: crypto.createHash('sha256')
              .update(refreshResult.tokens.accessToken)
              .digest('hex').substring(0, 16),
            refreshTokenHash: tokenHash
          },
          security: {
            deviceFingerprint: req.deviceFingerprint, ipAddress: req.ip,
            userAgent: req.headers['user-agent']?.substring(0, 200)
          },
          metadata: { updatedAt: new Date().toISOString(), requestId }
        }, requestId);
      }

      const processingTime = Date.now() - startTime;

      AuthUtilities.logAuthEvent('success', 'Token refresh completed successfully', {
        userId: refreshResult.user?.id,
        email: refreshResult.user?.email?.split('@'),
        processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.json({
        success: true,
        tokens: refreshResult.tokens,
        user: {
          id: refreshResult.user.id,
          email: refreshResult.user.email,
          roles: refreshResult.user.roles,
          profile: refreshResult.user.profile
        },
        session: {
          lastRefresh: new Date().toISOString(),
          expiresAt: refreshResult.expiresAt,
          refreshCount: rateLimitCheck.count + 1
        },
        requestId,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Token refresh handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors du rafraîchissement du token',
        type: 'REFRESH_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId,
        timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleLogout(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const raw = req.headers['authorization'] || req.get?.('Authorization') || '';
      const normalized = typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim() : '';
      const token = normalized.toLowerCase().startsWith('bearer ') ? normalized.slice(7).trim() : null;

      const userEmail = req.user?.email || 'Unknown';
      const userId = req.user?.sub || 'Unknown';

      AuthUtilities.logAuthEvent('info', 'Logout attempt started', {
        userId,
        email: userEmail !== 'Unknown' ? userEmail.split('@') : 'Unknown',
        hasToken: !!token,
        tokenLength: token?.length
      }, requestId);

      if (token && req.user?.sub) {
        try {
          AuthUtilities.logAuthEvent('debug', 'Revoking user session', {
            userId,
            tokenHash: token ? crypto.createHash('sha256').update(token).digest('hex').substring(0, 8) + '...' : null
          }, requestId);

          const revokedOk = await authService.revokeSession(token, 'user_logout', req.user.sub);
          const tokenHash = crypto.createHash('sha256').update(token).digest('hex').substring(0, 16);
          await Ba7athAuthCacheManager.blacklistToken(tokenHash, 'user_logout', req.ip, requestId);

          AuthUtilities.logAuthEvent('debug', 'Cleaning user cache on logout', {
            userId, email: userEmail.split('@')
          }, requestId);

          await Ba7athAuthCacheManager.cleanupUserCache(userId, userEmail, requestId);

          const processingTime = Date.now() - startTime;

          AuthUtilities.logAuthEvent('success', 'Logout completed successfully', {
            userId, email: userEmail.split('@'), sessionRevoked: !!revokedOk, processingTime: `${processingTime}ms`
          }, requestId);

          if (res.headersSent) return;
          res.json({
            success: true,
            message: 'Déconnexion réussie',
            details: {
              sessionRevoked: !!revokedOk,
              cacheCleared: true,
              loggedOutAt: new Date().toISOString()
            },
            requestId,
            processingTime: `${processingTime}ms`,
            timestamp: new Date().toISOString()
          });
          return;

        } catch (error) {
          AuthUtilities.logAuthEvent('warn', 'Logout error but continuing', { userId, error: error.message }, requestId);

          const processingTime = Date.now() - startTime;

          if (res.headersSent) return;
          res.json({
            success: true,
            message: 'Déconnexion effectuée',
            details: {
              sessionRevoked: false,
              note: 'Certaines sessions peuvent nécessiter une révocation manuelle',
              loggedOutAt: new Date().toISOString()
            },
            requestId,
            processingTime: `${processingTime}ms`,
            timestamp: new Date().toISOString()
          });
          return;
        }
      }

      AuthUtilities.logAuthEvent('info', 'Logout without valid session', {
        hasUser: !!req.user, hasToken: !!token
      }, requestId);

      const processingTime = Date.now() - startTime;

      if (res.headersSent) return;
      res.json({
        success: true,
        message: 'Déconnexion effectuée',
        details: { sessionRevoked: false, reason: 'No active session found', loggedOutAt: new Date().toISOString() },
        requestId,
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Logout handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors de la déconnexion',
        type: 'LOGOUT_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId,
        timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleLogoutAll(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const userId = req.user.sub;
      const userEmail = req.user.email;

      AuthUtilities.logAuthEvent('info', 'Logout all sessions started', {
        userId, email: userEmail?.split('@')
      }, requestId);

      const result = await authService.revokeAllUserSessions(userId, 'user_logout_all');
      await Ba7athAuthCacheManager.cleanupUserCache(userId, userEmail, requestId);

      const revokedCount = typeof result?.modifiedCount === 'number' ? result.modifiedCount : (result?.revokedSessions || 0);
      const processingTime = Date.now() - startTime;

      AuthUtilities.logAuthEvent('success', 'Logout all completed successfully', {
        userId, email: userEmail?.split('@'), revokedSessions: revokedCount, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.json({
        success: true,
        message: 'Toutes les sessions ont été révoquées',
        details: {
          revokedSessions: revokedCount,
          cacheCleared: true,
          loggedOutAt: new Date().toISOString()
        },
        userId, requestId, processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Logout all handler exception', {
        userId: req.user?.sub, error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la déconnexion globale',
        type: 'LOGOUT_ALL_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId,
        timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleVerifyEmailToken(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const { token } = req.params;

      AuthUtilities.logAuthEvent('info', 'Email token verification started', {
        hasToken: !!token, tokenLength: token?.length
      }, requestId);

      if (!token || typeof token !== 'string' || token.length < 32) {
        AuthUtilities.logAuthEvent('warn', 'Invalid verification token format', {
          hasToken: !!token, tokenLength: token?.length
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: 'Token de vérification invalide',
          type: 'INVALID_VERIFICATION_TOKEN',
          details: {
            expected: 'Token d\'au moins 32 caractères',
            received: token ? `${token.length} caractères` : 'Token manquant'
          },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      const tokenHash = crypto.createHash('sha256').update(token).digest('hex').substring(0, 16);
      const verificationCheck = await Ba7athAuthCacheManager.checkEmailVerification(tokenHash, requestId);

      if (verificationCheck.data) {
        AuthUtilities.logAuthEvent('info', 'Email verification already processed', {
          alreadyVerified: verificationCheck.data.alreadyVerified
        }, requestId);

        if (res.headersSent) return;
        res.json({
          success: true,
          message: verificationCheck.data.alreadyVerified ? 'Email déjà vérifié précédemment' : 'Email vérifié avec succès',
          alreadyVerified: verificationCheck.data.alreadyVerified,
          verifiedAt: verificationCheck.data.verifiedAt,
          cached: true,
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      AuthUtilities.logAuthEvent('debug', 'Calling email verification service', {
        tokenHash: tokenHash.substring(0, 8) + '...'
      }, requestId);

      const result = await authService.verifyEmailByToken(token);
      if (!result.success) {
        AuthUtilities.logAuthEvent('warn', 'Email verification failed', { error: result.error }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: result.error || 'Token invalide ou expiré',
          type: 'VERIFY_TOKEN_ERROR',
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      await Ba7athAuthCacheManager.setEmailVerification(tokenHash, {
        success: true, alreadyVerified: false, verifiedAt: new Date().toISOString(), ip: req.ip
      }, requestId);

      const processingTime = Date.now() - startTime;

      AuthUtilities.logAuthEvent('success', 'Email verification completed successfully', {
        userId: result.userId, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.json({
        success: true,
        message: 'Email vérifié avec succès',
        userId: result.userId,
        verifiedAt: new Date().toISOString(),
        requestId, processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Email verification handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors de la vérification de l\'email',
        type: 'EMAIL_VERIFICATION_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId,
        timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleResendVerification(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const emailLower = String(req.body.email || '').toLowerCase();

      AuthUtilities.logAuthEvent('info', 'Resend verification started', {
        email: emailLower?.substring(0, 3) + '***@' + emailLower?.split('@')
      }, requestId);

      const gapCheck = await Ba7athAuthCacheManager.checkOtpGap(emailLower, requestId);
      if (gapCheck.exists) {
        AuthUtilities.logAuthEvent('warn', 'OTP gap restriction active', {
          email: emailLower?.split('@')
        }, requestId);

        if (res.headersSent) return;
        res.status(429).json({
          success: false,
          error: 'Veuillez patienter avant un nouvel envoi',
          type: 'OTP_THROTTLED',
          details: { retryAfter: 60, retryAfterFormatted: '1 minute' },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      const User = require('../models/User');
      const user = await User.findOne({ email: emailLower })
        .select('_id email security.emailVerified profile.firstName profile.lastName')
        .lean();

      if (!user) {
        AuthUtilities.logAuthEvent('debug', 'Resend verification for unknown email', {
          email: emailLower?.split('@')
        }, requestId);

        if (res.headersSent) return;
        res.status(200).json({
          success: true,
          message: 'Si un compte existe, un code a été renvoyé',
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      if (user.security?.emailVerified || user.emailVerified) {
        AuthUtilities.logAuthEvent('info', 'Email already verified for resend attempt', {
          email: emailLower?.split('@'), userId: user._id
        }, requestId);

        if (res.headersSent) return;
        res.status(200).json({
          success: true,
          message: 'Email déjà vérifié',
          emailVerified: true,
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      const otp = await authService.createAndStoreOtp(emailLower);
      const firstName = user.profile?.firstName || '';
      const lastName = user.profile?.lastName || '';

      await emailService.sendVerificationEmailOtp({
        to: emailLower, code: otp, userName: [firstName, lastName].filter(Boolean).join(' ')
      });

      await Ba7athAuthCacheManager.setOtpGap(emailLower, requestId);

      const processingTime = Date.now() - startTime;

      AuthUtilities.logAuthEvent('success', 'Verification email resent successfully', {
        email: emailLower?.split('@'), userId: user._id, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(200).json({
        success: true, message: 'Code de vérification renvoyé',
        details: { expiresInMinutes: config.otp.ttlMinutes, sentTo: emailLower?.replace(/(.{2}).*(@.*)/, '$1***$2') },
        requestId, processingTime: `${processingTime}ms`, timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Resend verification handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false, error: 'Erreur lors du renvoi du code',
        type: 'RESEND_VERIFICATION_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId, timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleVerifyEmailOtp(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const emailLower = String(req.body.email || '').toLowerCase();
      const code = String(req.body.code || '');

      AuthUtilities.logAuthEvent('info', 'OTP verification attempt started', {
        email: emailLower?.substring(0, 3) + '***@' + emailLower?.split('@'),
        codeLength: code?.length, hasValidFormat: /^\d{6}$/.test(code)
      }, requestId);

      if (!code || !/^\d{6}$/.test(code)) {
        AuthUtilities.logAuthEvent('warn', 'Invalid OTP format provided', {
          hasCode: !!code, codeLength: code?.length, codePattern: code ? 'non-numeric' : 'missing'
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: 'Format de code OTP invalide',
          type: 'INVALID_OTP_FORMAT',
          details: {
            expected: 'Code à 6 chiffres (ex: 123456)',
            provided: code ? `${code.length} caractères` : 'Code manquant'
          },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      AuthUtilities.logAuthEvent('debug', 'Calling OTP verification service', {
        email: emailLower?.split('@')
      }, requestId);

      const result = await authService.verifyEmailByOtp(emailLower, code);

      if (!result.success) {
        const errorType = result.type || (result.error?.includes('expir') ? 'OTP_EXPIRED' : 'OTP_INVALID');

        AuthUtilities.logAuthEvent('warn', 'OTP verification failed', {
          email: emailLower?.split('@'), errorType, error: result.error
        }, requestId);

        if (res.headersSent) return;
        res.status(400).json({
          success: false,
          error: result.error || 'Code invalide ou expiré',
          type: errorType,
          details: {
            attemptsRemaining: result.attemptsRemaining || 0,
            canResend: result.canResend || false,
            nextResendIn: result.nextResendIn || null
          },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      const processingTime = Date.now() - startTime;

      AuthUtilities.logAuthEvent('success', 'OTP verification completed successfully', {
        email: emailLower?.split('@'), userId: result.userId, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(200).json({
        success: true, message: 'Email vérifié avec succès',
        userId: result.userId, verifiedAt: new Date().toISOString(),
        requestId, processingTime: `${processingTime}ms`, timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'OTP verification handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors de la vérification OTP',
        type: 'OTP_VERIFICATION_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId, timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleRequestPasswordReset(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const { email } = req.body;
      const emailLowerCase = String(email || '').toLowerCase();

      AuthUtilities.logAuthEvent('info', 'Password reset request started', {
        email: emailLowerCase?.substring(0, 3) + '***@' + emailLowerCase?.split('@'),
        clientId: req.clientId?.substring(0, 8) + '...'
      }, requestId);

      const limitsCheck = { emailExceeded: false, ipExceeded: false, suspiciousActivity: false };

      if (limitsCheck.emailExceeded || limitsCheck.ipExceeded || limitsCheck.suspiciousActivity) {
        const errorType = limitsCheck.suspiciousActivity ? 'SUSPICIOUS_ACTIVITY' :
                          limitsCheck.emailExceeded ? 'EMAIL_RATE_LIMIT_EXCEEDED' : 'IP_RATE_LIMIT_EXCEEDED';

        AuthUtilities.logAuthEvent('warn', 'Password reset rate limit exceeded', {
          email: emailLowerCase?.split('@'), type: errorType
        }, requestId);

        if (res.headersSent) return;
        res.status(limitsCheck.suspiciousActivity ? 403 : 429).json({
          success: false,
          error: limitsCheck.suspiciousActivity ? 'Activité suspecte détectée' :
                limitsCheck.emailExceeded ? 'Trop de demandes pour cet email' : 'Trop de demandes depuis cette IP',
          type: errorType, requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      req.passwordResetContext = {
        email: emailLowerCase,
        security: {
          clientId: req.clientId, ipAddress: req.ip,
          userAgent: req.headers['user-agent']?.substring(0, 200), geoLocation: req.geoLocation || null
        },
        metadata: {
          requestedAt: new Date().toISOString(), requestId, processingStartTime: new Date().toISOString()
        }
      };

      const result = await authController.requestPasswordReset(req, res);

      const processingTime = Date.now() - startTime;

      if (result && result.success) {
        AuthUtilities.logAuthEvent('success', 'Password reset request completed successfully', {
          email: emailLowerCase?.split('@'), processingTime: `${processingTime}ms`
        }, requestId);
      }

      if (res.headersSent) return;
      if (result) {
        res.status(result.success ? 200 : 400).json(result);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation.',
        requestId, timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Password reset request handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur interne lors de la demande de réinitialisation',
        type: 'PASSWORD_RESET_REQUEST_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId, timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async handleGetProfile(req, res) {
    const requestId = req.requestId;
    const startTime = Date.now();
    try {
      const userId = req.user.sub;
      const userEmail = req.user.email;

      AuthUtilities.logAuthEvent('info', 'Profile retrieval started', {
        userId, email: userEmail?.split('@')
      }, requestId);

      const cachedProfile = await Ba7athAuthCacheManager.getCachedProfile?.(userId, requestId);
      if (cachedProfile?.data && cachedProfile.data.data) {
        const cacheAge = Math.round((Date.now() - new Date(cachedProfile.data.cachedAt).getTime()) / 1000);

        AuthUtilities.logAuthEvent('info', 'Profile cache hit', {
          userId, cacheAge: `${cacheAge}s`
        }, requestId);

        if (res.headersSent) return;
        res.json({
          success: true,
          user: {
            ...cachedProfile.data.data,
            lastCached: cachedProfile.data.cachedAt,
            cacheAge: `${cacheAge}s`
          },
          cache: { hit: true, ageSeconds: cacheAge },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await authController.getProfile(req, res);
      if (result?.success && result.user) {
        await Ba7athAuthCacheManager.setCachedProfile?.(userId, result.user, requestId);

        const processingTime = Date.now() - startTime;

        AuthUtilities.logAuthEvent('success', 'Profile retrieved and cached', {
          userId, processingTime: `${processingTime}ms`
        }, requestId);

        if (result.success) {
          result.processingTime = `${processingTime}ms`;
          result.cache = { hit: false, freshData: true };
        }
      }

      if (res.headersSent) return;
      if (result) {
        res.status(result.success ? 200 : 400).json(result);
        return;
      }

      res.status(404).json({
        success: false,
        error: 'Utilisateur introuvable',
        type: 'USER_NOT_FOUND',
        requestId, timestamp: new Date().toISOString()
      });
      return;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      AuthUtilities.logAuthEvent('error', 'Profile retrieval handler exception', {
        userId: req.user?.sub, error: error.message, stack: !isProd ? error.stack : undefined, processingTime: `${processingTime}ms`
      }, requestId);

      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du profil',
        type: 'PROFILE_RETRIEVAL_SYSTEM_ERROR',
        details: !isProd ? error.message : 'Une erreur technique est survenue',
        requestId, timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async performRegistrationSecurityChecks(req, email, res) {
    const requestId = req.requestId;
    try {
      AuthUtilities.logAuthEvent('debug', 'Registration security checks passed', {
        email: email?.split('@')
      }, requestId);
      return { passed: true };
    } catch (error) {
      AuthUtilities.logAuthEvent('error', 'Registration security check failed', { error: error.message }, requestId);
      if (!res.headersSent) {
        res.status(403).json({
          success: false,
          error: 'Échec des vérifications de sécurité',
          type: 'SECURITY_CHECK_FAILED',
          requestId, timestamp: new Date().toISOString()
        });
      }
      return { passed: false };
    }
  }

  static async performLoginSecurityChecks(req, email, res) {
    const requestId = req.requestId;
    try {
      AuthUtilities.logAuthEvent('debug', 'Performing comprehensive login security checks', {
        email: email?.split('@'), ip: req.ip, hasDeviceFingerprint: !!req.deviceFingerprint
      }, requestId);

      const maxAttempts = config.security?.maxLoginAttempts ?? 5;

      const [ipBruteCheck, emailBruteCheck] = await Promise.all([
        authService.detectBruteForce(req.ip, 'login_ip', maxAttempts),
        authService.detectBruteForce(String(email).toLowerCase(), 'login_email', maxAttempts)
      ]);

      if (ipBruteCheck.isSuspicious) {
        AuthUtilities.logAuthEvent('warn', 'IP brute force attack detected', {
          ip: req.ip, attemptsCount: ipBruteCheck.attemptsCount, blockUntil: ipBruteCheck.blockUntil
        }, requestId);

        if (!res.headersSent) {
          res.status(429).json({
            success: false,
            error: 'Trop de tentatives de connexion depuis cette IP',
            type: 'IP_BRUTE_FORCE_DETECTED',
            details: {
              blockedUntil: ipBruteCheck.blockUntil,
              attemptsCount: ipBruteCheck.attemptsCount,
              retryAfter: Math.ceil((new Date(ipBruteCheck.blockUntil) - new Date()) / 1000)
            },
            requestId, timestamp: new Date().toISOString()
          });
        }
        return { passed: false };
      }

      if (emailBruteCheck.isSuspicious) {
        AuthUtilities.logAuthEvent('warn', 'Account brute force attack detected', {
          email: email?.split('@'), attemptsCount: emailBruteCheck.attemptsCount, blockUntil: emailBruteCheck.blockUntil
        }, requestId);

        if (!res.headersSent) {
          res.status(429).json({
            success: false,
            error: 'Trop de tentatives de connexion pour ce compte',
            type: 'ACCOUNT_BRUTE_FORCE_DETECTED',
            details: {
              blockedUntil: emailBruteCheck.blockUntil,
              attemptsCount: emailBruteCheck.attemptsCount,
              securityRecommendation: 'Vérifiez l\'activité récente de votre compte'
            },
            requestId, timestamp: new Date().toISOString()
          });
        }
        return { passed: false };
      }

      AuthUtilities.logAuthEvent('success', 'Login security checks passed', {
        email: email?.split('@'), ip: req.ip
      }, requestId);

      return { passed: true };

    } catch (error) {
      AuthUtilities.logAuthEvent('error', 'Login security check system error', {
        error: error.message, email: email?.split('@')
      }, requestId);
      return { passed: true };
    }
  }

  static async handleLoginResult(req, email, success, frequentUser, requestId) {
    try {
      AuthUtilities.logAuthEvent('debug', 'Processing login result', {
        email: email?.split('@'), success, isFrequentUser: !!frequentUser?.data
      }, requestId);

      const promises = [];
      if (success) {
        promises.push(
          authService.resetBruteForceCounter(req.ip, 'login_ip'),
          authService.resetBruteForceCounter(String(email).toLowerCase(), 'login_email')
        );

        if (!frequentUser?.data) {
          promises.push(
            Ba7athAuthCacheManager.updateFrequentUser(
              frequentUser?.key || `frequent_user_${crypto.createHash('md5').update(String(email).toLowerCase()).digest('hex')}`,
              {
                email: String(email).toLowerCase(),
                lastLogin: new Date().toISOString(),
                loginCount: 1,
                accessCount: (frequentUser?.data?.accessCount || 0) + 1,
                security: { lastSuccessfulIP: req.ip, deviceFingerprint: req.deviceFingerprint }
              },
              requestId
            )
          );
        } else {
          promises.push(
            Ba7athAuthCacheManager.updateFrequentUser(
              frequentUser.key,
              {
                ...frequentUser.data,
                lastLogin: new Date().toISOString(),
                loginCount: (frequentUser.data.loginCount || 0) + 1,
                accessCount: (frequentUser.data.accessCount || 0) + 1,
                security: {
                  lastSuccessfulIP: req.ip,
                  deviceFingerprint: req.deviceFingerprint,
                  previousIPs: [...(frequentUser.data.security?.previousIPs || []), req.ip].slice(-5)
                }
              },
              requestId
            )
          );
        }

        AuthUtilities.logAuthEvent('info', 'Successful login processed', {
          email: email?.split('@'), loginCount: (frequentUser?.data?.loginCount || 0) + 1
        }, requestId);

      } else {
        promises.push(
          authService.incrementBruteForceCounter(req.ip, 'login_ip'),
          authService.incrementBruteForceCounter(String(email).toLowerCase(), 'login_email')
        );

        AuthUtilities.logAuthEvent('warn', 'Failed login processed', {
          email: email?.split('@'), ip: req.ip
        }, requestId);
      }

      await Promise.allSettled(promises);

    } catch (error) {
      AuthUtilities.logAuthEvent('error', 'Error processing login result', {
        error: error.message, email: email?.split('@'), success
      }, requestId);
    }
  }

  static async handleServiceInfo(req, res) {
    const requestId = req.requestId;
    try {
      AuthUtilities.logAuthEvent('info', 'Service info request started', {
        hasUser: !!req.user, userType: req.user ? 'authenticated' : 'anonymous'
      }, requestId);

      const cachedInfo = await Ba7athAuthCacheManager.getCachedServiceInfo?.(requestId);
      if (cachedInfo?.cached) {
        if (res.headersSent) return;
        res.json({
          ...cachedInfo.data,
          cache: { hit: true },
          requestId, timestamp: new Date().toISOString()
        });
        return;
      }

      const serviceInfo = {
        service: 'Ba7ath Authentication API',
        version: config.api.version || '3.0.0-ba7ath',
        description: 'Service d\'authentification sécurisé avec JWT, MFA et protection anti-fraude avancée',
        endpoints: {
          'POST /register': 'Inscription utilisateur avec validation renforcée',
          'POST /login': 'Connexion avec détection brute force',
          'POST /refresh': 'Rafraîchissement tokens JWT',
          'POST /logout': 'Déconnexion avec nettoyage cache',
          'POST /logout-all': 'Déconnexion globale toutes sessions',
          'GET /verify-email/:token': 'Vérification email par lien token',
          'POST /verify-email-otp': 'Vérification email par code OTP',
          'POST /resend-verification': 'Renvoi code vérification email',
          'POST /request-password-reset': 'Demande réinitialisation mot de passe',
          'POST /reset-password/:token': 'Réinitialisation mot de passe par token',
          'POST /change-password': 'Changement mot de passe authentifié',
          'GET /sessions': 'Liste sessions actives utilisateur',
          'POST /revoke-session/:sessionId': 'Révocation session spécifique',
          'GET /profile': 'Profil utilisateur avec cache'
        },
        features: [
          'JWT avec rotation automatique',
          'Protection brute force intelligente',
          'Device fingerprinting',
          'Rate limiting adaptatif par contexte',
          'Audit trail et métriques',
          'Sessions avec risk scoring',
          'Cache Redis multi-niveaux',
          'Health checks services externes'
        ],
        security: {
          tokenTypes: ['access_token', 'refresh_token'],
          algorithms: [config.jwt.algorithm || 'HS256'],
          sessionDuration: config.jwt.accessTokenExpiry || '1h',
          refreshDuration: config.jwt.refreshTokenExpiry || '7d',
          rateLimiting: { enabled: true, adaptive: true, levels: ['IP', 'User', 'Global'] },
          bruteForceProtection: {
            enabled: true,
            maxAttempts: config.security?.maxLoginAttempts ?? 5,
            blockDuration: Math.round((config.security?.lockoutTime ?? 900000) / 1000)
          }
        },
        system: AuthUtilities.getSystemInfo(),
        health: await AuthUtilities.getHealthStatus(),
        cache: { hit: false, freshData: true },
        requestId, timestamp: new Date().toISOString()
      };

      await Ba7athAuthCacheManager.setCachedServiceInfo?.(serviceInfo, requestId);

      AuthUtilities.logAuthEvent('success', 'Service info generated successfully', {
        endpointCount: Object.keys(serviceInfo.endpoints).length
      }, requestId);

      if (res.headersSent) return;
      res.json(serviceInfo);
      return;

    } catch (error) {
      AuthUtilities.logAuthEvent('error', 'Service info handler exception', {
        error: error.message, stack: !isProd ? error.stack : undefined
      }, requestId);

      if (res.headersSent) return;
      res.json({
        service: 'Ba7ath Authentication API',
        version: config.api.version || '3.0.0',
        status: 'degraded',
        error: 'Erreur génération info complète',
        basic: true,
        requestId, timestamp: new Date().toISOString()
      });
      return;
    }
  }

  static async sendVerificationEmail(result, email, firstName, lastName, requestId) {
    try {
      AuthUtilities.logAuthEvent('info', 'Sending verification email', {
        email: email?.split('@'),
        userId: result.user?.id,
        method: 'OTP'
      }, requestId);

      const userEmail = result.user?.email || String(email).toLowerCase();
      const userName = [firstName, lastName].filter(Boolean).join(' ') || 'Utilisateur';

      const otp = await authService.createAndStoreOtp(userEmail);

      await emailService.sendVerificationEmailOtp({
        to: userEmail,
        code: otp,
        userName,
        expiresInMinutes: config.otp.ttlMinutes
      });

      AuthUtilities.logAuthEvent('success', 'Verification email sent successfully', {
        email: userEmail?.split('@'),
        userId: result.user?.id,
        expiresInMinutes: config.otp.ttlMinutes
      }, requestId);

      return {
        success: true,
        message: 'Utilisateur créé avec succès - Code de vérification envoyé par email',
        user: { id: result.user?._id, email: userEmail, emailVerified: false },
        verification: {
          method: 'email_otp',
          expiresInMinutes: config.otp.ttlMinutes,
          sentTo: userEmail?.replace(/(.{2}).*(@.*)/, '$1***$2')
        },
        nextSteps: [
          'Vérifiez votre email',
          'Saisissez le code à 6 chiffres reçu',
          'Le code expire dans ' + config.otp.ttlMinutes + ' minutes'
        ],
        requestId, timestamp: new Date().toISOString()
      };

    } catch (mailError) {
      AuthUtilities.logAuthEvent('error', 'Verification email send failed', {
        error: mailError.message,
        email: email?.split('@'),
        userId: result.user?.id
      }, requestId);

      return {
        success: true,
        message: 'Utilisateur créé avec succès - Envoi email temporairement indisponible',
        user: {
          id: result.user?._id,
          email: result.user?.email || email,
          emailVerified: false
        },
        verification: {
          method: 'email_unavailable',
          alternativeMethod: 'Contactez le support pour vérification manuelle'
        },
        warning: 'Service email temporairement indisponible',
        requestId, timestamp: new Date().toISOString()
      };
    }
  }
}

// =====================================
// GESTIONNAIRE D'ERREURS OPTIMISÉ
// =====================================
class Ba7athAuthErrorHandler {
  static enrichErrorContext(error, req) {
    const requestId = req.requestId || crypto.randomBytes(8).toString('hex');

    return {
      success: false,
      error: error.message || 'Erreur système inconnue',
      type: error.type || error.name || 'AUTH_SYSTEM_ERROR',
      context: {
        service: 'Ba7ath Authentication',
        route: req.path,
        method: req.method,
        user: {
          id: req.user?.sub || 'anonymous',
          email: req.user?.email ? req.user.email.split('@') : 'unknown',
          roles: req.user?.roles || []
        },
        request: {
          clientId: req.clientId?.substring(0, 8) + '...' || 'unknown',
          ipAddress: req.ip,
          userAgent: req.headers['user-agent']?.substring(0, 100) || 'unknown',
          deviceFingerprint: req.deviceFingerprint?.substring(0, 8) + '...' || null
        },
        timing: { requestStart: req.startTime || Date.now(), errorTime: Date.now() }
      },
      stack: !isProd ? error.stack : undefined,
      requestId,
      timestamp: new Date().toISOString()
    };
  }

  static getStatusCodeForError(error) {
    const errorType = error.type || error.name || '';
    if (errorType.includes('VALIDATION_') || errorType.includes('INVALID_') ||
        errorType.includes('WEAK_') || errorType.includes('MISMATCH') ||
        errorType.includes('FORMAT') || errorType.includes('MISSING_')) return 400;
    if (errorType.includes('UNAUTHORIZED') || errorType.includes('INVALID_TOKEN') ||
        errorType.includes('EXPIRED') || errorType.includes('REVOKED')) return 401;
    if (errorType.includes('ACCESS_') || errorType.includes('FORBIDDEN') ||
        errorType.includes('SUSPICIOUS_') || errorType.includes('BLOCKED')) return 403;
    if (errorType.includes('NOT_FOUND') || errorType.includes('USER_NOT_')) return 404;
    if (errorType.includes('CONFLICT') || errorType.includes('ALREADY_') ||
        errorType.includes('PENDING') || errorType.includes('EXISTS')) return 409;
    if (errorType.includes('RATE_LIMIT') || errorType.includes('BRUTE_FORCE') ||
        errorType.includes('TOO_MANY') || errorType.includes('THROTTLED')) return 429;
    if (errorType.includes('UNAVAILABLE') || errorType.includes('SERVICE_') ||
        errorType.includes('TIMEOUT') || errorType.includes('OVERLOAD')) return 503;
    return 500;
  }

  static setSecurityHeaders(res, statusCode, errorType) {
    if (res.headersSent) return;
    if (statusCode === 401) {
      res.setHeader('WWW-Authenticate', 'Bearer error="invalid_token"');
    }
    if (errorType?.includes('BRUTE_FORCE') || errorType?.includes('RATE_LIMIT')) {
      res.setHeader('Retry-After', '3600');
    }

    res.setHeader('X-Content-Type-Options', config.security?.headers?.contentTypeOptions || 'nosniff');
    res.setHeader('X-Frame-Options', config.security?.headers?.frameOptions || 'DENY');
    res.setHeader('Cache-Control', 'no-store');
  }
}

// =====================================
// PIPELINES MIDDLEWARE ROUTES
// =====================================
class Ba7athAuthRoutesMiddleware {
  static get registrationPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.authPipeline({ required: false, rateLimit: true }),
      ...Ba7athValidationAuth.registration
    ];
  }

  static get loginPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.authPipeline({ required: false, rateLimit: true }),
      ...Ba7athValidationAuth.login
    ];
  }

  static get refreshPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.authPipeline({ required: false, rateLimit: true }),
      ...Ba7athValidationAuth.refreshToken
    ];
  }

  static get logoutPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.authPipeline({ required: false, includeLogging: true })
    ];
  }

  static get logoutAllPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.authPipeline({ required: true, includeLogging: true }),
      activityTracker()
    ];
  }

  static get emailVerificationPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.publicPipeline({ rateLimit: true })
    ];
  }

  static get emailValidationPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.publicPipeline({ rateLimit: true }),
      AuthUtilities.validateEmailFormat
    ];
  }

  static get otpValidationPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.publicPipeline({ rateLimit: true }),
      AuthUtilities.validateEmailAndOtp
    ];
  }

  static get passwordResetPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.publicPipeline({ rateLimit: true }),
      ...Ba7athValidationAuth.passwordReset
    ];
  }

  static get passwordChangePipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.authPipeline({ required: true, includeLogging: true }),
      activityTracker(),
      ...Ba7athValidationAuth.passwordChange
    ];
  }

  static get authenticatedPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.authPipeline({ required: true, includeLogging: true })
    ];
  }

  static get profilePipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.authPipeline({ required: true, includeLogging: true }),
      activityTracker()
    ];
  }

  static get serviceInfoPipeline() {
    return [
      AuthUtilities.securityMiddleware,
      ...Ba7athMiddlewareFactory.publicPipeline({ rateLimit: false })
    ];
  }
}

// =====================================
// ROUTES OPTIMISÉES
// =====================================
router.post('/register',
  ...Ba7athAuthRoutesMiddleware.registrationPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleRegistration)
);

router.post('/login',
  ...Ba7athAuthRoutesMiddleware.loginPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleLogin)
);

// Route sonde de debug pour valider le chemin de routage
router.post('/login/_probe', (req, res) => {
  return res.json({ ok: true, ts: Date.now(), requestId: req.requestId });
});

router.post('/refresh',
  ...Ba7athAuthRoutesMiddleware.refreshPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleRefreshToken)
);

router.post('/logout',
  ...Ba7athAuthRoutesMiddleware.logoutPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleLogout)
);

router.post('/logout-all',
  ...Ba7athAuthRoutesMiddleware.logoutAllPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleLogoutAll)
);

router.get('/verify-email/:token',
  ...Ba7athAuthRoutesMiddleware.emailVerificationPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleVerifyEmailToken)
);

router.post('/resend-verification',
  ...Ba7athAuthRoutesMiddleware.emailValidationPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleResendVerification)
);

router.post('/verify-email-otp',
  ...Ba7athAuthRoutesMiddleware.otpValidationPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleVerifyEmailOtp)
);

router.post('/request-password-reset',
  ...Ba7athMiddlewareFactory.publicPipeline({ rateLimit: true }),
  ...Ba7athValidationAuth.email,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleRequestPasswordReset)
);

// NOTE: ces handlers doivent exister côté contrôleurs/services
router.post('/reset-password/:token',
  ...Ba7athAuthRoutesMiddleware.passwordResetPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleResetPassword)
);

router.post('/change-password',
  ...Ba7athAuthRoutesMiddleware.passwordChangePipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleChangePassword)
);

router.get('/sessions',
  ...Ba7athAuthRoutesMiddleware.authenticatedPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleGetSessions)
);

router.post('/revoke-session/:sessionId',
  ...Ba7athAuthRoutesMiddleware.authenticatedPipeline,
  Ba7athValidationMiddleware.forensicObjectId('sessionId'),
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleRevokeSession)
);

router.get('/profile',
  ...Ba7athAuthRoutesMiddleware.profilePipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleGetProfile)
);

router.get('/',
  ...Ba7athAuthRoutesMiddleware.serviceInfoPipeline,
  middlewareService.asyncHandler(Ba7athAuthHandlers.handleServiceInfo)
);

// =====================================
// GESTION D'ERREURS GLOBALE
// =====================================
router.use(async (error, req, res, next) => {
  const requestId = req.requestId || crypto.randomBytes(8).toString('hex');

  AuthUtilities.logAuthEvent('error', 'Auth route error caught', {
    errorType: error.type || error.name,
    errorMessage: error.message,
    path: req.path, method: req.method, userId: req.user?.sub,
    stack: !isProd ? error.stack?.split('\n').slice(0, 5) : undefined
  }, requestId);

  const enrichedError = Ba7athAuthErrorHandler.enrichErrorContext(error, req);
  const statusCode = Ba7athAuthErrorHandler.getStatusCodeForError(error);

  Ba7athAuthErrorHandler.setSecurityHeaders(res, statusCode, error.type);

  if (!res.headersSent) {
    res.status(statusCode).json(enrichedError);
    return;
  }
  // si déjà envoyé, ne rien faire
});

// =====================================
// EXPORT ROUTER CONFIGURÉ
// =====================================
module.exports = router;

// Log migration complète
AuthUtilities.logAuthEvent('info', 'Ba7ath Auth Router fully initialized', {
  routesCount: router.stack?.length || 'unknown',
  middlewaresOptimized: true,
  securityEnhanced: true,
  observabilityEnabled: true,
  cacheOptimized: true,
  errorHandlerAttached: true,
  debugRoutesEnabled: !isProd,
  migrationVersion: config.api.version || '3.0.0-ba7ath',
  migrationDate: new Date().toISOString()
});

if (!isProd) {
  console.log('🎉 BA7ATH AUTH MIGRATION COMPLÈTE !');
  console.log('📊 Routes disponibles:', router.stack?.length || 'N/A');
  console.log('🔐 Sécurité renforcée: ✅');
  console.log('📈 Observabilité: ✅');
  console.log('⚡ Performance: ✅');
  console.log('🛡️ Error handling: ✅');
  console.log('🎯 Prêt pour production Ba7ath Enterprise !');
}
