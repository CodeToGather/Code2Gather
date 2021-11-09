import { MeetingRecordResponse } from 'types/api/meetingRecord';
import { MeetingRecord } from 'types/crud/meetingRecord';

import BaseApi from './baseApi';

class MeetingRecordApi extends BaseApi {
  async getMeetingRecords(
    page: number,
  ): Promise<{ records: MeetingRecord[]; isLastPage: boolean }> {
    return this.get(
      `history/meeting/${page}`,
      (res: MeetingRecordResponse) => res,
    );
  }
}

export default new MeetingRecordApi();
