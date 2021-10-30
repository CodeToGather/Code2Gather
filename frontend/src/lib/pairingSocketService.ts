import { Socket } from 'socket.io-client';

import store from 'app/store';
import {
  ERROR_FIND_PAIR,
  REQ_FIND_PAIR,
  REQ_STOP_FINDING_PAIR,
  RES_CREATED_ROOM,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from 'constants/pairing';
import { PairingState, resetState, setPairingState } from 'reducers/pairingDux';
import { Difficulty } from 'types/crud/difficulty';

export const findPair = (socket: Socket, difficulty: Difficulty): void => {
  store.dispatch(setPairingState({ state: PairingState.STARTED_PAIRING }));
  socket.emit(REQ_FIND_PAIR, difficulty);
};

export const stopFindingPair = (socket: Socket): void => {
  socket.emit(REQ_STOP_FINDING_PAIR);
  store.dispatch(resetState());
};

const findingPair = (socket: Socket): void => {
  socket.on(RES_FIND_PAIR, () => {
    store.dispatch(setPairingState({ state: PairingState.FINDING_PAIR }));
  });
};

const foundPair = (socket: Socket): void => {
  socket.on(RES_FOUND_PAIR, () => {
    // TODO: Look into sending the details of the paired person over as well
    store.dispatch(setPairingState({ state: PairingState.FOUND_PAIR }));
  });
};

const errorFindingPair = (socket: Socket): void => {
  socket.on(ERROR_FIND_PAIR, (message: string) => {
    store.dispatch(
      setPairingState({ state: PairingState.ERROR, errorMessage: message }),
    );
  });
};

const createdRoom = (socket: Socket): void => {
  socket.on(RES_CREATED_ROOM, (roomId: number) => {
    store.dispatch(
      setPairingState({ state: PairingState.CREATED_ROOM, roomId }),
    );
  });
};

export const initializeSocketForPairing = (socket: Socket): void => {
  findingPair(socket);
  foundPair(socket);
  errorFindingPair(socket);
  createdRoom(socket);
};
