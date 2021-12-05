import { FC, useState } from 'react';
import FadeIn from 'react-fade-in';
import { generateSlug } from 'random-word-slugs';

import DemoImage from 'assets/images/demo.png';
import Container from 'components/container';
import LoadingAnimation from 'components/loading/LoadingAnimation';
import Modal from 'components/modal';
import Typography from 'components/typography';
import { IS_APP_DISABLED } from 'constants/config';
import { GUEST } from 'constants/routes';
import { useAuth } from 'contexts/AuthContext';

import AppDisabledModal from './AppDisabledModal';
import './Landing.scss';

const Landing: FC = () => {
  const { login } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [leftFadeComplete, setLeftFadeComplete] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleGithubSignIn = async (): Promise<void> => {
    if (IS_APP_DISABLED) {
      setIsModalVisible(true);
      return;
    }
    setIsSigningIn(true);
    try {
      await login();
    } catch (error) {
      // TODO: Show error
      setIsSigningIn(false);
    }
  };

  const handleGuestRoom = (): void => {
    if (IS_APP_DISABLED) {
      setIsModalVisible(true);
      return;
    }
    const slug = generateSlug();
    window.location.href = `${GUEST}/${slug}`;
  };

  return (
    <Container hasBackground={true}>
      <main className="landing">
        <FadeIn
          className="landing__left"
          delay={200}
          onComplete={(): void => setLeftFadeComplete(true)}
          transitionDuration={800}
        >
          <Typography className="is-bold" size="extra-large">
            Mock interviews made easier.
          </Typography>
          <Typography className="is-regular tagline" size="large">
            Excel in your technical interviews today.
          </Typography>
          <div className="landing__left__button-container">
            <button
              className="primary-button landing__github-button"
              disabled={isSigningIn}
              onClick={handleGithubSignIn}
            >
              <i className="fab fa-github" />
              <Typography size="medium">
                {isSigningIn ? 'Signing in...' : 'Sign in with GitHub'}
                {isSigningIn ? <LoadingAnimation height={1} /> : null}
              </Typography>
            </button>
            <button
              className="secondary-button"
              disabled={isSigningIn}
              onClick={handleGuestRoom}
            >
              <Typography size="regular">
                Try playground as guest instead
              </Typography>
            </button>
          </div>
        </FadeIn>
        <FadeIn
          className="landing__right"
          transitionDuration={400}
          visible={leftFadeComplete}
        >
          <img alt="Code2Gather Demo" src={DemoImage} />
        </FadeIn>
      </main>
      {IS_APP_DISABLED && (
        <Modal isVisible={isModalVisible && IS_APP_DISABLED}>
          <AppDisabledModal onClose={(): void => setIsModalVisible(false)} />
        </Modal>
      )}
    </Container>
  );
};

export default Landing;
