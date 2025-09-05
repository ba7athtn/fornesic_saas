const { normalizeOrientation, normalizeExifData } = require('../src/utils/exifNormalizer');

// Tests unitaires
function runTests() {
  console.log('🧪 Tests de normalisation EXIF...');

  // Test des orientations
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

  let passed = 0;
  orientationTests.forEach((test, i) => {
    const result = normalizeOrientation(test.input);
    if (result === test.expected) {
      console.log(`✅ Test ${i + 1} passed: ${test.input} → ${result}`);
      passed++;
    } else {
      console.log(`❌ Test ${i + 1} failed: ${test.input} → ${result} (expected ${test.expected})`);
    }
  });

  console.log(`\n📊 Résultats: ${passed}/${orientationTests.length} tests réussis`);
  return passed === orientationTests.length;
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
