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
  roles: {
    type: [String],
    enum: ['user', 'forensic_analyst', 'admin', 'expert'],
    default: function () { return [this.role]; }
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
    bio: { type: String, maxlength: [500, 'Bio trop longue'] },
    website: { type: String, match: [/^https?:\/\/.+/, 'URL invalide'] }
  },
  preferences: {
    language: { type: String, enum: ['fr', 'en', 'es', 'de'], default: 'fr' },
    timezone: { type: String, default: 'Europe/Paris' },
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
    // Horodatage de vérification (ajout)
    emailVerifiedAt: { type: Date, default: null },
    // Champs legacy (plus nécessaires si lien JWT, conservés pour compat)
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    lastLoginIP: String,
    // Activité stateless
    lastActivity: Date,
    lastActivityIP: String,
    lastActivityUA: String,
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
    enabled: { type: Boolean, default: true },
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

// Index
UserSchema.index({ 'security.emailVerificationToken': 1 });
UserSchema.index({ 'security.passwordResetToken': 1 });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ roles: 1, status: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'security.lastActivity': -1 });
UserSchema.index({ 'security.lastLogin': -1 });

// Virtuals
UserSchema.virtual('fullName').get(function () {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});
UserSchema.virtual('isPremium').get(function () {
  return ['pro', 'enterprise'].includes(this.subscription);
});
UserSchema.virtual('isLocked').get(function () {
  return !!(this.security.lockoutUntil && this.security.lockoutUntil > Date.now());
});

// Synchroniser role <-> roles
UserSchema.pre('save', function (next) {
  if (this.isModified('role') && !this.isModified('roles')) {
    this.roles = [this.role];
  }
  if (this.isModified('roles') && !this.isModified('role') && this.roles.length > 0) {
    this.role = this.roles;
  }
  if (!this.roles || this.roles.length === 0) {
    this.roles = [this.role || 'user'];
  }
  next();
});

// Hash password (ne pas re-hasher si inchangé)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Comparer mot de passe
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Tentatives de connexion
UserSchema.methods.incLoginAttempts = async function () {
  const maxAttempts = 5;
  const lockoutTime = 30 * 60 * 1000;
  if (this.security.lockoutUntil && this.security.lockoutUntil < Date.now()) {
    this.security.loginAttempts = 1;
    this.security.lockoutUntil = undefined;
  } else {
    this.security.loginAttempts += 1;
  }
  if (this.security.loginAttempts >= maxAttempts && !this.isLocked) {
    this.security.lockoutUntil = Date.now() + lockoutTime;
  }
  return await this.save();
};

UserSchema.methods.resetLoginAttempts = async function () {
  this.security.loginAttempts = 0;
  this.security.lockoutUntil = undefined;
  this.security.lastLogin = new Date();
  return await this.save();
};

// Token legacy de vérification email (conservé pour compat)
UserSchema.methods.generateEmailVerificationToken = function () {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.security.emailVerificationToken = token;
  this.security.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

// Token reset password
UserSchema.methods.generatePasswordResetToken = function () {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.security.passwordResetToken = token;
  this.security.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  return token;
};

// toSafeObject
UserSchema.methods.toSafeObject = function () {
  const user = this.toObject();
  delete user.password;
  if (user.security) {
    delete user.security.emailVerificationToken;
    delete user.security.passwordResetToken;
    delete user.security.twoFactorSecret;
    delete user.security.backupCodes;
  }
  if (user.apiAccess) delete user.apiAccess.apiSecret;
  return user;
};

// Statics
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        premiumUsers: {
          $sum: {
            $cond: [{ $in: ['$subscription', ['pro', 'enterprise']] }, 1, 0]
          }
        },
        totalImagesUploaded: { $sum: '$usage.imagesUploaded' },
        totalStorageUsed: { $sum: '$usage.storageUsed' }
      }
    }
  ]);
  return stats || {};
};

module.exports = mongoose.model('User', UserSchema);
