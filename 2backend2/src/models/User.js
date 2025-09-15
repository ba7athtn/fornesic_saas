const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Mot de passe requis'],
    minlength: [8, 'Mot de passe trop court (min 8 caractères)'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'forensic_analyst', 'admin', 'expert'],
    default: 'user'
  },
  // ✅ AJOUT CRITIQUE : Support du pluriel pour compatibilité JWT
  roles: {
    type: [String],
    enum: ['user', 'forensic_analyst', 'admin', 'expert'],
    default: function() { return [this.role]; } // Synchronisé avec role
  },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'Prénom requis'],
      trim: true,
      maxlength: [50, 'Prénom trop long']
    },
    lastName: {
      type: String,
      required: [true, 'Nom requis'],
      trim: true,
      maxlength: [50, 'Nom trop long']
    },
    organization: {
      type: String,
      trim: true,
      maxlength: [100, 'Organisation trop longue']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s\-\(\)]{10,}$/, 'Numéro de téléphone invalide']
    },
    avatar: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio trop longue']
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'URL invalide']
    }
  },
  preferences: {
    language: {
      type: String,
      enum: ['fr', 'en', 'es', 'de'],
      default: 'fr'
    },
    timezone: {
      type: String,
      default: 'Europe/Paris'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      analysisComplete: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true }
    },
    privacy: {
      profilePublic: { type: Boolean, default: false },
      shareAnalytics: { type: Boolean, default: true }
    }
  },
  usage: {
    imagesUploaded: { type: Number, default: 0 },
    imagesAnalyzed: { type: Number, default: 0 },
    storageUsed: { type: Number, default: 0 },
    apiCallsThisMonth: { type: Number, default: 0 },
    lastUpload: Date,
    lastAnalysis: Date
  },
  limits: {
    maxImages: { type: Number, default: 10 },
    maxStorage: { type: Number, default: 104857600 },
    maxApiCalls: { type: Number, default: 50 }
  },
  security: {
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    lastLoginIP: String,
    loginAttempts: { type: Number, default: 0 },
    lockoutUntil: Date,
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    backupCodes: [String]
  },
  billing: {
    customerId: String,
    subscriptionId: String,
    subscriptionStatus: String,
    subscriptionStart: Date,
    subscriptionEnd: Date,
    trialEnds: Date,
    lastPayment: Date,
    paymentMethod: String
  },
  apiAccess: {
    enabled: { type: Boolean, default: true }, // ✅ CORRECTION : true par défaut
    apiKey: String,
    apiSecret: String,
    rateLimit: { type: Number, default: 100 },
    allowedIPs: [String],
    lastApiCall: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
UserSchema.index({ 'security.emailVerificationToken': 1 });
UserSchema.index({ 'security.passwordResetToken': 1 });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ roles: 1, status: 1 }); // ✅ AJOUT : Index pour roles
UserSchema.index({ createdAt: -1 });

// Virtual pour nom complet
UserSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual pour vérifier si premium
UserSchema.virtual('isPremium').get(function() {
  return ['pro', 'enterprise'].includes(this.subscription);
});

// Virtual pour vérifier si compte verrouillé
UserSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockoutUntil && this.security.lockoutUntil > Date.now());
});

// ✅ AJOUT CRITIQUE : Middleware pour synchroniser role <-> roles
UserSchema.pre('save', function(next) {
  // Seulement si le password a été modifié
  if (this.isModified('password') && !this.isNew) {
    // Hash password avec coût 12 (géré par le middleware suivant)
  }
  
  // ✅ SYNCHRONISATION role <-> roles
  // Synchroniser role -> roles
  if (this.isModified('role') && !this.isModified('roles')) {
    this.roles = [this.role];
  }
  // Synchroniser roles -> role (prendre le premier)
  if (this.isModified('roles') && !this.isModified('role') && this.roles.length > 0) {
    this.role = this.roles[0];
  }
  // Si aucun rôle défini, utiliser les defaults
  if (!this.roles || this.roles.length === 0) {
    this.roles = [this.role || 'user'];
  }
  
  next();
});

// Middleware pre-save pour hasher le password
UserSchema.pre('save', async function(next) {
  // Seulement si le password a été modifié
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password avec coût 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour incrémenter tentatives de connexion
UserSchema.methods.incLoginAttempts = async function() {
  const maxAttempts = 5;
  const lockoutTime = 30 * 60 * 1000; // 30 minutes
  
  // Si déjà verrouillé et que le temps est expiré
  if (this.security.lockoutUntil && this.security.lockoutUntil < Date.now()) {
    this.security.loginAttempts = 1;
    this.security.lockoutUntil = undefined;
  } else {
    this.security.loginAttempts += 1;
  }
  
  // Si on atteint le max, verrouiller
  if (this.security.loginAttempts >= maxAttempts && !this.isLocked) {
    this.security.lockoutUntil = Date.now() + lockoutTime;
  }
  
  return await this.save();
};

// Méthode pour reset tentatives après succès
UserSchema.methods.resetLoginAttempts = async function() {
  this.security.loginAttempts = 0;
  this.security.lockoutUntil = undefined;
  this.security.lastLogin = new Date();
  return await this.save();
};

// Méthode pour générer token de vérification email
UserSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.security.emailVerificationToken = token;
  this.security.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return token;
};

// Méthode pour générer token de reset password
UserSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.security.passwordResetToken = token;
  this.security.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1h
  return token;
};

// Méthode pour sanitizer les données utilisateur
UserSchema.methods.toSafeObject = function() {
  const user = this.toObject();
  delete user.password;
  delete user.security.emailVerificationToken;
  delete user.security.passwordResetToken;
  delete user.security.twoFactorSecret;
  delete user.security.backupCodes;
  delete user.apiAccess.apiSecret;
  return user;
};

// Méthode statique pour trouver par email
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Méthode statique pour stats globales
UserSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        premiumUsers: { 
          $sum: { 
            $cond: [
              { $in: ['$subscription', ['pro', 'enterprise']] }, 
              1, 
              0 
            ] 
          } 
        },
        totalImagesUploaded: { $sum: '$usage.imagesUploaded' },
        totalStorageUsed: { $sum: '$usage.storageUsed' }
      }
    }
  ]);
  return stats[0] || {};
};

module.exports = mongoose.model('User', UserSchema);
