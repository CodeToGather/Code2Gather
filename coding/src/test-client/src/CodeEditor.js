import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { CodemirrorBinding } from 'y-codemirror';
import { WebrtcProvider } from 'y-webrtc';
import { useCodeMirror } from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import { javascript } from '@codemirror/lang-javascript';
import './EditorAddons';
import RandomColor from 'randomcolor';

export default function CodeEditor() {
  const hasLineNo = true;
  const roomName = 'name';
  const currentUser = 'user';
  const [code, setCode] = useState();
  const editor = useRef();
  const { container, setContainer } = useCodeMirror({
    container: editor.current,
    options: {
      lineNumbers: hasLineNo,
    },
    extensions: [javascript()],
    value: code,
    onchange: (e, data, value) => {
      setCode(value);
    },
  });
  let binding;

  useEffect(() => {
    if (editor.current != null) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  useEffect(() => {
    if (editor.current == null || container == null) return {};
    console.log(container.firstChild.getDoc());
    const sharedDoc = new Y.Doc();
    let provider = null;

    provider = new WebrtcProvider(roomName, sharedDoc, {
      signaling: ['wss://localhost:3001'],
    });
    const text = sharedDoc.getText('key');
    const undoManager = new Y.UndoManager(text);

    provider.awareness.setLocalStateField('user', {
      name: currentUser,
      color: RandomColor(),
    });
    binding = new CodemirrorBinding(text, editor.current, provider.awareness, {
      undoManager,
    });

    return () => {
      if (provider == null) return;
      binding.destroy();
      provider.destroy();
      sharedDoc.destroy();
    };
  }, [editor.current]);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="absolute top-20 bottom-40 left-10 right-10 text-left">
        <h1>Welcome to the code editor</h1>
        <div ref={editor} />
      </div>
    </div>
  );
}
