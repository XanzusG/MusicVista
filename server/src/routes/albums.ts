import { Router } from 'express';
import * as albumController from '../controllers/albumController';
import * as trackController from '../controllers/trackController';

const router = Router();

/**
 * Album routes
 * All routes are mapped to /api/albums
 */

// GET /api/albums - Get album list
router.get('/', albumController.getAllAlbums);

// GET /api/albums/recent - Get recent albums
router.get('/recent', albumController.getRecentAlbums);

// GET /api/albums/search - Search albums
router.get('/search', albumController.searchAlbums);

router.get('/search/type-distribution', albumController.getTypeDistributionFromSearch);

router.get('/count', albumController.getAlbumCount);

// GET /api/albums/artist/:artistId - Get albums by artist
// router.get('/artist/:artistId', albumController.getAlbumsByArtist);

// GET /api/albums/:id - Get album details
router.get('/:id', albumController.getAlbumById);

router.get('/:id/tracks', trackController.getTracksByAlbum);


export default router;
