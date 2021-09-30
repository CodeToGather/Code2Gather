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
      <div className="select">
        <select onBlur={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
        </select>
      </div>
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
