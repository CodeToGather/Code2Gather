import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum PairingState {
  NOT_PAIRING,
  STARTED_PAIRING,
  FINDING_PAIR,
  FOUND_PAIR,
  CREATED_ROOM,
  ERROR,
}

export interface PairingDux {
  state: PairingState;
  errorMessage: string;
  roomId: number;
}

const initialState: PairingDux = {
  state: PairingState.NOT_PAIRING,
  errorMessage: '',
  roomId: -1,
};

const pairing = createSlice({
  name: 'pairing',
  initialState,
  reducers: {
    setPairingState: (
      state,
      action: PayloadAction<Partial<PairingDux>>,
    ): void => {
      state.state = action.payload.state ?? state.state;
      state.errorMessage = action.payload.errorMessage ?? state.errorMessage;
      state.roomId = action.payload.roomId ?? state.roomId;
    },

    resetState: (state): void => {
      state.state = PairingState.NOT_PAIRING;
      state.errorMessage = '';
      state.roomId = -1;
    },
  },
});

export const { setPairingState, resetState } = pairing.actions;

export default pairing.reducer;
