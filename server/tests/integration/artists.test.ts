import request from 'supertest';
import express from 'express';
import artistRoutes from '../../src/routes/artists';
import * as ArtistService from '../../src/services/artistService';

// Mock the service
jest.mock('../../src/services/artistService');
const mockArtistService = ArtistService as jest.Mocked<typeof ArtistService>;

const app = express();
app.use(express.json());
app.use('/api/artists', artistRoutes);

describe('Artists API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/artists', () => {
    it('should return a list of artists', async () => {
      const mockArtists = [
        { id: '1', name: 'Artist 1', popularity: 85 },
        { id: '2', name: 'Artist 2', popularity: 75 },
      ];

      mockArtistService.getArtists.mockResolvedValue(mockArtists);

      const response = await request(app)
        .get('/api/artists')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockArtists,
        timestamp: expect.any(String),
      });
      expect(mockArtistService.getArtists).toHaveBeenCalledWith({});
    });

    it('should handle query parameters', async () => {
      const mockArtists = [{ id: '1', name: 'Test Artist' }];
      
      mockArtistService.getArtists.mockResolvedValue(mockArtists);

      await request(app)
        .get('/api/artists?search=test&limit=10&genre=rock')
        .expect(200);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({
        searchTerm: 'test',
        limit: 10,
        offset: undefined,
        genreFilter: 'rock',
        sortBy: undefined,
        sortOrder: undefined,
        includeGenres: undefined,
        onlyId: undefined,
        includeImages: undefined,
        ids: undefined,
      });
    });

    it('should handle service errors', async () => {
      mockArtistService.getArtists.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/artists')
        .expect(500);

      expect(response.body).toEqual({
        success: false,
        error: 'Database error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('GET /api/artists/:id', () => {
    it('should return an artist by ID', async () => {
      const mockArtist = { id: '1', name: 'Test Artist', popularity: 85 };

      mockArtistService.getArtists.mockResolvedValue([mockArtist]);

      const response = await request(app)
        .get('/api/artists/1')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: mockArtist,
        timestamp: expect.any(String),
      });
      expect(mockArtistService.getArtists).toHaveBeenCalledWith({ ids: ['1'] });
    });

    it('should return 404 for non-existent artist', async () => {
      mockArtistService.getArtists.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/artists/999')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: '艺术家不存在',
        timestamp: expect.any(String),
      });
    });
  });
});