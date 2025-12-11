import * as AlbumService from '../../../src/services/albumService';

// Mock the database connection
jest.mock('../../../src/database/connection', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('AlbumService', () => {
  let mockQuery: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const pool = require('../../../src/database/connection').default;
    mockQuery = pool.query;
  });

  describe('getAlbums', () => {
    it('should return albums when search is successful', async () => {
      const mockAlbums = [
        {
          id: '1',
          name: 'Test Album',
          release_date: '2023-01-01',
          popularity: 85,
          num_tracks: 10,
          type: 'album',
          artist_ids: ['artist1'],
          artist_names: ['Artist One'],
          urls: ['http://example.com/image.jpg']
        }
      ];

      mockQuery.mockResolvedValue({
        rows: mockAlbums
      });

      const result = await AlbumService.getAlbums({
        searchTerm: 'Test',
        limit: 10,
        offset: 0
      });

      expect(result).toEqual(mockAlbums);
      expect(mockQuery).toHaveBeenCalled();
    });

    it('should return null when no albums found', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await AlbumService.getAlbums({});
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(AlbumService.getAlbums({})).rejects.toThrow(error);
    });
  });

  describe('getAlbumCount', () => {
    it('should return album count', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ count: '42' }]
      });

      const result = await AlbumService.getAlbumCount({});
      expect(result).toBe(42);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(AlbumService.getAlbumCount({})).rejects.toThrow(error);
    });
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

      mockQuery.mockResolvedValue({
        rows: [mockAlbum]
      });

      const result = await AlbumService.getAlbumById('1');
      expect(result).toEqual(mockAlbum);
    });

    it('should return null when album not found', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await AlbumService.getAlbumById('nonexistent');
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(AlbumService.getAlbumById('1')).rejects.toThrow('Error fetching album by ID');
    });
  });

  describe('getTypeDistributionFromSearch', () => {
    it('should return type distribution', async () => {
      const mockDistribution = [
        { type: 'album', count: 30, ratio: 0.6 },
        { type: 'single', count: 20, ratio: 0.4 }
      ];

      mockQuery.mockResolvedValue({
        rows: mockDistribution
      });

      const result = await AlbumService.getTypeDistributionFromSearch({});
      expect(result).toEqual(mockDistribution);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(AlbumService.getTypeDistributionFromSearch({})).rejects.toThrow(error);
    });
  });
});