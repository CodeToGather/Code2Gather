import { User } from 'types/crud/user';

export interface LoginRequestBody {
  token: string; // firebase token
  githubUsername: string; // actually the display name
  photoUrl: string;
  profileUrl: string;
}

export interface LoginResponse {
  token: string; // jwt token
}

export interface GetSelfResponse {
  user: User;
}
