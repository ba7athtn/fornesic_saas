const crypto = require('crypto');

// =====================================
// NORMALISEUR EXIF FORENSIQUE COMPLET
// =====================================

class ExifNormalizer {
    constructor() {
        this.orientationMap = new Map([
            // Valeurs numériques standard
            [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8],
            
            // Valeurs textuelles communes
            ['horizontal (normal)', 1], ['normal', 1], ['top-left', 1],
            ['mirror horizontal', 2], ['top-right', 2],
            ['rotate 180', 3], ['bottom-right', 3],
            ['mirror vertical', 4], ['bottom-left', 4],
            ['mirror horizontal and rotate 270 cw', 5], ['left-top', 5],
            ['rotate 90 cw', 6], ['rotate 90', 6], ['right-top', 6],
            ['mirror horizontal and rotate 90 cw', 7], ['right-bottom', 7],
            ['rotate 270 cw', 8], ['rotate 270', 8], ['left-bottom', 8]
        ]);

        this.resolutionUnitMap = new Map([
            [1, 'none'], [2, 'inches'], [3, 'centimeters'],
            ['none', 1], ['inches', 2], ['centimeters', 3]
        ]);

        this.colorSpaceMap = new Map([
            [1, 'sRGB'], [2, 'Adobe RGB'], [65535, 'Uncalibrated'],
            ['sRGB', 1], ['Adobe RGB', 2], ['Uncalibrated', 65535]
        ]);
    }

    /**
     * Normalisation complète des données EXIF avec validation forensique
     */
    normalizeExifData(rawExifData) {
        if (!this.isValidExifInput(rawExifData)) {
            return null;
        }

        const normalized = {
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

        console.log(`📊 EXIF normalisé: ${normalized.normalizationMetadata.normalizedFieldsCount} champs`);
        
        return normalized;
    }

    /**
     * Normalisation des informations caméra
     */
    normalizeCamera(cameraData) {
        if (!cameraData) return {};

        const camera = {};

        // Marque et modèle
        camera.make = this.normalizeString(cameraData.Make || cameraData.make);
        camera.model = this.normalizeString(cameraData.Model || cameraData.model);
        
        // Numéro de série
        camera.serialNumber = this.normalizeString(
            cameraData.SerialNumber || 
            cameraData.serialNumber || 
            cameraData.BodySerialNumber ||
            cameraData.CameraSerialNumber
        );

        // Informations objectif
        camera.lens = {
            model: this.normalizeString(cameraData.LensModel || cameraData.LensMake),
            make: this.normalizeString(cameraData.LensMake),
            serialNumber: this.normalizeString(cameraData.LensSerialNumber),
            focalLength: this.normalizeNumeric(cameraData.FocalLength),
            maxAperture: this.normalizeNumeric(cameraData.MaxApertureValue)
        };

        // Firmware et version
        camera.firmware = this.normalizeString(
            cameraData.FirmwareVersion || 
            cameraData.firmware ||
            cameraData.InternalVersion
        );

        // Propriétaire
        camera.owner = this.normalizeString(
            cameraData.CameraOwnerName || 
            cameraData.OwnerName ||
            cameraData.Artist
        );

        return this.cleanEmptyFields(camera);
    }

    /**
     * Normalisation des paramètres techniques
     */
    normalizeTechnical(techData) {
        if (!techData) return {};

        const technical = {};

        // Paramètres d'exposition
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
    normalizeTimestamps(timestampData) {
        if (!timestampData) return {};

        const timestamps = {};

        // Timestamps principaux
        timestamps.dateTimeOriginal = this.normalizeDateTime(
            timestampData.DateTimeOriginal || 
            timestampData.dateTimeOriginal
        );

        timestamps.createDate = this.normalizeDateTime(
            timestampData.CreateDate || 
            timestampData.DateTime ||
            timestampData.createDate
        );

        timestamps.modifyDate = this.normalizeDateTime(
            timestampData.ModifyDate || 
            timestampData.modifyDate
        );

        timestamps.digitizedDate = this.normalizeDateTime(
            timestampData.DateTimeDigitized || 
            timestampData.digitizedDate
        );

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
    normalizeGps(gpsData) {
        if (!gpsData) return {};

        const gps = {};

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
    normalizeSoftware(softwareData) {
        if (!softwareData) return {};

        const software = {};

        // Créateur et logiciel
        software.creator = this.normalizeString(
            softwareData.Software || 
            softwareData.CreatorTool || 
            softwareData.creator ||
            softwareData.Artist
        );

        software.processingHistory = this.normalizeProcessingHistory(
            softwareData.ProcessingSoftware || 
            softwareData.processingHistory
        );

        // Versions
        software.exifVersion = this.normalizeString(softwareData.ExifVersion);
        software.flashpixVersion = this.normalizeString(softwareData.FlashpixVersion);

        // Copyright et droits
        software.copyright = this.normalizeString(softwareData.Copyright || softwareData.Rights);
        software.description = this.normalizeString(
            softwareData.ImageDescription || 
            softwareData.Description
        );
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
    normalizeDimensions(dimensionData) {
        if (!dimensionData) return {};

        const dimensions = {};

        // Dimensions principales
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

    normalizeOrientation(value) {
        if (value == null || value === '') return null;

        // Si c'est déjà un nombre valide
        if (typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 8) {
            return value;
        }

        // Si c'est une chaîne
        if (typeof value === 'string') {
            const normalized = value.toLowerCase().trim();
            
            if (this.orientationMap.has(normalized)) {
                return this.orientationMap.get(normalized);
            }

            // Tentative de parsing numérique
            const parsed = parseInt(normalized, 10);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 8) {
                return parsed;
            }
        }

        console.warn(`⚠️ Orientation non reconnue: "${value}"`);
        return null;
    }

    normalizeISO(value) {
        const iso = this.normalizePositiveInteger(value);
        
        // Validation gamme ISO réaliste
        if (iso !== null && (iso < 25 || iso > 409600)) {
            console.warn(`⚠️ ISO suspect: ${iso}`);
        }
        
        return iso;
    }

    normalizeAperture(value) {
        if (value == null) return null;

        // Si c'est une chaîne comme "f/2.8"
        if (typeof value === 'string') {
            const match = value.match(/f?\/?([\d.]+)/i);
            if (match) {
                value = parseFloat(match[1]);
            }
        }

        const aperture = this.normalizeNumeric(value);
        
        // Validation gamme ouverture
        if (aperture !== null && (aperture < 0.5 || aperture > 64)) {
            console.warn(`⚠️ Ouverture suspecte: f/${aperture}`);
        }

        return aperture;
    }

    normalizeShutterSpeed(value) {
        if (value == null) return null;

        // Si c'est déjà un nombre
        if (typeof value === 'number') {
            return value;
        }

        // Si c'est une fraction comme "1/60"
        if (typeof value === 'string') {
            const fractionMatch = value.match(/^(\d+)\/(\d+)$/);
            if (fractionMatch) {
                return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
            }
            
            // Si c'est un nombre en string
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                return parsed;
            }
        }

        return null;
    }

    normalizeFocalLength(value) {
        const focal = this.normalizeNumeric(value);
        
        // Validation gamme focale
        if (focal !== null && (focal < 1 || focal > 2000)) {
            console.warn(`⚠️ Focale suspecte: ${focal}mm`);
        }
        
        return focal;
    }

    normalizeFlash(value) {
        if (value == null) return null;

        const flash = {
            fired: null,
            mode: null,
            redEyeReduction: null
        };

        if (typeof value === 'number') {
            flash.fired = (value & 0x01) === 0x01;
            flash.redEyeReduction = (value & 0x40) === 0x40;
            flash.mode = this.decodeFlashMode(value);
        } else if (typeof value === 'object') {
            flash.fired = value.fired;
            flash.mode = value.mode;
            flash.redEyeReduction = value.redEyeReduction;
        }

        return flash;
    }

    normalizeDateTime(value) {
        if (!value) return null;

        try {
            // Format EXIF standard: "YYYY:MM:DD HH:MM:SS"
            let dateStr = value.toString();
            
            // Remplacer les : par - dans la partie date
            if (dateStr.includes(':') && !dateStr.includes('T')) {
                dateStr = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
            }

            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? null : date.toISOString();

        } catch (error) {
            console.warn(`⚠️ Date invalide: "${value}"`);
            return null;
        }
    }

    normalizeCoordinate(value) {
        if (value == null) return null;

        const coord = this.normalizeNumeric(value);
        
        // Validation coordonnées GPS
        if (coord !== null && Math.abs(coord) > 180) {
            console.warn(`⚠️ Coordonnée invalide: ${coord}`);
            return null;
        }
        
        return coord;
    }

    normalizeAltitude(value) {
        const altitude = this.normalizeNumeric(value);
        
        // Validation altitude
        if (altitude !== null && (altitude < -1000 || altitude > 15000)) {
            console.warn(`⚠️ Altitude suspecte: ${altitude}m`);
        }
        
        return altitude;
    }

    normalizeDirection(value) {
        const direction = this.normalizeNumeric(value);
        
        // Validation direction (0-360°)
        if (direction !== null && (direction < 0 || direction > 360)) {
            console.warn(`⚠️ Direction invalide: ${direction}°`);
            return null;
        }
        
        return direction;
    }

    normalizeSpeed(value) {
        const speed = this.normalizeNumeric(value);
        
        // Validation vitesse
        if (speed !== null && (speed < 0 || speed > 1000)) {
            console.warn(`⚠️ Vitesse suspecte: ${speed}`);
        }
        
        return speed;
    }

    normalizeGPSTime(value) {
        if (!value) return null;

        // Si c'est un array [H, M, S]
        if (Array.isArray(value) && value.length === 3) {
            const [h, m, s] = value.map(v => parseInt(v));
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }

        return this.normalizeString(value);
    }

    normalizeColorSpace(value) {
        if (value == null) return null;

        if (typeof value === 'number') {
            return this.colorSpaceMap.get(value) || `Unknown (${value})`;
        }

        return this.normalizeString(value);
    }

    normalizeWhiteBalance(value) {
        if (value == null) return null;

        const wbMap = {
            0: 'Auto',
            1: 'Manual',
            'auto': 'Auto',
            'manual': 'Manual'
        };

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

        if (typeof value === 'number') {
            return this.resolutionUnitMap.get(value) || `Unknown (${value})`;
        }

        return this.normalizeString(value);
    }

    normalizeQualitySetting(value) {
        if (value == null) return null;

        const qualityMap = {
            0: 'Normal',
            1: 'Soft',
            2: 'Hard'
        };

        return qualityMap[value] || this.normalizeString(value);
    }

    normalizeProcessingHistory(value) {
        if (!value) return [];

        if (Array.isArray(value)) {
            return value.map(item => this.normalizeString(item)).filter(Boolean);
        }

        if (typeof value === 'string') {
            return [this.normalizeString(value)];
        }

        return [];
    }

    // =====================================
    // MÉTHODES UTILITAIRES DE BASE
    // =====================================

    normalizeString(value) {
        if (value == null) return null;
        
        const str = String(value).trim();
        
        // Valeurs vides ou invalides
        if (str === '' || str === 'Unknown' || str === 'N/A' || str === 'undefined') {
            return null;
        }

        // Nettoyer caractères de contrôle
        return str.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
    }

    normalizeNumeric(value) {
        if (value == null || value === '') return null;
        
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    }

    normalizePositiveInteger(value) {
        const num = this.normalizeNumeric(value);
        return (num !== null && num > 0 && Number.isInteger(num)) ? num : null;
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
        
        return modes[flashValue] || `Unknown (0x${flashValue.toString(16)})`;
    }

    validateNormalizedData(normalized) {
        const warnings = normalized.normalizationMetadata.warnings;
        const errors = normalized.normalizationMetadata.errors;

        // Validation cohérence temporelle
        if (normalized.timestamps.dateTimeOriginal && normalized.timestamps.modifyDate) {
            const original = new Date(normalized.timestamps.dateTimeOriginal);
            const modified = new Date(normalized.timestamps.modifyDate);
            
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

    calculateCompletenessScore(normalized) {
        let totalFields = 0;
        let filledFields = 0;

        const sections = ['camera', 'technical', 'timestamps', 'gps', 'software', 'dimensions'];
        
        sections.forEach(section => {
            const sectionData = normalized[section];
            if (sectionData && typeof sectionData === 'object') {
                const sectionCount = this.countFields(sectionData);
                totalFields += this.getExpectedFieldCount(section);
                filledFields += sectionCount;
            }
        });

        const completenessScore = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
        
        normalized.normalizationMetadata.completenessScore = completenessScore;
        normalized.normalizationMetadata.completenessLevel = 
            completenessScore >= 80 ? 'excellent' :
            completenessScore >= 60 ? 'good' :
            completenessScore >= 40 ? 'partial' : 'poor';
    }

    getExpectedFieldCount(section) {
        const expectedCounts = {
            camera: 8,      // make, model, serialNumber, lens, firmware, owner, etc.
            technical: 15,  // iso, aperture, shutterSpeed, flash, etc.
            timestamps: 8,  // dateTimeOriginal, createDate, etc.
            gps: 10,        // latitude, longitude, altitude, etc.
            software: 8,    // creator, versions, copyright, etc.
            dimensions: 8   // width, height, resolution, etc.
        };
        
        return expectedCounts[section] || 5;
    }

    // =====================================
    // MÉTHODES PUBLIQUES UTILITAIRES
    // =====================================

    /**
     * Validation rapide des données EXIF
     */
    validateExifConsistency(exifData) {
        if (!exifData) return { valid: false, issues: ['No EXIF data'] };

        const issues = [];
        let score = 100;

        // Vérifications de cohérence
        if (exifData.technical?.iso && (exifData.technical.iso < 25 || exifData.technical.iso > 102400)) {
            issues.push('ISO_OUT_OF_RANGE');
            score -= 10;
        }

        if (exifData.technical?.focalLength && (exifData.technical.focalLength < 1 || exifData.technical.focalLength > 2000)) {
            issues.push('FOCAL_LENGTH_SUSPICIOUS');
            score -= 5;
        }

        if (exifData.gps?.latitude && exifData.gps?.longitude) {
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

    /**
     * Création d'un résumé EXIF
     */
    createExifSummary(exifData) {
        if (!exifData) return null;

        return {
            camera: exifData.camera?.make && exifData.camera?.model ? 
                `${exifData.camera.make} ${exifData.camera.model}` : null,
            
            settings: this.buildSettingsSummary(exifData.technical),
            
            timestamp: exifData.timestamps?.dateTimeOriginal || 
                      exifData.timestamps?.createDate,
            
            location: exifData.gps?.latitude && exifData.gps?.longitude ? 
                `${exifData.gps.latitude.toFixed(6)}, ${exifData.gps.longitude.toFixed(6)}` : null,
            
            software: exifData.software?.creator,
            
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
                parts.push(`1/${Math.round(1/technical.shutterSpeed)}s`);
            }
        }
        if (technical.focalLength) parts.push(`${technical.focalLength}mm`);

        return parts.length > 0 ? parts.join(' • ') : null;
    }
}

// =====================================
// EXPORT SINGLETON ET FONCTIONS
// =====================================

const normalizer = new ExifNormalizer();

// Fonctions legacy pour compatibilité
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
    
    // Export direct de la classe pour usage avancé
    createExifSummary: (data) => normalizer.createExifSummary(data),
    
    // Constantes utiles
    ORIENTATION_MAP: normalizer.orientationMap
};
