import axios, { AxiosResponse } from 'axios';
import { Server } from 'socket.io';

import { Difficulty } from 'constants/difficulty';
import {
  CONNECT,
  DISCONNECT,
  ERROR_FIND_PAIR,
  REQ_FIND_PAIR,
  REQ_STOP_FINDING_PAIR,
  RES_CREATED_ROOM,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from 'constants/socket';
import PairingQueue from 'structures/PairingQueue';
import SidUidMap from 'structures/SidUidMap';

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
        SidUidMap.insertUid(socket.id, res.data.uid as string);
        // Join the room
        socket.join(res.data.uid as string);
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

    socket.on(
      REQ_FIND_PAIR,
      async ({ difficulty }: { difficulty: Difficulty }) => {
        const uid = SidUidMap.retrieveUid(socket.id);
        if (uid == null) {
          socket.emit(ERROR_FIND_PAIR, 'Unauthorized');
          return;
        }
        let ratingResponse: AxiosResponse<any, any>;
        try {
          ratingResponse = await axios.get('http://localhost:8002/rating', {
            headers: {
              authorization: uid,
            },
          });
          if (ratingResponse.status !== 200) {
            throw new Error();
          }
        } catch (error) {
          socket.emit(ERROR_FIND_PAIR, 'Something went wrong!');
        }
        const user = {
          uid,
          sid: socket.id,
          difficulty,
          rating: {
            average: ratingResponse!.data.average,
            count: ratingResponse!.data.count,
          },
        };
        const result = PairingQueue.enqueue(user);
        // Let the frontend know we're looking for a pair now.
        socket.emit(RES_FIND_PAIR);

        // We found a match!
        if (result != null) {
          const [user1, user2] = result;
          // Tell the two users we found a match! Going to create the room now.
          io.to(user1.uid).to(user2.uid).emit(RES_FOUND_PAIR);
          const roomResponse = await axios.post('http://localhost:8007', {
            uid1: user1.uid,
            uid2: user2.uid,
            difficulty,
          });
          if (roomResponse.status !== 200) {
            // TODO: Have some more elaborate recovery mechanism
          }
          io.to(user1.uid)
            .to(user2.uid)
            .emit(RES_CREATED_ROOM, { roomId: roomResponse.data.roomId });
        }
      },
    );

    socket.on(REQ_STOP_FINDING_PAIR, async () => {
      const user = SidUidMap.retrieveUser(socket.id);
      if (user == null) {
        throw new Error("You're not enqueued!");
      }
      PairingQueue.remove(user);
    });

    socket.on(DISCONNECT, () => {
      const [uid, user] = SidUidMap.remove(socket.id);
      if (user) {
        PairingQueue.remove(user);
      }
      // Leave the room
      socket.leave(uid);
      console.log('Disconnected');
    });
  });

  console.log('IO has been set up.');
};

export default setUpIo;
