const crypto = require('crypto');

// =====================================
// SERVICE GÉOLOCALISATION FORENSIQUE AVANCÉ
// =====================================

class GeoLocationService {
    constructor() {
        this.earthRadiusKm = 6371;
        this.earthRadiusM = 6371000;
        this.geocodingCache = new Map();
        this.suspiciousLocations = this.loadSuspiciousLocations();
    }

    /**
     * Calcule la distance entre deux points GPS avec précision forensique
     */
    calculateDistance(gps1, gps2, unit = 'meters') {
        try {
            if (!this.validateGPSCoordinates(gps1) || !this.validateGPSCoordinates(gps2)) {
                return {
                    distance: null,
                    error: 'Coordonnées GPS invalides',
                    valid: false
                };
            }

            const lat1Rad = this.toRadians(gps1.latitude);
            const lat2Rad = this.toRadians(gps2.latitude);
            const deltaLatRad = this.toRadians(gps2.latitude - gps1.latitude);
            const deltaLonRad = this.toRadians(gps2.longitude - gps1.longitude);

            // Formule de Haversine pour précision maximale
            const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
                     Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                     Math.sin(deltaLonRad / 2) * Math.sin(deltaLonRad / 2);
                     
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            
            let distance;
            switch (unit) {
                case 'kilometers':
                case 'km':
                    distance = this.earthRadiusKm * c;
                    break;
                case 'miles':
                    distance = (this.earthRadiusKm * c) * 0.621371;
                    break;
                case 'meters':
                case 'm':
                default:
                    distance = this.earthRadiusM * c;
                    break;
            }

            return {
                distance: Math.round(distance * 1000) / 1000, // 3 décimales
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
    async analyzeGPSForensics(gpsData, imageMetadata = {}) {
        try {
            const analysis = {
                coordinates: {
                    latitude: gpsData.latitude,
                    longitude: gpsData.longitude,
                    altitude: gpsData.altitude || null
                },
                accuracy: this.assessGPSAccuracy(gpsData),
                authenticity: {
                    score: 100,
                    flags: [],
                    confidence: 'high'
                },
                location: {
                    type: await this.identifyLocationType(gpsData),
                    timezone: this.getTimezoneFromCoordinates(gpsData),
                    country: await this.getCountryFromCoordinates(gpsData),
                    suspicious: false
                },
                temporal: {
                    gpsTimestamp: gpsData.timestamp,
                    imageTimestamp: imageMetadata.dateTimeOriginal,
                    coherent: true,
                    timeDifference: null
                },
                technical: {
                    precision: this.calculatePrecision(gpsData),
                    source: this.identifyGPSSource(gpsData),
                    manipulation: {
                        detected: false,
                        indicators: []
                    }
                }
            };

            // Vérifications de cohérence temporelle
            if (gpsData.timestamp && imageMetadata.dateTimeOriginal) {
                analysis.temporal = this.analyzeTemporalCoherence(
                    gpsData.timestamp, 
                    imageMetadata.dateTimeOriginal
                );
            }

            // Détection de manipulations GPS
            analysis.technical.manipulation = await this.detectGPSManipulation(gpsData);

            // Vérification lieux suspects
            analysis.location.suspicious = this.checkSuspiciousLocation(gpsData);

            // Analyse cohérence géographique
            const geographicAnalysis = await this.analyzeGeographicCoherence(gpsData, imageMetadata);
            analysis.geographic = geographicAnalysis;

            // Calcul score d'authenticité final
            analysis.authenticity = this.calculateGPSAuthenticityScore(analysis);

            return analysis;

        } catch (error) {
            return {
                error: error.message,
                authenticity: {
                    score: 0,
                    confidence: 'error'
                }
            };
        }
    }

    /**
     * Détection de voyage impossible
     */
    detectImpossibleTravel(locations, timeThreshold = 3600) {
        if (!locations || locations.length < 2) {
            return { impossible: false };
        }

        const impossibleTravels = [];

        for (let i = 1; i < locations.length; i++) {
            const prev = locations[i - 1];
            const curr = locations[i];

            if (!prev.timestamp || !curr.timestamp) continue;

            const timeDiff = Math.abs(new Date(curr.timestamp) - new Date(prev.timestamp)) / 1000; // secondes
            const distance = this.calculateDistance(prev, curr);

            if (distance.valid && timeDiff > 0) {
                // Vitesse maximum réaliste (avion de ligne: ~900 km/h)
                const maxSpeedKmH = 1000;
                const maxDistanceKm = (timeDiff / 3600) * maxSpeedKmH;
                const actualDistanceKm = distance.distance / 1000;

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
    clusterLocations(locations, radiusMeters = 1000) {
        if (!locations || locations.length === 0) return [];

        const clusters = [];
        const visited = new Set();

        locations.forEach((location, index) => {
            if (visited.has(index)) return;

            const cluster = {
                center: location,
                locations: [location],
                radius: 0,
                count: 1
            };

            // Trouver toutes les locations dans le rayon
            locations.forEach((other, otherIndex) => {
                if (otherIndex === index || visited.has(otherIndex)) return;

                const distance = this.calculateDistance(location, other);
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
        return clusters.sort((a, b) => b.count - a.count);
    }

    /**
     * Vérification de cohérence avec fuseaux horaires
     */
    verifyTimezoneCoherence(gpsData, imageTimestamp) {
        try {
            const timezone = this.getTimezoneFromCoordinates(gpsData);
            const localTime = this.convertToTimezone(imageTimestamp, timezone);
            
            // Vérifier cohérence jour/nuit si possible
            const sunData = this.calculateSunPosition(gpsData, imageTimestamp);
            
            return {
                timezone: timezone,
                localTime: localTime,
                coherent: true, // À implémenter avec vraie logique
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

    validateGPSCoordinates(gps) {
        if (!gps || typeof gps !== 'object') return false;
        if (typeof gps.latitude !== 'number' || typeof gps.longitude !== 'number') return false;
        if (Math.abs(gps.latitude) > 90 || Math.abs(gps.longitude) > 180) return false;
        return true;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    calculateBearing(gps1, gps2) {
        const lat1 = this.toRadians(gps1.latitude);
        const lat2 = this.toRadians(gps2.latitude);
        const deltaLon = this.toRadians(gps2.longitude - gps1.longitude);

        const y = Math.sin(deltaLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

        const bearing = this.toDegrees(Math.atan2(y, x));
        return (bearing + 360) % 360; // Normaliser 0-360
    }

    calculateMidpoint(gps1, gps2) {
        const lat1 = this.toRadians(gps1.latitude);
        const lat2 = this.toRadians(gps2.latitude);
        const lon1 = this.toRadians(gps1.longitude);
        const deltaLon = this.toRadians(gps2.longitude - gps1.longitude);

        const Bx = Math.cos(lat2) * Math.cos(deltaLon);
        const By = Math.cos(lat2) * Math.sin(deltaLon);

        const lat3 = Math.atan2(
            Math.sin(lat1) + Math.sin(lat2),
            Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
        );
        const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx);

        return {
            latitude: this.toDegrees(lat3),
            longitude: this.toDegrees(lon3)
        };
    }

    assessGPSAccuracy(gpsData) {
        // Évaluer précision basée sur métadonnées disponibles
        let accuracy = 'unknown';
        let estimatedError = null;

        if (gpsData.accuracy) {
            estimatedError = gpsData.accuracy;
            if (estimatedError <= 5) accuracy = 'high';
            else if (estimatedError <= 20) accuracy = 'medium';
            else accuracy = 'low';
        } else {
            // Estimation basée sur autres facteurs
            const decimalPlaces = this.countDecimalPlaces(gpsData.latitude);
            if (decimalPlaces >= 6) accuracy = 'high';
            else if (decimalPlaces >= 4) accuracy = 'medium';
            else accuracy = 'low';
        }

        return {
            level: accuracy,
            estimatedError: estimatedError,
            decimalPrecision: this.countDecimalPlaces(gpsData.latitude)
        };
    }

    countDecimalPlaces(number) {
        const str = number.toString();
        if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
            return str.split('.')[1].length;
        } else if (str.indexOf('e-') !== -1) {
            const parts = str.split('e-');
            return parseInt(parts[1], 10);
        }
        return 0;
    }

    async identifyLocationType(gpsData) {
        // Détection type de lieu (urbain, rural, eau, etc.)
        // En production: utiliser API de géocodage
        const types = ['urban', 'rural', 'water', 'mountain', 'desert', 'forest'];
        return types[Math.floor(Math.random() * types.length)];
    }

    getTimezoneFromCoordinates(gpsData) {
        // Estimation basique du fuseau horaire
        // En production: utiliser vraie API timezone
        const longitude = gpsData.longitude;
        const timezoneOffset = Math.round(longitude / 15);
        return `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;
    }

    async getCountryFromCoordinates(gpsData) {
        // Géocodage inverse pour obtenir le pays
        // En production: utiliser API géocodage
        const cacheKey = `${Math.round(gpsData.latitude * 100) / 100},${Math.round(gpsData.longitude * 100) / 100}`;
        
        if (this.geocodingCache.has(cacheKey)) {
            return this.geocodingCache.get(cacheKey);
        }

        // Simulation
        const countries = ['France', 'Germany', 'USA', 'Canada', 'Japan', 'Unknown'];
        const country = countries[Math.floor(Math.random() * countries.length)];
        
        this.geocodingCache.set(cacheKey, country);
        return country;
    }

    analyzeTemporalCoherence(gpsTimestamp, imageTimestamp) {
        try {
            const gpsTime = new Date(gpsTimestamp);
            const imageTime = new Date(imageTimestamp);
            const timeDiff = Math.abs(gpsTime - imageTime) / 1000; // secondes

            let coherent = true;
            const flags = [];

            // Plus de 1 heure de différence = suspect
            if (timeDiff > 3600) {
                coherent = false;
                flags.push('LARGE_TIME_DIFFERENCE');
            }

            // GPS dans le futur par rapport à l'image
            if (gpsTime > imageTime + 300000) { // 5 minutes de tolérance
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

    async detectGPSManipulation(gpsData) {
        const indicators = [];
        let detected = false;

        // Coordonnées trop précises (suspectes)
        const precision = this.countDecimalPlaces(gpsData.latitude);
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

        return {
            detected: detected,
            indicators: indicators,
            confidence: detected ? (indicators.length > 2 ? 'high' : 'medium') : 'low'
        };
    }

    checkSuspiciousLocation(gpsData) {
        // Vérifier contre base de lieux suspects
        return this.suspiciousLocations.some(location => {
            const distance = this.calculateDistance(gpsData, location);
            return distance.valid && distance.distance < 1000; // 1km de rayon
        });
    }

    async analyzeGeographicCoherence(gpsData, imageMetadata) {
        // Analyse cohérence géographique avec autres métadonnées
        return {
            climateCoherent: true, // À implémenter
            terrainCoherent: true, // À implémenter
            urbanizationCoherent: true, // À implémenter
            analysis: 'Geographic coherence analysis placeholder'
        };
    }

    calculateGPSAuthenticityScore(analysis) {
        let score = 100;
        const flags = [];

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

    calculatePrecision(gpsData) {
        const latPrecision = this.countDecimalPlaces(gpsData.latitude);
        const lonPrecision = this.countDecimalPlaces(gpsData.longitude);
        return Math.min(latPrecision, lonPrecision);
    }

    identifyGPSSource(gpsData) {
        // Identifier source GPS basée sur patterns
        if (gpsData.altitude && gpsData.accuracy) return 'smartphone';
        if (this.countDecimalPlaces(gpsData.latitude) <= 4) return 'basic_gps';
        return 'unknown';
    }

    convertToTimezone(timestamp, timezone) {
        // Conversion basique - en production utiliser library spécialisée
        return new Date(timestamp).toISOString();
    }

    calculateSunPosition(gpsData, timestamp) {
        // Calcul position solaire pour vérification jour/nuit
        // Implémentation simplifiée
        return {
            coherent: true,
            sunrise: '06:00',
            sunset: '18:00',
            daylight: Math.random() > 0.5
        };
    }

    loadSuspiciousLocations() {
        // Base de lieux suspects pour vérification
        return [
            { latitude: 0, longitude: 0 }, // Null Island
            { latitude: 37.7749, longitude: -122.4194 }, // San Francisco (exemple)
        ];
    }
}

module.exports = new GeoLocationService();
