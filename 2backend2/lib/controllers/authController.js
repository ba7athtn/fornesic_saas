"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var User = require('../models/User');
var authService = require('../services/authService');
var cacheService = require('../services/cacheService');
var AuthController = /*#__PURE__*/function () {
  function AuthController() {
    _classCallCheck(this, AuthController);
  }
  return _createClass(AuthController, [{
    key: "register",
    value: // Inscription utilisateur
    function () {
      var _register = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
        var _req$headers$acceptL, _req$body, email, password, confirmPassword, firstName, lastName, organization, acceptTerms, passwordCheck, existingUser, user, verificationToken, tokens, _req$useragent, _req$useragent2, sessionResult, validationErrors, field, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              _req$body = req.body, email = _req$body.email, password = _req$body.password, confirmPassword = _req$body.confirmPassword, firstName = _req$body.firstName, lastName = _req$body.lastName, organization = _req$body.organization, acceptTerms = _req$body.acceptTerms; // Validation basique
              if (!(!email || !password || !firstName || !lastName)) {
                _context.n = 1;
                break;
              }
              return _context.a(2, res.status(400).json({
                success: false,
                error: 'Tous les champs obligatoires doivent être remplis',
                type: 'VALIDATION_ERROR',
                fields: {
                  email: !email ? 'Email requis' : null,
                  password: !password ? 'Mot de passe requis' : null,
                  firstName: !firstName ? 'Prénom requis' : null,
                  lastName: !lastName ? 'Nom requis' : null
                }
              }));
            case 1:
              if (!(password !== confirmPassword)) {
                _context.n = 2;
                break;
              }
              return _context.a(2, res.status(400).json({
                success: false,
                error: 'Les mots de passe ne correspondent pas',
                type: 'PASSWORD_MISMATCH'
              }));
            case 2:
              // Vérifier force du mot de passe
              passwordCheck = authService.validatePasswordStrength(password);
              if (passwordCheck.valid) {
                _context.n = 3;
                break;
              }
              return _context.a(2, res.status(400).json({
                success: false,
                error: 'Mot de passe trop faible',
                type: 'WEAK_PASSWORD',
                requirements: passwordCheck.requirements
              }));
            case 3:
              if (acceptTerms) {
                _context.n = 4;
                break;
              }
              return _context.a(2, res.status(400).json({
                success: false,
                error: 'Vous devez accepter les conditions d\'utilisation',
                type: 'TERMS_NOT_ACCEPTED'
              }));
            case 4:
              _context.n = 5;
              return User.findOne({
                email: email.toLowerCase()
              });
            case 5:
              existingUser = _context.v;
              if (!existingUser) {
                _context.n = 6;
                break;
              }
              return _context.a(2, res.status(409).json({
                success: false,
                error: 'Un compte existe déjà avec cet email',
                type: 'USER_ALREADY_EXISTS'
              }));
            case 6:
              // Créer l'utilisateur
              user = new User({
                email: email.toLowerCase(),
                password: password,
                // Sera hashé par le middleware pre-save
                profile: {
                  firstName: firstName.trim(),
                  lastName: lastName.trim(),
                  organization: organization === null || organization === void 0 ? void 0 : organization.trim()
                },
                preferences: {
                  language: ((_req$headers$acceptL = req.headers['accept-language']) === null || _req$headers$acceptL === void 0 ? void 0 : _req$headers$acceptL.substring(0, 2)) || 'fr'
                }
              }); // Générer token de vérification email
              verificationToken = user.generateEmailVerificationToken();
              _context.n = 7;
              return user.save();
            case 7:
              // TODO: Envoyer email de vérification
              console.log("\uD83D\uDCE7 Token de v\xE9rification pour ".concat(email, ": ").concat(verificationToken));

              // Créer session si pas de vérification email requise en dev
              tokens = null;
              if (!(process.env.NODE_ENV === 'development')) {
                _context.n = 10;
                break;
              }
              user.security.emailVerified = true;
              user.status = 'active';
              _context.n = 8;
              return user.save();
            case 8:
              _context.n = 9;
              return authService.createSession(user._id, {
                userAgent: req.get('User-Agent'),
                ip: req.ip,
                browser: (_req$useragent = req.useragent) === null || _req$useragent === void 0 ? void 0 : _req$useragent.browser,
                os: (_req$useragent2 = req.useragent) === null || _req$useragent2 === void 0 ? void 0 : _req$useragent2.os
              }, 'password',
              // ✅ AJOUT CRITIQUE : Données utilisateur pour JWT
              {
                roles: user.roles || [user.role],
                role: user.role,
                subscription: user.subscription,
                status: user.status
              });
            case 9:
              sessionResult = _context.v;
              tokens = sessionResult.tokens;
            case 10:
              res.status(201).json({
                success: true,
                message: process.env.NODE_ENV === 'development' ? 'Compte créé et activé avec succès' : 'Compte créé avec succès. Vérifiez votre email pour l\'activer.',
                user: user.toSafeObject(),
                tokens: tokens,
                requiresEmailVerification: process.env.NODE_ENV !== 'development'
              });
              _context.n = 13;
              break;
            case 11:
              _context.p = 11;
              _t = _context.v;
              console.error('❌ Erreur registration:', _t);

              // Erreur de validation MongoDB
              if (!(_t.name === 'ValidationError')) {
                _context.n = 12;
                break;
              }
              validationErrors = {};
              for (field in _t.errors) {
                validationErrors[field] = _t.errors[field].message;
              }
              return _context.a(2, res.status(400).json({
                success: false,
                error: 'Données invalides',
                type: 'VALIDATION_ERROR',
                fields: validationErrors
              }));
            case 12:
              res.status(500).json({
                success: false,
                error: 'Erreur lors de la création du compte',
                type: 'REGISTRATION_ERROR'
              });
            case 13:
              return _context.a(2);
          }
        }, _callee, null, [[0, 11]]);
      }));
      function register(_x, _x2) {
        return _register.apply(this, arguments);
      }
      return register;
    }() // Connexion utilisateur
  }, {
    key: "login",
    value: function () {
      var _login = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
        var _req$useragent3, _req$useragent4, _req$body2, email, password, _req$body2$rememberMe, rememberMe, rateLimitCheck, user, isValidPassword, sessionResult, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password, _req$body2$rememberMe = _req$body2.rememberMe, rememberMe = _req$body2$rememberMe === void 0 ? false : _req$body2$rememberMe;
              if (!(!email || !password)) {
                _context2.n = 1;
                break;
              }
              return _context2.a(2, res.status(400).json({
                success: false,
                error: 'Email et mot de passe requis',
                type: 'VALIDATION_ERROR'
              }));
            case 1:
              _context2.n = 2;
              return cacheService.checkRateLimit("login:".concat(req.ip), 'login_attempt', 5,
              // 5 tentatives
              900 // 15 minutes
              );
            case 2:
              rateLimitCheck = _context2.v;
              if (rateLimitCheck.allowed) {
                _context2.n = 3;
                break;
              }
              return _context2.a(2, res.status(429).json({
                success: false,
                error: 'Trop de tentatives de connexion. Réessayez plus tard.',
                type: 'RATE_LIMIT_EXCEEDED',
                retryAfter: rateLimitCheck.resetTime
              }));
            case 3:
              _context2.n = 4;
              return User.findOne({
                email: email.toLowerCase()
              }).select('+password');
            case 4:
              user = _context2.v;
              if (user) {
                _context2.n = 5;
                break;
              }
              return _context2.a(2, res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect',
                type: 'INVALID_CREDENTIALS'
              }));
            case 5:
              if (!user.isLocked) {
                _context2.n = 6;
                break;
              }
              return _context2.a(2, res.status(423).json({
                success: false,
                error: 'Compte temporairement verrouillé suite à trop de tentatives',
                type: 'ACCOUNT_LOCKED',
                lockoutUntil: user.security.lockoutUntil
              }));
            case 6:
              if (!(user.status === 'suspended')) {
                _context2.n = 7;
                break;
              }
              return _context2.a(2, res.status(403).json({
                success: false,
                error: 'Compte suspendu. Contactez le support.',
                type: 'ACCOUNT_SUSPENDED'
              }));
            case 7:
              if (!(user.status === 'pending' && !user.security.emailVerified)) {
                _context2.n = 8;
                break;
              }
              return _context2.a(2, res.status(403).json({
                success: false,
                error: 'Compte non vérifié. Vérifiez votre email.',
                type: 'EMAIL_NOT_VERIFIED'
              }));
            case 8:
              _context2.n = 9;
              return user.comparePassword(password);
            case 9:
              isValidPassword = _context2.v;
              if (isValidPassword) {
                _context2.n = 11;
                break;
              }
              _context2.n = 10;
              return user.incLoginAttempts();
            case 10:
              return _context2.a(2, res.status(401).json({
                success: false,
                error: 'Email ou mot de passe incorrect',
                type: 'INVALID_CREDENTIALS'
              }));
            case 11:
              _context2.n = 12;
              return user.resetLoginAttempts();
            case 12:
              user.security.lastLoginIP = req.ip;
              _context2.n = 13;
              return user.save();
            case 13:
              _context2.n = 14;
              return authService.createSession(user._id, {
                userAgent: req.get('User-Agent'),
                ip: req.ip,
                browser: ((_req$useragent3 = req.useragent) === null || _req$useragent3 === void 0 ? void 0 : _req$useragent3.browser) || 'Unknown',
                os: ((_req$useragent4 = req.useragent) === null || _req$useragent4 === void 0 ? void 0 : _req$useragent4.os) || 'Unknown'
              }, 'password',
              // ✅ AJOUT CRITIQUE : Passer les données utilisateur pour JWT
              {
                roles: user.roles || [user.role],
                role: user.role,
                subscription: user.subscription,
                status: user.status
              });
            case 14:
              sessionResult = _context2.v;
              _context2.n = 15;
              return cacheService.cacheUserSession(sessionResult.session._id, user.toSafeObject(), rememberMe ? 30 * 24 * 3600 : 24 * 3600 // 30 jours si "remember me"
              );
            case 15:
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
              _context2.n = 17;
              break;
            case 16:
              _context2.p = 16;
              _t2 = _context2.v;
              console.error('❌ Erreur login:', _t2);
              res.status(500).json({
                success: false,
                error: 'Erreur lors de la connexion',
                type: 'LOGIN_ERROR'
              });
            case 17:
              return _context2.a(2);
          }
        }, _callee2, null, [[0, 16]]);
      }));
      function login(_x3, _x4) {
        return _login.apply(this, arguments);
      }
      return login;
    }() // Refresh token
  }, {
    key: "refreshToken",
    value: function () {
      var _refreshToken = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
        var _refreshToken2, result, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              _context3.p = 0;
              _refreshToken2 = req.body.refreshToken;
              if (_refreshToken2) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2, res.status(400).json({
                success: false,
                error: 'Refresh token requis',
                type: 'MISSING_REFRESH_TOKEN'
              }));
            case 1:
              _context3.n = 2;
              return authService.refreshTokens(_refreshToken2);
            case 2:
              result = _context3.v;
              if (result.success) {
                _context3.n = 3;
                break;
              }
              return _context3.a(2, res.status(401).json({
                success: false,
                error: 'Refresh token invalide ou expiré',
                type: 'INVALID_REFRESH_TOKEN'
              }));
            case 3:
              res.json({
                success: true,
                message: 'Tokens rafraîchis avec succès',
                tokens: result.tokens,
                user: result.user.toSafeObject()
              });
              _context3.n = 5;
              break;
            case 4:
              _context3.p = 4;
              _t3 = _context3.v;
              console.error('❌ Erreur refresh token:', _t3);
              res.status(500).json({
                success: false,
                error: 'Erreur lors du rafraîchissement du token',
                type: 'REFRESH_ERROR'
              });
            case 5:
              return _context3.a(2);
          }
        }, _callee3, null, [[0, 4]]);
      }));
      function refreshToken(_x5, _x6) {
        return _refreshToken.apply(this, arguments);
      }
      return refreshToken;
    }() // Déconnexion
  }, {
    key: "logout",
    value: function () {
      var _logout = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
        var _req$headers$authoriz, token, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              _context4.p = 0;
              token = (_req$headers$authoriz = req.headers.authorization) === null || _req$headers$authoriz === void 0 ? void 0 : _req$headers$authoriz.replace('Bearer ', '');
              if (!token) {
                _context4.n = 2;
                break;
              }
              _context4.n = 1;
              return authService.revokeSession(token, 'user_logout');
            case 1:
              if (!req.session) {
                _context4.n = 2;
                break;
              }
              _context4.n = 2;
              return cacheService.invalidateUserSession(req.session._id);
            case 2:
              res.json({
                success: true,
                message: 'Déconnexion réussie'
              });
              _context4.n = 4;
              break;
            case 3:
              _context4.p = 3;
              _t4 = _context4.v;
              console.error('❌ Erreur logout:', _t4);
              res.status(500).json({
                success: false,
                error: 'Erreur lors de la déconnexion',
                type: 'LOGOUT_ERROR'
              });
            case 4:
              return _context4.a(2);
          }
        }, _callee4, null, [[0, 3]]);
      }));
      function logout(_x7, _x8) {
        return _logout.apply(this, arguments);
      }
      return logout;
    }() // Déconnexion de toutes les sessions
  }, {
    key: "logoutAll",
    value: function () {
      var _logoutAll = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
        var _req$session, _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              _context5.p = 0;
              if (req.user) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2, res.status(401).json({
                success: false,
                error: 'Non authentifié',
                type: 'UNAUTHORIZED'
              }));
            case 1:
              _context5.n = 2;
              return authService.revokeAllUserSessions(req.user._id, 'user_logout_all', (_req$session = req.session) === null || _req$session === void 0 ? void 0 : _req$session._id // Exclure la session actuelle
              );
            case 2:
              res.json({
                success: true,
                message: 'Déconnexion de toutes les sessions réussie'
              });
              _context5.n = 4;
              break;
            case 3:
              _context5.p = 3;
              _t5 = _context5.v;
              console.error('❌ Erreur logout all:', _t5);
              res.status(500).json({
                success: false,
                error: 'Erreur lors de la déconnexion globale',
                type: 'LOGOUT_ALL_ERROR'
              });
            case 4:
              return _context5.a(2);
          }
        }, _callee5, null, [[0, 3]]);
      }));
      function logoutAll(_x9, _x0) {
        return _logoutAll.apply(this, arguments);
      }
      return logoutAll;
    }() // Vérification email
  }, {
    key: "verifyEmail",
    value: function () {
      var _verifyEmail = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
        var token, user, _t6;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              token = req.params.token;
              if (token) {
                _context6.n = 1;
                break;
              }
              return _context6.a(2, res.status(400).json({
                success: false,
                error: 'Token de vérification requis',
                type: 'MISSING_TOKEN'
              }));
            case 1:
              _context6.n = 2;
              return User.findOne({
                'security.emailVerificationToken': token,
                'security.emailVerificationExpires': {
                  $gt: Date.now()
                }
              });
            case 2:
              user = _context6.v;
              if (user) {
                _context6.n = 3;
                break;
              }
              return _context6.a(2, res.status(400).json({
                success: false,
                error: 'Token de vérification invalide ou expiré',
                type: 'INVALID_TOKEN'
              }));
            case 3:
              // Activer le compte
              user.security.emailVerified = true;
              user.status = 'active';
              user.security.emailVerificationToken = undefined;
              user.security.emailVerificationExpires = undefined;
              _context6.n = 4;
              return user.save();
            case 4:
              res.json({
                success: true,
                message: 'Email vérifié avec succès. Votre compte est maintenant actif.',
                user: user.toSafeObject()
              });
              _context6.n = 6;
              break;
            case 5:
              _context6.p = 5;
              _t6 = _context6.v;
              console.error('❌ Erreur vérification email:', _t6);
              res.status(500).json({
                success: false,
                error: 'Erreur lors de la vérification de l\'email',
                type: 'EMAIL_VERIFICATION_ERROR'
              });
            case 6:
              return _context6.a(2);
          }
        }, _callee6, null, [[0, 5]]);
      }));
      function verifyEmail(_x1, _x10) {
        return _verifyEmail.apply(this, arguments);
      }
      return verifyEmail;
    }() // Demande de reset password
  }, {
    key: "requestPasswordReset",
    value: function () {
      var _requestPasswordReset = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
        var email, user, resetToken, _t7;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              email = req.body.email;
              if (email) {
                _context7.n = 1;
                break;
              }
              return _context7.a(2, res.status(400).json({
                success: false,
                error: 'Email requis',
                type: 'VALIDATION_ERROR'
              }));
            case 1:
              _context7.n = 2;
              return User.findOne({
                email: email.toLowerCase()
              });
            case 2:
              user = _context7.v;
              if (user) {
                _context7.n = 3;
                break;
              }
              return _context7.a(2, res.json({
                success: true,
                message: 'Si cet email existe, vous recevrez un lien de réinitialisation.'
              }));
            case 3:
              // Générer token de reset
              resetToken = user.generatePasswordResetToken();
              _context7.n = 4;
              return user.save();
            case 4:
              // TODO: Envoyer email de reset
              console.log("\uD83D\uDD11 Token de reset pour ".concat(email, ": ").concat(resetToken));
              res.json({
                success: true,
                message: 'Si cet email existe, vous recevrez un lien de réinitialisation.'
              });
              _context7.n = 6;
              break;
            case 5:
              _context7.p = 5;
              _t7 = _context7.v;
              console.error('❌ Erreur demande reset password:', _t7);
              res.status(500).json({
                success: false,
                error: 'Erreur lors de la demande de réinitialisation',
                type: 'PASSWORD_RESET_REQUEST_ERROR'
              });
            case 6:
              return _context7.a(2);
          }
        }, _callee7, null, [[0, 5]]);
      }));
      function requestPasswordReset(_x11, _x12) {
        return _requestPasswordReset.apply(this, arguments);
      }
      return requestPasswordReset;
    }() // Reset password
  }, {
    key: "resetPassword",
    value: function () {
      var _resetPassword = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
        var token, _req$body3, password, confirmPassword, passwordCheck, user, _t8;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              _context8.p = 0;
              token = req.params.token;
              _req$body3 = req.body, password = _req$body3.password, confirmPassword = _req$body3.confirmPassword;
              if (!(!token || !password || !confirmPassword)) {
                _context8.n = 1;
                break;
              }
              return _context8.a(2, res.status(400).json({
                success: false,
                error: 'Tous les champs sont requis',
                type: 'VALIDATION_ERROR'
              }));
            case 1:
              if (!(password !== confirmPassword)) {
                _context8.n = 2;
                break;
              }
              return _context8.a(2, res.status(400).json({
                success: false,
                error: 'Les mots de passe ne correspondent pas',
                type: 'PASSWORD_MISMATCH'
              }));
            case 2:
              // Vérifier force du mot de passe
              passwordCheck = authService.validatePasswordStrength(password);
              if (passwordCheck.valid) {
                _context8.n = 3;
                break;
              }
              return _context8.a(2, res.status(400).json({
                success: false,
                error: 'Mot de passe trop faible',
                type: 'WEAK_PASSWORD',
                requirements: passwordCheck.requirements
              }));
            case 3:
              _context8.n = 4;
              return User.findOne({
                'security.passwordResetToken': token,
                'security.passwordResetExpires': {
                  $gt: Date.now()
                }
              });
            case 4:
              user = _context8.v;
              if (user) {
                _context8.n = 5;
                break;
              }
              return _context8.a(2, res.status(400).json({
                success: false,
                error: 'Token de réinitialisation invalide ou expiré',
                type: 'INVALID_TOKEN'
              }));
            case 5:
              // Mettre à jour le mot de passe
              user.password = password; // Sera hashé par le middleware
              user.security.passwordResetToken = undefined;
              user.security.passwordResetExpires = undefined;
              // Reset des tentatives de connexion
              user.security.loginAttempts = 0;
              user.security.lockoutUntil = undefined;
              _context8.n = 6;
              return user.save();
            case 6:
              _context8.n = 7;
              return authService.revokeAllUserSessions(user._id, 'password_reset');
            case 7:
              res.json({
                success: true,
                message: 'Mot de passe réinitialisé avec succès. Reconnectez-vous.'
              });
              _context8.n = 9;
              break;
            case 8:
              _context8.p = 8;
              _t8 = _context8.v;
              console.error('❌ Erreur reset password:', _t8);
              res.status(500).json({
                success: false,
                error: 'Erreur lors de la réinitialisation du mot de passe',
                type: 'PASSWORD_RESET_ERROR'
              });
            case 9:
              return _context8.a(2);
          }
        }, _callee8, null, [[0, 8]]);
      }));
      function resetPassword(_x13, _x14) {
        return _resetPassword.apply(this, arguments);
      }
      return resetPassword;
    }() // Profil utilisateur actuel
  }, {
    key: "getProfile",
    value: function () {
      var _getProfile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
        var user, _t9;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              _context9.p = 0;
              if (req.user) {
                _context9.n = 1;
                break;
              }
              return _context9.a(2, res.status(401).json({
                success: false,
                error: 'Non authentifié',
                type: 'UNAUTHORIZED'
              }));
            case 1:
              _context9.n = 2;
              return User.findById(req.user._id || req.user.sub);
            case 2:
              user = _context9.v;
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
              _context9.n = 4;
              break;
            case 3:
              _context9.p = 3;
              _t9 = _context9.v;
              console.error('❌ Erreur récupération profil:', _t9);
              res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération du profil',
                type: 'PROFILE_ERROR'
              });
            case 4:
              return _context9.a(2);
          }
        }, _callee9, null, [[0, 3]]);
      }));
      function getProfile(_x15, _x16) {
        return _getProfile.apply(this, arguments);
      }
      return getProfile;
    }() // Changer mot de passe
  }, {
    key: "changePassword",
    value: function () {
      var _changePassword = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
        var _req$session2, _req$body4, currentPassword, newPassword, confirmPassword, passwordCheck, user, isValidCurrentPassword, _t0;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              _context0.p = 0;
              _req$body4 = req.body, currentPassword = _req$body4.currentPassword, newPassword = _req$body4.newPassword, confirmPassword = _req$body4.confirmPassword;
              if (!(!currentPassword || !newPassword || !confirmPassword)) {
                _context0.n = 1;
                break;
              }
              return _context0.a(2, res.status(400).json({
                success: false,
                error: 'Tous les champs sont requis',
                type: 'VALIDATION_ERROR'
              }));
            case 1:
              if (!(newPassword !== confirmPassword)) {
                _context0.n = 2;
                break;
              }
              return _context0.a(2, res.status(400).json({
                success: false,
                error: 'Les nouveaux mots de passe ne correspondent pas',
                type: 'PASSWORD_MISMATCH'
              }));
            case 2:
              // Vérifier force du nouveau mot de passe
              passwordCheck = authService.validatePasswordStrength(newPassword);
              if (passwordCheck.valid) {
                _context0.n = 3;
                break;
              }
              return _context0.a(2, res.status(400).json({
                success: false,
                error: 'Nouveau mot de passe trop faible',
                type: 'WEAK_PASSWORD',
                requirements: passwordCheck.requirements
              }));
            case 3:
              _context0.n = 4;
              return User.findById(req.user._id || req.user.sub).select('+password');
            case 4:
              user = _context0.v;
              _context0.n = 5;
              return user.comparePassword(currentPassword);
            case 5:
              isValidCurrentPassword = _context0.v;
              if (isValidCurrentPassword) {
                _context0.n = 6;
                break;
              }
              return _context0.a(2, res.status(400).json({
                success: false,
                error: 'Mot de passe actuel incorrect',
                type: 'INVALID_CURRENT_PASSWORD'
              }));
            case 6:
              // Mettre à jour le mot de passe
              user.password = newPassword; // Sera hashé par le middleware
              _context0.n = 7;
              return user.save();
            case 7:
              _context0.n = 8;
              return authService.revokeAllUserSessions(user._id, 'password_change', (_req$session2 = req.session) === null || _req$session2 === void 0 ? void 0 : _req$session2._id // Garder la session actuelle
              );
            case 8:
              res.json({
                success: true,
                message: 'Mot de passe modifié avec succès'
              });
              _context0.n = 10;
              break;
            case 9:
              _context0.p = 9;
              _t0 = _context0.v;
              console.error('❌ Erreur changement mot de passe:', _t0);
              res.status(500).json({
                success: false,
                error: 'Erreur lors du changement de mot de passe',
                type: 'PASSWORD_CHANGE_ERROR'
              });
            case 10:
              return _context0.a(2);
          }
        }, _callee0, null, [[0, 9]]);
      }));
      function changePassword(_x17, _x18) {
        return _changePassword.apply(this, arguments);
      }
      return changePassword;
    }()
  }]);
}();
module.exports = new AuthController();