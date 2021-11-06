import { Difficulty } from './difficulty';

export interface User {
  uid: string;
  sid: string;
  difficulty: Difficulty;
  rating: {
    average: number;
    count: number;
  };
  githubUsername: string;
  photoUrl: string;
}
