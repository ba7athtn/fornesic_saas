"use strict";

const os = require('os');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

// CONFIG + cache optionnel
const config = require('../config');
let cacheService = null;
try {
  cacheService = require('./cacheService');
  console.log('✅ CacheService disponible pour EXIF');
} catch {
  console.warn('⚠️ CacheService indisponible (fallback mémoire)');
  cacheService = null;
}

// Heuristiques/limites paramétrables
const exifCfg = config.exif || {};
const LIMITS = {
  maxFileBytes: exifCfg.maxFileBytes || 500 * 1024 * 1024,
  supportedFormats: exifCfg.supportedFormats || ['jpg','jpeg','tiff','tif','webp','png','dng','cr2','nef','arw','orf'],
  maxCacheSize: exifCfg.maxCacheSize || 1000
};

const VALIDATION = {
  gpsAltitudeRange: exifCfg.validation?.gpsAltitudeRange || { min: -500, max: 10000 },
  maxGpsSpeedKmh: exifCfg.validation?.maxGpsSpeedKmh || 500,
  roundCoordCheck: exifCfg.validation?.roundCoordCheck !== false,
  precisionDecimals: exifCfg.validation?.precisionDecimals || 8,
  temporalMaxDiffMs: exifCfg.validation?.temporalMaxDiffMs || 5 * 60 * 1000,
  gpsTimeMaxDiffMs: exifCfg.validation?.gpsTimeMaxDiffMs || 60 * 60 * 1000,
  timezoneMaxDiffHours: exifCfg.validation?.timezoneMaxDiffHours || 12,
  futureToleranceMs: exifCfg.validation?.futureToleranceMs || 24 * 60 * 60 * 1000
};

const HEURISTICS = {
  recompressionQualities: exifCfg.heuristics?.recompressionQualities || [85, 95],
  cleanExtractionPenalty: exifCfg.heuristics?.cleanExtractionPenalty !== false
};

const SIGNATURES = {
  suspiciousSoftware: exifCfg.signatures?.software || [
    'photoshop','gimp','paint.net','facetune','snapseed',
    'lightroom','capture one','luminar','skylum','affinity photo',
    'pixelmator','canva','picasa','photoscape','fotor'
  ],
  aiGenerators: exifCfg.signatures?.aiGenerators || [
    'stable diffusion','dall-e','midjourney','firefly','leonardo',
    'runway ml','artbreeder','deepart','dreamstudio'
  ]
};

// =====================================
// SERVICE EXIF FORENSIQUE COMPLET
// =====================================

class ExifForensicService {
  constructor() {
    this.exifr = null;
    this.piexifjs = null;
    this.cache = new Map();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.maxCacheSize = LIMITS.maxCacheSize;
    this.initialized = false;
    this.supportedFormats = LIMITS.supportedFormats;
    this.initializeLibraries();
  }

  async initializeLibraries() {
    try {
      console.log('📊 Initialisation service EXIF forensique...');
      try {
        this.exifr = require('exifr');
        console.log('✅ ExifR initialisé');
      } catch {
        console.warn('⚠️ ExifR non disponible');
      }
      try {
        this.piexifjs = require('piexifjs');
        console.log('✅ PiexifJS initialisé');
      } catch {
        console.warn('⚠️ PiexifJS non disponible');
      }
      this.initialized = true;
      console.log('✅ Service EXIF forensique initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation EXIF service:', error);
      this.initialized = false;
    }
  }

  // Hash streaming pour gros fichiers
  async hashFile(filePath) {
    return new Promise((resolve, reject) => {
      const sha256 = crypto.createHash('sha256');
      const md5 = crypto.createHash('md5');
      const stream = fsSync.createReadStream(filePath);
      stream.on('data', (chunk) => { sha256.update(chunk); md5.update(chunk); });
      stream.on('end', () => resolve({
        sha256: sha256.digest('hex'),
        md5: md5.digest('hex')
      }));
      stream.on('error', reject);
    });
  }

  /**
   * Extraction EXIF complète avec analyse forensique
   */
  async extractForensicExifData(filePath, options = {}) {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(filePath);

    try {
      // Cache Redis prioritaire
      if (!options.forceRefresh && cacheService) {
        const cached = await cacheService.getWithType('exif', cacheKey);
        if (cached) {
          console.log(`📊 EXIF récupéré du cache Redis: ${path.basename(filePath)}`);
          this.cacheHits++;
          return cached;
        }
      }
      // Cache mémoire
      if (this.cache.has(cacheKey) && !options.forceRefresh) {
        console.log(`📊 EXIF récupéré du cache mémoire: ${path.basename(filePath)}`);
        this.cacheHits++;
        return this.cache.get(cacheKey);
      }
      this.cacheMisses++;

      // Validation fichier
      if (!fsSync.existsSync(filePath)) throw new Error(`Fichier introuvable: ${filePath}`);
      const stats = await fs.stat(filePath);
      if (stats.size === 0) throw new Error('Fichier vide');
      if (stats.size > LIMITS.maxFileBytes) throw new Error('Fichier trop volumineux pour extraction EXIF');

      console.log(`📊 Extraction EXIF forensique: ${path.basename(filePath)} (${this.formatBytes(stats.size)})`);

      // Résultat initial
      const forensicResult = {
        file: {
          path: filePath,
          name: path.basename(filePath),
          size: stats.size,
          extension: path.extname(filePath).toLowerCase(),
          created: stats.birthtime,
          modified: stats.mtime,
          accessed: stats.atime
        },
        camera: {},
        technical: {},
        timestamps: {},
        gps: {},
        software: {},
        dimensions: {},
        makernotes: {},
        icc: {},
        iptc: {},
        xmp: {},
        forensicAnalysis: {
          authenticity: { score: 100, flags: [], confidence: 'high' },
          consistency: { temporal: true, technical: true, geographic: true },
          manipulation: { detected: false, indicators: [], confidence: 'low' }
        },
        integrity: { sha256: '', md5: '', signature: '', verified: true },
        extractionMetadata: {
          method: 'unknown',
          version: '3.0.0-forensic',
          processingTime: 0,
          errors: [],
          warnings: [],
          extractedAt: new Date().toISOString()
        }
      };

      // Hash fichiers (streaming)
      const hashes = await this.hashFile(filePath);
      forensicResult.integrity.sha256 = hashes.sha256;
      forensicResult.integrity.md5 = hashes.md5;

      // Extractions multi-sources
      const fileBuffer = await fs.readFile(filePath);

      if (this.exifr) {
        try {
          const exifrData = await this.extractWithExifR(filePath, fileBuffer, options);
          this.mergeExifData(forensicResult, exifrData);
          forensicResult.extractionMetadata.method = 'exifr';
        } catch (exifrError) {
          forensicResult.extractionMetadata.errors.push(`ExifR: ${exifrError.message}`);
        }
      }

      try {
        const sharpData = await this.extractWithSharp(filePath);
        this.mergeExifData(forensicResult, sharpData);
        if (!forensicResult.extractionMetadata.method || forensicResult.extractionMetadata.method === 'unknown') {
          forensicResult.extractionMetadata.method = 'sharp';
        }
      } catch (sharpError) {
        forensicResult.extractionMetadata.errors.push(`Sharp: ${sharpError.message}`);
      }

      if (this.piexifjs && this.isJPEG(filePath)) {
        try {
          const piexifData = await this.extractWithPiexif(fileBuffer);
          this.mergeExifData(forensicResult, piexifData);
        } catch (piexifError) {
          forensicResult.extractionMetadata.errors.push(`Piexif: ${piexifError.message}`);
        }
      }

      try {
        const basicData = await this.extractBasicFileInfo(filePath, stats);
        this.mergeExifData(forensicResult, basicData);
      } catch (basicError) {
        forensicResult.extractionMetadata.errors.push(`Basic: ${basicError.message}`);
      }

      // Analyses forensiques
      forensicResult.forensicAnalysis = await this.performForensicAnalysis(forensicResult, fileBuffer);

      // Validation cohérence
      const consistencyAnalysis = await this.validateConsistency(forensicResult);
      forensicResult.forensicAnalysis.consistency = {
        temporal: consistencyAnalysis.temporal.consistent,
        technical: consistencyAnalysis.technical.consistent,
        geographic: consistencyAnalysis.geographic.consistent,
        details: consistencyAnalysis
      };

      // Détection manipulation
      const manipulationAnalysis = await this.detectExifManipulation(forensicResult);
      forensicResult.forensicAnalysis.manipulation = manipulationAnalysis;

      // Score final
      forensicResult.forensicAnalysis.authenticity = this.calculateAuthenticityScore(forensicResult);

      forensicResult.extractionMetadata.processingTime = Date.now() - startTime;

      // Cache set
      this.updateCache(cacheKey, forensicResult);
      if (cacheService) await cacheService.setWithType('exif', cacheKey, forensicResult, config.cache?.ttl?.exif || 3600);

      console.log(`✅ EXIF forensique extrait: ${path.basename(filePath)} - Score: ${forensicResult.forensicAnalysis.authenticity.score}% (${forensicResult.extractionMetadata.processingTime}ms)`);

      return forensicResult;

    } catch (error) {
      console.error(`❌ Erreur extraction EXIF forensique ${filePath}:`, error);
      return {
        file: { path: filePath, name: path.basename(filePath), error: error.message },
        forensicAnalysis: { authenticity: { score: 0, confidence: 'error' } },
        extractionMetadata: {
          processingTime: Date.now() - startTime,
          errors: [error.message],
          extractedAt: new Date().toISOString()
        }
      };
    }
  }

  async extractWithExifR(filePath, fileBuffer, options = {}) {
    if (!this.exifr) throw new Error('ExifR non disponible');
    const exifrOptions = {
      tiff: true, exif: true, gps: true, interop: true, makernote: true, iptc: true, icc: true, jfif: true, ihdr: true,
      mergeOutput: false, translateKeys: false, translateValues: true, reviveValues: true, sanitize: false,
      chunked: false,
      pick: options.pick || [
        'Make','Model','LensModel','LensMake','LensSerialNumber','SerialNumber','InternalSerialNumber','CameraSerialNumber','BodySerialNumber',
        'ISO','ISOSpeedRatings','RecommendedExposureIndex','FNumber','ApertureValue','MaxApertureValue','ExposureTime','ShutterSpeedValue','FocalLength','FocalLengthIn35mmFormat',
        'DigitalZoomRatio','SceneCaptureType','ExposureProgram','ExposureMode','ExposureCompensation','MeteringMode','LightSource','Flash','FlashMode',
        'WhiteBalance','ColorSpace','ColorMode','Saturation','Sharpness','Contrast','BrightnessValue','SubjectDistance','SubjectDistanceRange',
        'DateTime','DateTimeOriginal','DateTimeDigitized','CreateDate','ModifyDate','MetadataDate','OffsetTime','OffsetTimeOriginal','OffsetTimeDigitized',
        'SubSecTime','SubSecTimeOriginal','SubSecTimeDigitized',
        'GPSLatitude','GPSLongitude','GPSAltitude','GPSAltitudeRef','GPSSpeed','GPSSpeedRef','GPSImgDirection','GPSImgDirectionRef','GPSDestBearing','GPSDestBearingRef',
        'GPSTrack','GPSTrackRef','GPSDateStamp','GPSTimeStamp','GPSProcessingMethod','GPSVersionID','GPSMapDatum','GPSAreaInformation','GPSDifferential','GPSHPositioningError',
        'Software','ProcessingSoftware','Creator','Artist','Copyright','ImageDescription','UserComment','CameraOwnerName','OwnerName','HostComputer','ProcessingVersion','ProcessingDate',
        'ImageWidth','ImageHeight','ImageLength','ExifImageWidth','ExifImageHeight','PixelXDimension','PixelYDimension','XResolution','YResolution','ResolutionUnit','Orientation','Rotation','Mirror',
        'BitsPerSample','SamplesPerPixel','PhotometricInterpretation','Compression','CompressedBitsPerPixel',
        'ThumbnailOffset','ThumbnailLength','ThumbnailImage','PreviewImageStart','PreviewImageLength',
        'CanonModelID','CanonFirmwareVersion','CanonImageNumber','CanonSerialNumber','CanonColorSpace','CanonWhiteBalance',
        'NikonColorSpace','NikonFlashSetting','NikonFocusMode','NikonISOSetting','NikonQuality','NikonWhiteBalance',
        'SonyModelID','SonyColorSpace','SonyWhiteBalance','SonyQuality','SonyFlashMode',
        'Keywords','Category','SupplementalCategories','Caption-Abstract','Writer-Editor','Headline','SpecialInstructions','CreationDate','CreationTime',
        'DigitalCreationDate','DigitalCreationTime','Byline','BylineTitle','Credit','Source','ObjectName','City','Province-State','Country-PrimaryLocationName',
        'Title','Description','Subject','Rights','Format','Identifier','CreatorTool','DocumentID','InstanceID','OriginalDocumentID',
        'SecurityClassification','ImageUniqueID','CameraID','LensID','FlashPixVersion','ExifVersion','FlashpixVersion','InteropVersion','ComponentsConfiguration','MakerNoteVersion'
      ]
    };

    try {
      const rawData = await this.exifr.parse(filePath, exifrOptions);
      if (!rawData) throw new Error('Aucune donnée EXIF trouvée');

      return {
        camera: this.extractCameraInfo(rawData),
        technical: this.extractTechnicalInfo(rawData),
        timestamps: this.extractTimestamps(rawData),
        gps: this.extractGPSInfo(rawData),
        software: this.extractSoftwareInfo(rawData),
        dimensions: this.extractDimensions(rawData),
        makernotes: this.extractMakernotes(rawData),
        icc: this.extractICCProfile(rawData),
        iptc: this.extractIPTCInfo(rawData),
        xmp: this.extractXMPInfo(rawData),
        raw: options.includeRaw ? rawData : undefined
      };
    } catch (error) {
      throw new Error(`ExifR extraction failed: ${error.message}`);
    }
  }

  async extractWithSharp(filePath) {
    try {
      const metadata = await sharp(filePath).metadata();
      return {
        dimensions: {
          width: metadata.width,
          height: metadata.height,
          channels: metadata.channels,
          depth: metadata.depth,
          format: metadata.format,
          space: metadata.space,
          density: metadata.density,
          hasProfile: metadata.hasProfile,
          hasAlpha: metadata.hasAlpha,
          isProgressive: metadata.isProgressive
        },
        technical: {
          orientation: metadata.orientation,
          compression: this.getCompressionInfo(metadata),
          chromaSubsampling: metadata.chromaSubsampling,
          loop: metadata.loop,
          delay: metadata.delay,
          pagePrimary: metadata.pagePrimary
        },
        icc: {
          profile: metadata.icc ? {
            description: metadata.icc.description,
            manufacturer: metadata.icc.manufacturer,
            model: metadata.icc.model,
            copyright: metadata.icc.copyright
          } : null
        }
      };
    } catch (error) {
      throw new Error(`Sharp extraction failed: ${error.message}`);
    }
  }

  async extractWithPiexif(fileBuffer) {
    if (!this.piexifjs) throw new Error('PiexifJS non disponible');
    try {
      const dataUrl = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
      const exifObj = this.piexifjs.load(dataUrl);
      if (!exifObj || Object.keys(exifObj).length === 0) {
        throw new Error('Aucune donnée EXIF trouvée avec PiexifJS');
      }
      return this.convertPiexifData(exifObj);
    } catch (error) {
      throw new Error(`PiexifJS extraction failed: ${error.message}`);
    }
  }
  /**
   * Extraction données de base du fichier
   */
  async extractBasicFileInfo(filePath, stats) {
    const ext = path.extname(filePath).toLowerCase();
    const fileBuffer = await fs.readFile(filePath);

    return {
      file: {
        path: filePath,
        name: path.basename(filePath),
        extension: ext,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        accessed: stats.atime
      },
      technical: {
        mimeType: this.detectMimeType(ext, fileBuffer),
        signature: this.detectFileSignature(fileBuffer),
        encoding: this.detectEncoding(fileBuffer)
      },
      integrity: {
        // Déjà calculé via hashFile pour l’objet principal, ici utile si appelé isolément
        sha256: crypto.createHash('sha256').update(fileBuffer).digest('hex'),
        md5: crypto.createHash('md5').update(fileBuffer).digest('hex')
      }
    };
  }

  // =====================================
  // MÉTHODES D'EXTRACTION SPÉCIALISÉES
  // =====================================

  extractCameraInfo(rawData) {
    return {
      make: rawData.Make || null,
      model: rawData.Model || null,
      lens: {
        model: rawData.LensModel || rawData.LensMake || null,
        make: rawData.LensMake || null,
        serialNumber: rawData.LensSerialNumber || null,
        focalLength: rawData.FocalLength || null,
        focalLength35mm: rawData.FocalLengthIn35mmFormat || null,
        maxAperture: rawData.MaxApertureValue || null
      },
      serialNumber: rawData.SerialNumber || rawData.InternalSerialNumber || rawData.CameraSerialNumber || rawData.BodySerialNumber || null,
      firmware: rawData.FirmwareVersion || rawData.CanonFirmwareVersion || null,
      ownerName: rawData.CameraOwnerName || rawData.OwnerName || rawData.Artist || null,
      modelID: rawData.CanonModelID || rawData.NikonModelID || rawData.SonyModelID || null
    };
  }

  extractTechnicalInfo(rawData) {
    return {
      // Exposition
      iso: rawData.ISO || rawData.ISOSpeedRatings || rawData.RecommendedExposureIndex || null,
      aperture: rawData.FNumber || rawData.ApertureValue || null,
      shutterSpeed: rawData.ExposureTime || rawData.ShutterSpeedValue || null,
      exposureCompensation: rawData.ExposureCompensation || null,
      exposureProgram: this.translateExposureProgram(rawData.ExposureProgram),
      exposureMode: this.translateExposureMode(rawData.ExposureMode),
      meteringMode: this.translateMeteringMode(rawData.MeteringMode),
      // Flash
      flash: {
        fired: rawData.Flash ? this.parseFlashValue(rawData.Flash) : null,
        mode: rawData.FlashMode || null,
        compensation: rawData.FlashCompensation || null,
        redEyeReduction: rawData.Flash ? this.hasRedEyeReduction(rawData.Flash) : null
      },
      // Mise au point
      focusMode: rawData.FocusMode || rawData.AFMode || null,
      subjectDistance: rawData.SubjectDistance || null,
      subjectDistanceRange: rawData.SubjectDistanceRange || null,
      // Couleur et qualité
      whiteBalance: this.translateWhiteBalance(rawData.WhiteBalance),
      colorSpace: this.translateColorSpace(rawData.ColorSpace),
      colorMode: rawData.ColorMode || null,
      saturation: rawData.Saturation || null,
      contrast: rawData.Contrast || null,
      sharpness: rawData.Sharpness || null,
      brightness: rawData.BrightnessValue || null,
      // Zoom et format
      digitalZoom: rawData.DigitalZoomRatio || null,
      sceneMode: rawData.SceneCaptureType || rawData.SceneMode || null,
      imageStabilization: rawData.ImageStabilization || rawData.VR || null,
      // Qualité
      quality: rawData.Quality || rawData.JPEGQuality || null,
      compression: rawData.Compression || null,
      compressedBitsPerPixel: rawData.CompressedBitsPerPixel || null
    };
  }

  extractTimestamps(rawData) {
    return {
      dateTimeOriginal: this.parseDateTime(rawData.DateTimeOriginal, rawData.SubSecTimeOriginal),
      createDate: this.parseDateTime(rawData.CreateDate || rawData.DateTime, rawData.SubSecTime),
      modifyDate: this.parseDateTime(rawData.ModifyDate, rawData.SubSecTime),
      digitizedDate: this.parseDateTime(rawData.DateTimeDigitized, rawData.SubSecTimeDigitized),
      metadataDate: this.parseDateTime(rawData.MetadataDate),
      // Fuseaux horaires
      offsetTime: rawData.OffsetTime || null,
      offsetTimeOriginal: rawData.OffsetTimeOriginal || null,
      offsetTimeDigitized: rawData.OffsetTimeDigitized || null,
      timeZone: rawData.TimeZone || null,
      // Sous-secondes
      subSecTime: rawData.SubSecTime || null,
      subSecTimeOriginal: rawData.SubSecTimeOriginal || null,
      subSecTimeDigitized: rawData.SubSecTimeDigitized || null
    };
  }

  extractGPSInfo(rawData) {
    const gps = {
      latitude: rawData.GPSLatitude || null,
      longitude: rawData.GPSLongitude || null,
      altitude: rawData.GPSAltitude || null,
      altitudeRef: rawData.GPSAltitudeRef || null,
      // Direction et mouvement
      direction: rawData.GPSImgDirection || null,
      directionRef: rawData.GPSImgDirectionRef || null,
      speed: rawData.GPSSpeed || null,
      speedRef: rawData.GPSSpeedRef || null,
      track: rawData.GPSTrack || null,
      trackRef: rawData.GPSTrackRef || null,
      // Timestamp GPS
      dateStamp: rawData.GPSDateStamp || null,
      timeStamp: rawData.GPSTimeStamp || null,
      timestamp: this.parseGPSTimestamp(rawData.GPSDateStamp, rawData.GPSTimeStamp),
      // Métadonnées GPS
      processingMethod: rawData.GPSProcessingMethod || null,
      versionID: rawData.GPSVersionID || null,
      mapDatum: rawData.GPSMapDatum || null,
      areaInformation: rawData.GPSAreaInformation || null,
      differential: rawData.GPSDifferential || null,
      hPositioningError: rawData.GPSHPositioningError || null
    };

    if (gps.latitude !== null && gps.longitude !== null) {
      gps.coordinates = {
        decimal: { latitude: gps.latitude, longitude: gps.longitude },
        dms: {
          latitude: this.decimalToDMS(gps.latitude, 'lat'),
          longitude: this.decimalToDMS(gps.longitude, 'lng')
        }
      };
    }
    return gps;
  }

  extractSoftwareInfo(rawData) {
    return {
      creator: rawData.Software || rawData.CreatorTool || rawData.Creator || null,
      processingHistory: this.extractProcessingHistory(rawData),
      hostComputer: rawData.HostComputer || null,
      processingVersion: rawData.ProcessingVersion || null,
      processingDate: rawData.ProcessingDate || null,
      // Copyright et droits
      copyright: rawData.Copyright || rawData.Rights || null,
      artist: rawData.Artist || rawData.Creator || null,
      description: rawData.ImageDescription || rawData.Description || null,
      userComment: rawData.UserComment || null,
      // Versions
      exifVersion: rawData.ExifVersion || null,
      flashpixVersion: rawData.FlashpixVersion || null,
      interopVersion: rawData.InteropVersion || null,
      // Identification unique
      documentID: rawData.DocumentID || null,
      instanceID: rawData.InstanceID || null,
      originalDocumentID: rawData.OriginalDocumentID || null,
      imageUniqueID: rawData.ImageUniqueID || null
    };
  }

  extractDimensions(rawData) {
    return {
      // Dimensions principales
      width: rawData.ImageWidth || rawData.ExifImageWidth || rawData.PixelXDimension || null,
      height: rawData.ImageHeight || rawData.ImageLength || rawData.ExifImageHeight || rawData.PixelYDimension || null,
      // Résolution
      xResolution: rawData.XResolution || null,
      yResolution: rawData.YResolution || null,
      resolutionUnit: this.translateResolutionUnit(rawData.ResolutionUnit),
      // Orientation et rotation
      orientation: rawData.Orientation || null,
      rotation: rawData.Rotation || null,
      mirror: rawData.Mirror || null,
      // Caractéristiques pixel
      bitsPerSample: rawData.BitsPerSample || null,
      samplesPerPixel: rawData.SamplesPerPixel || null,
      photometricInterpretation: rawData.PhotometricInterpretation || null,
      // Thumbnails et previews
      thumbnailOffset: rawData.ThumbnailOffset || null,
      thumbnailLength: rawData.ThumbnailLength || null,
      previewImageStart: rawData.PreviewImageStart || null,
      previewImageLength: rawData.PreviewImageLength || null
    };
  }

  extractMakernotes(rawData) {
    const makernotes = {
      manufacturer: rawData.Make ? rawData.Make.toLowerCase() : null,
      data: {}
    };
    if (makernotes.manufacturer?.includes('canon')) {
      makernotes.data.canon = {
        modelID: rawData.CanonModelID,
        imageNumber: rawData.CanonImageNumber,
        serialNumber: rawData.CanonSerialNumber,
        firmwareVersion: rawData.CanonFirmwareVersion,
        colorSpace: rawData.CanonColorSpace,
        whiteBalance: rawData.CanonWhiteBalance
      };
    }
    if (makernotes.manufacturer?.includes('nikon')) {
      makernotes.data.nikon = {
        colorSpace: rawData.NikonColorSpace,
        flashSetting: rawData.NikonFlashSetting,
        focusMode: rawData.NikonFocusMode,
        isoSetting: rawData.NikonISOSetting,
        quality: rawData.NikonQuality,
        whiteBalance: rawData.NikonWhiteBalance
      };
    }
    if (makernotes.manufacturer?.includes('sony')) {
      makernotes.data.sony = {
        modelID: rawData.SonyModelID,
        colorSpace: rawData.SonyColorSpace,
        whiteBalance: rawData.SonyWhiteBalance,
        quality: rawData.SonyQuality,
        flashMode: rawData.SonyFlashMode
      };
    }
    return makernotes;
  }

  extractICCProfile(rawData) {
    return {
      description: rawData.ProfileDescription || null,
      manufacturer: rawData.ProfileManufacturer || null,
      model: rawData.ProfileModel || null,
      copyright: rawData.ProfileCopyright || null,
      colorSpace: rawData.ColorSpace || null,
      connectionSpace: rawData.ConnectionSpace || null,
      deviceClass: rawData.DeviceClass || null,
      renderingIntent: rawData.RenderingIntent || null
    };
  }

  extractIPTCInfo(rawData) {
    return {
      // Identification
      headline: rawData.Headline || rawData.ObjectName || null,
      caption: rawData['Caption-Abstract'] || rawData.Description || null,
      keywords: rawData.Keywords || null,
      category: rawData.Category || null,
      supplementalCategories: rawData.SupplementalCategories || null,
      // Personnes
      byline: rawData.Byline || rawData.Creator || null,
      bylineTitle: rawData.BylineTitle || null,
      credit: rawData.Credit || null,
      source: rawData.Source || null,
      // Dates IPTC
      creationDate: rawData.CreationDate || null,
      creationTime: rawData.CreationTime || null,
      digitalCreationDate: rawData.DigitalCreationDate || null,
      digitalCreationTime: rawData.DigitalCreationTime || null,
      // Localisation
      city: rawData.City || null,
      provinceState: rawData['Province-State'] || null,
      countryName: rawData['Country-PrimaryLocationName'] || null,
      // Instructions
      specialInstructions: rawData.SpecialInstructions || null,
      writerEditor: rawData['Writer-Editor'] || null
    };
  }

  extractXMPInfo(rawData) {
    return {
      // Dublin Core
      title: rawData.Title || null,
      description: rawData.Description || null,
      subject: rawData.Subject || null,
      creator: rawData.Creator || null,
      rights: rawData.Rights || null,
      format: rawData.Format || null,
      identifier: rawData.Identifier || null,
      // Dates XMP
      createDate: rawData.CreateDate || null,
      modifyDate: rawData.ModifyDate || null,
      metadataDate: rawData.MetadataDate || null,
      // Outils
      creatorTool: rawData.CreatorTool || null,
      // Identification
      documentID: rawData.DocumentID || null,
      instanceID: rawData.InstanceID || null,
      originalDocumentID: rawData.OriginalDocumentID || null
    };
  }

  // =====================================
  // ANALYSE FORENSIQUE
  // =====================================

  async performForensicAnalysis(forensicResult, fileBuffer) {
    try {
      const analysis = {
        authenticity: { score: 100, flags: [], confidence: 'high' },
        consistency: { temporal: true, technical: true, geographic: true, details: {} },
        manipulation: { detected: false, indicators: [], confidence: 'low', types: [] }
      };

      // Cohérence temporelle
      const temporalAnalysis = this.analyzeTemporalConsistency(forensicResult.timestamps);
      analysis.consistency.temporal = temporalAnalysis.consistent;
      analysis.consistency.details.temporal = temporalAnalysis;
      if (!temporalAnalysis.consistent) {
        analysis.authenticity.score -= 20;
        analysis.authenticity.flags.push(...temporalAnalysis.anomalies);
      }

      // Cohérence technique
      const technicalAnalysis = this.analyzeTechnicalConsistency(forensicResult.technical, forensicResult.camera);
      analysis.consistency.technical = technicalAnalysis.consistent;
      analysis.consistency.details.technical = technicalAnalysis;
      if (!technicalAnalysis.consistent) {
        analysis.authenticity.score -= 15;
        analysis.authenticity.flags.push(...technicalAnalysis.anomalies);
      }

      // Cohérence géographique
      const geographicAnalysis = this.analyzeGeographicConsistency(forensicResult.gps, forensicResult.timestamps);
      analysis.consistency.geographic = geographicAnalysis.consistent;
      analysis.consistency.details.geographic = geographicAnalysis;
      if (!geographicAnalysis.consistent) {
        analysis.authenticity.score -= 10;
        analysis.authenticity.flags.push(...geographicAnalysis.anomalies);
      }

      // Signatures manipulation
      const manipulationSigns = this.detectManipulationSignatures(forensicResult);
      if (manipulationSigns.detected) {
        analysis.manipulation.detected = true;
        analysis.manipulation.indicators = manipulationSigns.signatures;
        analysis.manipulation.types = manipulationSigns.types;
        analysis.manipulation.confidence = manipulationSigns.confidence;
        analysis.authenticity.score -= 30;
        analysis.authenticity.flags.push(...manipulationSigns.signatures);
      }

      // Double processing
      const doubleProcessing = this.detectDoubleProcessing(forensicResult);
      if (doubleProcessing.detected) {
        analysis.manipulation.detected = true;
        analysis.manipulation.indicators.push(...doubleProcessing.indicators);
        analysis.authenticity.score -= 25;
      }

      // Anomalies métadonnées
      const metadataAnomalies = this.detectMetadataAnomalies(forensicResult);
      if (metadataAnomalies.length > 0) {
        analysis.authenticity.score -= (metadataAnomalies.length * 5);
        analysis.authenticity.flags.push(...metadataAnomalies);
      }

      analysis.authenticity.score = Math.max(0, analysis.authenticity.score);
      analysis.authenticity.confidence = this.calculateAnalysisConfidence(analysis);

      return analysis;

    } catch (error) {
      console.error('Erreur analyse forensique EXIF:', error);
      return {
        authenticity: { score: 0, confidence: 'error', flags: ['FORENSIC_ANALYSIS_ERROR'] },
        error: error.message
      };
    }
  }

  analyzeTemporalConsistency(timestamps) {
    const anomalies = [];
    let consistent = true;

    if (!timestamps) return { consistent: false, anomalies: ['NO_TIMESTAMP_DATA'] };

    if (timestamps.dateTimeOriginal && timestamps.createDate) {
      const original = new Date(timestamps.dateTimeOriginal);
      const create = new Date(timestamps.createDate);
      const diff = Math.abs(original - create);
      if (diff > VALIDATION.temporalMaxDiffMs) {
        anomalies.push('TIMESTAMP_LARGE_DIFFERENCE');
        consistent = false;
      }
    }

    const now = new Date();
    const futureThreshold = VALIDATION.futureToleranceMs;
    Object.entries(timestamps).forEach(([key, timestamp]) => {
      if (timestamp && typeof timestamp === 'string') {
        try {
          const date = new Date(timestamp);
          if (date > now && (date - now) > futureThreshold) {
            anomalies.push(`FUTURE_TIMESTAMP_${key.toUpperCase()}`);
            consistent = false;
          }
        } catch {
          anomalies.push(`INVALID_TIMESTAMP_${key.toUpperCase()}`);
          consistent = false;
        }
      }
    });

    if (timestamps.dateTimeOriginal && timestamps.modifyDate) {
      const original = new Date(timestamps.dateTimeOriginal);
      const modified = new Date(timestamps.modifyDate);
      if (modified < original) {
        anomalies.push('MODIFY_DATE_BEFORE_ORIGINAL');
        consistent = false;
      }
    }

    if (timestamps.offsetTime && timestamps.offsetTimeOriginal) {
      if (timestamps.offsetTime !== timestamps.offsetTimeOriginal) {
        const offsetDiff = this.parseTimezoneOffset(timestamps.offsetTime) - this.parseTimezoneOffset(timestamps.offsetTimeOriginal);
        if (Math.abs(offsetDiff) > VALIDATION.timezoneMaxDiffHours * 60) {
          anomalies.push('LARGE_TIMEZONE_DIFFERENCE');
          consistent = false;
        }
      }
    }

    return { consistent, anomalies, analysis: 'temporal_consistency_check' };
  }

  analyzeTechnicalConsistency(technical, camera) {
    const anomalies = [];
    let consistent = true;

    if (!technical) return { consistent: false, anomalies: ['NO_TECHNICAL_DATA'] };

    if (technical.iso && technical.aperture && technical.shutterSpeed) {
      const iso = parseFloat(technical.iso);
      const aperture = parseFloat(technical.aperture);
      const shutterSpeed = this.parseShutterSpeed(technical.shutterSpeed);

      if (iso && aperture && shutterSpeed) {
        if (iso < 25 || iso > 409600) {
          anomalies.push('IMPOSSIBLE_ISO_VALUE');
          consistent = false;
        }
        if (aperture < 0.5 || aperture > 64) {
          anomalies.push('IMPOSSIBLE_APERTURE_VALUE');
          consistent = false;
        }
        if (shutterSpeed > 30 || shutterSpeed < 0.000001) {
          anomalies.push('IMPOSSIBLE_SHUTTER_SPEED');
          consistent = false;
        }
      }
    }

    if (camera?.make && camera?.lens?.make) {
      const cameraMake = camera.make.toLowerCase();
      const lensMake = camera.lens.make.toLowerCase();
      const incompatible = [
        ['canon', 'nikon'],
        ['nikon', 'canon'],
        ['sony', 'canon'],
        ['canon', 'sony']
      ];
      for (const [camMake, lensMake2] of incompatible) {
        if (cameraMake.includes(camMake) && lensMake.includes(lensMake2)) {
          anomalies.push('INCOMPATIBLE_CAMERA_LENS');
          consistent = false;
          break;
        }
      }
    }

    if (technical.whiteBalance && technical.colorSpace) {
      if (technical.colorSpace === 'uncalibrated' && technical.whiteBalance === 'auto') {
        anomalies.push('SUSPICIOUS_COLOR_COMBINATION');
        consistent = false;
      }
    }

    if (technical.flash && technical.flash.fired !== undefined) {
      const flashFired = technical.flash.fired;
      const flashMode = technical.flash.mode;
      if (flashFired && flashMode && typeof flashMode === 'string' && flashMode.toLowerCase().includes('off')) {
        anomalies.push('FLASH_INCONSISTENCY');
        consistent = false;
      }
    }

    return { consistent, anomalies, analysis: 'technical_consistency_check' };
  }
  analyzeGeographicConsistency(gps, timestamps) {
    const anomalies = [];
    let consistent = true;

    if (!gps || (!gps.latitude && !gps.longitude)) {
      return { consistent: true, anomalies: [], analysis: 'no_gps_data' };
    }

    if (gps.latitude !== null && (Math.abs(gps.latitude) > 90)) {
      anomalies.push('INVALID_GPS_LATITUDE');
      consistent = false;
    }

    if (gps.longitude !== null && (Math.abs(gps.longitude) > 180)) {
      anomalies.push('INVALID_GPS_LONGITUDE');
      consistent = false;
    }

    if (gps.altitude !== null) {
      if (gps.altitude < VALIDATION.gpsAltitudeRange.min || gps.altitude > VALIDATION.gpsAltitudeRange.max) {
        anomalies.push('UNUSUAL_GPS_ALTITUDE');
        consistent = false;
      }
    }

    if (gps.timestamp && timestamps?.dateTimeOriginal) {
      const gpsTime = new Date(gps.timestamp);
      const imageTime = new Date(timestamps.dateTimeOriginal);
      const timeDiff = Math.abs(gpsTime - imageTime);
      if (timeDiff > VALIDATION.gpsTimeMaxDiffMs) {
        anomalies.push('GPS_IMAGE_TIME_MISMATCH');
        consistent = false;
      }
    }

    if (gps.latitude !== null && gps.longitude !== null && VALIDATION.roundCoordCheck) {
      if (gps.latitude % 1 === 0 && gps.longitude % 1 === 0) {
        anomalies.push('SUSPICIOUS_ROUND_COORDINATES');
        consistent = false;
      }
      if (this.countDecimalPlaces(gps.latitude) > VALIDATION.precisionDecimals ||
          this.countDecimalPlaces(gps.longitude) > VALIDATION.precisionDecimals) {
        anomalies.push('EXCESSIVE_GPS_PRECISION');
        consistent = false;
      }
    }

    if (gps.speed !== null && gps.speed > VALIDATION.maxGpsSpeedKmh) {
      anomalies.push('IMPOSSIBLE_GPS_SPEED');
      consistent = false;
    }

    return { consistent, anomalies, analysis: 'geographic_consistency_check' };
  }

  detectManipulationSignatures(forensicResult) {
    const signatures = [];
    const types = [];
    let detected = false;
    let confidence = 'low';

    // Logiciels suspects
    if (forensicResult.software?.creator) {
      const software = String(forensicResult.software.creator).toLowerCase();
      for (const suspect of SIGNATURES.suspiciousSoftware) {
        if (software.includes(suspect)) {
          signatures.push(`MANIPULATION_SOFTWARE_${suspect.toUpperCase().replace(/\s+/g, '_')}`);
          types.push('software_editing');
          detected = true;
          confidence = 'medium';
        }
      }
    }

    // Historique de traitement
    if (Array.isArray(forensicResult.software?.processingHistory) && forensicResult.software.processingHistory.length > 3) {
      signatures.push('MULTIPLE_PROCESSING_STEPS');
      types.push('complex_editing');
      detected = true;
    }

    // Absence de métadonnées critiques
    const criticalMissing = [];
    if (!forensicResult.camera.make) criticalMissing.push('camera_make');
    if (!forensicResult.timestamps.dateTimeOriginal) criticalMissing.push('timestamp_original');
    if (!forensicResult.technical.iso && !forensicResult.technical.aperture) criticalMissing.push('exposure_data');
    if (criticalMissing.length >= 2) {
      signatures.push('CRITICAL_METADATA_MISSING');
      types.push('metadata_stripping');
      detected = true;
      confidence = 'high';
    }

    // Versions EXIF anachroniques
    if (forensicResult.software) {
      const exifVersion = forensicResult.software.exifVersion;
      if (exifVersion && this.isAnachronisticExifVersion(exifVersion, forensicResult.timestamps.dateTimeOriginal)) {
        signatures.push('ANACHRONISTIC_EXIF_VERSION');
        types.push('version_mismatch');
        detected = true;
      }
    }

    // Signatures IA
    if (forensicResult.software?.creator) {
      const creator = String(forensicResult.software.creator).toLowerCase();
      for (const aiSig of SIGNATURES.aiGenerators) {
        if (creator.includes(aiSig)) {
          signatures.push(`AI_GENERATED_${aiSig.toUpperCase().replace(/\s+/g, '_')}`);
          types.push('ai_generation');
          detected = true;
          confidence = 'very_high';
        }
      }
    }

    // Noms de fichiers suspects
    if (forensicResult.file?.name) {
      const filename = forensicResult.file.name.toLowerCase();
      const suspiciousPatterns = [
        /screenshot/i, /untitled/i, /download/i, /^image\d+$/i,
        /^img\d+$/i, /temp/i, /test/i, /generated/i, /synthetic/i,
        /fake/i, /edited/i, /modified/i
      ];
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(filename)) {
          signatures.push('SUSPICIOUS_FILENAME_PATTERN');
          types.push('suspicious_naming');
          detected = true;
          break;
        }
      }
    }

    return {
      detected,
      signatures,
      types: [...new Set(types)],
      confidence
    };
  }

  detectDoubleProcessing(forensicResult) {
    const indicators = [];
    let detected = false;

    if (forensicResult.technical?.quality) {
      const q = parseInt(forensicResult.technical.quality);
      if (q && HEURISTICS.recompressionQualities.includes(q)) {
        indicators.push('TYPICAL_RECOMPRESSION_QUALITY');
        detected = true;
      }
    }

    if (forensicResult.timestamps) {
      const modifyCount = Object.keys(forensicResult.timestamps).filter(k => k.toLowerCase().includes('modify') || k.toLowerCase().includes('digitized')).length;
      if (modifyCount > 2) {
        indicators.push('MULTIPLE_MODIFICATION_TIMESTAMPS');
        detected = true;
      }
    }

    if (Array.isArray(forensicResult.software?.processingHistory) && forensicResult.software.processingHistory.length > 1) {
      indicators.push('MULTIPLE_SOFTWARE_PROCESSING');
      detected = true;
    }

    return { detected, indicators };
  }

  detectMetadataAnomalies(forensicResult) {
    const anomalies = [];

    if (forensicResult.gps?.latitude && forensicResult.gps?.longitude) {
      const lat = forensicResult.gps.latitude;
      const lng = forensicResult.gps.longitude;
      if (lat % 0.01 === 0 && lng % 0.01 === 0) {
        anomalies.push('GRID_ALIGNED_GPS');
      }
    }

    if (forensicResult.technical) {
      const tech = forensicResult.technical;
      if (tech.iso && this.isPowerOfTwo(tech.iso) && tech.iso > 100) {
        anomalies.push('PERFECT_POWER_OF_TWO_ISO');
      }
      if (tech.shutterSpeed && typeof tech.shutterSpeed === 'string') {
        if (/^1\/\d+$/.test(tech.shutterSpeed)) {
          const denom = parseInt(tech.shutterSpeed.split('/')[1]);
          if (this.isPowerOfTwo(denom)) {
            anomalies.push('PERFECT_FRACTIONAL_SHUTTER');
          }
        }
      }
    }

    if (HEURISTICS.cleanExtractionPenalty &&
        forensicResult.extractionMetadata &&
        forensicResult.extractionMetadata.errors?.length === 0) {
      if (Object.keys(forensicResult.camera).length === 0 &&
          Object.keys(forensicResult.technical).length === 0) {
        anomalies.push('SUSPICIOUSLY_CLEAN_EXTRACTION');
      }
    }

    return anomalies;
  }

  calculateAnalysisConfidence(analysis) {
    const flagsCount = analysis.authenticity.flags.length;
    const score = analysis.authenticity.score;

    if (analysis.manipulation.detected && analysis.manipulation.confidence === 'very_high') return 'very_high';
    if (score <= 30 && flagsCount >= 3) return 'high';
    if (score <= 50 && flagsCount >= 2) return 'medium';
    if (score <= 70 && flagsCount >= 1) return 'low';
    if (flagsCount === 0 && score >= 90) return 'high';
    return 'medium';
  }

  // =====================================
  // MÉTHODES DE VALIDATION ET COHÉRENCE
  // =====================================

  async validateConsistency(forensicResult) {
    return {
      temporal: this.analyzeTemporalConsistency(forensicResult.timestamps),
      technical: this.analyzeTechnicalConsistency(forensicResult.technical, forensicResult.camera),
      geographic: this.analyzeGeographicConsistency(forensicResult.gps, forensicResult.timestamps)
    };
  }

  async detectExifManipulation(forensicResult) {
    return this.detectManipulationSignatures(forensicResult);
  }

  calculateAuthenticityScore(forensicResult) {
    let score = 100;
    const flags = [];
    if (forensicResult.forensicAnalysis) {
      score = forensicResult.forensicAnalysis.authenticity.score;
      flags.push(...(forensicResult.forensicAnalysis.authenticity.flags || []));
    }
    const confidence = score > 80 ? 'high' : score > 50 ? 'medium' : 'low';
    return { score, flags, confidence };
  }

  // =====================================
  // MÉTHODES UTILITAIRES
  // =====================================

  generateCacheKey(filePath) {
    const stats = fsSync.existsSync(filePath) ? fsSync.statSync(filePath) : null;
    const key = `${filePath}-${stats ? stats.mtime.getTime() : Date.now()}`;
    return crypto.createHash('md5').update(key).digest('hex');
  }

  updateCache(key, data) {
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, data);
  }

  mergeExifData(target, source) {
    for (const [category, data] of Object.entries(source || {})) {
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if (!target[category]) target[category] = {};
        Object.assign(target[category], data);
      } else if (data !== undefined && data !== null) {
        target[category] = data;
      }
    }
  }

  convertPiexifData(exifObj) {
    const converted = {
      camera: {},
      technical: {},
      timestamps: {},
      gps: {},
      software: {}
    };

    if (exifObj['0th']) {
      const ifd0 = exifObj['0th'];
      converted.camera.make = ifd0[this.piexifjs.ImageIFD.Make];
      converted.camera.model = ifd0[this.piexifjs.ImageIFD.Model];
      converted.software.creator = ifd0[this.piexifjs.ImageIFD.Software];
    }

    if (exifObj.Exif) {
      const exif = exifObj.Exif;
      converted.timestamps.dateTimeOriginal = exif[this.piexifjs.ExifIFD.DateTimeOriginal];
      converted.technical.iso = exif[this.piexifjs.ExifIFD.ISOSpeedRatings];
      converted.technical.aperture = exif[this.piexifjs.ExifIFD.FNumber];
      converted.technical.shutterSpeed = exif[this.piexifjs.ExifIFD.ExposureTime];
    }

    if (exifObj.GPS) {
      const gps = exifObj.GPS;
      converted.gps.latitude = this.convertGPSCoordinate(gps[this.piexifjs.GPSIFD.GPSLatitude], gps[this.piexifjs.GPSIFD.GPSLatitudeRef]);
      converted.gps.longitude = this.convertGPSCoordinate(gps[this.piexifjs.GPSIFD.GPSLongitude], gps[this.piexifjs.GPSIFD.GPSLongitudeRef]);
    }

    return converted;
  }

  isJPEG(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return ['.jpg', '.jpeg'].includes(ext);
  }
  detectMimeType(extension, buffer) {
    const signature = buffer.toString('hex', 0, 8).toUpperCase();
    if (signature.startsWith('FFD8FF')) return 'image/jpeg';
    if (signature.startsWith('89504E47')) return 'image/png';
    if (signature.startsWith('47494638')) return 'image/gif';
    if (signature.startsWith('52494646')) return 'image/webp';
    if (signature.startsWith('49492A00') || signature.startsWith('4D4D002A')) return 'image/tiff';
    const mimeTypes = {
      '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.png': 'image/png', '.gif': 'image/gif',
      '.webp': 'image/webp', '.tiff': 'image/tiff', '.tif': 'image/tiff',
      '.bmp': 'image/bmp', '.svg': 'image/svg+xml'
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  detectFileSignature(buffer) {
    return buffer.toString('hex', 0, 16).toUpperCase();
  }

  detectEncoding(buffer) {
    if (buffer.includes(0x00)) return 'binary';
    try { buffer.toString('utf8'); return 'utf8'; } catch { return 'binary'; }
  }

  getCompressionInfo(metadata) {
    if (metadata.format === 'jpeg') return 'JPEG';
    if (metadata.format === 'png') return 'PNG (Lossless)';
    if (metadata.format === 'tiff') return 'TIFF';
    if (metadata.format === 'webp') return 'WebP';
    return metadata.format || 'Unknown';
  }

  parseDateTime(dateTimeString, subSeconds = null) {
    if (!dateTimeString) return null;
    try {
      let dateStr = dateTimeString;
      if (subSeconds) dateStr += `.${subSeconds}`;
      if (dateStr.includes(':') && !dateStr.includes('T')) {
        dateStr = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
      }
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch {
      return null;
    }
  }

  parseGPSTimestamp(dateStamp, timeStamp) {
    if (!dateStamp || !timeStamp) return null;
    try {
      let dateStr = dateStamp.replace(/:/g, '-');
      let timeStr;
      if (Array.isArray(timeStamp)) timeStr = timeStamp.map(t => String(t).padStart(2, '0')).join(':');
      else timeStr = timeStamp;
      const dateTimeStr = `${dateStr}T${timeStr}Z`;
      const date = new Date(dateTimeStr);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch {
      return null;
    }
  }

  decimalToDMS(decimal, type) {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees) * 60 - minutes) * 60;
    const direction = type === 'lat' ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W');
    return `${degrees}°${minutes}'${seconds.toFixed(3)}"${direction}`;
  }

  convertGPSCoordinate(coordinate, ref) {
    if (!coordinate || !Array.isArray(coordinate)) return null;
    const [degrees, minutes, seconds] = coordinate;
    let decimal = degrees + (minutes / 60) + (seconds / 3600);
    if (ref === 'S' || ref === 'W') decimal = -decimal;
    return decimal;
  }

  extractProcessingHistory(rawData) {
    const history = [];
    if (rawData.ProcessingSoftware) history.push(rawData.ProcessingSoftware);
    if (rawData.Software) history.push(rawData.Software);
    return history.length > 0 ? history : null;
  }

  parseFlashValue(flash) {
    if (typeof flash !== 'number') return null;
    return (flash & 0x01) === 0x01;
  }

  hasRedEyeReduction(flash) {
    if (typeof flash !== 'number') return null;
    return (flash & 0x40) === 0x40;
  }

  parseShutterSpeed(shutterSpeed) {
    if (!shutterSpeed) return null;
    if (typeof shutterSpeed === 'string') {
      if (shutterSpeed.includes('/')) {
        const [numerator, denominator] = shutterSpeed.split('/');
        return parseFloat(numerator) / parseFloat(denominator);
      }
      return parseFloat(shutterSpeed);
    }
    return parseFloat(shutterSpeed);
  }

  parseTimezoneOffset(offsetString) {
    if (!offsetString) return 0;
    const match = offsetString.match(/([+-])(\d{2}):?(\d{2})/);
    if (!match) return 0;
    const [, sign, hours, minutes] = match;
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    return sign === '+' ? totalMinutes : -totalMinutes;
  }

  countDecimalPlaces(number) {
    if (typeof number !== 'number' || Number.isNaN(number)) return 0;
    const str = number.toString();
    if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) return str.split('.')[1].length;
    if (str.indexOf('e-') !== -1) return parseInt(str.split('e-')[1], 10);
    return 0;
  }

  isPowerOfTwo(n) {
    n = Number(n);
    return Number.isFinite(n) && n > 0 && (n & (n - 1)) === 0;
  }

  isAnachronisticExifVersion(version, imageDate) {
    if (!version || !imageDate) return false;
    const date = new Date(imageDate);
    const year = date.getFullYear();
    const versionDates = {
      '0100': 1995, '0110': 1996, '0200': 1998, '0210': 1999,
      '0220': 2002, '0221': 2003, '0230': 2010, '0231': 2016, '0232': 2019
    };
    const versionYear = versionDates[version];
    return versionYear && year < versionYear;
  }

  // Traductions EXIF
  translateExposureProgram(program) {
    const programs = {
      0: 'Not defined', 1: 'Manual', 2: 'Normal program',
      3: 'Aperture priority', 4: 'Shutter priority', 5: 'Creative program',
      6: 'Action program', 7: 'Portrait mode', 8: 'Landscape mode'
    };
    return programs?.[program] ?? (program == null ? null : `Unknown (${program})`);
  }

  translateExposureMode(mode) {
    const modes = { 0: 'Auto exposure', 1: 'Manual exposure', 2: 'Auto bracket' };
    return modes?.[mode] ?? (mode == null ? null : `Unknown (${mode})`);
  }

  translateMeteringMode(mode) {
    const modes = {
      0: 'Unknown', 1: 'Average', 2: 'Center weighted average',
      3: 'Spot', 4: 'Multi spot', 5: 'Pattern', 6: 'Partial'
    };
    return modes?.[mode] ?? (mode == null ? null : `Unknown (${mode})`);
  }

  translateWhiteBalance(wb) {
    const balances = { 0: 'Auto white balance', 1: 'Manual white balance' };
    return balances?.[wb] ?? (wb == null ? null : `Unknown (${wb})`);
  }

  translateColorSpace(space) {
    const spaces = { 1: 'sRGB', 2: 'Adobe RGB', 65535: 'Uncalibrated' };
    return spaces?.[space] ?? (space == null ? null : `Unknown (${space})`);
  }

  translateResolutionUnit(unit) {
    const units = { 1: 'No absolute unit', 2: 'Inches', 3: 'Centimeters' };
    return units?.[unit] ?? (unit == null ? null : `Unknown (${unit})`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // =====================================
  // MÉTHODES PUBLIQUES SUPPLÉMENTAIRES
  // =====================================

  createForensicSummary(forensicResult) {
    if (!forensicResult) return null;

    const summary = {
      camera: null,
      settings: null,
      location: null,
      timestamp: null,
      software: null,
      authenticity: { score: 0, level: 'unknown', confidence: 'low' },
      flags: { count: 0, critical: 0 }
    };

    if (forensicResult.camera?.make && forensicResult.camera?.model) {
      summary.camera = `${forensicResult.camera.make} ${forensicResult.camera.model}`;
    }

    if (forensicResult.technical) {
      const tech = forensicResult.technical;
      const parts = [];
      if (tech.iso) parts.push(`ISO ${tech.iso}`);
      if (tech.aperture) parts.push(`f/${tech.aperture}`);
      if (tech.shutterSpeed) parts.push(String(tech.shutterSpeed));
      if (parts.length > 0) summary.settings = parts.join(' • ');
    }

    if (forensicResult.gps?.latitude && forensicResult.gps?.longitude) {
      summary.location = `${forensicResult.gps.latitude.toFixed(6)}, ${forensicResult.gps.longitude.toFixed(6)}`;
    }

    summary.timestamp = forensicResult.timestamps?.dateTimeOriginal || forensicResult.timestamps?.createDate;
    summary.software = forensicResult.software?.creator;

    if (forensicResult.forensicAnalysis?.authenticity) {
      const auth = forensicResult.forensicAnalysis.authenticity;
      summary.authenticity.score = auth.score;
      summary.authenticity.confidence = auth.confidence;
      if (auth.score >= 80) summary.authenticity.level = 'high';
      else if (auth.score >= 60) summary.authenticity.level = 'medium';
      else if (auth.score >= 40) summary.authenticity.level = 'low';
      else summary.authenticity.level = 'very_low';

      summary.flags.count = auth.flags ? auth.flags.length : 0;
      summary.flags.critical = auth.flags ? auth.flags.filter(f => f.includes('CRITICAL') || f.includes('MANIPULATION')).length : 0;
    }

    return summary;
  }

  isFormatSupported(filePath) {
    const ext = path.extname(filePath).toLowerCase().substring(1);
    return this.supportedFormats.includes(ext);
  }

  getCacheStats() {
    const hits = this.cacheHits;
    const misses = this.cacheMisses;
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: (hits + misses) > 0 ? (hits / (hits + misses)) : 0
    };
  }

  clearCache() {
    this.cache.clear();
    console.log('🧹 Cache EXIF nettoyé');
  }

  getLibrariesInfo() {
    return {
      initialized: this.initialized,
      exifr: !!this.exifr,
      piexifjs: !!this.piexifjs,
      sharp: true,
      supportedFormats: this.supportedFormats
    };
  }
}

// ================================
// API unifiée (wrapper non-intrusif)
// ================================
async function __exif_readInputToTempFile(input) {
  // Placeholder: à implémenter si besoin d’accepter buffers/streams/URL
  throw new Error('Not implemented: __exif_readInputToTempFile');
}
function __exif_normalize(forensic) {
  return forensic; // Normalisation supplémentaire possible ici
}
function __exif_validate(normalized) {
  return { ok: true, errors: [] };
}
function __exif_analyze(normalized) {
  return normalized?.forensicAnalysis || null;
}
async function processImage(imageInput, options = {}) {
  // Exemple d’API si imageInput n’est pas un path fichier
  throw new Error('Not implemented: processImage for non-file inputs');
}

// =====================================
// EXPORT SINGLETON + API unifiée
// =====================================
const __exifSingleton = new ExifForensicService();

module.exports = Object.assign(__exifSingleton, {
  ExifForensicService,
  processImage: processImage.bind(__exifSingleton),
  normalize: (f) => __exif_normalize(f),
  validate: (n) => __exif_validate(n),
  analyze: (n) => __exif_analyze(n)
});
