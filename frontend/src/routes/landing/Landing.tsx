import { FC } from 'react';
import { useHistory } from 'react-router-dom';

import DemoImage from 'assets/images/demo.png';
import Container from 'components/container';
import Typography from 'components/typography';
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
          <Typography className="is-bold" size="extra-large">
            Mock interviews made easier.
          </Typography>
          <Typography className="is-regular tagline" size="large">
            Excel in your technical interviews today.
          </Typography>
          <div className="landing__left__button-container">
            <button
              className="primary-button landing__github-button"
              onClick={handleGithubSignIn}
            >
              <i className="fab fa-github" />
              <Typography size="medium">Sign in with GitHub</Typography>
            </button>
            <button
              className="secondary-button"
              onClick={(): void => {
                history.push(CODE_EDITOR);
              }}
            >
              <Typography size="regular">Sign in as guest instead</Typography>
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
