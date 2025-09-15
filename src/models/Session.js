const mongoose = require('mongoose');
const crypto = require('crypto');

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Plain tokens: rendus optionnels, non sélectionnés par défaut (pour compat descendante)
  token: {
    type: String,
    required: false,
    select: false,
    index: true,
    sparse: true
  },
  refreshToken: {
    type: String,
    required: false,
    select: false,
    index: true,
    sparse: true
  },

  // Hash sécurisés: requis et indexés
  tokenHash: {
    type: String,
    required: true,
    index: true
  },
  refreshTokenHash: {
    type: String,
    required: true,
    index: true
  },

  deviceInfo: {
    userAgent: String,
    browser: String,
    version: String,
    os: String,
    platform: String,
    mobile: { type: Boolean, default: false },
    ip: String,
    location: {
      country: String,
      region: String,
      city: String,
      latitude: Number,
      longitude: Number
    },
    // Fingerprint déplacé ici si souhaité par cohérence (gardé en security pour compat)
    fingerprint: String
  },

  security: {
    fingerprint: String, // Device fingerprint (ancien emplacement)
    riskScore: { type: Number, default: 0 }, // 0-100, 0 = safe
    flags: [String] // suspicious_location, new_device, etc.
  },

  activity: {
    lastActivity: { type: Date, default: Date.now },
    actionsCount: { type: Number, default: 0 },
    pagesVisited: [String],
    apiCallsCount: { type: Number, default: 0 }
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  loginMethod: {
    type: String,
    enum: ['password', 'google', 'facebook', 'api_key', '2fa'],
    default: 'password'
  },

  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // MongoDB TTL pour auto-suppression
  },

  revokedAt: Date,
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  revokedReason: {
    type: String,
    enum: ['user_logout', 'admin_revoke', 'security_breach', 'expired', 'new_login']
  }
}, {
  timestamps: true
});

// Index composés pour les performances
SessionSchema.index({ userId: 1, isActive: 1 });
SessionSchema.index({ userId: 1, createdAt: -1 });
SessionSchema.index({ createdAt: -1 });
SessionSchema.index({ tokenHash: 1, isActive: 1 });
SessionSchema.index({ refreshTokenHash: 1, isActive: 1 });

// Virtuals
SessionSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});
SessionSchema.virtual('isValid').get(function() {
  return this.isActive && !this.isExpired && !this.revokedAt;
});
SessionSchema.virtual('duration').get(function() {
  const end = this.revokedAt || this.activity.lastActivity || new Date();
  return Math.round((end - this.createdAt) / 1000); // en secondes
});

// Middleware pre-save pour parser User-Agent via ua-parser-js
SessionSchema.pre('save', function(next) {
  if (this.isModified('deviceInfo.userAgent') && this.deviceInfo?.userAgent) {
    try {
      const UAParser = require('ua-parser-js'); // dépendance remplacée et maintenue
      const parser = new UAParser(this.deviceInfo.userAgent || '');
      const b = parser.getBrowser();
      const os = parser.getOS();
      const dev = parser.getDevice();

      this.deviceInfo.browser = [b?.name, b?.version].filter(Boolean).join(' ').trim();
      this.deviceInfo.version = b?.version || '';
      this.deviceInfo.os = [os?.name, os?.version].filter(Boolean).join(' ').trim();
      // Platform priorise le device, sinon OS
      this.deviceInfo.platform = dev?.model || dev?.type || os?.name || 'Other';
      this.deviceInfo.mobile = (dev?.type === 'mobile' || dev?.type === 'tablet');
    } catch (error) {
      console.warn('⚠️ Erreur parsing User-Agent (ua-parser-js):', error.message);
    }
  }
  next();
});

// Méthode pour mettre à jour l'activité
SessionSchema.methods.updateActivity = async function(action = null, page = null) {
  this.activity.lastActivity = new Date();
  this.activity.actionsCount += 1;

  if (action === 'api_call') {
    this.activity.apiCallsCount += 1;
  }

  if (page && !this.activity.pagesVisited.includes(page)) {
    this.activity.pagesVisited.push(page);
    if (this.activity.pagesVisited.length > 50) {
      this.activity.pagesVisited = this.activity.pagesVisited.slice(-50);
    }
  }

  return await this.save();
};

// Méthode pour révoquer la session
SessionSchema.methods.revoke = async function(reason = 'user_logout', revokedBy = null) {
  this.isActive = false;
  this.revokedAt = new Date();
  this.revokedReason = reason;
  if (revokedBy) this.revokedBy = revokedBy;
  return await this.save();
};

// Méthode pour calculer le score de risque
SessionSchema.methods.calculateRiskScore = function() {
  let score = 0;
  // Nouveau device
  if (Array.isArray(this.security.flags) && this.security.flags.includes('new_device')) score += 20;
  // Localisation suspecte
  if (Array.isArray(this.security.flags) && this.security.flags.includes('suspicious_location')) score += 30;
  // Trop d'activité API
  if (this.activity.apiCallsCount > 1000) score += 25;
  // Session très longue
  if (this.duration > 24 * 60 * 60) score += 15; // Plus de 24h

  this.security.riskScore = Math.min(score, 100);
  return this.security.riskScore;
};

// Utils internes
function sha256Hex(s) {
  return crypto.createHash('sha256').update(String(s || '')).digest('hex');
}

// Méthodes statiques (basées sur hash)
SessionSchema.statics.findByToken = function(token) {
  const tokenHash = sha256Hex(token);
  return this.findOne({
    tokenHash,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId');
};

SessionSchema.statics.findByRefreshToken = function(refreshToken) {
  const refreshTokenHash = sha256Hex(refreshToken);
  return this.findOne({
    refreshTokenHash,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('userId');
};

SessionSchema.statics.revokeAllForUser = async function(userId, reason = 'security', excludeSessionId = null) {
  const query = { userId, isActive: true };
  if (excludeSessionId) query._id = { $ne: excludeSessionId };

  return await this.updateMany(query, {
    $set: {
      isActive: false,
      revokedAt: new Date(),
      revokedReason: reason
    }
  });
};

SessionSchema.statics.cleanupExpired = async function() {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { revokedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // 7 jours
    ]
  });
  console.log(`🧹 Nettoyage sessions: ${result.deletedCount} sessions supprimées`);
  return result;
};

SessionSchema.statics.getActiveStats = async function() {
  const stats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalActiveSessions: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        averageRiskScore: { $avg: '$security.riskScore' },
        mobileSessionsCount: {
          $sum: { $cond: ['$deviceInfo.mobile', 1, 0] }
        }
      }
    },
    {
      $project: {
        totalActiveSessions: 1,
        uniqueActiveUsers: { $size: '$uniqueUsers' },
        averageRiskScore: { $round: ['$averageRiskScore', 1] },
        mobileSessionsCount: 1,
        mobilePercentage: {
          $round: [
            {
              $multiply: [
                { $divide: ['$mobileSessionsCount', '$totalActiveSessions'] },
                100
              ]
            },
            1
          ]
        }
      }
    }
  ]);

  return stats || {
    totalActiveSessions: 0,
    uniqueActiveUsers: 0,
    averageRiskScore: 0,
    mobileSessionsCount: 0,
    mobilePercentage: 0
  };
};

module.exports = mongoose.model('Session', SessionSchema);
