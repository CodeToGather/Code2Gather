import { MeetingRecordResponse } from 'types/api/meetingRecord';
import { MeetingRecord } from 'types/crud/meetingRecord';

import BaseApi from './baseApi';

class MeetingRecordApi extends BaseApi {
  async getMeetingRecords(): Promise<MeetingRecord[]> {
    return this.get('history/meeting', (res: MeetingRecordResponse) => res);
  }
}

export default new MeetingRecordApi();
