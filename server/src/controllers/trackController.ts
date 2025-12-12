import { Request, Response } from 'express';
import * as TrackService from '../services/trackService';
import { sendSuccess, sendError, handleControllerError } from '../utils/response';

export async function getTrackById(req: Request, res: Response): Promise<void> {
    try {
        const trackId = req.params.id;
        // const track = await TrackService.getTrackById(trackId);
        const track = await TrackService.getTracks({ids: [trackId]});
        console.log(track);
        if (track && track.length > 0) {
            sendSuccess(res, track[0], 200);
        } else {
            sendError(res, 'Track not found', 404);
        }
    } catch (error) {
        handleControllerError(res, error, 'getTrackById');
    }
}
export async function searchTracks(req: Request, res: Response): Promise<void> {
    try {
        const params = {
            searchTerm: (req.query.searchTerm as string) || '',
            emotionFilter: (req.query.emotionFilter as 'Frantic' | 'Tense' | 'Euphoric' | 'Upset' | 'Calm' | 'Cheerful' | 'Bleak' | 'Apathetic' | 'Serene' | 'All' | 'Other') || 'All',
            sortBy: (req.query.sortBy as 'release_date' | 'name' | 'duration_ms') || 'release_date',
            sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        }
        const tracks = await TrackService.getTracks(params);
        sendSuccess(res, tracks);
    } catch (error: any) {
        handleControllerError(res, error, 'searchTracks');
    }
}

export async function getTrackCount(req: Request, res: Response): Promise<void> {
  try {
    const params = {
      searchTerm: (req.query.searchTerm as string) || '',
      emotionFilter: (req.query.emotionFilter as 'Frantic' | 'Tense' | 'Euphoric' | 'Upset' | 'Calm' | 'Cheerful' | 'Bleak' | 'Apathetic' | 'Serene' | 'All' | 'Other') || 'All',
    };
    const count = await TrackService.getTrackCount(params);
    sendSuccess(res, count);
  } catch (error: any) {
    handleControllerError(res, error, 'getTrackCount');
  }
}

export async function getAllTracks(req: Request, res: Response): Promise<void> { 
  try {
    const tracks = await TrackService.getTracks({});
    sendSuccess(res, tracks);
  } catch (error: any) {
    handleControllerError(res, error, 'getAllTracks');
  }
}

export async function getSimilarTracks(req: Request, res: Response): Promise<void> { 
  try {
    const params = {
      trackId: req.params.id,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 3,
    }
    const tracks = await TrackService.getSimilarTracks(params);
    sendSuccess(res, tracks);
  } catch (error: any) {
    handleControllerError(res, error, 'getSimilarTracks');
  }
}


export async function getTrackCountByArtist(req: Request, res: Response): Promise<void> { 
  try {
    const artistId = req.params.id;
    const artistIds = [artistId];
    const count = await TrackService.getTrackCount({artistIds});
    sendSuccess(res, count);
  } catch (error: any) {
    handleControllerError(res, error, 'getTrackCountByArtists');
  }
}

export async function getTracksByArtist(req: Request, res: Response): Promise<void> { 
  try {
    const artistId = req.params.id as string;
    const artistIds = [artistId];
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    const tracks = await TrackService.getTracks({artistIds, limit, offset});
    sendSuccess(res, tracks);
  } catch (error: any) {
    handleControllerError(res, error, 'getTracksByArtist');
  }
}
export async function getTracksByAlbum(req: Request, res: Response): Promise<void> { 
  try {
    const albumId = req.params.id as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    // const tracks = await TrackService.getTracksByAlbum({albumId, limit, offset});
    const tracks = await TrackService.getTracksByAlbum(albumId);
    sendSuccess(res, tracks);
  } catch (error: any) {
    handleControllerError(res, error, 'getTracksByAlbum');
  }
}

export async function getLyricsByTrackId(req: Request, res: Response): Promise<void> { 
  try {
    const trackId = req.params.id as string;
    const lyrics = await TrackService.getLyricsByTrackId(trackId);
    sendSuccess(res, lyrics);
  } catch (error: any) {
    handleControllerError(res, error, 'getLyricsByTrackId');
  }
}