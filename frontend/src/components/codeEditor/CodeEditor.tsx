import { FC, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import { Ace } from 'ace-builds';

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
  const [hasJustCopiedLine, setHasJustCopiedLine] = useState(false);
  const [lineCopied, setLineCopied] = useState('');
  const [position, setPosition] = useState({ row: 0, column: 0 });
  const ref = useRef<AceEditor | null>(null);

  return (
    <AceEditor
      className={className}
      commands={[
        {
          name: 'customcopylinesdown',
          bindKey: { win: 'Shift-Alt-Down', mac: 'Shift-Option-Down' },
          exec: 'copylinesdown',
        },
        {
          name: 'customcopylinesup',
          bindKey: { win: 'Shift-Alt-Up', mac: 'Shift-Option-Up' },
          exec: 'copylinesup',
        },
        {
          name: 'custompaste',
          bindKey: { win: 'Ctrl-V', mac: 'Cmd-V' },
          exec: 'paste',
        },
        {
          name: 'customcut',
          bindKey: { win: 'Ctrl-X', mac: 'Cmd-X' },
          // This function is actually cached heavily, i.e. we cannot
          // refer to props within this function, because it is still
          // referencing the original props.
          exec: (editor: Ace.Editor): void => {
            const selection = editor.getCopyText();
            if (selection && selection !== '') {
              setHasJustCopiedLine(false);
              setLineCopied('');
              editor.execCommand('cut');
            } else {
              setHasJustCopiedLine(true);
              const value = editor.getValue();
              const row = editor.getCursorPosition().row;
              const line = value.split('\n')[row];
              setLineCopied(line);
              editor.execCommand('removeline');
            }
          },
        },
      ]}
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      height={height}
      mode={language.toLowerCase()}
      name="code-editor"
      onChange={onChange}
      onCopy={(text: string): void => {
        if (text === '') {
          navigator.clipboard.writeText('');
          setHasJustCopiedLine(true);
          const row = position.row;
          const lines = value.split('\n');
          setLineCopied(lines[row]);
        } else {
          setHasJustCopiedLine(false);
          setLineCopied('');
        }
      }}
      onCursorChange={(value): void => {
        setPosition({ row: value.cursor.row, column: value.cursor.column });
      }}
      onPaste={(text: string): void => {
        if ((!text || text === '') && hasJustCopiedLine) {
          const row = position.row;
          const lines = value.split('\n');
          lines.splice(row, 0, lineCopied);
          onChange(lines.join('\n'));
          ref?.current?.editor.execCommand('golinedown');
        }
      }}
      readOnly={readOnly}
      ref={ref}
      showPrintMargin={false}
      theme="twilight"
      value={value}
      width={width}
      wrapEnabled={true}
    />
  );
};

export default CodeEditor;
