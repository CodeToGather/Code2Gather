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
  shouldShowOutputPanel: boolean;
}

const initialState: CodingDux = {
  doc: initDocWithText(''),
  language: Language.PYTHON,
  isExecutingCode: false,
  codeExecutionOutput: '',
  shouldShowOutputPanel: false,
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
      state.shouldShowOutputPanel = true;
      state.isExecutingCode = true;
    },
    setCodeExecutionOutput: (state, action: PayloadAction<string>): void => {
      state.isExecutingCode = false;
      state.shouldShowOutputPanel = true;
      state.codeExecutionOutput = action.payload;
    },
    clearCodeExecutionOutput: (state): void => {
      state.isExecutingCode = false;
      state.codeExecutionOutput = '';
      state.shouldShowOutputPanel = false;
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
      state.shouldShowOutputPanel = false;
    },
  },
});

export const {
  setDoc,
  setLanguage,
  applyChanges,
  setIsExecutingCodeAsTrue,
  setCodeExecutionOutput,
  clearCodeExecutionOutput,
  resetState,
} = coding.actions;

export default coding.reducer;
