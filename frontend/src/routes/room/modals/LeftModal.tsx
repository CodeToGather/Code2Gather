import { FC } from 'react';

import Typography from 'components/typography';

import './Modals.scss';

interface Props {
  onLeave: () => void;
}

const LeftModal: FC<Props> = ({ onLeave }) => {
  return (
    <>
      <Typography className="is-bold" size="large">
        Oh man, your partner has left this interview.
      </Typography>
      <Typography className="modal-instruction" size="regular">
        Really sorry that your interview partner has left in advance.
      </Typography>
      <div className="modal-buttons">
        <button className="border-button" onClick={onLeave}>
          <Typography size="regular">Leave</Typography>
        </button>
      </div>
    </>
  );
};

export default LeftModal;
