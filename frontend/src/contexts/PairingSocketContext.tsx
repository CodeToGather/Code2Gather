/* eslint-disable no-console */
import React, { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

import { CONNECT } from 'constants/socket';
import { initializeSocketForPairing } from 'lib/pairingSocketService';
import tokenUtils from 'utils/tokenUtils';

export default interface PairingSocketContextInterface {
  pairingSocket: Socket;
}

const PairingSocketContext = React.createContext<
  PairingSocketContextInterface | undefined
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
      if (process.env.NODE_ENV !== 'production') {
        console.log('Pairing socket connected!');
      }
    });
    socket.on('connect_error', (err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`connect_error due to ${err.message}`);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (eventName: string, ...args: any): void => {
      console.log(eventName, args);
    };

    if (process.env.NODE_ENV !== 'production') {
      socket.onAny(listener);
    }

    return (): void => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <PairingSocketContext.Provider
      value={{ pairingSocket: socket }}
      {...props}
    />
  );
};

const usePairingSocket = (): PairingSocketContextInterface => {
  const context = React.useContext(PairingSocketContext);
  if (context === undefined) {
    throw new Error(
      'usePairingSocket must be used within a PairingSocketProvider',
    );
  }
  return context;
};

export { PairingSocketProvider, usePairingSocket };
