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
  readOnly?: boolean;
}

const CodeEditor: FC<Props> = ({
  language,
  onChange,
  value,
  width,
  readOnly = false,
}) => {
  return (
    <AceEditor
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
