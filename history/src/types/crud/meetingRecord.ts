import { Difficulty, Language } from './enums';

export interface MeetingRecordCreateData {
  interviewerId: string;
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

export interface MeetingRecordUpdateData {
  interviewerId?: string;
  intervieweeId?: string;
  duration?: number;
  questionId?: string;
  questionTitle?: string;
  questionDifficulty?: Difficulty;
  language?: Language;
  codeWritten?: string;
  isSolved?: boolean;
  feedbackToInterviewee?: string;
}
