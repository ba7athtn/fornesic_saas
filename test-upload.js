// test-upload.js - TEST MULTER BASIQUE
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configuration multer ULTRA-SIMPLE
const upload = multer({
  dest: './uploads/temp',
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// Route de test basique
app.post('/test-upload', upload.single('image'), (req, res) => {
  console.log('✅ Upload réussi !', req.file);
  res.json({
    success: true,
    file: req.file
  });
});

app.listen(3001, () => {
  console.log('🧪 Serveur test sur port 3001');
});
