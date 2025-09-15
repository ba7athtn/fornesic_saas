// src/services/auditService.js
"use strict";

const fs = require('fs');
const path = require('path');
const os = require('os');
const { randomBytes } = require('crypto');
const mongoose = require('mongoose');

// ✅ CONFIG
const config = require('../config');

// =====================================
// Paramètres depuis config.js
// =====================================

const auditCfg = config.audit || {};
const LOG_DIR = auditCfg.dir || path.join(process.cwd(), 'logs');
const LOG_FILE_BASENAME = auditCfg.file || 'audit.log.jsonl';
const MAX_FILE_BYTES = auditCfg.maxBytes || 5 * 1024 * 1024; // 5MB
const ROTATE_DAILY = auditCfg.rotateDaily !== false; // true par défaut
const LEVELS = auditCfg.levels || ['INFO', 'WARN', 'ERROR', 'SECURITY', 'SYSTEM'];
const CATEGORIES = auditCfg.categories || ['auth', 'reports', 'images', 'analysis', 'system', 'billing', 'admin'];

// Fichiers
const auditLogDir = LOG_DIR;
function currentAuditFile() {
  const base = path.join(auditLogDir, LOG_FILE_BASENAME);
  if (!ROTATE_DAILY) return base;
  const d = new Date();
  const stamp = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const ext = path.extname(LOG_FILE_BASENAME);
  const name = path.basename(LOG_FILE_BASENAME, ext);
  return path.join(auditLogDir, `${name}.${stamp}${ext || '.jsonl'}`);
}

// =====================================
// Mongoose model (faible couplage)
// =====================================

let AuditModel = null;
try {
  const auditSchema = new mongoose.Schema(
    {
      eventId: { type: String, index: true },
      level: { type: String, enum: LEVELS, default: 'INFO', index: true },
      category: { type: String, enum: CATEGORIES, default: 'system', index: true },
      action: { type: String, required: true, index: true },
      userId: { type: String, index: true },
      ip: { type: String, index: true },
      requestId: { type: String, index: true },
      metadata: { type: Object, default: {} },
      timestamp: { type: Date, default: Date.now, index: true }
    },
    { collection: auditCfg.collection || 'audits', minimize: true }
  );
  auditSchema.index({ category: 1, action: 1, timestamp: -1 });
  auditSchema.index({ userId: 1, timestamp: -1 });
  AuditModel = mongoose.models.Audit || mongoose.model('Audit', auditSchema);
} catch {
  AuditModel = null;
}

// =====================================
// Utils
// =====================================

function ensureLogDir() {
  try {
    if (!fs.existsSync(auditLogDir)) fs.mkdirSync(auditLogDir, { recursive: true, mode: 0o755 });
  } catch {
    // ignore
  }
}

function makeEventId() {
  return randomBytes(8).toString('hex');
}

function rotateIfNeeded(filePath) {
  try {
    if (!fs.existsSync(filePath)) return;
    const stats = fs.statSync(filePath);
    if (stats.size >= MAX_FILE_BYTES) {
      const ts = new Date().toISOString().replace(/[:]/g, '-');
      const rotated = `${filePath}.${ts}.gz`;
      const zlib = require('zlib');
      const input = fs.createReadStream(filePath);
      const output = fs.createWriteStream(rotated);
      const gzip = zlib.createGzip();
      return new Promise((resolve) => {
        input.pipe(gzip).pipe(output).on('finish', () => {
          try { fs.truncateSync(filePath, 0); } catch {}
          resolve(true);
        });
      });
    }
  } catch {
    // ignore rotation error
  }
  return Promise.resolve(false);
}

async function writeFileFallback(entry) {
  try {
    ensureLogDir();
    const file = currentAuditFile();
    await rotateIfNeeded(file);
    fs.appendFileSync(file, JSON.stringify(entry) + os.EOL, { encoding: 'utf8' });
  } catch {
    // dernier recours: console
    try { console.warn('⚠️ Audit fallback console:', entry); } catch {}
  }
}

async function persistAudit(entry) {
  // DB si dispo, sinon fichier
  if (AuditModel && mongoose.connection?.readyState === 1) {
    try {
      await AuditModel.create(entry);
      return true;
    } catch (e) {
      console.error('❌ Audit DB error, fallback file:', e.message);
      await writeFileFallback(entry);
      return false;
    }
  } else {
    await writeFileFallback(entry);
    return false;
  }
}

function normalizeEntry({ level = 'INFO', category = 'system', action, userId, ip, requestId, metadata }) {
  const lv = LEVELS.includes(level) ? level : 'INFO';
  const cat = CATEGORIES.includes(category) ? category : 'system';

  return {
    eventId: makeEventId(),
    level: lv,
    category: cat,
    action: String(action || 'unknown').slice(0, 120),
    userId: userId ? String(userId) : undefined,
    ip: ip ? String(ip) : undefined,
    requestId: requestId ? String(requestId) : undefined,
    metadata: metadata && typeof metadata === 'object' ? metadata : {},
    timestamp: new Date()
  };
}

// =====================================
// Service API
// =====================================

const auditService = {
  // Générique
  async logEvent(payload) {
    const entry = normalizeEntry(payload);
    await persistAudit(entry);
    return entry.eventId;
  },

  // Raccourcis par catégorie
  async logAuth(action, { userId, ip, requestId, metadata, level = 'SECURITY' } = {}) {
    return this.logEvent({ level, category: 'auth', action, userId, ip, requestId, metadata });
  },

  async logReport(action, { userId, ip, requestId, metadata, level = 'INFO' } = {}) {
    return this.logEvent({ level, category: 'reports', action, userId, ip, requestId, metadata });
  },

  async logImage(action, { userId, ip, requestId, metadata, level = 'INFO' } = {}) {
    return this.logEvent({ level, category: 'images', action, userId, ip, requestId, metadata });
  },

  async logAnalysis(action, { userId, ip, requestId, metadata, level = 'INFO' } = {}) {
    return this.logEvent({ level, category: 'analysis', action, userId, ip, requestId, metadata });
  },

  async logSystem(action, { metadata, level = 'SYSTEM' } = {}) {
    return this.logEvent({ level, category: 'system', action, metadata });
  },

  // Lecture simple (si DB dispo)
  async getRecent({ category, limit = 50 } = {}) {
    if (!AuditModel || mongoose.connection?.readyState !== 1) return [];
    const q = category ? { category } : {};
    return AuditModel.find(q).sort({ timestamp: -1 }).limit(Math.min(limit, 500)).lean().exec();
  },

  async search({ category, level, action, userId, from, to, limit = 100 } = {}) {
    if (!AuditModel || mongoose.connection?.readyState !== 1) return [];
    const q = {};
    if (category) q.category = category;
    if (level) q.level = level;
    if (action) q.action = new RegExp(action, 'i');
    if (userId) q.userId = userId;
    if (from || to) q.timestamp = {};
    if (from) q.timestamp.$gte = new Date(from);
    if (to) q.timestamp.$lte = new Date(to);
    return AuditModel.find(q).sort({ timestamp: -1 }).limit(Math.min(limit, 1000)).lean().exec();
  }
};

module.exports = auditService;
