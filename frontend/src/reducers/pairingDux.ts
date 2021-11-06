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
}

const initialState: PairingDux = {
  state: PairingState.NOT_PAIRING,
  errorMessage: '',
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
    },
    resetState: (state): void => {
      state.state = PairingState.NOT_PAIRING;
      state.errorMessage = '';
    },
  },
});

export const { setPairingState, resetState } = pairing.actions;

export default pairing.reducer;
