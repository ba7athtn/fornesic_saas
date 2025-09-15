"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../models/User');
var Session = require('../models/Session');
var AuthService = /*#__PURE__*/function () {
  function AuthService() {
    _classCallCheck(this, AuthService);
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // ✅ CORRECTION CRITIQUE : Générer les tokens JWT avec rôles utilisateur
  return _createClass(AuthService, [{
    key: "generateTokens",
    value: function generateTokens(userId) {
      var userData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var sessionData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var payload = {
        sub: userId,
        type: 'access',
        iat: Math.floor(Date.now() / 1000),
        // ✅ AJOUT CRITIQUE : Inclure les rôles utilisateur dans le JWT
        roles: userData.roles || [userData.role || 'user'],
        // Support singulier ET pluriel
        subscription: userData.subscription,
        status: userData.status
      };
      var refreshPayload = {
        sub: userId,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
        // ✅ AJOUT : Aussi dans le refresh token pour cohérence
        roles: userData.roles || [userData.role || 'user']
      };
      var accessToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn
      });
      var refreshToken = jwt.sign(refreshPayload, this.jwtRefreshSecret, {
        expiresIn: this.refreshExpiresIn
      });
      return {
        accessToken: accessToken,
        refreshToken: refreshToken
      };
    }

    // ✅ CORRECTION : Créer une session complète avec données utilisateur
  }, {
    key: "createSession",
    value: function () {
      var _createSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(userId, deviceInfo) {
        var loginMethod,
          userData,
          _this$generateTokens,
          accessToken,
          refreshToken,
          expiresAt,
          session,
          _args = arguments,
          _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              loginMethod = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'password';
              userData = _args.length > 3 && _args[3] !== undefined ? _args[3] : {};
              _context.p = 1;
              // ✅ CORRECTION : Passer userData à generateTokens
              _this$generateTokens = this.generateTokens(userId, userData), accessToken = _this$generateTokens.accessToken, refreshToken = _this$generateTokens.refreshToken; // Calculer date d'expiration (7 jours)
              expiresAt = new Date();
              expiresAt.setDate(expiresAt.getDate() + 7);

              // Créer la session
              session = new Session({
                userId: userId,
                token: accessToken,
                refreshToken: refreshToken,
                deviceInfo: _objectSpread(_objectSpread({}, deviceInfo), {}, {
                  fingerprint: this.generateDeviceFingerprint(deviceInfo)
                }),
                loginMethod: loginMethod,
                expiresAt: expiresAt,
                activity: {
                  lastActivity: new Date(),
                  actionsCount: 1
                }
              }); // Analyser les risques de sécurité
              _context.n = 2;
              return this.analyzeSessionSecurity(session);
            case 2:
              _context.n = 3;
              return session.save();
            case 3:
              return _context.a(2, {
                session: session,
                tokens: {
                  accessToken: accessToken,
                  refreshToken: refreshToken
                }
              });
            case 4:
              _context.p = 4;
              _t = _context.v;
              console.error('❌ Erreur création session:', _t);
              throw new Error('Impossible de créer la session');
            case 5:
              return _context.a(2);
          }
        }, _callee, this, [[1, 4]]);
      }));
      function createSession(_x, _x2) {
        return _createSession.apply(this, arguments);
      }
      return createSession;
    }() // Valider un token d'accès
  }, {
    key: "validateAccessToken",
    value: function () {
      var _validateAccessToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(token) {
        var decoded, session, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              // Vérifier la signature JWT
              decoded = jwt.verify(token, this.jwtSecret);
              if (!(decoded.type !== 'access')) {
                _context2.n = 1;
                break;
              }
              throw new Error('Type de token invalide');
            case 1:
              _context2.n = 2;
              return Session.findByToken(token);
            case 2:
              session = _context2.v;
              if (!(!session || !session.isValid)) {
                _context2.n = 3;
                break;
              }
              throw new Error('Session invalide ou expirée');
            case 3:
              _context2.n = 4;
              return session.updateActivity();
            case 4:
              return _context2.a(2, {
                valid: true,
                user: session.userId,
                session: session,
                decoded: decoded
              });
            case 5:
              _context2.p = 5;
              _t2 = _context2.v;
              return _context2.a(2, {
                valid: false,
                error: _t2.message
              });
          }
        }, _callee2, this, [[0, 5]]);
      }));
      function validateAccessToken(_x3) {
        return _validateAccessToken.apply(this, arguments);
      }
      return validateAccessToken;
    }() // ✅ CORRECTION : Refresh des tokens avec préservation des rôles
  }, {
    key: "refreshTokens",
    value: function () {
      var _refreshTokens = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(refreshToken) {
        var decoded, session, user, userData, _this$generateTokens2, accessToken, newRefreshToken, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              // Vérifier le refresh token
              decoded = jwt.verify(refreshToken, this.jwtRefreshSecret);
              if (!(decoded.type !== 'refresh')) {
                _context3.n = 1;
                break;
              }
              throw new Error('Type de token invalide');
            case 1:
              _context3.n = 2;
              return Session.findByRefreshToken(refreshToken);
            case 2:
              session = _context3.v;
              if (!(!session || !session.isValid)) {
                _context3.n = 3;
                break;
              }
              throw new Error('Session invalide pour refresh');
            case 3:
              _context3.n = 4;
              return User.findById(session.userId);
            case 4:
              user = _context3.v;
              if (user) {
                _context3.n = 5;
                break;
              }
              throw new Error('Utilisateur introuvable');
            case 5:
              userData = {
                roles: user.roles || [user.role],
                role: user.role,
                subscription: user.subscription,
                status: user.status
              }; // ✅ CORRECTION : Générer de nouveaux tokens avec les rôles
              _this$generateTokens2 = this.generateTokens(session.userId, userData), accessToken = _this$generateTokens2.accessToken, newRefreshToken = _this$generateTokens2.refreshToken; // Mettre à jour la session
              session.token = accessToken;
              session.refreshToken = newRefreshToken;
              session.activity.lastActivity = new Date();
              _context3.n = 6;
              return session.save();
            case 6:
              return _context3.a(2, {
                success: true,
                tokens: {
                  accessToken: accessToken,
                  refreshToken: newRefreshToken
                },
                user: user
              });
            case 7:
              _context3.p = 7;
              _t3 = _context3.v;
              console.error('❌ Erreur refresh token:', _t3);
              return _context3.a(2, {
                success: false,
                error: _t3.message
              });
          }
        }, _callee3, this, [[0, 7]]);
      }));
      function refreshTokens(_x4) {
        return _refreshTokens.apply(this, arguments);
      }
      return refreshTokens;
    }() // Révoquer une session
  }, {
    key: "revokeSession",
    value: function () {
      var _revokeSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(token) {
        var reason,
          revokedBy,
          session,
          _args4 = arguments,
          _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              reason = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : 'user_logout';
              revokedBy = _args4.length > 2 && _args4[2] !== undefined ? _args4[2] : null;
              _context4.p = 1;
              _context4.n = 2;
              return Session.findOne({
                token: token,
                isActive: true
              });
            case 2:
              session = _context4.v;
              if (!session) {
                _context4.n = 4;
                break;
              }
              _context4.n = 3;
              return session.revoke(reason, revokedBy);
            case 3:
              return _context4.a(2, true);
            case 4:
              return _context4.a(2, false);
            case 5:
              _context4.p = 5;
              _t4 = _context4.v;
              console.error('❌ Erreur révocation session:', _t4);
              return _context4.a(2, false);
          }
        }, _callee4, null, [[1, 5]]);
      }));
      function revokeSession(_x5) {
        return _revokeSession.apply(this, arguments);
      }
      return revokeSession;
    }() // Révoquer toutes les sessions d'un utilisateur
  }, {
    key: "revokeAllUserSessions",
    value: function () {
      var _revokeAllUserSessions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(userId) {
        var reason,
          excludeSessionId,
          result,
          _args5 = arguments,
          _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              reason = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 'security';
              excludeSessionId = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : null;
              _context5.p = 1;
              _context5.n = 2;
              return Session.revokeAllForUser(userId, reason, excludeSessionId);
            case 2:
              result = _context5.v;
              console.log("\uD83D\uDD10 Sessions r\xE9voqu\xE9es pour utilisateur ".concat(userId, ": ").concat(result.modifiedCount));
              return _context5.a(2, result);
            case 3:
              _context5.p = 3;
              _t5 = _context5.v;
              console.error('❌ Erreur révocation sessions:', _t5);
              throw _t5;
            case 4:
              return _context5.a(2);
          }
        }, _callee5, null, [[1, 3]]);
      }));
      function revokeAllUserSessions(_x6) {
        return _revokeAllUserSessions.apply(this, arguments);
      }
      return revokeAllUserSessions;
    }() // Générer empreinte device
  }, {
    key: "generateDeviceFingerprint",
    value: function generateDeviceFingerprint(deviceInfo) {
      var fingerprint = crypto.createHash('sha256').update(JSON.stringify({
        userAgent: deviceInfo.userAgent,
        ip: deviceInfo.ip,
        platform: deviceInfo.platform
      })).digest('hex');
      return fingerprint.substring(0, 16);
    }

    // Analyser sécurité de la session
  }, {
    key: "analyzeSessionSecurity",
    value: function () {
      var _analyzeSessionSecurity = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(session) {
        var flags, existingSessions, lastSession;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              flags = []; // Vérifier si c'est un nouveau device pour cet utilisateur
              _context6.n = 1;
              return Session.find({
                userId: session.userId,
                'deviceInfo.fingerprint': {
                  $ne: session.deviceInfo.fingerprint
                },
                isActive: true
              });
            case 1:
              existingSessions = _context6.v;
              if (existingSessions.length === 0) {
                flags.push('new_device');
              }

              // Vérifier IP suspecte (exemple simple)
              if (session.deviceInfo.ip && (session.deviceInfo.ip.startsWith('10.') || session.deviceInfo.ip.includes('proxy'))) {
                flags.push('suspicious_ip');
              }

              // Analyser géolocalisation si disponible
              if (!session.deviceInfo.location) {
                _context6.n = 3;
                break;
              }
              _context6.n = 2;
              return Session.findOne({
                userId: session.userId,
                isActive: true,
                'deviceInfo.location': {
                  $exists: true
                }
              }).sort({
                createdAt: -1
              });
            case 2:
              lastSession = _context6.v;
              if (lastSession && this.calculateDistance(session.deviceInfo.location, lastSession.deviceInfo.location) > 1000) {
                // Plus de 1000km
                flags.push('suspicious_location');
              }
            case 3:
              session.security.flags = flags;
              session.calculateRiskScore();
            case 4:
              return _context6.a(2);
          }
        }, _callee6, this);
      }));
      function analyzeSessionSecurity(_x7) {
        return _analyzeSessionSecurity.apply(this, arguments);
      }
      return analyzeSessionSecurity;
    }() // Calculer distance entre deux points GPS
  }, {
    key: "calculateDistance",
    value: function calculateDistance(pos1, pos2) {
      var R = 6371; // Rayon de la Terre en km
      var dLat = this.deg2rad(pos2.latitude - pos1.latitude);
      var dLon = this.deg2rad(pos2.longitude - pos1.longitude);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(pos1.latitude)) * Math.cos(this.deg2rad(pos2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance en km
    }
  }, {
    key: "deg2rad",
    value: function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    // Générer API Key
  }, {
    key: "generateApiKey",
    value: function generateApiKey() {
      return crypto.randomBytes(32).toString('hex');
    }

    // Générer API Secret
  }, {
    key: "generateApiSecret",
    value: function generateApiSecret() {
      return crypto.randomBytes(64).toString('hex');
    }

    // Nettoyer les sessions expirées (à appeler périodiquement)
  }, {
    key: "cleanupExpiredSessions",
    value: function () {
      var _cleanupExpiredSessions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        var result, _t6;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              _context7.n = 1;
              return Session.cleanupExpired();
            case 1:
              result = _context7.v;
              console.log("\uD83E\uDDF9 Nettoyage sessions: ".concat(result.deletedCount, " sessions supprim\xE9es"));
              return _context7.a(2, result);
            case 2:
              _context7.p = 2;
              _t6 = _context7.v;
              console.error('❌ Erreur nettoyage sessions:', _t6);
              throw _t6;
            case 3:
              return _context7.a(2);
          }
        }, _callee7, null, [[0, 2]]);
      }));
      function cleanupExpiredSessions() {
        return _cleanupExpiredSessions.apply(this, arguments);
      }
      return cleanupExpiredSessions;
    }() // Statistiques des sessions
  }, {
    key: "getSessionStats",
    value: function () {
      var _getSessionStats = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var _t7;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              _context8.n = 1;
              return Session.getActiveStats();
            case 1:
              return _context8.a(2, _context8.v);
            case 2:
              _context8.p = 2;
              _t7 = _context8.v;
              console.error('❌ Erreur stats sessions:', _t7);
              return _context8.a(2, null);
          }
        }, _callee8, null, [[0, 2]]);
      }));
      function getSessionStats() {
        return _getSessionStats.apply(this, arguments);
      }
      return getSessionStats;
    }() // Vérifier force du mot de passe
  }, {
    key: "validatePasswordStrength",
    value: function validatePasswordStrength(password) {
      var minLength = 8;
      var hasUpperCase = /[A-Z]/.test(password);
      var hasLowerCase = /[a-z]/.test(password);
      var hasNumbers = /\d/.test(password);
      var hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      var score = [password.length >= minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSymbols].filter(Boolean).length;
      return {
        valid: score >= 4,
        score: score,
        requirements: {
          minLength: password.length >= minLength,
          hasUpperCase: hasUpperCase,
          hasLowerCase: hasLowerCase,
          hasNumbers: hasNumbers,
          hasSymbols: hasSymbols
        }
      };
    }

    // Détecter tentatives de brute force
  }, {
    key: "detectBruteForce",
    value: function () {
      var _detectBruteForce = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(ip) {
        var email,
          _args9 = arguments;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              email = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : null;
              return _context9.a(2, {
                isSuspicious: false,
                attemptsCount: 0,
                blockUntil: null
              });
          }
        }, _callee9);
      }));
      function detectBruteForce(_x8) {
        return _detectBruteForce.apply(this, arguments);
      }
      return detectBruteForce;
    }()
  }]);
}();
module.exports = new AuthService();