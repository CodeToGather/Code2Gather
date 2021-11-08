/* eslint-disable no-console */
import React, { useCallback, useEffect } from 'react';

import { initializeSocketForRoom } from 'lib/roomSocketService';
import tokenUtils from 'utils/tokenUtils';

export default interface SocketContextInterface {
  roomSocket: WebSocket;
}

const RoomSocketContext = React.createContext<
  SocketContextInterface | undefined
>(undefined);

const RoomSocketProvider: React.FunctionComponent = (props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roomSocket = new WebSocket(
    `${process.env.REACT_APP_BACKEND_WS_API}/roomws/${tokenUtils.getToken()}`,
  );
  roomSocket.binaryType = 'arraybuffer';

  const keepAlive = useCallback((): void => {
    const timeout = 5000;
    if (roomSocket.readyState == WebSocket.OPEN) {
      roomSocket.send('');
    }
    setTimeout(keepAlive, timeout);
  }, [roomSocket]);

  useEffect(() => {
    roomSocket.onopen = (_event): void => {
      console.log('Room socket connected!');
    };
    initializeSocketForRoom(roomSocket);
    keepAlive();
    return (): void => {
      roomSocket.close();
    };
  }, [keepAlive, roomSocket]);

  return <RoomSocketContext.Provider value={{ roomSocket }} {...props} />;
};

const useRoomSocket = (): SocketContextInterface => {
  const context = React.useContext(RoomSocketContext);
  if (context === undefined) {
    throw new Error('useRoomSocket must be used within a RoomSocketProvider');
  }
  return context;
};

export { RoomSocketProvider, useRoomSocket };
