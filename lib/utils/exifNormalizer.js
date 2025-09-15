"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var crypto = require('crypto');

// =====================================
// NORMALISEUR EXIF FORENSIQUE COMPLET
// =====================================
var ExifNormalizer = /*#__PURE__*/function () {
  function ExifNormalizer() {
    _classCallCheck(this, ExifNormalizer);
    this.orientationMap = new Map([
    // Valeurs numériques standard
    [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8],
    // Valeurs textuelles communes
    ['horizontal (normal)', 1], ['normal', 1], ['top-left', 1], ['mirror horizontal', 2], ['top-right', 2], ['rotate 180', 3], ['bottom-right', 3], ['mirror vertical', 4], ['bottom-left', 4], ['mirror horizontal and rotate 270 cw', 5], ['left-top', 5], ['rotate 90 cw', 6], ['rotate 90', 6], ['right-top', 6], ['mirror horizontal and rotate 90 cw', 7], ['right-bottom', 7], ['rotate 270 cw', 8], ['rotate 270', 8], ['left-bottom', 8]]);
    this.resolutionUnitMap = new Map([[1, 'none'], [2, 'inches'], [3, 'centimeters'], ['none', 1], ['inches', 2], ['centimeters', 3]]);
    this.colorSpaceMap = new Map([[1, 'sRGB'], [2, 'Adobe RGB'], [65535, 'Uncalibrated'], ['sRGB', 1], ['Adobe RGB', 2], ['Uncalibrated', 65535]]);
  }

  /**
   * Normalisation complète des données EXIF avec validation forensique
   */
  return _createClass(ExifNormalizer, [{
    key: "normalizeExifData",
    value: function normalizeExifData(rawExifData) {
      if (!this.isValidExifInput(rawExifData)) {
        return null;
      }
      var normalized = {
        camera: this.normalizeCamera(rawExifData.camera || rawExifData),
        technical: this.normalizeTechnical(rawExifData.technical || rawExifData),
        timestamps: this.normalizeTimestamps(rawExifData.timestamps || rawExifData),
        gps: this.normalizeGps(rawExifData.gps || rawExifData),
        software: this.normalizeSoftware(rawExifData.software || rawExifData),
        dimensions: this.normalizeDimensions(rawExifData.dimensions || rawExifData),
        // Métadonnées de normalisation
        normalizationMetadata: {
          version: '3.0.0',
          normalizedAt: new Date().toISOString(),
          originalFieldsCount: this.countFields(rawExifData),
          normalizedFieldsCount: 0,
          warnings: [],
          errors: []
        }
      };

      // Post-traitement et validation
      this.validateNormalizedData(normalized);
      this.calculateCompletenessScore(normalized);

      // Compter les champs normalisés
      normalized.normalizationMetadata.normalizedFieldsCount = this.countFields(normalized) - 1; // -1 pour exclure normalizationMetadata

      console.log("\uD83D\uDCCA EXIF normalis\xE9: ".concat(normalized.normalizationMetadata.normalizedFieldsCount, " champs"));
      return normalized;
    }

    /**
     * Normalisation des informations caméra
     */
  }, {
    key: "normalizeCamera",
    value: function normalizeCamera(cameraData) {
      if (!cameraData) return {};
      var camera = {};

      // Marque et modèle
      camera.make = this.normalizeString(cameraData.Make || cameraData.make);
      camera.model = this.normalizeString(cameraData.Model || cameraData.model);

      // Numéro de série
      camera.serialNumber = this.normalizeString(cameraData.SerialNumber || cameraData.serialNumber || cameraData.BodySerialNumber || cameraData.CameraSerialNumber);

      // Informations objectif
      camera.lens = {
        model: this.normalizeString(cameraData.LensModel || cameraData.LensMake),
        make: this.normalizeString(cameraData.LensMake),
        serialNumber: this.normalizeString(cameraData.LensSerialNumber),
        focalLength: this.normalizeNumeric(cameraData.FocalLength),
        maxAperture: this.normalizeNumeric(cameraData.MaxApertureValue)
      };

      // Firmware et version
      camera.firmware = this.normalizeString(cameraData.FirmwareVersion || cameraData.firmware || cameraData.InternalVersion);

      // Propriétaire
      camera.owner = this.normalizeString(cameraData.CameraOwnerName || cameraData.OwnerName || cameraData.Artist);
      return this.cleanEmptyFields(camera);
    }

    /**
     * Normalisation des paramètres techniques
     */
  }, {
    key: "normalizeTechnical",
    value: function normalizeTechnical(techData) {
      if (!techData) return {};
      var technical = {};

      // Paramètres d'exposition
      technical.iso = this.normalizeISO(techData.ISO || techData.ISOSpeedRatings || techData.iso || techData.RecommendedExposureIndex);
      technical.aperture = this.normalizeAperture(techData.FNumber || techData.ApertureValue || techData.aperture);
      technical.shutterSpeed = this.normalizeShutterSpeed(techData.ExposureTime || techData.ShutterSpeedValue || techData.shutterSpeed);
      technical.exposureCompensation = this.normalizeNumeric(techData.ExposureCompensation);

      // Modes d'exposition
      technical.exposureProgram = this.normalizeExposureProgram(techData.ExposureProgram);
      technical.meteringMode = this.normalizeMeteringMode(techData.MeteringMode);

      // Flash
      technical.flash = this.normalizeFlash(techData.Flash || techData.flash);

      // Focale et mise au point
      technical.focalLength = this.normalizeFocalLength(techData.FocalLength);
      technical.focalLength35mm = this.normalizeNumeric(techData.FocalLengthIn35mmFormat);
      technical.subjectDistance = this.normalizeNumeric(techData.SubjectDistance);

      // Balance des blancs et couleur
      technical.whiteBalance = this.normalizeWhiteBalance(techData.WhiteBalance);
      technical.colorSpace = this.normalizeColorSpace(techData.ColorSpace);

      // Qualité et netteté
      technical.saturation = this.normalizeQualitySetting(techData.Saturation);
      technical.contrast = this.normalizeQualitySetting(techData.Contrast);
      technical.sharpness = this.normalizeQualitySetting(techData.Sharpness);

      // Orientation
      technical.orientation = this.normalizeOrientation(techData.Orientation || techData.orientation);
      return this.cleanEmptyFields(technical);
    }

    /**
     * Normalisation des timestamps
     */
  }, {
    key: "normalizeTimestamps",
    value: function normalizeTimestamps(timestampData) {
      if (!timestampData) return {};
      var timestamps = {};

      // Timestamps principaux
      timestamps.dateTimeOriginal = this.normalizeDateTime(timestampData.DateTimeOriginal || timestampData.dateTimeOriginal);
      timestamps.createDate = this.normalizeDateTime(timestampData.CreateDate || timestampData.DateTime || timestampData.createDate);
      timestamps.modifyDate = this.normalizeDateTime(timestampData.ModifyDate || timestampData.modifyDate);
      timestamps.digitizedDate = this.normalizeDateTime(timestampData.DateTimeDigitized || timestampData.digitizedDate);

      // Fuseaux horaires
      timestamps.offsetTime = this.normalizeString(timestampData.OffsetTime);
      timestamps.offsetTimeOriginal = this.normalizeString(timestampData.OffsetTimeOriginal);
      timestamps.offsetTimeDigitized = this.normalizeString(timestampData.OffsetTimeDigitized);

      // Sous-secondes
      timestamps.subSecTime = this.normalizeString(timestampData.SubSecTime);
      timestamps.subSecTimeOriginal = this.normalizeString(timestampData.SubSecTimeOriginal);
      timestamps.subSecTimeDigitized = this.normalizeString(timestampData.SubSecTimeDigitized);
      return this.cleanEmptyFields(timestamps);
    }

    /**
     * Normalisation des données GPS
     */
  }, {
    key: "normalizeGps",
    value: function normalizeGps(gpsData) {
      if (!gpsData) return {};
      var gps = {};

      // Coordonnées principales
      gps.latitude = this.normalizeCoordinate(gpsData.GPSLatitude || gpsData.latitude);
      gps.longitude = this.normalizeCoordinate(gpsData.GPSLongitude || gpsData.longitude);
      gps.altitude = this.normalizeAltitude(gpsData.GPSAltitude || gpsData.altitude);
      gps.altitudeRef = this.normalizeNumeric(gpsData.GPSAltitudeRef);

      // Direction et mouvement
      gps.direction = this.normalizeDirection(gpsData.GPSImgDirection || gpsData.direction);
      gps.speed = this.normalizeSpeed(gpsData.GPSSpeed || gpsData.speed);
      gps.speedRef = this.normalizeString(gpsData.GPSSpeedRef);
      gps.track = this.normalizeDirection(gpsData.GPSTrack);

      // Timestamp GPS
      gps.dateStamp = this.normalizeString(gpsData.GPSDateStamp);
      gps.timeStamp = this.normalizeGPSTime(gpsData.GPSTimeStamp);

      // Métadonnées GPS
      gps.processingMethod = this.normalizeString(gpsData.GPSProcessingMethod);
      gps.mapDatum = this.normalizeString(gpsData.GPSMapDatum);
      gps.versionID = this.normalizeString(gpsData.GPSVersionID);

      // Validation coordonnées
      if (gps.latitude !== null && gps.longitude !== null) {
        gps.valid = this.validateCoordinates(gps.latitude, gps.longitude);
      }
      return this.cleanEmptyFields(gps);
    }

    /**
     * Normalisation des informations logiciels
     */
  }, {
    key: "normalizeSoftware",
    value: function normalizeSoftware(softwareData) {
      if (!softwareData) return {};
      var software = {};

      // Créateur et logiciel
      software.creator = this.normalizeString(softwareData.Software || softwareData.CreatorTool || softwareData.creator || softwareData.Artist);
      software.processingHistory = this.normalizeProcessingHistory(softwareData.ProcessingSoftware || softwareData.processingHistory);

      // Versions
      software.exifVersion = this.normalizeString(softwareData.ExifVersion);
      software.flashpixVersion = this.normalizeString(softwareData.FlashpixVersion);

      // Copyright et droits
      software.copyright = this.normalizeString(softwareData.Copyright || softwareData.Rights);
      software.description = this.normalizeString(softwareData.ImageDescription || softwareData.Description);
      software.userComment = this.normalizeString(softwareData.UserComment);

      // Identifiants uniques
      software.documentID = this.normalizeString(softwareData.DocumentID);
      software.instanceID = this.normalizeString(softwareData.InstanceID);
      software.imageUniqueID = this.normalizeString(softwareData.ImageUniqueID);
      return this.cleanEmptyFields(software);
    }

    /**
     * Normalisation des dimensions
     */
  }, {
    key: "normalizeDimensions",
    value: function normalizeDimensions(dimensionData) {
      if (!dimensionData) return {};
      var dimensions = {};

      // Dimensions principales
      dimensions.width = this.normalizePositiveInteger(dimensionData.ImageWidth || dimensionData.ExifImageWidth || dimensionData.PixelXDimension || dimensionData.width);
      dimensions.height = this.normalizePositiveInteger(dimensionData.ImageHeight || dimensionData.ImageLength || dimensionData.ExifImageHeight || dimensionData.PixelYDimension || dimensionData.height);

      // Résolution
      dimensions.xResolution = this.normalizeNumeric(dimensionData.XResolution);
      dimensions.yResolution = this.normalizeNumeric(dimensionData.YResolution);
      dimensions.resolutionUnit = this.normalizeResolutionUnit(dimensionData.ResolutionUnit);

      // Caractéristiques pixel
      dimensions.bitsPerSample = this.normalizePositiveInteger(dimensionData.BitsPerSample);
      dimensions.samplesPerPixel = this.normalizePositiveInteger(dimensionData.SamplesPerPixel);
      dimensions.compression = this.normalizeString(dimensionData.Compression);
      return this.cleanEmptyFields(dimensions);
    }

    // =====================================
    // MÉTHODES DE NORMALISATION SPÉCIALISÉES
    // =====================================
  }, {
    key: "normalizeOrientation",
    value: function normalizeOrientation(value) {
      if (value == null || value === '') return null;

      // Si c'est déjà un nombre valide
      if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 8) {
        return value;
      }

      // Si c'est une chaîne
      if (typeof value === 'string') {
        var normalized = value.toLowerCase().trim();
        if (this.orientationMap.has(normalized)) {
          return this.orientationMap.get(normalized);
        }

        // Tentative de parsing numérique
        var parsed = parseInt(normalized, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 8) {
          return parsed;
        }
      }
      console.warn("\u26A0\uFE0F Orientation non reconnue: \"".concat(value, "\""));
      return null;
    }
  }, {
    key: "normalizeISO",
    value: function normalizeISO(value) {
      var iso = this.normalizePositiveInteger(value);

      // Validation gamme ISO réaliste
      if (iso !== null && (iso < 25 || iso > 409600)) {
        console.warn("\u26A0\uFE0F ISO suspect: ".concat(iso));
      }
      return iso;
    }
  }, {
    key: "normalizeAperture",
    value: function normalizeAperture(value) {
      if (value == null) return null;

      // Si c'est une chaîne comme "f/2.8"
      if (typeof value === 'string') {
        var match = value.match(/f?\/?([\d.]+)/i);
        if (match) {
          value = parseFloat(match[1]);
        }
      }
      var aperture = this.normalizeNumeric(value);

      // Validation gamme ouverture
      if (aperture !== null && (aperture < 0.5 || aperture > 64)) {
        console.warn("\u26A0\uFE0F Ouverture suspecte: f/".concat(aperture));
      }
      return aperture;
    }
  }, {
    key: "normalizeShutterSpeed",
    value: function normalizeShutterSpeed(value) {
      if (value == null) return null;

      // Si c'est déjà un nombre
      if (typeof value === 'number') {
        return value;
      }

      // Si c'est une fraction comme "1/60"
      if (typeof value === 'string') {
        var fractionMatch = value.match(/^(\d+)\/(\d+)$/);
        if (fractionMatch) {
          return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
        }

        // Si c'est un nombre en string
        var parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      return null;
    }
  }, {
    key: "normalizeFocalLength",
    value: function normalizeFocalLength(value) {
      var focal = this.normalizeNumeric(value);

      // Validation gamme focale
      if (focal !== null && (focal < 1 || focal > 2000)) {
        console.warn("\u26A0\uFE0F Focale suspecte: ".concat(focal, "mm"));
      }
      return focal;
    }
  }, {
    key: "normalizeFlash",
    value: function normalizeFlash(value) {
      if (value == null) return null;
      var flash = {
        fired: null,
        mode: null,
        redEyeReduction: null
      };
      if (typeof value === 'number') {
        flash.fired = (value & 0x01) === 0x01;
        flash.redEyeReduction = (value & 0x40) === 0x40;
        flash.mode = this.decodeFlashMode(value);
      } else if (_typeof(value) === 'object') {
        flash.fired = value.fired;
        flash.mode = value.mode;
        flash.redEyeReduction = value.redEyeReduction;
      }
      return flash;
    }
  }, {
    key: "normalizeDateTime",
    value: function normalizeDateTime(value) {
      if (!value) return null;
      try {
        // Format EXIF standard: "YYYY:MM:DD HH:MM:SS"
        var dateStr = value.toString();

        // Remplacer les : par - dans la partie date
        if (dateStr.includes(':') && !dateStr.includes('T')) {
          dateStr = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
        }
        var date = new Date(dateStr);
        return isNaN(date.getTime()) ? null : date.toISOString();
      } catch (error) {
        console.warn("\u26A0\uFE0F Date invalide: \"".concat(value, "\""));
        return null;
      }
    }
  }, {
    key: "normalizeCoordinate",
    value: function normalizeCoordinate(value) {
      if (value == null) return null;
      var coord = this.normalizeNumeric(value);

      // Validation coordonnées GPS
      if (coord !== null && Math.abs(coord) > 180) {
        console.warn("\u26A0\uFE0F Coordonn\xE9e invalide: ".concat(coord));
        return null;
      }
      return coord;
    }
  }, {
    key: "normalizeAltitude",
    value: function normalizeAltitude(value) {
      var altitude = this.normalizeNumeric(value);

      // Validation altitude
      if (altitude !== null && (altitude < -1000 || altitude > 15000)) {
        console.warn("\u26A0\uFE0F Altitude suspecte: ".concat(altitude, "m"));
      }
      return altitude;
    }
  }, {
    key: "normalizeDirection",
    value: function normalizeDirection(value) {
      var direction = this.normalizeNumeric(value);

      // Validation direction (0-360°)
      if (direction !== null && (direction < 0 || direction > 360)) {
        console.warn("\u26A0\uFE0F Direction invalide: ".concat(direction, "\xB0"));
        return null;
      }
      return direction;
    }
  }, {
    key: "normalizeSpeed",
    value: function normalizeSpeed(value) {
      var speed = this.normalizeNumeric(value);

      // Validation vitesse
      if (speed !== null && (speed < 0 || speed > 1000)) {
        console.warn("\u26A0\uFE0F Vitesse suspecte: ".concat(speed));
      }
      return speed;
    }
  }, {
    key: "normalizeGPSTime",
    value: function normalizeGPSTime(value) {
      if (!value) return null;

      // Si c'est un array [H, M, S]
      if (Array.isArray(value) && value.length === 3) {
        var _value$map = value.map(function (v) {
            return parseInt(v);
          }),
          _value$map2 = _slicedToArray(_value$map, 3),
          h = _value$map2[0],
          m = _value$map2[1],
          s = _value$map2[2];
        return "".concat(String(h).padStart(2, '0'), ":").concat(String(m).padStart(2, '0'), ":").concat(String(s).padStart(2, '0'));
      }
      return this.normalizeString(value);
    }
  }, {
    key: "normalizeColorSpace",
    value: function normalizeColorSpace(value) {
      if (value == null) return null;
      if (typeof value === 'number') {
        return this.colorSpaceMap.get(value) || "Unknown (".concat(value, ")");
      }
      return this.normalizeString(value);
    }
  }, {
    key: "normalizeWhiteBalance",
    value: function normalizeWhiteBalance(value) {
      if (value == null) return null;
      var wbMap = {
        0: 'Auto',
        1: 'Manual',
        'auto': 'Auto',
        'manual': 'Manual'
      };
      return wbMap[value] || this.normalizeString(value);
    }
  }, {
    key: "normalizeExposureProgram",
    value: function normalizeExposureProgram(value) {
      if (value == null) return null;
      var progMap = {
        0: 'Not defined',
        1: 'Manual',
        2: 'Normal program',
        3: 'Aperture priority',
        4: 'Shutter priority',
        5: 'Creative program',
        6: 'Action program',
        7: 'Portrait mode',
        8: 'Landscape mode'
      };
      return progMap[value] || "Unknown (".concat(value, ")");
    }
  }, {
    key: "normalizeMeteringMode",
    value: function normalizeMeteringMode(value) {
      if (value == null) return null;
      var modeMap = {
        0: 'Unknown',
        1: 'Average',
        2: 'Center weighted average',
        3: 'Spot',
        4: 'Multi spot',
        5: 'Pattern',
        6: 'Partial'
      };
      return modeMap[value] || "Unknown (".concat(value, ")");
    }
  }, {
    key: "normalizeResolutionUnit",
    value: function normalizeResolutionUnit(value) {
      if (value == null) return null;
      if (typeof value === 'number') {
        return this.resolutionUnitMap.get(value) || "Unknown (".concat(value, ")");
      }
      return this.normalizeString(value);
    }
  }, {
    key: "normalizeQualitySetting",
    value: function normalizeQualitySetting(value) {
      if (value == null) return null;
      var qualityMap = {
        0: 'Normal',
        1: 'Soft',
        2: 'Hard'
      };
      return qualityMap[value] || this.normalizeString(value);
    }
  }, {
    key: "normalizeProcessingHistory",
    value: function normalizeProcessingHistory(value) {
      var _this = this;
      if (!value) return [];
      if (Array.isArray(value)) {
        return value.map(function (item) {
          return _this.normalizeString(item);
        }).filter(Boolean);
      }
      if (typeof value === 'string') {
        return [this.normalizeString(value)];
      }
      return [];
    }

    // =====================================
    // MÉTHODES UTILITAIRES DE BASE
    // =====================================
  }, {
    key: "normalizeString",
    value: function normalizeString(value) {
      if (value == null) return null;
      var str = String(value).trim();

      // Valeurs vides ou invalides
      if (str === '' || str === 'Unknown' || str === 'N/A' || str === 'undefined') {
        return null;
      }

      // Nettoyer caractères de contrôle
      return str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    }
  }, {
    key: "normalizeNumeric",
    value: function normalizeNumeric(value) {
      if (value == null || value === '') return null;
      var num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
  }, {
    key: "normalizePositiveInteger",
    value: function normalizePositiveInteger(value) {
      var num = this.normalizeNumeric(value);
      return num !== null && num > 0 && Number.isInteger(num) ? num : null;
    }
  }, {
    key: "isValidExifInput",
    value: function isValidExifInput(data) {
      return data && _typeof(data) === 'object' && !Array.isArray(data);
    }
  }, {
    key: "cleanEmptyFields",
    value: function cleanEmptyFields(obj) {
      var cleaned = {};
      for (var _i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];
        if (value !== null && value !== undefined) {
          if (_typeof(value) === 'object' && !Array.isArray(value)) {
            var cleanedNested = this.cleanEmptyFields(value);
            if (Object.keys(cleanedNested).length > 0) {
              cleaned[key] = cleanedNested;
            }
          } else if (Array.isArray(value) && value.length > 0) {
            cleaned[key] = value;
          } else if (_typeof(value) !== 'object') {
            cleaned[key] = value;
          }
        }
      }
      return cleaned;
    }
  }, {
    key: "countFields",
    value: function countFields(obj) {
      var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      if (!obj || _typeof(obj) !== 'object' || depth > 5) return 0;
      var count = 0;
      for (var _i2 = 0, _Object$values = Object.values(obj); _i2 < _Object$values.length; _i2++) {
        var value = _Object$values[_i2];
        if (value !== null && value !== undefined) {
          if (_typeof(value) === 'object' && !Array.isArray(value)) {
            count += this.countFields(value, depth + 1);
          } else {
            count++;
          }
        }
      }
      return count;
    }
  }, {
    key: "validateCoordinates",
    value: function validateCoordinates(lat, lng) {
      return Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    }
  }, {
    key: "decodeFlashMode",
    value: function decodeFlashMode(flashValue) {
      var modes = {
        0x00: 'No Flash',
        0x01: 'Fired',
        0x05: 'Fired, Return not detected',
        0x07: 'Fired, Return detected',
        0x09: 'On, Fired',
        0x0D: 'On, Return not detected',
        0x0F: 'On, Return detected',
        0x10: 'Off, Did not fire',
        0x18: 'Auto, Did not fire',
        0x19: 'Auto, Fired',
        0x1D: 'Auto, Fired, Return not detected',
        0x1F: 'Auto, Fired, Return detected'
      };
      return modes[flashValue] || "Unknown (0x".concat(flashValue.toString(16), ")");
    }
  }, {
    key: "validateNormalizedData",
    value: function validateNormalizedData(normalized) {
      var warnings = normalized.normalizationMetadata.warnings;
      var errors = normalized.normalizationMetadata.errors;

      // Validation cohérence temporelle
      if (normalized.timestamps.dateTimeOriginal && normalized.timestamps.modifyDate) {
        var original = new Date(normalized.timestamps.dateTimeOriginal);
        var modified = new Date(normalized.timestamps.modifyDate);
        if (modified < original) {
          warnings.push('Date de modification antérieure à la date originale');
        }
      }

      // Validation cohérence GPS
      if (normalized.gps.latitude && normalized.gps.longitude) {
        if (!this.validateCoordinates(normalized.gps.latitude, normalized.gps.longitude)) {
          errors.push('Coordonnées GPS invalides');
        }
      }

      // Validation cohérence technique
      if (normalized.technical.iso && (normalized.technical.iso < 25 || normalized.technical.iso > 409600)) {
        warnings.push('Valeur ISO suspecte');
      }
      if (normalized.technical.aperture && (normalized.technical.aperture < 0.5 || normalized.technical.aperture > 64)) {
        warnings.push('Valeur d\'ouverture suspecte');
      }
    }
  }, {
    key: "calculateCompletenessScore",
    value: function calculateCompletenessScore(normalized) {
      var _this2 = this;
      var totalFields = 0;
      var filledFields = 0;
      var sections = ['camera', 'technical', 'timestamps', 'gps', 'software', 'dimensions'];
      sections.forEach(function (section) {
        var sectionData = normalized[section];
        if (sectionData && _typeof(sectionData) === 'object') {
          var sectionCount = _this2.countFields(sectionData);
          totalFields += _this2.getExpectedFieldCount(section);
          filledFields += sectionCount;
        }
      });
      var completenessScore = totalFields > 0 ? Math.round(filledFields / totalFields * 100) : 0;
      normalized.normalizationMetadata.completenessScore = completenessScore;
      normalized.normalizationMetadata.completenessLevel = completenessScore >= 80 ? 'excellent' : completenessScore >= 60 ? 'good' : completenessScore >= 40 ? 'partial' : 'poor';
    }
  }, {
    key: "getExpectedFieldCount",
    value: function getExpectedFieldCount(section) {
      var expectedCounts = {
        camera: 8,
        // make, model, serialNumber, lens, firmware, owner, etc.
        technical: 15,
        // iso, aperture, shutterSpeed, flash, etc.
        timestamps: 8,
        // dateTimeOriginal, createDate, etc.
        gps: 10,
        // latitude, longitude, altitude, etc.
        software: 8,
        // creator, versions, copyright, etc.
        dimensions: 8 // width, height, resolution, etc.
      };
      return expectedCounts[section] || 5;
    }

    // =====================================
    // MÉTHODES PUBLIQUES UTILITAIRES
    // =====================================

    /**
     * Validation rapide des données EXIF
     */
  }, {
    key: "validateExifConsistency",
    value: function validateExifConsistency(exifData) {
      var _exifData$technical, _exifData$technical2, _exifData$gps, _exifData$gps2;
      if (!exifData) return {
        valid: false,
        issues: ['No EXIF data']
      };
      var issues = [];
      var score = 100;

      // Vérifications de cohérence
      if ((_exifData$technical = exifData.technical) !== null && _exifData$technical !== void 0 && _exifData$technical.iso && (exifData.technical.iso < 25 || exifData.technical.iso > 102400)) {
        issues.push('ISO_OUT_OF_RANGE');
        score -= 10;
      }
      if ((_exifData$technical2 = exifData.technical) !== null && _exifData$technical2 !== void 0 && _exifData$technical2.focalLength && (exifData.technical.focalLength < 1 || exifData.technical.focalLength > 2000)) {
        issues.push('FOCAL_LENGTH_SUSPICIOUS');
        score -= 5;
      }
      if ((_exifData$gps = exifData.gps) !== null && _exifData$gps !== void 0 && _exifData$gps.latitude && (_exifData$gps2 = exifData.gps) !== null && _exifData$gps2 !== void 0 && _exifData$gps2.longitude) {
        if (!this.validateCoordinates(exifData.gps.latitude, exifData.gps.longitude)) {
          issues.push('INVALID_GPS_COORDINATES');
          score -= 15;
        }
      }
      return {
        valid: issues.length === 0,
        score: Math.max(0, score),
        issues: issues,
        isConsistent: issues.length === 0
      };
    }

    /**
     * Debug des données EXIF
     */
  }, {
    key: "debugExifData",
    value: function debugExifData(exifData) {
      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'EXIF';
      if (process.env.NODE_ENV === 'development') {
        var _exifData$normalizati;
        console.log("[".concat(label, "] Structure:"), {
          hasData: !!exifData,
          sections: exifData ? Object.keys(exifData) : [],
          fieldsCount: exifData ? this.countFields(exifData) : 0,
          completeness: (exifData === null || exifData === void 0 || (_exifData$normalizati = exifData.normalizationMetadata) === null || _exifData$normalizati === void 0 ? void 0 : _exifData$normalizati.completenessScore) || 'unknown'
        });
      }
    }

    /**
     * Création d'un résumé EXIF
     */
  }, {
    key: "createExifSummary",
    value: function createExifSummary(exifData) {
      var _exifData$camera, _exifData$camera2, _exifData$timestamps, _exifData$timestamps2, _exifData$gps3, _exifData$gps4, _exifData$software, _exifData$normalizati2, _exifData$normalizati3;
      if (!exifData) return null;
      return {
        camera: (_exifData$camera = exifData.camera) !== null && _exifData$camera !== void 0 && _exifData$camera.make && (_exifData$camera2 = exifData.camera) !== null && _exifData$camera2 !== void 0 && _exifData$camera2.model ? "".concat(exifData.camera.make, " ").concat(exifData.camera.model) : null,
        settings: this.buildSettingsSummary(exifData.technical),
        timestamp: ((_exifData$timestamps = exifData.timestamps) === null || _exifData$timestamps === void 0 ? void 0 : _exifData$timestamps.dateTimeOriginal) || ((_exifData$timestamps2 = exifData.timestamps) === null || _exifData$timestamps2 === void 0 ? void 0 : _exifData$timestamps2.createDate),
        location: (_exifData$gps3 = exifData.gps) !== null && _exifData$gps3 !== void 0 && _exifData$gps3.latitude && (_exifData$gps4 = exifData.gps) !== null && _exifData$gps4 !== void 0 && _exifData$gps4.longitude ? "".concat(exifData.gps.latitude.toFixed(6), ", ").concat(exifData.gps.longitude.toFixed(6)) : null,
        software: (_exifData$software = exifData.software) === null || _exifData$software === void 0 ? void 0 : _exifData$software.creator,
        completeness: {
          score: ((_exifData$normalizati2 = exifData.normalizationMetadata) === null || _exifData$normalizati2 === void 0 ? void 0 : _exifData$normalizati2.completenessScore) || 0,
          level: ((_exifData$normalizati3 = exifData.normalizationMetadata) === null || _exifData$normalizati3 === void 0 ? void 0 : _exifData$normalizati3.completenessLevel) || 'unknown'
        }
      };
    }
  }, {
    key: "buildSettingsSummary",
    value: function buildSettingsSummary(technical) {
      if (!technical) return null;
      var parts = [];
      if (technical.iso) parts.push("ISO ".concat(technical.iso));
      if (technical.aperture) parts.push("f/".concat(technical.aperture));
      if (technical.shutterSpeed) {
        if (technical.shutterSpeed >= 1) {
          parts.push("".concat(technical.shutterSpeed, "s"));
        } else {
          parts.push("1/".concat(Math.round(1 / technical.shutterSpeed), "s"));
        }
      }
      if (technical.focalLength) parts.push("".concat(technical.focalLength, "mm"));
      return parts.length > 0 ? parts.join(' • ') : null;
    }
  }]);
}(); // =====================================
// EXPORT SINGLETON ET FONCTIONS
// =====================================
var normalizer = new ExifNormalizer();

// Fonctions legacy pour compatibilité
var normalizeExifData = function normalizeExifData(data) {
  return normalizer.normalizeExifData(data);
};
var normalizeOrientation = function normalizeOrientation(value) {
  return normalizer.normalizeOrientation(value);
};
var validateExifConsistency = function validateExifConsistency(data) {
  return normalizer.validateExifConsistency(data);
};
var debugExifData = function debugExifData(data, label) {
  return normalizer.debugExifData(data, label);
};
module.exports = {
  normalizeExifData: normalizeExifData,
  normalizeOrientation: normalizeOrientation,
  validateExifConsistency: validateExifConsistency,
  debugExifData: debugExifData,
  ExifNormalizer: ExifNormalizer,
  // Export direct de la classe pour usage avancé
  createExifSummary: function createExifSummary(data) {
    return normalizer.createExifSummary(data);
  },
  // Constantes utiles
  ORIENTATION_MAP: normalizer.orientationMap
};