import { FC } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { HOME } from 'constants/routes';

const redirectToHome = (): React.ReactNode => <Redirect to={HOME} />;

const AuthenticatedApp: FC = () => {
  return (
    <Router>
      <Switch>
        {/* TODO: Add authenticated routes */}
        {/* <Route component={<div>Test</div>} exact={true} path={HOME} /> */}
        <Route path="/" render={redirectToHome} />
      </Switch>
    </Router>
  );
};

export default AuthenticatedApp;
