import { FC } from 'react';
import AceEditor from 'react-ace';

import { Language } from 'types/crud/language';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import './theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

interface Props {
  language: Language;
  onChange: (code: string) => void;
  value: string;
  width?: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
}

const CodeEditor: FC<Props> = ({
  language,
  onChange,
  value,
  width,
  height,
  readOnly = false,
  className = '',
}) => {
  return (
    <AceEditor
      className={className}
      commands={[
        {
          name: 'copylinesdown',
          bindKey: { win: 'Shift-Alt-Down', mac: 'Shift-Option-Down' },
          exec: 'copylinesdown',
        },
        {
          name: 'copylinesup',
          bindKey: { win: 'Shift-Alt-Up', mac: 'Shift-Option-Up' },
          exec: 'copylinesup',
        },
      ]}
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      enableSnippets={true}
      height={height}
      mode={language.toLowerCase()}
      name="code-editor"
      onChange={onChange}
      readOnly={readOnly}
      showPrintMargin={false}
      theme="twilight"
      value={value}
      width={width}
      wrapEnabled={true}
    />
  );
};

export default CodeEditor;
