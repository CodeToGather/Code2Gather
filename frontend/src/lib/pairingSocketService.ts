import { Socket } from 'socket.io-client';

import store from 'app/store';
import {
  ERROR_FIND_PAIR,
  REQ_FIND_PAIR,
  REQ_STOP_FINDING_PAIR,
  RES_CANNOT_FIND_PAIR,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from 'constants/pairing';
import { PairingState, resetState, setPairingState } from 'reducers/pairingDux';
import { setPartialRoomInfo } from 'reducers/roomDux';
import { Difficulty } from 'types/crud/difficulty';
import roomIdUtils from 'utils/roomIdUtils';

export const findPair = (socket: Socket, difficulty: Difficulty): void => {
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

const cannotFindPair = (socket: Socket): void => {
  socket.on(RES_CANNOT_FIND_PAIR, () => {
    store.dispatch(setPairingState({ state: PairingState.CANNOT_FIND_PAIR }));
  });
};

const foundPair = (socket: Socket): void => {
  socket.on(
    RES_FOUND_PAIR,
    ({
      roomId,
      partnerUsername,
      partnerPhotoUrl,
    }: {
      roomId: string;
      partnerUsername: string;
      partnerPhotoUrl: string;
    }) => {
      roomIdUtils.storeRoomId(roomId);
      store.dispatch(setPairingState({ state: PairingState.FOUND_PAIR }));
      store.dispatch(
        setPartialRoomInfo({ roomId, partnerUsername, partnerPhotoUrl }),
      );
    },
  );
};

const errorFindingPair = (socket: Socket): void => {
  socket.on(ERROR_FIND_PAIR, (message: string) => {
    store.dispatch(
      setPairingState({ state: PairingState.ERROR, errorMessage: message }),
    );
  });
};

export const initializeSocketForPairing = (socket: Socket): void => {
  findingPair(socket);
  foundPair(socket);
  cannotFindPair(socket);
  errorFindingPair(socket);
};
