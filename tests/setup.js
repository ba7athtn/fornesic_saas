// tests/setup.js - FINAL VERSION
jest.mock('bull', () => {
  return jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
    process: jest.fn(),
    close: jest.fn().mockResolvedValue(),
    on: jest.fn(),
    off: jest.fn()
  }));
});

// Mock analysisQueue specifically
jest.mock('../src/services/analysisQueue.js', () => ({
  analysisQueue: {
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
    close: jest.fn().mockResolvedValue()
  },
  addAnalysisJob: jest.fn().mockResolvedValue({ id: 'mock-job-id' })
}));

// Mock Mongoose to avoid timeouts
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    readyState: 1,
    close: jest.fn().mockResolvedValue()
  }
}));

// Mock Python bridge to avoid script errors
jest.mock('../src/services/pythonBridge.js', () => ({
  Ba7athPythonBridge: jest.fn(() => ({
    executeScript: jest.fn().mockResolvedValue({ 
      success: true, 
      result: { physics: { detected: false } }
    })
  }))
}));

// Global timeout
jest.setTimeout(30000);

// Clean after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Final cleanup - IMPROVED
afterAll(async () => {
  // Close any remaining connections
  const analysisQueue = require('../src/services/analysisQueue.js');
  if (analysisQueue.analysisQueue && analysisQueue.analysisQueue.close) {
    await analysisQueue.analysisQueue.close();
  }
  
  jest.clearAllTimers();
  jest.restoreAllMocks();
});
