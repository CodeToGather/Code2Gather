import { FC } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { CODE_EDITOR, HOME } from 'constants/routes';
import CodeEditor from 'routes/codeEditor';

const redirectToHome = (): React.ReactNode => <Redirect to={HOME} />;

const AuthenticatedApp: FC = () => {
  return (
    <Router>
      <Switch>
        {/* TODO: Add home route and component */}
        <Route component={CodeEditor} exact={true} path={CODE_EDITOR} />
        <Route path="/" render={redirectToHome} />
      </Switch>
    </Router>
  );
};

export default AuthenticatedApp;
