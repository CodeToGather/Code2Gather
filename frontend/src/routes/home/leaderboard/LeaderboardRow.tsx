import { FC } from 'react';

import Avatar from 'components/avatar';
import Typography from 'components/typography';
import { LeaderboardData } from 'types/crud/leaderboard';

import './Leaderboard.scss';

interface Props extends LeaderboardData {
  rank: number;
}

const Statistic: FC<{
  difficulty: string;
  numQuestions: number;
}> = ({ difficulty, numQuestions }) => {
  return (
    <div className="statistic">
      <Typography size="medium">{numQuestions}</Typography>
      <Typography className="statistic__difficulty" size="small">
        {difficulty}
      </Typography>
    </div>
  );
};

const LeaderboardRow: FC<Props> = ({
  photoUrl,
  profileUrl,
  githubUsername,
  rank,
  numEasyQuestions,
  numMediumQuestions,
  numHardQuestions,
}) => {
  return (
    <button className="leaderboard-row border-button">
      <div className="leaderboard-row__left">
        <Typography size="regular">{rank}</Typography>
        <Avatar alt={githubUsername} href={profileUrl} src={photoUrl} />
        <a href={profileUrl} rel="noreferrer noopener" target="_blank">
          <Typography size="regular">{githubUsername}</Typography>
        </a>
      </div>
      <div className="leaderboard-row__right">
        <Statistic difficulty="Easy" numQuestions={numEasyQuestions} />
        <Statistic difficulty="Medium" numQuestions={numMediumQuestions} />
        <Statistic difficulty="Hard" numQuestions={numHardQuestions} />
      </div>
    </button>
  );
};

export default LeaderboardRow;
