const socketIdToRoomId = {};
const roomIdToDoc = {};

const setUpIo = (io) => {
  io.on('connect', (socket) => {
    console.log('IO connected');
    // Doesn't seem to be called due to the middleware before
    socket.on('connect', () => console.log('Socket connected!'));
    socket.on('join', ({ id, doc }) => {
      console.log(id);
      socket.join(id);
      socketIdToRoomId[socket.id] = id;
      if (roomIdToDoc[id]) {
        socket.emit('joined', roomIdToDoc[id]);
      } else {
        roomIdToDoc[id] = doc;
      }
    });
    socket.on('change', (changes) => {
      if (!socketIdToRoomId[socket.id]) {
        console.log('Missing room!');
        return;
      }
      console.log(changes);
      socket.to(socketIdToRoomId[socket.id]).emit('change', changes);
    });
    socket.on('disconnect', () => {
      if (socketIdToRoomId[socket.id]) {
        socket.leave(socketIdToRoomId[socket.id]);
      }
    });
  });
  console.log('IO has been set up.');
};

module.exports = setUpIo;
