import React, { useEffect } from 'react';
import { initializeSocketForPairing } from 'lib/pairingSocketService';
// import { initializeSocket } from 'services';
import { io, Socket } from 'socket.io-client';

import { CONNECT } from 'constants/pairing';
import tokenUtils from 'utils/tokenUtils';

export default interface SocketContextInterface {
  socket: Socket;
}

const PairingSocketContext = React.createContext<
  SocketContextInterface | undefined
>(undefined);

const PairingSocketProvider: React.FunctionComponent = (props) => {
  const socket = io(`${process.env.REACT_APP_BACKEND_API}`, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    auth: {
      token: tokenUtils.getToken(),
    },
    path: '/pairing',
  });

  useEffect(() => {
    initializeSocketForPairing(socket);
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

  return <PairingSocketContext.Provider value={{ socket }} {...props} />;
};

const usePairingSocket = (): SocketContextInterface => {
  const context = React.useContext(PairingSocketContext);
  if (context === undefined) {
    throw new Error(`useSocket must be used within a SocketProvider`);
  }
  return context;
};

export { PairingSocketProvider, usePairingSocket };
