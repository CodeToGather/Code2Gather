/* eslint-disable no-console */
import store from 'app/store';
import {
  partnerHasJoinedRoom,
  RatingSubmissionState,
  resetState,
  setPartnerHasDisconnected,
  setPartnerHasLeft,
  setRatingSubmissionStatus,
  setRoomInfo,
  setShouldKickUser,
  setTurnsCompleted,
  switchRoles,
} from 'reducers/roomDux';
import { Language } from 'types/crud/language';
import { code2gather } from 'types/protobuf/code2gather';
import roomIdUtils from 'utils/roomIdUtils';

import RoomApi from './roomApi';

const languageMap = {
  [Language.PYTHON]: code2gather.Language.PYTHON,
  [Language.JAVA]: code2gather.Language.JAVA,
  [Language.JAVASCRIPT]: code2gather.Language.JAVASCRIPT,
};

export const joinRoomService = (socket: WebSocket, roomId: string): void => {
  const joinRoomRequest = new code2gather.JoinRoomRequest({
    room_id: roomId,
  });

  const message = new code2gather.ClientRequest({
    join_room_request: joinRoomRequest,
  });

  socket.send(message.serialize());
};

export const completeQuestion = (
  socket: WebSocket,
  roomId: string,
  isSolved: boolean,
  feedback: string,
  codeWritten: string,
  language: Language,
): void => {
  const completeQuestionRequest = new code2gather.CompleteQuestionRequest({
    room_id: roomId,
    is_solved: isSolved,
    feedback_to_interviewee: feedback,
    code_written: codeWritten,
    language: languageMap[language],
  });

  const message = new code2gather.ClientRequest({
    complete_question_request: completeQuestionRequest,
  });

  socket.send(message.serialize());
};

export const submitRating = (
  socket: WebSocket,
  roomId: string,
  rating: number,
): void => {
  store.dispatch(setRatingSubmissionStatus(RatingSubmissionState.SUBMITTING));
  const submitRatingRequest = new code2gather.SubmitRatingRequest({
    room_id: roomId,
    rating,
  });

  const message = new code2gather.ClientRequest({
    submit_rating_request: submitRatingRequest,
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

export const initializeSocketForRoom = (socket: WebSocket): void => {
  socket.onmessage = (event): void => {
    console.log(event);
    const messageData = event.data;
    console.log(messageData);
    console.log(window.atob(messageData));
    const message = code2gather.RoomServiceToClientMessage.deserialize(
      window.atob(messageData),
    );
    console.log(message);
    if (message.join_room_response) {
      if (message.join_room_response.error_code !== 0) {
        store.dispatch(setShouldKickUser(true));
        return;
      }
      RoomApi.getQuestion(message.join_room_response.question_id).then(
        (question) => {
          store.dispatch(
            setRoomInfo({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              roomId: roomIdUtils.getRoomId()!,
              turnsCompleted: message.join_room_response.turns_completed,
              isInterviewer: message.join_room_response.is_interviewer,
              question: question,
              partnerUid: message.join_room_response.paired_user.id,
              partnerUsername:
                message.join_room_response.paired_user.github_username,
              partnerPhotoUrl: message.join_room_response.paired_user.photo_url,
            }),
          );
        },
      );
    } else if (message.join_room_broadcast) {
      store.dispatch(partnerHasJoinedRoom());
    } else if (message.disconnect_broadcast) {
      store.dispatch(setPartnerHasDisconnected(true));
    } else if (message.complete_question_response) {
      if (!message.complete_question_response.is_interview_completed) {
        RoomApi.getQuestion(
          message.complete_question_response.next_question_id,
        ).then((question) => {
          store.dispatch(switchRoles(question));
        });
      } else {
        store.dispatch(setTurnsCompleted(2));
      }
    } else if (message.submit_rating_response) {
      // TODO: Handle error
      store.dispatch(
        setRatingSubmissionStatus(RatingSubmissionState.SUBMITTED),
      );
    } else if (message.leave_room_response) {
      // TODO: Handle error
      store.dispatch(resetState());
      roomIdUtils.removeRoomId();
    } else if (message.leave_room_broadcast) {
      store.dispatch(setPartnerHasLeft(true));
    }
  };
};
