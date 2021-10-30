/* eslint-disable no-console */
import { FC, useEffect, useReducer, useState } from 'react';
import AceEditor from 'react-ace';
import { Doc, load, save } from 'automerge';

import { useCodingSocket } from 'contexts/CodingSocketContext';
import { useUser } from 'contexts/UserContext';
import { Editor, TextDoc } from 'types/automerge';
import { Language } from 'types/crud/language';
import {
  applyChanges,
  changeTextDoc,
  getChanges,
  hasUnsyncedChanges,
  initDocWithText,
} from 'utils/automergeUtils';

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
  const { socket } = useCodingSocket();
  const user = useUser();
  const initDoc = initDocWithText(user?.id ?? 'hello-world', '');

  const [state, setState] = useReducer(
    (s: Editor, a: Partial<Editor>) => ({ ...s, ...a }),
    {
      doc: initDoc,
      code: initDoc.text.toString(),
      lastSyncedDoc: initDoc,
    },
  );

  useEffect(() => {
    socket.emit('join', {
      id: 'hardcoded-room-id',
      doc: JSON.stringify(save(initDoc)),
    });
    socket.on('joined', (data: string) => {
      const loadedDoc: Doc<TextDoc> = load(JSON.parse(data));
      console.log('loaded doc', loadedDoc);
      setState({
        doc: loadedDoc,
        code: loadedDoc.text.toString(),
        lastSyncedDoc: loadedDoc,
      });
    });
    socket.on('change', (changes: string) => {
      console.log('changes', JSON.parse(changes));
      console.log('state', state);
      const newState = applyChanges(state, JSON.parse(changes));
      console.log('new state', newState);
      if (!hasUnsyncedChanges(state.lastSyncedDoc, state.doc)) {
        setState({
          ...newState,
          lastSyncedDoc: newState.doc,
        });
      } else {
        setState({ ...newState });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCodeChange = (code: string): void => {
    const newDoc = changeTextDoc(state.doc, code);
    const newState = { ...state, doc: newDoc, code: newDoc.text.toString() };
    const changes = getChanges(newState);
    socket.emit('change', JSON.stringify(changes));
    setState({ ...newState, lastSyncedDoc: newState.doc });
  };

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
        onChange={onCodeChange}
        showPrintMargin={false}
        theme="twilight"
        value={state.code}
        width={'100vw'}
        wrapEnabled={true}
      />
    </div>
  );
};

export default CodeEditor;
