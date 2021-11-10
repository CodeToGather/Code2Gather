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
  hasNewExecutionOutput: boolean;
  cursorPosition: { row: number; column: number };
  suggestedNextPosition: { row: number; column: number };
  hasSuggestion: boolean;
}

const initialState: CodingDux = {
  doc: initDocWithText(''),
  language: Language.PYTHON,
  isExecutingCode: false,
  codeExecutionOutput: '',
  shouldShowOutputPanel: false,
  hasNewExecutionOutput: false,
  cursorPosition: { row: 0, column: 0 },
  suggestedNextPosition: { row: 0, column: 0 },
  hasSuggestion: false,
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
      state.hasNewExecutionOutput = true;
    },
    clearCodeExecutionOutput: (state): void => {
      state.isExecutingCode = false;
      state.codeExecutionOutput = '';
      state.shouldShowOutputPanel = false;
      state.hasNewExecutionOutput = false;
    },
    setHasNewExecutionOutputToFalse: (state): void => {
      state.hasNewExecutionOutput = false;
    },
    applyChanges: (
      state,
      action: PayloadAction<Automerge.BinaryChange[]>,
    ): void => {
      const [newDoc] = Automerge.applyChanges(
        Automerge.clone(state.doc),
        action.payload,
      );
      if (state.cursorPosition.column === 0 && state.cursorPosition.row === 0) {
        state.hasSuggestion = false;
      } else {
        const oldText = state.doc.text.toString();

        let i = 0;
        let numRows = 0;
        let numCols = 0;
        for (; ; i = i + 1) {
          if (
            numCols === state.cursorPosition.column &&
            numRows === state.cursorPosition.row
          ) {
            break;
          }
          if (numRows === state.cursorPosition.row) {
            numCols += 1;
            continue;
          }
          if (oldText[i] === '\n') {
            numRows += 1;
            continue;
          }
        }
        const oldElemIds = Automerge.Frontend.getElementIds(state.doc.text);
        const oldElemId = oldElemIds[i];
        const newElemIds = Automerge.Frontend.getElementIds(newDoc.text);
        let index = newElemIds.findIndex((id) => id === oldElemId);
        if (index === -1) {
          // The position was deleted, so we will go back and find the
          // latest index that still exists.
          const newElemIdsSet = new Set(newElemIds);
          for (let x = i - 1; x >= 0; x = x - 1) {
            if (newElemIdsSet.has(oldElemIds[x])) {
              index = newElemIds.findIndex((id) => id === oldElemIds[x]) + 1;
              break;
            }
            // Cannot find match, set it to first position of doc
            if (x === 0) {
              index = 0;
            }
          }
        }
        const newText = newDoc.text.toString();
        numRows = 0;
        numCols = 0;
        for (i = 0; i < index; i = i + 1) {
          if (newText[i] === '\n') {
            numRows += 1;
            numCols = 0;
            continue;
          }
          numCols += 1;
        }
        state.hasSuggestion = true;
        state.suggestedNextPosition = { row: numRows, column: numCols };
      }
      state.doc = newDoc;
    },
    clearSuggestion: (state): void => {
      state.hasSuggestion = false;
    },
    setPosition: (
      state,
      action: PayloadAction<{ row: number; column: number }>,
    ): void => {
      state.cursorPosition = action.payload;
    },
    resetState: (state): void => {
      state.doc = initDocWithText('');
      state.language = Language.PYTHON;
      state.isExecutingCode = false;
      state.codeExecutionOutput = '';
      state.shouldShowOutputPanel = false;
      state.hasNewExecutionOutput = false;
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
  setHasNewExecutionOutputToFalse,
  setPosition,
  clearSuggestion,
  resetState,
} = coding.actions;

export default coding.reducer;
