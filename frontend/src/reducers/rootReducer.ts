import { combineReducers } from 'redux';

import coding, { CodingDux } from './codingDux';
import pairing, { PairingDux } from './pairingDux';
import room, { RoomDux } from './roomDux';

export interface RootState {
  pairing: PairingDux;
  coding: CodingDux;
  room: RoomDux;
}

const rootReducer = combineReducers({ pairing, coding, room });

export default rootReducer;
