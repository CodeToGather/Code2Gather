import axios from 'axios';
import { CONNECT, DISCONNECT } from 'constants/socket';
import { Server } from 'socket.io';
import SidToUid from 'structures/SidToUid';

const setUpIo = (io: Server): void => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    axios
      .get('http://localhost:8001/auth', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error();
        }
        SidToUid.insert(socket.id, res.data.uid as string);
        // Join the room
        socket.join(res.data.uid);
        next();
      })
      .catch((error) => {
        console.log(error);
        next(new Error('Unauthorized'));
      });
  });

  io.on(CONNECT, (socket) => {
    console.log('IO connected');
    // Doesn't seem to be called due to the middleware before
    socket.on(CONNECT, () => console.log('Socket connected!'));

    socket.on(DISCONNECT, () => {
      // TODO: Clean up
      console.log('Disconnected');
    });
  });
  console.log('IO has been set up.');
};

export default setUpIo;
