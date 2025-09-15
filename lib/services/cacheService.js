"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
var Redis = require('ioredis');
var CacheService = /*#__PURE__*/function () {
  function CacheService() {
    _classCallCheck(this, CacheService);
    this.redis = null;
    this.isConnected = false;
    this.connectionRetries = 0;
    this.maxRetries = 5;
    this.connect();
  }
  return _createClass(CacheService, [{
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _this = this;
        var redisConfig, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              _context.p = 0;
              redisConfig = {
                host: process.env.REDIS_HOST || 'localhost',
                port: process.env.REDIS_PORT || 6379,
                password: process.env.REDIS_PASSWORD || undefined,
                db: process.env.REDIS_DB || 0,
                retryDelayOnFailover: 100,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                keepAlive: 30000,
                family: 4,
                // IPv4
                connectTimeout: 10000,
                commandTimeout: 5000
              };
              this.redis = new Redis(redisConfig);
              this.redis.on('connect', function () {
                console.log('✅ Redis connecté');
                _this.isConnected = true;
                _this.connectionRetries = 0;
              });
              this.redis.on('error', function (error) {
                console.error('❌ Erreur Redis:', error.message);
                _this.isConnected = false;
                if (_this.connectionRetries < _this.maxRetries) {
                  _this.connectionRetries++;
                  console.log("\uD83D\uDD04 Tentative de reconnexion Redis ".concat(_this.connectionRetries, "/").concat(_this.maxRetries));
                  setTimeout(function () {
                    return _this.connect();
                  }, 5000 * _this.connectionRetries);
                }
              });
              this.redis.on('close', function () {
                console.warn('⚠️ Connexion Redis fermée');
                _this.isConnected = false;
              });
              this.redis.on('reconnecting', function () {
                console.log('🔄 Reconnexion Redis...');
              });
              _context.n = 1;
              return this.redis.connect();
            case 1:
              _context.n = 3;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
              console.error('❌ Impossible de se connecter à Redis:', _t.message);
              this.isConnected = false;
            case 3:
              return _context.a(2);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function connect() {
        return _connect.apply(this, arguments);
      }
      return connect;
    }() // Méthode générique SET
  }, {
    key: "set",
    value: function () {
      var _set = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(key, value) {
        var ttl,
          serializedValue,
          _args2 = arguments,
          _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              ttl = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 3600;
              if (this.isConnected) {
                _context2.n = 1;
                break;
              }
              console.warn('⚠️ Redis non connecté, cache ignoré');
              return _context2.a(2, false);
            case 1:
              _context2.p = 1;
              serializedValue = _typeof(value) === 'object' ? JSON.stringify(value) : value.toString();
              if (!(ttl > 0)) {
                _context2.n = 3;
                break;
              }
              _context2.n = 2;
              return this.redis.setex(key, ttl, serializedValue);
            case 2:
              _context2.n = 4;
              break;
            case 3:
              _context2.n = 4;
              return this.redis.set(key, serializedValue);
            case 4:
              return _context2.a(2, true);
            case 5:
              _context2.p = 5;
              _t2 = _context2.v;
              console.error("\u274C Cache SET error for key ".concat(key, ":"), _t2.message);
              return _context2.a(2, false);
          }
        }, _callee2, this, [[1, 5]]);
      }));
      function set(_x, _x2) {
        return _set.apply(this, arguments);
      }
      return set;
    }() // Méthode générique GET
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(key) {
        var value, _t3, _t4;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              if (this.isConnected) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2, null);
            case 1:
              _context3.p = 1;
              _context3.n = 2;
              return this.redis.get(key);
            case 2:
              value = _context3.v;
              if (value) {
                _context3.n = 3;
                break;
              }
              return _context3.a(2, null);
            case 3:
              _context3.p = 3;
              return _context3.a(2, JSON.parse(value));
            case 4:
              _context3.p = 4;
              _t3 = _context3.v;
              return _context3.a(2, value);
            case 5:
              _context3.p = 5;
              _t4 = _context3.v;
              console.error("\u274C Cache GET error for key ".concat(key, ":"), _t4.message);
              return _context3.a(2, null);
            case 6:
              return _context3.a(2);
          }
        }, _callee3, this, [[3, 4], [1, 5]]);
      }));
      function get(_x3) {
        return _get.apply(this, arguments);
      }
      return get;
    }() // Méthode générique DELETE
  }, {
    key: "delete",
    value: function () {
      var _delete2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(key) {
        var result, _t5;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              if (this.isConnected) {
                _context4.n = 1;
                break;
              }
              return _context4.a(2, false);
            case 1:
              _context4.p = 1;
              _context4.n = 2;
              return this.redis.del(key);
            case 2:
              result = _context4.v;
              return _context4.a(2, result > 0);
            case 3:
              _context4.p = 3;
              _t5 = _context4.v;
              console.error("\u274C Cache DELETE error for key ".concat(key, ":"), _t5.message);
              return _context4.a(2, false);
          }
        }, _callee4, this, [[1, 3]]);
      }));
      function _delete(_x4) {
        return _delete2.apply(this, arguments);
      }
      return _delete;
    }() // Supprimer plusieurs clés avec pattern
  }, {
    key: "deletePattern",
    value: function () {
      var _deletePattern = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(pattern) {
        var _this$redis, keys, result, _t6;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              if (this.isConnected) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2, 0);
            case 1:
              _context5.p = 1;
              _context5.n = 2;
              return this.redis.keys(pattern);
            case 2:
              keys = _context5.v;
              if (!(keys.length === 0)) {
                _context5.n = 3;
                break;
              }
              return _context5.a(2, 0);
            case 3:
              _context5.n = 4;
              return (_this$redis = this.redis).del.apply(_this$redis, _toConsumableArray(keys));
            case 4:
              result = _context5.v;
              return _context5.a(2, result);
            case 5:
              _context5.p = 5;
              _t6 = _context5.v;
              console.error("\u274C Cache DELETE PATTERN error for ".concat(pattern, ":"), _t6.message);
              return _context5.a(2, 0);
          }
        }, _callee5, this, [[1, 5]]);
      }));
      function deletePattern(_x5) {
        return _deletePattern.apply(this, arguments);
      }
      return deletePattern;
    }() // Vérifier si une clé existe
  }, {
    key: "exists",
    value: function () {
      var _exists = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(key) {
        var result, _t7;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              if (this.isConnected) {
                _context6.n = 1;
                break;
              }
              return _context6.a(2, false);
            case 1:
              _context6.p = 1;
              _context6.n = 2;
              return this.redis.exists(key);
            case 2:
              result = _context6.v;
              return _context6.a(2, result === 1);
            case 3:
              _context6.p = 3;
              _t7 = _context6.v;
              console.error("\u274C Cache EXISTS error for key ".concat(key, ":"), _t7.message);
              return _context6.a(2, false);
          }
        }, _callee6, this, [[1, 3]]);
      }));
      function exists(_x6) {
        return _exists.apply(this, arguments);
      }
      return exists;
    }() // Incrémenter une valeur
  }, {
    key: "increment",
    value: function () {
      var _increment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(key) {
        var amount,
          ttl,
          result,
          _args7 = arguments,
          _t8;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              amount = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : 1;
              ttl = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : null;
              if (this.isConnected) {
                _context7.n = 1;
                break;
              }
              return _context7.a(2, null);
            case 1:
              _context7.p = 1;
              _context7.n = 2;
              return this.redis.incrby(key, amount);
            case 2:
              result = _context7.v;
              if (!(ttl && ttl > 0)) {
                _context7.n = 3;
                break;
              }
              _context7.n = 3;
              return this.redis.expire(key, ttl);
            case 3:
              return _context7.a(2, result);
            case 4:
              _context7.p = 4;
              _t8 = _context7.v;
              console.error("\u274C Cache INCREMENT error for key ".concat(key, ":"), _t8.message);
              return _context7.a(2, null);
          }
        }, _callee7, this, [[1, 4]]);
      }));
      function increment(_x7) {
        return _increment.apply(this, arguments);
      }
      return increment;
    }() // === MÉTHODES SPÉCIALISÉES POUR BA7ATH ===
    // Cache des analyses d'images
  }, {
    key: "cacheImageAnalysis",
    value: function () {
      var _cacheImageAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(imageId, analysis) {
        var ttl,
          key,
          _args8 = arguments;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              ttl = _args8.length > 2 && _args8[2] !== undefined ? _args8[2] : 24 * 3600;
              key = "analysis:".concat(imageId);
              _context8.n = 1;
              return this.set(key, {
                imageId: imageId,
                analysis: analysis,
                cachedAt: new Date().toISOString()
              }, ttl);
            case 1:
              return _context8.a(2, _context8.v);
          }
        }, _callee8, this);
      }));
      function cacheImageAnalysis(_x8, _x9) {
        return _cacheImageAnalysis.apply(this, arguments);
      }
      return cacheImageAnalysis;
    }()
  }, {
    key: "getCachedImageAnalysis",
    value: function () {
      var _getCachedImageAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(imageId) {
        var key, cached;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              key = "analysis:".concat(imageId);
              _context9.n = 1;
              return this.get(key);
            case 1:
              cached = _context9.v;
              return _context9.a(2, cached ? cached.analysis : null);
          }
        }, _callee9, this);
      }));
      function getCachedImageAnalysis(_x0) {
        return _getCachedImageAnalysis.apply(this, arguments);
      }
      return getCachedImageAnalysis;
    }() // Cache des métadonnées EXIF
  }, {
    key: "cacheImageMetadata",
    value: function () {
      var _cacheImageMetadata = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(imageId, metadata) {
        var ttl,
          key,
          _args0 = arguments;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              ttl = _args0.length > 2 && _args0[2] !== undefined ? _args0[2] : 7 * 24 * 3600;
              key = "metadata:".concat(imageId);
              _context0.n = 1;
              return this.set(key, metadata, ttl);
            case 1:
              return _context0.a(2, _context0.v);
          }
        }, _callee0, this);
      }));
      function cacheImageMetadata(_x1, _x10) {
        return _cacheImageMetadata.apply(this, arguments);
      }
      return cacheImageMetadata;
    }()
  }, {
    key: "getCachedImageMetadata",
    value: function () {
      var _getCachedImageMetadata = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(imageId) {
        var key;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              key = "metadata:".concat(imageId);
              _context1.n = 1;
              return this.get(key);
            case 1:
              return _context1.a(2, _context1.v);
          }
        }, _callee1, this);
      }));
      function getCachedImageMetadata(_x11) {
        return _getCachedImageMetadata.apply(this, arguments);
      }
      return getCachedImageMetadata;
    }() // Cache des thumbnails
  }, {
    key: "cacheThumbnailPath",
    value: function () {
      var _cacheThumbnailPath = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(imageId, thumbnailPath) {
        var ttl,
          key,
          _args10 = arguments;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              ttl = _args10.length > 2 && _args10[2] !== undefined ? _args10[2] : 30 * 24 * 3600;
              key = "thumbnail:".concat(imageId);
              _context10.n = 1;
              return this.set(key, thumbnailPath, ttl);
            case 1:
              return _context10.a(2, _context10.v);
          }
        }, _callee10, this);
      }));
      function cacheThumbnailPath(_x12, _x13) {
        return _cacheThumbnailPath.apply(this, arguments);
      }
      return cacheThumbnailPath;
    }()
  }, {
    key: "getCachedThumbnailPath",
    value: function () {
      var _getCachedThumbnailPath = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(imageId) {
        var key;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              key = "thumbnail:".concat(imageId);
              _context11.n = 1;
              return this.get(key);
            case 1:
              return _context11.a(2, _context11.v);
          }
        }, _callee11, this);
      }));
      function getCachedThumbnailPath(_x14) {
        return _getCachedThumbnailPath.apply(this, arguments);
      }
      return getCachedThumbnailPath;
    }() // Rate limiting par utilisateur
  }, {
    key: "checkRateLimit",
    value: function () {
      var _checkRateLimit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(userId, action) {
        var limit,
          windowSeconds,
          key,
          current,
          remaining,
          allowed,
          _args12 = arguments,
          _t9;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.p = _context12.n) {
            case 0:
              limit = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : 10;
              windowSeconds = _args12.length > 3 && _args12[3] !== undefined ? _args12[3] : 3600;
              if (this.isConnected) {
                _context12.n = 1;
                break;
              }
              return _context12.a(2, {
                allowed: true,
                remaining: limit
              });
            case 1:
              _context12.p = 1;
              key = "ratelimit:".concat(userId, ":").concat(action);
              _context12.n = 2;
              return this.increment(key, 1, windowSeconds);
            case 2:
              current = _context12.v;
              if (!(current === null)) {
                _context12.n = 3;
                break;
              }
              return _context12.a(2, {
                allowed: true,
                remaining: limit - 1
              });
            case 3:
              remaining = Math.max(0, limit - current);
              allowed = current <= limit;
              return _context12.a(2, {
                allowed: allowed,
                remaining: remaining,
                current: current,
                limit: limit,
                resetTime: windowSeconds
              });
            case 4:
              _context12.p = 4;
              _t9 = _context12.v;
              console.error("\u274C Rate limit error for ".concat(userId, ":").concat(action, ":"), _t9.message);
              return _context12.a(2, {
                allowed: true,
                remaining: limit
              });
          }
        }, _callee12, this, [[1, 4]]);
      }));
      function checkRateLimit(_x15, _x16) {
        return _checkRateLimit.apply(this, arguments);
      }
      return checkRateLimit;
    }() // Sessions utilisateur
  }, {
    key: "cacheUserSession",
    value: function () {
      var _cacheUserSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(sessionId, sessionData) {
        var ttl,
          key,
          _args13 = arguments;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              ttl = _args13.length > 2 && _args13[2] !== undefined ? _args13[2] : 7 * 24 * 3600;
              key = "session:".concat(sessionId);
              _context13.n = 1;
              return this.set(key, sessionData, ttl);
            case 1:
              return _context13.a(2, _context13.v);
          }
        }, _callee13, this);
      }));
      function cacheUserSession(_x17, _x18) {
        return _cacheUserSession.apply(this, arguments);
      }
      return cacheUserSession;
    }()
  }, {
    key: "getCachedUserSession",
    value: function () {
      var _getCachedUserSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(sessionId) {
        var key;
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.n) {
            case 0:
              key = "session:".concat(sessionId);
              _context14.n = 1;
              return this.get(key);
            case 1:
              return _context14.a(2, _context14.v);
          }
        }, _callee14, this);
      }));
      function getCachedUserSession(_x19) {
        return _getCachedUserSession.apply(this, arguments);
      }
      return getCachedUserSession;
    }()
  }, {
    key: "invalidateUserSession",
    value: function () {
      var _invalidateUserSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(sessionId) {
        var key;
        return _regenerator().w(function (_context15) {
          while (1) switch (_context15.n) {
            case 0:
              key = "session:".concat(sessionId);
              _context15.n = 1;
              return this["delete"](key);
            case 1:
              return _context15.a(2, _context15.v);
          }
        }, _callee15, this);
      }));
      function invalidateUserSession(_x20) {
        return _invalidateUserSession.apply(this, arguments);
      }
      return invalidateUserSession;
    }() // Cache des statistiques
  }, {
    key: "cacheStats",
    value: function () {
      var _cacheStats = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(statsType, data) {
        var ttl,
          key,
          _args16 = arguments;
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              ttl = _args16.length > 2 && _args16[2] !== undefined ? _args16[2] : 600;
              // 10 minutes
              key = "stats:".concat(statsType);
              _context16.n = 1;
              return this.set(key, {
                data: data,
                generatedAt: new Date().toISOString()
              }, ttl);
            case 1:
              return _context16.a(2, _context16.v);
          }
        }, _callee16, this);
      }));
      function cacheStats(_x21, _x22) {
        return _cacheStats.apply(this, arguments);
      }
      return cacheStats;
    }()
  }, {
    key: "getCachedStats",
    value: function () {
      var _getCachedStats = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(statsType) {
        var key, cached;
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.n) {
            case 0:
              key = "stats:".concat(statsType);
              _context17.n = 1;
              return this.get(key);
            case 1:
              cached = _context17.v;
              return _context17.a(2, cached ? cached.data : null);
          }
        }, _callee17, this);
      }));
      function getCachedStats(_x23) {
        return _getCachedStats.apply(this, arguments);
      }
      return getCachedStats;
    }() // Queue des jobs d'analyse
  }, {
    key: "addAnalysisJob",
    value: function () {
      var _addAnalysisJob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(imageId) {
        var priority,
          queueKey,
          job,
          _args18 = arguments,
          _t0;
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.p = _context18.n) {
            case 0:
              priority = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : 'normal';
              if (this.isConnected) {
                _context18.n = 1;
                break;
              }
              return _context18.a(2, false);
            case 1:
              _context18.p = 1;
              queueKey = "queue:analysis:".concat(priority);
              job = {
                imageId: imageId,
                addedAt: new Date().toISOString(),
                priority: priority
              };
              _context18.n = 2;
              return this.redis.lpush(queueKey, JSON.stringify(job));
            case 2:
              return _context18.a(2, true);
            case 3:
              _context18.p = 3;
              _t0 = _context18.v;
              console.error("\u274C Erreur ajout job analyse ".concat(imageId, ":"), _t0.message);
              return _context18.a(2, false);
          }
        }, _callee18, this, [[1, 3]]);
      }));
      function addAnalysisJob(_x24) {
        return _addAnalysisJob.apply(this, arguments);
      }
      return addAnalysisJob;
    }()
  }, {
    key: "getNextAnalysisJob",
    value: function () {
      var _getNextAnalysisJob = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19() {
        var priority,
          queueKey,
          job,
          _args19 = arguments,
          _t1;
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.p = _context19.n) {
            case 0:
              priority = _args19.length > 0 && _args19[0] !== undefined ? _args19[0] : 'normal';
              if (this.isConnected) {
                _context19.n = 1;
                break;
              }
              return _context19.a(2, null);
            case 1:
              _context19.p = 1;
              queueKey = "queue:analysis:".concat(priority);
              _context19.n = 2;
              return this.redis.rpop(queueKey);
            case 2:
              job = _context19.v;
              return _context19.a(2, job ? JSON.parse(job) : null);
            case 3:
              _context19.p = 3;
              _t1 = _context19.v;
              console.error("\u274C Erreur r\xE9cup\xE9ration job analyse:", _t1.message);
              return _context19.a(2, null);
          }
        }, _callee19, this, [[1, 3]]);
      }));
      function getNextAnalysisJob() {
        return _getNextAnalysisJob.apply(this, arguments);
      }
      return getNextAnalysisJob;
    }() // Notifications temps réel
  }, {
    key: "publishNotification",
    value: function () {
      var _publishNotification = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(channel, data) {
        var _t10;
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.p = _context20.n) {
            case 0:
              if (this.isConnected) {
                _context20.n = 1;
                break;
              }
              return _context20.a(2, false);
            case 1:
              _context20.p = 1;
              _context20.n = 2;
              return this.redis.publish(channel, JSON.stringify(_objectSpread(_objectSpread({}, data), {}, {
                timestamp: new Date().toISOString()
              })));
            case 2:
              return _context20.a(2, true);
            case 3:
              _context20.p = 3;
              _t10 = _context20.v;
              console.error("\u274C Erreur publication notification:", _t10.message);
              return _context20.a(2, false);
          }
        }, _callee20, this, [[1, 3]]);
      }));
      function publishNotification(_x25, _x26) {
        return _publishNotification.apply(this, arguments);
      }
      return publishNotification;
    }() // Nettoyage du cache
  }, {
    key: "cleanup",
    value: function () {
      var _cleanup = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21() {
        var patterns, totalCleaned, _i, _patterns, pattern, cleaned, _t11;
        return _regenerator().w(function (_context21) {
          while (1) switch (_context21.p = _context21.n) {
            case 0:
              if (this.isConnected) {
                _context21.n = 1;
                break;
              }
              return _context21.a(2, {
                cleaned: 0
              });
            case 1:
              _context21.p = 1;
              patterns = ['analysis:*',
              // Analyses anciennes
              'session:*',
              // Sessions expirées
              'ratelimit:*' // Rate limits anciens
              ];
              totalCleaned = 0;
              _i = 0, _patterns = patterns;
            case 2:
              if (!(_i < _patterns.length)) {
                _context21.n = 5;
                break;
              }
              pattern = _patterns[_i];
              _context21.n = 3;
              return this.deletePattern(pattern);
            case 3:
              cleaned = _context21.v;
              totalCleaned += cleaned;
            case 4:
              _i++;
              _context21.n = 2;
              break;
            case 5:
              console.log("\uD83E\uDDF9 Cache cleanup: ".concat(totalCleaned, " cl\xE9s supprim\xE9es"));
              return _context21.a(2, {
                cleaned: totalCleaned
              });
            case 6:
              _context21.p = 6;
              _t11 = _context21.v;
              console.error('❌ Erreur cleanup cache:', _t11.message);
              return _context21.a(2, {
                cleaned: 0
              });
          }
        }, _callee21, this, [[1, 6]]);
      }));
      function cleanup() {
        return _cleanup.apply(this, arguments);
      }
      return cleanup;
    }() // Statistiques du cache
  }, {
    key: "getStats",
    value: function () {
      var _getStats = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
        var info, dbInfo, _t12, _t13, _t14, _t15, _t16, _t17;
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.p = _context22.n) {
            case 0:
              if (this.isConnected) {
                _context22.n = 1;
                break;
              }
              return _context22.a(2, null);
            case 1:
              _context22.p = 1;
              _context22.n = 2;
              return this.redis.info('memory');
            case 2:
              info = _context22.v;
              _context22.n = 3;
              return this.redis.info('keyspace');
            case 3:
              dbInfo = _context22.v;
              _t12 = this.isConnected;
              _t13 = this.parseRedisMemoryInfo(info);
              _t14 = this.parseRedisKeyspaceInfo(dbInfo);
              _context22.n = 4;
              return this.redis.get('uptime');
            case 4:
              _t15 = _context22.v;
              if (_t15) {
                _context22.n = 5;
                break;
              }
              _t15 = 0;
            case 5:
              _t16 = _t15;
              return _context22.a(2, {
                connected: _t12,
                memory: _t13,
                keyspace: _t14,
                uptime: _t16
              });
            case 6:
              _context22.p = 6;
              _t17 = _context22.v;
              console.error('❌ Erreur stats Redis:', _t17.message);
              return _context22.a(2, null);
          }
        }, _callee22, this, [[1, 6]]);
      }));
      function getStats() {
        return _getStats.apply(this, arguments);
      }
      return getStats;
    }()
  }, {
    key: "parseRedisMemoryInfo",
    value: function parseRedisMemoryInfo(info) {
      var lines = info.split('\n');
      var memory = {};
      var _iterator = _createForOfIteratorHelper(lines),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var line = _step.value;
          if (line.includes('used_memory_human:')) {
            memory.used = line.split(':')[1].trim();
          }
          if (line.includes('used_memory_peak_human:')) {
            memory.peak = line.split(':')[1].trim();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return memory;
    }
  }, {
    key: "parseRedisKeyspaceInfo",
    value: function parseRedisKeyspaceInfo(info) {
      var lines = info.split('\n');
      var totalKeys = 0;
      var _iterator2 = _createForOfIteratorHelper(lines),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var line = _step2.value;
          if (line.includes('db0:')) {
            var match = line.match(/keys=(\d+)/);
            if (match) {
              totalKeys = parseInt(match[1]);
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return {
        totalKeys: totalKeys
      };
    }

    // Fermer la connexion proprement
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23() {
        return _regenerator().w(function (_context23) {
          while (1) switch (_context23.n) {
            case 0:
              if (!(this.redis && this.isConnected)) {
                _context23.n = 2;
                break;
              }
              _context23.n = 1;
              return this.redis.quit();
            case 1:
              console.log('✅ Redis déconnecté proprement');
            case 2:
              return _context23.a(2);
          }
        }, _callee23, this);
      }));
      function disconnect() {
        return _disconnect.apply(this, arguments);
      }
      return disconnect;
    }()
  }]);
}();
module.exports = new CacheService();