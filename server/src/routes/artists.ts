import { Router } from 'express';
import * as artistController from '../controllers/artistController';
import * as albumController from '../controllers/albumController';
import * as trackController from '../controllers/trackController';

const router = Router();

/**
 * 艺术家路由
 * 所有路由都映射到 /api/artists
 */

// GET /api/artists - 获取艺术家列表
// router.get('/', artistController.getAllArtists);

// GET /api/artists/trending - 获取热门艺术家
router.get('/trending', artistController.getTrendingArtists);

// GET /api/artists/search - 搜索艺术家
router.get('/search', artistController.searchArtists);

router.get('/count', artistController.getArtistCount);

// GET /api/artists/genre/:genreName - 根据流派获取艺术家
// router.get('/genre/:genreName', artistController.getArtistsByGenre);

// GET /api/artists/genre-distribution - 获取艺术家流派分布
// router.get('/analytics/genre', artistController.getGenreDistribution);

router.get('/analytics', artistController.getRangeAnalytics);

// GET /api/artists/:id - 获取艺术家详情
router.get('/:id', artistController.getArtistById);

router.get('/:id/collaborators', artistController.getCollaborators);

router.get('/:id/tracks', trackController.getTracksByArtist);
router.get('/:id/tracks/count', trackController.getTrackCountByArtist);

router.get('/:id/albums', albumController.getAlbumsByArtist);
router.get('/:id/albums/count', albumController.getAlbumCountByArtist);

router.get('/genres/count', artistController.getGenreCount);

export default router;
