import { Router } from 'express';
import * as trackController from '../controllers/trackController';

const router = Router();

/**
 * 歌曲路由
 * 所有路由都映射到 /api/tracks
 */

// GET /api/tracks - 获取歌曲列表
router.get('/', trackController.getAllTracks);

// // GET /api/tracks/trending - 获取热门歌曲
// router.get('/trending', trackController.getTrendingTracks);

// // GET /api/tracks/search - 搜索歌曲
router.get('/search', trackController.searchTracks);

router.get('/count', trackController.getTrackCount);

// // GET /api/tracks/album/:albumId - 根据专辑获取歌曲
// router.get('/album/:albumId', trackController.getTracksByAlbum);

// // GET /api/tracks/artist/:artistId - 根据艺术家获取歌曲
// router.get('/artist/:artistId', trackController.getTracksByArtist);

// // GET /api/tracks/:id - 获取歌曲详情
router.get('/:id', trackController.getTrackById);

router.get('/:id/lyrics', trackController.getLyricsByTrackId);

router.get('/:id/similar', trackController.getSimilarTracks);

router.get('/artist/:id', trackController.getTracksByArtist);


export default router;
