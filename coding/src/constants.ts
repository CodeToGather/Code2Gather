export const CONNECT = 'connect';

export const DISCONNECT = 'disconnect';

// From frontend: I want to join the room!
export const REQ_JOIN_ROOM = 'req_join_room';

// From us: Sure. Btw, here's a copy of the code.
export const RES_JOINED_ROOM = 'res_joined_room';

// From frontend: We updated da code.
export const REQ_UPDATE_CODE = 'res_update_code';

// From us: The other person updated the code.
export const RES_UPDATED_CODE = 'req_updated_code';

// From frontend: We changed the language.
export const REQ_CHANGE_LANGUAGE = 'req_change_language';

// From us: The other person changed the language.
export const RES_CHANGED_LANGUAGE = 'res_changed_language';

// From frontend: We wanna execute the code! But only if you're logged in.
export const REQ_EXECUTE_CODE = 'req_execute_code';

// From us: The other person just pressed execute code.
export const RES_EXECUTING_CODE = 'res_executing_code';

// From frontend: Here's the code output y'all!
export const RES_CODE_OUTPUT = 'res_code_output';

// URL to the Code Executor.
export const CODE_EXECUTION_SERVICE_URL = 'http://localhost:8005/submission';