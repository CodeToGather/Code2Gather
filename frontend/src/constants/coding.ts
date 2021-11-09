// From us: I want to join the room!
export const REQ_JOIN_ROOM = 'req_join_room';

// From backend: Sure. Btw, here's a copy of the code.
export const RES_JOINED_ROOM = 'res_joined_room';

// From us: We're leaving the room - don't send me updates anymore.
// No response required.
export const REQ_LEAVE_ROOM = 'req_leave_room';

// From us: We updated da code.
export const REQ_UPDATE_CODE = 'res_update_code';

// From backend: The other person updated the code.
export const RES_UPDATED_CODE = 'req_updated_code';

// From us: Here's my cursor.
export const REQ_UPDATE_CURSOR = 'req_update_cursor';

// From backend: The other person's latest cursor position!
export const RES_UPDATED_CURSOR = 'res_updated_cursor';

// From us: We changed the language.
export const REQ_CHANGE_LANGUAGE = 'req_change_language';

// From backend: The other person changed the language.
export const RES_CHANGED_LANGUAGE = 'res_changed_language';

// From us: We wanna execute the code! But only if you're logged in.
export const REQ_EXECUTE_CODE = 'req_execute_code';

// From backend: The other person just pressed execute code.
export const RES_EXECUTING_CODE = 'res_executing_code';

// From backend: Here's the code output y'all!
export const RES_CODE_OUTPUT = 'res_code_output';
