import { FC, useState } from 'react';
import AceEditor from 'react-ace';
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
  const [language, setLanguage] = useState<Language>(Language.PYTHON);
  Language;

  return (
    <div className="editor">
      <div className="editor--top">
        <div className="editor--top__left-buttons">
          <LanguageDropdown
            className="editor--top__language-button"
            language={language}
            setLanguage={setLanguage}
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
        showPrintMargin={false}
        theme="twilight"
        width={'100vw'}
        wrapEnabled={true}
      />
    </div>
  );
};

export default CodeEditor;
