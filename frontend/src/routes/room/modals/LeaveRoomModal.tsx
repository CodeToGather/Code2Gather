import { FC } from 'react';

import Typography from 'components/typography';

import './Modals.scss';

interface Props {
  onCancel: () => void;
  onLeave: () => void;
}

const LeaveRoomModal: FC<Props> = ({ onCancel, onLeave }) => {
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
        <button className="border-button is-danger" onClick={onLeave}>
          <Typography size="regular">Leave</Typography>
        </button>
      </div>
    </>
  );
};

export default LeaveRoomModal;
