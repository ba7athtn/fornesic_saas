const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // ✅ CORRECTION CRITIQUE : Générer les tokens JWT avec rôles utilisateur
  generateTokens(userId, userData = {}, sessionData = {}) {
    const payload = {
      sub: userId,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      // ✅ AJOUT CRITIQUE : Inclure les rôles utilisateur dans le JWT
      roles: userData.roles || [userData.role || 'user'], // Support singulier ET pluriel
      subscription: userData.subscription,
      status: userData.status
    };

    const refreshPayload = {
      sub: userId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      // ✅ AJOUT : Aussi dans le refresh token pour cohérence
      roles: userData.roles || [userData.role || 'user']
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    });

    const refreshToken = jwt.sign(refreshPayload, this.jwtRefreshSecret, {
      expiresIn: this.refreshExpiresIn
    });

    return { accessToken, refreshToken };
  }

  // ✅ CORRECTION : Créer une session complète avec données utilisateur
  async createSession(userId, deviceInfo, loginMethod = 'password', userData = {}) {
    try {
      // ✅ CORRECTION : Passer userData à generateTokens
      const { accessToken, refreshToken } = this.generateTokens(userId, userData);

      // Calculer date d'expiration (7 jours)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Créer la session
      const session = new Session({
        userId,
        token: accessToken,
        refreshToken,
        deviceInfo: {
          ...deviceInfo,
          fingerprint: this.generateDeviceFingerprint(deviceInfo)
        },
        loginMethod,
        expiresAt,
        activity: {
          lastActivity: new Date(),
          actionsCount: 1
        }
      });

      // Analyser les risques de sécurité
      await this.analyzeSessionSecurity(session);

      await session.save();

      return {
        session,
        tokens: { accessToken, refreshToken }
      };

    } catch (error) {
      console.error('❌ Erreur création session:', error);
      throw new Error('Impossible de créer la session');
    }
  }

  // Valider un token d'accès
  async validateAccessToken(token) {
    try {
      // Vérifier la signature JWT
      const decoded = jwt.verify(token, this.jwtSecret);

      if (decoded.type !== 'access') {
        throw new Error('Type de token invalide');
      }

      // Chercher la session active
      const session = await Session.findByToken(token);
      if (!session || !session.isValid) {
        throw new Error('Session invalide ou expirée');
      }

      // Mettre à jour l'activité
      await session.updateActivity();

      return {
        valid: true,
        user: session.userId,
        session: session,
        decoded
      };

    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // ✅ CORRECTION : Refresh des tokens avec préservation des rôles
  async refreshTokens(refreshToken) {
    try {
      // Vérifier le refresh token
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret);

      if (decoded.type !== 'refresh') {
        throw new Error('Type de token invalide');
      }

      // Chercher la session
      const session = await Session.findByRefreshToken(refreshToken);
      if (!session || !session.isValid) {
        throw new Error('Session invalide pour refresh');
      }

      // ✅ CORRECTION : Récupérer les données utilisateur pour les nouveaux tokens
      const user = await User.findById(session.userId);
      if (!user) {
        throw new Error('Utilisateur introuvable');
      }

      const userData = {
        roles: user.roles || [user.role],
        role: user.role,
        subscription: user.subscription,
        status: user.status
      };

      // ✅ CORRECTION : Générer de nouveaux tokens avec les rôles
      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(session.userId, userData);

      // Mettre à jour la session
      session.token = accessToken;
      session.refreshToken = newRefreshToken;
      session.activity.lastActivity = new Date();
      await session.save();

      return {
        success: true,
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        },
        user: user
      };

    } catch (error) {
      console.error('❌ Erreur refresh token:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Révoquer une session
  async revokeSession(token, reason = 'user_logout', revokedBy = null) {
    try {
      const session = await Session.findOne({ token, isActive: true });
      if (session) {
        await session.revoke(reason, revokedBy);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur révocation session:', error);
      return false;
    }
  }

  // Révoquer toutes les sessions d'un utilisateur
  async revokeAllUserSessions(userId, reason = 'security', excludeSessionId = null) {
    try {
      const result = await Session.revokeAllForUser(userId, reason, excludeSessionId);
      console.log(`🔐 Sessions révoquées pour utilisateur ${userId}: ${result.modifiedCount}`);
      return result;
    } catch (error) {
      console.error('❌ Erreur révocation sessions:', error);
      throw error;
    }
  }

  // Générer empreinte device
  generateDeviceFingerprint(deviceInfo) {
    const fingerprint = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        userAgent: deviceInfo.userAgent,
        ip: deviceInfo.ip,
        platform: deviceInfo.platform
      }))
      .digest('hex');
    
    return fingerprint.substring(0, 16);
  }

  // Analyser sécurité de la session
  async analyzeSessionSecurity(session) {
    const flags = [];
    
    // Vérifier si c'est un nouveau device pour cet utilisateur
    const existingSessions = await Session.find({
      userId: session.userId,
      'deviceInfo.fingerprint': { $ne: session.deviceInfo.fingerprint },
      isActive: true
    });

    if (existingSessions.length === 0) {
      flags.push('new_device');
    }

    // Vérifier IP suspecte (exemple simple)
    if (session.deviceInfo.ip && 
        (session.deviceInfo.ip.startsWith('10.') || 
         session.deviceInfo.ip.includes('proxy'))) {
      flags.push('suspicious_ip');
    }

    // Analyser géolocalisation si disponible
    if (session.deviceInfo.location) {
      const lastSession = await Session.findOne({
        userId: session.userId,
        isActive: true,
        'deviceInfo.location': { $exists: true }
      }).sort({ createdAt: -1 });

      if (lastSession && this.calculateDistance(
        session.deviceInfo.location,
        lastSession.deviceInfo.location
      ) > 1000) { // Plus de 1000km
        flags.push('suspicious_location');
      }
    }

    session.security.flags = flags;
    session.calculateRiskScore();
  }

  // Calculer distance entre deux points GPS
  calculateDistance(pos1, pos2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(pos2.latitude - pos1.latitude);
    const dLon = this.deg2rad(pos2.longitude - pos1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(pos1.latitude)) * 
      Math.cos(this.deg2rad(pos2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance en km
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  // Générer API Key
  generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Générer API Secret
  generateApiSecret() {
    return crypto.randomBytes(64).toString('hex');
  }

  // Nettoyer les sessions expirées (à appeler périodiquement)
  async cleanupExpiredSessions() {
    try {
      const result = await Session.cleanupExpired();
      console.log(`🧹 Nettoyage sessions: ${result.deletedCount} sessions supprimées`);
      return result;
    } catch (error) {
      console.error('❌ Erreur nettoyage sessions:', error);
      throw error;
    }
  }

  // Statistiques des sessions
  async getSessionStats() {
    try {
      return await Session.getActiveStats();
    } catch (error) {
      console.error('❌ Erreur stats sessions:', error);
      return null;
    }
  }

  // Vérifier force du mot de passe
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSymbols
    ].filter(Boolean).length;

    return {
      valid: score >= 4,
      score: score,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSymbols
      }
    };
  }

  // Détecter tentatives de brute force
  async detectBruteForce(ip, email = null) {
    // Logique de détection de brute force
    // À implémenter selon vos besoins
    return {
      isSuspicious: false,
      attemptsCount: 0,
      blockUntil: null
    };
  }
}

module.exports = new AuthService();
