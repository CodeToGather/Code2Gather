import { FC, ReactElement, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import Container from 'components/container';
import Modal from 'components/modal';
import { HELP } from 'constants/routes';
import { usePairingSocket } from 'contexts/PairingSocketContext';
import LeaderboardApi from 'lib/leaderboardApi';
import MeetingRecordApi from 'lib/meetingRecordApi';
import { findPair, stopFindingPair } from 'lib/pairingSocketService';
import RoomApi from 'lib/roomApi';
import { PairingState } from 'reducers/pairingDux';
import { RootState } from 'reducers/rootReducer';
import { Difficulty } from 'types/crud/difficulty';
import roomIdUtils from 'utils/roomIdUtils';

import LeaderboardModal from './modals/LeaderboardModal';
import PairingModal from './modals/PairingModal';
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
  page: 0,
  isLoading: true,
  isLastPage: true,
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
  const [isPairing, setIsPairing] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const { pairingSocket } = usePairingSocket();
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
        const response = await MeetingRecordApi.getMeetingRecords(0);
        if (!didCancel) {
          setHistoryState({ isLoading: false, ...response });
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

  const onPracticeNow = (difficulty: Difficulty): void => {
    findPair(pairingSocket, difficulty);
    setIsPairing(true);
  };

  const onLoadMoreRecords = async (): Promise<void> => {
    if (historyState.isLastPage) {
      return;
    }
    const response = await MeetingRecordApi.getMeetingRecords(
      historyState.page + 1,
    );
    const newRecords = [...historyState.records, ...response.records];
    setHistoryState({
      records: newRecords,
      isLastPage: response.isLastPage,
      page: historyState.page + 1,
    });
  };

  const onButtonClick = (): void => {
    if (state === PairingState.FOUND_PAIR) {
      return;
    }
    // We will always do this, just in case
    stopFindingPair(pairingSocket, state !== PairingState.NOT_PAIRING);
    setIsPairing(false);
  };

  const renderModalContent = (): ReactElement => {
    // To prevent the flashing of modal content
    if (isPairing || state !== PairingState.NOT_PAIRING) {
      return (
        <PairingModal
          errorMessage={errorMessage}
          isPairing={isPairing}
          onButtonClick={onButtonClick}
          partnerPhotoUrl={partnerPhotoUrl}
          partnerUsername={partnerUsername}
          state={state}
        />
      );
    }
    return (
      <LeaderboardModal onClose={(): void => setShowLeaderboardModal(false)} />
    );
  };

  const isModalVisible = isPairing || showLeaderboardModal;

  return (
    <Container>
      <div className="home__top">
        <Leaderboard
          {...leaderboardState}
          onHelp={(): void => setShowLeaderboardModal(true)}
        />
        <PracticePanel
          isDisabled={state !== PairingState.NOT_PAIRING}
          isInRoom={isInRoom}
          onNewToProcess={(): void => {
            window.open(HELP);
          }}
          onPracticeNow={onPracticeNow}
        />
      </div>
      <PracticeHistory {...historyState} onSeeMore={onLoadMoreRecords} />
      <Modal isVisible={isModalVisible}>{renderModalContent()}</Modal>
    </Container>
  );
};

export default Home;
