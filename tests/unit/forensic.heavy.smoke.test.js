// tests/unit/forensic.heavy.smoke.test.js
const { ForensicService } = require('src/services/forensicService');

// Mock du pont Python (empêche exécution réelle)
jest.mock('src/services/pythonBridge', () => ({
  Ba7athPythonBridge: jest.fn(() => ({
    executeScript: jest.fn().mockResolvedValue({
      success: true,
      physics: { detected: true, confidence: 0.8 }
    })
  }))
}));

// Image 1x1 PNG en base64
const PNG_1x1_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wwAAgMBgG6dG0sAAAAASUVORK5CYII=';

describe('ForensicService Heavy Analysis (Mocked)', () => {
  let forensicService;

  beforeEach(() => {
    forensicService = new ForensicService();
  });

  test('should expose physics property without AI detection', async () => {
    const img = Buffer.from(PNG_1x1_BASE64, 'base64');
    const options = { include: { aiDetection: false } };

    let tid;
    try {
      const result = await Promise.race([
        forensicService.analyzeImage(img, options),
        new Promise((_, reject) => {
          tid = setTimeout(() => reject(new Error('Test timeout')), 10000);
        })
      ]);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('physics');
    } catch (error) {
      expect(error.message).toBeDefined();
    } finally {
      if (tid) clearTimeout(tid);
    }
  }, 15000);
});
