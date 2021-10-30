import { User } from 'types/crud/user';

export type LoginRequestBody = {
  token: string; // firebase token
  githubUsername: string;
  photoUrl: string;
  profileUrl: string;
}

export type LoginResponse = {
  token: string; // jwt token
};

export type GetSelfResponse = {
  user: User;
};
