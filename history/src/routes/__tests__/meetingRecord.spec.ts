import { StatusCodes } from 'http-status-codes';
import ApiServer from 'server';
import request from 'supertest';
import { Difficulty, Language } from 'types/crud/enums';
import { Fixtures, loadFixtures } from 'utils/fixtures';
import {
  convertDatesToJson,
  createTestMeetingRecord,
  createTestUser,
  mockTestMeetingRecord,
} from 'utils/tests';

import prisma from 'lib/prisma';

let server: ApiServer;
let fixtures: Fixtures;

beforeAll(async () => {
  server = new ApiServer();
  await server.initialize();
  fixtures = await loadFixtures();
});

afterAll(async () => {
  await fixtures.tearDown();
  await server.close();
});

describe('POST /meeting', () => {
  let interviewerId: string;
  let intervieweeId: string;
  let duration: number;
  let questionId: string;
  let questionDifficulty: Difficulty;
  let language: Language;
  let codeWritten: string;
  let isSolved: boolean;
  let feedbackToInterviewee: string;

  beforeAll(async () => {
    await fixtures.reload();
  });

  beforeEach(() => {
    const mockMeetingRecordData = mockTestMeetingRecord(
      fixtures.userOne.id,
      fixtures.userTwo.id,
    );
    intervieweeId = mockMeetingRecordData.intervieweeId;
    interviewerId = mockMeetingRecordData.interviewerId as string;
    duration = mockMeetingRecordData.duration;
    questionId = mockMeetingRecordData.questionId;
    questionDifficulty = mockMeetingRecordData.questionDifficulty as Difficulty;
    language = mockMeetingRecordData.language as Language;
    codeWritten = mockMeetingRecordData.codeWritten;
    isSolved = mockMeetingRecordData.isSolved;
    feedbackToInterviewee = mockMeetingRecordData.feedbackToInterviewee;
  });

  it('should create a meeting record', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.intervieweeId).toBe(intervieweeId);
    expect(response.body.interviewerId).toBe(interviewerId);
    expect(response.body.duration).toBe(duration);
    expect(response.body.questionId).toBe(questionId);
    expect(response.body.questionDifficulty).toBe(questionDifficulty);
    expect(response.body.language).toBe(language);
    expect(response.body.codeWritten).toBe(codeWritten);
    expect(response.body.isSolved).toBe(isSolved);
    expect(response.body.feedbackToInterviewee).toBe(feedbackToInterviewee);
    const createdMeetingRecord = await prisma.meetingRecord.findUnique({
      where: { id: response.body.id },
    });
    expect(createdMeetingRecord).toBeDefined();
  });

  it('should not allow missing interviewee id', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid interviewee ID!',
    );
  });

  it('should not allow missing interviewer id', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid interviewer ID!',
    );
  });

  it('should not allow missing duration', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid non-negative duration (in seconds)!',
    );
  });

  it('should not allow missing question id', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid question ID!',
    );
  });

  it('should not allow missing question difficulty', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid question difficulty!',
    );
  });

  it('should not allow missing language', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid programming language!',
    );
  });

  it('should not allow missing code written', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have valid code written!',
    );
  });

  it('should not allow missing is solved state', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have valid is solved state!',
    );
  });

  it('should not allow missing feedback to interviewee', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have valid feedback to interviewee!',
    );
  });

  it('should not allow interviewee id of non-string types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId: 123,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid interviewee ID!',
    );
  });

  it('should not allow interviewer id of non-string types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId: [12345],
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid interviewer ID!',
    );
  });

  it('should not allow duration of non-number types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration: '500',
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid non-negative duration (in seconds)!',
    );
  });

  it('should not allow question id of non-string types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId: { hello: 'world' },
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid question ID!',
    );
  });

  it('should not allow question difficulty of non-string types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty: 100,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid question difficulty!',
    );
  });

  it('should not allow language of non-string types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language: ['PYTHON'],
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid programming language!',
    );
  });

  it('should not allow code written of non-string types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten: 456,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have valid code written!',
    );
  });

  it('should not allow is solved state of non-boolean types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved: 'true',
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have valid is solved state!',
    );
  });

  it('should not allow interviewee feedback of non-string types', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee: 12346,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have valid feedback to interviewee!',
    );
  });

  it('should not allow negative durations', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration: -1,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid non-negative duration (in seconds)!',
    );
  });

  it('should not allow invalid difficulty values', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty: 'DIFFICULT',
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid question difficulty!',
    );
  });

  it('should not allow invalid programming languages', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language: 'OCAML',
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The meeting record must have a valid programming language!',
    );
  });

  it('should not allow a user to interview themselves', async () => {
    const response = await request(server.server)
      .post('/meeting')
      .set('Authorization', interviewerId)
      .send({
        intervieweeId: interviewerId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('A user cannot interview themselves!');
  });

  it('should not allow a user to create a meeting record by others', async () => {
    let response = await request(server.server)
      .post('/meeting')
      .set('Authorization', intervieweeId) // not interviewer!
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.FORBIDDEN);
    const unrelatedUser = await createTestUser();
    response = await request(server.server)
      .post('/meeting')
      .set('Authorization', unrelatedUser.id) // not interviewer!
      .send({
        intervieweeId,
        interviewerId,
        duration,
        questionId,
        questionDifficulty,
        language,
        codeWritten,
        isSolved,
        feedbackToInterviewee,
      });
    expect(response.status).toEqual(StatusCodes.FORBIDDEN);
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server).post('/meeting').send({
      intervieweeId,
      interviewerId,
      duration,
      questionId,
      questionDifficulty,
      language,
      codeWritten,
      isSolved,
      feedbackToInterviewee,
    });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server).post('/meeting').send({
      intervieweeId,
      interviewerId,
      duration,
      questionId,
      questionDifficulty,
      language,
      codeWritten,
      isSolved,
      feedbackToInterviewee,
    });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('GET /meeting', () => {
  beforeEach(async () => {
    await fixtures.reload();
  });

  it('should return a single meeting record for user with one meeting record', async () => {
    const response = await request(server.server)
      .get('/meeting')
      .set('Authorization', fixtures.userOne.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(
      convertDatesToJson([fixtures.meetingRecordTwoInterviewedOne]),
    );
  });

  it('should return empty array for user with no meeting records', async () => {
    const newUser = await createTestUser();
    const response = await request(server.server)
      .get('/meeting')
      .set('Authorization', newUser.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveLength(0);
  });

  it('should return meeting records in reverse chronological order for user with multiple meeting records', async () => {
    const newMeetingRecord = await createTestMeetingRecord({
      intervieweeId: fixtures.userOne.id,
    });
    const response = await request(server.server)
      .get('/meeting')
      .set('Authorization', fixtures.userOne.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toEqual(convertDatesToJson(newMeetingRecord));
    expect(response.body[1]).toEqual(
      convertDatesToJson(fixtures.meetingRecordTwoInterviewedOne),
    );
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server).get('/meeting').send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server)
      .get('/meeting')
      .set('Authorization', '123456')
      .send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
