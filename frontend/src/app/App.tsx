import { FC, lazy, Suspense, useEffect } from 'react';

import { useUser } from 'contexts/UserContext';
import { retryPromise } from 'utils/promiseUtils';

// Code splitting with React.lazy and Suspense
type ModuleType = typeof import('./AuthenticatedApp');

const loadAuthenticatedApp = (): Promise<ModuleType> =>
  import('./AuthenticatedApp');
const AuthenticatedApp = lazy(
  () => retryPromise(loadAuthenticatedApp) as Promise<ModuleType>,
);
const UnauthenticatedApp = lazy(() => import('./UnauthenticatedApp'));

const App: FC = () => {
  const user = useUser();

  useEffect(() => {
    loadAuthenticatedApp();
  }, []);

  return (
    // TODO: Add a proper loading animation/element
    <Suspense fallback={<>Loading...</>}>
      {/* Renders the appropriate app */}
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Suspense>
  );
};

export default App;
