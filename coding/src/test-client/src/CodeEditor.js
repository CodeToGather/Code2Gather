import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import P2P from 'socket.io-p2p';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import './EditorAddons';

export default function CodeEditor() {
  const hasLineNo = true;
  const [code, setCode] = useState();
  const [socket, setSocket] = useState();

  useEffect(() => {
    const s = io('http://localhost:3001');
    const p2p = new P2P(s);
    setSocket(p2p);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        socket.emit('join', 'code-editor');
      });
      socket.on('code', (c) => {
        setCode(c);
      });
    }
  }, [socket]);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="absolute top-20 bottom-40 left-10 right-10 text-left">
        <h1>Welcome to the code editor</h1>
        <CodeMirror
          value={code}
          theme="monokai"
          onChange={(value) => {
            console.log(value);
            setCode(value);
            socket.emit('code', value);
          }}
          autoScroll
          options={{
            mode: 'text/x-python',
            lineNumbers: hasLineNo,
            lineWrapping: true,
            smartIndent: true,
            foldGutter: true,
            tabSize: 2,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            autoCloseTags: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            extraKeys: {
              'Ctrl-Space': 'autocomplete',
            },
          }}
        />
      </div>
    </div>
  );
}
