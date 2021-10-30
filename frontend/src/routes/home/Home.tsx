import { FC } from 'react';

import Container from 'components/container';

import Leaderboard from './leaderboard';
import PracticePanel from './PracticePanel';
import './Home.scss';

const Home: FC = () => {
  return (
    <Container>
      <div className="home__top">
        <Leaderboard />
        <PracticePanel />
      </div>
      <div className="home__bottom">Practice History</div>
    </Container>
  );
};

export default Home;
