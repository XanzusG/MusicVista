import { Request, Response } from 'express';
import * as AlbumController from '../../../src/controllers/albumController';
import * as AlbumService from '../../../src/services/albumService';

// Mock the service
jest.mock('../../../src/services/albumService');

const mockAlbumService = AlbumService as jest.Mocked<typeof AlbumService>;

describe('AlbumController', () => {
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

  describe('getAlbumById', () => {
    it('should return album when found', async () => {
      const mockAlbum = {
        id: '1',
        name: 'Test Album',
        release_date: '2023-01-01',
        popularity: 85,
        num_tracks: 10,
        type: 'album'
      };

      mockRequest.params = { id: '1' };
      mockAlbumService.getAlbumById.mockResolvedValue(mockAlbum as any);

      await AlbumController.getAlbumById(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbumById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockAlbum,
        timestamp: expect.any(String)
      });
    });

    it('should return 404 when album not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockAlbumService.getAlbumById.mockResolvedValue(null);

      await AlbumController.getAlbumById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: '专辑不存在',
        timestamp: expect.any(String)
      });
    });
  });

  describe('getAllAlbums', () => {
    it('should return all albums', async () => {
      const mockAlbums = [
        { id: '1', name: 'Album 1' },
        { id: '2', name: 'Album 2' }
      ];

      mockAlbumService.getAlbums.mockResolvedValue(mockAlbums as any);

      await AlbumController.getAllAlbums(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbums).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('searchAlbums', () => {
    it('should search albums with query parameters', async () => {
      const mockAlbums = [{ id: '1', name: 'Search Result' }];
      
      mockRequest.query = {
        searchTerm: 'Test',
        typeFilter: 'album',
        sortBy: 'popularity',
        sortOrder: 'DESC',
        limit: '10',
        offset: '0'
      };
      mockAlbumService.getAlbums.mockResolvedValue(mockAlbums as any);

      await AlbumController.searchAlbums(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbums).toHaveBeenCalledWith({
        searchTerm: 'Test',
        typeFilter: 'album',
        sortBy: 'popularity',
        sortOrder: 'DESC',
        limit: 10,
        offset: 0
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAlbumsByArtist', () => {
    it('should return albums by artist', async () => {
      const mockAlbums = [{ id: '1', name: 'Artist Album' }];
      
      mockRequest.params = { id: 'artist1' };
      mockRequest.query = { limit: '5', offset: '0' };
      mockAlbumService.getAlbums.mockResolvedValue(mockAlbums as any);

      await AlbumController.getAlbumsByArtist(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbums).toHaveBeenCalledWith({
        artistIds: ['artist1'],
        limit: 5,
        offset: 0
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAlbumCount', () => {
    it('should return album count', async () => {
      const mockCount = 42;
      
      mockRequest.query = {
        searchTerm: 'Test',
        typeFilter: 'album'
      };
      mockAlbumService.getAlbumCount.mockResolvedValue(mockCount);

      await AlbumController.getAlbumCount(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbumCount).toHaveBeenCalledWith({
        searchTerm: 'Test',
        typeFilter: 'album'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });
});
