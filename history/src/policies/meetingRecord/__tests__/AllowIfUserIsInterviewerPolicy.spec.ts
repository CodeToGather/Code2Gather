import { Authorization } from 'types/authorization';
import { Difficulty, Language } from 'types/crud/enums';
import { MeetingRecordCreateData } from 'types/crud/meetingRecord';
import { mockTestMeetingRecord, mockTestUser } from 'utils/tests';

import { AllowIfUserIsInterviewerPolicy } from '../AllowIfUserIsInterviewerPolicy';

import { MeetingRecord, User } from '.prisma/client';

let interviewer: User;
let interviewee: User;
let unrelatedUser: User;
let meetingRecord: MeetingRecord;
let meetingRecordCreateData: MeetingRecordCreateData;

beforeAll(() => {
  interviewer = mockTestUser();
  interviewee = mockTestUser();
  meetingRecord = mockTestMeetingRecord(interviewer.id, interviewee.id);
  unrelatedUser = mockTestUser();
  meetingRecordCreateData = {
    interviewerId: interviewer.id,
    intervieweeId: interviewee.id,
    duration: 5,
    questionId: 'question',
    questionTitle: 'Hello',
    questionDifficulty: Difficulty.EASY,
    language: Language.JAVA,
    codeWritten: '',
    isSolved: true,
    feedbackToInterviewee: '',
  };
});

describe('AllowIfUserIsInterviewerPolicy', () => {
  it('allows if user is interviewer', async () => {
    const policy = new AllowIfUserIsInterviewerPolicy();
    const resultOne = await policy.validate(meetingRecord, interviewer);
    const resultTwo = await policy.validate(
      meetingRecordCreateData,
      interviewer,
    );
    expect(resultOne).toBe(Authorization.ALLOW);
    expect(resultTwo).toBe(Authorization.ALLOW);
  });

  it('skips if user is interviewee', async () => {
    const policy = new AllowIfUserIsInterviewerPolicy();
    const resultOne = await policy.validate(meetingRecord, interviewee);
    const resultTwo = await policy.validate(
      meetingRecordCreateData,
      interviewee,
    );
    expect(resultOne).toBe(Authorization.SKIP);
    expect(resultTwo).toBe(Authorization.SKIP);
  });

  it('skips if user is unrelated', async () => {
    const policy = new AllowIfUserIsInterviewerPolicy();
    const resultOne = await policy.validate(meetingRecord, unrelatedUser);
    const resultTwo = await policy.validate(
      meetingRecordCreateData,
      unrelatedUser,
    );
    expect(resultOne).toBe(Authorization.SKIP);
    expect(resultTwo).toBe(Authorization.SKIP);
  });
});
