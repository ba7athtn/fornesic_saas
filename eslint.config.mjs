import js from '@eslint/js';
import globals from 'globals';
import sonarjs from 'eslint-plugin-sonarjs';

export default [
  { ignores: ['frontend/**','.scannerwork/**','node_modules/**'] },
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2021, sourceType: 'commonjs', globals: { ...globals.node } },
    rules: { 'no-unused-vars':'warn','no-console':'off' }
  },
  js.configs.recommended,
  sonarjs.configs.recommended
];
