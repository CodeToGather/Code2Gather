import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import '@codemirror/lang-javascript';

const AutoMerge = require('automerge');

export default function CodeEditor() {
  const [code, setCode] = useState();
  const [socket, setSocket] = useState();

  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || code == null) return;
    const handler = (document) => {
      if (document == null) return;
      const t = AutoMerge.load(new Uint8Array(document));
      setCode(t);
    };

    socket.once('set-document', handler);
  }, [socket]);

  useEffect(() => {
    if (socket == null || code == null) return {};
    const handler = (changes) => {
      if (changes == null) return;
      setCode(AutoMerge.applyChanges(code, new Uint8Array(changes)));
    };
    socket.on('receive-changes', handler);
    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket]);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="absolute top-20 bottom-40 left-10 right-10 text-left">
        <div>Welcome to the code editor</div>
        <CodeMirror
          value={code == null ? '' : code}
          options={{
            mode: 'jsx',
            theme: 'monokai',
            keyMap: 'sublime',
          }}
          onChange={(editor) => {
            if (socket == null || code == null || editor == null) {
              return;
            }

            // Text of the editor
            const c = AutoMerge.change(code, 'Update Code', (doc) => {
              const d = doc;
              d.code = editor.toString();
            });
            const changes = AutoMerge.getLastLocalChange(c);
            socket.emit('text-change', changes);
            setCode(c);
          }}
        />
      </div>
    </div>
  );
}
