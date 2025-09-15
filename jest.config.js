// backend/jest.config.js
const path = require('path');
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      { configFile: path.resolve(__dirname, 'babel.jest.config.cjs'), babelrc: false }
    ]
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')],
  moduleNameMapper: { '^src/(.*)$': '<rootDir>/src/$1' },
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/frontend/', '<rootDir>/.scannerwork/'],
  watchPathIgnorePatterns: ['<rootDir>/frontend/', '<rootDir>/.scannerwork/'],
  modulePathIgnorePatterns: ['<rootDir>/frontend/', '<rootDir>/.scannerwork/'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'json', 'node'],
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 20000
};
