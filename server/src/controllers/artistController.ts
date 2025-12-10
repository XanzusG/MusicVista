import { Request, Response } from 'express';
import * as ArtistService from '../services/artistService';
import * as TrackService from '../services/trackService';
import { sendSuccess, sendError, handleControllerError } from '../utils/response';
import { on } from 'events';

/**
 * 根据查询条件搜索艺术家
 * @param {Request} req - Express请求对象，包含查询参数
 * @param {Response} res - Express响应对象
 * @throws {Error} 当查询过程中发生错误时抛出
 */
export async function searchArtists(req: Request, res: Response): Promise<void> {
  try {
    const params = {
      searchTerm: (req.query.searchTerm as string) || '',
      genreFilter: (req.query.genreFilter as string) || '',
      includeGenres: (req.query.includeGenres as string) === 'true',
      sortBy: (req.query.sortBy as 'popularity' | 'name') || 'popularity',
      sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };
    // console.log('params:', params);
    const artists = await ArtistService.getArtists(params);
    sendSuccess(res, artists);
  } catch (error: any) {
    handleControllerError(res, error, 'searchArtists');
  }
}

export async function getArtistCount(req: Request, res: Response): Promise<void> {
  try {
    const params = {
      searchTerm: (req.query.searchTerm as string) || '',
      genreFilter: (req.query.genreFilter as string) || ''
    };
    const count = await ArtistService.getArtistCount(params);
    sendSuccess(res, count);
  } catch (error: any) {
    handleControllerError(res, error, 'getArtistCount');
  }
}

export async function getArtistById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    
    // const artist = await ArtistService.getArtistById(id);
    const artist = await ArtistService.getArtists({ ids: [id] });

    if (!artist) {
      sendError(res, '艺术家不存在', 404);
      return;
    }

    sendSuccess(res, artist[0]);
  } catch (error: any) {
    handleControllerError(res, error, 'getArtistById');
  }
}

export async function getGenreCount(req: Request, res: Response): Promise<void> { 
  try {
    const count = await ArtistService.getGenreCount();
    sendSuccess(res, count);
  } catch (error: any) {
    handleControllerError(res, error, 'getGenreCount');
  }
}

export async function getTrendingArtists(req: Request, res: Response): Promise<void> {
  try {
    const params = {
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: 'popularity' as 'popularity',
        sortOrder: 'DESC' as 'DESC'
    }

    const artists = await ArtistService.getArtists(params);
    sendSuccess(res, artists);
  } catch (error: any) {
    handleControllerError(res, error, 'getTrendingArtists');
  }
}

export async function getRangeAnalytics(req: Request, res: Response): Promise<void> {
  try {
    let ids: string[] = [];
    if (req.query.ids) {
      if (Array.isArray(req.query.ids)) {
        ids = req.query.ids as string[];
      } else {
        ids = [req.query.ids as string];
      }
    }
    const params = {
      searchTerm: (req.query.searchTerm as string) || '',
      genreFilter: (req.query.genreFilter as string) || '',
      includeGenres: (req.query.includeGenres as string) === 'true',
      sortBy: (req.query.sortBy as 'popularity' | 'name') || 'popularity',
      sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
      onlyId: true,
      ids: ids,
    };
    const artists = await ArtistService.getArtists(params);
    if (!artists) {
      sendError(res, '没有找到相关艺术家', 404);
      return;
    }
    const artistIds = artists.map(artist => artist.id);
    const genreParams = { artistIds, limit: 10 };
    console.log(123);
    const genreDistribution = await ArtistService.getGenreDistribution(genreParams);
    console.log(234)
    const tracks = await TrackService.getTracks({ artistIds }) || [];
    console.log(345)
    const trackIds = tracks.map(track => track.id);
    const emotionDistribution = await TrackService.getEmotionDistribution(trackIds);
    console.log(456);
    sendSuccess(res, { total: artistIds.length, genreDistribution: genreDistribution, emotionDistribution: emotionDistribution });
  } catch (error: any) {
    handleControllerError(res, error, 'getRangeAnalytics');
  }
}

// export async function getGenreDistribution(req: Request, res: Response): Promise<void> {
//   try {
//     const params = {
//       artistIds: req.query.artistIds as string[] || [],
//       limit: req.query.limit ? parseInt(req.query.limit as string) : 10
//     };
//     const genreDistribution = await ArtistService.getGenreDistribution(params);
//     sendSuccess(res, genreDistribution);
//   } catch (error: any) {
//     handleControllerError(res, error, 'getGenreDistribution');
//   }
// }

// export async function getAllArtists(req: Request, res: Response): Promise<void> {
//   try {
//     const artists = await ArtistService.getArtists({});
//     sendSuccess(res, artists);
//   } catch (error: any) {
//     handleControllerError(res, error, 'getAllArtists');
//   }
// }

// export async function getHighFreqWords(req: Request, res: Response): Promise<void> {
//   try {
//     const { artistId } = req.params;
//     const highFreqWords = await ArtistService.getHighFreqWords(artistId);
//     sendSuccess(res, highFreqWords);
//   } catch (error: any) {
//     handleControllerError(res, error, 'getHighFreqWords');
//   }
// }

export async function getCollaborators(req: Request, res: Response): Promise<void> {
  try {
    const artistId = req.params.id;
    const collaborators = await ArtistService.getCollaborators(artistId);
    sendSuccess(res, collaborators);
  } catch (error: any) {
    handleControllerError(res, error, 'getCollaborators');
  }
}

export async function getGenreDistributionById(req: Request, res: Response): Promise<void> {
  try {
    const params = {
      artistIds: [req.params.artistId as string],
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10
    };
    const genreDistribution = await ArtistService.getGenreDistribution(params);
    sendSuccess(res, genreDistribution);
  } catch (error: any) {
    handleControllerError(res, error, 'getGenreDistribution');
  }
}