module.exports = {
  plugins: ['sonarjs'],
  extends: ['plugin:sonarjs/recommended'],
  rules: {
    'sonarjs/no-duplicate-string': 'error',
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-duplicated-branches': 'error'
  }
};
