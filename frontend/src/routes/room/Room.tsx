import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import CodeEditor from 'components/codeEditor';
import LanguageDropdown from 'components/languageDropdown';
import { useCodingSocket } from 'contexts/CodingSocketContext';
import { changeLanguage, joinRoom, updateCode } from 'lib/codingSocketService';
import { RootState } from 'reducers/rootReducer';
import { Language } from 'types/crud/language';

import './Room.scss';

const Room: FC = () => {
  const { socket } = useCodingSocket();
  const { doc, language } = useSelector((state: RootState) => state.coding);

  useEffect(() => {
    joinRoom(socket, 'default-room-id');
  }, [socket]);

  const onCodeChange = (code: string): void => {
    updateCode(socket, doc, code);
  };

  return (
    <div className="editor">
      <div className="editor--top">
        <div className="editor--top__left-buttons">
          <LanguageDropdown
            className="editor--top__language-button"
            language={language}
            setLanguage={(language: Language): void => {
              changeLanguage(socket, language);
            }}
          />
          <button className="border-button editor--top__help-button">
            Help <i className="far fa-question-circle" />
          </button>
        </div>
        <div className="editor--top__right-buttons">
          <button className="border-button is-danger editor--top__leave-button">
            Leave Room
          </button>
        </div>
      </div>
      <CodeEditor
        language={language}
        onChange={onCodeChange}
        value={doc.text.toString()}
        width="100vw"
      />
    </div>
  );
};

export default Room;