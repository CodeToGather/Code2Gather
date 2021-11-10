import { FC, useCallback, useEffect, useRef, useState } from 'react';
import AceEditor, { IMarker } from 'react-ace';
import { Ace } from 'ace-builds';

import { CursorInformation } from 'types/automerge/cursor';
import { Language } from 'types/crud/language';
import { emptyFunction } from 'utils/functionUtils';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import './theme-twilight';
import 'ace-builds/src-noconflict/ext-language_tools';

import './CodeEditor.scss';

interface Props {
  language: Language;
  onChange: (code: string) => void;
  onCursorChange?: (data: CursorInformation) => void;
  value: string;
  width?: string;
  height?: string;
  className?: string;
  hasSuggestion: boolean;
  clearSuggestion: () => void;
  suggestedPosition: { row: number; column: number };
  position: { row: number; column: number };
  setPosition: (data: { row: number; column: number }) => void;
  partnerCursor?: CursorInformation;
}

const CodeEditor: FC<Props> = ({
  language,
  onChange,
  onCursorChange = emptyFunction,
  value,
  width,
  height,
  className = '',
  hasSuggestion,
  clearSuggestion,
  suggestedPosition,
  position,
  setPosition,
  partnerCursor,
}) => {
  const [hasJustCopiedLine, setHasJustCopiedLine] = useState(false);
  const [lineCopied, setLineCopied] = useState('');
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const ref = useRef<AceEditor | null>(null);

  useEffect(() => {
    if (hasSuggestion) {
      ref?.current?.editor.moveCursorTo(
        suggestedPosition.row,
        suggestedPosition.column,
      );
      clearSuggestion();
    }
  }, [
    clearSuggestion,
    hasSuggestion,
    suggestedPosition.column,
    suggestedPosition.row,
  ]);

  const updateMarkers = useCallback(() => {
    if (partnerCursor) {
      const isNotSelection =
        partnerCursor.startRow === partnerCursor.endRow &&
        partnerCursor.startCol === partnerCursor.endCol;
      setMarkers([
        {
          ...partnerCursor,
          endCol: isNotSelection
            ? partnerCursor.endCol + 1
            : partnerCursor.endCol,
          className: `marker${isNotSelection ? ' is-single' : ''}`,
          type: 'text',
        },
      ]);
    }
  }, [partnerCursor]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

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
      markers={markers}
      mode={language.toLowerCase()}
      name="code-editor"
      onChange={onChange}
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
        onCursorChange({
          startRow: value.cursor.row,
          startCol: value.cursor.column,
          endRow: value.cursor.row,
          endCol: value.cursor.column,
        });
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
      onSelectionChange={(value): void => {
        const { anchor, cursor } = value;
        onCursorChange({
          startRow: Math.min(anchor.row, cursor.row),
          startCol: Math.min(anchor.column, cursor.column),
          endRow: Math.max(cursor.row, anchor.row),
          endCol: Math.max(cursor.column, anchor.column),
        });
      }}
      ref={ref}
      // Disable so that we can efficiently compute the line changes
      setOptions={{ enableMultiselect: false, showFoldWidgets: false }}
      showPrintMargin={false}
      theme="twilight"
      value={value}
      width={width}
      wrapEnabled={true}
    />
  );
};

export default CodeEditor;
