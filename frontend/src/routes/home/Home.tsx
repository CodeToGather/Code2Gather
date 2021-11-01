import { FC, ReactElement, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import Container from 'components/container';
import Error from 'components/error';
import Modal from 'components/modal';
import Typography from 'components/typography';
import { usePairingSocket } from 'contexts/PairingSocketContext';
import LeaderboardApi from 'lib/leaderboardApi';
import MeetingRecordApi from 'lib/meetingRecordApi';
import { findPair, stopFindingPair } from 'lib/pairingSocketService';
import { PairingState } from 'reducers/pairingDux';
import { RootState } from 'reducers/rootReducer';
import { Difficulty } from 'types/crud/difficulty';

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
  const { socket } = usePairingSocket();
  const { state, errorMessage } = useSelector(
    (state: RootState) => state.pairing,
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

  const onPracticeNow = (difficulty: Difficulty): void => {
    findPair(socket, difficulty);
    setIsModalVisible(true);
  };

  const onCancel = (): void => {
    stopFindingPair(socket);
    setIsModalVisible(false);
  };

  const getModalTitle = (): string => {
    switch (state) {
      case PairingState.NOT_PAIRING:
      case PairingState.STARTED_PAIRING:
      case PairingState.FINDING_PAIR:
        return 'Finding a Partner...';
      case PairingState.FOUND_PAIR:
      case PairingState.CREATED_ROOM:
        return 'Found you a partner! Creating room...';
      case PairingState.ERROR:
        return 'Something went wrong!';
    }
  };

  const getModalBody = (): string | ReactElement => {
    switch (state) {
      case PairingState.NOT_PAIRING:
      case PairingState.STARTED_PAIRING:
      case PairingState.FINDING_PAIR:
        return "We're looking for a practice partner for you!";
      case PairingState.FOUND_PAIR:
      case PairingState.CREATED_ROOM:
        return "We're getting you into a room now!";
      case PairingState.ERROR:
        return <Error error={errorMessage} />;
    }
  };

  return (
    <Container>
      <div className="home__top">
        <Leaderboard {...leaderboardState} />
        <PracticePanel onPracticeNow={onPracticeNow} />
      </div>
      <PracticeHistory {...historyState} />
      <Modal className="home__modal" isVisible={isModalVisible}>
        <Typography className="is-bold" size="large">
          {getModalTitle()}
        </Typography>
        <Typography className="home__modal-instruction" size="regular">
          {getModalBody()}
        </Typography>
        {state !== PairingState.FOUND_PAIR &&
        state !== PairingState.CREATED_ROOM ? (
          <button className="border-button is-danger" onClick={onCancel}>
            <Typography size="regular">Cancel</Typography>
          </button>
        ) : null}
      </Modal>
    </Container>
  );
};

export default Home;
