import { FC } from 'react';
import { useHistory } from 'react-router-dom';

import DemoImage from 'assets/images/demo.png';
import Container from 'components/container';
import { CODE_EDITOR } from 'constants/routes';
import { useAuth } from 'contexts/AuthContext';

import './Landing.scss';

const Landing: FC = () => {
  const history = useHistory();
  const { login } = useAuth();

  const handleGithubSignIn = async (): Promise<void> => {
    try {
      await login();
    } catch (error) {
      // TODO: Show error
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <Container hasBackground={true}>
      <main className="landing">
        <div className="landing__left">
          <h1>Mock interviews made easier.</h1>
          <p className="is-regular">
            Excel in your technical interviews today.
          </p>
          <div className="landing__left__button-container">
            <button
              className="primary-button landing__github-button"
              onClick={handleGithubSignIn}
            >
              <i className="fab fa-github" />
              <div>Sign in with GitHub</div>
            </button>
            <button
              className="secondary-button landing__guest-button"
              onClick={(): void => {
                history.push(CODE_EDITOR);
              }}
            >
              Sign in as guest instead
            </button>
          </div>
        </div>
        <div className="landing__right">
          <img alt="Code2Gather Demo" src={DemoImage} />
        </div>
      </main>
    </Container>
  );
};

export default Landing;
