import e, { Request, Response } from 'express';
import * as AlbumService from '../services/albumService';
import { sendSuccess, sendError, handleControllerError } from '../utils/response';
import { get } from 'http';

export async function getAlbumById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const album = await AlbumService.getAlbumById(id);
        if (!album) {
            sendError(res, 'Album does not exist', 404);
            return;
        }
        sendSuccess(res, album);
    } catch (error: any) {
        handleControllerError(res, error, 'getAlbumById');
    }
}

export async function getAllAlbums(req: Request, res: Response): Promise<void> {
    try {
        const albums = await AlbumService.getAlbums({});
        sendSuccess(res, albums);
    } catch (error: any) {
        handleControllerError(res, error, 'getAllAlbums');
    }
}

export async function searchAlbums(req: Request, res: Response): Promise<void> { 
    try {
        const params = {
            searchTerm: (req.query.searchTerm as string) || '',
            typeFilter: (req.query.typeFilter as 'single' | 'album' | 'compilation' | 'all') || 'all',
            sortBy: (req.query.sortBy as 'popularity' | 'name' | 'release_date') || 'popularity',
            sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
        }
        const albums = await AlbumService.getAlbums(params);
        sendSuccess(res, albums);
    } catch (error: any) {
        handleControllerError(res, error, 'searchAlbums');
    }
}

export async function getAlbumsByArtist(req: Request, res: Response): Promise<void> { 
    try {
        const artistId = req.params.id;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
        // const albums = await AlbumService.getAlbumsByArtist(artistId);
        const albums = await AlbumService.getAlbums({ artistIds: [artistId], limit, offset });
        sendSuccess(res, albums);
    } catch (error: any) {
        handleControllerError(res, error, 'getAlbumsByArtist');
    }
}

export async function getRecentAlbums(req: Request, res: Response): Promise<void> { 
    try {
        const params = {
            sortBy: 'release_date' as 'release_date',
            sortOrder: 'DESC' as 'DESC',
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        }
        const albums = await AlbumService.getAlbums(params);
        sendSuccess(res, albums);
    } catch (error: any) {
        handleControllerError(res, error, 'getRecentAlbums');
    }
}

export async function getAlbumCount(req: Request, res: Response): Promise<void> { 
    try {
        const params = {
            searchTerm: (req.query.searchTerm as string) || '',
            typeFilter: (req.query.typeFilter as 'single' | 'album' | 'compilation' | 'all') || 'all',
        }
        const count = await AlbumService.getAlbumCount(params);
        sendSuccess(res, count);
    } catch (error: any) {
        handleControllerError(res, error, 'getAlbumCount');
    }
}

export async function getAlbumCountByArtist(req: Request, res: Response): Promise<void> { 
    try {
        const artistId = req.params.id;
        const count = await AlbumService.getAlbumCount({ artistIds: [artistId] });
        sendSuccess(res, count);
    } catch (error: any) {
        handleControllerError(res, error, 'getAlbumCountByArtist');
    }
}

export async function getTypeDistributionFromSearch(req: Request, res: Response): Promise<void> { 
    try {
        const params = {
            searchTerm: (req.query.searchTerm as string) || '',
            typeFilter: (req.query.typeFilter as 'single' | 'album' | 'compilation' | 'all') || 'all',
        }
        const distribution = await AlbumService.getTypeDistributionFromSearch(params);
        sendSuccess(res, distribution);
    } catch (error: any) {
        handleControllerError(res, error, 'getTypeDistributionFromSearch');
    }
}