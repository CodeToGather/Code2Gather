import { FC } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { CODE_EDITOR, ROOT } from 'constants/routes';
import CodeEditor from 'routes/codeEditor';
import Landing from 'routes/landing';

const redirectToRoot = (): React.ReactNode => <Redirect to={ROOT} />;

const UnauthenticatedApp: FC = () => {
  return (
    <Router>
      <Switch>
        <Route component={Landing} exact={true} path={ROOT} />
        <Route component={CodeEditor} exact={true} path={CODE_EDITOR} />
        <Route path="/" render={redirectToRoot} />
      </Switch>
    </Router>
  );
};

export default UnauthenticatedApp;
