export const CONNECT = 'connect';

// From frontend: I want to find a pair
export const REQ_FIND_PAIR = 'req_find_pair';

// From us: Ok, we're finding a pair for you now
export const RES_FIND_PAIR = 'res_find_pair';

// From us: Sian 30s have passed, you need to stop finding
export const RES_CANNOT_FIND_PAIR = 'res_cannot_find_pair';

// From frontend: We pressing cancel
export const REQ_STOP_FINDING_PAIR = 'req_stop_finding_pair';

// From us: gg, something went wrong. I sent an error string over
export const ERROR_FIND_PAIR = 'error_find_pair';

// From us: OK here's your room and partner info, enjoy!
export const RES_FOUND_PAIR = 'res_found_pair';

export const DISCONNECT = 'disconnect';
