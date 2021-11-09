import { FC, ReactElement } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { GUEST, ROOT } from 'constants/routes';
import Guest from 'routes/guest';
import Landing from 'routes/landing';

const redirectToRoot = (): React.ReactNode => <Redirect to={ROOT} />;

const UnauthenticatedApp: FC = () => {
  return (
    <Router>
      <Switch>
        <Route component={Landing} exact={true} path={ROOT} />
        <Route
          exact={true}
          path={`${GUEST}/:id`}
          render={(props): ReactElement<typeof Guest> => <Guest {...props} />}
        />
        <Route path="/" render={redirectToRoot} />
      </Switch>
    </Router>
  );
};

export default UnauthenticatedApp;
