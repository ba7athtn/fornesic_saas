const { normalizeOrientation, normalizeExifData } = require('../src/utils/exifNormalizer');

describe('EXIF Normalizer', () => {
  describe('normalizeOrientation', () => {
    const orientationTests = [
      { input: 1, expected: 1 },
      { input: "Horizontal (normal)", expected: 1 },
      { input: "Rotate 90 CW", expected: 6 },
      { input: "rotate 180", expected: 3 },
      { input: "ROTATE 270 CW", expected: 8 },
      { input: null, expected: null },
      { input: "invalid", expected: null },
      { input: 999, expected: null }
    ];

    orientationTests.forEach((testCase, index) => {
      test(`should normalize "${testCase.input}" to ${testCase.expected}`, () => {
        const result = normalizeOrientation(testCase.input);
        expect(result).toBe(testCase.expected);
      });
    });

    // Test global pour vérifier que tous les cas passent
    test('should pass all orientation normalization cases', () => {
      orientationTests.forEach((testCase) => {
        const result = normalizeOrientation(testCase.input);
        expect(result).toBe(testCase.expected);
      });
    });
  });

  describe('normalizeExifData', () => {
    test('should be a function', () => {
      expect(typeof normalizeExifData).toBe('function');
    });

    test('should handle undefined input', () => {
      const result = normalizeExifData();
      expect(result).toBeDefined();
    });

    test('should handle empty object input', () => {
      const result = normalizeExifData({});
      expect(result).toBeDefined();
    });
  });
});
