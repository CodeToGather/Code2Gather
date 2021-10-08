import { User } from '.prisma/client';

export type LeaderboardData = User & {
  numEasyQuestions: number;
  numMediumQuestions: number;
  numHardQuestions: number;
};
