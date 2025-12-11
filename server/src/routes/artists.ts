import { Router } from 'express';
import * as artistController from '../controllers/artistController';
import * as albumController from '../controllers/albumController';
import * as trackController from '../controllers/trackController';

const router = Router();

/**
 * Artist routes
 * All routes are mapped to /api/artists
 */

// GET /api/artists - Get artist list
// router.get('/', artistController.getAllArtists);

// GET /api/artists/trending - Get trending artists
router.get('/trending', artistController.getTrendingArtists);

// GET /api/artists/search - Search artists
router.get('/search', artistController.searchArtists);

router.get('/count', artistController.getArtistCount);

// GET /api/artists/genre/:genreName - Get artists by genre
// router.get('/genre/:genreName', artistController.getArtistsByGenre);

// GET /api/artists/genre-distribution - Get artist genre distribution
// router.get('/analytics/genre', artistController.getGenreDistribution);

router.get('/analytics', artistController.getRangeAnalytics);

// GET /api/artists/:id - Get artist details
router.get('/:id', artistController.getArtistById);

router.get('/:id/collaborators', artistController.getCollaborators);

router.get('/:id/tracks', trackController.getTracksByArtist);
router.get('/:id/tracks/count', trackController.getTrackCountByArtist);

router.get('/:id/albums', albumController.getAlbumsByArtist);
router.get('/:id/albums/count', albumController.getAlbumCountByArtist);

router.get('/genres/count', artistController.getGenreCount);

export default router;
