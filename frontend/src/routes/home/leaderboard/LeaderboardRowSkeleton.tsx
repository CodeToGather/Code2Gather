import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import AvatarSkeleton from 'components/avatar/AvatarSkeleton';
import Typography from 'components/typography';

import './Leaderboard.scss';

const StatisticSkeleton: FC = () => {
  return (
    <div className="statistic">
      <Typography size="medium">
        <Skeleton width="20px" />
      </Typography>
      <Typography className="statistic__difficulty" size="small">
        <Skeleton width="30px" />
      </Typography>
    </div>
  );
};

const LeaderboardRowSkeleton: FC = () => {
  return (
    <button className="leaderboard-row border-button">
      <div className="leaderboard-row__left">
        <Typography size="regular">
          <Skeleton width="10px" />
        </Typography>
        <AvatarSkeleton />
        <Typography size="regular">
          <Skeleton width="100px" />
        </Typography>
      </div>
      <div className="leaderboard-row__right">
        <StatisticSkeleton />
        <StatisticSkeleton />
        <StatisticSkeleton />
      </div>
    </button>
  );
};

export default LeaderboardRowSkeleton;
