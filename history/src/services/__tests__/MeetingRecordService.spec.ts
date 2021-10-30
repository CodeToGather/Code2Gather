import prisma from 'lib/prisma';
import meetingRecordService from 'services/MeetingRecordService';
import { Difficulty, Language } from 'types/crud/enums';
import { AuthorizationError, InvalidDataError } from 'types/error';
import { Fixtures, loadFixtures } from 'utils/fixtures';
import {
  createTestMeetingRecord,
  createTestUser,
  mockTestMeetingRecord,
} from 'utils/tests';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixtures();
});

afterAll(async () => {
  await fixtures.tearDown();
});

describe('MeetingRecordService', () => {
  let duration: number;
  let questionId: string;
  let questionDifficulty: Difficulty;
  let language: Language;
  let codeWritten: string;
  let isSolved: boolean;
  let feedbackToInterviewee: string;

  describe('create', () => {
    beforeEach(async () => {
      await fixtures.reload();
      const mockMeetingRecordData = mockTestMeetingRecord(
        fixtures.userOne.id,
        fixtures.userTwo.id,
      );
      duration = mockMeetingRecordData.duration;
      questionId = mockMeetingRecordData.questionId;
      questionDifficulty =
        mockMeetingRecordData.questionDifficulty as Difficulty;
      language = mockMeetingRecordData.language as Language;
      codeWritten = mockMeetingRecordData.codeWritten;
      isSolved = mockMeetingRecordData.isSolved;
      feedbackToInterviewee = mockMeetingRecordData.feedbackToInterviewee;
    });

    it('creates a meeting record', async () => {
      const meetingRecord = await meetingRecordService.create(
        {
          interviewerId: fixtures.userOne.id,
          intervieweeId: fixtures.userTwo.id,
          duration,
          questionId,
          questionDifficulty,
          language,
          codeWritten,
          isSolved,
          feedbackToInterviewee,
        },
        fixtures.userOne,
      );
      expect(meetingRecord.interviewerId).toBe(fixtures.userOne.id);
      expect(meetingRecord.intervieweeId).toBe(fixtures.userTwo.id);
      expect(meetingRecord.duration).toBe(duration);
      expect(meetingRecord.questionId).toBe(questionId);
      expect(meetingRecord.questionDifficulty).toBe(questionDifficulty);
      expect(meetingRecord.language).toBe(language);
      expect(meetingRecord.codeWritten).toBe(codeWritten);
      expect(meetingRecord.isSolved).toBe(isSolved);
      expect(meetingRecord.feedbackToInterviewee).toBe(feedbackToInterviewee);
      expect(
        await prisma.meetingRecord.findUnique({
          where: { id: meetingRecord.id },
        }),
      ).toBeTruthy();
    });

    it('checks for duration value', async () => {
      await expect(
        meetingRecordService.create(
          {
            interviewerId: fixtures.userOne.id,
            intervieweeId: fixtures.userTwo.id,
            duration: -1,
            questionId,
            questionDifficulty,
            language,
            codeWritten,
            isSolved,
            feedbackToInterviewee,
          },
          fixtures.userOne,
        ),
      ).rejects.toThrow(InvalidDataError);
    });

    it('checks for self-interviews', async () => {
      await expect(
        meetingRecordService.create(
          {
            interviewerId: fixtures.userOne.id,
            intervieweeId: fixtures.userOne.id,
            duration,
            questionId,
            questionDifficulty,
            language,
            codeWritten,
            isSolved,
            feedbackToInterviewee,
          },
          fixtures.userOne,
        ),
      ).rejects.toThrow(InvalidDataError);
    });

    it('prevents non-interviewers from creating meeting records', async () => {
      const unrelatedUser = await createTestUser();
      await expect(
        meetingRecordService.create(
          {
            interviewerId: fixtures.userOne.id,
            intervieweeId: fixtures.userTwo.id,
            duration,
            questionId,
            questionDifficulty,
            language,
            codeWritten,
            isSolved,
            feedbackToInterviewee,
          },
          fixtures.userTwo,
        ),
      ).rejects.toThrow(AuthorizationError);
      await expect(
        meetingRecordService.create(
          {
            interviewerId: fixtures.userOne.id,
            intervieweeId: fixtures.userTwo.id,
            duration,
            questionId,
            questionDifficulty,
            language,
            codeWritten,
            isSolved,
            feedbackToInterviewee,
          },
          unrelatedUser,
        ),
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe('readAllForInterviewee', () => {
    it('user can read their meeting records', async () => {
      const meetingRecords = await meetingRecordService.readAllForInterviewee(
        fixtures.userOne.id,
        fixtures.userOne,
      );
      expect(meetingRecords).toHaveLength(1);
      expect(meetingRecords[0]).toEqual(
        fixtures.meetingRecordTwoInterviewedOne,
      );
    });

    it("unrelated user cannot read another user's meeting records", async () => {
      await expect(
        meetingRecordService.readAllForInterviewee(
          fixtures.userOne.id,
          fixtures.userTwo,
        ),
      ).rejects.toThrow(AuthorizationError);
    });

    it('handles when user has no records', async () => {
      const newUser = await createTestUser();
      const meetingRecords = await meetingRecordService.readAllForInterviewee(
        newUser.id,
        newUser,
      );
      expect(meetingRecords).toHaveLength(0);
    });

    it('returns meeting records in reverse chronological order', async () => {
      const newMeetingRecord = await createTestMeetingRecord({
        intervieweeId: fixtures.userOne.id,
      });
      const meetingRecords = await meetingRecordService.readAllForInterviewee(
        fixtures.userOne.id,
        fixtures.userOne,
      );
      expect(meetingRecords).toHaveLength(2);
      expect(meetingRecords[0]).toEqual(newMeetingRecord);
      expect(meetingRecords[1]).toEqual(
        fixtures.meetingRecordTwoInterviewedOne,
      );
    });
  });
});
