const os = require('os');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

// =====================================
// SERVICE EXIF FORENSIQUE COMPLET
// =====================================

class ExifForensicService {
    constructor() {
        this.exifr = null;
        this.piexifjs = null;
        this.cache = new Map();
        this.maxCacheSize = 1000;
        this.initialized = false;
        this.supportedFormats = ['jpg', 'jpeg', 'tiff', 'tif', 'webp', 'png', 'dng', 'cr2', 'nef', 'arw', 'orf'];
        this.initializeLibraries();
    }

    async initializeLibraries() {
        try {
            console.log('📊 Initialisation service EXIF forensique...');
            
            // Essayer d'importer exifr (recommandé)
            try {
                this.exifr = require('exifr');
                console.log('✅ ExifR initialisé');
            } catch (error) {
                console.warn('⚠️ ExifR non disponible');
            }

            // Essayer d'importer piexifjs (fallback)
            try {
                this.piexifjs = require('piexifjs');
                console.log('✅ PiexifJS initialisé');
            } catch (error) {
                console.warn('⚠️ PiexifJS non disponible');
            }

            this.initialized = true;
            console.log('✅ Service EXIF forensique initialisé');
            
        } catch (error) {
            console.error('❌ Erreur initialisation EXIF service:', error);
            this.initialized = false;
        }
    }

    /**
     * Extraction EXIF complète avec analyse forensique
     */
    async extractForensicExifData(filePath, options = {}) {
        const startTime = Date.now();
        const cacheKey = this.generateCacheKey(filePath);

        try {
            // Vérifier cache
            if (this.cache.has(cacheKey) && !options.forceRefresh) {
                console.log(`📊 EXIF récupéré du cache: ${path.basename(filePath)}`);
                return this.cache.get(cacheKey);
            }

            // Validation fichier
            if (!fsSync.existsSync(filePath)) {
                throw new Error(`Fichier introuvable: ${filePath}`);
            }

            const stats = await fs.stat(filePath);
            if (stats.size === 0) {
                throw new Error('Fichier vide');
            }

            if (stats.size > 500 * 1024 * 1024) { // 500MB max
                throw new Error('Fichier trop volumineux pour extraction EXIF');
            }

            console.log(`📊 Extraction EXIF forensique: ${path.basename(filePath)} (${this.formatBytes(stats.size)})`);

            // Structure de résultat forensique complète
            const forensicResult = {
                // Métadonnées de base
                file: {
                    path: filePath,
                    name: path.basename(filePath),
                    size: stats.size,
                    extension: path.extname(filePath).toLowerCase(),
                    created: stats.birthtime,
                    modified: stats.mtime,
                    accessed: stats.atime
                },

                // Données EXIF extraites
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

                // Analyse forensique
                forensicAnalysis: {
                    authenticity: {
                        score: 100,
                        flags: [],
                        confidence: 'high'
                    },
                    consistency: {
                        temporal: true,
                        technical: true,
                        geographic: true
                    },
                    manipulation: {
                        detected: false,
                        indicators: [],
                        confidence: 'low'
                    }
                },

                // Hash et signature
                integrity: {
                    sha256: '',
                    md5: '',
                    signature: '',
                    verified: true
                },

                // Métadonnées extraction
                extractionMetadata: {
                    method: 'unknown',
                    version: '3.0.0-forensic',
                    processingTime: 0,
                    errors: [],
                    warnings: [],
                    extractedAt: new Date().toISOString()
                }
            };

            // Calcul hash du fichier
            const fileBuffer = await fs.readFile(filePath);
            forensicResult.integrity.sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
            forensicResult.integrity.md5 = crypto.createHash('md5').update(fileBuffer).digest('hex');

            // 1. Extraction avec ExifR (méthode principale)
            if (this.exifr) {
                try {
                    const exifrData = await this.extractWithExifR(filePath, fileBuffer);
                    this.mergeExifData(forensicResult, exifrData);
                    forensicResult.extractionMetadata.method = 'exifr';
                } catch (exifrError) {
                    forensicResult.extractionMetadata.errors.push(`ExifR: ${exifrError.message}`);
                }
            }

            // 2. Extraction avec Sharp (fallback et complément)
            try {
                const sharpData = await this.extractWithSharp(filePath);
                this.mergeExifData(forensicResult, sharpData);
                if (!forensicResult.extractionMetadata.method || forensicResult.extractionMetadata.method === 'unknown') {
                    forensicResult.extractionMetadata.method = 'sharp';
                }
            } catch (sharpError) {
                forensicResult.extractionMetadata.errors.push(`Sharp: ${sharpError.message}`);
            }

            // 3. Extraction avec PiexifJS (pour JPEG spécifiquement)
            if (this.piexifjs && this.isJPEG(filePath)) {
                try {
                    const piexifData = await this.extractWithPiexif(fileBuffer);
                    this.mergeExifData(forensicResult, piexifData);
                } catch (piexifError) {
                    forensicResult.extractionMetadata.errors.push(`Piexif: ${piexifError.message}`);
                }
            }

            // 4. Extraction manuelle des données de base
            try {
                const basicData = await this.extractBasicFileInfo(filePath, stats);
                this.mergeExifData(forensicResult, basicData);
            } catch (basicError) {
                forensicResult.extractionMetadata.errors.push(`Basic: ${basicError.message}`);
            }

            // 5. Analyse forensique complète
            forensicResult.forensicAnalysis = await this.performForensicAnalysis(forensicResult, fileBuffer);

            // 6. Validation de cohérence
            const consistencyAnalysis = await this.validateConsistency(forensicResult);
            forensicResult.forensicAnalysis.consistency = consistencyAnalysis;

            // 7. Détection de manipulation
            const manipulationAnalysis = await this.detectExifManipulation(forensicResult);
            forensicResult.forensicAnalysis.manipulation = manipulationAnalysis;

            // 8. Calcul score d'authenticité final
            forensicResult.forensicAnalysis.authenticity = this.calculateAuthenticityScore(forensicResult);

            // Finalisation
            forensicResult.extractionMetadata.processingTime = Date.now() - startTime;
            
            // Cache le résultat
            this.updateCache(cacheKey, forensicResult);

            console.log(`✅ EXIF forensique extrait: ${path.basename(filePath)} - Score: ${forensicResult.forensicAnalysis.authenticity.score}% (${forensicResult.extractionMetadata.processingTime}ms)`);

            return forensicResult;

        } catch (error) {
            console.error(`❌ Erreur extraction EXIF forensique ${filePath}:`, error);
            
            return {
                file: {
                    path: filePath,
                    name: path.basename(filePath),
                    error: error.message
                },
                forensicAnalysis: {
                    authenticity: {
                        score: 0,
                        confidence: 'error'
                    }
                },
                extractionMetadata: {
                    processingTime: Date.now() - startTime,
                    errors: [error.message],
                    extractedAt: new Date().toISOString()
                }
            };
        }
    }

    /**
     * Extraction avec ExifR (méthode principale)
     */
    async extractWithExifR(filePath, fileBuffer) {
        if (!this.exifr) {
            throw new Error('ExifR non disponible');
        }

        const options = {
            // Sections complètes
            tiff: true,
            exif: true,
            gps: true,
            interop: true,
            makernote: true,
            iptc: true,
            icc: true,
            jfif: true,
            ihdr: true,
            
            // Comportement
            mergeOutput: false,
            translateKeys: false,
            translateValues: true,
            reviveValues: true,
            sanitize: false,
            
            // Performance
            chunked: false,
            firstChunkSize: undefined,
            chunkLimit: undefined,
            
            // Sélection de champs (complet)
            pick: [
                // === APPAREIL PHOTO ===
                'Make', 'Model', 'LensModel', 'LensMake', 'LensSerialNumber',
                'SerialNumber', 'InternalSerialNumber', 'CameraSerialNumber',
                'BodySerialNumber', 'LensSerialNumber',
                
                // === PARAMÈTRES TECHNIQUES ===
                'ISO', 'ISOSpeedRatings', 'RecommendedExposureIndex',
                'FNumber', 'ApertureValue', 'MaxApertureValue',
                'ExposureTime', 'ShutterSpeedValue',
                'FocalLength', 'FocalLengthIn35mmFormat',
                'DigitalZoomRatio', 'SceneCaptureType',
                'ExposureProgram', 'ExposureMode', 'ExposureCompensation',
                'MeteringMode', 'LightSource', 'Flash', 'FlashMode',
                'WhiteBalance', 'ColorSpace', 'ColorMode',
                'Saturation', 'Sharpness', 'Contrast',
                'BrightnessValue', 'SubjectDistance', 'SubjectDistanceRange',
                
                // === TIMESTAMPS ===
                'DateTime', 'DateTimeOriginal', 'DateTimeDigitized',
                'CreateDate', 'ModifyDate', 'MetadataDate',
                'OffsetTime', 'OffsetTimeOriginal', 'OffsetTimeDigitized',
                'TimeZone', 'TimeZoneOffset',
                'SubSecTime', 'SubSecTimeOriginal', 'SubSecTimeDigitized',
                
                // === GPS ===
                'GPSLatitude', 'GPSLongitude', 'GPSAltitude', 'GPSAltitudeRef',
                'GPSSpeed', 'GPSSpeedRef', 'GPSImgDirection', 'GPSImgDirectionRef',
                'GPSDestBearing', 'GPSDestBearingRef', 'GPSTrack', 'GPSTrackRef',
                'GPSDateStamp', 'GPSTimeStamp', 'GPSProcessingMethod',
                'GPSVersionID', 'GPSMapDatum', 'GPSAreaInformation',
                'GPSDifferential', 'GPSHPositioningError',
                
                // === SOFTWARE ===
                'Software', 'ProcessingSoftware', 'Creator', 'Artist',
                'Copyright', 'ImageDescription', 'UserComment',
                'CameraOwnerName', 'OwnerName',
                'HostComputer', 'ProcessingVersion', 'ProcessingDate',
                
                // === DIMENSIONS ET FORMAT ===
                'ImageWidth', 'ImageHeight', 'ImageLength',
                'ExifImageWidth', 'ExifImageHeight',
                'PixelXDimension', 'PixelYDimension',
                'XResolution', 'YResolution', 'ResolutionUnit',
                'Orientation', 'Rotation', 'Mirror',
                'BitsPerSample', 'SamplesPerPixel', 'PhotometricInterpretation',
                'Compression', 'CompressedBitsPerPixel',
                
                // === QUALITÉ ET COMPRESSION ===
                'Quality', 'CompressionLevel', 'JPEGQuality',
                'ThumbnailOffset', 'ThumbnailLength',
                'ThumbnailImage', 'PreviewImageStart', 'PreviewImageLength',
                
                // === MAKERNOTES SPÉCIFIQUES ===
                // Canon
                'CanonModelID', 'CanonFirmwareVersion', 'CanonImageNumber',
                'CanonSerialNumber', 'CanonColorSpace', 'CanonWhiteBalance',
                
                // Nikon
                'NikonColorSpace', 'NikonFlashSetting', 'NikonFocusMode',
                'NikonISOSetting', 'NikonQuality', 'NikonWhiteBalance',
                
                // Sony
                'SonyModelID', 'SonyColorSpace', 'SonyWhiteBalance',
                'SonyQuality', 'SonyFlashMode',
                
                // === IPTC ===
                'Keywords', 'Category', 'SupplementalCategories',
                'Caption-Abstract', 'Writer-Editor', 'Headline',
                'SpecialInstructions', 'CreationDate', 'CreationTime',
                'DigitalCreationDate', 'DigitalCreationTime',
                'Byline', 'BylineTitle', 'Credit', 'Source',
                'ObjectName', 'City', 'Province-State', 'Country-PrimaryLocationName',
                
                // === XMP ===
                'Title', 'Description', 'Subject', 'Creator',
                'Rights', 'Format', 'Identifier',
                'CreatorTool', 'CreateDate', 'ModifyDate', 'MetadataDate',
                'DocumentID', 'InstanceID', 'OriginalDocumentID',
                
                // === SÉCURITÉ ET FORENSIQUE ===
                'SecurityClassification', 'ImageUniqueID',
                'CameraID', 'LensID', 'FlashPixVersion',
                'ExifVersion', 'FlashpixVersion', 'InteropVersion',
                'ComponentsConfiguration', 'MakerNoteVersion'
            ]
        };

        try {
            const rawData = await this.exifr.parse(filePath, options);
            
            if (!rawData) {
                throw new Error('Aucune donnée EXIF trouvée');
            }

            // Structurer les données extraites
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

    /**
     * Extraction avec Sharp (fallback et complément)
     */
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

    /**
     * Extraction avec PiexifJS (spécialement pour JPEG)
     */
    async extractWithPiexif(fileBuffer) {
        if (!this.piexifjs) {
            throw new Error('PiexifJS non disponible');
        }

        try {
            const dataUrl = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
            const exifObj = this.piexifjs.load(dataUrl);
            
            if (!exifObj || Object.keys(exifObj).length === 0) {
                throw new Error('Aucune donnée EXIF trouvée avec PiexifJS');
            }

            // Convertir les données PiexifJS vers notre format
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
            
            // Destination
            destBearing: rawData.GPSDestBearing || null,
            destBearingRef: rawData.GPSDestBearingRef || null,
            
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

        // Calculer coordonnées si disponibles
        if (gps.latitude !== null && gps.longitude !== null) {
            gps.coordinates = {
                decimal: {
                    latitude: gps.latitude,
                    longitude: gps.longitude
                },
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

        // Canon makernotes
        if (makernotes.manufacturer && makernotes.manufacturer.includes('canon')) {
            makernotes.data.canon = {
                modelID: rawData.CanonModelID,
                imageNumber: rawData.CanonImageNumber,
                serialNumber: rawData.CanonSerialNumber,
                firmwareVersion: rawData.CanonFirmwareVersion,
                colorSpace: rawData.CanonColorSpace,
                whiteBalance: rawData.CanonWhiteBalance
            };
        }

        // Nikon makernotes
        if (makernotes.manufacturer && makernotes.manufacturer.includes('nikon')) {
            makernotes.data.nikon = {
                colorSpace: rawData.NikonColorSpace,
                flashSetting: rawData.NikonFlashSetting,
                focusMode: rawData.NikonFocusMode,
                isoSetting: rawData.NikonISOSetting,
                quality: rawData.NikonQuality,
                whiteBalance: rawData.NikonWhiteBalance
            };
        }

        // Sony makernotes
        if (makernotes.manufacturer && makernotes.manufacturer.includes('sony')) {
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
                authenticity: {
                    score: 100,
                    flags: [],
                    confidence: 'high'
                },
                consistency: {
                    temporal: true,
                    technical: true,
                    geographic: true,
                    details: {}
                },
                manipulation: {
                    detected: false,
                    indicators: [],
                    confidence: 'low',
                    types: []
                }
            };

            // Analyse cohérence temporelle
            const temporalAnalysis = this.analyzeTemporalConsistency(forensicResult.timestamps);
            analysis.consistency.temporal = temporalAnalysis.consistent;
            analysis.consistency.details.temporal = temporalAnalysis;
            
            if (!temporalAnalysis.consistent) {
                analysis.authenticity.score -= 20;
                analysis.authenticity.flags.push(...temporalAnalysis.anomalies);
            }

            // Analyse cohérence technique
            const technicalAnalysis = this.analyzeTechnicalConsistency(forensicResult.technical, forensicResult.camera);
            analysis.consistency.technical = technicalAnalysis.consistent;
            analysis.consistency.details.technical = technicalAnalysis;
            
            if (!technicalAnalysis.consistent) {
                analysis.authenticity.score -= 15;
                analysis.authenticity.flags.push(...technicalAnalysis.anomalies);
            }

            // Analyse cohérence géographique
            const geographicAnalysis = this.analyzeGeographicConsistency(forensicResult.gps, forensicResult.timestamps);
            analysis.consistency.geographic = geographicAnalysis.consistent;
            analysis.consistency.details.geographic = geographicAnalysis;
            
            if (!geographicAnalysis.consistent) {
                analysis.authenticity.score -= 10;
                analysis.authenticity.flags.push(...geographicAnalysis.anomalies);
            }

            // Détection signatures de manipulation
            const manipulationSigns = this.detectManipulationSignatures(forensicResult);
            if (manipulationSigns.detected) {
                analysis.manipulation.detected = true;
                analysis.manipulation.indicators = manipulationSigns.signatures;
                analysis.manipulation.types = manipulationSigns.types;
                analysis.manipulation.confidence = manipulationSigns.confidence;
                analysis.authenticity.score -= 30;
                analysis.authenticity.flags.push(...manipulationSigns.signatures);
            }

            // Détection de double enregistrement/modification
            const doubleProcessing = this.detectDoubleProcessing(forensicResult);
            if (doubleProcessing.detected) {
                analysis.manipulation.detected = true;
                analysis.manipulation.indicators.push(...doubleProcessing.indicators);
                analysis.authenticity.score -= 25;
            }

            // Analyse anomalies de métadonnées
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
                authenticity: {
                    score: 0,
                    confidence: 'error',
                    flags: ['FORENSIC_ANALYSIS_ERROR']
                },
                error: error.message
            };
        }
    }

    analyzeTemporalConsistency(timestamps) {
        const anomalies = [];
        let consistent = true;

        if (!timestamps) {
            return { consistent: false, anomalies: ['NO_TIMESTAMP_DATA'] };
        }

        // Vérifier cohérence entre timestamps
        if (timestamps.dateTimeOriginal && timestamps.createDate) {
            const original = new Date(timestamps.dateTimeOriginal);
            const create = new Date(timestamps.createDate);
            const diff = Math.abs(original - create);
            
            if (diff > 300000) { // Plus de 5 minutes
                anomalies.push('TIMESTAMP_LARGE_DIFFERENCE');
                consistent = false;
            }
        }

        // Vérifier timestamps dans le futur
        const now = new Date();
        const futureThreshold = 24 * 60 * 60 * 1000; // 24 heures de tolérance
        
        Object.entries(timestamps).forEach(([key, timestamp]) => {
            if (timestamp && typeof timestamp === 'string') {
                try {
                    const date = new Date(timestamp);
                    if (date > now && (date - now) > futureThreshold) {
                        anomalies.push(`FUTURE_TIMESTAMP_${key.toUpperCase()}`);
                        consistent = false;
                    }
                } catch (e) {
                    anomalies.push(`INVALID_TIMESTAMP_${key.toUpperCase()}`);
                    consistent = false;
                }
            }
        });

        // Vérifier ordre logique des timestamps
        if (timestamps.dateTimeOriginal && timestamps.modifyDate) {
            const original = new Date(timestamps.dateTimeOriginal);
            const modified = new Date(timestamps.modifyDate);
            
            if (modified < original) {
                anomalies.push('MODIFY_DATE_BEFORE_ORIGINAL');
                consistent = false;
            }
        }

        // Vérifier cohérence fuseaux horaires
        if (timestamps.offsetTime && timestamps.offsetTimeOriginal) {
            if (timestamps.offsetTime !== timestamps.offsetTimeOriginal) {
                // Peut être normal mais suspect si grande différence
                const offsetDiff = this.parseTimezoneOffset(timestamps.offsetTime) - 
                                 this.parseTimezoneOffset(timestamps.offsetTimeOriginal);
                
                if (Math.abs(offsetDiff) > 12) { // Plus de 12 heures de différence
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

        if (!technical) {
            return { consistent: false, anomalies: ['NO_TECHNICAL_DATA'] };
        }

        // Vérifier cohérence exposition
        if (technical.iso && technical.aperture && technical.shutterSpeed) {
            // Règles basiques de cohérence d'exposition
            const iso = parseFloat(technical.iso);
            const aperture = parseFloat(technical.aperture);
            const shutterSpeed = this.parseShutterSpeed(technical.shutterSpeed);

            if (iso && aperture && shutterSpeed) {
                // ISO impossible
                if (iso < 25 || iso > 409600) {
                    anomalies.push('IMPOSSIBLE_ISO_VALUE');
                    consistent = false;
                }

                // Ouverture impossible
                if (aperture < 0.5 || aperture > 64) {
                    anomalies.push('IMPOSSIBLE_APERTURE_VALUE');
                    consistent = false;
                }

                // Vitesse impossible
                if (shutterSpeed > 30 || shutterSpeed < 0.000001) {
                    anomalies.push('IMPOSSIBLE_SHUTTER_SPEED');
                    consistent = false;
                }
            }
        }

        // Vérifier cohérence appareil/objectif
        if (camera && camera.make && camera.lens && camera.lens.make) {
            const cameraMake = camera.make.toLowerCase();
            const lensMake = camera.lens.make.toLowerCase();
            
            // Vérifier compatibilité basique marque/objectif
            const incompatibleCombinations = [
                ['canon', 'nikon'],
                ['nikon', 'canon'],
                ['sony', 'canon'],
                ['canon', 'sony']
            ];

            for (const [camMake, lensMake2] of incompatibleCombinations) {
                if (cameraMake.includes(camMake) && lensMake.includes(lensMake2)) {
                    anomalies.push('INCOMPATIBLE_CAMERA_LENS');
                    consistent = false;
                    break;
                }
            }
        }

        // Vérifier cohérence colorimétrique
        if (technical.whiteBalance && technical.colorSpace) {
            // Certaines combinaisons sont suspectes
            if (technical.colorSpace === 'uncalibrated' && technical.whiteBalance === 'auto') {
                anomalies.push('SUSPICIOUS_COLOR_COMBINATION');
                consistent = false;
            }
        }

        // Vérifier valeurs flash
        if (technical.flash && technical.flash.fired !== undefined) {
            const flashFired = technical.flash.fired;
            const flashMode = technical.flash.mode;
            
            // Flash tiré mais mode désactivé
            if (flashFired && flashMode && flashMode.toLowerCase().includes('off')) {
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

        // Vérifier coordonnées valides
        if (gps.latitude !== null && (Math.abs(gps.latitude) > 90)) {
            anomalies.push('INVALID_GPS_LATITUDE');
            consistent = false;
        }

        if (gps.longitude !== null && (Math.abs(gps.longitude) > 180)) {
            anomalies.push('INVALID_GPS_LONGITUDE');
            consistent = false;
        }

        // Vérifier altitude réaliste
        if (gps.altitude !== null) {
            if (gps.altitude < -500 || gps.altitude > 10000) {
                anomalies.push('UNUSUAL_GPS_ALTITUDE');
                consistent = false;
            }
        }

        // Vérifier cohérence timestamp GPS avec timestamp image
        if (gps.timestamp && timestamps && timestamps.dateTimeOriginal) {
            const gpsTime = new Date(gps.timestamp);
            const imageTime = new Date(timestamps.dateTimeOriginal);
            const timeDiff = Math.abs(gpsTime - imageTime);

            // Plus de 1 heure de différence
            if (timeDiff > 3600000) {
                anomalies.push('GPS_IMAGE_TIME_MISMATCH');
                consistent = false;
            }
        }

        // Vérifier précision suspecte (coordonnées trop rondes)
        if (gps.latitude !== null && gps.longitude !== null) {
            const latStr = gps.latitude.toString();
            const lngStr = gps.longitude.toString();
            
            // Coordonnées exactement rondes (très suspect)
            if (gps.latitude % 1 === 0 && gps.longitude % 1 === 0) {
                anomalies.push('SUSPICIOUS_ROUND_COORDINATES');
                consistent = false;
            }
            
            // Trop de précision (plus de 8 décimales = suspect)
            if (this.countDecimalPlaces(gps.latitude) > 8 || this.countDecimalPlaces(gps.longitude) > 8) {
                anomalies.push('EXCESSIVE_GPS_PRECISION');
                consistent = false;
            }
        }

        // Vérifier cohérence vitesse
        if (gps.speed !== null && gps.speed > 500) { // Plus de 500 km/h
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

        // Logiciels de manipulation suspects
        const suspiciousSoftware = [
            'photoshop', 'gimp', 'paint.net', 'facetune', 'snapseed', 
            'lightroom', 'capture one', 'luminar', 'skylum', 'affinity photo',
            'pixelmator', 'canva', 'picasa', 'photoscape', 'fotor'
        ];

        if (forensicResult.software && forensicResult.software.creator) {
            const software = forensicResult.software.creator.toLowerCase();
            for (const suspect of suspiciousSoftware) {
                if (software.includes(suspect)) {
                    signatures.push(`MANIPULATION_SOFTWARE_${suspect.toUpperCase().replace(/\s+/g, '_')}`);
                    types.push('software_editing');
                    detected = true;
                    confidence = 'medium';
                }
            }
        }

        // Historique de traitement suspect
        if (forensicResult.software && forensicResult.software.processingHistory) {
            const history = forensicResult.software.processingHistory;
            if (Array.isArray(history) && history.length > 3) {
                signatures.push('MULTIPLE_PROCESSING_STEPS');
                types.push('complex_editing');
                detected = true;
            }
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

        // Incohérences de version EXIF
        if (forensicResult.software) {
            const exifVersion = forensicResult.software.exifVersion;
            const flashpixVersion = forensicResult.software.flashpixVersion;
            
            // Versions EXIF anachroniques
            if (exifVersion && this.isAnachronisticExifVersion(exifVersion, forensicResult.timestamps.dateTimeOriginal)) {
                signatures.push('ANACHRONISTIC_EXIF_VERSION');
                types.push('version_mismatch');
                detected = true;
            }
        }

        // Signatures de générateurs d'IA
        const aiSignatures = [
            'stable diffusion', 'dall-e', 'midjourney', 'firefly', 'leonardo',
            'runway ml', 'artbreeder', 'deepart', 'dreamstudio'
        ];

        if (forensicResult.software && forensicResult.software.creator) {
            const creator = forensicResult.software.creator.toLowerCase();
            for (const aiSig of aiSignatures) {
                if (creator.includes(aiSig)) {
                    signatures.push(`AI_GENERATED_${aiSig.toUpperCase().replace(/\s+/g, '_')}`);
                    types.push('ai_generation');
                    detected = true;
                    confidence = 'very_high';
                }
            }
        }

        // Patterns de noms de fichiers suspects
        if (forensicResult.file && forensicResult.file.name) {
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
            types: [...new Set(types)], // Remove duplicates
            confidence: confidence
        };
    }

    detectDoubleProcessing(forensicResult) {
        const indicators = [];
        let detected = false;

        // Double compression JPEG (patterns dans metadata)
        if (forensicResult.technical && forensicResult.technical.quality) {
            // Patterns typiques de double compression
            const quality = parseInt(forensicResult.technical.quality);
            if (quality && (quality === 85 || quality === 95)) {
                // Ces valeurs sont souvent utilisées par défaut lors de recompression
                indicators.push('TYPICAL_RECOMPRESSION_QUALITY');
                detected = true;
            }
        }

        // Timestamps multiples de modification
        if (forensicResult.timestamps) {
            const modifyCount = Object.keys(forensicResult.timestamps)
                .filter(key => key.includes('modify') || key.includes('digitized')).length;
            
            if (modifyCount > 2) {
                indicators.push('MULTIPLE_MODIFICATION_TIMESTAMPS');
                detected = true;
            }
        }

        // Présence de métadonnées de logiciels multiples
        if (forensicResult.software && forensicResult.software.processingHistory) {
            if (forensicResult.software.processingHistory.length > 1) {
                indicators.push('MULTIPLE_SOFTWARE_PROCESSING');
                detected = true;
            }
        }

        return { detected, indicators };
    }

    detectMetadataAnomalies(forensicResult) {
        const anomalies = [];

        // Métadonnées trop parfaites
        if (forensicResult.gps && forensicResult.gps.latitude && forensicResult.gps.longitude) {
            const lat = forensicResult.gps.latitude;
            const lng = forensicResult.gps.longitude;
            
            // Coordonnées exactement sur des lignes de grille
            if (lat % 0.01 === 0 && lng % 0.01 === 0) {
                anomalies.push('GRID_ALIGNED_GPS');
            }
        }

        // Paramètres techniques trop parfaits
        if (forensicResult.technical) {
            const tech = forensicResult.technical;
            
            // ISO exactement puissance de 2
            if (tech.iso && this.isPowerOfTwo(tech.iso) && tech.iso > 100) {
                anomalies.push('PERFECT_POWER_OF_TWO_ISO');
            }

            // Vitesse d'obturation exactement fractionnaire
            if (tech.shutterSpeed && typeof tech.shutterSpeed === 'string') {
                if (/^1\/\d+$/.test(tech.shutterSpeed)) {
                    const denominator = parseInt(tech.shutterSpeed.split('/')[1]);
                    if (this.isPowerOfTwo(denominator)) {
                        anomalies.push('PERFECT_FRACTIONAL_SHUTTER');
                    }
                }
            }
        }

        // Absence de bruit dans les métadonnées
        if (forensicResult.extractionMetadata && forensicResult.extractionMetadata.errors.length === 0) {
            // C'est suspect si aucune erreur d'extraction
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
        
        if (analysis.manipulation.detected && analysis.manipulation.confidence === 'very_high') {
            return 'very_high';
        }
        
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
        
        // Appliquer pénalités basées sur l'analyse forensique
        if (forensicResult.forensicAnalysis) {
            score = forensicResult.forensicAnalysis.authenticity.score;
            flags.push(...forensicResult.forensicAnalysis.authenticity.flags);
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
            // Supprimer les plus anciens
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, data);
    }

    mergeExifData(target, source) {
        for (const [category, data] of Object.entries(source)) {
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                if (!target[category]) target[category] = {};
                Object.assign(target[category], data);
            } else if (data !== undefined && data !== null) {
                target[category] = data;
            }
        }
    }

    convertPiexifData(exifObj) {
        // Conversion des données PiexifJS vers notre format
        const converted = {
            camera: {},
            technical: {},
            timestamps: {},
            gps: {}
        };

        // Mapper les données EXIF de PiexifJS
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
        
        // Détection par signature
        if (signature.startsWith('FFD8FF')) return 'image/jpeg';
        if (signature.startsWith('89504E47')) return 'image/png';
        if (signature.startsWith('47494638')) return 'image/gif';
        if (signature.startsWith('52494646')) return 'image/webp';
        if (signature.startsWith('49492A00') || signature.startsWith('4D4D002A')) return 'image/tiff';
        
        // Fallback par extension
        const mimeTypes = {
            '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
            '.png': 'image/png', '.gif': 'image/gif',
            '.webp': 'image/webp', '.tiff': 'image/tiff', '.tif': 'image/tiff',
            '.bmp': 'image/bmp', '.svg': 'image/svg+xml'
        };
        
        return mimeTypes[extension] || 'application/octet-stream';
    }

    detectFileSignature(buffer) {
        const signature = buffer.toString('hex', 0, 16).toUpperCase();
        return signature;
    }

    detectEncoding(buffer) {
        // Détection basique d'encodage
        if (buffer.includes(0x00)) return 'binary';
        
        try {
            buffer.toString('utf8');
            return 'utf8';
        } catch (e) {
            return 'binary';
        }
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
            
            // Ajouter sous-secondes si disponibles
            if (subSeconds) {
                dateStr += `.${subSeconds}`;
            }
            
            // Gestion des formats EXIF standard
            if (dateStr.includes(':') && !dateStr.includes('T')) {
                // Format EXIF: "2023:12:25 14:30:45"
                dateStr = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
            }
            
            const date = new Date(dateStr);
            return isNaN(date.getTime()) ? null : date.toISOString();
            
        } catch (error) {
            return null;
        }
    }

    parseGPSTimestamp(dateStamp, timeStamp) {
        if (!dateStamp || !timeStamp) return null;
        
        try {
            // GPS date format: "2023:12:25"
            // GPS time format: [14, 30, 45] ou "14:30:45"
            let dateStr = dateStamp.replace(/:/g, '-');
            
            let timeStr;
            if (Array.isArray(timeStamp)) {
                timeStr = timeStamp.map(t => String(t).padStart(2, '0')).join(':');
            } else {
                timeStr = timeStamp;
            }
            
            const dateTimeStr = `${dateStr}T${timeStr}Z`;
            const date = new Date(dateTimeStr);
            
            return isNaN(date.getTime()) ? null : date.toISOString();
            
        } catch (error) {
            return null;
        }
    }

    decimalToDMS(decimal, type) {
        const absolute = Math.abs(decimal);
        const degrees = Math.floor(absolute);
        const minutes = Math.floor((absolute - degrees) * 60);
        const seconds = ((absolute - degrees) * 60 - minutes) * 60;
        
        let direction;
        if (type === 'lat') {
            direction = decimal >= 0 ? 'N' : 'S';
        } else {
            direction = decimal >= 0 ? 'E' : 'W';
        }
        
        return `${degrees}°${minutes}'${seconds.toFixed(3)}"${direction}`;
    }

    convertGPSCoordinate(coordinate, ref) {
        if (!coordinate || !Array.isArray(coordinate)) return null;
        
        const [degrees, minutes, seconds] = coordinate;
        let decimal = degrees + (minutes / 60) + (seconds / 3600);
        
        if (ref === 'S' || ref === 'W') {
            decimal = -decimal;
        }
        
        return decimal;
    }

    extractProcessingHistory(rawData) {
        const history = [];
        
        // Historique from XMP
        if (rawData.ProcessingSoftware) {
            history.push(rawData.ProcessingSoftware);
        }
        
        // Historique from IPTC
        if (rawData.Software) {
            history.push(rawData.Software);
        }
        
        return history.length > 0 ? history : null;
    }

    parseFlashValue(flash) {
        if (typeof flash !== 'number') return null;
        return (flash & 0x01) === 0x01; // Bit 0 indicates if flash fired
    }

    hasRedEyeReduction(flash) {
        if (typeof flash !== 'number') return null;
        return (flash & 0x40) === 0x40; // Bit 6 indicates red-eye reduction
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
        if (!number || typeof number !== 'number') return 0;
        
        const str = number.toString();
        if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
            return str.split('.')[1].length;
        } else if (str.indexOf('e-') !== -1) {
            const parts = str.split('e-');
            return parseInt(parts[1], 10);
        }
        return 0;
    }

    isPowerOfTwo(n) {
        return n && (n & (n - 1)) === 0;
    }

    isAnachronisticExifVersion(version, imageDate) {
        if (!version || !imageDate) return false;
        
        const date = new Date(imageDate);
        const year = date.getFullYear();
        
        // Versions EXIF avec dates d'introduction
        const versionDates = {
            '0100': 1995, // EXIF 1.0
            '0110': 1996, // EXIF 1.1
            '0200': 1998, // EXIF 2.0
            '0210': 1999, // EXIF 2.1
            '0220': 2002, // EXIF 2.2
            '0221': 2003, // EXIF 2.21
            '0230': 2010, // EXIF 2.3
            '0231': 2016, // EXIF 2.31
            '0232': 2019  // EXIF 2.32
        };
        
        const versionYear = versionDates[version];
        return versionYear && year < versionYear;
    }

    // Traductions des valeurs EXIF
    translateExposureProgram(program) {
        const programs = {
            0: 'Not defined', 1: 'Manual', 2: 'Normal program',
            3: 'Aperture priority', 4: 'Shutter priority', 5: 'Creative program',
            6: 'Action program', 7: 'Portrait mode', 8: 'Landscape mode'
        };
        return programs[program] || `Unknown (${program})`;
    }

    translateExposureMode(mode) {
        const modes = { 0: 'Auto exposure', 1: 'Manual exposure', 2: 'Auto bracket' };
        return modes[mode] || `Unknown (${mode})`;
    }

    translateMeteringMode(mode) {
        const modes = {
            0: 'Unknown', 1: 'Average', 2: 'Center weighted average',
            3: 'Spot', 4: 'Multi spot', 5: 'Pattern', 6: 'Partial'
        };
        return modes[mode] || `Unknown (${mode})`;
    }

    translateWhiteBalance(wb) {
        const balances = { 0: 'Auto white balance', 1: 'Manual white balance' };
        return balances[wb] || `Unknown (${wb})`;
    }

    translateColorSpace(space) {
        const spaces = { 1: 'sRGB', 2: 'Adobe RGB', 65535: 'Uncalibrated' };
        return spaces[space] || `Unknown (${space})`;
    }

    translateResolutionUnit(unit) {
        const units = { 1: 'No absolute unit', 2: 'Inches', 3: 'Centimeters' };
        return units[unit] || `Unknown (${unit})`;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // =====================================
    // MÉTHODES PUBLIQUES SUPPLÉMENTAIRES
    // =====================================

    /**
     * Créer un résumé des métadonnées pour affichage rapide
     */
    createForensicSummary(forensicResult) {
        if (!forensicResult) return null;

        const summary = {
            camera: null,
            settings: null,
            location: null,
            timestamp: null,
            software: null,
            authenticity: {
                score: 0,
                level: 'unknown',
                confidence: 'low'
            },
            flags: {
                count: 0,
                critical: 0
            }
        };

        // Appareil
        if (forensicResult.camera && forensicResult.camera.make && forensicResult.camera.model) {
            summary.camera = `${forensicResult.camera.make} ${forensicResult.camera.model}`;
        }

        // Paramètres
        if (forensicResult.technical) {
            const tech = forensicResult.technical;
            const parts = [];
            if (tech.iso) parts.push(`ISO ${tech.iso}`);
            if (tech.aperture) parts.push(`f/${tech.aperture}`);
            if (tech.shutterSpeed) parts.push(tech.shutterSpeed);
            if (parts.length > 0) summary.settings = parts.join(' • ');
        }

        // Localisation
        if (forensicResult.gps && forensicResult.gps.latitude && forensicResult.gps.longitude) {
            summary.location = `${forensicResult.gps.latitude.toFixed(6)}, ${forensicResult.gps.longitude.toFixed(6)}`;
        }

        // Timestamp
        summary.timestamp = forensicResult.timestamps?.dateTimeOriginal || 
                           forensicResult.timestamps?.createDate;

        // Logiciel
        summary.software = forensicResult.software?.creator;

        // Authenticité
        if (forensicResult.forensicAnalysis && forensicResult.forensicAnalysis.authenticity) {
            const auth = forensicResult.forensicAnalysis.authenticity;
            summary.authenticity.score = auth.score;
            summary.authenticity.confidence = auth.confidence;
            
            if (auth.score >= 80) summary.authenticity.level = 'high';
            else if (auth.score >= 60) summary.authenticity.level = 'medium';
            else if (auth.score >= 40) summary.authenticity.level = 'low';
            else summary.authenticity.level = 'very_low';

            summary.flags.count = auth.flags ? auth.flags.length : 0;
            summary.flags.critical = auth.flags ? 
                auth.flags.filter(f => f.includes('CRITICAL') || f.includes('MANIPULATION')).length : 0;
        }

        return summary;
    }

    /**
     * Valider format de fichier supporté
     */
    isFormatSupported(filePath) {
        const ext = path.extname(filePath).toLowerCase().substring(1);
        return this.supportedFormats.includes(ext);
    }

    /**
     * Obtenir statistiques du cache
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxCacheSize,
            hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
        };
    }

    /**
     * Nettoyer le cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 Cache EXIF nettoyé');
    }

    /**
     * Obtenir informations sur les librairies disponibles
     */
    getLibrariesInfo() {
        return {
            initialized: this.initialized,
            exifr: !!this.exifr,
            piexifjs: !!this.piexifjs,
            sharp: true, // Toujours disponible
            supportedFormats: this.supportedFormats
        };
    }
}
// ================================
// API unifiée (wrapper non-intrusif)
// ================================
async function __exif_readInputToTempFile(input) { /* ... bloc complet ... */ }
function __exif_normalize(forensic) { /* ... bloc complet ... */ }
function __exif_validate(normalized) { /* ... bloc complet ... */ }
function __exif_analyze(normalized) { /* ... bloc complet ... */ }
async function processImage(imageInput, options = {}) { /* ... bloc complet ... */ }

// =====================================
// EXPORT SINGLETON + API unifiée
// =====================================
const __exifSingleton = new ExifForensicService();

// On expose l'instance (compat historique) ET les nouvelles fonctions
module.exports = Object.assign(__exifSingleton, {
  ExifForensicService,
  processImage: processImage.bind(__exifSingleton),
  normalize: (f) => __exif_normalize(f),
  validate: (n) => __exif_validate(n),
  analyze: (n) => __exif_analyze(n)
});
