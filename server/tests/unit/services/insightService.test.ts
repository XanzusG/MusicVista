import * as InsightService from '../../../src/services/insightService';

// Mock the database connection
jest.mock('../../../src/database/connection', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('InsightService', () => {
  let mockQuery: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const pool = require('../../../src/database/connection').default;
    mockQuery = pool.query;
  });

  describe('getLoveDistribution', () => {
    it('should return love distribution data', async () => {
      const mockLoveDistribution = [
        { emotion: 'Euphoric', cnt: 15, ratio: 0.3 },
        { emotion: 'Cheerful', cnt: 10, ratio: 0.2 }
      ];

      mockQuery.mockResolvedValue({
        rows: mockLoveDistribution
      });

      const result = await InsightService.getLoveDistribution();
      expect(result).toEqual(mockLoveDistribution);
    });

    it('should handle empty results', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await InsightService.getLoveDistribution();
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(InsightService.getLoveDistribution()).rejects.toThrow(error);
    });
  });

  describe('getArtistPopularityGrowth', () => {
    it('should return artist popularity growth data', async () => {
      const mockGrowthData = [
        {
          artist_id: 1,
          artist: 'Artist One',
          popularity_growth_ratio: 13.33
        }
      ];

      mockQuery.mockResolvedValue({
        rows: mockGrowthData
      });

      const result = await InsightService.getArtistPopularityGrowth();
      expect(result).toEqual(mockGrowthData);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(InsightService.getArtistPopularityGrowth()).rejects.toThrow(error);
    });
  });

  describe('getArtistEmotionVariety', () => {
    it('should return artist emotion variety data', async () => {
      const mockVarietyData = [
        { id: 1, name: 'Artist One', variety: 0.45 },
        { id: 2, name: 'Artist Two', variety: 0.38 }
      ];

      mockQuery.mockResolvedValue({
        rows: mockVarietyData
      });

      const result = await InsightService.getArtistEmotionVariety();
      expect(result).toEqual(mockVarietyData);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(InsightService.getArtistEmotionVariety()).rejects.toThrow(error);
    });
  });

  describe('getPopWords', () => {
    it('should return popular words data', async () => {
      const mockPopWords = [
        { word: 'love', cnt: 150 },
        { word: 'heart', cnt: 120 }
      ];

      mockQuery.mockResolvedValue({
        rows: mockPopWords
      });

      const result = await InsightService.getPopWords();
      expect(result).toEqual(mockPopWords);
    });

    it('should handle empty words data', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await InsightService.getPopWords();
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(InsightService.getPopWords()).rejects.toThrow(error);
    });
  });
});
