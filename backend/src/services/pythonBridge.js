// backend/services/pythonBridge.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class PythonBridge {
  constructor(config) {
    this.config = config;
    this.runningProcesses = new Map();
    this.processQueue = [];
    this.activeCount = 0;
  }

  /**
   * Exécute un script Python avec gestion des erreurs avancée
   */
  async executeScript(scriptName, inputData, options = {}) {
    return new Promise((resolve, reject) => {
      const processId = require('crypto').randomBytes(8).toString('hex');
      const scriptPath = path.join(this.config.python.scriptsPath, scriptName);
      
      // Vérification de sécurité du script
      if (!fs.existsSync(scriptPath)) {
        return reject(new Error(`Script Python introuvable: ${scriptPath}`));
      }

      if (this.activeCount >= this.config.python.maxConcurrent) {
        this.processQueue.push({ scriptName, inputData, options, resolve, reject, processId });
        console.log(`🐍 Script Python en file d'attente: ${scriptName} (ID: ${processId})`);
        return;
      }

      this._runPythonProcess(scriptPath, inputData, options, processId, resolve, reject);
    });
  }

  /**
   * Exécute le processus Python avec monitoring
   */
  _runPythonProcess(scriptPath, inputData, options, processId, resolve, reject) {
    this.activeCount++;
    const startTime = Date.now();

    // Construction de la commande Python avec environnement virtuel si disponible
    let pythonCmd = this.config.python.executable;
    const pythonEnv = { ...process.env };

    // Si un venv est configuré, l'utiliser
    if (this.config.python.venvPath && fs.existsSync(this.config.python.venvPath)) {
      const venvPython = process.platform === 'win32' 
        ? path.join(this.config.python.venvPath, 'Scripts', 'python.exe')
        : path.join(this.config.python.venvPath, 'bin', 'python');
      
      if (fs.existsSync(venvPython)) {
        pythonCmd = venvPython;
        console.log(`🐍 Utilisation venv: ${venvPython}`);
      }
    }

    // Ajout du PYTHONPATH
    pythonEnv.PYTHONPATH = this.config.python.scriptsPath;

    const pythonProcess = spawn(pythonCmd, [scriptPath], {
      cwd: path.dirname(scriptPath),
      env: pythonEnv
    });

    this.runningProcesses.set(processId, pythonProcess);

    let stdout = '';
    let stderr = '';
    let hasResolved = false;

    // Timeout de sécurité
    const timeout = setTimeout(() => {
      if (!hasResolved) {
        pythonProcess.kill('SIGTERM');
        hasResolved = true;
        this._cleanupProcess(processId);
        reject(new Error(`Timeout Python après ${this.config.python.timeout}ms`));
      }
    }, options.timeout || this.config.python.timeout);

    // Envoi des données d'entrée
    if (inputData) {
      try {
        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();
      } catch (error) {
        console.warn('⚠️ Erreur envoi données à Python:', error.message);
      }
    } else {
      pythonProcess.stdin.end();
    }

    // Gestion des données de sortie
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    // Gestion de la fin du processus
    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;
      
      if (hasResolved) return;
      hasResolved = true;
      
      this._cleanupProcess(processId);
      
      if (code === 0) {
        try {
          // Essayer de parser le JSON, sinon retourner le texte brut
          let result;
          if (stdout.trim()) {
            try {
              result = JSON.parse(stdout);
            } catch (parseError) {
              result = { raw_output: stdout.trim() };
            }
          } else {
            result = { message: 'Script exécuté avec succès', success: true };
          }
          
          console.log(`✅ Script Python réussi: ${path.basename(scriptPath)} (${duration}ms)`);
          resolve({
            success: true,
            data: result,
            duration,
            processId
          });
        } catch (error) {
          console.error(`❌ Erreur traitement résultat Python:`, error);
          resolve({
            success: true,
            data: { raw_output: stdout },
            duration,
            processId
          });
        }
      } else {
        console.error(`❌ Erreur Python (code ${code}):`, stderr);
        reject(new Error(`Script Python échoué (code ${code}): ${stderr}`));
      }
    });

    // Gestion des erreurs du processus
    pythonProcess.on('error', (error) => {
      clearTimeout(timeout);
      if (!hasResolved) {
        hasResolved = true;
        this._cleanupProcess(processId);
        console.error(`❌ Erreur spawn Python:`, error);
        reject(error);
      }
    });

    console.log(`🐍 Démarrage script Python: ${path.basename(scriptPath)} (ID: ${processId})`);
  }

  /**
   * Nettoie les processus et gère la file d'attente
   */
  _cleanupProcess(processId) {
    this.runningProcesses.delete(processId);
    this.activeCount--;

    // Traiter le prochain dans la file d'attente
    if (this.processQueue.length > 0) {
      const next = this.processQueue.shift();
      const scriptPath = path.join(this.config.python.scriptsPath, next.scriptName);
      this._runPythonProcess(scriptPath, next.inputData, next.options, next.processId, next.resolve, next.reject);
    }
  }

  /**
   * Méthodes spécialisées pour votre SaaS forensique
   */
  async analyzeImage(imageData) {
    return this.executeScript('scripts/analyze_image.py', {
      image_file: imageData.filename,
      analysis_type: imageData.analysisType || 'full',
      image_id: imageData.imageId,
      user_id: imageData.userId
    });
  }

  async validateForensicData(data) {
    return this.executeScript('test_forensic_simple.py', data);
  }

  async generateReport(reportData) {
    return this.executeScript('scripts/generate_report.py', reportData, {
      timeout: 600000 // 10 minutes pour les rapports
    });
  }

  /**
   * Test de connectivité simple
   */
  async testConnectivity() {
    return this.executeScript('test_forensic_simple.py', { test: 'connectivity' }, {
      timeout: 10000
    });
  }

  /**
   * État du bridge Python
   */
  getStatus() {
    return {
      activeProcesses: this.activeCount,
      queueLength: this.processQueue.length,
      maxConcurrent: this.config.python.maxConcurrent,
      runningProcessIds: Array.from(this.runningProcesses.keys()),
      totalProcessed: this.totalProcessed || 0
    };
  }

  /**
   * Arrêt propre de tous les processus Python
   */
  async shutdown() {
    console.log('🐍 Arrêt des processus Python...');
    
    // Tuer tous les processus en cours
    for (const [processId, process] of this.runningProcesses) {
      try {
        process.kill('SIGTERM');
        console.log(`🔪 Processus Python ${processId} arrêté`);
      } catch (error) {
        console.warn(`⚠️ Erreur arrêt processus ${processId}:`, error.message);
      }
    }

    // Vider la file d'attente
    this.processQueue = [];
    this.runningProcesses.clear();
    this.activeCount = 0;

    console.log('✅ Python Bridge arrêté proprement');
  }
}

module.exports = PythonBridge;
