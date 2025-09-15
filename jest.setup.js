// backend/jest.setup.js
process.env.NODE_ENV = 'test';

jest.mock('ioredis', () => require('ioredis-mock'));

jest.mock('bull', () => {
  return function MockQueue() {
    return {
      add: jest.fn().mockResolvedValue({ id: 'mock-job' }),
      getJob: jest.fn().mockResolvedValue({
        id: 'mock-job',
        getState: jest.fn().mockResolvedValue('completed'),
        progress: () => 100,
        returnvalue: { filepath: 'C:\\tmp\\mock.pdf', filename: 'mock.pdf', contentType: 'application/pdf' },
        timestamp: Date.now(),
        finishedOn: Date.now()
      }),
      on: jest.fn(),
      process: jest.fn(),
      close: jest.fn().mockResolvedValue()
    };
  };
});

jest.mock('src/services/pythonBridge', () => ({
  executeScript: jest.fn(async () => ({ success: true, data: { filepath: null } }))
}));

jest.mock('src/services/exifService', () => {
  return {
    ExifForensicService: class {
      async initializeLibraries() { return; }
      async extractForensicExifData() { return { ok: true, score: 70 }; }
    }
  };
});

// Option: neutraliser console.log si trop verbeux
// const originalLog = console.log;
// beforeAll(() => { console.log = () => {}; });
// afterAll(() => { console.log = originalLog; });
