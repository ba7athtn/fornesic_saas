const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// ========== ROUTES DES RAPPORTS ==========

// Route de test (pour vérifier que ça marche)
router.get('/test', (req, res) => {
  res.json({ 
    message: '🎉 Routes des rapports fonctionnent !',
    timestamp: new Date().toISOString(),
    user: req.user?.userId || 'anonymous'
  });
});

// Routes principales
router.get('/', reportController.listAvailableReports);
router.post('/:imageId/generate', reportController.generateForensicReport);
router.get('/:imageId/preview', reportController.getReportPreview);
router.post('/:imageId/export', reportController.exportForensicData);
router.get('/:reportId/download', reportController.downloadExistingReport);

// Routes batch
router.post('/batch/:sessionId', reportController.generateBatchReport);
router.get('/batch/:jobId/status', reportController.getBatchReportStatus);
router.get('/batch/:jobId/download', reportController.downloadBatchReport);

module.exports = router;
