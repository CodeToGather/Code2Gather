import React from 'react';

import { User } from 'types/crud/user';

import { useAuth } from './AuthContext';

export const UserContext = React.createContext<User | null | undefined>(
  undefined,
);

// Allows user data to be accessible from everywhere
const UserProvider: React.FunctionComponent = (props) => {
  const { data } = useAuth();
  return <UserContext.Provider value={data} {...props} />;
};

const useUser = (): User | null => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
