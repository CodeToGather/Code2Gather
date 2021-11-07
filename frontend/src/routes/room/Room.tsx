import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CodeEditor from 'components/codeEditor';
import LanguageDropdown from 'components/languageDropdown';
import LoadingAnimation from 'components/loading/LoadingAnimation';
import Typography from 'components/typography';
import { useCodingSocket } from 'contexts/CodingSocketContext';
import {
  changeLanguage,
  executeCode,
  joinRoom,
  updateCode,
} from 'lib/codingSocketService';
import { RootState } from 'reducers/rootReducer';
import { Language } from 'types/crud/language';
import useWindowDimensions from 'utils/hookUtils';

import { mockQuestion } from './mockData';
import RightPanel from './panel';
import VideoCollection from './video';
import './Room.scss';

const Room: FC = () => {
  const { socket } = useCodingSocket();
  const { doc, language, isExecutingCode, codeExecutionOutput } = useSelector(
    (state: RootState) => state.coding,
  );
  const { isInterviewer, question } = useSelector(
    (state: RootState) => state.room,
  );
  const [isPanelShown, setIsPanelShown] = useState(isInterviewer);
  const [notes, setNotes] = useState('');
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    // This one joins the coding room
    joinRoom(socket, 'default-room-id');
    // TODO: Join the actual room via room WS
  }, [socket]);

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

  const code = doc.text.toString();

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
              <button className="border-button is-danger room--top-left__leave-button">
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
            question={question ?? mockQuestion}
          />
        ) : null}
        <VideoCollection />
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
      </div>
    </div>
  );
};

export default Room;
