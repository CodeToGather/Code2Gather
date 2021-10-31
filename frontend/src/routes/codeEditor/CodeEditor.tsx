import { FC, useEffect } from 'react';
import AceEditor from 'react-ace';
import { useSelector } from 'react-redux';

import { useCodingSocket } from 'contexts/CodingSocketContext';
import { changeLanguage, joinRoom, updateCode } from 'lib/codingSocketService';
import { RootState } from 'reducers/rootReducer';
import { Language } from 'types/crud/language';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import './theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

import LanguageDropdown from './LanguageDropdown';
import './CodeEditor.scss';

const CodeEditor: FC = () => {
  const { socket } = useCodingSocket();
  const { doc, language } = useSelector((state: RootState) => state.coding);

  useEffect(() => {
    joinRoom(socket, 'default-room-id');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <AceEditor
        mode={language.toLowerCase()}
        name="code-editor"
        onChange={(code): void => onCodeChange(code)}
        showPrintMargin={false}
        theme="twilight"
        value={doc.text.toString()}
        width={'100vw'}
        wrapEnabled={true}
      />
    </div>
  );
};

export default CodeEditor;
