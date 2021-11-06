export const ROOM_ID_KEY = 'roomId';

const getRoomId = (): string | null => {
  return localStorage.getItem(ROOM_ID_KEY);
};

const storeRoomId = (token: string): void => {
  localStorage.setItem(ROOM_ID_KEY, token);
};

const removeRoomId = (): void => {
  localStorage.removeItem(ROOM_ID_KEY);
};

const roomIdUtils = { getRoomId, storeRoomId, removeRoomId };

export default roomIdUtils;
