import { FC } from 'react';

import LeaderboardImage from 'assets/images/leaderboard.png';
import Typography from 'components/typography';

import './Modals.scss';

interface Props {
  onClose: () => void;
}

const LeaderboardModal: FC<Props> = ({ onClose }) => {
  return (
    <>
      <Typography className="is-bold" size="large">
        Check out the leaderboard!
      </Typography>
      <Typography className="modal-instruction" size="regular">
        Here, you can see the rankings of your fellow mock interview
        practitioners:
        <br />
        <div className="modal-image-container">
          <img
            alt="Leaderboard"
            className="modal-image"
            src={LeaderboardImage}
          />
        </div>
        Keep practicing and you&apos;ll be on the leaderboard in no time!
      </Typography>
      <div className="modal-buttons">
        <button className="border-button" onClick={onClose}>
          <Typography size="regular">Got it!</Typography>
        </button>
      </div>
    </>
  );
};

export default LeaderboardModal;
