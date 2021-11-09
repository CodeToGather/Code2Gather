import { FC, ReactElement, useEffect, useState } from 'react';

import Avatar from 'components/avatar';
import Typography from 'components/typography';
import { ROOM } from 'constants/routes';
import { PairingState } from 'reducers/pairingDux';

import './Modals.scss';

interface Props {
  state: PairingState;
  isPairing: boolean;
  partnerUsername: string;
  partnerPhotoUrl: string;
  onButtonClick: () => void;
  errorMessage: string;
}

const PairingModal: FC<Props> = ({
  state,
  partnerUsername,
  partnerPhotoUrl,
  onButtonClick,
  errorMessage,
  isPairing,
}) => {
  const [asterisks, setAsterisks] = useState('');
  const [redirectCount, setRedirectCount] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isPairing && state === PairingState.FINDING_PAIR) {
      interval = setInterval(() => {
        if (asterisks === '...') {
          setAsterisks('');
        } else {
          setAsterisks((asterisks) => asterisks + '.');
        }
      }, 500);
    } else {
      setAsterisks('');
    }
    return (): void => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [asterisks, isPairing, state]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (state === PairingState.FOUND_PAIR) {
      interval = setInterval(() => {
        if (redirectCount === 1) {
          window.location.href = ROOM;
          return;
        }
        setRedirectCount((count) => count - 1);
      }, 1000);
    }
    return (): void => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state, redirectCount]);

  const getModalTitle = (): string => {
    switch (state) {
      case PairingState.NOT_PAIRING:
      case PairingState.FINDING_PAIR:
        return `Finding a partner${asterisks}`;
      case PairingState.FOUND_PAIR:
        return 'Found you a partner!';
      case PairingState.CANNOT_FIND_PAIR:
        return 'Oh man!';
      case PairingState.ERROR:
        return 'Something went wrong!';
    }
  };

  const getModalBody = (): string | ReactElement<'div'> => {
    switch (state) {
      case PairingState.NOT_PAIRING:
      case PairingState.FINDING_PAIR:
        return "We're looking for a practice partner for you!";
      case PairingState.FOUND_PAIR:
        return (
          <>
            <div className="modal-partner-title">Your partner is:</div>
            <div className="modal-partner">
              <Avatar alt={partnerUsername} src={partnerPhotoUrl} />
              <div>{partnerUsername}</div>
            </div>
          </>
        );
      case PairingState.CANNOT_FIND_PAIR:
        return "We couldn't find a partner for you in time. Try again soon!";
      case PairingState.ERROR:
        return errorMessage;
    }
  };

  const getButtonContent = (): string => {
    switch (state) {
      case PairingState.NOT_PAIRING:
      case PairingState.FINDING_PAIR:
        return 'Cancel';
      case PairingState.FOUND_PAIR:
        return `Redirecting in ${redirectCount}s`;
      case PairingState.CANNOT_FIND_PAIR:
      case PairingState.ERROR:
        return 'Close';
    }
  };

  return (
    <>
      <Typography className="is-bold" size="large">
        {getModalTitle()}
      </Typography>
      <Typography className="modal-instruction" size="regular">
        {getModalBody()}
      </Typography>
      <div className="modal-buttons">
        <button
          className={`border-button ${
            state === PairingState.FOUND_PAIR ? 'is-success' : 'is-danger'
          }`}
          disabled={state === PairingState.FOUND_PAIR}
          onClick={onButtonClick}
        >
          <Typography size="regular">{getButtonContent()}</Typography>
        </button>
      </div>
    </>
  );
};

export default PairingModal;
