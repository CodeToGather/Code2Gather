import { FC } from 'react';

import Typography from 'components/typography';

import './Modals.scss';

interface Props {
  turnsCompleted: number;
  partnerUsername: string;
  onCancel: () => void;
  onSolved: () => void;
  onUnsolved: () => void;
}

const EndTurnModal: FC<Props> = ({
  turnsCompleted,
  partnerUsername,
  onCancel,
  onSolved,
  onUnsolved,
}) => {
  const getInstruction = (): string => {
    if (turnsCompleted === 0) {
      return `Once you end the turn, ${partnerUsername} will be the interviewer next, and you will be the interviewee.\n\nDid ${partnerUsername} solve the given problem?`;
    }
    return `Once you end the turn, this interview will complete.\n\nDid ${partnerUsername} solve the given problem?`;
  };

  return (
    <>
      <Typography className="is-bold" size="large">
        End Turn
      </Typography>
      <Typography className="modal-instruction" size="regular">
        {getInstruction()}
      </Typography>
      <div className="modal-buttons">
        <button className="border-button is-danger" onClick={onCancel}>
          <Typography size="regular">Cancel</Typography>
        </button>
        <div className="modal-buttons--right">
          <button className="border-button" onClick={onUnsolved}>
            <Typography size="regular">Unsolved</Typography>
          </button>
          <button className="border-button" onClick={onSolved}>
            <Typography size="regular">Solved</Typography>
          </button>
        </div>
      </div>
    </>
  );
};

export default EndTurnModal;
