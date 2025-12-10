import { Request, Response } from 'express';
import * as InsightService from '../services/insightService';
import { sendSuccess, sendError, handleControllerError } from '../utils/response';

export async function getLoveDistribution(req: Request, res: Response): Promise<void> {
    try {
        const loveDistribution = await InsightService.getLoveDistribution();
        sendSuccess(res, loveDistribution, 200);
    } catch (error) {
        handleControllerError(res, error, 'getLoveDistribution');
    }
}

export async function getPopWords(req: Request, res: Response): Promise<void> {
    try {
        const popWords = await InsightService.getPopWords();
        sendSuccess(res, popWords, 200);
    } catch (error) {
        handleControllerError(res, error, 'getPopWords');
    }
}

export async function getArtistPopularityGrowth(req: Request, res: Response): Promise<void> {
    try {
        const artistGrowth = await InsightService.getArtistPopularityGrowth();
        sendSuccess(res, artistGrowth, 200);
    } catch (error) {
        handleControllerError(res, error, 'getArtistPopularityGrowth');
    }
}

export async function getArtistEmotionVariety(req: Request, res: Response): Promise<void> {
    try {
        const artistVariety = await InsightService.getArtistEmotionVariety();
        sendSuccess(res, artistVariety, 200);
    } catch (error) {
        handleControllerError(res, error, 'getArtistEmotionVariety');
    }
}