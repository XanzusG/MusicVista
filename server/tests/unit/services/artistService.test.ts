import * as ArtistService from '../../../src/services/artistService';

// Mock the database connection
jest.mock('../../../src/database/connection', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('ArtistService', () => {
  let mockQuery: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const pool = require('../../../src/database/connection').default;
    mockQuery = pool.query;
  });

  describe('getArtists', () => {
    it('should return artists with default parameters', async () => {
      const mockArtists = [
        { id: '1', name: 'Artist 1', popularity: 85 },
        { id: '2', name: 'Artist 2', popularity: 75 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockArtists,
        rowCount: 2,
      });

      const result = await ArtistService.getArtists({});

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArtists);
    });

    it('should handle search term filtering', async () => {
      const mockArtists = [
        { id: '1', name: 'Test Artist', popularity: 85 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockArtists,
        rowCount: 1,
      });

      const result = await ArtistService.getArtists({
        searchTerm: 'Test',
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArtists);
    });

    it('should handle genre filtering', async () => {
      const mockArtists = [
        { id: '1', name: 'Rock Artist', popularity: 85 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockArtists,
        rowCount: 1,
      });

      const result = await ArtistService.getArtists({
        genreFilter: 'rock',
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('genre'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArtists);
    });

    it('should handle pagination', async () => {
      const mockArtists = [
        { id: '1', name: 'Artist 1', popularity: 85 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockArtists,
        rowCount: 1,
      });

      const result = await ArtistService.getArtists({
        limit: 10,
        offset: 20,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArtists);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockQuery.mockRejectedValue(error);

      await expect(ArtistService.getArtists({})).rejects.toThrow(error);
    });
  });

  describe('getArtistCount', () => {
    it('should return artist count', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ artist_cnt: 10 }],
        rowCount: 1,
      });

      const result = await ArtistService.getArtistCount({});

      expect(result).toBe(10);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        expect.any(Array)
      );
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);

      await expect(ArtistService.getArtistCount({})).rejects.toThrow(error);
    });
  });

  describe('getGenreCount', () => {
    it('should return genre count', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ genre_cnt: 5 }],
        rowCount: 1,
      });

      const result = await ArtistService.getGenreCount();

      expect(result).toBe(5);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        []
      );
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);

      await expect(ArtistService.getGenreCount()).rejects.toThrow(error);
    });
  });
});