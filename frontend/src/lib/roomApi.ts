import { CheckInRoomResponse } from 'types/api/room';
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
}

export default new RoomApi();
