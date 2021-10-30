import { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { User } from 'types/crud/user';

import { AuthContext } from 'contexts/AuthContext';
import { UserContext } from 'contexts/UserContext';

import { emptyPromiseFunction } from './functionUtils';

// Renders the UI within an AuthContext.
export const authUserContextRender = (
  ui: ReactElement,
  options?: {
    data?: User | null;
    login?: () => Promise<void>;
    logout?: () => Promise<void>;
  },
): RenderResult => {
  return render(
    <AuthContext.Provider
      value={{
        data: options?.data ?? null,
        logout: options?.logout ?? emptyPromiseFunction,
        login: options?.login ?? emptyPromiseFunction,
      }}
    >
      <UserContext.Provider value={options?.data ?? null}>
        {ui}
      </UserContext.Provider>
    </AuthContext.Provider>,
  );
};
