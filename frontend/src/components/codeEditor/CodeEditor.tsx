import { FC, useEffect, useRef, useState } from 'react';
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
  onChange: (
    code: string,
    lineChange?: { start: number; change: number },
  ) => void;
  // onCursorChange?: (row: number, column: number) => void;
  value: string;
  width?: string;
  height?: string;
  readOnly?: boolean;
  className?: string;
  cachedColumn: number;
  numLinesChange: number;
  numLinesChangeStart: number;
  clearNumLinesChange: () => void;
  position: { row: number; column: number };
  setPosition: (data: { row: number; column: number }) => void;
}

const CodeEditor: FC<Props> = ({
  language,
  onChange,
  value,
  width,
  height,
  readOnly = false,
  className = '',
  numLinesChange,
  numLinesChangeStart,
  clearNumLinesChange,
  cachedColumn,
  position,
  setPosition,
}) => {
  const [hasJustCopiedLine, setHasJustCopiedLine] = useState(false);
  const [lineCopied, setLineCopied] = useState('');
  const ref = useRef<AceEditor | null>(null);
  const [previousNumLines, setPreviousNumLines] = useState(
    value.split('\n').length,
  );

  useEffect(() => {
    if (numLinesChange > 0) {
      if (numLinesChangeStart < position.row) {
        ref?.current?.editor.moveCursorTo(
          position.row + numLinesChange,
          cachedColumn,
        );
      }
      clearNumLinesChange();
    }
  }, [
    cachedColumn,
    clearNumLinesChange,
    numLinesChange,
    numLinesChangeStart,
    position.column,
    position.row,
  ]);

  const onChangeWrapper = (code: string): void => {
    const newNumLines = code.split('\n').length;
    const difference = newNumLines - previousNumLines;
    let lineChange;
    // Can be +ve or -nve
    if (difference !== 0) {
      lineChange = {
        start: Math.max(position.row - difference, 0),
        change: difference,
      };
    }
    onChange(code, lineChange);
    setPreviousNumLines(newNumLines);
  };

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
            editor.execCommand('copy');
            if (!selection || selection === '') {
              editor.execCommand('removeline');
            } else {
              editor.execCommand('del');
            }
          },
        },
      ]}
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      height={height}
      mode={language.toLowerCase()}
      name="code-editor"
      onChange={onChangeWrapper}
      onCopy={(text: string): void => {
        if (!text || text === '') {
          navigator.clipboard.writeText('');
          setHasJustCopiedLine(true);
          const row = position.row;
          const lines = value.split('\n');
          setLineCopied(lines[row]);
        } else {
          navigator.clipboard.writeText(text);
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
      // Disable so that we can efficiently compute the line changes
      setOptions={{ enableMultiselect: false }}
      showPrintMargin={false}
      theme="twilight"
      value={value}
      width={width}
      wrapEnabled={true}
    />
  );
};

export default CodeEditor;
