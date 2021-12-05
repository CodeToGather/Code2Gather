import { FC, lazy, Suspense, useEffect } from 'react';

import { Loading } from 'components/loading';
import { IS_APP_DISABLED } from 'constants/config';
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

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handler, false);
    return (): void => {
      document.removeEventListener('keydown', handler);
    };
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      {/* Renders the appropriate app */}
      {user && !IS_APP_DISABLED ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Suspense>
  );
};

export default App;
