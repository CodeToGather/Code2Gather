import { Question } from 'types/crud/question';

export interface CheckInRoomResponse {
  isInRoom: boolean;
  roomId: string;
}

export interface QuestionReadResponse {
  question: Question;
}
