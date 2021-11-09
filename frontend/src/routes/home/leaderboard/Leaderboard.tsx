import { FC, ReactElement, useState } from 'react';

import Error from 'components/error';
import Tabs from 'components/tabs';
import Typography from 'components/typography';
import { LeaderboardData } from 'types/crud/leaderboard';

import { LeaderboardState } from '../states';

import LeaderboardRow from './LeaderboardRow';
import LeaderboardRowSkeleton from './LeaderboardRowSkeleton';
import './Leaderboard.scss';

interface Props extends LeaderboardState {
  onHelp: () => void;
}

enum LeaderboardTab {
  DAY,
  WEEK,
  MONTH,
}

const tabs = [
  {
    label: 'Today',
    value: LeaderboardTab.DAY,
  },
  {
    label: 'This Week',
    value: LeaderboardTab.WEEK,
  },
  {
    label: 'This Month',
    value: LeaderboardTab.MONTH,
  },
];

const Leaderboard: FC<Props> = ({
  day,
  week,
  month,
  isLoading,
  isError,
  onHelp,
}) => {
  const [tab, setTab] = useState(LeaderboardTab.DAY);

  const getData = (): LeaderboardData[] => {
    switch (tab) {
      case LeaderboardTab.DAY:
        return day;
      case LeaderboardTab.WEEK:
        return week;
      case LeaderboardTab.MONTH:
        return month;
    }
  };

  const renderBody = (): ReactElement => {
    if (isLoading) {
      return (
        <div className="leaderboard__body">
          <LeaderboardRowSkeleton />
          <LeaderboardRowSkeleton />
          <LeaderboardRowSkeleton />
          <LeaderboardRowSkeleton />
          <LeaderboardRowSkeleton />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="leaderboard__body">
          <Error />
        </div>
      );
    }
    const data = getData();
    if (data.length === 0) {
      return (
        <div className="leaderboard__body">
          <Typography className="leaderboard__empty" size="regular">
            There are currently no records! You can be the first!
          </Typography>
        </div>
      );
    }
    return (
      <div className="leaderboard__body">
        {data.map((d, index) => (
          <LeaderboardRow {...d} key={d.id} rank={index + 1} />
        ))}
      </div>
    );
  };

  return (
    <div className="leaderboard">
      <Typography className="is-bold leaderboard__title" size="medium">
        Leaderboard{' '}
        <i
          className="far fa-question-circle"
          onClick={onHelp}
          onKeyDown={onHelp}
          role="button"
          tabIndex={-1}
        />
      </Typography>
      <Tabs onClick={setTab} selected={tab} tabs={tabs} />
      {renderBody()}
    </div>
  );
};

export default Leaderboard;
