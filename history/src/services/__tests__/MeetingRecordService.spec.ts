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

import { MeetingRecord } from '.prisma/client';

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
  let questionTitle: string;
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
      questionTitle = mockMeetingRecordData.questionTitle;
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
          questionTitle,
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
      expect(meetingRecord.questionTitle).toBe(questionTitle);
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
            questionTitle,
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
            questionTitle,
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
            questionTitle,
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
            questionTitle,
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
    beforeAll(async () => {
      await fixtures.reload();
    });

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

  describe('readPaginatedForInterviewee', () => {
    beforeAll(async () => {
      await fixtures.reload();
    });

    it('user can read their meeting records in 3s', async () => {
      const createdMeetingRecords: MeetingRecord[] = [];
      for (let i = 0; i < 4; i = i + 1) {
        createdMeetingRecords.push(
          await createTestMeetingRecord({
            intervieweeId: fixtures.userOne.id,
          }),
        );
      }
      let meetingRecords =
        await meetingRecordService.readPaginatedForInterviewee(
          fixtures.userOne.id,
          0,
          fixtures.userOne,
        );
      expect(meetingRecords.records).toHaveLength(3);
      expect(meetingRecords.isLastPage).toBe(false);
      expect(meetingRecords.records[0]).toEqual(createdMeetingRecords[3]);
      expect(meetingRecords.records[1]).toEqual(createdMeetingRecords[2]);
      expect(meetingRecords.records[2]).toEqual(createdMeetingRecords[1]);
      meetingRecords = await meetingRecordService.readPaginatedForInterviewee(
        fixtures.userOne.id,
        1,
        fixtures.userOne,
      );
      expect(meetingRecords.records).toHaveLength(2);
      expect(meetingRecords.isLastPage).toBe(true);
      expect(meetingRecords.records[0]).toEqual(createdMeetingRecords[0]);
      expect(meetingRecords.records[1]).toEqual(
        fixtures.meetingRecordTwoInterviewedOne,
      );
    });

    it("unrelated user cannot read another user's meeting records", async () => {
      await expect(
        meetingRecordService.readPaginatedForInterviewee(
          fixtures.userOne.id,
          0,
          fixtures.userTwo,
        ),
      ).rejects.toThrow(AuthorizationError);
    });

    it('handles when user has no records', async () => {
      const newUser = await createTestUser();
      const meetingRecords =
        await meetingRecordService.readPaginatedForInterviewee(
          newUser.id,
          0,
          newUser,
        );
      expect(meetingRecords.records).toHaveLength(0);
    });

    it('handles reading of page numbers > last page number', async () => {
      const meetingRecords =
        await meetingRecordService.readPaginatedForInterviewee(
          fixtures.userOne.id,
          100,
          fixtures.userOne,
        );
      expect(meetingRecords.records).toHaveLength(0);
      expect(meetingRecords.isLastPage).toBe(true);
    });
  });
});
