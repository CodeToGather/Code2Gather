import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Question } from 'types/crud/question';

export enum RatingSubmissionState {
  NOT_SUBMITTING,
  SUBMITTING,
  SUBMITTED,
}

export interface RoomDux {
  roomId: string; // Also persisted into localStorage
  shouldKickUser: boolean;
  isInterviewer: boolean;
  turnsCompleted: number;
  question: Question | null;
  partnerUid: string;
  partnerUsername: string;
  partnerPhotoUrl: string;
  partnerHasDisconnected: boolean; // Note that this != !partnerHasConnected. This is explicitly used for connection.
  partnerHasLeft: boolean;
  ratingSubmissionStatus: RatingSubmissionState;
  errorMessage: string;
  checkRoomIdCounter: number; // Is basically a counter that we'll keep incrementing in order to trigger room's useEffect
  shouldClearCode: boolean;
}

const initialState: RoomDux = {
  roomId: '',
  shouldKickUser: false,
  isInterviewer: false,
  turnsCompleted: 0,
  question: null,
  partnerUid: '',
  partnerUsername: '',
  partnerPhotoUrl: '',
  partnerHasDisconnected: false,
  partnerHasLeft: false,
  ratingSubmissionStatus: RatingSubmissionState.NOT_SUBMITTING,
  errorMessage: '',
  checkRoomIdCounter: 0,
  shouldClearCode: false,
};

const room = createSlice({
  name: 'room',
  initialState,
  reducers: {
    // Used by pairing socket service
    setPartialRoomInfo: (
      state,
      action: PayloadAction<{
        roomId: string;
        partnerUsername: string;
        partnerPhotoUrl: string;
      }>,
    ): void => {
      state.roomId = action.payload.roomId;
      state.partnerUsername = action.payload.partnerUsername;
      state.partnerPhotoUrl = action.payload.partnerPhotoUrl;
    },
    setRoomInfo: (
      state,
      action: PayloadAction<{
        roomId: string;
        isInterviewer: boolean;
        turnsCompleted: number;
        question: Question;
        partnerUid: string;
        partnerUsername: string;
        partnerPhotoUrl: string;
      }>,
    ): void => {
      state.roomId = action.payload.roomId;
      state.isInterviewer = action.payload.isInterviewer;
      state.turnsCompleted = action.payload.turnsCompleted;
      state.question = action.payload.question;
      state.partnerUid = action.payload.partnerUid;
      state.partnerUsername = action.payload.partnerUsername;
      state.partnerPhotoUrl = action.payload.partnerPhotoUrl;
    },
    setShouldKickUser: (state, action: PayloadAction<boolean>): void => {
      state.shouldKickUser = action.payload;
    },
    switchRoles: (state, action: PayloadAction<Question>): void => {
      state.isInterviewer = !state.isInterviewer;
      state.question = action.payload;
      state.turnsCompleted = 1; // Invariant
    },
    setPartnerHasDisconnected: (
      state,
      action: PayloadAction<boolean>,
    ): void => {
      state.partnerHasDisconnected = action.payload;
    },
    setPartnerHasLeft: (state, action: PayloadAction<boolean>): void => {
      state.partnerHasLeft = action.payload;
    },
    partnerHasJoinedRoom: (state): void => {
      state.partnerHasDisconnected = false;
      state.partnerHasLeft = false;
    },
    setErrorMessage: (state, action: PayloadAction<string>): void => {
      state.errorMessage = action.payload;
    },
    setTurnsCompleted: (state, action: PayloadAction<number>): void => {
      state.turnsCompleted = action.payload;
    },
    setRatingSubmissionStatus: (
      state,
      action: PayloadAction<RatingSubmissionState>,
    ): void => {
      state.ratingSubmissionStatus = action.payload;
    },
    incrementCheckRoomIdCounter: (state): void => {
      state.checkRoomIdCounter += 1;
    },
    setShouldClearCode: (state, action: PayloadAction<boolean>): void => {
      state.shouldClearCode = action.payload;
    },
    resetState: (state): void => {
      state.roomId = '';
      state.shouldKickUser = false;
      state.isInterviewer = false;
      state.question = null;
      state.partnerUid = '';
      state.partnerUsername = '';
      state.partnerPhotoUrl = '';
      state.partnerHasDisconnected = false;
      state.partnerHasLeft = false;
      state.ratingSubmissionStatus = RatingSubmissionState.NOT_SUBMITTING;
      state.errorMessage = '';
      state.checkRoomIdCounter = 0;
      state.shouldClearCode = false;
    },
  },
});

export const {
  setPartialRoomInfo,
  setRoomInfo,
  setShouldKickUser,
  switchRoles,
  setPartnerHasDisconnected,
  partnerHasJoinedRoom,
  setPartnerHasLeft,
  setErrorMessage,
  setTurnsCompleted,
  setRatingSubmissionStatus,
  incrementCheckRoomIdCounter,
  setShouldClearCode,
  resetState,
} = room.actions;

export default room.reducer;
