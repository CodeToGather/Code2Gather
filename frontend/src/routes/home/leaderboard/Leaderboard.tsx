import { FC } from 'react';

import Typography from 'components/typography';

import { LeaderboardState } from '../states';

import './Leaderboard.scss';

type Props = LeaderboardState;

const Leaderboard: FC<Props> = () => {
  return (
    <div className="leaderboard">
      <Typography className="is-bold leaderboard__title" size="medium">
        Leaderboard <i className="far fa-question-circle" />
      </Typography>
    </div>
  );
};

export default Leaderboard;
