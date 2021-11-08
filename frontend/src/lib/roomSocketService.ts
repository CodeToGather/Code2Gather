/* eslint-disable no-console */
import store from 'app/store';
import {
  incrementCheckRoomIdCounter,
  partnerHasJoinedRoom,
  RatingSubmissionState,
  setPartnerHasDisconnected,
  setPartnerHasLeft,
  setRatingSubmissionStatus,
  setRoomInfo,
  setShouldClearCode,
  setShouldKickUser,
  setTurnsCompleted,
  switchRoles,
} from 'reducers/roomDux';
import { Difficulty } from 'types/crud/difficulty';
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
  console.log('Joining room:', roomId);
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
  console.log('Completing question...');
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
  console.log('Submitting rating:', rating);
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
  console.log('Leaving room', roomId);
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
      new Uint8Array(
        [...window.atob(messageData)].map((char) => char.charCodeAt(0)),
      ),
    );
    console.log(message);

    if (message.join_room_response) {
      console.log('Join room response');
      if (
        message.join_room_response.error_code != null &&
        message.join_room_response.error_code !== 0
      ) {
        console.log('Join room response error');
        store.dispatch(setShouldKickUser(true));
        return;
      }
      console.log('Join room response success');
      RoomApi.getQuestion(message.join_room_response.question_id).then(
        (question) => {
          store.dispatch(
            setRoomInfo({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              roomId: roomIdUtils.getRoomId()!,
              turnsCompleted: message.join_room_response.turns_completed ?? 0,
              isInterviewer: message.join_room_response.is_interviewer ?? false,
              question: {
                ...question,
                difficulty: question.difficulty ?? Difficulty.EASY,
              },
              partnerUid: message.join_room_response.paired_user.id ?? '',
              partnerUsername:
                message.join_room_response.paired_user.github_username ?? '',
              partnerPhotoUrl:
                message.join_room_response.paired_user.photo_url ?? '',
            }),
          );
        },
      );
    } else if (message.join_room_broadcast) {
      console.log('Join room broadcast');
      store.dispatch(partnerHasJoinedRoom());
    } else if (message.disconnect_broadcast) {
      console.log('Disconnect broadcast');
      store.dispatch(setPartnerHasDisconnected(true));
    } else if (message.complete_question_response) {
      console.log('Complete question response');
      if (!message.complete_question_response.is_interview_completed) {
        console.log('1 more turn left');
        RoomApi.getQuestion(
          message.complete_question_response.next_question_id,
        ).then((question) => {
          store.dispatch(
            switchRoles({
              ...question,
              difficulty: question.difficulty ?? Difficulty.EASY,
            }),
          );
          store.dispatch(setShouldClearCode(true));
        });
      } else {
        console.log('No more turns left');
        store.dispatch(setTurnsCompleted(2));
      }
    } else if (message.submit_rating_response) {
      console.log('Submit rating response');
      if (
        message.submit_rating_response.error_code != null &&
        message.submit_rating_response.error_code !== 0
      ) {
        // TODO: Improve error handling
        console.log('Submit rating response error');
        return;
      }
      console.log('Submit rating response success');
      store.dispatch(
        setRatingSubmissionStatus(RatingSubmissionState.SUBMITTED),
      );
    } else if (message.leave_room_response) {
      console.log('Leave room response');
      if (
        message.leave_room_response.error_code != null &&
        message.leave_room_response.error_code !== 0
      ) {
        // TODO: Improve error handling
        console.log('Leave room response error');
        return;
      }
      console.log('Leave room response success');
      roomIdUtils.removeRoomId();
      store.dispatch(incrementCheckRoomIdCounter());
    } else if (message.leave_room_broadcast) {
      console.log('Leave room broadcast');
      store.dispatch(setPartnerHasLeft(true));
    }
  };
};
