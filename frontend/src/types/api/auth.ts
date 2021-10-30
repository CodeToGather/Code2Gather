import { User } from 'types/crud/user';

export interface LoginRequestBody {
  token: string; // firebase token
  githubUsername: string;
  photoUrl: string;
  profileUrl: string;
}

export interface LoginResponse {
  token: string; // jwt token
}

export type GetSelfResponse = User
