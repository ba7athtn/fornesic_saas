"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var mongoose = require('mongoose');
var SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  deviceInfo: {
    userAgent: String,
    browser: String,
    version: String,
    os: String,
    platform: String,
    mobile: {
      type: Boolean,
      "default": false
    },
    ip: String,
    location: {
      country: String,
      region: String,
      city: String,
      latitude: Number,
      longitude: Number
    }
  },
  security: {
    fingerprint: String,
    // Device fingerprint pour sécurité
    riskScore: {
      type: Number,
      "default": 0
    },
    // 0-100, 0 = safe
    flags: [String] // suspicious_location, new_device, etc.
  },
  activity: {
    lastActivity: {
      type: Date,
      "default": Date.now
    },
    actionsCount: {
      type: Number,
      "default": 0
    },
    pagesVisited: [String],
    apiCallsCount: {
      type: Number,
      "default": 0
    }
  },
  isActive: {
    type: Boolean,
    "default": true,
    index: true
  },
  loginMethod: {
    type: String,
    "enum": ['password', 'google', 'facebook', 'api_key', '2fa'],
    "default": 'password'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: {
      expireAfterSeconds: 0
    } // MongoDB TTL pour auto-suppression
  },
  revokedAt: Date,
  revokedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  revokedReason: {
    type: String,
    "enum": ['user_logout', 'admin_revoke', 'security_breach', 'expired', 'new_login']
  }
}, {
  timestamps: true
});

// Index composés pour les performances
SessionSchema.index({
  userId: 1,
  isActive: 1
});
SessionSchema.index({
  userId: 1,
  createdAt: -1
});
SessionSchema.index({
  createdAt: -1
});

// Virtual pour vérifier si la session est expirée
SessionSchema.virtual('isExpired').get(function () {
  return this.expiresAt < new Date();
});

// Virtual pour vérifier si la session est valide
SessionSchema.virtual('isValid').get(function () {
  return this.isActive && !this.isExpired && !this.revokedAt;
});

// Virtual pour calculer la durée de la session
SessionSchema.virtual('duration').get(function () {
  var end = this.revokedAt || this.activity.lastActivity || new Date();
  return Math.round((end - this.createdAt) / 1000); // en secondes
});

// Middleware pre-save pour parser User-Agent
SessionSchema.pre('save', function (next) {
  if (this.isModified('deviceInfo.userAgent') && this.deviceInfo.userAgent) {
    try {
      var useragent = require('useragent');
      var agent = useragent.parse(this.deviceInfo.userAgent);
      this.deviceInfo.browser = agent.toAgent();
      this.deviceInfo.version = agent.toVersion();
      this.deviceInfo.os = agent.os.toString();
      this.deviceInfo.platform = agent.device.toString();
      this.deviceInfo.mobile = agent.device.family !== 'Other';
    } catch (error) {
      console.warn('⚠️ Erreur parsing User-Agent:', error.message);
    }
  }
  next();
});

// Méthode pour mettre à jour l'activité
SessionSchema.methods.updateActivity = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
  var action,
    page,
    _args = arguments;
  return _regenerator().w(function (_context) {
    while (1) switch (_context.n) {
      case 0:
        action = _args.length > 0 && _args[0] !== undefined ? _args[0] : null;
        page = _args.length > 1 && _args[1] !== undefined ? _args[1] : null;
        this.activity.lastActivity = new Date();
        this.activity.actionsCount += 1;
        if (action === 'api_call') {
          this.activity.apiCallsCount += 1;
        }
        if (page && !this.activity.pagesVisited.includes(page)) {
          this.activity.pagesVisited.push(page);
          // Garder seulement les 50 dernières pages
          if (this.activity.pagesVisited.length > 50) {
            this.activity.pagesVisited = this.activity.pagesVisited.slice(-50);
          }
        }
        _context.n = 1;
        return this.save();
      case 1:
        return _context.a(2, _context.v);
    }
  }, _callee, this);
}));

// Méthode pour révoquer la session
SessionSchema.methods.revoke = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
  var reason,
    revokedBy,
    _args2 = arguments;
  return _regenerator().w(function (_context2) {
    while (1) switch (_context2.n) {
      case 0:
        reason = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : 'user_logout';
        revokedBy = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
        this.isActive = false;
        this.revokedAt = new Date();
        this.revokedReason = reason;
        if (revokedBy) this.revokedBy = revokedBy;
        _context2.n = 1;
        return this.save();
      case 1:
        return _context2.a(2, _context2.v);
    }
  }, _callee2, this);
}));

// Méthode pour calculer le score de risque
SessionSchema.methods.calculateRiskScore = function () {
  var score = 0;

  // Nouveau device
  if (this.security.flags.includes('new_device')) score += 20;
  // Localisation suspecte
  if (this.security.flags.includes('suspicious_location')) score += 30;
  // Trop d'activité API
  if (this.activity.apiCallsCount > 1000) score += 25;
  // Session très longue
  if (this.duration > 24 * 60 * 60) score += 15; // Plus de 24h

  this.security.riskScore = Math.min(score, 100);
  return this.security.riskScore;
};

// Méthodes statiques
SessionSchema.statics.findByToken = function (token) {
  return this.findOne({
    token: token,
    isActive: true,
    expiresAt: {
      $gt: new Date()
    }
  }).populate('userId');
};
SessionSchema.statics.findByRefreshToken = function (refreshToken) {
  return this.findOne({
    refreshToken: refreshToken,
    isActive: true,
    expiresAt: {
      $gt: new Date()
    }
  }).populate('userId');
};
SessionSchema.statics.revokeAllForUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(userId) {
    var reason,
      excludeSessionId,
      query,
      _args3 = arguments;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          reason = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 'security';
          excludeSessionId = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : null;
          query = {
            userId: userId,
            isActive: true
          };
          if (excludeSessionId) {
            query._id = {
              $ne: excludeSessionId
            };
          }
          _context3.n = 1;
          return this.updateMany(query, {
            $set: {
              isActive: false,
              revokedAt: new Date(),
              revokedReason: reason
            }
          });
        case 1:
          return _context3.a(2, _context3.v);
      }
    }, _callee3, this);
  }));
  return function (_x) {
    return _ref3.apply(this, arguments);
  };
}();
SessionSchema.statics.cleanupExpired = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
  var result;
  return _regenerator().w(function (_context4) {
    while (1) switch (_context4.n) {
      case 0:
        _context4.n = 1;
        return this.deleteMany({
          $or: [{
            expiresAt: {
              $lt: new Date()
            }
          }, {
            revokedAt: {
              $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          } // 7 jours
          ]
        });
      case 1:
        result = _context4.v;
        console.log("\uD83E\uDDF9 Nettoyage sessions: ".concat(result.deletedCount, " sessions supprim\xE9es"));
        return _context4.a(2, result);
    }
  }, _callee4, this);
}));
SessionSchema.statics.getActiveStats = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
  var stats;
  return _regenerator().w(function (_context5) {
    while (1) switch (_context5.n) {
      case 0:
        _context5.n = 1;
        return this.aggregate([{
          $match: {
            isActive: true
          }
        }, {
          $group: {
            _id: null,
            totalActiveSessions: {
              $sum: 1
            },
            uniqueUsers: {
              $addToSet: '$userId'
            },
            averageRiskScore: {
              $avg: '$security.riskScore'
            },
            mobileSessionsCount: {
              $sum: {
                $cond: ['$deviceInfo.mobile', 1, 0]
              }
            }
          }
        }, {
          $project: {
            totalActiveSessions: 1,
            uniqueActiveUsers: {
              $size: '$uniqueUsers'
            },
            averageRiskScore: {
              $round: ['$averageRiskScore', 1]
            },
            mobileSessionsCount: 1,
            mobilePercentage: {
              $round: [{
                $multiply: [{
                  $divide: ['$mobileSessionsCount', '$totalActiveSessions']
                }, 100]
              }, 1]
            }
          }
        }]);
      case 1:
        stats = _context5.v;
        return _context5.a(2, stats[0] || {
          totalActiveSessions: 0,
          uniqueActiveUsers: 0,
          averageRiskScore: 0,
          mobileSessionsCount: 0,
          mobilePercentage: 0
        });
    }
  }, _callee5, this);
}));
module.exports = mongoose.model('Session', SessionSchema);