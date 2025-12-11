import { Request, Response } from 'express';
import * as ArtistController from '../../../src/controllers/artistController';
import * as ArtistService from '../../../src/services/artistService';

// Mock the service
jest.mock('../../../src/services/artistService');
const mockArtistService = ArtistService as jest.Mocked<typeof ArtistService>;

describe('ArtistController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('searchArtists', () => {
    it('should return artists successfully', async () => {
      const mockArtists = [
        { id: '1', name: 'Artist 1', popularity: 85 },
        { id: '2', name: 'Artist 2', popularity: 75 },
      ];

      mockArtistService.getArtists.mockResolvedValue(mockArtists);

      await ArtistController.searchArtists(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({
        searchTerm: '',
        limit: 10,
        offset: 0,
        includeGenres: false,
        sortBy: 'popularity',
        sortOrder: 'DESC',
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockArtists,
        timestamp: expect.any(String),
      });
    });

    it('should handle query parameters correctly', async () => {
      const mockArtists = [{ id: '1', name: 'Test Artist' }];
      
      mockReq.query = {
        searchTerm: 'test',
        limit: '10',
        offset: '20',
        genreFilter: 'rock',
        includeGenres: 'true',
        sortBy: 'popularity',
        sortOrder: 'ASC',
      };

      mockArtistService.getArtists.mockResolvedValue(mockArtists);

      await ArtistController.searchArtists(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({
        searchTerm: 'test',
        limit: 10,
        offset: 20,
        includeGenres: true,
        genreFilter: 'rock',
        sortBy: 'popularity',
        sortOrder: 'ASC',
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockArtistService.getArtists.mockRejectedValue(error);

      await ArtistController.searchArtists(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('getArtistById', () => {
    it('should return artist when found', async () => {
      const mockArtist = { id: '1', name: 'Test Artist', popularity: 85 };
      mockReq.params = { id: '1' };
      mockArtistService.getArtists.mockResolvedValue([mockArtist]);

      await ArtistController.getArtistById(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({ ids: ['1'] });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockArtist,
        timestamp: expect.any(String),
      });
    });

    it('should return 404 when artist not found', async () => {
      mockReq.params = { id: '999' };
      mockArtistService.getArtists.mockResolvedValue([]);

      await ArtistController.getArtistById(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({ ids: ['999'] });
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: '艺术家不存在',
        timestamp: expect.any(String),
      });
    });

    it('should handle missing ID parameter', async () => {
      mockReq.params = {};

      await ArtistController.getArtistById(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).not.toHaveBeenCalled();
      // Should still handle error through try-catch
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockReq.params = { id: '1' };
      mockArtistService.getArtists.mockRejectedValue(error);

      await ArtistController.getArtistById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
        timestamp: expect.any(String),
      });
    });
  });
});