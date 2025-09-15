"use strict";

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const authService = require('../services/authService');
const cacheService = require('../services/cacheService');
const { scopesFromRoles } = require('../auth/rbac');
const config = require('../config');

class AuthController {
  // Inscription utilisateur
  async register(req, res) {
    try {
      if (res.headersSent) return;

      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        organization,
        acceptTerms
      } = req.body;

      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
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
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'Les mots de passe ne correspondent pas',
          type: 'PASSWORD_MISMATCH'
        });
        return;
      }

      const passwordCheck = authService.validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        res.status(400).json({
          success: false,
          error: 'Mot de passe trop faible',
          type: 'WEAK_PASSWORD',
          requirements: passwordCheck.requirements
        });
        return;
      }

      if (!acceptTerms) {
        res.status(400).json({
          success: false,
          error: 'Vous devez accepter les conditions d\'utilisation',
          type: 'TERMS_NOT_ACCEPTED'
        });
        return;
      }

      const existingUser = await User.findOne({ email: String(email).toLowerCase() });
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'Un compte existe déjà avec cet email',
          type: 'USER_ALREADY_EXISTS'
        });
        return;
      }

      const user = new User({
        email: String(email).toLowerCase(),
        password, // hash via middleware mongoose
        profile: {
          firstName: String(firstName).trim(),
          lastName: String(lastName).trim(),
          organization: organization ? String(organization).trim() : undefined
        },
        preferences: {
          language: req.headers['accept-language']?.substring(0, 2) || 'fr'
        }
      });

      await user.save();

      let tokens = null;
      if (process.env.NODE_ENV === 'development') {
        user.security = user.security || {};
        user.security.emailVerified = true;
        user.security.emailVerifiedAt = new Date();
        user.status = 'active';
        await user.save();

        const roles = user.roles || [user.role || 'user'];
        const scopes = scopesFromRoles(roles);

        try {
          const sessionResult = await authService.createSession(
            user._id,
            {
              userAgent: req.get('User-Agent'),
              ip: req.ip,
              browser: req.useragent?.browser || 'Unknown',
              os: req.useragent?.os || 'Unknown'
            },
            'password',
            {
              roles,
              role: user.role,
              subscription: user.subscription,
              status: user.status,
              scopes
            },
            {
              secret: config.jwt.secret,
              expiresIn: config.jwt.accessTokenExpiry
            }
          );

          tokens = sessionResult.tokens;
        } catch (sessionError) {
          console.error('❌ Erreur création session registration:', sessionError);
        }
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
      return;
    } catch (error) {
      console.error('❌ Erreur registration:', error);

      if (res.headersSent) return;

      if (error.name === 'ValidationError') {
        const validationErrors = {};
        for (const field in error.errors) {
          validationErrors[field] = error.errors[field].message;
        }
        res.status(400).json({
          success: false,
          error: 'Données invalides',
          type: 'VALIDATION_ERROR',
          fields: validationErrors
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création du compte',
        type: 'REGISTRATION_ERROR'
      });
      return;
    }
  }

  // Connexion utilisateur
  async login(req, res) {
    try {
      if (res.headersSent) return;

      const { email, password, rememberMe = false } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email et mot de passe requis',
          type: 'VALIDATION_ERROR'
        });
        return;
      }

      const rateLimitCheck = await cacheService.checkRateLimit(
        `login:${req.ip}`,
        'login_attempt',
        config.rateLimit?.maxRequests || 5,
        config.rateLimit?.windowSeconds || 900
      );

      if (!rateLimitCheck.allowed) {
        res.status(429).json({
          success: false,
          error: 'Trop de tentatives de connexion. Réessayez plus tard.',
          type: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimitCheck.resetTime
        });
        return;
      }

      const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect',
          type: 'INVALID_CREDENTIALS'
        });
        return;
      }

      if (user.isLocked) {
        res.status(423).json({
          success: false,
          error: 'Compte temporairement verrouillé suite à trop de tentatives',
          type: 'ACCOUNT_LOCKED',
          lockoutUntil: user.security?.lockoutUntil || null
        });
        return;
      }

      if (user.status === 'suspended') {
        res.status(403).json({
          success: false,
          error: 'Compte suspendu. Contactez le support.',
          type: 'ACCOUNT_SUSPENDED'
        });
        return;
      }

      if (user.status === 'pending' && !user.security?.emailVerified) {
        res.status(403).json({
          success: false,
          error: 'Compte non vérifié. Vérifiez votre email.',
          type: 'EMAIL_NOT_VERIFIED'
        });
        return;
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        await user.incLoginAttempts();
        res.status(401).json({
          success: false,
          error: 'Email ou mot de passe incorrect',
          type: 'INVALID_CREDENTIALS'
        });
        return;
      }

      await user.resetLoginAttempts();
      user.security = user.security || {};
      user.security.lastLoginIP = req.ip;
      user.security.lastLogin = new Date();
      await user.save();

      const roles = user.roles || [user.role || 'user'];
      const scopes = scopesFromRoles(roles);

      const sessionResult = await authService.createSession(
        user._id,
        {
          userAgent: req.get('User-Agent'),
          ip: req.ip,
          browser: req.useragent?.browser || 'Unknown',
          os: req.useragent?.os || 'Unknown'
        },
        'password',
        {
          roles,
          role: user.role,
          subscription: user.subscription,
          status: user.status,
          scopes
        },
        {
          secret: config.jwt.secret,
          expiresIn: config.jwt.accessTokenExpiry
        }
      );

      await cacheService.cacheUserSession(
        sessionResult.session._id,
        user.toSafeObject(),
        rememberMe ? 30 * 24 * 3600 : 24 * 3600
      );

      res.json({
        success: true,
        message: 'Connexion réussie',
        user: user.toSafeObject(),
        tokens: sessionResult.tokens,
        session: {
          id: String(sessionResult.session._id),
          expiresAt: sessionResult.session.expiresAt,
          deviceInfo: sessionResult.session.deviceInfo
        }
      });
      return;
    } catch (error) {
      console.error('❌ Erreur login:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la connexion',
        type: 'LOGIN_ERROR'
      });
      return;
    }
  }

  async refreshToken(req, res) {
    try {
      if (res.headersSent) return;

      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token requis',
          type: 'MISSING_REFRESH_TOKEN'
        });
        return;
      }

      const result = await authService.refreshTokens(refreshToken);
      if (!result.success) {
        res.status(401).json({
          success: false,
          error: 'Refresh token invalide ou expiré',
          type: 'INVALID_REFRESH_TOKEN'
        });
        return;
      }

      const roles = result.user.roles || [result.user.role || 'user'];
      const scopes = scopesFromRoles(roles);

      if (typeof authService.attachScopesToTokens === 'function') {
        result.tokens = await authService.attachScopesToTokens(result.tokens, {
          roles,
          scopes,
          subscription: result.user.subscription,
          status: result.user.status
        });
      }

      res.json({
        success: true,
        message: 'Tokens rafraîchis avec succès',
        tokens: result.tokens,
        user: result.user.toSafeObject()
      });
      return;
    } catch (error) {
      console.error('❌ Erreur refresh token:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors du rafraîchissement du token',
        type: 'REFRESH_ERROR'
      });
      return;
    }
  }

  async logout(req, res) {
    try {
      if (res.headersSent) return;

      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        try {
          await authService.revokeSession(token, 'user_logout');
        } catch {}
        if (req.session) {
          try {
            await cacheService.invalidateUserSession(req.session._id);
          } catch {}
        }
      }

      res.json({ success: true, message: 'Déconnexion réussie' });
      return;
    } catch (error) {
      console.error('❌ Erreur logout:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la déconnexion',
        type: 'LOGOUT_ERROR'
      });
      return;
    }
  }

  async logoutAll(req, res) {
    try {
      if (res.headersSent) return;

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Non authentifié',
          type: 'UNAUTHORIZED'
        });
        return;
      }

      await authService.revokeAllUserSessions(
        req.user._id || req.user.sub,
        'user_logout_all',
        req.session?._id
      );

      res.json({
        success: true,
        message: 'Déconnexion de toutes les sessions réussie'
      });
      return;
    } catch (error) {
      console.error('❌ Erreur logout all:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la déconnexion globale',
        type: 'LOGOUT_ALL_ERROR'
      });
      return;
    }
  }

  async verifyEmail(req, res) {
    try {
      if (res.headersSent) return;

      const { token } = req.params;
      if (!token) {
        res.status(400).json({
          success: false,
          error: 'Token de vérification requis',
          type: 'MISSING_TOKEN'
        });
        return;
      }

      const result = await authService.verifyEmailByToken(token);
      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error || 'Token de vérification invalide ou expiré',
          type: 'INVALID_TOKEN'
        });
        return;
      }

      const user = await User.findById(result.userId);
      res.json({
        success: true,
        message: 'Email vérifié avec succès. Votre compte est maintenant actif.',
        user: user ? user.toSafeObject() : undefined
      });
      return;
    } catch (error) {
      console.error('❌ Erreur vérification email:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification de l\'email',
        type: 'EMAIL_VERIFICATION_ERROR'
      });
      return;
    }
  }

  async requestPasswordReset(req, res) {
    try {
      if (res.headersSent) return;

      const { email } = req.body;
      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email requis',
          type: 'VALIDATION_ERROR'
        });
        return;
      }

      const user = await User.findOne({ email: String(email).toLowerCase() });
      if (!user) {
        res.json({
          success: true,
          message: 'Si cet email existe, vous recevrez un lien de réinitialisation.'
        });
        return;
      }

      const resetToken = user.generatePasswordResetToken();
      await user.save();

      console.log(`🔑 Token de reset pour ${email}: ${resetToken}`);

      res.json({
        success: true,
        message: 'Si cet email existe, vous recevrez un lien de réinitialisation.'
      });
      return;
    } catch (error) {
      console.error('❌ Erreur demande reset password:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la demande de réinitialisation',
        type: 'PASSWORD_RESET_REQUEST_ERROR'
      });
      return;
    }
  }

  async resetPassword(req, res) {
    try {
      if (res.headersSent) return;

      const { token } = req.params;
      const { password, confirmPassword } = req.body;

      if (!token || !password || !confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'Tous les champs sont requis',
          type: 'VALIDATION_ERROR'
        });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'Les mots de passe ne correspondent pas',
          type: 'PASSWORD_MISMATCH'
        });
        return;
      }

      const passwordCheck = authService.validatePasswordStrength(password);
      if (!passwordCheck.valid) {
        res.status(400).json({
          success: false,
          error: 'Mot de passe trop faible',
          type: 'WEAK_PASSWORD',
          requirements: passwordCheck.requirements
        });
        return;
      }

      const user = await User.findOne({
        'security.passwordResetToken': token,
        'security.passwordResetExpires': { $gt: Date.now() }
      });

      if (!user) {
        res.status(400).json({
          success: false,
          error: 'Token de réinitialisation invalide ou expiré',
          type: 'INVALID_TOKEN'
        });
        return;
      }

      user.password = password;
      user.security.passwordResetToken = undefined;
      user.security.passwordResetExpires = undefined;
      user.security.loginAttempts = 0;
      user.security.lockoutUntil = undefined;
      await user.save();

      await authService.revokeAllUserSessions(user._id, 'password_reset');

      res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès. Reconnectez-vous.'
      });
      return;
    } catch (error) {
      console.error('❌ Erreur reset password:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la réinitialisation du mot de passe',
        type: 'PASSWORD_RESET_ERROR'
      });
      return;
    }
  }

  async getProfile(req, res) {
    try {
      if (res.headersSent) return;

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Non authentifié',
          type: 'UNAUTHORIZED'
        });
        return;
      }

      const userDoc = await User.findById(req.user._id || req.user.sub);
      if (!userDoc) {
        res.status(404).json({
          success: false,
          error: 'Utilisateur introuvable',
          type: 'USER_NOT_FOUND'
        });
        return;
      }

      const safeUser = userDoc.toSafeObject();
      safeUser.security = {
        ...(safeUser.security || {}),
        lastLogin: userDoc.security?.lastLogin || safeUser.security?.lastLogin || null,
        lastLoginIP: userDoc.security?.lastLoginIP || safeUser.security?.lastLoginIP || null,
        lastActivity: userDoc.security?.lastActivity || null,
        lastActivityIP: userDoc.security?.lastActivityIP || null,
        lastActivityUA: userDoc.security?.lastActivityUA || null
      };

      res.json({
        success: true,
        user: safeUser,
        session: null
      });
      return;
    } catch (error) {
      console.error('❌ Erreur récupération profil:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du profil',
        type: 'PROFILE_ERROR'
      });
      return;
    }
  }

  async changePassword(req, res) {
    try {
      if (res.headersSent) return;

      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'Tous les champs sont requis',
          type: 'VALIDATION_ERROR'
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'Les nouveaux mots de passe ne correspondent pas',
          type: 'PASSWORD_MISMATCH'
        });
        return;
      }

      const passwordCheck = authService.validatePasswordStrength(newPassword);
      if (!passwordCheck.valid) {
        res.status(400).json({
          success: false,
          error: 'Nouveau mot de passe trop faible',
          type: 'WEAK_PASSWORD',
          requirements: passwordCheck.requirements
        });
        return;
      }

      const user = await User.findById(req.user._id || req.user.sub).select('+password');

      const isValidCurrentPassword = await user.comparePassword(currentPassword);
      if (!isValidCurrentPassword) {
        res.status(400).json({
          success: false,
          error: 'Mot de passe actuel incorrect',
          type: 'INVALID_CURRENT_PASSWORD'
        });
        return;
      }

      user.password = newPassword;
      await user.save();

      await authService.revokeAllUserSessions(
        user._id,
        'password_change',
        req.session?._id
      );

      res.json({
        success: true,
        message: 'Mot de passe modifié avec succès'
      });
      return;
    } catch (error) {
      console.error('❌ Erreur changement mot de passe:', error);
      if (res.headersSent) return;
      res.status(500).json({
        success: false,
        error: 'Erreur lors du changement de mot de passe',
        type: 'PASSWORD_CHANGE_ERROR'
      });
      return;
    }
  }
}

module.exports = new AuthController();
