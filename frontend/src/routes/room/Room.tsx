/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CodeEditor from 'components/codeEditor';
import LanguageDropdown from 'components/languageDropdown';
import LoadingAnimation from 'components/loading/LoadingAnimation';
import Modal from 'components/modal';
import Typography from 'components/typography';
import { HOME } from 'constants/routes';
import { useCodingSocket } from 'contexts/CodingSocketContext';
import { useRoomSocket } from 'contexts/RoomSocketContext';
import {
  changeLanguage,
  executeCode,
  joinCodingService,
  leaveCodingService,
  updateCode,
  updateCursor,
} from 'lib/codingSocketService';
import {
  completeQuestion,
  joinRoomService,
  leaveRoomService,
  submitRating,
} from 'lib/roomSocketService';
import { clearSuggestion, setPosition } from 'reducers/codingDux';
import {
  incrementCheckRoomIdCounter,
  RatingSubmissionState,
  setShouldClearCode,
} from 'reducers/roomDux';
import { RootState } from 'reducers/rootReducer';
import { CursorInformation } from 'types/automerge/cursor';
import { Language } from 'types/crud/language';
import { emptyFunction } from 'utils/functionUtils';
import { useLocalStorage, useWindowDimensions } from 'utils/hookUtils';
import roomIdUtils from 'utils/roomIdUtils';

import DisconnectedModal from './modals/DisconnectedModal';
import EndTurnModal from './modals/EndTurnModal';
import HelpModal from './modals/HelpModal';
import LeaveRoomModal from './modals/LeaveRoomModal';
import LeftModal from './modals/LeftModal';
import RatingModal from './modals/RatingModal';
import RightPanel from './panel';
import VideoCollection from './video';
import './Room.scss';

const Room: FC = () => {
  const { codingSocket } = useCodingSocket();
  const { roomSocket } = useRoomSocket();
  const {
    doc,
    language,
    isExecutingCode,
    codeExecutionOutput,
    shouldShowOutputPanel,
    hasNewExecutionOutput,
    suggestedNextPosition,
    hasSuggestion,
    cursorPosition,
    partnerCursor,
  } = useSelector((state: RootState) => state.coding);
  const {
    isInterviewer,
    question,
    partnerUsername,
    turnsCompleted,
    partnerHasDisconnected,
    partnerHasLeft,
    ratingSubmissionStatus,
    shouldKickUser,
    checkRoomIdCounter,
    shouldClearCode,
  } = useSelector((state: RootState) => state.room);
  const [isPanelShown, setIsPanelShown] = useState(isInterviewer);
  const [isEndingTurn, setIsEndingTurn] = useState(false);
  const [isLeavingRoom, setIsLeavingRoom] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(true);
  const [notes, setNotes] = useLocalStorage('notes', '');
  const { height, width } = useWindowDimensions();
  const roomId = roomIdUtils.getRoomId();
  const dispatch = useDispatch();

  const isInterviewComplete = turnsCompleted === 2;
  const code = doc.text.toString();

  const exitRoom = useCallback((): void => {
    setNotes('');
    leaveCodingService(codingSocket);
    leaveRoomService(roomSocket, roomId!);
  }, [codingSocket, setNotes, roomId, roomSocket]);

  useEffect(() => {
    // This is the mechanism that we will use to leave the room
    // ALL leave rooms will ultimately lead here.
    if (roomId == null) {
      window.location.href = HOME;
      return emptyFunction;
    }
    joinCodingService(codingSocket, roomId);
    if (roomSocket.readyState === WebSocket.OPEN) {
      joinRoomService(roomSocket, roomId);
    }
  }, [
    checkRoomIdCounter,
    codingSocket,
    roomId,
    roomSocket,
    roomSocket.readyState,
  ]);

  useEffect(() => {
    setShowHelpModal(true);
    if (isInterviewer) {
      setIsPanelShown(true);
    }
  }, [isInterviewer]);

  useEffect(() => {
    if (shouldShowOutputPanel) {
      setIsPanelShown(true);
    }
  }, [shouldShowOutputPanel]);

  useEffect(() => {
    if (ratingSubmissionStatus === RatingSubmissionState.SUBMITTED) {
      exitRoom();
    }
  }, [exitRoom, ratingSubmissionStatus]);

  useEffect(() => {
    if (shouldKickUser) {
      // We don't leave room because this user did not join the room in the first place
      setNotes('');
      roomIdUtils.removeRoomId();
      dispatch(incrementCheckRoomIdCounter());
    }
  }, [dispatch, setNotes, shouldKickUser]);

  useEffect(() => {
    if (shouldClearCode) {
      updateCode(codingSocket, doc, '');
      dispatch(setShouldClearCode(false));
    }
  }, [codingSocket, dispatch, doc, shouldClearCode]);

  const onCodeChange = (code: string): void => {
    updateCode(codingSocket, doc, code);
  };

  const onCursorChange = (data: CursorInformation): void => {
    updateCursor(codingSocket, data);
  };

  const onExecuteCode = (): void => {
    setIsPanelShown(true);
    executeCode(codingSocket);
  };

  const getCodeEditorHeight = (): string => {
    const isVertical = width <= 768;
    if (!isVertical || !isPanelShown) {
      return '100%';
    }
    // 95 for top and bottom button panels, 32 for panel border + padding
    const editorHeight = Math.round(height * 0.55 - 95 - 32);
    return `${editorHeight}px`;
  };

  const getCodeEditorWidth = (): string => {
    const isVertical = width <= 768;
    if (isVertical || !isPanelShown) {
      return '100vw';
    }
    // 32 for panel border + padding
    if (width <= 1024) {
      return `${Math.round(0.67 * width) - 32}px`;
    }
    return `${Math.round(0.73 * width) - 32}px`;
  };

  const onCompleteQuestion = (isSolved: boolean): void => {
    completeQuestion(roomSocket, roomId!, isSolved, notes, code, language);
  };

  const renderModalContent = (): ReactElement => {
    if (isInterviewComplete) {
      return (
        <RatingModal
          onRate={(rating: number): void =>
            submitRating(roomSocket, roomId!, rating)
          }
          ratingSubmissionStatus={ratingSubmissionStatus}
        />
      );
    }
    if (partnerHasDisconnected) {
      return (
        <DisconnectedModal
          onLeave={exitRoom}
          partnerHasDisconnected={partnerHasDisconnected}
        />
      );
    }
    if (partnerHasLeft) {
      return <LeftModal onLeave={exitRoom} />;
    }
    if (isLeavingRoom) {
      return (
        <LeaveRoomModal
          onCancel={(): void => setIsLeavingRoom(false)}
          onLeave={exitRoom}
        />
      );
    }
    if (isEndingTurn) {
      return (
        <EndTurnModal
          onCancel={(): void => setIsEndingTurn(false)}
          onSolved={(): void => {
            onCompleteQuestion(true);
            setIsEndingTurn(false);
          }}
          onUnsolved={(): void => {
            onCompleteQuestion(false);
            setIsEndingTurn(false);
          }}
          partnerUsername={partnerUsername}
          turnsCompleted={turnsCompleted}
        />
      );
    }
    if (showHelpModal) {
      return (
        <HelpModal
          isInterviewer={isInterviewer}
          onClose={(): void => setShowHelpModal(false)}
        />
      );
    }
    return <div>Back to interviewing...</div>;
  };

  const isModalVisible =
    isEndingTurn ||
    isLeavingRoom ||
    partnerHasDisconnected ||
    partnerHasLeft ||
    isInterviewComplete ||
    showHelpModal;

  return (
    <div className="room">
      <div className="room--top">
        <div className="room--top-left">
          <div className="room--top-left__controls">
            <div className="room--top-left__left-buttons">
              <LanguageDropdown
                className="room--top-left__language-button"
                language={language}
                setLanguage={(language: Language): void => {
                  changeLanguage(codingSocket, language);
                }}
              />
              <button
                className="border-button room--top-left__help-button"
                onClick={(): void => setShowHelpModal(true)}
              >
                <Typography size="regular">
                  Help <i className="far fa-question-circle" />
                </Typography>
              </button>
            </div>
            <div className="room--top-left__right-buttons">
              <button
                className="border-button is-danger room--top-left__leave-button"
                onClick={(): void => setIsLeavingRoom(true)}
              >
                <Typography size="regular">Leave Room</Typography>
              </button>
            </div>
          </div>
          <div className="room--top-left__editor">
            <CodeEditor
              clearSuggestion={(): void => {
                dispatch(clearSuggestion());
              }}
              hasSuggestion={hasSuggestion}
              height={getCodeEditorHeight()}
              language={language}
              onChange={onCodeChange}
              onCursorChange={onCursorChange}
              partnerCursor={partnerCursor}
              position={cursorPosition}
              setPosition={(position: {
                row: number;
                column: number;
              }): void => {
                dispatch(setPosition(position));
              }}
              suggestedPosition={suggestedNextPosition}
              value={doc.text.toString()}
              width={getCodeEditorWidth()}
            />
          </div>
        </div>
        {isPanelShown ? (
          <RightPanel
            hasNewExecutionOutput={hasNewExecutionOutput}
            isExecutingCode={isExecutingCode}
            isInterviewer={isInterviewer}
            notes={notes}
            onChangeNotes={setNotes}
            onClosePanel={(): void => setIsPanelShown(false)}
            output={codeExecutionOutput}
            question={question}
          />
        ) : null}
        <VideoCollection
          partnerUsername={
            partnerUsername.length > 0 ? partnerUsername : 'Interview Partner'
          }
          roomId={roomId!}
        />
      </div>
      <div className="room--bottom">
        <button
          className="border-button room--bottom__execute-button"
          disabled={code.trim().length === 0 || isExecutingCode}
          onClick={onExecuteCode}
        >
          <Typography
            className="room--bottom__execute-button-text"
            size="regular"
          >
            {isExecutingCode ? 'Executing Code...' : 'Execute Code'}{' '}
            {isExecutingCode ? (
              <LoadingAnimation height={0.7} style={{ opacity: 0.5 }} />
            ) : (
              <i className="fas fa-play" />
            )}
          </Typography>
        </button>
        {isInterviewer ? (
          <button
            className="border-button is-success"
            onClick={(): void => setIsEndingTurn(true)}
          >
            <Typography size="regular">End Turn</Typography>
          </button>
        ) : null}
      </div>
      <Modal isVisible={isModalVisible}>{renderModalContent()}</Modal>
    </div>
  );
};

export default Room;
