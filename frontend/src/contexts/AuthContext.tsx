import React from 'react';
import { useAsync } from 'react-async';
import { getAdditionalUserInfo } from 'firebase/auth';
import authApi from 'lib/authApi';
import { signInWithFirebase } from 'lib/firebase';
import { User } from 'types/crud/user';

import { Loading } from 'components/loading';

export interface AuthContextInterface {
  data: User | null;
  login(): Promise<void>;
  logout(): Promise<void>;
}

export const AuthContext = React.createContext<
  AuthContextInterface | undefined
>(undefined);

const AuthProvider: React.FunctionComponent = (props) => {
  const [firstAttemptFinished, setFirstAttemptFinished] = React.useState(false);
  const {
    data = null,
    error,
    isRejected,
    isPending,
    isSettled,
    reload,
  } = useAsync({
    promiseFn: authApi.getSelf,
  });

  React.useEffect(() => {
    if (isSettled) {
      setFirstAttemptFinished(true);
    }
  }, [isSettled, data]);

  if (!firstAttemptFinished) {
    if (isPending) {
      return <Loading />;
    }
    if (isRejected && error) {
      return (
        <div>
          <p>There&apos;s a problem. Try refreshing the app.</p>
          <pre>{error.message}</pre>
        </div>
      );
    }
  }

  const login = async (): Promise<void> => {
    const response = await signInWithFirebase();
    const token = await response.user.getIdToken();
    const additionalInfo = getAdditionalUserInfo(response);
    const githubUsername = additionalInfo?.username;
    // TODO: Provide a default photo url and null coalesce it
    const photoUrl = (additionalInfo?.profile?.avatar_url ??
      response.user.photoURL) as string | undefined;
    const profileUrl =
      additionalInfo?.profile?.html_url ?? githubUsername
        ? `https://github.com/${githubUsername}`
        : undefined;

    if (githubUsername == null || photoUrl == null || profileUrl == null) {
      throw new Error();
    }

    return authApi
      .login({ token, githubUsername, photoUrl, profileUrl })
      .then(reload)
      .catch((e: Error) => Promise.reject(e));
  };

  const logout = (): Promise<void> => authApi.logout().then(reload);

  return <AuthContext.Provider value={{ data, login, logout }} {...props} />;
};

const useAuth = (): AuthContextInterface => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
};

export { AuthProvider, useAuth };
