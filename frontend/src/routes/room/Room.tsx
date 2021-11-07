import { FC, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CodeEditor from 'components/codeEditor';
import LanguageDropdown from 'components/languageDropdown';
import LoadingAnimation from 'components/loading/LoadingAnimation';
import Modal from 'components/modal';
import Typography from 'components/typography';
import { HOME } from 'constants/routes';
import { useCodingSocket } from 'contexts/CodingSocketContext';
import {
  changeLanguage,
  executeCode,
  joinRoom,
  leaveRoom,
  updateCode,
} from 'lib/codingSocketService';
import { RootState } from 'reducers/rootReducer';
import { Language } from 'types/crud/language';
import useWindowDimensions from 'utils/hookUtils';
import roomIdUtils from 'utils/roomIdUtils';

import EndTurnModal from './modals/EndTurnModal';
import LeaveRoomModal from './modals/LeaveRoomModal';
import RightPanel from './panel';
import VideoCollection from './video';
import './Room.scss';

const Room: FC = () => {
  const { socket } = useCodingSocket();
  const { doc, language, isExecutingCode, codeExecutionOutput } = useSelector(
    (state: RootState) => state.coding,
  );
  const { isInterviewer, question, partnerUsername, turnsCompleted } =
    useSelector((state: RootState) => state.room);
  const [isPanelShown, setIsPanelShown] = useState(isInterviewer);
  const [isEndingTurn, setIsEndingTurn] = useState(false);
  const [isLeavingRoom, setIsLeavingRoom] = useState(false);
  const [notes, setNotes] = useState('');
  const { height, width } = useWindowDimensions();
  const roomId = roomIdUtils.getRoomId();

  useEffect(() => {
    // TODO: Add logic to redirect back to home if roomId is null
    // This one joins the coding room
    joinRoom(socket, roomId ?? 'default-room-id');
    // TODO: Join the actual room via room WS

    // Clean up
    (): void => {
      leaveRoom(socket);
    };
  }, [socket, roomId]);

  const onCodeChange = (code: string): void => {
    updateCode(socket, doc, code);
  };

  const onExecuteCode = (): void => {
    setIsPanelShown(true);
    executeCode(socket);
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

  const renderModalContent = (): ReactElement => {
    if (isLeavingRoom) {
      return (
        <LeaveRoomModal
          onCancel={(): void => setIsLeavingRoom(false)}
          onLeave={(): void => {
            // This one is for coding service.
            leaveRoom(socket);
            // TODO: Send message to room websocket that we're leaving room.
            window.location.href = HOME;
          }}
        />
      );
    }
    if (isEndingTurn) {
      return (
        <EndTurnModal
          onCancel={(): void => setIsEndingTurn(false)}
          onSolved={(): void => {}}
          onUnsolved={(): void => {}}
          partnerUsername={partnerUsername}
          turnsCompleted={turnsCompleted}
        />
      );
    }
    return <div>Going back to interviewing...</div>;
  };

  const code = doc.text.toString();
  const isModalVisible = isEndingTurn || isLeavingRoom;

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
                  changeLanguage(socket, language);
                }}
              />
              <button className="border-button room--top-left__help-button">
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
              height={getCodeEditorHeight()}
              language={language}
              onChange={onCodeChange}
              value={doc.text.toString()}
              width={getCodeEditorWidth()}
            />
          </div>
        </div>
        {isPanelShown ? (
          <RightPanel
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
