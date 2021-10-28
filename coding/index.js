const p2p = require('socket.io-p2p-server').Server;

const io = require('socket.io')(3001, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.use(p2p);

io.on('connection', (socket) => {
  socket.on('peer-msg', (data) => {
    console.log('Message from peer: %s', data);
    socket.broadcast.emit('peer-msg', data);
  });

  socket.on('go-private', (data) => {
    socket.broadcast.emit('go-private', data);
  });
});
