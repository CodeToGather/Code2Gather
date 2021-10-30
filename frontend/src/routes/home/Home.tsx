import { FC, useEffect, useReducer, useState } from 'react';
import LeaderboardApi from 'lib/leaderboardApi';
import { Difficulty } from 'types/crud/difficulty';

import Container from 'components/container';
import Modal from 'components/modal';
import Typography from 'components/typography';

import Leaderboard from './leaderboard';
import PracticePanel from './PracticePanel';
import { LeaderboardState } from './states';
import './Home.scss';

const initialLeaderboardState: LeaderboardState = {
  day: [],
  week: [],
  month: [],
  isLoading: true,
  isError: false,
};

const Home: FC = () => {
  const [leaderboardState, setLeaderboardState] = useReducer(
    (s: LeaderboardState, a: Partial<LeaderboardState>) => ({ ...s, ...a }),
    initialLeaderboardState,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    let didCancel = false;

    const fetchData = async (): Promise<void> => {
      try {
        const response = await LeaderboardApi.getLeaderboard();
        if (!didCancel) {
          setLeaderboardState({ isLoading: false, ...response });
        }
      } catch (error) {
        if (!didCancel) {
          setLeaderboardState({ isLoading: false, isError: true });
        }
      }
    };

    fetchData();
    return (): void => {
      didCancel = true;
    };
  }, []);

  const onPracticeNow = (difficulty: Difficulty): void => {
    // eslint-disable-next-line no-console
    console.log(difficulty);
    setIsModalVisible(true);
  };

  const onCancel = (): void => {
    setIsModalVisible(false);
  };

  return (
    <Container>
      <div className="home__top">
        <Leaderboard {...leaderboardState} />
        <PracticePanel onPracticeNow={onPracticeNow} />
      </div>
      {/* <div className="home__bottom">Practice History</div> */}
      <Modal className="home__modal" isVisible={isModalVisible}>
        <Typography className="is-bold" size="large">
          Finding a Partner...
        </Typography>
        <Typography className="home__modal-instruction" size="regular">
          We&apos;re looking for a practice partner for you!
        </Typography>
        <button className="border-button is-danger" onClick={onCancel}>
          Cancel
        </button>
      </Modal>
    </Container>
  );
};

export default Home;
