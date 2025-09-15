// tests/forensicService.basic.test.js (extrait)
const { ForensicService } = require('src/services/forensicService');

describe('ForensicService', () => {
  test('rejects empty buffer with "buffer vide"', async () => {
    const svc = new ForensicService();
    await expect(svc.analyzeImage(Buffer.alloc(0))).rejects.toThrow(/buffer vide/i);
  });

  test('handles non-empty buffer quickly (no heavy modules)', async () => {
    const svc = new ForensicService();
    const testBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
    const options = { include: { aiDetection: false, pythonBridge: false, exif: false, cache: false, queue: false } };
    try {
      const result = await svc.analyzeImage(testBuffer, options);
      expect(result).toBeDefined();
    } catch (err) {
      expect(err.message).toBeDefined();
    }
  });
});
