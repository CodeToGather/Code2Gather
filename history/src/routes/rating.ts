import { Router } from 'express';

import * as RatingController from 'controllers/ratingController';
import { convertUidToUser } from 'middlewares/convertUidToUser';

const router = Router();

router.use(convertUidToUser);
router.post('/', RatingController.createRating);
router.get('/', RatingController.readAverageRatingForSelf);

export default router;
