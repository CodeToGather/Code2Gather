import { Server } from 'socket.io';

import {
  CONNECT,
  DISCONNECT,
  REQ_FIND_PAIR,
  REQ_STOP_FINDING_PAIR,
} from 'constants/socket';

import { authMiddleware } from './authMiddleware';
import { handleDisconnect } from './handleDisconnect';
import { handleFindPair } from './handleFindPair';
import { handleStopFindingPair } from './handleStopFindingPair';

const setUpIo = (io: Server): void => {
  io.use(authMiddleware);
  io.on(CONNECT, (socket) => {
    console.log('IO connected');
    socket.on(REQ_FIND_PAIR, handleFindPair(socket, io));
    socket.on(REQ_STOP_FINDING_PAIR, handleStopFindingPair(socket, io));
    socket.on(DISCONNECT, handleDisconnect(socket, io));
  });
  console.log('IO has been set up.');
};

export default setUpIo;
