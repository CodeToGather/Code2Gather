import { Server, Socket } from 'socket.io';

import PairingQueue from 'structures/PairingQueue';
import SidUidMap from 'structures/SidUidMap';
import UidCallbackMap from 'structures/UidCallbackMap';

type DisconnectFunction = () => Promise<void>;

export const handleDisconnect = (
  socket: Socket,
  _io: Server,
): DisconnectFunction => {
  return async (): Promise<void> => {
    console.log('Socket', socket.id, 'is disconnecting.');
    const [uid, user] = SidUidMap.remove(socket.id);
    if (user) {
      console.log('User', user.uid, 'removed from queue.');
      PairingQueue.remove(user);
    }
    UidCallbackMap.stopAndRemove(uid);
    socket.leave(uid);
    console.log('Socket', socket.id, 'has disconnected.');
  };
};
