import { MeetingRecord } from '../crud/meetingRecord';

export interface MeetingRecordResponse {
  records: MeetingRecord[];
  isLastPage: boolean;
}
