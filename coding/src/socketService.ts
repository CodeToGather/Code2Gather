import Automerge from 'automerge';
import axios from 'axios';
import { Server } from 'socket.io';

import {
  base64StringToBinaryChange,
  binaryChangeToBase64String,
  initDocWithText,
  Language,
  TextDoc,
} from './automergeUtils';
import {
  CODE_EXECUTION_SERVICE_URL,
  CONNECT,
  DISCONNECT,
  REQ_CHANGE_LANGUAGE,
  REQ_EXECUTE_CODE,
  REQ_JOIN_ROOM,
  REQ_UPDATE_CODE,
  RES_CHANGED_LANGUAGE,
  RES_CODE_OUTPUT,
  RES_EXECUTING_CODE,
  RES_JOINED_ROOM,
  RES_UPDATED_CODE,
} from './constants';

const socketIdToRoomId = new Map<string, string>();
const roomIdToDoc = new Map<string, Automerge.Doc<TextDoc>>();
const roomIdToLanguage = new Map<string, Language>();
const languageToId = {
  'PYTHON': 71,
  'JAVA': 62,
  'JAVASCRIPT': 63,
};

const setUpIo = (io: Server): void => {
  io.on('connect', (socket) => {
    console.log('IO connected');
    socket.on(CONNECT, () => console.log('Socket connected!'));

    socket.on(REQ_JOIN_ROOM, (roomId: string) => {
      if (socketIdToRoomId.has(socket.id)) {
        socket.leave(socketIdToRoomId.get(socket.id)!);
      }
      socket.join(roomId);
      socketIdToRoomId.set(socket.id, roomId);

      if (!roomIdToDoc.has(roomId)) {
        roomIdToDoc.set(roomId, initDocWithText(''));
        roomIdToLanguage.set(roomId, Language.PYTHON);
      }
      const allChanges = binaryChangeToBase64String(
        Automerge.getAllChanges(roomIdToDoc.get(roomId)!),
      );
      const language = roomIdToLanguage.get(roomId)!;
      socket.emit(RES_JOINED_ROOM, { allChanges, language });
    });

    socket.on(REQ_UPDATE_CODE, (changes: string[]) => {
      const roomId = socketIdToRoomId.get(socket.id);
      if (!roomId) {
        console.log('Missing room!');
        return;
      }
      const doc = roomIdToDoc.get(roomId);
      if (!doc) {
        console.log('Missing doc!');
        return;
      }
      const [newDoc] = Automerge.applyChanges(
        Automerge.clone(doc),
        base64StringToBinaryChange(changes),
      );
      roomIdToDoc.set(roomId, newDoc);
      socket.to(roomId).emit(RES_UPDATED_CODE, changes);
    });

    socket.on(REQ_CHANGE_LANGUAGE, (language: Language) => {
      const roomId = socketIdToRoomId.get(socket.id);
      if (!roomId) {
        console.log('Missing room!');
        return;
      }
      roomIdToLanguage.set(roomId, language);
      socket.to(roomId).emit(RES_CHANGED_LANGUAGE, language);
    });

    socket.on(REQ_EXECUTE_CODE, async () => {
      const roomId = socketIdToRoomId.get(socket.id);
      if (!roomId) {
        console.log('Missing room!');
        return;
      }
      const doc = roomIdToDoc.get(roomId);
      if (!doc) {
        console.log('Missing doc!');
        return;
      }
      const language = roomIdToLanguage.get(roomId);
      if (!language) {
        console.log('Missing doc!');
        return;
      }
      io.to(roomId).emit(RES_EXECUTING_CODE);

      // TODO: Post the following to the code execution service.
      console.log(doc.text.toString(), language);

      const resp = await axios.post(CODE_EXECUTION_SERVICE_URL, {
        code: doc.text.toString(),
        langauge: languageToId[language],
        stdin: '', // TODO: Ask for stdin.
      });

      if(resp.status != 200 || resp.data.token == null) {
        console.error(resp.data.error);
        io.to(roomId).emit(RES_CODE_OUTPUT, 'Error while executing code: ' + resp.data.error);
        return;
      }

      const execResult = await axios.get(CODE_EXECUTION_SERVICE_URL + resp.data.token);

      if(execResult.status != 200) {
        console.error(execResult.data.error);
        io.to(roomId).emit(RES_CODE_OUTPUT, 'Error while executing code: ' + execResult.data.error);
        return;
      }

      // TODO: Replace below with code output
      io.to(roomId).emit(RES_CODE_OUTPUT, execResult.data);
    });

    socket.on(DISCONNECT, () => {
      socketIdToRoomId.delete(socket.id);
    });
  });
  console.log('IO has been set up.');
};

export default setUpIo;
