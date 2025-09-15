"use strict";

const express = require('express');
const router = express.Router();

// ✅ SERVICES BA7ATH OPTIMISÉS
const authService = require('../services/authService');
const rateLimitService = require('../services/rateLimitService');
const middlewareService = require('../services/middlewareService');
const cacheService = require('../services/cacheService');
const validationService = require('../services/validationService');

// Contrôleur
const authController = require('../controllers/authController');

// Middlewares
const { auth, optionalAuth } = require('../middleware/auth');

// ✅ OPTIMISATION: Validation Ba7ath (Joi schemas)
// Utiliser validationService au lieu de validateAuth legacy
const validateRegistration = validationService.validate('registration');
const validateLogin = validationService.validate('login');
const validateRefreshToken = validationService.validate('refreshToken');
const validatePasswordReset = validationService.validate('passwordReset');
const validatePasswordChange = validationService.validate('passwordChange');

// =====================================
// RATE LIMITING BA7ATH OPTIMISÉ
// =====================================

// ✅ OPTIMISATION: Services Ba7ath au lieu d'express-rate-limit
const registerLimiter = rateLimitService.register;           // 3/heure
const loginLimiter = rateLimitService.login;                 // 5/15min  
const resetPasswordLimiter = rateLimitService.passwordReset; // 3/heure
const refreshLimiter = rateLimitService.refresh;             // 10/heure

// =====================================
// ROUTES D'AUTHENTIFICATION OPTIMISÉES
// =====================================

/**
 * @route POST /api/auth/register
 * @desc Inscription optimisée avec détection sécurité
 */
router.post('/register', 
  registerLimiter, 
  validateRegistration, 
  middlewareService.asyncHandler(async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName, organization, acceptTerms } = req.body;
    
    // ✅ SÉCURITÉ: Vérifier si IP suspecte
    const clientId = authService.generateClientIdentifier(req);
    const rateLimitCheck = await authService.checkAuthRateLimit(clientId, 'register');
    
    if (!rateLimitCheck.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Trop de tentatives d\'inscription',
        type: 'RATE_LIMIT_EXCEEDED',
        retryAfter: rateLimitCheck.resetTime
      });
    }
    
    // ✅ OPTIMISATION: Validation force mot de passe
    const passwordStrength = authService.validatePasswordStrength(password);
    if (!passwordStrength.valid) {
      return res.status(400).json({
        success: false,
        error: 'Mot de passe trop faible',
        type: 'WEAK_PASSWORD',
        requirements: passwordStrength.requirements
      });
    }
    
    // Déléguer au contrôleur
    return await authController.register(req, res);
  })
);

/**
 * @route POST /api/auth/login
 * @desc Connexion optimisée avec détection brute force
 */
router.post('/login', 
  loginLimiter, 
  validateLogin, 
  middlewareService.asyncHandler(async (req, res) => {
    const { email, password, rememberMe } = req.body;
    
    // ✅ SÉCURITÉ: Détection brute force
    const bruteForceCheck = await authService.detectBruteForce(req.ip, email);
    if (bruteForceCheck.isSuspicious) {
      return res.status(429).json({
        success: false,
        error: 'Trop de tentatives de connexion',
        type: 'BRUTE_FORCE_DETECTED',
        blockedUntil: bruteForceCheck.blockUntil
      });
    }
    
    // ✅ OPTIMISATION: Cache utilisateur fréquent
    const userCacheKey = `frequent_user_${email}`;
    const cachedUser = await cacheService.getWithType('sessions', userCacheKey);
    
    if (cachedUser) {
      console.log(`🚀 Connexion optimisée pour utilisateur fréquent: ${email}`);
    }
    
    // Déléguer au contrôleur avec contexte enrichi
    req.securityContext = {
      clientId: authService.generateClientIdentifier(req),
      bruteForceCheck,
      frequentUser: !!cachedUser
    };
    
    return await authController.login(req, res);
  })
);

/**
 * @route POST /api/auth/refresh
 * @desc Rafraîchissement tokens optimisé
 */
router.post('/refresh', 
  refreshLimiter, 
  validateRefreshToken, 
  middlewareService.asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    
    // ✅ OPTIMISATION: Validation via authService Ba7ath
    const refreshResult = await authService.refreshTokens(refreshToken);
    
    if (!refreshResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Token de rafraîchissement invalide',
        type: 'INVALID_REFRESH_TOKEN'
      });
    }
    
    // ✅ OPTIMISATION: Cache session utilisateur
    await cacheService.cacheUserSession(
      refreshResult.user._id, 
      {
        userId: refreshResult.user._id,
        lastRefresh: new Date(),
        tokens: refreshResult.tokens
      },
      86400 // 24h
    );
    
    res.json({
      success: true,
      tokens: refreshResult.tokens,
      user: {
        id: refreshResult.user._id,
        email: refreshResult.user.email,
        roles: refreshResult.user.roles
      }
    });
  })
);

/**
 * @route POST /api/auth/logout
 * @desc Déconnexion optimisée avec nettoyage cache
 */
router.post('/logout', 
  optionalAuth, 
  middlewareService.asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      // ✅ OPTIMISATION: Révocation via authService
      const revoked = await authService.revokeSession(token, 'user_logout', req.user?.sub);
      
      // ✅ NETTOYAGE: Invalider cache utilisateur
      if (req.user?.sub) {
        await cacheService.invalidateUserSession(req.user.sub);
      }
      
      console.log(`🔐 Déconnexion réussie: ${req.user?.email || 'utilisateur'}`);
    }
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  })
);

/**
 * @route POST /api/auth/logout-all
 * @desc Déconnexion globale optimisée
 */
router.post('/logout-all', 
  auth, 
  middlewareService.asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    
    // ✅ OPTIMISATION: Révocation massive via authService
    const result = await authService.revokeAllUserSessions(userId, 'user_logout_all');
    
    // ✅ NETTOYAGE: Cache complet utilisateur
    await cacheService.deletePattern(`session:${userId}:*`);
    await cacheService.deletePattern(`analysis:${userId}:*`);
    
    res.json({
      success: true,
      message: 'Toutes les sessions ont été révoquées',
      revokedSessions: result.modifiedCount
    });
  })
);

/**
 * @route GET /api/auth/verify-email/:token
 * @desc Vérification email optimisée
 */
router.get('/verify-email/:token', 
  middlewareService.asyncHandler(async (req, res) => {
    const { token } = req.params;
    
    // ✅ CACHE: Vérification token rapide
    const verificationCacheKey = `email_verification_${token}`;
    const cachedVerification = await cacheService.getWithType('verification', verificationCacheKey);
    
    if (cachedVerification) {
      return res.json({
        success: true,
        message: 'Email déjà vérifié',
        cached: true
      });
    }
    
    return await authController.verifyEmail(req, res);
  })
);

/**
 * @route POST /api/auth/request-password-reset
 * @desc Demande reset password optimisée
 */
router.post('/request-password-reset', 
  resetPasswordLimiter, 
  middlewareService.asyncHandler(async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email requis',
        type: 'MISSING_EMAIL'
      });
    }
    
    // ✅ SÉCURITÉ: Limiter par email
    const emailLimitKey = `password_reset_${email}`;
    const emailRateLimit = await cacheService.increment(emailLimitKey, 1, 3600);
    
    if (emailRateLimit > 3) {
      return res.status(429).json({
        success: false,
        error: 'Trop de demandes pour cet email',
        type: 'EMAIL_RATE_LIMIT'
      });
    }
    
    return await authController.requestPasswordReset(req, res);
  })
);

/**
 * @route POST /api/auth/reset-password/:token
 * @desc Reset password optimisé
 */
router.post('/reset-password/:token', 
  validatePasswordReset, 
  middlewareService.asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    
    // ✅ VALIDATION: Force du nouveau mot de passe
    const passwordStrength = authService.validatePasswordStrength(password);
    if (!passwordStrength.valid) {
      return res.status(400).json({
        success: false,
        error: 'Nouveau mot de passe trop faible',
        type: 'WEAK_PASSWORD',
        requirements: passwordStrength.requirements
      });
    }
    
    return await authController.resetPassword(req, res);
  })
);

/**
 * @route GET /api/auth/profile
 * @desc Profil utilisateur avec cache
 */
router.get('/profile', 
  auth, 
  middlewareService.asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    
    // ✅ CACHE: Profil utilisateur (5 minutes)
    const profileCacheKey = `profile_${userId}`;
    const cachedProfile = await cacheService.getWithType('profiles', profileCacheKey);
    
    if (cachedProfile) {
      return res.json({
        success: true,
        user: cachedProfile,
        cached: true
      });
    }
    
    // Si pas en cache, récupérer et cacher
    const result = await authController.getProfile(req, res);
    
    if (result && result.user) {
      await cacheService.setWithType('profiles', profileCacheKey, result.user, 300);
    }
    
    return result;
  })
);

/**
 * @route POST /api/auth/change-password
 * @desc Changement mot de passe optimisé
 */
router.post('/change-password', 
  auth, 
  validatePasswordChange, 
  middlewareService.asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    // ✅ VALIDATION: Force du nouveau mot de passe
    const passwordStrength = authService.validatePasswordStrength(newPassword);
    if (!passwordStrength.valid) {
      return res.status(400).json({
        success: false,
        error: 'Nouveau mot de passe trop faible',
        type: 'WEAK_PASSWORD',
        requirements: passwordStrength.requirements
      });
    }
    
    // ✅ SÉCURITÉ: Invalider toutes les sessions après changement
    const result = await authController.changePassword(req, res);
    
    if (result && result.success) {
      // Invalider cache et sessions
      await cacheService.deletePattern(`session:${req.user.sub}:*`);
      await authService.revokeAllUserSessions(req.user.sub, 'password_changed');
    }
    
    return result;
  })
);

// =====================================
// ROUTES ADMINISTRATION & MONITORING
// =====================================

/**
 * @route GET /api/auth/sessions
 * @desc Sessions utilisateur actives
 */
router.get('/sessions', 
  auth, 
  middlewareService.asyncHandler(async (req, res) => {
    const userId = req.user.sub;
    
    // ✅ CACHE: Sessions actives (30 secondes)
    const sessionsCacheKey = `active_sessions_${userId}`;
    const cachedSessions = await cacheService.getWithType('sessions', sessionsCacheKey);
    
    if (cachedSessions) {
      return res.json({
        success: true,
        sessions: cachedSessions,
        cached: true
      });
    }
    
    try {
      const Session = require('../models/Session');
      const sessions = await Session.find({
        userId: userId,
        isActive: true
      })
      .sort({ createdAt: -1 })
      .select('createdAt activity.lastActivity deviceInfo security')
      .lean();
      
      const formattedSessions = sessions.map(session => ({
        id: session._id,
        createdAt: session.createdAt,
        lastActivity: session.activity?.lastActivity,
        deviceInfo: session.deviceInfo,
        riskScore: session.security?.riskScore || 0,
        flags: session.security?.flags || []
      }));
      
      // Cache pour 30 secondes
      await cacheService.setWithType('sessions', sessionsCacheKey, formattedSessions, 30);
      
      res.json({
        success: true,
        sessions: formattedSessions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erreur récupération sessions'
      });
    }
  })
);

/**
 * @route POST /api/auth/revoke-session/:sessionId
 * @desc Révoquer session spécifique
 */
router.post('/revoke-session/:sessionId', 
  auth, 
  middlewareService.asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const userId = req.user.sub;
    
    try {
      const Session = require('../models/Session');
      const session = await Session.findOne({
        _id: sessionId,
        userId: userId,
        isActive: true
      });
      
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session non trouvée'
        });
      }
      
      // Révoquer via authService
      await authService.revokeSession(session.token, 'user_revoke', userId);
      
      // Invalider cache sessions
      await cacheService.deleteWithType('sessions', `active_sessions_${userId}`);
      
      res.json({
        success: true,
        message: 'Session révoquée avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  })
);

// =====================================
// ROUTES DEBUG (DÉVELOPPEMENT)
// =====================================

if (process.env.NODE_ENV === 'development') {
  /**
   * @route GET /api/auth/debug/auth-stats
   * @desc Statistiques authentification (DEV)
   */
  router.get('/debug/auth-stats', 
    auth, 
    middlewareService.asyncHandler(async (req, res) => {
      const authStats = await authService.getSessionStats();
      const cacheStats = await cacheService.getStats();
      
      res.json({
        success: true,
        authStats,
        cacheStats,
        environment: 'development'
      });
    })
  );
  
  /**
   * @route POST /api/auth/debug/cleanup-sessions
   * @desc Nettoyage sessions expirées (DEV)
   */
  router.post('/debug/cleanup-sessions', 
    auth, 
    middlewareService.asyncHandler(async (req, res) => {
      const cleanupResult = await authService.cleanupExpiredSessions();
      
      res.json({
        success: true,
        message: 'Nettoyage effectué',
        cleaned: cleanupResult.deletedCount
      });
    })
  );
}

// =====================================
// GESTION D'ERREURS OPTIMISÉE BA7ATH
// =====================================

router.use(middlewareService.errorHandler());

module.exports = router;
