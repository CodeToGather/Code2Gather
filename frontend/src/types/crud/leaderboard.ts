import { User } from './user';

export interface LeaderboardData extends User {
  numEasyQuestions: number;
  numMediumQuestions: number;
  numHardQuestions: number;
}
