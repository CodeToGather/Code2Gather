/* eslint-disable no-console */
import React, { useEffect } from 'react';

import { code2gather } from 'types/protobuf/code2gather';
import tokenUtils from 'utils/tokenUtils';

export default interface SocketContextInterface {
  roomSocket: WebSocket;
}

const RoomSocketContext = React.createContext<
  SocketContextInterface | undefined
>(undefined);

const RoomSocketProvider: React.FunctionComponent = (props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roomSocket = new WebSocket(
    `${process.env.REACT_APP_BACKEND_WS_API}/roomws/${tokenUtils.getToken()}`,
  );

  useEffect(() => {
    roomSocket.onopen = (_event): void => {
      console.log('Room socket connected!');
    };
    roomSocket.onmessage = (event): void => {
      console.log(event);
      const messageData = event.data;
      const message =
        code2gather.RoomServiceToClientMessage.deserialize(messageData);
      if (message.join_room_response) {
        // Handle join room response
      } else if (message.join_room_broadcast) {
        // Handle other person join room
      } else if (message.disconnect_broadcast) {
        // Handle other person disconnects
      } else if (message.complete_question_response) {
        // Handle complete question response
      } else if (message.submit_rating_response) {
        // Handle submit rating event
      } else if (message.leave_room_response) {
        // Handle leave room event
      } else if (message.leave_room_broadcast) {
        // Handle other person leave room
      }
    };

    return (): void => {
      roomSocket.close();
    };
  }, [roomSocket]);

  return <RoomSocketContext.Provider value={{ roomSocket }} {...props} />;
};

const useRoomSocket = (): SocketContextInterface => {
  const context = React.useContext(RoomSocketContext);
  if (context === undefined) {
    throw new Error(
      'useCodingSocket must be used within a CodingSocketProvider',
    );
  }
  return context;
};

export { RoomSocketProvider, useRoomSocket };
