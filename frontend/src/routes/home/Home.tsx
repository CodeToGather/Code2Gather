import { FC, useEffect, useReducer } from 'react';
import LeaderboardApi from 'lib/leaderboardApi';

import Container from 'components/container';

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

  return (
    <Container>
      <div className="home__top">
        <Leaderboard {...leaderboardState} />
        <PracticePanel />
      </div>
      {/* <div className="home__bottom">Practice History</div> */}
    </Container>
  );
};

export default Home;
