"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema({
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
    "enum": ['user', 'forensic_analyst', 'admin', 'expert'],
    "default": 'user'
  },
  // ✅ AJOUT CRITIQUE : Support du pluriel pour compatibilité JWT
  roles: {
    type: [String],
    "enum": ['user', 'forensic_analyst', 'admin', 'expert'],
    "default": function _default() {
      return [this.role];
    } // Synchronisé avec role
  },
  subscription: {
    type: String,
    "enum": ['free', 'pro', 'enterprise'],
    "default": 'free'
  },
  status: {
    type: String,
    "enum": ['active', 'inactive', 'suspended', 'pending'],
    "default": 'pending'
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
      "enum": ['fr', 'en', 'es', 'de'],
      "default": 'fr'
    },
    timezone: {
      type: String,
      "default": 'Europe/Paris'
    },
    notifications: {
      email: {
        type: Boolean,
        "default": true
      },
      push: {
        type: Boolean,
        "default": true
      },
      sms: {
        type: Boolean,
        "default": false
      },
      analysisComplete: {
        type: Boolean,
        "default": true
      },
      weeklyReport: {
        type: Boolean,
        "default": true
      }
    },
    privacy: {
      profilePublic: {
        type: Boolean,
        "default": false
      },
      shareAnalytics: {
        type: Boolean,
        "default": true
      }
    }
  },
  usage: {
    imagesUploaded: {
      type: Number,
      "default": 0
    },
    imagesAnalyzed: {
      type: Number,
      "default": 0
    },
    storageUsed: {
      type: Number,
      "default": 0
    },
    apiCallsThisMonth: {
      type: Number,
      "default": 0
    },
    lastUpload: Date,
    lastAnalysis: Date
  },
  limits: {
    maxImages: {
      type: Number,
      "default": 10
    },
    maxStorage: {
      type: Number,
      "default": 104857600
    },
    maxApiCalls: {
      type: Number,
      "default": 50
    }
  },
  security: {
    emailVerified: {
      type: Boolean,
      "default": false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    lastLoginIP: String,
    loginAttempts: {
      type: Number,
      "default": 0
    },
    lockoutUntil: Date,
    twoFactorEnabled: {
      type: Boolean,
      "default": false
    },
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
    enabled: {
      type: Boolean,
      "default": true
    },
    // ✅ CORRECTION : true par défaut
    apiKey: String,
    apiSecret: String,
    rateLimit: {
      type: Number,
      "default": 100
    },
    allowedIPs: [String],
    lastApiCall: Date
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

// Index pour les performances
UserSchema.index({
  'security.emailVerificationToken': 1
});
UserSchema.index({
  'security.passwordResetToken': 1
});
UserSchema.index({
  role: 1,
  status: 1
});
UserSchema.index({
  roles: 1,
  status: 1
}); // ✅ AJOUT : Index pour roles
UserSchema.index({
  createdAt: -1
});

// Virtual pour nom complet
UserSchema.virtual('fullName').get(function () {
  return "".concat(this.profile.firstName, " ").concat(this.profile.lastName);
});

// Virtual pour vérifier si premium
UserSchema.virtual('isPremium').get(function () {
  return ['pro', 'enterprise'].includes(this.subscription);
});

// Virtual pour vérifier si compte verrouillé
UserSchema.virtual('isLocked').get(function () {
  return !!(this.security.lockoutUntil && this.security.lockoutUntil > Date.now());
});

// ✅ AJOUT CRITIQUE : Middleware pour synchroniser role <-> roles
UserSchema.pre('save', function (next) {
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
UserSchema.pre('save', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(next) {
    var _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (this.isModified('password')) {
            _context.n = 1;
            break;
          }
          return _context.a(2, next());
        case 1:
          _context.p = 1;
          _context.n = 2;
          return bcrypt.hash(this.password, 12);
        case 2:
          this.password = _context.v;
          next();
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          next(_t);
        case 4:
          return _context.a(2);
      }
    }, _callee, this, [[1, 3]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

// Méthode pour comparer passwords
UserSchema.methods.comparePassword = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(candidatePassword) {
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.n = 1;
          return bcrypt.compare(candidatePassword, this.password);
        case 1:
          return _context2.a(2, _context2.v);
      }
    }, _callee2, this);
  }));
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}();

// Méthode pour incrémenter tentatives de connexion
UserSchema.methods.incLoginAttempts = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
  var maxAttempts, lockoutTime;
  return _regenerator().w(function (_context3) {
    while (1) switch (_context3.n) {
      case 0:
        maxAttempts = 5;
        lockoutTime = 30 * 60 * 1000; // 30 minutes
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
        _context3.n = 1;
        return this.save();
      case 1:
        return _context3.a(2, _context3.v);
    }
  }, _callee3, this);
}));

// Méthode pour reset tentatives après succès
UserSchema.methods.resetLoginAttempts = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
  return _regenerator().w(function (_context4) {
    while (1) switch (_context4.n) {
      case 0:
        this.security.loginAttempts = 0;
        this.security.lockoutUntil = undefined;
        this.security.lastLogin = new Date();
        _context4.n = 1;
        return this.save();
      case 1:
        return _context4.a(2, _context4.v);
    }
  }, _callee4, this);
}));

// Méthode pour générer token de vérification email
UserSchema.methods.generateEmailVerificationToken = function () {
  var crypto = require('crypto');
  var token = crypto.randomBytes(32).toString('hex');
  this.security.emailVerificationToken = token;
  this.security.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24h
  return token;
};

// Méthode pour générer token de reset password
UserSchema.methods.generatePasswordResetToken = function () {
  var crypto = require('crypto');
  var token = crypto.randomBytes(32).toString('hex');
  this.security.passwordResetToken = token;
  this.security.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1h
  return token;
};

// Méthode pour sanitizer les données utilisateur
UserSchema.methods.toSafeObject = function () {
  var user = this.toObject();
  delete user.password;
  delete user.security.emailVerificationToken;
  delete user.security.passwordResetToken;
  delete user.security.twoFactorSecret;
  delete user.security.backupCodes;
  delete user.apiAccess.apiSecret;
  return user;
};

// Méthode statique pour trouver par email
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({
    email: email.toLowerCase()
  });
};

// Méthode statique pour stats globales
UserSchema.statics.getStats = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
  var stats;
  return _regenerator().w(function (_context5) {
    while (1) switch (_context5.n) {
      case 0:
        _context5.n = 1;
        return this.aggregate([{
          $group: {
            _id: null,
            totalUsers: {
              $sum: 1
            },
            activeUsers: {
              $sum: {
                $cond: [{
                  $eq: ['$status', 'active']
                }, 1, 0]
              }
            },
            premiumUsers: {
              $sum: {
                $cond: [{
                  $in: ['$subscription', ['pro', 'enterprise']]
                }, 1, 0]
              }
            },
            totalImagesUploaded: {
              $sum: '$usage.imagesUploaded'
            },
            totalStorageUsed: {
              $sum: '$usage.storageUsed'
            }
          }
        }]);
      case 1:
        stats = _context5.v;
        return _context5.a(2, stats[0] || {});
    }
  }, _callee5, this);
}));
module.exports = mongoose.model('User', UserSchema);