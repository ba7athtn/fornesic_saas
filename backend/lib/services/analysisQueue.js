"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Bull = require('bull');
var redis = require('redis');

// Configuration Redis (optionnel, utilise mémoire par défaut)
var analysisQueue = new Bull('forensic analysis', {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1'
  },
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

// ✅ Processeur d'analyse forensique asynchrone
analysisQueue.process('forensic-analysis', 5, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(job) {
    var _job$data, imageId, filePath, _Image, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _job$data = job.data, imageId = _job$data.imageId, filePath = _job$data.filePath;
          _context.p = 1;
          console.log("\uD83D\uDD0D D\xE9but analyse forensique asynchrone: ".concat(imageId));

          // Mettre à jour le statut
          _Image = require('../models/Image');
          _context.n = 2;
          return _Image.findByIdAndUpdate(imageId, {
            status: 'analyzing',
            'forensicAnalysis.startedAt': new Date()
          });
        case 2:
          _context.n = 3;
          return performForensicAnalysis(filePath, imageId, function (progress) {
            job.progress(progress);
          });
        case 3:
          _context.n = 4;
          return _Image.findByIdAndUpdate(imageId, {
            status: 'analyzed',
            'forensicAnalysis.completedAt': new Date()
          });
        case 4:
          console.log("\u2705 Analyse forensique termin\xE9e: ".concat(imageId));
          return _context.a(2, {
            success: true,
            imageId: imageId
          });
        case 5:
          _context.p = 5;
          _t = _context.v;
          console.error("\u274C Erreur analyse forensique ".concat(imageId, ":"), _t);

          // Marquer comme échoué
          _context.n = 6;
          return Image.findByIdAndUpdate(imageId, {
            status: 'failed',
            'forensicAnalysis.error': _t.message
          });
        case 6:
          throw _t;
        case 7:
          return _context.a(2);
      }
    }, _callee, null, [[1, 5]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());

// ✅ Fonction d'analyse forensique (remplacez par votre logique)
function performForensicAnalysis(_x2, _x3, _x4) {
  return _performForensicAnalysis.apply(this, arguments);
} // ✅ Fonction pour ajouter une tâche à la queue
function _performForensicAnalysis() {
  _performForensicAnalysis = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(filePath, imageId, progressCallback) {
    var pillars, i, pillar, progress;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          // Simuler les 7 piliers d'analyse
          pillars = ['anatomical', 'physics', 'statistical', 'exif', 'behavioral', 'audio', 'expert'];
          i = 0;
        case 1:
          if (!(i < pillars.length)) {
            _context2.n = 4;
            break;
          }
          pillar = pillars[i];
          console.log("\uD83D\uDD0D Analyse ".concat(pillar, " pour ").concat(imageId));

          // Simuler traitement (remplacez par votre vraie logique)
          _context2.n = 2;
          return new Promise(function (resolve) {
            return setTimeout(resolve, 1000 + Math.random() * 2000);
          });
        case 2:
          progress = Math.round((i + 1) / pillars.length * 100);
          progressCallback(progress);
          console.log("\u2705 ".concat(pillar, " termin\xE9 (").concat(progress, "%)"));
        case 3:
          i++;
          _context2.n = 1;
          break;
        case 4:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return _performForensicAnalysis.apply(this, arguments);
}
var addAnalysisJob = function addAnalysisJob(imageId, filePath) {
  return analysisQueue.add('forensic-analysis', {
    imageId: imageId,
    filePath: filePath
  }, {
    priority: 1,
    delay: 0
  });
};
module.exports = {
  analysisQueue: analysisQueue,
  addAnalysisJob: addAnalysisJob
};