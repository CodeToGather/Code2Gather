import { FC, useState } from 'react';

import LoadingAnimation from 'components/loading/LoadingAnimation';
import Typography from 'components/typography';

import './Modals.scss';

interface Props {
  onCancel: () => void;
  onLeave: () => void;
}

const LeaveRoomModal: FC<Props> = ({ onCancel, onLeave }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  return (
    <>
      <Typography className="is-bold" size="large">
        Leave Room
      </Typography>
      <Typography className="modal-instruction" size="regular">
        Are you sure you wish to leave the room? This will end the interview for
        both you and the other person.
      </Typography>
      <div className="modal-buttons">
        <button className="border-button" onClick={onCancel}>
          <Typography size="regular">Cancel</Typography>
        </button>
        <button
          className="border-button is-danger"
          onClick={(): void => {
            setIsLeaving(true);
            onLeave();
          }}
        >
          <Typography className="modal-loading-button-text" size="regular">
            {isLeaving ? 'Leaving' : 'Leave'}{' '}
            {isLeaving ? <LoadingAnimation height={0.7} /> : null}
          </Typography>
        </button>
      </div>
    </>
  );
};

export default LeaveRoomModal;
