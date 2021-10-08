import { Router } from 'express';

import leaderboard from './leaderboard';
import meetingRecord from './meetingRecord';
import rating from './rating';
import user from './user';

const routes = Router();

routes.use('/user', user);
routes.use('/rating', rating);
routes.use('/meeting', meetingRecord);
routes.use('/leaderboard', leaderboard);

export default routes;
