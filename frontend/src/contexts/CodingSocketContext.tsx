import React, { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

import { CONNECT } from 'constants/socket';
import { initializeSocketForCoding } from 'lib/codingSocketService';

export default interface SocketContextInterface {
  socket: Socket;
}

const CodingSocketContext = React.createContext<
  SocketContextInterface | undefined
>(undefined);

const CodingSocketProvider: React.FunctionComponent = (props) => {
  const socket = io(`${process.env.REACT_APP_BACKEND_API}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    path: '/coding',
  });

  useEffect(() => {
    initializeSocketForCoding(socket);
    socket.on(CONNECT, () => {
      // eslint-disable-next-line no-console
      console.log('Socket connected!');
    });
    socket.on('connect_error', (err) => {
      // eslint-disable-next-line no-console
      console.error(`connect_error due to ${err.message}`);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (eventName: string, ...args: any): void => {
      // eslint-disable-next-line no-console
      console.log(eventName, args);
    };

    if (process.env.NODE_ENV === 'development') {
      socket.onAny(listener);
    }

    return (): void => {
      socket.disconnect();
    };
  }, [socket]);

  return <CodingSocketContext.Provider value={{ socket }} {...props} />;
};

const useCodingSocket = (): SocketContextInterface => {
  const context = React.useContext(CodingSocketContext);
  if (context === undefined) {
    throw new Error(
      'useCodingSocket must be used within a CodingSocketProvider',
    );
  }
  return context;
};

export { CodingSocketProvider, useCodingSocket };
