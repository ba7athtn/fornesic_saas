// tests/unit/forensicService.basic.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const { ForensicService } = require('../../src/services/forensicService');

test('ForensicService.analyzeImage retourne aiDetection', async () => {
  const svc = new ForensicService();
  const res = await svc.analyzeImage(Buffer.from([]));
  assert.ok(res.aiDetection);
});
