import { FC, useEffect, useState } from 'react';

import Typography from 'components/typography';

import './Modals.scss';

interface Props {
  partnerHasDisconnected: boolean;
  onLeave: () => void;
}

const DisconnectedModal: FC<Props> = ({ partnerHasDisconnected, onLeave }) => {
  const [count, setCount] = useState(30);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (partnerHasDisconnected) {
      interval = setInterval(() => {
        if (count === 0) {
          clearInterval(interval);
          return;
        }
        setCount((count) => count - 1);
      }, 1000);
    }
    return (): void => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [partnerHasDisconnected, count]);

  return (
    <>
      <Typography className="is-bold" size="large">
        Uh oh! Your partner has disconnected!
      </Typography>
      <Typography className="modal-instruction" size="regular">
        Please wait for 30 seconds before leaving the room, just in case your
        partner returns. We really appreciate your patience.
      </Typography>
      <div className="modal-buttons">
        <button
          className={`border-button${count === 0 ? ' is-danger' : ''}`}
          disabled={count > 0}
          onClick={onLeave}
        >
          <Typography size="regular">
            {count > 0 ? `${count}s` : 'Leave'}
          </Typography>
        </button>
      </div>
    </>
  );
};

export default DisconnectedModal;
