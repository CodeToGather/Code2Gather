import store from 'app/store';
import {
  partnerHasJoinedRoom,
  RatingSubmissionState,
  resetState,
  setPartnerHasDisconnected,
  setPartnerHasLeft,
  setRatingSubmissionStatus,
  setRoomInfo,
  setTurnsCompleted,
  switchRoles,
} from 'reducers/roomDux';
import { Difficulty } from 'types/crud/difficulty';
import { Language } from 'types/crud/language';
import { Question } from 'types/crud/question';
import { code2gather } from 'types/protobuf/code2gather';
import roomIdUtils from 'utils/roomIdUtils';

const languageMap = {
  [Language.PYTHON]: code2gather.Language.PYTHON,
  [Language.JAVA]: code2gather.Language.JAVA,
  [Language.JAVASCRIPT]: code2gather.Language.JAVASCRIPT,
};

const difficultyMap = {
  [code2gather.QuestionDifficulty.EASY]: Difficulty.EASY,
  [code2gather.QuestionDifficulty.MEDIUM]: Difficulty.HARD,
  [code2gather.QuestionDifficulty.HARD]: Difficulty.MEDIUM,
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
    // eslint-disable-next-line no-console
    console.log(event);
    const messageData = event.data;
    const message =
      code2gather.RoomServiceToClientMessage.deserialize(messageData);
    if (message.join_room_response) {
      store.dispatch(
        setRoomInfo({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          roomId: roomIdUtils.getRoomId()!,
          turnsCompleted: message.join_room_response.turns_completed,
          isInterviewer: message.join_room_response.is_interviewer,
          question: convertQuestion(message.join_room_response.question),
          partnerUid: message.join_room_response.paired_user.id,
          partnerUsername:
            message.join_room_response.paired_user.github_username,
          partnerPhotoUrl: message.join_room_response.paired_user.photo_url,
        }),
      );
    } else if (message.join_room_broadcast) {
      store.dispatch(partnerHasJoinedRoom());
    } else if (message.disconnect_broadcast) {
      store.dispatch(setPartnerHasDisconnected(true));
    } else if (message.complete_question_response) {
      if (!message.complete_question_response.is_interview_completed) {
        store.dispatch(
          switchRoles(
            convertQuestion(message.complete_question_response.next_question),
          ),
        );
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

const convertQuestion = (question: code2gather.QuestionMessage): Question => {
  return {
    id: question.id,
    title: question.title,
    text: question.text,
    hints: question.hints,
    difficulty: difficultyMap[question.difficulty],
  };
};
