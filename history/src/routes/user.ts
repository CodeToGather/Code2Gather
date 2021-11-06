import { Router } from 'express';

import * as UserController from 'controllers/userController';
import { convertUidToUser } from 'middlewares/convertUidToUser';

const router = Router();

router.post('/', UserController.createUser);
router.get('/', UserController.readUser);
router.use(convertUidToUser);
router.get('/self', UserController.readSelf);
router.put('/', UserController.updateSelf);
router.delete('/', UserController.deleteSelf);

export default router;
