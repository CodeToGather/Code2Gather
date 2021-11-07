import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Question } from 'types/crud/question';

export interface RoomDux {
  roomId: string; // Also persisted into localStorage
  isInterviewer: boolean;
  turnsCompleted: number;
  question: Question | null;
  partnerUid: string;
  partnerUsername: string;
  partnerPhotoUrl: string;
  partnerHasDisconnected: boolean; // Note that this != !partnerHasConnected. This is explicitly used for connection.
  partnerHasLeft: boolean;
  errorMessage: string;
}

const initialState: RoomDux = {
  roomId: '',
  isInterviewer: false,
  turnsCompleted: 0,
  question: null,
  partnerUid: '',
  partnerUsername: '',
  partnerPhotoUrl: '',
  partnerHasDisconnected: false,
  partnerHasLeft: false,
  errorMessage: '',
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
    setErrorMessage: (state, action: PayloadAction<string>): void => {
      state.errorMessage = action.payload;
    },
    setTurnsCompleted: (state, action: PayloadAction<number>): void => {
      state.turnsCompleted = action.payload;
    },
    resetState: (state): void => {
      state.roomId = '';
      state.isInterviewer = false;
      state.question = null;
      state.partnerUid = '';
      state.partnerUsername = '';
      state.partnerPhotoUrl = '';
      state.partnerHasDisconnected = false;
      state.partnerHasLeft = false;
      state.errorMessage = '';
    },
  },
});

export const {
  setPartialRoomInfo,
  setRoomInfo,
  switchRoles,
  setPartnerHasDisconnected,
  setPartnerHasLeft,
  setErrorMessage,
  setTurnsCompleted,
  resetState,
} = room.actions;

export default room.reducer;
