import { FC } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { HELP, HOME, ROOM } from 'constants/routes';
import Help from 'routes/help';
import Home from 'routes/home';
import Room from 'routes/room';

const redirectToHome = (): React.ReactNode => <Redirect to={HOME} />;

const AuthenticatedApp: FC = () => {
  return (
    <Router>
      <Switch>
        <Route component={Home} exact={true} path={HOME} />
        <Route component={Room} exact={true} path={ROOM} />
        <Route component={Help} exact={true} path={HELP} />
        <Route path="/" render={redirectToHome} />
      </Switch>
    </Router>
  );
};

export default AuthenticatedApp;
