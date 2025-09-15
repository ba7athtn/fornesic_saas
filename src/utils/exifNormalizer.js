// src/utils/exifNormalizer.js
// Normaliseur EXIF forensique complet
"use strict";

const path = require('path');

// Permet l'injection depuis un config centralisé: require('../../config')
let defaultConfig;
try {
  // Adapter le chemin si votre config est ailleurs
  defaultConfig = require('../../config');
} catch {
  defaultConfig = {
    EXIF: {
      VERSION: '3.0.0',
      USE_EXIFTOOL: true,
      STRATEGY: 'auto',
      COMPLETENESS_THRESHOLDS: { excellent: 80, good: 60, partial: 40 }, // niveaux UI
      NORMALIZATION: {
        apertureFmt: 'f/{v}',
        shutterAccepts: ['1/x', 'x', 'x s'], // indicatif
      }
    },
    LOGS: { LEVEL: 'info' }
  };
}

class ExifNormalizer {
  constructor(cfg = {}) {
    this.config = {
      ...defaultConfig,
      ...cfg,
      EXIF: { ...(defaultConfig.EXIF || {}), ...(cfg.EXIF || {}) }
    };

    // Maps paramétrables si besoin (peuvent être surchargés via cfg.EXIF.MAPS)
    const maps = (this.config.EXIF.MAPS || {});
    this.orientationMap = new Map([
      [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8],
      ['horizontal (normal)', 1], ['normal', 1], ['top-left', 1],
      ['mirror horizontal', 2], ['top-right', 2],
      ['rotate 180', 3], ['bottom-right', 3],
      ['mirror vertical', 4], ['bottom-left', 4],
      ['mirror horizontal and rotate 270 cw', 5], ['left-top', 5],
      ['rotate 90 cw', 6], ['rotate 90', 6], ['right-top', 6],
      ['mirror horizontal and rotate 90 cw', 7], ['right-bottom', 7],
      ['rotate 270 cw', 8], ['rotate 270', 8], ['left-bottom', 8],
      ...(maps.orientationMapEntries || [])
    ]);

    this.resolutionUnitMap = new Map([
      [1, 'none'], [2, 'inches'], [3, 'centimeters'],
      ['none', 1], ['inches', 2], ['centimeters', 3],
      ...(maps.resolutionUnitMapEntries || [])
    ]);

    this.colorSpaceMap = new Map([
      [1, 'sRGB'], [2, 'Adobe RGB'], [65535, 'Uncalibrated'],
      ['sRGB', 1], ['Adobe RGB', 2], ['Uncalibrated', 65535],
      ...(maps.colorSpaceMapEntries || [])
    ]);
  }

  // Normalisation complète
  normalizeExifData(rawExifData) {
    if (!this.isValidExifInput(rawExifData)) return null;

    const normalized = {
      camera: this.normalizeCamera(rawExifData.camera || rawExifData),
      technical: this.normalizeTechnical(rawExifData.technical || rawExifData),
      timestamps: this.normalizeTimestamps(rawExifData.timestamps || rawExifData),
      gps: this.normalizeGps(rawExifData.gps || rawExifData),
      software: this.normalizeSoftware(rawExifData.software || rawExifData),
      dimensions: this.normalizeDimensions(rawExifData.dimensions || rawExifData),
      normalizationMetadata: {
        version: this.config.EXIF.VERSION || '3.0.0',
        normalizedAt: new Date().toISOString(),
        originalFieldsCount: this.countFields(rawExifData),
        normalizedFieldsCount: 0,
        warnings: [],
        errors: []
      }
    };

    this.validateNormalizedData(normalized);
    this.calculateCompletenessScore(normalized);
    normalized.normalizationMetadata.normalizedFieldsCount = this.countFields(normalized) - 1;

    return normalized;
  }

  // Camera
  normalizeCamera(cameraData) {
    if (!cameraData) return {};
    const camera = {};
    camera.make = this.normalizeString(cameraData.Make || cameraData.make);
    camera.model = this.normalizeString(cameraData.Model || cameraData.model);
    camera.serialNumber = this.normalizeString(
      cameraData.SerialNumber ||
      cameraData.serialNumber ||
      cameraData.BodySerialNumber ||
      cameraData.CameraSerialNumber
    );
    camera.lens = {
      model: this.normalizeString(cameraData.LensModel || cameraData.LensMake),
      make: this.normalizeString(cameraData.LensMake),
      serialNumber: this.normalizeString(cameraData.LensSerialNumber),
      focalLength: this.normalizeNumeric(cameraData.FocalLength),
      maxAperture: this.normalizeNumeric(cameraData.MaxApertureValue)
    };
    camera.firmware = this.normalizeString(
      cameraData.FirmwareVersion ||
      cameraData.firmware ||
      cameraData.InternalVersion
    );
    camera.owner = this.normalizeString(
      cameraData.CameraOwnerName ||
      cameraData.OwnerName ||
      cameraData.Artist
    );
    return this.cleanEmptyFields(camera);
  }

  // Paramètres techniques
  normalizeTechnical(techData) {
    if (!techData) return {};
    const technical = {};
    technical.iso = this.normalizeISO(
      techData.ISO ||
      techData.ISOSpeedRatings ||
      techData.iso ||
      techData.RecommendedExposureIndex
    );
    technical.aperture = this.normalizeAperture(
      techData.FNumber ||
      techData.ApertureValue ||
      techData.aperture
    );
    technical.shutterSpeed = this.normalizeShutterSpeed(
      techData.ExposureTime ||
      techData.ShutterSpeedValue ||
      techData.shutterSpeed
    );
    technical.exposureCompensation = this.normalizeNumeric(techData.ExposureCompensation);
    technical.exposureProgram = this.normalizeExposureProgram(techData.ExposureProgram);
    technical.meteringMode = this.normalizeMeteringMode(techData.MeteringMode);
    technical.flash = this.normalizeFlash(techData.Flash || techData.flash);
    technical.focalLength = this.normalizeFocalLength(techData.FocalLength);
    technical.focalLength35mm = this.normalizeNumeric(techData.FocalLengthIn35mmFormat);
    technical.subjectDistance = this.normalizeNumeric(techData.SubjectDistance);
    technical.whiteBalance = this.normalizeWhiteBalance(techData.WhiteBalance);
    technical.colorSpace = this.normalizeColorSpace(techData.ColorSpace);
    technical.saturation = this.normalizeQualitySetting(techData.Saturation);
    technical.contrast = this.normalizeQualitySetting(techData.Contrast);
    technical.sharpness = this.normalizeQualitySetting(techData.Sharpness);
    technical.orientation = this.normalizeOrientation(techData.Orientation || techData.orientation);
    return this.cleanEmptyFields(technical);
  }

  // Timestamps
  normalizeTimestamps(timestampData) {
    if (!timestampData) return {};
    const timestamps = {};
    timestamps.dateTimeOriginal = this.normalizeDateTime(
      timestampData.DateTimeOriginal || timestampData.dateTimeOriginal
    );
    timestamps.createDate = this.normalizeDateTime(
      timestampData.CreateDate || timestampData.DateTime || timestampData.createDate
    );
    timestamps.modifyDate = this.normalizeDateTime(
      timestampData.ModifyDate || timestampData.modifyDate
    );
    timestamps.digitizedDate = this.normalizeDateTime(
      timestampData.DateTimeDigitized || timestampData.digitizedDate
    );
    timestamps.offsetTime = this.normalizeString(timestampData.OffsetTime);
    timestamps.offsetTimeOriginal = this.normalizeString(timestampData.OffsetTimeOriginal);
    timestamps.offsetTimeDigitized = this.normalizeString(timestampData.OffsetTimeDigitized);
    timestamps.subSecTime = this.normalizeString(timestampData.SubSecTime);
    timestamps.subSecTimeOriginal = this.normalizeString(timestampData.SubSecTimeOriginal);
    timestamps.subSecTimeDigitized = this.normalizeString(timestampData.SubSecTimeDigitized);
    return this.cleanEmptyFields(timestamps);
  }

  // GPS
  normalizeGps(gpsData) {
    if (!gpsData) return {};
    const gps = {};
    gps.latitude = this.normalizeCoordinate(gpsData.GPSLatitude || gpsData.latitude, 'lat');
    gps.longitude = this.normalizeCoordinate(gpsData.GPSLongitude || gpsData.longitude, 'lng');
    gps.altitude = this.normalizeAltitude(gpsData.GPSAltitude || gpsData.altitude);
    gps.altitudeRef = this.normalizeNumeric(gpsData.GPSAltitudeRef);
    gps.direction = this.normalizeDirection(gpsData.GPSImgDirection || gpsData.direction);
    gps.speed = this.normalizeSpeed(gpsData.GPSSpeed || gpsData.speed);
    gps.speedRef = this.normalizeString(gpsData.GPSSpeedRef);
    gps.track = this.normalizeDirection(gpsData.GPSTrack);
    gps.dateStamp = this.normalizeString(gpsData.GPSDateStamp);
    gps.timeStamp = this.normalizeGPSTime(gpsData.GPSTimeStamp);
    gps.processingMethod = this.normalizeString(gpsData.GPSProcessingMethod);
    gps.mapDatum = this.normalizeString(gpsData.GPSMapDatum);
    gps.versionID = this.normalizeString(gpsData.GPSVersionID);
    if (gps.latitude !== null && gps.longitude !== null) {
      gps.valid = this.validateCoordinates(gps.latitude, gps.longitude);
    }
    return this.cleanEmptyFields(gps);
  }

  // Software
  normalizeSoftware(softwareData) {
    if (!softwareData) return {};
    const software = {};
    software.creator = this.normalizeString(
      softwareData.Software ||
      softwareData.CreatorTool ||
      softwareData.creator ||
      softwareData.Artist
    );
    software.processingHistory = this.normalizeProcessingHistory(
      softwareData.ProcessingSoftware || softwareData.processingHistory
    );
    software.exifVersion = this.normalizeString(softwareData.ExifVersion);
    software.flashpixVersion = this.normalizeString(softwareData.FlashpixVersion);
    software.copyright = this.normalizeString(softwareData.Copyright || softwareData.Rights);
    software.description = this.normalizeString(softwareData.ImageDescription || softwareData.Description);
    software.userComment = this.normalizeString(softwareData.UserComment);
    software.documentID = this.normalizeString(softwareData.DocumentID);
    software.instanceID = this.normalizeString(softwareData.InstanceID);
    software.imageUniqueID = this.normalizeString(softwareData.ImageUniqueID);
    return this.cleanEmptyFields(software);
  }

  // Dimensions
  normalizeDimensions(dimensionData) {
    if (!dimensionData) return {};
    const dimensions = {};
    dimensions.width = this.normalizePositiveInteger(
      dimensionData.ImageWidth ||
      dimensionData.ExifImageWidth ||
      dimensionData.PixelXDimension ||
      dimensionData.width
    );
    dimensions.height = this.normalizePositiveInteger(
      dimensionData.ImageHeight ||
      dimensionData.ImageLength ||
      dimensionData.ExifImageHeight ||
      dimensionData.PixelYDimension ||
      dimensionData.height
    );
    dimensions.xResolution = this.normalizeNumeric(dimensionData.XResolution);
    dimensions.yResolution = this.normalizeNumeric(dimensionData.YResolution);
    dimensions.resolutionUnit = this.normalizeResolutionUnit(dimensionData.ResolutionUnit);
    dimensions.bitsPerSample = this.normalizePositiveInteger(dimensionData.BitsPerSample);
    dimensions.samplesPerPixel = this.normalizePositiveInteger(dimensionData.SamplesPerPixel);
    dimensions.compression = this.normalizeString(dimensionData.Compression);
    return this.cleanEmptyFields(dimensions);
  }

  // =========================
  // Spécialisées
  // =========================
  normalizeOrientation(value) {
    if (value == null || value === '') return null;
    if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 8) return value;
    if (typeof value === 'string') {
      const normalized = value.toLowerCase().trim();
      if (this.orientationMap.has(normalized)) return this.orientationMap.get(normalized);
      const parsed = parseInt(normalized, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 8) return parsed;
    }
    return null;
  }

  normalizeISO(value) {
    const iso = this.normalizePositiveInteger(value);
    return iso;
  }

  normalizeAperture(value) {
    if (value == null) return null;
    if (typeof value === 'string') {
      // accepte: "f/2.8", "2.8", "f2.8"
      const match = value.trim().match(/^f?\s*\/?\s*([\d.]+)$/i);
      if (match) value = parseFloat(match[1]);
    }
    const aperture = this.normalizeNumeric(value);
    return aperture;
  }

  normalizeShutterSpeed(value) {
    if (value == null) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const v = value.trim().replace(/s$/, '').trim(); // supporte "1/125s"
      const fractionMatch = v.match(/^(\d+)\s*\/\s*(\d+)$/);
      if (fractionMatch) {
        const num = parseInt(fractionMatch[1], 10);
        const den = parseInt(fractionMatch[2], 10);
        if (den !== 0) return num / den;
        return null;
      }
      const parsed = parseFloat(v);
      if (!isNaN(parsed)) return parsed;
    }
    return null;
  }

  normalizeFocalLength(value) {
    const focal = this.normalizeNumeric(value);
    return focal;
  }

  normalizeFlash(value) {
    if (value == null) return null;
    const flash = { fired: null, mode: null, redEyeReduction: null };
    if (typeof value === 'number') {
      flash.fired = (value & 0x01) === 0x01;
      flash.redEyeReduction = (value & 0x40) === 0x40;
      flash.mode = this.decodeFlashMode(value);
    } else if (typeof value === 'object') {
      flash.fired = value.fired ?? null;
      flash.mode = value.mode ?? null;
      flash.redEyeReduction = value.redEyeReduction ?? null;
    } else if (typeof value === 'string') {
      flash.mode = this.normalizeString(value);
    }
    return flash;
  }

  normalizeDateTime(value) {
    if (!value) return null;
    try {
      let dateStr = value.toString();
      // exif: "YYYY:MM:DD HH:mm:ss"
      if (dateStr.includes(':') && !dateStr.includes('T')) {
        dateStr = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
      }
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch {
      return null;
    }
  }

  normalizeCoordinate(value, kind /* 'lat'|'lng' */) {
    if (value == null) return null;
    const coord = this.normalizeNumeric(value);
    if (coord === null) return null;
    if (kind === 'lat' && Math.abs(coord) > 90) return null;
    if (kind === 'lng' && Math.abs(coord) > 180) return null;
    return coord;
  }

  normalizeAltitude(value) {
    const altitude = this.normalizeNumeric(value);
    return altitude;
  }

  normalizeDirection(value) {
    const direction = this.normalizeNumeric(value);
    if (direction !== null && (direction < 0 || direction > 360)) return null;
    return direction;
  }

  normalizeSpeed(value) {
    const speed = this.normalizeNumeric(value);
    return speed;
  }

  normalizeGPSTime(value) {
    if (!value) return null;
    if (Array.isArray(value) && value.length === 3) {
      const [h, m, s] = value.map((v) => parseInt(v, 10));
      if ([h, m, s].some((x) => Number.isNaN(x))) return null;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return this.normalizeString(value);
  }

  normalizeColorSpace(value) {
    if (value == null) return null;
    if (typeof value === 'number') return this.colorSpaceMap.get(value) || `Unknown (${value})`;
    return this.normalizeString(value);
  }

  normalizeWhiteBalance(value) {
    if (value == null) return null;
    const wbMap = { 0: 'Auto', 1: 'Manual', auto: 'Auto', manual: 'Manual' };
    return wbMap[value] || this.normalizeString(value);
  }

  normalizeExposureProgram(value) {
    if (value == null) return null;
    const progMap = {
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
    return progMap[value] || `Unknown (${value})`;
  }

  normalizeMeteringMode(value) {
    if (value == null) return null;
    const modeMap = {
      0: 'Unknown',
      1: 'Average',
      2: 'Center weighted average',
      3: 'Spot',
      4: 'Multi spot',
      5: 'Pattern',
      6: 'Partial'
    };
    return modeMap[value] || `Unknown (${value})`;
  }

  normalizeResolutionUnit(value) {
    if (value == null) return null;
    if (typeof value === 'number') return this.resolutionUnitMap.get(value) || `Unknown (${value})`;
    return this.normalizeString(value);
  }

  normalizeQualitySetting(value) {
    if (value == null) return null;
    const qualityMap = { 0: 'Normal', 1: 'Soft', 2: 'Hard' };
    return qualityMap[value] || this.normalizeString(value);
  }

  normalizeProcessingHistory(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => this.normalizeString(item)).filter(Boolean);
    if (typeof value === 'string') return [this.normalizeString(value)];
    return [];
  }

  // =========================
  // Utilitaires de base
  // =========================
  normalizeString(value) {
    if (value == null) return null;
    const str = String(value).trim();
    if (str === '' || str === 'Unknown' || str === 'N/A' || str === 'undefined') return null;
    return str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  }

  normalizeNumeric(value) {
    if (value == null || value === '') return null;
    const num = parseFloat(value);
    return Number.isFinite(num) ? num : null;
  }

  normalizePositiveInteger(value) {
    const num = this.normalizeNumeric(value);
    return num !== null && num > 0 && Number.isInteger(num) ? num : null;
  }

  isValidExifInput(data) {
    return data && typeof data === 'object' && !Array.isArray(data);
  }

  cleanEmptyFields(obj) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedNested = this.cleanEmptyFields(value);
          if (Object.keys(cleanedNested).length > 0) {
            cleaned[key] = cleanedNested;
          }
        } else if (Array.isArray(value) && value.length > 0) {
          cleaned[key] = value;
        } else if (typeof value !== 'object') {
          cleaned[key] = value;
        }
      }
    }
    return cleaned;
  }

  countFields(obj, depth = 0) {
    if (!obj || typeof obj !== 'object' || depth > 5) return 0;
    let count = 0;
    for (const value of Object.values(obj)) {
      if (value !== null && value !== undefined) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          count += this.countFields(value, depth + 1);
        } else {
          count++;
        }
      }
    }
    return count;
  }

  validateCoordinates(lat, lng) {
    return Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  }

  decodeFlashMode(flashValue) {
    const modes = {
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
    return modes[flashValue] || `Unknown (0x${Number(flashValue).toString(16)})`;
  }

  validateNormalizedData(normalized) {
    const warnings = normalized.normalizationMetadata?.warnings || [];
    const errors = normalized.normalizationMetadata?.errors || [];

    // Timestamps consistency
    const dtOrig = normalized.timestamps?.dateTimeOriginal;
    const dtMod = normalized.timestamps?.modifyDate;
    if (dtOrig && dtMod) {
      const original = new Date(dtOrig);
      const modified = new Date(dtMod);
      if (Number.isFinite(original.getTime()) && Number.isFinite(modified.getTime())) {
        if (modified < original) warnings.push('Date de modification antérieure à la date originale');
      }
    }

    // GPS validity
    const lat = normalized.gps?.latitude;
    const lng = normalized.gps?.longitude;
    if (lat != null && lng != null) {
      if (!this.validateCoordinates(lat, lng)) errors.push('Coordonnées GPS invalides');
    }

    // ISO plausibility
    const iso = normalized.technical?.iso;
    if (iso && (iso < 25 || iso > 409600)) {
      warnings.push('Valeur ISO suspecte');
    }

    // Aperture plausibility
    const ap = normalized.technical?.aperture;
    if (ap && (ap < 0.5 || ap > 64)) {
      warnings.push("Valeur d'ouverture suspecte");
    }

    // write back
    normalized.normalizationMetadata.warnings = warnings;
    normalized.normalizationMetadata.errors = errors;
  }

  calculateCompletenessScore(normalized) {
    let totalFields = 0;
    let filledFields = 0;
    const sections = ['camera', 'technical', 'timestamps', 'gps', 'software', 'dimensions'];
    sections.forEach((section) => {
      const sectionData = normalized[section];
      if (sectionData && typeof sectionData === 'object') {
        const sectionCount = this.countFields(sectionData);
        totalFields += this.getExpectedFieldCount(section);
        filledFields += sectionCount;
      }
    });
    const completenessScore = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

    const thr = this.config.EXIF.COMPLETENESS_THRESHOLDS || { excellent: 80, good: 60, partial: 40 };
    let level = 'poor';
    if (completenessScore >= thr.excellent) level = 'excellent';
    else if (completenessScore >= thr.good) level = 'good';
    else if (completenessScore >= thr.partial) level = 'partial';

    normalized.normalizationMetadata.completenessScore = completenessScore;
    normalized.normalizationMetadata.completenessLevel = level;
  }

  getExpectedFieldCount(section) {
    // Valeurs par défaut, surchargées via config si fourni
    const defaults = {
      camera: 8,
      technical: 15,
      timestamps: 8,
      gps: 10,
      software: 8,
      dimensions: 8
    };
    const override = (this.config.EXIF.EXPECTED_COUNTS || {})[section];
    return override || defaults[section] || 5;
  }

  // =========================
  // Outils publics
  // =========================
  validateExifConsistency(exifData) {
    if (!exifData) return { valid: false, issues: ['No EXIF data'] };
    const issues = [];
    let score = 100;
    if (exifData.technical?.iso && (exifData.technical.iso < 25 || exifData.technical.iso > 102400)) {
      issues.push('ISO_OUT_OF_RANGE'); score -= 10;
    }
    if (exifData.technical?.focalLength && (exifData.technical.focalLength < 1 || exifData.technical.focalLength > 2000)) {
      issues.push('FOCAL_LENGTH_SUSPICIOUS'); score -= 5;
    }
    if (exifData.gps?.latitude != null && exifData.gps?.longitude != null) {
      if (!this.validateCoordinates(exifData.gps.latitude, exifData.gps.longitude)) {
        issues.push('INVALID_GPS_COORDINATES'); score -= 15;
      }
    }
    return { valid: issues.length === 0, score: Math.max(0, score), issues, isConsistent: issues.length === 0 };
  }

  debugExifData(exifData, label = 'EXIF') {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${label}] Structure:`, {
        hasData: !!exifData,
        sections: exifData ? Object.keys(exifData) : [],
        fieldsCount: exifData ? this.countFields(exifData) : 0,
        completeness: exifData?.normalizationMetadata?.completenessScore || 'unknown'
      });
    }
  }

  createExifSummary(exifData) {
    if (!exifData) return null;
    return {
      camera: exifData.camera?.make && exifData.camera?.model
        ? `${exifData.camera.make} ${exifData.camera.model}` : null,
      settings: this.buildSettingsSummary(exifData.technical),
      timestamp: exifData.timestamps?.dateTimeOriginal || exifData.timestamps?.createDate,
      location: (exifData.gps?.latitude != null && exifData.gps?.longitude != null)
        ? `${exifData.gps.latitude.toFixed(6)}, ${exifData.gps.longitude.toFixed(6)}`
        : null,
      software: exifData.software?.creator || null,
      completeness: {
        score: exifData.normalizationMetadata?.completenessScore || 0,
        level: exifData.normalizationMetadata?.completenessLevel || 'unknown'
      }
    };
  }

  buildSettingsSummary(technical) {
    if (!technical) return null;
    const parts = [];
    if (technical.iso) parts.push(`ISO ${technical.iso}`);
    if (technical.aperture) parts.push(`f/${technical.aperture}`);
    if (technical.shutterSpeed) {
      if (technical.shutterSpeed >= 1) {
        parts.push(`${technical.shutterSpeed}s`);
      } else {
        const denom = Math.round(1 / technical.shutterSpeed);
        parts.push(`1/${denom}s`);
      }
    }
    if (technical.focalLength) parts.push(`${technical.focalLength}mm`);
    return parts.length > 0 ? parts.join(' • ') : null;
  }
}

// Singleton + exports legacy
// Injection de config possible: const normalizer = new ExifNormalizer(require('../../config'));
const normalizer = new ExifNormalizer();
const normalizeExifData = (data) => normalizer.normalizeExifData(data);
const normalizeOrientation = (value) => normalizer.normalizeOrientation(value);
const validateExifConsistency = (data) => normalizer.validateExifConsistency(data);
const debugExifData = (data, label) => normalizer.debugExifData(data, label);

module.exports = {
  normalizeExifData,
  normalizeOrientation,
  validateExifConsistency,
  debugExifData,
  ExifNormalizer,
  createExifSummary: (data) => normalizer.createExifSummary(data),
  ORIENTATION_MAP: (new ExifNormalizer()).orientationMap
};
