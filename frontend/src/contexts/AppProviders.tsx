import React from 'react';

import { AuthProvider } from './AuthContext';
import { PairingSocketProvider } from './PairingSocketContext';
import { UserProvider } from './UserContext';

const AppProviders: React.FunctionComponent = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <PairingSocketProvider>{children}</PairingSocketProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
