import { FC, useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import './theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

import './CodeEditor.scss';

const CodeEditor: FC = () => {
  const [language, setLanguage] = useState('python');

  return (
    <div>
      <select
        className="form-control"
        id="languageSelect"
        onBlur={(event) => {
          console.log(event.target.value);
          setLanguage(event.target.value);
        }}
      >
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="javascript">JavaScript</option>
      </select>
      <AceEditor
        height={'100vh'}
        mode={language}
        name="code-editor"
        showPrintMargin={false}
        theme="twilight"
        width={'100vw'}
      />
    </div>
  );
};

export default CodeEditor;
