// tests/unit/forensic.manipulation.smoke.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { ForensicService } = require('../../src/services/forensicService');

// PNG 1x1 blanc
const PNG_1x1_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA' +
  'AAC0lEQVR42mP8/wwAAgMBgG6dG0sAAAAASUVORK5CYII=';

test('ForensicService.analyzeImage expose manipulation sans IA', async () => {
  const svc = new ForensicService();
  const img = Buffer.from(PNG_1x1_BASE64, 'base64');
  const res = await svc.analyzeImage(img, { include: { aiDetection: false } });
  assert.ok('manipulation' in res);
});
