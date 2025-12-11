import { Router } from 'express';
import * as trackController from '../controllers/trackController';

const router = Router();

/**
 * Track routes
 * All routes are mapped to /api/tracks
 */

// GET /api/tracks - Get track list
router.get('/', trackController.getAllTracks);

// // GET /api/tracks/trending - Get trending tracks
// router.get('/trending', trackController.getTrendingTracks);

// // GET /api/tracks/search - Search tracks
router.get('/search', trackController.searchTracks);

router.get('/count', trackController.getTrackCount);

// // GET /api/tracks/album/:albumId - Get tracks by album
// router.get('/album/:albumId', trackController.getTracksByAlbum);

// // GET /api/tracks/artist/:artistId - Get tracks by artist
// router.get('/artist/:artistId', trackController.getTracksByArtist);

// // GET /api/tracks/:id - Get track details
router.get('/:id', trackController.getTrackById);

router.get('/:id/lyrics', trackController.getLyricsByTrackId);

router.get('/:id/similar', trackController.getSimilarTracks);

router.get('/artist/:id', trackController.getTracksByArtist);


export default router;
