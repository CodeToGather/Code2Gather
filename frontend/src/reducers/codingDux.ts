import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Automerge from 'automerge';

import { TextDoc } from 'types/automerge';
import { Language } from 'types/crud/language';
import { initDocWithText } from 'utils/automergeUtils';

export interface CodingDux {
  doc: Automerge.Doc<TextDoc>;
  language: Language;
  isExecutingCode: boolean;
  codeExecutionOutput: string;
  isCodeOutputPanelShown: boolean;
}

const initialState: CodingDux = {
  doc: initDocWithText(''),
  language: Language.PYTHON,
  isExecutingCode: false,
  codeExecutionOutput: '',
  isCodeOutputPanelShown: false,
};

const coding = createSlice({
  name: 'coding',
  initialState,
  reducers: {
    setDoc: (state, action: PayloadAction<Automerge.Doc<TextDoc>>): void => {
      state.doc = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>): void => {
      state.language = action.payload;
    },
    setIsExecutingCodeAsTrue: (state): void => {
      state.codeExecutionOutput = 'Executing code...';
      state.isExecutingCode = true;
      state.isCodeOutputPanelShown = true;
    },
    setCodeExecutionOutput: (state, action: PayloadAction<string>): void => {
      state.isExecutingCode = false;
      state.isCodeOutputPanelShown = true;
      state.codeExecutionOutput = action.payload;
    },
    closeCodeOutputPanel: (state): void => {
      // We won't clear the output - will be done on the next execution
      state.isCodeOutputPanelShown = false;
    },
    applyChanges: (
      state,
      action: PayloadAction<Automerge.BinaryChange[]>,
    ): void => {
      const [newDoc] = Automerge.applyChanges(
        Automerge.clone(state.doc),
        action.payload,
      );
      state.doc = newDoc;
    },
    resetState: (state): void => {
      state.doc = initDocWithText('');
      state.language = Language.PYTHON;
      state.isExecutingCode = false;
      state.codeExecutionOutput = '';
      state.isCodeOutputPanelShown = false;
    },
  },
});

export const {
  setDoc,
  setLanguage,
  applyChanges,
  setIsExecutingCodeAsTrue,
  setCodeExecutionOutput,
  closeCodeOutputPanel,
  resetState,
} = coding.actions;

export default coding.reducer;
