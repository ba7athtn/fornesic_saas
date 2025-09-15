// tests/unit/reportController.test.js
const reportController = require('../../src/controllers/reportController');

describe('Ba7ath Report Controller', () => {
  describe('generateForensicReport', () => {
    it('should validate required imageId parameter', async () => {
      const req = { params: {}, query: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
      await expect(reportController.generateForensicReport(req, res))
        .rejects.toThrow('Invalid ObjectId format');
    });
  });
});
