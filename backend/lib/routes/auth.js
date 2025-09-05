"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var express = require('express');
var router = express.Router();
var rateLimit = require('express-rate-limit');
var authController = require('../controllers/authController');
var _require = require('../middleware/auth'),
  auth = _require.auth,
  optionalAuth = _require.optionalAuth;
var _require2 = require('../middleware/validation'),
  validateAuth = _require2.validateAuth;

// =====================================
// RATE LIMITING SPÉCIALISÉ
// =====================================

// Rate limiting pour inscription
var registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  // 1 heure
  max: 3,
  // 3 inscriptions par heure par IP
  message: {
    success: false,
    error: 'Trop de tentatives d\'inscription. Réessayez plus tard.',
    type: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting pour connexion
var loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 5,
  // 5 tentatives de connexion par IP
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Réessayez plus tard.',
    type: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting pour reset password
var resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  // 1 heure
  max: 3,
  // 3 demandes par heure par IP
  message: {
    success: false,
    error: 'Trop de demandes de réinitialisation. Réessayez plus tard.',
    type: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// =====================================
// ROUTES D'AUTHENTIFICATION
// =====================================

/**
 * @route POST /api/auth/register
 * @desc Inscription d'un nouvel utilisateur
 * @access Public
 * @body {string} email - Email de l'utilisateur
 * @body {string} password - Mot de passe (min 8 caractères)
 * @body {string} confirmPassword - Confirmation du mot de passe
 * @body {string} firstName - Prénom
 * @body {string} lastName - Nom
 * @body {string} [organization] - Organisation (optionnel)
 * @body {boolean} acceptTerms - Acceptation des conditions
 */
router.post('/register', registerLimiter, validateAuth.registration, authController.register);

/**
 * @route POST /api/auth/login
 * @desc Connexion utilisateur
 * @access Public
 * @body {string} email - Email de l'utilisateur
 * @body {string} password - Mot de passe
 * @body {boolean} [rememberMe] - Se souvenir de moi (optionnel)
 */
router.post('/login', loginLimiter, validateAuth.login, authController.login);

/**
 * @route POST /api/auth/refresh
 * @desc Rafraîchir les tokens d'accès
 * @access Public
 * @body {string} refreshToken - Token de rafraîchissement
 */
router.post('/refresh', validateAuth.refreshToken, authController.refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Déconnexion (révoque la session actuelle)
 * @access Private
 * @header {string} Authorization - Bearer token
 */
router.post('/logout', optionalAuth,
// Optionnel car le token peut être déjà expiré
authController.logout);

/**
 * @route POST /api/auth/logout-all
 * @desc Déconnexion de toutes les sessions
 * @access Private
 * @header {string} Authorization - Bearer token
 */
router.post('/logout-all', auth, authController.logoutAll);

/**
 * @route GET /api/auth/verify-email/:token
 * @desc Vérification de l'email avec token
 * @access Public
 * @param {string} token - Token de vérification
 */
router.get('/verify-email/:token', validateAuth.verificationToken, authController.verifyEmail);

/**
 * @route POST /api/auth/request-password-reset
 * @desc Demande de réinitialisation de mot de passe
 * @access Public
 * @body {string} email - Email de l'utilisateur
 */
router.post('/request-password-reset', resetPasswordLimiter, validateAuth.email, authController.requestPasswordReset);

/**
 * @route POST /api/auth/reset-password/:token
 * @desc Réinitialisation du mot de passe avec token
 * @access Public
 * @param {string} token - Token de réinitialisation
 * @body {string} password - Nouveau mot de passe
 * @body {string} confirmPassword - Confirmation du nouveau mot de passe
 */
router.post('/reset-password/:token', validateAuth.passwordReset, authController.resetPassword);

/**
 * @route GET /api/auth/profile
 * @desc Récupérer le profil de l'utilisateur connecté
 * @access Private
 * @header {string} Authorization - Bearer token
 */
router.get('/profile', auth, authController.getProfile);

/**
 * @route POST /api/auth/change-password
 * @desc Changer le mot de passe de l'utilisateur connecté
 * @access Private
 * @header {string} Authorization - Bearer token
 * @body {string} currentPassword - Mot de passe actuel
 * @body {string} newPassword - Nouveau mot de passe
 * @body {string} confirmPassword - Confirmation du nouveau mot de passe
 */
router.post('/change-password', auth, validateAuth.passwordChange, authController.changePassword);

// =====================================
// ROUTES DE DEBUG (DÉVELOPPEMENT UNIQUEMENT)
// =====================================

if (process.env.NODE_ENV === 'development') {
  /**
   * @route GET /api/auth/debug/sessions
   * @desc Debug - Lister les sessions actives (DEV ONLY)
   * @access Private
   */
  router.get('/debug/sessions', auth, /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
      var Session, sessions, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            Session = require('../models/Session');
            _context.n = 1;
            return Session.find({
              userId: req.user._id,
              isActive: true
            }).sort({
              createdAt: -1
            });
          case 1:
            sessions = _context.v;
            res.json({
              success: true,
              sessions: sessions.map(function (session) {
                return {
                  id: session._id,
                  createdAt: session.createdAt,
                  lastActivity: session.activity.lastActivity,
                  deviceInfo: session.deviceInfo,
                  riskScore: session.security.riskScore,
                  flags: session.security.flags
                };
              })
            });
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
            res.status(500).json({
              success: false,
              error: _t.message
            });
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());

  /**
   * @route POST /api/auth/debug/revoke-session/:sessionId
   * @desc Debug - Révoquer une session spécifique (DEV ONLY)
   * @access Private
   */
  router.post('/debug/revoke-session/:sessionId', auth, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
      var Session, sessionId, session, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            Session = require('../models/Session');
            sessionId = req.params.sessionId;
            _context2.n = 1;
            return Session.findOne({
              _id: sessionId,
              userId: req.user._id
            });
          case 1:
            session = _context2.v;
            if (session) {
              _context2.n = 2;
              break;
            }
            return _context2.a(2, res.status(404).json({
              success: false,
              error: 'Session non trouvée'
            }));
          case 2:
            _context2.n = 3;
            return session.revoke('debug_revoke', req.user._id);
          case 3:
            res.json({
              success: true,
              message: 'Session révoquée avec succès'
            });
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t2 = _context2.v;
            res.status(500).json({
              success: false,
              error: _t2.message
            });
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 4]]);
    }));
    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
}

// =====================================
// GESTION D'ERREURS ROUTE AUTH
// =====================================

router.use(function (error, req, res, next) {
  console.error('❌ Erreur route auth:', error);

  // Erreur de validation
  if (error.type === 'VALIDATION_ERROR') {
    return res.status(400).json({
      success: false,
      error: error.message,
      type: 'VALIDATION_ERROR',
      fields: error.fields
    });
  }

  // Erreur JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token invalide',
      type: 'INVALID_TOKEN'
    });
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expiré',
      type: 'TOKEN_EXPIRED'
    });
  }

  // Erreur générique
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Erreur interne du serveur',
    type: error.type || 'INTERNAL_ERROR',
    requestId: req.requestId
  });
});
module.exports = router;