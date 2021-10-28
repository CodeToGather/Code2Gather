import { User } from 'types/crud/user';

export interface LoginRequestBody {
  token: string; // firebase token
}

export interface LoginResponse {
  token: string; // jwt token
}

export interface GetSelfResponse {
  user: User;
}
