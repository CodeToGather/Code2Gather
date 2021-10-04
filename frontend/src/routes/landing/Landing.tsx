import { FC } from 'react';
import { useHistory } from 'react-router';
import { auth } from 'firebase';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';

import DemoImage from 'assets/images/demo.png';
import Container from 'components/container';
import { CODE_EDITOR } from 'constants/routes';

import './Landing.scss';

const githubAuthProvider = new GithubAuthProvider();

const Landing: FC = () => {
  const history = useHistory();

  const handleGithubSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, githubAuthProvider);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const token = await response.user.getIdToken();
      // TODO: Send token to our own backend
    } catch (error) {
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
              onClick={() => {
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
