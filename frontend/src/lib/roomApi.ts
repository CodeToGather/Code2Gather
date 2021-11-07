import { CheckInRoomResponse, QuestionReadResponse } from 'types/api/room';
import { Question } from 'types/crud/question';
import roomIdUtils from 'utils/roomIdUtils';

import BaseApi from './baseApi';

class RoomApi extends BaseApi {
  async checkInRoom(): Promise<boolean> {
    return this.get('room', (res: CheckInRoomResponse) => {
      if (res.isInRoom) {
        roomIdUtils.storeRoomId(res.roomId);
      } else {
        roomIdUtils.removeRoomId();
      }
      return res.isInRoom ?? false;
    });
  }

  async getQuestion(id: string): Promise<Question> {
    return this.get(`room/question/${id}`, (res: QuestionReadResponse) => {
      return res.question;
    });
  }
}

export default new RoomApi();
