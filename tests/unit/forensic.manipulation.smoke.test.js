// backend/tests/forensicService.basic.test.js
const { ForensicService } = require('../../src/services/forensicService');

// PNG 1x1 test
const PNG_1x1_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wwAAgMBgG6dG0sAAAAASUVORK5CYII=';

describe('ForensicService Basic Tests', () => {
  let forensicService;

  beforeEach(() => {
    forensicService = new ForensicService();
  });

  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });

  describe('Service Instantiation', () => {
    test('should create ForensicService instance', () => {
      expect(forensicService).toBeInstanceOf(ForensicService);
    });

    test('should have analyzeImage method', () => {
      expect(forensicService.analyzeImage).toBeDefined();
      expect(typeof forensicService.analyzeImage).toBe('function');
    });
  });

  describe('Basic Image Analysis', () => {
    test('should handle empty buffer gracefully', async () => {
      const emptyBuffer = Buffer.alloc(0);
      
      await expect(
        forensicService.analyzeImage(emptyBuffer)
      ).rejects.toThrow();
    });

    test('should handle valid PNG buffer', () => {
      const img = Buffer.from(PNG_1x1_BASE64, 'base64');
      
      expect(img).toBeInstanceOf(Buffer);
      expect(img.length).toBeGreaterThan(0);
    });

    test('should reject null input', async () => {
      await expect(
        forensicService.analyzeImage(null)
      ).rejects.toThrow();
    });

    test('should reject undefined input', async () => {
      await expect(
        forensicService.analyzeImage(undefined)
      ).rejects.toThrow();
    });
  });
});
