// backend/src/routes/forensic.js
const express = require('express');
const router = express.Router();

// ✅ Route d'analyse d'image avec Python
router.post('/analyze-image', async (req, res) => {
  try {
    if (!req.pythonBridge) {
      return res.status(503).json({
        error: 'Service d\'analyse non disponible',
        details: 'Le bridge Python n\'est pas initialisé',
        requestId: req.requestId
      });
    }

    const { filename, analysisType, imageId, userId } = req.body;

    if (!filename) {
      return res.status(400).json({
        error: 'Paramètres manquants',
        details: 'Le nom de fichier est requis',
        required: ['filename'],
        received: Object.keys(req.body),
        requestId: req.requestId
      });
    }

    console.log(`🔍 Démarrage analyse forensique: ${filename}`);
    const startTime = Date.now();

    const analysisResult = await req.pythonBridge.analyzeImage({
      filename,
      analysisType: analysisType || 'full',
      imageId,
      userId
    });

    const processingTime = Date.now() - startTime;

    res.json({
      success: true,
      requestId: req.requestId,
      analysis: analysisResult.data,
      metadata: {
        processingTime,
        pythonProcessId: analysisResult.processId,
        analysisType: analysisType || 'full',
        timestamp: new Date().toISOString(),
        filename
      }
    });

    console.log(`✅ Analyse terminée: ${filename} (${processingTime}ms)`);

  } catch (error) {
    console.error('❌ Erreur analyse forensique:', error);
    
    res.status(500).json({
      error: 'Erreur lors de l\'analyse',
      details: error.message,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });
  }
});

// ✅ Route de validation des données forensiques
router.post('/validate', async (req, res) => {
  try {
    if (!req.pythonBridge) {
      return res.status(503).json({
        error: 'Service de validation non disponible',
        details: 'Le bridge Python n\'est pas initialisé',
        requestId: req.requestId
      });
    }

    console.log('🧪 Validation des données forensiques...');
    const validationResult = await req.pythonBridge.validateForensicData(req.body);

    res.json({
      success: true,
      validation: validationResult.data,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur validation:', error);
    res.status(400).json({
      error: 'Erreur de validation',
      details: error.message,
      requestId: req.requestId
    });
  }
});

// ✅ Route de génération de rapport
router.post('/generate-report', async (req, res) => {
  try {
    if (!req.pythonBridge) {
      return res.status(503).json({
        error: 'Service de rapport non disponible',
        details: 'Le bridge Python n\'est pas initialisé',
        requestId: req.requestId
      });
    }

    const { analysisId, format, includeSections } = req.body;

    if (!analysisId) {
      return res.status(400).json({
        error: 'ID d\'analyse requis',
        details: 'analysisId est obligatoire pour générer un rapport',
        requestId: req.requestId
      });
    }

    console.log(`📊 Génération rapport pour analyse: ${analysisId}`);
    
    const reportResult = await req.pythonBridge.generateReport({
      analysisId,
      format: format || 'pdf',
      includeSections: includeSections || ['summary', 'details', 'recommendations'],
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      report: reportResult.data,
      requestId: req.requestId,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur génération rapport:', error);
    res.status(500).json({
      error: 'Erreur génération rapport',
      details: error.message,
      requestId: req.requestId
    });
  }
});

// ✅ Status du bridge Python
router.get('/python-status', (req, res) => {
  if (!req.pythonBridge) {
    return res.status(503).json({
      status: 'unavailable',
      message: 'Python Bridge non initialisé',
      requestId: req.requestId
    });
  }

  const status = req.pythonBridge.getStatus();

  res.json({
    status: 'available',
    bridge: status,
    health: status.activeProcesses < status.maxConcurrent ? 'healthy' : 'busy',
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
});

// ✅ Test de connectivité Python
router.get('/test-python', async (req, res) => {
  try {
    if (!req.pythonBridge) {
      return res.status(503).json({
        error: 'Python Bridge non disponible',
        requestId: req.requestId
      });
    }

    console.log('🧪 Test de connectivité Python...');
    const testResult = await req.pythonBridge.testConnectivity();

    res.json({
      success: true,
      test: testResult.data,
      duration: testResult.duration,
      processId: testResult.processId,
      requestId: req.requestId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Test Python échoué:', error);
    res.status(500).json({
      error: 'Test de connectivité échoué',
      details: error.message,
      requestId: req.requestId
    });
  }
});

// ✅ Route d'information sur les endpoints disponibles
router.get('/', (req, res) => {
  res.json({
    service: 'Ba7ath Forensic Python Bridge',
    version: '3.0.0',
    endpoints: {
      'POST /analyze-image': 'Analyse forensique d\'une image',
      'POST /validate': 'Validation de données forensiques',
      'POST /generate-report': 'Génération de rapport d\'analyse',
      'GET /python-status': 'Statut du bridge Python',
      'GET /test-python': 'Test de connectivité Python'
    },
    pythonBridge: req.pythonBridge ? 'available' : 'unavailable',
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
