import { Difficulty, Language } from './enums';

export type MeetingRecordCreateData = {
  interviewerId: string;
  intervieweeId: string;
  duration: number;
  questionId: string;
  questionDifficulty: Difficulty;
  language: Language;
  codeWritten: string;
  isSolved: boolean;
  feedbackToInterviewee: string;
};

export type MeetingRecordUpdateData = {
  interviewerId?: string;
  intervieweeId?: string;
  duration?: number;
  questionId?: string;
  questionDifficulty?: Difficulty;
  language?: Language;
  codeWritten?: string;
  isSolved?: boolean;
  feedbackToInterviewee?: string;
};
