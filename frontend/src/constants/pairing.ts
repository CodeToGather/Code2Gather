export const CONNECT = 'connect';

// From us: I want to enter pairing mode
export const REQ_FIND_PAIR = 'req_find_pair';

// From backend: Ok, we're finding a pair for you now
export const RES_FIND_PAIR = 'res_find_pair';

// From backend: gg, something went wrong. I sent an error string over
export const ERROR_FIND_PAIR = 'error_find_pair';

// From backend: Ok we found a pair for you, but hang on, forming a room for you
export const RES_FOUND_PAIR = 'res_found_pair';

// From backend: OK here's your room, enjoy!
export const RES_CREATED_ROOM = 'res_created_room';

// From us: Ok nvm 30s have passed, I wanna stop finding
export const REQ_STOP_FINDING_PAIR = 'req_stop_finding_pair';

export const DISCONNECT = 'disconnect';
