import { Socket } from 'socket.io-client';
import { Difficulty } from 'types/crud/difficulty';

import {
  ERROR_FIND_PAIR,
  REQ_FIND_PAIR,
  REQ_STOP_FINDING_PAIR,
  RES_CREATED_ROOM,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from 'constants/pairing';

export const findPair = (socket: Socket, difficulty: Difficulty): void => {
  socket.emit(REQ_FIND_PAIR, difficulty);
};

export const stopFindingPair = (socket: Socket): void => {
  socket.emit(REQ_STOP_FINDING_PAIR);
};

const findingPair = (socket: Socket): void => {
  socket.on(RES_FIND_PAIR, () => {
    // TODO: Set redux state to be finding pair
  });
};

const foundPair = (socket: Socket): void => {
  socket.on(RES_FOUND_PAIR, () => {
    // TODO: Set redux state to be found pair
  });
};

const errorFindingPair = (socket: Socket): void => {
  socket.on(ERROR_FIND_PAIR, (message: string) => {
    // eslint-disable-next-line no-console
    console.log(message);
    // TODO: Set redux state to be error
  });
};

const createdRoom = (socket: Socket): void => {
  socket.on(RES_CREATED_ROOM, (roomId: number) => {
    // eslint-disable-next-line no-console
    console.log(roomId);
    // TODO: Redirect user to room page
  });
};

export const initializeSocketForPairing = (socket: Socket): void => {
  findingPair(socket);
  foundPair(socket);
  errorFindingPair(socket);
  createdRoom(socket);
};
