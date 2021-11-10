import { FC } from 'react';
import AceEditor from 'react-ace';

import { Language } from 'types/crud/language';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import './theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

import './CodeEditor.scss';

interface Props {
  language: Language;
  value: string;
  width?: string;
  height?: string;
  className?: string;
}

const ReadOnlyCodeEditor: FC<Props> = ({
  language,
  value,
  width,
  height,
  className = '',
}) => {
  return (
    <AceEditor
      className={className}
      height={height}
      mode={language.toLowerCase()}
      name="code-editor"
      readOnly={true}
      showPrintMargin={false}
      theme="twilight"
      value={value}
      width={width}
      wrapEnabled={true}
    />
  );
};

export default ReadOnlyCodeEditor;
