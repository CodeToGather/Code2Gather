const Automerge = require('automerge');

let result = Automerge.from({
  code: new Automerge.Text('print("Hello World")'),
});

const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  socket.on('text-change', (changes) => {
    console.log(changes);
    result = Automerge.applyChanges(result, new Uint8Array(changes));
    console.log(result);
    socket.broadcast.emit('receive-changes', changes);
  });
  console.log('connected');
  socket.emit('set-document', Automerge.save(result));
  console.log('sent');
});
