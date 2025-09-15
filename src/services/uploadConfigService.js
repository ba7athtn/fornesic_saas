// /services/uploadConfigService.js - CONFIGURATION CENTRALISÉE
"use strict";

const fs = require('fs');
const path = require('path');

class UploadConfigService {
  constructor() {
    this.config = this.loadConfig();
    this.createSecureDirectories();
  }

  loadConfig() {
    const rootUploads = process.env.UPLOAD_ROOT_DIR || path.resolve(process.cwd(), 'uploads');

    const tempDir = process.env.UPLOAD_TEMP_DIR || path.join(rootUploads, 'temp');
    const processedDir = process.env.UPLOAD_PROCESSED_DIR || path.join(rootUploads, 'processed');
    const quarantineDir = process.env.UPLOAD_QUARANTINE_DIR || path.join(rootUploads, 'quarantine');
    const thumbnailsDir = process.env.UPLOAD_THUMBS_DIR || path.join(rootUploads, 'thumbnails');
    const reportsDir = process.env.UPLOAD_REPORTS_DIR || path.join(rootUploads, 'reports');

    const maxFileSize = Number(process.env.MULTER_FILE_SIZE || 524288000); // 500MB
    const maxFiles = Number(process.env.MAX_FILES_PER_REQUEST || 10);

    const allowedFormats = (process.env.ALLOWED_FORMATS || 'jpg,jpeg,png,tiff,webp,raw,bmp,gif')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/bmp', 'image/gif'
    ];

    return {
      rootUploads,
      tempDir,
      processedDir,
      quarantineDir,
      thumbnailsDir,
      reportsDir,
      maxFileSize,
      maxFiles,
      allowedFormats,
      allowedMimes,
      limits: {
        fileSize: maxFileSize,
        files: maxFiles,
        fieldSize: Number(process.env.MULTER_FIELD_SIZE || 100 * 1024 * 1024), // 100MB
        fieldNameSize: Number(process.env.MULTER_FIELD_NAME_SIZE || 2000),
        fields: Number(process.env.MULTER_FIELDS || 100),
        parts: Number(process.env.MULTER_PARTS || 200),
        headerPairs: Number(process.env.MULTER_HEADER_PAIRS || 2000)
      },
      security: {
        // Sécurité filesystem basique
        dirMode: Number(process.env.UPLOAD_DIR_MODE || 0o755),
        fileMode: Number(process.env.UPLOAD_FILE_MODE || 0o644),
        // Nettoyage automatique (minutes)
        tempTtlMinutes: Number(process.env.UPLOAD_TEMP_TTL_MIN || 60)
      }
    };
  }

  createSecureDirectories() {
    const dirs = [
      this.config.rootUploads,
      this.config.tempDir,
      this.config.processedDir,
      this.config.quarantineDir,
      this.config.thumbnailsDir,
      this.config.reportsDir
    ];

    dirs.forEach(dir => {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true, mode: this.config.security.dirMode });
          console.log(`📁 Dossier sécurisé créé: ${dir}`);

          const gitkeepPath = path.join(dir, '.gitkeep');
          if (!fs.existsSync(gitkeepPath)) {
            fs.writeFileSync(gitkeepPath, '');
          }
        } else {
          // Harmoniser permissions si nécessaire
          try {
            fs.chmodSync(dir, this.config.security.dirMode);
          } catch {}
        }
      } catch (error) {
        console.error(`❌ Erreur création dossier ${dir}:`, error.message);
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      }
    });
  }

  getConfig() {
    return this.config;
  }

  formatBytes(bytes) {
    if (!Number.isFinite(bytes)) return 'N/A';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // Utilitaire: vérifier si un mime/extension est autorisé
  isAllowed({ mime, ext }) {
    const okMime = !mime || this.config.allowedMimes.includes(String(mime).toLowerCase());
    const okExt = !ext || this.config.allowedFormats.includes(String(ext).toLowerCase());
    return okMime && okExt;
  }

  // Utilitaire: chemins standards
  paths() {
    return {
      temp: this.config.tempDir,
      processed: this.config.processedDir,
      quarantine: this.config.quarantineDir,
      thumbnails: this.config.thumbnailsDir,
      reports: this.config.reportsDir
    };
  }
}

module.exports = new UploadConfigService();
