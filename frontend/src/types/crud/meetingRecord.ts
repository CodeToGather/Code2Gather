import { Difficulty } from './difficulty';
import { Language } from './language';

export interface MeetingRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  interviewerId: string | null;
  intervieweeId: string;
  duration: number;
  questionId: string;
  questionTitle: string;
  questionDifficulty: Difficulty;
  language: Language;
  codeWritten: string;
  isSolved: boolean;
  feedbackToInterviewee: string;
}
