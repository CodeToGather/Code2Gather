import { Router } from 'express';

import * as LeaderboardController from 'controllers/leaderboardController';
import { convertUidToUser } from 'middlewares/convertUidToUser';

const router = Router();

router.use(convertUidToUser);
router.get('/', LeaderboardController.readLeaderboard);

export default router;
