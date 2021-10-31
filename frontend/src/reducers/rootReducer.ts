import { combineReducers } from 'redux';

import coding, { CodingDux } from './codingDux';
import pairing, { PairingDux } from './pairingDux';

export interface RootState {
  pairing: PairingDux;
  coding: CodingDux;
}

const rootReducer = combineReducers({ pairing, coding });

export default rootReducer;
