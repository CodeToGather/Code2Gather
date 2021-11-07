import React from 'react';

import { AuthProvider } from './AuthContext';
import { CodingSocketProvider } from './CodingSocketContext';
import { PairingSocketProvider } from './PairingSocketContext';
import { RoomSocketProvider } from './RoomSocketContext';
import { UserProvider } from './UserContext';

const AppProviders: React.FunctionComponent = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <PairingSocketProvider>
          <CodingSocketProvider>
            <RoomSocketProvider>{children}</RoomSocketProvider>
          </CodingSocketProvider>
        </PairingSocketProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
