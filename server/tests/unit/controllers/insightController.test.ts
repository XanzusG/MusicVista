import { Request, Response } from 'express';
import * as InsightController from '../../../src/controllers/insightController';
import * as InsightService from '../../../src/services/insightService';

// Mock the service
jest.mock('../../../src/services/insightService');

const mockInsightService = InsightService as jest.Mocked<typeof InsightService>;

describe('InsightController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getLoveDistribution', () => {
    it('should return love distribution data', async () => {
      const mockLoveDistribution = [
        { emotion: 'Euphotic', cnt: 15, ratio: 0.3 },
        { emotion: 'Cheerful', cnt: 10, ratio: 0.2 }
      ];

      mockInsightService.getLoveDistribution.mockResolvedValue(mockLoveDistribution as any);

      await InsightController.getLoveDistribution(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getLoveDistribution).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockLoveDistribution,
        timestamp: expect.any(String)
      });
    });
  });

  describe('getPopWords', () => {
    it('should return popular words data', async () => {
      const mockPopWords = [
        { word: 'love', cnt: 150 },
        { word: 'heart', cnt: 120 }
      ];

      mockInsightService.getPopWords.mockResolvedValue(mockPopWords as any);

      await InsightController.getPopWords(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getPopWords).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockPopWords,
        timestamp: expect.any(String)
      });
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

      mockInsightService.getArtistPopularityGrowth.mockResolvedValue(mockGrowthData as any);

      await InsightController.getArtistPopularityGrowth(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getArtistPopularityGrowth).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockGrowthData,
        timestamp: expect.any(String)
      });
    });
  });

  describe('getArtistEmotionVariety', () => {
    it('should return artist emotion variety data', async () => {
      const mockVarietyData = [
        { id: 1, name: 'Artist One', variety: 0.45 },
        { id: 2, name: 'Artist Two', variety: 0.38 }
      ];

      mockInsightService.getArtistEmotionVariety.mockResolvedValue(mockVarietyData as any);

      await InsightController.getArtistEmotionVariety(mockRequest as Request, mockResponse as Response);

      expect(mockInsightService.getArtistEmotionVariety).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockVarietyData,
        timestamp: expect.any(String)
      });
    });
  });
});
