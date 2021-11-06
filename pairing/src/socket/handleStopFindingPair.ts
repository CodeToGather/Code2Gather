import { Server, Socket } from 'socket.io';

import PairingQueue from 'structures/PairingQueue';
import SidUidMap from 'structures/SidUidMap';
import UidCallbackMap from 'structures/UidCallbackMap';

type StopFindingPairFunction = () => Promise<void>;

export const handleStopFindingPair = (
  socket: Socket,
  _io: Server,
): StopFindingPairFunction => {
  return async (): Promise<void> => {
    console.log('Socket', socket.id, 'wants to stop finding pair.');
    const user = SidUidMap.retrieveUser(socket.id);
    const uid = SidUidMap.retrieveUid(socket.id);
    if (uid) {
      UidCallbackMap.stopAndRemove(uid);
    }
    if (user == null) {
      // Fail silently for now. Can look into better
      // error handling in the future.
      return;
    }
    console.log('User', user.uid, 'removed from queue.');
    PairingQueue.remove(user);
  };
};
