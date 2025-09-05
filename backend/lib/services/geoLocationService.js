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
var crypto = require('crypto');

// =====================================
// SERVICE GÉOLOCALISATION FORENSIQUE AVANCÉ
// =====================================
var GeoLocationService = /*#__PURE__*/function () {
  function GeoLocationService() {
    _classCallCheck(this, GeoLocationService);
    this.earthRadiusKm = 6371;
    this.earthRadiusM = 6371000;
    this.geocodingCache = new Map();
    this.suspiciousLocations = this.loadSuspiciousLocations();
  }

  /**
   * Calcule la distance entre deux points GPS avec précision forensique
   */
  return _createClass(GeoLocationService, [{
    key: "calculateDistance",
    value: function calculateDistance(gps1, gps2) {
      var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'meters';
      try {
        if (!this.validateGPSCoordinates(gps1) || !this.validateGPSCoordinates(gps2)) {
          return {
            distance: null,
            error: 'Coordonnées GPS invalides',
            valid: false
          };
        }
        var lat1Rad = this.toRadians(gps1.latitude);
        var lat2Rad = this.toRadians(gps2.latitude);
        var deltaLatRad = this.toRadians(gps2.latitude - gps1.latitude);
        var deltaLonRad = this.toRadians(gps2.longitude - gps1.longitude);

        // Formule de Haversine pour précision maximale
        var a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var distance;
        switch (unit) {
          case 'kilometers':
          case 'km':
            distance = this.earthRadiusKm * c;
            break;
          case 'miles':
            distance = this.earthRadiusKm * c * 0.621371;
            break;
          case 'meters':
          case 'm':
          default:
            distance = this.earthRadiusM * c;
            break;
        }
        return {
          distance: Math.round(distance * 1000) / 1000,
          // 3 décimales
          unit: unit,
          valid: true,
          coordinates: {
            from: gps1,
            to: gps2
          },
          bearing: this.calculateBearing(gps1, gps2),
          midpoint: this.calculateMidpoint(gps1, gps2)
        };
      } catch (error) {
        return {
          distance: null,
          error: error.message,
          valid: false
        };
      }
    }

    /**
     * Analyse forensique complète des données GPS
     */
  }, {
    key: "analyzeGPSForensics",
    value: (function () {
      var _analyzeGPSForensics = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(gpsData) {
        var imageMetadata,
          analysis,
          geographicAnalysis,
          _args = arguments,
          _t,
          _t2,
          _t3,
          _t4,
          _t5,
          _t6,
          _t7,
          _t8,
          _t9,
          _t0;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              imageMetadata = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              _context.p = 1;
              _t = {
                latitude: gpsData.latitude,
                longitude: gpsData.longitude,
                altitude: gpsData.altitude || null
              };
              _t2 = this.assessGPSAccuracy(gpsData);
              _t3 = {
                score: 100,
                flags: [],
                confidence: 'high'
              };
              _context.n = 2;
              return this.identifyLocationType(gpsData);
            case 2:
              _t4 = _context.v;
              _t5 = this.getTimezoneFromCoordinates(gpsData);
              _context.n = 3;
              return this.getCountryFromCoordinates(gpsData);
            case 3:
              _t6 = _context.v;
              _t7 = {
                type: _t4,
                timezone: _t5,
                country: _t6,
                suspicious: false
              };
              _t8 = {
                gpsTimestamp: gpsData.timestamp,
                imageTimestamp: imageMetadata.dateTimeOriginal,
                coherent: true,
                timeDifference: null
              };
              _t9 = {
                precision: this.calculatePrecision(gpsData),
                source: this.identifyGPSSource(gpsData),
                manipulation: {
                  detected: false,
                  indicators: []
                }
              };
              analysis = {
                coordinates: _t,
                accuracy: _t2,
                authenticity: _t3,
                location: _t7,
                temporal: _t8,
                technical: _t9
              };
              // Vérifications de cohérence temporelle
              if (gpsData.timestamp && imageMetadata.dateTimeOriginal) {
                analysis.temporal = this.analyzeTemporalCoherence(gpsData.timestamp, imageMetadata.dateTimeOriginal);
              }

              // Détection de manipulations GPS
              _context.n = 4;
              return this.detectGPSManipulation(gpsData);
            case 4:
              analysis.technical.manipulation = _context.v;
              // Vérification lieux suspects
              analysis.location.suspicious = this.checkSuspiciousLocation(gpsData);

              // Analyse cohérence géographique
              _context.n = 5;
              return this.analyzeGeographicCoherence(gpsData, imageMetadata);
            case 5:
              geographicAnalysis = _context.v;
              analysis.geographic = geographicAnalysis;

              // Calcul score d'authenticité final
              analysis.authenticity = this.calculateGPSAuthenticityScore(analysis);
              return _context.a(2, analysis);
            case 6:
              _context.p = 6;
              _t0 = _context.v;
              return _context.a(2, {
                error: _t0.message,
                authenticity: {
                  score: 0,
                  confidence: 'error'
                }
              });
          }
        }, _callee, this, [[1, 6]]);
      }));
      function analyzeGPSForensics(_x) {
        return _analyzeGPSForensics.apply(this, arguments);
      }
      return analyzeGPSForensics;
    }()
    /**
     * Détection de voyage impossible
     */
    )
  }, {
    key: "detectImpossibleTravel",
    value: function detectImpossibleTravel(locations) {
      var timeThreshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3600;
      if (!locations || locations.length < 2) {
        return {
          impossible: false
        };
      }
      var impossibleTravels = [];
      for (var i = 1; i < locations.length; i++) {
        var prev = locations[i - 1];
        var curr = locations[i];
        if (!prev.timestamp || !curr.timestamp) continue;
        var timeDiff = Math.abs(new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000; // secondes
        var distance = this.calculateDistance(prev, curr);
        if (distance.valid && timeDiff > 0) {
          // Vitesse maximum réaliste (avion de ligne: ~900 km/h)
          var maxSpeedKmH = 1000;
          var maxDistanceKm = timeDiff / 3600 * maxSpeedKmH;
          var actualDistanceKm = distance.distance / 1000;
          if (actualDistanceKm > maxDistanceKm) {
            impossibleTravels.push({
              from: prev,
              to: curr,
              distance: distance.distance,
              timeDifference: timeDiff,
              requiredSpeed: (actualDistanceKm / (timeDiff / 3600)).toFixed(2) + ' km/h',
              impossibilityFactor: (actualDistanceKm / maxDistanceKm).toFixed(2)
            });
          }
        }
      }
      return {
        impossible: impossibleTravels.length > 0,
        travels: impossibleTravels,
        analysis: {
          totalLocations: locations.length,
          impossibleSegments: impossibleTravels.length,
          suspicionLevel: impossibleTravels.length > 0 ? 'high' : 'none'
        }
      };
    }

    /**
     * Clustering géographique pour détection patterns
     */
  }, {
    key: "clusterLocations",
    value: function clusterLocations(locations) {
      var _this = this;
      var radiusMeters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
      if (!locations || locations.length === 0) return [];
      var clusters = [];
      var visited = new Set();
      locations.forEach(function (location, index) {
        if (visited.has(index)) return;
        var cluster = {
          center: location,
          locations: [location],
          radius: 0,
          count: 1
        };

        // Trouver toutes les locations dans le rayon
        locations.forEach(function (other, otherIndex) {
          if (otherIndex === index || visited.has(otherIndex)) return;
          var distance = _this.calculateDistance(location, other);
          if (distance.valid && distance.distance <= radiusMeters) {
            cluster.locations.push(other);
            cluster.count++;
            visited.add(otherIndex);

            // Mettre à jour le rayon du cluster
            cluster.radius = Math.max(cluster.radius, distance.distance);
          }
        });
        visited.add(index);
        clusters.push(cluster);
      });

      // Trier par nombre de locations
      return clusters.sort(function (a, b) {
        return b.count - a.count;
      });
    }

    /**
     * Vérification de cohérence avec fuseaux horaires
     */
  }, {
    key: "verifyTimezoneCoherence",
    value: function verifyTimezoneCoherence(gpsData, imageTimestamp) {
      try {
        var timezone = this.getTimezoneFromCoordinates(gpsData);
        var localTime = this.convertToTimezone(imageTimestamp, timezone);

        // Vérifier cohérence jour/nuit si possible
        var sunData = this.calculateSunPosition(gpsData, imageTimestamp);
        return {
          timezone: timezone,
          localTime: localTime,
          coherent: true,
          // À implémenter avec vraie logique
          sunPosition: sunData,
          analysis: {
            timezoneValid: timezone !== null,
            dayNightCoherent: sunData ? sunData.coherent : null
          }
        };
      } catch (error) {
        return {
          coherent: false,
          error: error.message
        };
      }
    }

    // =====================================
    // MÉTHODES UTILITAIRES
    // =====================================
  }, {
    key: "validateGPSCoordinates",
    value: function validateGPSCoordinates(gps) {
      if (!gps || _typeof(gps) !== 'object') return false;
      if (typeof gps.latitude !== 'number' || typeof gps.longitude !== 'number') return false;
      if (Math.abs(gps.latitude) > 90 || Math.abs(gps.longitude) > 180) return false;
      return true;
    }
  }, {
    key: "toRadians",
    value: function toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
  }, {
    key: "toDegrees",
    value: function toDegrees(radians) {
      return radians * (180 / Math.PI);
    }
  }, {
    key: "calculateBearing",
    value: function calculateBearing(gps1, gps2) {
      var lat1 = this.toRadians(gps1.latitude);
      var lat2 = this.toRadians(gps2.latitude);
      var deltaLon = this.toRadians(gps2.longitude - gps1.longitude);
      var y = Math.sin(deltaLon) * Math.cos(lat2);
      var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
      var bearing = this.toDegrees(Math.atan2(y, x));
      return (bearing + 360) % 360; // Normaliser 0-360
    }
  }, {
    key: "calculateMidpoint",
    value: function calculateMidpoint(gps1, gps2) {
      var lat1 = this.toRadians(gps1.latitude);
      var lat2 = this.toRadians(gps2.latitude);
      var lon1 = this.toRadians(gps1.longitude);
      var deltaLon = this.toRadians(gps2.longitude - gps1.longitude);
      var Bx = Math.cos(lat2) * Math.cos(deltaLon);
      var By = Math.cos(lat2) * Math.sin(deltaLon);
      var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By));
      var lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);
      return {
        latitude: this.toDegrees(lat3),
        longitude: this.toDegrees(lon3)
      };
    }
  }, {
    key: "assessGPSAccuracy",
    value: function assessGPSAccuracy(gpsData) {
      // Évaluer précision basée sur métadonnées disponibles
      var accuracy = 'unknown';
      var estimatedError = null;
      if (gpsData.accuracy) {
        estimatedError = gpsData.accuracy;
        if (estimatedError <= 5) accuracy = 'high';else if (estimatedError <= 20) accuracy = 'medium';else accuracy = 'low';
      } else {
        // Estimation basée sur autres facteurs
        var decimalPlaces = this.countDecimalPlaces(gpsData.latitude);
        if (decimalPlaces >= 6) accuracy = 'high';else if (decimalPlaces >= 4) accuracy = 'medium';else accuracy = 'low';
      }
      return {
        level: accuracy,
        estimatedError: estimatedError,
        decimalPrecision: this.countDecimalPlaces(gpsData.latitude)
      };
    }
  }, {
    key: "countDecimalPlaces",
    value: function countDecimalPlaces(number) {
      var str = number.toString();
      if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
        return str.split('.')[1].length;
      } else if (str.indexOf('e-') !== -1) {
        var parts = str.split('e-');
        return parseInt(parts[1], 10);
      }
      return 0;
    }
  }, {
    key: "identifyLocationType",
    value: function () {
      var _identifyLocationType = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(gpsData) {
        var types;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              // Détection type de lieu (urbain, rural, eau, etc.)
              // En production: utiliser API de géocodage
              types = ['urban', 'rural', 'water', 'mountain', 'desert', 'forest'];
              return _context2.a(2, types[Math.floor(Math.random() * types.length)]);
          }
        }, _callee2);
      }));
      function identifyLocationType(_x2) {
        return _identifyLocationType.apply(this, arguments);
      }
      return identifyLocationType;
    }()
  }, {
    key: "getTimezoneFromCoordinates",
    value: function getTimezoneFromCoordinates(gpsData) {
      // Estimation basique du fuseau horaire
      // En production: utiliser vraie API timezone
      var longitude = gpsData.longitude;
      var timezoneOffset = Math.round(longitude / 15);
      return "UTC".concat(timezoneOffset >= 0 ? '+' : '').concat(timezoneOffset);
    }
  }, {
    key: "getCountryFromCoordinates",
    value: function () {
      var _getCountryFromCoordinates = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(gpsData) {
        var cacheKey, countries, country;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              // Géocodage inverse pour obtenir le pays
              // En production: utiliser API géocodage
              cacheKey = "".concat(Math.round(gpsData.latitude * 100) / 100, ",").concat(Math.round(gpsData.longitude * 100) / 100);
              if (!this.geocodingCache.has(cacheKey)) {
                _context3.n = 1;
                break;
              }
              return _context3.a(2, this.geocodingCache.get(cacheKey));
            case 1:
              // Simulation
              countries = ['France', 'Germany', 'USA', 'Canada', 'Japan', 'Unknown'];
              country = countries[Math.floor(Math.random() * countries.length)];
              this.geocodingCache.set(cacheKey, country);
              return _context3.a(2, country);
          }
        }, _callee3, this);
      }));
      function getCountryFromCoordinates(_x3) {
        return _getCountryFromCoordinates.apply(this, arguments);
      }
      return getCountryFromCoordinates;
    }()
  }, {
    key: "analyzeTemporalCoherence",
    value: function analyzeTemporalCoherence(gpsTimestamp, imageTimestamp) {
      try {
        var gpsTime = new Date(gpsTimestamp);
        var imageTime = new Date(imageTimestamp);
        var timeDiff = Math.abs(gpsTime - imageTime) / 1000; // secondes

        var coherent = true;
        var flags = [];

        // Plus de 1 heure de différence = suspect
        if (timeDiff > 3600) {
          coherent = false;
          flags.push('LARGE_TIME_DIFFERENCE');
        }

        // GPS dans le futur par rapport à l'image
        if (gpsTime > imageTime + 300000) {
          // 5 minutes de tolérance
          coherent = false;
          flags.push('GPS_TIMESTAMP_FUTURE');
        }
        return {
          coherent: coherent,
          timeDifference: timeDiff,
          flags: flags,
          gpsTime: gpsTime.toISOString(),
          imageTime: imageTime.toISOString()
        };
      } catch (error) {
        return {
          coherent: false,
          error: error.message
        };
      }
    }
  }, {
    key: "detectGPSManipulation",
    value: function () {
      var _detectGPSManipulation = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(gpsData) {
        var indicators, detected, precision;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              indicators = [];
              detected = false; // Coordonnées trop précises (suspectes)
              precision = this.countDecimalPlaces(gpsData.latitude);
              if (precision > 8) {
                indicators.push('EXCESSIVE_PRECISION');
                detected = true;
              }

              // Coordonnées rondes (0.000000)
              if (gpsData.latitude % 1 === 0 || gpsData.longitude % 1 === 0) {
                indicators.push('ROUND_COORDINATES');
                detected = true;
              }

              // Altitude impossible
              if (gpsData.altitude && (gpsData.altitude < -500 || gpsData.altitude > 10000)) {
                indicators.push('IMPOSSIBLE_ALTITUDE');
                detected = true;
              }
              return _context4.a(2, {
                detected: detected,
                indicators: indicators,
                confidence: detected ? indicators.length > 2 ? 'high' : 'medium' : 'low'
              });
          }
        }, _callee4, this);
      }));
      function detectGPSManipulation(_x4) {
        return _detectGPSManipulation.apply(this, arguments);
      }
      return detectGPSManipulation;
    }()
  }, {
    key: "checkSuspiciousLocation",
    value: function checkSuspiciousLocation(gpsData) {
      var _this2 = this;
      // Vérifier contre base de lieux suspects
      return this.suspiciousLocations.some(function (location) {
        var distance = _this2.calculateDistance(gpsData, location);
        return distance.valid && distance.distance < 1000; // 1km de rayon
      });
    }
  }, {
    key: "analyzeGeographicCoherence",
    value: function () {
      var _analyzeGeographicCoherence = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(gpsData, imageMetadata) {
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              return _context5.a(2, {
                climateCoherent: true,
                // À implémenter
                terrainCoherent: true,
                // À implémenter
                urbanizationCoherent: true,
                // À implémenter
                analysis: 'Geographic coherence analysis placeholder'
              });
          }
        }, _callee5);
      }));
      function analyzeGeographicCoherence(_x5, _x6) {
        return _analyzeGeographicCoherence.apply(this, arguments);
      }
      return analyzeGeographicCoherence;
    }()
  }, {
    key: "calculateGPSAuthenticityScore",
    value: function calculateGPSAuthenticityScore(analysis) {
      var score = 100;
      var flags = [];

      // Pénalités
      if (!analysis.temporal.coherent) {
        score -= 30;
        flags.push('TEMPORAL_INCOHERENCE');
      }
      if (analysis.technical.manipulation.detected) {
        score -= 40;
        flags.push('MANIPULATION_DETECTED');
      }
      if (analysis.location.suspicious) {
        score -= 20;
        flags.push('SUSPICIOUS_LOCATION');
      }
      if (analysis.accuracy.level === 'low') {
        score -= 10;
        flags.push('LOW_ACCURACY');
      }
      score = Math.max(0, score);
      return {
        score: score,
        flags: flags,
        confidence: score > 80 ? 'high' : score > 50 ? 'medium' : 'low'
      };
    }
  }, {
    key: "calculatePrecision",
    value: function calculatePrecision(gpsData) {
      var latPrecision = this.countDecimalPlaces(gpsData.latitude);
      var lonPrecision = this.countDecimalPlaces(gpsData.longitude);
      return Math.min(latPrecision, lonPrecision);
    }
  }, {
    key: "identifyGPSSource",
    value: function identifyGPSSource(gpsData) {
      // Identifier source GPS basée sur patterns
      if (gpsData.altitude && gpsData.accuracy) return 'smartphone';
      if (this.countDecimalPlaces(gpsData.latitude) <= 4) return 'basic_gps';
      return 'unknown';
    }
  }, {
    key: "convertToTimezone",
    value: function convertToTimezone(timestamp, timezone) {
      // Conversion basique - en production utiliser library spécialisée
      return new Date(timestamp).toISOString();
    }
  }, {
    key: "calculateSunPosition",
    value: function calculateSunPosition(gpsData, timestamp) {
      // Calcul position solaire pour vérification jour/nuit
      // Implémentation simplifiée
      return {
        coherent: true,
        sunrise: '06:00',
        sunset: '18:00',
        daylight: Math.random() > 0.5
      };
    }
  }, {
    key: "loadSuspiciousLocations",
    value: function loadSuspiciousLocations() {
      // Base de lieux suspects pour vérification
      return [{
        latitude: 0,
        longitude: 0
      },
      // Null Island
      {
        latitude: 37.7749,
        longitude: -122.4194
      } // San Francisco (exemple)
      ];
    }
  }]);
}();
module.exports = new GeoLocationService();