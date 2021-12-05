import { FC, ReactElement } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { IS_APP_DISABLED } from 'constants/config';
import { GUEST, HELP, ROOT } from 'constants/routes';
import Guest from 'routes/guest';
import Help from 'routes/help';
import Landing from 'routes/landing';

const redirectToRoot = (): React.ReactNode => <Redirect to={ROOT} />;

const UnauthenticatedApp: FC = () => {
  return (
    <Router>
      <Switch>
        <Route component={Landing} exact={true} path={ROOT} />
        {!IS_APP_DISABLED && (
          <Route
            exact={true}
            path={`${GUEST}/:id`}
            render={(props): ReactElement<typeof Guest> => <Guest {...props} />}
          />
        )}
        <Route component={Help} exact={true} path={HELP} />
        <Route path="/" render={redirectToRoot} />
      </Switch>
    </Router>
  );
};

export default UnauthenticatedApp;
