import { Request, Response } from 'express';
import * as TrackController from '../../../src/controllers/trackController';
import * as TrackService from '../../../src/services/trackService';

// Mock the service
jest.mock('../../../src/services/trackService');

const mockTrackService = TrackService as jest.Mocked<typeof TrackService>;

describe('TrackController', () => {
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

  describe('getTrackById', () => {
    it('should return track when found', async () => {
      const mockTracks = [
        {
          id: '1',
          name: 'Test Track',
          album_id: 'album1',
          album_name: 'Test Album',
          artist_ids: ['artist1'],
          artist_names: ['Artist One']
        }
      ];

      mockRequest.params = { id: '1' };
      mockTrackService.getTracks.mockResolvedValue(mockTracks as any);

      await TrackController.getTrackById(mockRequest as Request, mockResponse as Response);

      expect(mockTrackService.getTracks).toHaveBeenCalledWith({ ids: ['1'] });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTracks[0],
        timestamp: expect.any(String)
      });
    });

    it('should return 404 when track not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockTrackService.getTracks.mockResolvedValue(null);

      await TrackController.getTrackById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Track not found',
        timestamp: expect.any(String)
      });
    });
  });

  describe('searchTracks', () => {
    it('should search tracks with query parameters', async () => {
      const mockTracks = [{ id: '1', name: 'Search Result' }];
      
      mockRequest.query = {
        searchTerm: 'Test',
        emotionFilter: 'Euphotic',
        sortBy: 'release_date',
        sortOrder: 'DESC',
        limit: '10',
        offset: '0'
      };
      mockTrackService.getTracks.mockResolvedValue(mockTracks as any);

      await TrackController.searchTracks(mockRequest as Request, mockResponse as Response);

      expect(mockTrackService.getTracks).toHaveBeenCalledWith({
        searchTerm: 'Test',
        emotionFilter: 'Euphotic',
        sortBy: 'release_date',
        sortOrder: 'DESC',
        limit: 10,
        offset: 0
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getTrackCount', () => {
    it('should return track count', async () => {
      const mockCount = 42;
      
      mockRequest.query = {
        searchTerm: 'Test',
        emotionFilter: 'Cheerful'
      };
      mockTrackService.getTrackCount.mockResolvedValue(mockCount);

      await TrackController.getTrackCount(mockRequest as Request, mockResponse as Response);

      expect(mockTrackService.getTrackCount).toHaveBeenCalledWith({
        searchTerm: 'Test',
        emotionFilter: 'Cheerful'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAllTracks', () => {
    it('should return all tracks', async () => {
      const mockTracks = [
        { id: '1', name: 'Track 1' },
        { id: '2', name: 'Track 2' }
      ];

      mockTrackService.getTracks.mockResolvedValue(mockTracks as any);

      await TrackController.getAllTracks(mockRequest as Request, mockResponse as Response);

      expect(mockTrackService.getTracks).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getSimilarTracks', () => {
    it('should return similar tracks', async () => {
      const mockTracks = [
        { id: '2', name: 'Similar Track' }
      ];
      
      mockRequest.params = { id: 'track1' };
      mockRequest.query = { limit: '5' };
      mockTrackService.getSimilarTracks.mockResolvedValue(mockTracks as any);

      await TrackController.getSimilarTracks(mockRequest as Request, mockResponse as Response);

      expect(mockTrackService.getSimilarTracks).toHaveBeenCalledWith({
        trackId: 'track1',
        limit: 5
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getTracksByArtist', () => {
    it('should return tracks by artist', async () => {
      const mockTracks = [
        { id: '1', name: 'Artist Track 1' }
      ];
      
      mockRequest.params = { id: 'artist1' };
      mockRequest.query = { limit: '5', offset: '0' };
      mockTrackService.getTracks.mockResolvedValue(mockTracks as any);

      await TrackController.getTracksByArtist(mockRequest as Request, mockResponse as Response);

      expect(mockTrackService.getTracks).toHaveBeenCalledWith({
        artistIds: ['artist1'],
        limit: 5,
        offset: 0
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
