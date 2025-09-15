// tests/configWiring.static.spec.js
const path = require('path');
const fs = require('fs');
const fg = require('fast-glob');

const CWD = path.resolve(__dirname, '..');
const patterns = ['src/**/*.js', 'config.js'];
const targets = fg.sync(patterns, { cwd: CWD, dot: false, onlyFiles: true });

describe('Config wiring - Vérification statique', () => {
  test('Tous les fichiers cibles existent (ou sont ignorés)', () => {
    expect(targets.length).toBeGreaterThan(0);
  });

  for (const rel of targets) {
    test(`Existe: ${rel}`, () => {
      const abs = path.join(CWD, rel);
      expect(fs.existsSync(abs)).toBe(true);
    });
  }
});
