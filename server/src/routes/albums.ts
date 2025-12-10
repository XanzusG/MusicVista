import { Router } from 'express';
import * as albumController from '../controllers/albumController';
import * as trackController from '../controllers/trackController';

const router = Router();

/**
 * 专辑路由
 * 所有路由都映射到 /api/albums
 */

// GET /api/albums - 获取专辑列表
router.get('/', albumController.getAllAlbums);

// GET /api/albums/recent - 获取最新专辑
router.get('/recent', albumController.getRecentAlbums);

// GET /api/albums/search - 搜索专辑
router.get('/search', albumController.searchAlbums);

router.get('/count', albumController.getAlbumCount);

// GET /api/albums/artist/:artistId - 根据艺术家获取专辑
// router.get('/artist/:artistId', albumController.getAlbumsByArtist);

// GET /api/albums/:id - 获取专辑详情
router.get('/:id', albumController.getAlbumById);

router.get('/:id/tracks', trackController.getTracksByAlbum);

router.get('/search/type-distribution', albumController.getTypeDistributionFromSearch);

export default router;
