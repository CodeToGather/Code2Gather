import { combineReducers } from 'redux';

import pairing, { PairingDux } from './pairingDux';

export interface RootState {
  pairing: PairingDux;
}

const rootReducer = combineReducers({ pairing });

export default rootReducer;
