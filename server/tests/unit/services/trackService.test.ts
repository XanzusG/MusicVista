import * as TrackService from '../../../src/services/trackService';

// Mock the database connection
jest.mock('../../../src/database/connection', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('TrackService', () => {
  let mockQuery: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const pool = require('../../../src/database/connection').default;
    mockQuery = pool.query;
  });

  describe('getTracks', () => {
    it('should return tracks when search is successful', async () => {
      const mockTracks = [
        {
          id: '1',
          name: 'Test Track',
          album_id: 'album1',
          album_name: 'Test Album',
          artist_ids: ['artist1'],
          artist_names: ['Artist One'],
          energy: 0.8,
          valence: 0.6,
          duration_ms: 180000
        }
      ];

      mockQuery.mockResolvedValue({
        rows: mockTracks
      });

      const result = await TrackService.getTracks({
        searchTerm: 'Test',
        limit: 10,
        offset: 0
      });

      expect(result).toEqual(mockTracks);
      expect(mockQuery).toHaveBeenCalled();
    });

    it('should return null when no tracks found', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await TrackService.getTracks({});
      expect(result).toBeNull();
    });

    it('should handle emotion filter', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      await TrackService.getTracks({
        emotionFilter: 'Euphoric'
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("energy BETWEEN"),
        expect.any(Array)
      );
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(TrackService.getTracks({})).rejects.toThrow('Error fetching tracks');
    });
  });

  describe('getTrackCount', () => {
    it('should return track count', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ count: 42 }]
      });

      const result = await TrackService.getTrackCount({});
      expect(result).toBe(42);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(TrackService.getTrackCount({})).rejects.toThrow('Error fetching track count');
    });
  });

  describe('getLyricsByTrackId', () => {
    it('should return lyrics when found', async () => {
      const mockLyrics = 'Test lyrics content';
      mockQuery.mockResolvedValue({
        rows: [{ lyrics: mockLyrics }]
      });

      const result = await TrackService.getLyricsByTrackId('track1');
      expect(result).toBe(mockLyrics);
    });

    it('should return null when no lyrics found', async () => {
      mockQuery.mockResolvedValue({
        rows: []
      });

      const result = await TrackService.getLyricsByTrackId('track1');
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(TrackService.getLyricsByTrackId('track1')).rejects.toThrow('Error fetching lyrics');
    });
  });

  describe('getSimilarTracks', () => {
    it('should return similar tracks', async () => {
      const mockSimilarTracks = [
        { id: '2', name: 'Similar Track', similarity: 0.9 }
      ];

      mockQuery.mockResolvedValue({
        rows: mockSimilarTracks
      });

      const result = await TrackService.getSimilarTracks({
        trackId: 'track1',
        limit: 3
      });

      expect(result).toEqual(mockSimilarTracks);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(TrackService.getSimilarTracks({ trackId: 'track1' })).rejects.toThrow('Error fetching similar tracks');
    });
  });

  describe('getTracksByAlbum', () => {
    it('should return tracks by album', async () => {
      const mockTracks = [
        { id: '1', name: 'Track 1', album_id: 'album1' },
        { id: '2', name: 'Track 2', album_id: 'album1' }
      ];

      mockQuery.mockResolvedValue({
        rows: mockTracks
      });

      const result = await TrackService.getTracksByAlbum('album1');
      expect(result).toEqual(mockTracks);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);
      await expect(TrackService.getTracksByAlbum('album1')).rejects.toThrow('Error fetching tracks by album');
    });
  });

  describe('EmotionParams', () => {
    it('should return correct parameters for Frantic emotion', async () => {
      const result = await TrackService.EmotionParams('Frantic');
      expect(result).toEqual({
        minEnergy: 0.666,
        maxEnergy: 1,
        minValence: 0,
        maxValence: 0.333
      });
    });

    it('should return default parameters for unknown emotion', async () => {
      const result = await TrackService.EmotionParams('Unknown');
      expect(result).toEqual({
        minEnergy: 0,
        maxEnergy: 1,
        minValence: 0,
        maxValence: 1
      });
    });
  });
});