import { Authorization } from 'types/authorization';
import { MeetingRecordCreateData } from 'types/crud/meetingRecord';

import { BasePolicy } from '../BasePolicy';

import { MeetingRecord, User } from '.prisma/client';

// Checks that the user is the owner of the post before
// allowing for mutations to said post.
export class AllowIfUserIsIntervieweePolicy extends BasePolicy<
  MeetingRecord | MeetingRecordCreateData
> {
  public async validate(
    item: MeetingRecord | MeetingRecordCreateData,
    user: User
  ): Promise<Authorization> {
    if (item.intervieweeId === user.id) {
      return Authorization.ALLOW;
    }
    return Authorization.SKIP;
  }
}
