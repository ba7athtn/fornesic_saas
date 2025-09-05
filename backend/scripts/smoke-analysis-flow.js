// scripts/smoke-analysis-flow.js
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const sharp = require('sharp'); // pour générer une image unique à chaque run

// Charger modèles et contrôleur
const Image = require('../src/models/Image');
const Analysis = require('../src/models/Analysis');
const ctrl = require('../src/controllers/analysisController');

function mkReqRes() {
  const res = {
    _json: null,
    _code: 200,
    status(code) { this._code = code; return this; },
    json(obj) { this._json = obj; console.log('RES', this._code, JSON.stringify(obj, null, 2)); return this; },
    setHeader() {}
  };
  const req = { headers: {}, query: {}, params: {}, body: {}, user: { sub: 'smoke-user' } };
  return { req, res };
}

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  try {
    // Connexion Mongo (utiliser votre URI via env)
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ba7ath_dev';
    await mongoose.connect(uri, {});

    // Générer une petite image PNG unique (1x1) avec couleur aléatoire
    const color = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
    const pngBuffer = await sharp({
      create: { width: 1, height: 1, channels: 3, background: { r: color.r, g: color.g, b: color.b } }
    }).png().toBuffer();

    // Écrire l'image temporaire
    const tmpDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const fname = `smoke_${crypto.randomBytes(4).toString('hex')}.png`;
    const imgPath = path.join(tmpDir, fname);
    fs.writeFileSync(imgPath, pngBuffer);

    // Champs requis par le schéma Image
    const sessionId = `smoke-${crypto.randomBytes(4).toString('hex')}`;
    const filename = fname;
    const mimeType = 'image/png';
    const size = pngBuffer.length;
    const hash = crypto.createHash('sha256').update(pngBuffer).digest('hex');

    // Réutiliser le document si le hash existe déjà (évite E11000)
    let img = await Image.findOne({ hash }).lean();
    if (img) {
      console.log(`♻️  Image existante réutilisée: ${img._id} - hash: ${hash}`);
    } else {
      img = await Image.create({
        filename,                // requis
        originalName: filename,  // utile UI
        mimeType,                // requis
        sessionId,               // requis
        files: {                 // requis: au moins files.original
          original: imgPath
        },
        status: 'uploaded',
        size,
        hash,
        path: imgPath,           // fallback
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`💾 Image sauvegardée: ${img._id} - Status: ${img.status}`);
    }

    // Appeler initiateForensicAnalysis
    const { req, res } = mkReqRes();
    req.params = { imageId: String(img._id) };
    req.body = {
      enabledPillars: { exif: true, physics: true, statistical: true, anatomical: false, behavioral: false, audio: false, expert: false },
      privacyMode: 'COMMERCIAL',
      priority: 'normal',
      customWeights: { exif: 0.4, physics: 0.3, statistical: 0.3, anatomical: 0, behavioral: 0, audio: 0, expert: 0 }
    };
    await ctrl.initiateForensicAnalysis(req, res);
    if (!res._json || !res._json.analysisId) {
      console.error('Init failed or no analysisId in response'); process.exit(1);
    }

    const analysisId = res._json.analysisId;

    // Poll le statut jusqu’à completion ou timeout
    const t0 = Date.now();
    while (Date.now() - t0 < 60_000) {
      const s = mkReqRes();
      s.req.params = { analysisId: String(analysisId) };
      await ctrl.getAnalysisStatus(s.req, s.res);
      const body = s.res._json || {};
      console.log('Status:', body.status, 'progress:', body.progress, 'time:', body.processingTime);
      if (body.status === 'completed' || body.status === 'failed') break;
      await wait(1500);
    }

    // Afficher l’analyse stockée
    const ana = await Analysis.findById(analysisId).lean();
    console.log('Final aggregatedScore:', ana?.aggregatedScore);
    console.log('Has exifForensics:', !!ana?.exifForensics);

    await mongoose.disconnect();
    console.log('Smoke test done.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
