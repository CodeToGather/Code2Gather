import faker from 'faker';
import { Difficulty } from 'types/crud/enums';
import { LeaderboardData } from 'types/crud/leaderboard';

import {
  createTestMeetingRecord,
  createTestRating,
  createTestUser,
  resetDatabase,
} from './tests';
import { MeetingRecord, Rating, User } from '.prisma/client';

export class Fixtures {
  faker: Faker.FakerStatic;

  public userOne: User;
  public userTwo: User;
  // userOne interviewed userTwo
  public meetingRecordOneInterviewedTwo: MeetingRecord;
  // userTwo interviewed userOne
  public meetingRecordTwoInterviewedOne: MeetingRecord;
  public ratingFromOneToTwo: Rating;
  public ratingFromTwoToOne: Rating;

  constructor(
    userOne: User,
    userTwo: User,
    meetingRecordOneInterviewedTwo: MeetingRecord,
    meetingRecordTwoInterviewedOne: MeetingRecord,
    ratingFromOneToTwo: Rating,
    ratingFromTwoToOne: Rating,
  ) {
    this.faker = faker;
    this.userOne = userOne;
    this.userTwo = userTwo;
    this.meetingRecordOneInterviewedTwo = meetingRecordOneInterviewedTwo;
    this.meetingRecordTwoInterviewedOne = meetingRecordTwoInterviewedOne;
    this.ratingFromOneToTwo = ratingFromOneToTwo;
    this.ratingFromTwoToOne = ratingFromTwoToOne;
  }

  public async reload(): Promise<void> {
    await resetDatabase();
    this.userOne = await createTestUser();
    this.userTwo = await createTestUser();
    this.meetingRecordOneInterviewedTwo = await createTestMeetingRecord({
      interviewerId: this.userOne.id,
      intervieweeId: this.userTwo.id,
    });
    this.meetingRecordTwoInterviewedOne = await createTestMeetingRecord({
      interviewerId: this.userTwo.id,
      intervieweeId: this.userOne.id,
    });
    this.ratingFromOneToTwo = await createTestRating({
      ratingUserId: this.userOne.id,
      ratedUserId: this.userTwo.id,
    });
    this.ratingFromTwoToOne = await createTestRating({
      ratingUserId: this.userTwo.id,
      ratedUserId: this.userOne.id,
    });
  }

  public async tearDown(): Promise<void> {
    await resetDatabase();
  }

  /**
   * ================ *
   * Testing Strategy *
   * ================ *
   *
   * We are going to generate 15 users.
   *
   * We will then run a O(n^2) algorithm to pair each of these users up,
   * generating 2 meeting records per pairing. We will randomise the
   * question difficulty and track the count of each difficulty for each
   * user.
   *
   * We will then sort the users via JavaScript to determine the correct
   * ordering, then check if that's the same as what LeaderboardService
   * gives us.
   */
  public async generateLeaderboardUsers(): Promise<LeaderboardData[]> {
    const users: User[] = [];
    const stats: { [key in Difficulty]: number }[] = [];
    for (let i = 0; i < 15; i += 1) {
      users.push(await createTestUser());
      stats.push({ EASY: 0, MEDIUM: 0, HARD: 0 });
    }
    for (let i = 0; i < 15; i += 1) {
      for (let j = i + 1; j < 15; j += 1) {
        const meetingRecordOne = await createTestMeetingRecord({
          interviewerId: users[i].id,
          intervieweeId: users[j].id,
        });
        stats[j][meetingRecordOne.questionDifficulty] += 1;
        const meetingRecordTwo = await createTestMeetingRecord({
          interviewerId: users[j].id,
          intervieweeId: users[i].id,
        });
        stats[i][meetingRecordTwo.questionDifficulty] += 1;
      }
    }

    const usersWithStats: [User, { [key in Difficulty]: number }][] = users.map(
      (user, index) => [user, stats[index]],
    );
    usersWithStats.sort((u1, u2) => {
      const hardDiff = u2[1].HARD - u1[1].HARD;
      if (hardDiff !== 0) {return hardDiff;}
      const mediumDiff = u2[1].MEDIUM - u1[1].MEDIUM;
      if (mediumDiff !== 0) {return mediumDiff;}
      const easyDiff = u2[1].EASY - u1[1].EASY;
      if (easyDiff !== 0) {return easyDiff;}
      return u2[0].githubUsername.localeCompare(u1[0].githubUsername);
    });

    return usersWithStats.map((u) => ({
      ...u[0],
      numEasyQuestions: u[1].EASY,
      numMediumQuestions: u[1].MEDIUM,
      numHardQuestions: u[1].HARD,
    }));
  }
}

export const loadFixtures = async (): Promise<Fixtures> => {
  await resetDatabase();
  const userOne = await createTestUser();
  const userTwo = await createTestUser();
  const meetingRecordOneInterviewedTwo = await createTestMeetingRecord({
    interviewerId: userOne.id,
    intervieweeId: userTwo.id,
  });
  const meetingRecordTwoInterviewedOne = await createTestMeetingRecord({
    interviewerId: userTwo.id,
    intervieweeId: userOne.id,
  });
  const ratingFromOneToTwo = await createTestRating({
    ratingUserId: userOne.id,
    ratedUserId: userTwo.id,
  });
  const ratingFromTwoToOne = await createTestRating({
    ratingUserId: userTwo.id,
    ratedUserId: userOne.id,
  });

  return new Fixtures(
    userOne,
    userTwo,
    meetingRecordOneInterviewedTwo,
    meetingRecordTwoInterviewedOne,
    ratingFromOneToTwo,
    ratingFromTwoToOne,
  );
};
