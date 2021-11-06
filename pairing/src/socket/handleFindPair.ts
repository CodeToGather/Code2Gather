import { Server, Socket } from 'socket.io';

import { Difficulty } from 'constants/difficulty';
import {
  ERROR_FIND_PAIR,
  RES_CANNOT_FIND_PAIR,
  RES_FIND_PAIR,
  RES_FOUND_PAIR,
} from 'constants/socket';
import PairingQueue from 'structures/PairingQueue';
import SidUidMap from 'structures/SidUidMap';
import UidCallbackMap from 'structures/UidCallbackMap';
import { createRoom, getRatingData } from 'utils/apiUtils';

type FindPairFunction = (difficulty: Difficulty) => Promise<void>;
const TIMEOUT_DURATION = 30000;

export const handleFindPair = (
  socket: Socket,
  io: Server,
): FindPairFunction => {
  return async (difficulty: Difficulty): Promise<void> => {
    console.log('Socket', socket.id, 'finding pair for', difficulty);
    const uid = SidUidMap.retrieveUid(socket.id);
    if (uid == null) {
      console.log('Unauthorized, cannot find uid.');
      socket.emit(ERROR_FIND_PAIR, 'Unauthorized');
      return;
    }
    if (PairingQueue.isInQueue(uid)) {
      console.log('User already in queue.');
      socket.emit(
        ERROR_FIND_PAIR,
        "You're already in the queue! Check your other tabs and windows!",
      );
      return;
    }

    const ratingData = await getRatingData(uid).catch(() => {
      console.log('Cannot fetch rating data.');
      socket.emit(
        ERROR_FIND_PAIR,
        'Something went wrong when trying to find a partner for you! Please try again later.',
      );
    });
    if (!ratingData) {
      return;
    }

    const user = {
      uid,
      sid: socket.id,
      difficulty,
      rating: {
        average: ratingData.average,
        count: ratingData.count,
      },
      githubUsername: ratingData.githubUsername,
      photoUrl: ratingData.photoUrl,
    };
    SidUidMap.insertUser(socket.id, user);
    let result;
    try {
      result = PairingQueue.enqueue(user);
    } catch {
      socket.emit(
        ERROR_FIND_PAIR,
        'Something went wrong! Please refresh and try again.',
      );
      return;
    }

    // Let the frontend know we're looking for a pair now.
    socket.emit(RES_FIND_PAIR);

    // No match
    if (result == null) {
      console.log('No current match found, setting timeout.');
      const timeout = setTimeout(() => {
        console.log("Shag, couldn't find pair. Removing", uid);
        // Leave the queue
        PairingQueue.remove(user);
        UidCallbackMap.remove(uid);
        socket.emit(RES_CANNOT_FIND_PAIR);
      }, TIMEOUT_DURATION);
      UidCallbackMap.insert(uid, timeout);
      return;
    }

    // We found a match!
    const [user1, user2] = result;
    const roomId = await createRoom(user1.uid, user2.uid, difficulty).catch(
      () => {
        console.log('Failed to create room despite match.');
        // Tell both users that an error occurred.
        // Reason: If we slot them back in again, they will just match again and pass away.
        io.to(user1.uid)
          .to(user2.uid)
          .emit(
            ERROR_FIND_PAIR,
            "We found someone for you, but we couldn't get you a room! Please try again later.",
          );
        // Clear both users' timeout (although only the other user will have it)
        UidCallbackMap.stopAndRemove(user1.uid);
        UidCallbackMap.stopAndRemove(user2.uid);
      },
    );
    if (!roomId) {
      return;
    }
    UidCallbackMap.stopAndRemove(user1.uid);
    UidCallbackMap.stopAndRemove(user2.uid);
    io.to(user1.uid).emit(RES_FOUND_PAIR, {
      roomId,
      partnerUsername: user2.githubUsername,
      partnerPhotoUrl: user2.photoUrl,
    });
    io.to(user2.uid).emit(RES_FOUND_PAIR, {
      roomId,
      partnerUsername: user1.githubUsername,
      partnerPhotoUrl: user1.photoUrl,
    });
    console.log('Match found, timeouts cleared, room created.');
  };
};
