const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { auth, optionalAuth } = require('../middleware/auth');
const { validateAuth } = require('../middleware/validation');

// =====================================
// RATE LIMITING SPÉCIALISÉ
// =====================================

// Rate limiting pour inscription
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 inscriptions par heure par IP
  message: {
    success: false,
    error: 'Trop de tentatives d\'inscription. Réessayez plus tard.',
    type: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting pour connexion
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives de connexion par IP
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Réessayez plus tard.',
    type: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting pour reset password
const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 demandes par heure par IP
  message: {
    success: false,
    error: 'Trop de demandes de réinitialisation. Réessayez plus tard.',
    type: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// =====================================
// ROUTES D'AUTHENTIFICATION
// =====================================

/**
 * @route POST /api/auth/register
 * @desc Inscription d'un nouvel utilisateur
 * @access Public
 * @body {string} email - Email de l'utilisateur
 * @body {string} password - Mot de passe (min 8 caractères)
 * @body {string} confirmPassword - Confirmation du mot de passe
 * @body {string} firstName - Prénom
 * @body {string} lastName - Nom
 * @body {string} [organization] - Organisation (optionnel)
 * @body {boolean} acceptTerms - Acceptation des conditions
 */
router.post('/register',
  registerLimiter,
  validateAuth.registration,
  authController.register
);

/**
 * @route POST /api/auth/login
 * @desc Connexion utilisateur
 * @access Public
 * @body {string} email - Email de l'utilisateur
 * @body {string} password - Mot de passe
 * @body {boolean} [rememberMe] - Se souvenir de moi (optionnel)
 */
router.post('/login',
  loginLimiter,
  validateAuth.login,
  authController.login
);

/**
 * @route POST /api/auth/refresh
 * @desc Rafraîchir les tokens d'accès
 * @access Public
 * @body {string} refreshToken - Token de rafraîchissement
 */
router.post('/refresh',
  validateAuth.refreshToken,
  authController.refreshToken
);

/**
 * @route POST /api/auth/logout
 * @desc Déconnexion (révoque la session actuelle)
 * @access Private
 * @header {string} Authorization - Bearer token
 */
router.post('/logout',
  optionalAuth, // Optionnel car le token peut être déjà expiré
  authController.logout
);

/**
 * @route POST /api/auth/logout-all
 * @desc Déconnexion de toutes les sessions
 * @access Private
 * @header {string} Authorization - Bearer token
 */
router.post('/logout-all',
  auth,
  authController.logoutAll
);

/**
 * @route GET /api/auth/verify-email/:token
 * @desc Vérification de l'email avec token
 * @access Public
 * @param {string} token - Token de vérification
 */
router.get('/verify-email/:token',
  validateAuth.verificationToken,
  authController.verifyEmail
);

/**
 * @route POST /api/auth/request-password-reset
 * @desc Demande de réinitialisation de mot de passe
 * @access Public
 * @body {string} email - Email de l'utilisateur
 */
router.post('/request-password-reset',
  resetPasswordLimiter,
  validateAuth.email,
  authController.requestPasswordReset
);

/**
 * @route POST /api/auth/reset-password/:token
 * @desc Réinitialisation du mot de passe avec token
 * @access Public
 * @param {string} token - Token de réinitialisation
 * @body {string} password - Nouveau mot de passe
 * @body {string} confirmPassword - Confirmation du nouveau mot de passe
 */
router.post('/reset-password/:token',
  validateAuth.passwordReset,
  authController.resetPassword
);

/**
 * @route GET /api/auth/profile
 * @desc Récupérer le profil de l'utilisateur connecté
 * @access Private
 * @header {string} Authorization - Bearer token
 */
router.get('/profile',
  auth,
  authController.getProfile
);

/**
 * @route POST /api/auth/change-password
 * @desc Changer le mot de passe de l'utilisateur connecté
 * @access Private
 * @header {string} Authorization - Bearer token
 * @body {string} currentPassword - Mot de passe actuel
 * @body {string} newPassword - Nouveau mot de passe
 * @body {string} confirmPassword - Confirmation du nouveau mot de passe
 */
router.post('/change-password',
  auth,
  validateAuth.passwordChange,
  authController.changePassword
);

// =====================================
// ROUTES DE DEBUG (DÉVELOPPEMENT UNIQUEMENT)
// =====================================

if (process.env.NODE_ENV === 'development') {
  /**
   * @route GET /api/auth/debug/sessions
   * @desc Debug - Lister les sessions actives (DEV ONLY)
   * @access Private
   */
  router.get('/debug/sessions',
    auth,
    async (req, res) => {
      try {
        const Session = require('../models/Session');
        const sessions = await Session.find({
          userId: req.user._id,
          isActive: true
        }).sort({ createdAt: -1 });

        res.json({
          success: true,
          sessions: sessions.map(session => ({
            id: session._id,
            createdAt: session.createdAt,
            lastActivity: session.activity.lastActivity,
            deviceInfo: session.deviceInfo,
            riskScore: session.security.riskScore,
            flags: session.security.flags
          }))
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    }
  );

  /**
   * @route POST /api/auth/debug/revoke-session/:sessionId
   * @desc Debug - Révoquer une session spécifique (DEV ONLY)
   * @access Private
   */
  router.post('/debug/revoke-session/:sessionId',
    auth,
    async (req, res) => {
      try {
        const Session = require('../models/Session');
        const { sessionId } = req.params;

        const session = await Session.findOne({
          _id: sessionId,
          userId: req.user._id
        });

        if (!session) {
          return res.status(404).json({
            success: false,
            error: 'Session non trouvée'
          });
        }

        await session.revoke('debug_revoke', req.user._id);

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
    }
  );
}

// =====================================
// GESTION D'ERREURS ROUTE AUTH
// =====================================

router.use((error, req, res, next) => {
  console.error('❌ Erreur route auth:', error);

  // Erreur de validation
  if (error.type === 'VALIDATION_ERROR') {
    return res.status(400).json({
      success: false,
      error: error.message,
      type: 'VALIDATION_ERROR',
      fields: error.fields
    });
  }

  // Erreur JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token invalide',
      type: 'INVALID_TOKEN'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expiré',
      type: 'TOKEN_EXPIRED'
    });
  }

  // Erreur générique
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Erreur interne du serveur',
    type: error.type || 'INTERNAL_ERROR',
    requestId: req.requestId
  });
});

module.exports = router;
