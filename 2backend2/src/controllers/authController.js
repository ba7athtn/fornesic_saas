const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const authService = require('../services/authService');
const cacheService = require('../services/cacheService');

class AuthController {
  // Inscription utilisateur
  async register(req, res) {
    try {
      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        organization,
        acceptTerms
      } = req.body;

      // Validation basique
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'Tous les champs obligatoires doivent être remplis',
          type: 'VALIDATION_ERROR',
          fields: {
            email: !email ? 'Email requis' : null,
            password: !password ? 'Mot de passe requis' : null,
            firstName: !firstName ? 'Prénom requis' : null,
            lastName: !lastName ? 'Nom requis' : null
          }
        });
      }

      // Vérifier confirmation password
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Les mots de passe ne correspondent pas',
          type: 'PASSWORD_MISMATCH'
        });
      }

      // Vérifier force du mot de passe
      const passwordCheck = authService.validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe trop faible',
          type: 'WEAK_PASSWORD',
          requirements: passwordCheck.requirements
        });
      }

      // Vérifier acceptation des termes
      if (!acceptTerms) {
        return res.status(400).json({
          success: false,
          error: 'Vous devez accepter les conditions d\'utilisation',
          type: 'TERMS_NOT_ACCEPTED'
        });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Un compte existe déjà avec cet email',
          type: 'USER_ALREADY_EXISTS'
        });
      }

      // Créer l'utilisateur
      const user = new User({
        email: email.toLowerCase(),
        password, // Sera hashé par le middleware pre-save
        profile: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          organization: organization?.trim()
        },
        preferences: {
          language: req.headers['accept-language']?.substring(0, 2) || 'fr'
        }
      });

      // Générer token de vérification email
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // TODO: Envoyer email de vérification
      console.log(`📧 Token de vérification pour ${email}: ${verificationToken}`);

      // Créer session si pas de vérification email requise en dev
      let tokens = null;
      if (process.env.NODE_ENV === 'development') {
        user.security.emailVerified = true;
        user.status = 'active';
        await user.save();

        // ✅ CORRECTION : Passer les données utilisateur à createSession
        const sessionResult = await authService.createSession(
          user._id,
          {
            userAgent: req.get('User-Agent'),
            ip: req.ip,
            browser: req.useragent?.browser,
            os: req.useragent?.os
          },
          'password',
          // ✅ AJOUT CRITIQUE : Données utilisateur pour JWT
          {
            roles: user.roles || [user.role],
            role: user.role,
            subscription: user.subscription,
            status: user.status
          }
        );

        tokens = sessionResult.tokens;
      }

      res.status(201).json({
        success: true,
        message: process.env.NODE_ENV === 'development'
          ? 'Compte créé et activé avec succès'
          : 'Compte créé avec succès. Vérifiez votre email pour l\'activer.',
        user: user.toSafeObject(),
        tokens,
        requiresEmailVerification: process.env.NODE_ENV !== 'development'
      });
    } catch (error) {
      console.error('❌ Erreur registration:', error);

      // Erreur de validation MongoDB
      if (error.name === 'ValidationError') {
        const validationErrors = {};
        for (const field in error.errors) {
          validationErrors[field] = error.errors[field].message;
        }

        return res.status(400).json({
          success: false,
          error: 'Données invalides',
          type: 'VALIDATION_ERROR',
          fields: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création du compte',
        type: 'REGISTRATION_ERROR'
      });
    }
  }

  // Connexion utilisateur
  async login(req, res) {
    try {
      const { email, password, rememberMe = false } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email et mot de passe requis',
          type: 'VALIDATION_ERROR'
        });
      }

      // Rate limiting
      const rateLimitCheck = await cacheService.checkRateLimit(
        `login:${req.ip}`,
        'login_attempt',
        5, // 5 tentatives
        900 // 15 minutes
      );

      if (!rateLimitCheck.allowed) {
        return res.status(429).json({
          success: false,
          error: 'Trop de tentatives de connexion. Réessayez plus tard.',
          type: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitCheck.resetTime
        });
      }

      // Trouver l'utilisateur avec le password
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect',
          type: 'INVALID_CREDENTIALS'
        });
      }

      // Vérifier si le compte est verrouillé
      if (user.isLocked) {
        return res.status(423).json({
          success: false,
          error: 'Compte temporairement verrouillé suite à trop de tentatives',
          type: 'ACCOUNT_LOCKED',
          lockoutUntil: user.security.lockoutUntil
        });
      }

      // Vérifier le statut du compte
      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          error: 'Compte suspendu. Contactez le support.',
          type: 'ACCOUNT_SUSPENDED'
        });
      }

      if (user.status === 'pending' && !user.security.emailVerified) {
        return res.status(403).json({
          success: false,
          error: 'Compte non vérifié. Vérifiez votre email.',
          type: 'EMAIL_NOT_VERIFIED'
        });
      }

      // Vérifier le mot de passe
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        // Incrémenter les tentatives de connexion
        await user.incLoginAttempts();
        return res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect',
          type: 'INVALID_CREDENTIALS'
        });
      }

      // Reset des tentatives de connexion et update dernière connexion
      await user.resetLoginAttempts();
      user.security.lastLoginIP = req.ip;
      await user.save();

      // ✅ CORRECTION CRITIQUE : Créer la session avec données utilisateur
      const sessionResult = await authService.createSession(
        user._id,
        {
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          browser: req.useragent?.browser || 'Unknown',
          os: req.useragent?.os || 'Unknown'
        },
        'password',
        // ✅ AJOUT CRITIQUE : Passer les données utilisateur pour JWT
        {
          roles: user.roles || [user.role],
          role: user.role,
          subscription: user.subscription,
          status: user.status
        }
      );

      // Cache des données utilisateur
      await cacheService.cacheUserSession(
        sessionResult.session._id,
        user.toSafeObject(),
        rememberMe ? 30 * 24 * 3600 : 24 * 3600 // 30 jours si "remember me"
      );

      res.json({
        success: true,
        message: 'Connexion réussie',
        user: user.toSafeObject(),
        tokens: sessionResult.tokens,
        session: {
          id: sessionResult.session._id,
          expiresAt: sessionResult.session.expiresAt,
          deviceInfo: sessionResult.session.deviceInfo
        }
      });
    } catch (error) {
      console.error('❌ Erreur login:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la connexion',
        type: 'LOGIN_ERROR'
      });
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token requis',
          type: 'MISSING_REFRESH_TOKEN'
        });
      }

      const result = await authService.refreshTokens(refreshToken);
      if (!result.success) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token invalide ou expiré',
          type: 'INVALID_REFRESH_TOKEN'
        });
      }

      res.json({
        success: true,
        message: 'Tokens rafraîchis avec succès',
        tokens: result.tokens,
        user: result.user.toSafeObject()
      });
    } catch (error) {
      console.error('❌ Erreur refresh token:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du rafraîchissement du token',
        type: 'REFRESH_ERROR'
      });
    }
  }

  // Déconnexion
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await authService.revokeSession(token, 'user_logout');

        // Supprimer du cache
        if (req.session) {
          await cacheService.invalidateUserSession(req.session._id);
        }
      }

      res.json({
        success: true,
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      console.error('❌ Erreur logout:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la déconnexion',
        type: 'LOGOUT_ERROR'
      });
    }
  }

  // Déconnexion de toutes les sessions
  async logoutAll(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Non authentifié',
          type: 'UNAUTHORIZED'
        });
      }

      await authService.revokeAllUserSessions(
        req.user._id,
        'user_logout_all',
        req.session?._id // Exclure la session actuelle
      );

      res.json({
        success: true,
        message: 'Déconnexion de toutes les sessions réussie'
      });
    } catch (error) {
      console.error('❌ Erreur logout all:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la déconnexion globale',
        type: 'LOGOUT_ALL_ERROR'
      });
    }
  }

  // Vérification email
  async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({
          success: false,
          error: 'Token de vérification requis',
          type: 'MISSING_TOKEN'
        });
      }

      const user = await User.findOne({
        'security.emailVerificationToken': token,
        'security.emailVerificationExpires': { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Token de vérification invalide ou expiré',
          type: 'INVALID_TOKEN'
        });
      }

      // Activer le compte
      user.security.emailVerified = true;
      user.status = 'active';
      user.security.emailVerificationToken = undefined;
      user.security.emailVerificationExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Email vérifié avec succès. Votre compte est maintenant actif.',
        user: user.toSafeObject()
      });
    } catch (error) {
      console.error('❌ Erreur vérification email:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification de l\'email',
        type: 'EMAIL_VERIFICATION_ERROR'
      });
    }
  }

  // Demande de reset password
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email requis',
          type: 'VALIDATION_ERROR'
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Ne pas révéler si l'email existe ou non
        return res.json({
          success: true,
          message: 'Si cet email existe, vous recevrez un lien de réinitialisation.'
        });
      }

      // Générer token de reset
      const resetToken = user.generatePasswordResetToken();
      await user.save();

      // TODO: Envoyer email de reset
      console.log(`🔑 Token de reset pour ${email}: ${resetToken}`);

      res.json({
        success: true,
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation.'
      });
    } catch (error) {
      console.error('❌ Erreur demande reset password:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la demande de réinitialisation',
        type: 'PASSWORD_RESET_REQUEST_ERROR'
      });
    }
  }

  // Reset password
  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (!token || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Tous les champs sont requis',
          type: 'VALIDATION_ERROR'
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Les mots de passe ne correspondent pas',
          type: 'PASSWORD_MISMATCH'
        });
      }

      // Vérifier force du mot de passe
      const passwordCheck = authService.validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe trop faible',
          type: 'WEAK_PASSWORD',
          requirements: passwordCheck.requirements
        });
      }

      const user = await User.findOne({
        'security.passwordResetToken': token,
        'security.passwordResetExpires': { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Token de réinitialisation invalide ou expiré',
          type: 'INVALID_TOKEN'
        });
      }

      // Mettre à jour le mot de passe
      user.password = password; // Sera hashé par le middleware
      user.security.passwordResetToken = undefined;
      user.security.passwordResetExpires = undefined;
      // Reset des tentatives de connexion
      user.security.loginAttempts = 0;
      user.security.lockoutUntil = undefined;
      await user.save();

      // Révoquer toutes les sessions existantes
      await authService.revokeAllUserSessions(user._id, 'password_reset');

      res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès. Reconnectez-vous.'
      });
    } catch (error) {
      console.error('❌ Erreur reset password:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la réinitialisation du mot de passe',
        type: 'PASSWORD_RESET_ERROR'
      });
    }
  }

  // Profil utilisateur actuel
  async getProfile(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Non authentifié',
          type: 'UNAUTHORIZED'
        });
      }

      // Récupérer stats d'usage
      const user = await User.findById(req.user._id || req.user.sub);

      res.json({
        success: true,
        user: user.toSafeObject(),
        session: req.session ? {
          id: req.session._id,
          createdAt: req.session.createdAt,
          lastActivity: req.session.activity.lastActivity,
          deviceInfo: req.session.deviceInfo
        } : null
      });
    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du profil',
        type: 'PROFILE_ERROR'
      });
    }
  }

  // Changer mot de passe
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Tous les champs sont requis',
          type: 'VALIDATION_ERROR'
        });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          success: false,
          error: 'Les nouveaux mots de passe ne correspondent pas',
          type: 'PASSWORD_MISMATCH'
        });
      }

      // Vérifier force du nouveau mot de passe
      const passwordCheck = authService.validatePasswordStrength(newPassword);
      if (!passwordCheck.valid) {
        return res.status(400).json({
          success: false,
          error: 'Nouveau mot de passe trop faible',
          type: 'WEAK_PASSWORD',
          requirements: passwordCheck.requirements
        });
      }

      const user = await User.findById(req.user._id || req.user.sub).select('+password');

      // Vérifier mot de passe actuel
      const isValidCurrentPassword = await user.comparePassword(currentPassword);
      if (!isValidCurrentPassword) {
        return res.status(400).json({
          success: false,
          error: 'Mot de passe actuel incorrect',
          type: 'INVALID_CURRENT_PASSWORD'
        });
      }

      // Mettre à jour le mot de passe
      user.password = newPassword; // Sera hashé par le middleware
      await user.save();

      // Révoquer toutes les autres sessions
      await authService.revokeAllUserSessions(
        user._id,
        'password_change',
        req.session?._id // Garder la session actuelle
      );

      res.json({
        success: true,
        message: 'Mot de passe modifié avec succès'
      });
    } catch (error) {
      console.error('❌ Erreur changement mot de passe:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du changement de mot de passe',
        type: 'PASSWORD_CHANGE_ERROR'
      });
    }
  }
}

module.exports = new AuthController();
