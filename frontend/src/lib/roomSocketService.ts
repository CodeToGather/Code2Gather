import { code2gather } from 'types/protobuf/code2gather';

export const joinRoomService = (socket: WebSocket, roomId: string): void => {
  const joinRoomRequest = new code2gather.JoinRoomRequest({
    room_id: roomId,
  });

  const message = new code2gather.ClientRequest({
    join_room_request: joinRoomRequest,
  });

  socket.send(message.serialize());
};

export const leaveRoomService = (socket: WebSocket, roomId: string): void => {
  const leaveRoomRequest = new code2gather.LeaveRoomRequest({
    room_id: roomId,
  });
  const message = new code2gather.ClientRequest({
    leave_room_request: leaveRoomRequest,
  });

  socket.send(message.serialize());
};
