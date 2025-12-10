import { Router } from 'express';
import * as insightController from '../controllers/insightController';

const router = Router();

router.get('/love-distribution', insightController.getLoveDistribution);

router.get('/pop-words', insightController.getPopWords);

router.get('/artist-popularity-growth', insightController.getArtistPopularityGrowth);

router.get('/artist-emotion-variety', insightController.getArtistEmotionVariety);

export default router;