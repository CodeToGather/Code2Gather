import { Difficulty } from './difficulty';

export interface Question {
  id: string;
  title: string;
  text: string;
  difficulty: Difficulty;
  hints: string;
}
