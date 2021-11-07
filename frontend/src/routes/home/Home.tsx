import { FC, ReactElement, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import Avatar from 'components/avatar';
import Container from 'components/container';
import Modal from 'components/modal';
import Typography from 'components/typography';
import { ROOM } from 'constants/routes';
import { usePairingSocket } from 'contexts/PairingSocketContext';
import LeaderboardApi from 'lib/leaderboardApi';
import MeetingRecordApi from 'lib/meetingRecordApi';
import { findPair, stopFindingPair } from 'lib/pairingSocketService';
import RoomApi from 'lib/roomApi';
import { PairingState } from 'reducers/pairingDux';
import { RootState } from 'reducers/rootReducer';
import { Difficulty } from 'types/crud/difficulty';
import roomIdUtils from 'utils/roomIdUtils';

import PracticeHistory from './history';
import Leaderboard from './leaderboard';
import PracticePanel from './PracticePanel';
import { LeaderboardState, PracticeHistoryState } from './states';
import './Home.scss';

const initialLeaderboardState: LeaderboardState = {
  day: [],
  week: [],
  month: [],
  isLoading: true,
  isError: false,
};

const initialPracticeHistoryState: PracticeHistoryState = {
  records: [],
  isLoading: true,
  isError: false,
};

const Home: FC = () => {
  const [leaderboardState, setLeaderboardState] = useReducer(
    (s: LeaderboardState, a: Partial<LeaderboardState>) => ({ ...s, ...a }),
    initialLeaderboardState,
  );
  const [historyState, setHistoryState] = useReducer(
    (s: PracticeHistoryState, a: Partial<PracticeHistoryState>) => ({
      ...s,
      ...a,
    }),
    initialPracticeHistoryState,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [redirectCount, setRedirectCount] = useState(5);
  const [isInRoom, setIsInRoom] = useState(false);
  const { socket } = usePairingSocket();
  const { state, errorMessage } = useSelector(
    (state: RootState) => state.pairing,
  );
  const { partnerUsername, partnerPhotoUrl } = useSelector(
    (state: RootState) => state.room,
  );

  useEffect(() => {
    let didCancel = false;

    const fetchData = async (): Promise<void> => {
      try {
        const response = await LeaderboardApi.getLeaderboard();
        if (!didCancel) {
          setLeaderboardState({ isLoading: false, ...response });
        }
      } catch (error) {
        if (!didCancel) {
          setLeaderboardState({ isLoading: false, isError: true });
        }
      }
    };

    fetchData();
    return (): void => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    let didCancel = false;

    const fetchData = async (): Promise<void> => {
      try {
        const response = await MeetingRecordApi.getMeetingRecords();
        if (!didCancel) {
          setHistoryState({ isLoading: false, records: response });
        }
      } catch (error) {
        if (!didCancel) {
          setHistoryState({ isLoading: false, isError: true });
        }
      }
    };

    fetchData();
    return (): void => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    let didCancel = false;

    const fetchData = async (): Promise<void> => {
      try {
        const response = await RoomApi.checkInRoom();
        if (!didCancel) {
          setIsInRoom(response);
        }
      } catch (error) {
        setIsInRoom(false);
        roomIdUtils.removeRoomId();
      }
    };

    fetchData();
    return (): void => {
      didCancel = true;
    };
  }, []);

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

  const onPracticeNow = (difficulty: Difficulty): void => {
    findPair(socket, difficulty);
    setIsModalVisible(true);
  };

  const onButtonClick = (): void => {
    if (state === PairingState.FOUND_PAIR) {
      return;
    }
    // We will always do this, just in case
    stopFindingPair(socket, state !== PairingState.NOT_PAIRING);
    setIsModalVisible(false);
  };

  const getModalTitle = (): string => {
    switch (state) {
      case PairingState.NOT_PAIRING:
      case PairingState.FINDING_PAIR:
        return 'Finding a partner...';
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
            <div className="home__modal-partner-title">Your partner is:</div>
            <div className="home__modal-partner">
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
    <Container>
      <div className="home__top">
        <Leaderboard {...leaderboardState} />
        <PracticePanel
          isDisabled={state !== PairingState.NOT_PAIRING}
          isInRoom={isInRoom}
          onPracticeNow={onPracticeNow}
        />
      </div>
      <PracticeHistory {...historyState} />
      <Modal className="home__modal" isVisible={isModalVisible}>
        <Typography className="is-bold" size="large">
          {getModalTitle()}
        </Typography>
        <Typography className="home__modal-instruction" size="regular">
          {getModalBody()}
        </Typography>
        <button
          className={`border-button ${
            state === PairingState.FOUND_PAIR ? 'is-success' : 'is-danger'
          }`}
          disabled={state === PairingState.FOUND_PAIR}
          onClick={onButtonClick}
        >
          <Typography size="regular">{getButtonContent()}</Typography>
        </button>
      </Modal>
    </Container>
  );
};

export default Home;
