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

import RightPanel from './panel';
import VideoCollection from './video';
import './Room.scss';

const Room: FC = () => {
  const { socket } = useCodingSocket();
  const { doc, language, isExecutingCode, isCodeOutputPanelShown } =
    useSelector((state: RootState) => state.coding);
  const { isInterviewer } = useSelector((state: RootState) => state.room);
  const [isPanelShown, _setIsPanelShown] = useState(
    isCodeOutputPanelShown || !isInterviewer,
  );

  useEffect(() => {
    joinRoom(socket, 'default-room-id');
  }, [socket]);

  const onCodeChange = (code: string): void => {
    updateCode(socket, doc, code);
  };

  const onExecuteCode = (): void => {
    executeCode(socket);
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
          <CodeEditor
            className="room--top-left__editor"
            language={language}
            onChange={onCodeChange}
            value={doc.text.toString()}
          />
        </div>
        {isPanelShown ? <RightPanel /> : null}
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
