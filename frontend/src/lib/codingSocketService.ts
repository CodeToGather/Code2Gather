import * as Automerge from 'automerge';
import { Socket } from 'socket.io-client';

import store from 'app/store';
import {
  REQ_CHANGE_LANGUAGE,
  REQ_EXECUTE_CODE,
  REQ_JOIN_ROOM,
  REQ_LEAVE_ROOM,
  REQ_UPDATE_CODE,
  RES_CHANGED_LANGUAGE,
  RES_CODE_OUTPUT,
  RES_EXECUTING_CODE,
  RES_JOINED_ROOM,
  RES_UPDATED_CODE,
} from 'constants/coding';
import {
  applyChanges,
  setCodeExecutionOutput,
  setDoc,
  setIsExecutingCodeAsTrue,
  setLanguage,
} from 'reducers/codingDux';
import { TextDoc } from 'types/automerge';
import { Language } from 'types/crud/language';
import {
  base64StringToBinaryChange,
  binaryChangeToBase64String,
  changeTextDoc,
} from 'utils/automergeUtils';

export const joinRoom = (socket: Socket, roomId: string): void => {
  socket.emit(REQ_JOIN_ROOM, roomId);
};

export const leaveRoom = (socket: Socket): void => {
  socket.emit(REQ_LEAVE_ROOM);
};

export const updateCode = (
  socket: Socket,
  doc: Automerge.Doc<TextDoc>,
  code: string,
): void => {
  const newDoc = changeTextDoc(doc, code);
  const changes = binaryChangeToBase64String(Automerge.getChanges(doc, newDoc));
  store.dispatch(setDoc(newDoc));
  socket.emit(REQ_UPDATE_CODE, changes);
};

export const changeLanguage = (socket: Socket, language: Language): void => {
  store.dispatch(setLanguage(language));
  socket.emit(REQ_CHANGE_LANGUAGE, language);
};

export const executeCode = (socket: Socket): void => {
  socket.emit(REQ_EXECUTE_CODE);
};

const joinedRoom = (socket: Socket): void => {
  socket.on(
    RES_JOINED_ROOM,
    ({
      allChanges,
      language,
    }: {
      allChanges: string[];
      language: Language;
    }) => {
      const changes = base64StringToBinaryChange(allChanges);
      const [doc] = Automerge.applyChanges<Automerge.Doc<TextDoc>>(
        Automerge.init(),
        changes,
      );
      store.dispatch(setDoc(doc));
      store.dispatch(setLanguage(language));
    },
  );
};

const updatedCode = (socket: Socket): void => {
  socket.on(RES_UPDATED_CODE, (data: string[]) => {
    const changes = base64StringToBinaryChange(data);
    store.dispatch(applyChanges(changes));
  });
};

const changedLanguage = (socket: Socket): void => {
  socket.on(RES_CHANGED_LANGUAGE, (language: Language) => {
    store.dispatch(setLanguage(language));
  });
};

const executingCode = (socket: Socket): void => {
  socket.on(RES_EXECUTING_CODE, () => {
    store.dispatch(setIsExecutingCodeAsTrue());
  });
};

const executedCodeOutput = (socket: Socket): void => {
  socket.on(RES_CODE_OUTPUT, (output: string) => {
    if (!output || output.length === 0) {
      store.dispatch(
        setCodeExecutionOutput('No output. Did you forget to print?'),
      );
    } else {
      store.dispatch(setCodeExecutionOutput(output));
    }
  });
};

export const initializeSocketForCoding = (socket: Socket): void => {
  joinedRoom(socket);
  updatedCode(socket);
  changedLanguage(socket);
  executingCode(socket);
  executedCodeOutput(socket);
};
