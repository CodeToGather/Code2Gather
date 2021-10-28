import faker from 'faker';
import { Difficulty, Language } from 'types/crud/enums';
import { MeetingRecordCreateData } from 'types/crud/meetingRecord';
import { RatingCreateData } from 'types/crud/rating';
import { UserCreateData } from 'types/crud/user';

import prisma from 'lib/prisma';

import { MeetingRecord, Rating, User } from '.prisma/client';

const checkTestEnv = (): void => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('You can only run this in a test environment.');
  }
};

export const convertDatesToJson = (object: any): any => {
  if (object == null) {
    return object;
  }
  if (Array.isArray(object)) {
    return object.map((obj) => convertDatesToJson(obj));
  }
  if (typeof object !== 'object') {
    return object;
  }
  if (object instanceof Date) {
    return object.toJSON();
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(object)) {
    result[key] = convertDatesToJson(value);
  }
  return result;
};

// Resets the database.
// Can only be called in test environment.
export const resetDatabase = async (): Promise<void> => {
  checkTestEnv();
  await prisma.user.deleteMany({});
  await prisma.rating.deleteMany({});
  await prisma.meetingRecord.deleteMany({});
};

// Creates a test user and persists it into the database.
// Can only be called in test environment.
export const createTestUser = async (
  data?: Partial<UserCreateData>,
): Promise<User> => {
  checkTestEnv();
  return await prisma.user.create({
    data: {
      id: data?.id ?? faker.random.alphaNumeric(20),
      githubUsername: data?.githubUsername ?? faker.random.alphaNumeric(20),
    },
  });
};

// Returns a user object that is not persisted into the database.
// Can only be called in test environment.
export const mockTestUser = (data?: Partial<UserCreateData>): User => {
  checkTestEnv();
  return {
    id: data?.id ?? faker.random.alphaNumeric(20),
    createdAt: new Date(),
    updatedAt: new Date(),
    githubUsername: data?.githubUsername ?? faker.random.alphaNumeric(20),
  };
};

// Creates a test rating and persists it into the database.
// Can only be called in test environment.
export const createTestRating = async (
  data: Partial<RatingCreateData>,
): Promise<Rating> => {
  checkTestEnv();
  return await prisma.rating.create({
    data: {
      ratingUserId: data.ratingUserId ?? (await createTestUser()).id,
      ratedUserId: data.ratedUserId ?? (await createTestUser()).id,
      rating: data.rating ?? faker.datatype.number({ min: 1, max: 5 }),
    },
  });
};

// Returns a rating object that is not persisted into the database.
// Can only be called in test environment.
export const mockTestRating = (
  ratingUserId: string,
  ratedUserId: string,
  data?: Partial<Omit<Omit<RatingCreateData, 'ratingUserId'>, 'ratedUserId'>>,
): Rating => {
  checkTestEnv();
  return {
    id: faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ratingUserId,
    ratedUserId,
    rating: data?.rating ?? faker.datatype.number({ min: 1, max: 5 }),
  };
};

// Creates a test meeting record and persists it into the database.
// Can only be called in test environment.
export const createTestMeetingRecord = async (
  data: Partial<MeetingRecordCreateData>,
): Promise<MeetingRecord> => {
  checkTestEnv();
  return await prisma.meetingRecord.create({
    data: {
      interviewerId: data.interviewerId ?? (await createTestUser()).id,
      intervieweeId: data.intervieweeId ?? (await createTestUser()).id,
      duration: data.duration ?? faker.datatype.float(),
      questionId: data.questionId ?? faker.random.alpha(),
      questionDifficulty:
        data.questionDifficulty ??
        faker.random.arrayElement(Object.values(Difficulty)),
      language:
        data.language ?? faker.random.arrayElement(Object.values(Language)),
      codeWritten: data.codeWritten ?? faker.random.alphaNumeric(),
      isSolved: data.isSolved ?? faker.datatype.boolean(),
      feedbackToInterviewee:
        data.feedbackToInterviewee ?? faker.lorem.paragraph(),
    },
  });
};

export const mockTestMeetingRecord = (
  interviewerId: string,
  intervieweeId: string,
  data?: Partial<
    Omit<Omit<MeetingRecordCreateData, 'interviewerId'>, 'intervieweeId'>
  >,
): MeetingRecord => {
  checkTestEnv();
  return {
    id: faker.datatype.number(),
    createdAt: new Date(),
    updatedAt: new Date(),
    interviewerId,
    intervieweeId,
    duration: data?.duration ?? faker.datatype.float(),
    questionId: data?.questionId ?? faker.random.alpha(),
    questionDifficulty:
      data?.questionDifficulty ??
      faker.random.arrayElement(Object.values(Difficulty)),
    language:
      data?.language ?? faker.random.arrayElement(Object.values(Language)),
    codeWritten: data?.codeWritten ?? faker.random.alphaNumeric(),
    isSolved: data?.isSolved ?? faker.datatype.boolean(),
    feedbackToInterviewee:
      data?.feedbackToInterviewee ?? faker.lorem.paragraph(),
  };
};
