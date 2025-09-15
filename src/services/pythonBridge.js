// backend/src/services/pythonBridge.js
"use strict";

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const crypto = require('crypto');
const os = require('os');

class Ba7athPythonBridge {
  constructor(config = {}) {
    this.config = this._withDefaults(config);
    this.runningProcesses = new Map();
    this.processQueue = [];
    this.activeCount = 0;
    this.totalProcessed = 0;
    this.totalErrors = 0;
    this.startTime = Date.now();

    // ✅ EXPRESS 5.0 COMPAT: bind methods
    this.executeScript = this.executeScript.bind(this);
    this.analyzeImage = this.analyzeImage.bind(this);
    this._runPythonProcess = this._runPythonProcess.bind(this);

    console.log('🐍 Ba7ath Python Bridge initialized with Express 5.0 compatibility');
  }

  _withDefaults(config) {
    const cfg = config || {};
    const py = cfg.python || {};
    const defaultScriptsPath = path.resolve(__dirname, '../scripts');
    return {
      python: {
        executable: py.executable || process.env.PYTHON_EXECUTABLE || 'python',
        scriptsPath: py.scriptsPath || process.env.PY_SCRIPTS_PATH || defaultScriptsPath,
        venvPath: py.venvPath || process.env.PY_VENV || null,
        maxConcurrent: typeof py.maxConcurrent === 'number' ? py.maxConcurrent : 3,
        timeout: typeof py.timeout === 'number' ? py.timeout : 120000,
        tempDir: py.tempDir || os.tmpdir(),
        maxQueueSize: py.maxQueueSize || 50
      }
    };
  }

  /**
   * ✅ Exécute un script Python (Express 5-safe)
   */
  async executeScript(scriptName, inputData, options = {}) {
    if (!scriptName || typeof scriptName !== 'string') {
      throw new Error('Nom de script invalide');
    }

    // Protection path traversal
    const sanitizedScriptName = path.basename(scriptName);
    if (sanitizedScriptName !== scriptName) {
      console.warn(`⚠️ Script path sanitized: ${scriptName} → ${sanitizedScriptName}`);
    }

    const processId = crypto.randomBytes(8).toString('hex');
    const scriptPath = path.resolve(this.config.python.scriptsPath, sanitizedScriptName);

    if (!fsSync.existsSync(scriptPath)) {
      throw new Error(`Script Python introuvable: ${sanitizedScriptName}`);
    }

    if (this.processQueue.length >= this.config.python.maxQueueSize) {
      throw new Error('Queue Python saturée - trop de demandes en attente');
    }

    console.log(`🐍 Demande exécution script: ${sanitizedScriptName} (ID: ${processId})`);

    return new Promise((resolve, reject) => {
      const requestData = {
        scriptName: sanitizedScriptName,
        scriptPath,
        inputData,
        options: {
          timeout: options.timeout || this.config.python.timeout,
          priority: options.priority || 'normal',
          ...options
        },
        processId,
        resolve,
        reject,
        requestTime: Date.now()
      };

      if (this.activeCount >= this.config.python.maxConcurrent) {
        this.processQueue.push(requestData);
        console.log(`📋 Script en queue: ${sanitizedScriptName} (Queue: ${this.processQueue.length})`);
        return;
      }

      this._executeImmediately(requestData);
    });
  }

  /**
   * ✅ Exécution immédiate
   */
  _executeImmediately(requestData) {
    this.activeCount++;
    console.log(`🚀 Démarrage ${requestData.scriptName} (${this.activeCount}/${this.config.python.maxConcurrent})`);

    this._runPythonProcess(requestData)
      .then((result) => requestData.resolve(result))
      .catch((error) => {
        this.totalErrors++;
        console.error(`❌ Erreur script ${requestData.scriptName}:`, error.message);
        requestData.reject(error);
      })
      .finally(() => {
        this._cleanupProcess(requestData.processId);
      });
  }

  /**
   * ✅ Exécution du process Python
   */
  async _runPythonProcess(requestData) {
    const { scriptPath, inputData, options, processId } = requestData;
    const startTime = Date.now();

    let pythonCmd = this.config.python.executable;
    const pythonEnv = {
      ...process.env,
      PYTHONPATH: this.config.python.scriptsPath,
      PYTHONIOENCODING: 'utf-8'
    };

    // Venv
    if (this.config.python.venvPath && fsSync.existsSync(this.config.python.venvPath)) {
      const venvPython = this._getVenvPython();
      if (venvPython && fsSync.existsSync(venvPython)) {
        pythonCmd = venvPython;
        console.log(`🔧 Utilisation venv: ${path.basename(venvPython)}`);
      }
    }

    const args = this._buildScriptArgs(scriptPath, inputData, options);

    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';
      let hasResolved = false;
      let tempFilePath = null;

      const pythonProcess = spawn(pythonCmd, args, {
        cwd: path.dirname(scriptPath),
        env: pythonEnv,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.runningProcesses.set(processId, pythonProcess);

      // Timeout logiciel
      const timeout = setTimeout(() => {
        if (!hasResolved) {
          console.warn(`⏰ Timeout Python après ${options.timeout}ms: ${path.basename(scriptPath)}`);
          pythonProcess.kill('SIGKILL');
          hasResolved = true;
          this._cleanupTempFile(tempFilePath);
          reject(new Error(`Timeout Python après ${options.timeout}ms`));
        }
      }, options.timeout);

      // Input data
      this._handleInputData(pythonProcess, inputData)
        .then((tempPath) => {
          tempFilePath = tempPath;
        })
        .catch((inputError) => {
          console.error('❌ Erreur envoi données à Python:', inputError);
          if (!hasResolved) {
            hasResolved = true;
            clearTimeout(timeout);
            reject(inputError);
          }
        });

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString('utf8');
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString('utf8');
      });

      pythonProcess.on('close', (code, signal) => {
        clearTimeout(timeout);
        if (hasResolved) return;
        hasResolved = true;

        const duration = Date.now() - startTime;
        this._cleanupTempFile(tempFilePath);
        this.totalProcessed++;

        if (code === 0) {
          try {
            const result = this._parseScriptOutput(stdout, stderr, duration, processId);
            console.log(`✅ Script réussi: ${path.basename(scriptPath)} (${duration}ms)`);
            resolve(result);
          } catch (parseError) {
            console.error(`❌ Erreur parsing résultat:`, parseError);
            reject(parseError);
          }
        } else {
          const error = new Error(
            `Script Python échoué (code ${code}${signal ? `, signal ${signal}` : ''}): ${stderr || 'Pas de détails'}`
          );
          reject(error);
        }
      });

      pythonProcess.on('error', (error) => {
        clearTimeout(timeout);
        if (!hasResolved) {
          hasResolved = true;
          this._cleanupTempFile(tempFilePath);
          console.error('❌ Erreur spawn Python:', error);
          reject(new Error(`Erreur spawn Python: ${error.message}`));
        }
      });
    });
  }

  /**
   * ✅ Gestion input: Buffer / Object
   */
  async _handleInputData(pythonProcess, inputData) {
    if (!inputData) {
      pythonProcess.stdin.end();
      return null;
    }

    if (Buffer.isBuffer(inputData)) {
      const tempPath = path.join(this.config.python.tempDir, `ba7ath_${crypto.randomBytes(8).toString('hex')}.bin`);
      await fs.writeFile(tempPath, inputData);
      pythonProcess.stdin.write(JSON.stringify({ tempFile: tempPath }));
      pythonProcess.stdin.end();
      return tempPath;
    } else {
      pythonProcess.stdin.write(JSON.stringify(inputData));
      pythonProcess.stdin.end();
      return null;
    }
  }

  /**
   * ✅ Parsing résultat
   */
  _parseScriptOutput(stdout, stderr, duration, processId) {
    let result;

    if (stdout.trim()) {
      try {
        result = JSON.parse(stdout.trim());
      } catch (parseError) {
        console.warn('⚠️ Sortie Python non-JSON:', parseError.message);
        result = {
          success: false,
          error: 'Invalid JSON output',
          raw_output: stdout.trim(),
          stderr: stderr.trim()
        };
      }
    } else {
      result = {
        success: true,
        message: 'Script exécuté sans sortie',
        stderr: stderr.trim()
      };
    }

    return {
      success: !result.error && result.success !== false,
      data: result,
      duration,
      processId,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * ✅ Cleanup + queue
   */
  _cleanupProcess(processId) {
    this.runningProcesses.delete(processId);
    this.activeCount--;

    console.log(`🧹 Processus nettoyé: ${processId} (Actifs: ${this.activeCount})`);

    if (this.processQueue.length > 0) {
      const nextRequest = this.processQueue.shift();
      console.log(`🔄 Traitement queue: ${nextRequest.scriptName} (Reste: ${this.processQueue.length})`);
      this._executeImmediately(nextRequest);
    }
  }

  // =========================
  // Utils
  // =========================
  _getVenvPython() {
    return process.platform === 'win32'
      ? path.join(this.config.python.venvPath, 'Scripts', 'python.exe')
      : path.join(this.config.python.venvPath, 'bin', 'python');
  }

  _buildScriptArgs(scriptPath, inputData, options) {
    const args = [scriptPath];
    if (options.scriptArgs && Array.isArray(options.scriptArgs)) {
      args.push(...options.scriptArgs);
    }
    return args;
  }

  async _cleanupTempFile(tempFilePath) {
    if (tempFilePath && fsSync.existsSync(tempFilePath)) {
      try {
        await fs.unlink(tempFilePath);
        console.log(`🗑️ Fichier temporaire nettoyé: ${path.basename(tempFilePath)}`);
      } catch (error) {
        console.warn(`⚠️ Erreur nettoyage fichier temporaire:`, error.message);
      }
    }
  }

  // =====================================
  // MÉTHODES SaaS
  // =====================================
  async analyzeImage(imageData) {
    let scriptInput;
    let scriptArgs = [];

    if (Buffer.isBuffer(imageData)) {
      scriptInput = imageData;
    } else if (typeof imageData === 'string') {
      scriptArgs = ['-i', imageData, '-t', 'full'];
      scriptInput = null;
    } else if (imageData && typeof imageData === 'object') {
      scriptArgs = ['-i', imageData.filename || imageData.imagePath || '', '-t', imageData.analysisType || 'full'];
      if (imageData.imageId) scriptArgs.push('--image_id', imageData.imageId);
      scriptInput = imageData.buffer || null;
    } else {
      throw new Error('Format imageData non supporté');
    }

    return this.executeScript('analyze_image.py', scriptInput, {
      scriptArgs,
      timeout: 180000,
      priority: 'high'
    });
  }

  async validateForensicData(data) {
    return this.executeScript('test_forensic_simple.py', data, {
      timeout: 30000,
      priority: 'normal'
    });
  }

  async generateReport(reportData) {
    return this.executeScript('generate_report.py', reportData, {
      timeout: 600000,
      priority: 'low'
    });
  }

  async testConnectivity() {
    return this.executeScript('analyze_image.py', null, {
      scriptArgs: ['--help'],
      timeout: 10000,
      priority: 'high'
    });
  }

  /**
   * ✅ Status
   */
  getStatus() {
    const uptime = Date.now() - this.startTime;

    return {
      activeProcesses: this.activeCount,
      queueLength: this.processQueue.length,
      maxConcurrent: this.config.python.maxConcurrent,
      totalProcessed: this.totalProcessed,
      totalErrors: this.totalErrors,
      successRate:
        this.totalProcessed > 0
          ? ((this.totalProcessed - this.totalErrors) / this.totalProcessed * 100).toFixed(2) + '%'
          : 'N/A',
      uptime: Math.round(uptime / 1000),
      uptimeFormatted: this._formatUptime(uptime),
      pythonExecutable: this.config.python.executable,
      scriptsPath: this.config.python.scriptsPath,
      hasVenv: !!this.config.python.venvPath,
      health: this._getHealthStatus(),
      runningProcessIds: Array.from(this.runningProcesses.keys()),
      timestamp: new Date().toISOString()
    };
  }

  _formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m${seconds % 60}s`;
    return `${seconds}s`;
  }

  _getHealthStatus() {
    const queueUtilization = this.processQueue.length / this.config.python.maxQueueSize;
    const processUtilization = this.activeCount / this.config.python.maxConcurrent;

    if (queueUtilization > 0.8 || processUtilization === 1) return 'busy';
    if (this.totalErrors / Math.max(this.totalProcessed, 1) > 0.1) return 'degraded';
    return 'healthy';
  }

  /**
   * ✅ Arrêt propre
   */
  async shutdown() {
    console.log('🐍 Arrêt Ba7ath Python Bridge...');

    const shutdownPromises = [];

    for (const [processId, process] of this.runningProcesses) {
      shutdownPromises.push(new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn(`⚠️ Force kill processus: ${processId}`);
          process.kill('SIGKILL');
          resolve();
        }, 5000);

        process.on('close', () => {
          clearTimeout(timeout);
          resolve();
        });

        console.log(`🔪 Arrêt processus: ${processId}`);
        process.kill('SIGTERM');
      }));
    }

    await Promise.all(shutdownPromises);

    for (const queuedItem of this.processQueue) {
      queuedItem.reject(new Error('Python Bridge en cours d\'arrêt'));
    }

    this.processQueue = [];
    this.runningProcesses.clear();
    this.activeCount = 0;

    console.log('✅ Ba7ath Python Bridge arrêté proprement');
  }
}

// =====================================
// SINGLETON + FAÇADES EXPRESS 5.0
// =====================================

const bridge = new Ba7athPythonBridge({
  python: {
    maxConcurrent: parseInt(process.env.PYTHON_MAX_CONCURRENT) || 3,
    timeout: parseInt(process.env.PYTHON_TIMEOUT) || 120000,
    scriptsPath: process.env.PY_SCRIPTS_PATH || path.resolve(__dirname, '../scripts')
  }
});

// ✅ Façades
async function executePythonAnalysis(imageInput, options = {}) {
  const result = await bridge.analyzeImage(imageInput);
  return result;
}

async function analyze(imageInput, options = {}) {
  return executePythonAnalysis(imageInput, options);
}

async function run(imageInput, options = {}) {
  return executePythonAnalysis(imageInput, options);
}

module.exports = {
  PythonBridge: Ba7athPythonBridge,
  executePythonAnalysis,
  analyze,
  run,
  bridge
};
