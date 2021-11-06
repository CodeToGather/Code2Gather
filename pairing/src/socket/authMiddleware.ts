import { Socket } from 'socket.io';

import SidUidMap from 'structures/SidUidMap';
import { getUid } from 'utils/apiUtils';

export const authMiddleware = (
  socket: Socket,
  next: (err?: Error | undefined) => void,
): void => {
  const token = socket.handshake.auth.token;
  getUid(token)
    .then((uid: string) => {
      SidUidMap.insertUid(socket.id, uid);
      // Join the room
      socket.join(uid);
      next();
    })
    .catch(() => {
      next(new Error('Unauthorized'));
    });
};
