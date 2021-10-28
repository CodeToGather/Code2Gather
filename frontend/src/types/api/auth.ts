import { User } from 'types/crud/user';

export interface LoginRequestBody {
  token: string; // firebase token
  username: string;
}

export interface LoginResponse {
  token: string; // jwt token
}

export interface GetSelfResponse {
  user: User;
}
