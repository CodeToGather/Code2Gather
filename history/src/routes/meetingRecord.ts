import { Router } from 'express';

import * as MeetingRecordController from 'controllers/meetingRecordController';
import { convertUidToUser } from 'middlewares/convertUidToUser';

const router = Router();

router.use(convertUidToUser);
router.post('/', MeetingRecordController.createMeetingRecord);
router.get('/', MeetingRecordController.readMeetingRecordsForSelf);

export default router;
