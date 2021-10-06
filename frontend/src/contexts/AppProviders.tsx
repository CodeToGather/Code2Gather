import React from 'react';

import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';

const AppProviders: React.FunctionComponent = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
