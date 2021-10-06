import { User } from 'types/crud/user';

export type LoginRequestBody = {
  token: string; // firebase token
};

export type LoginResponse = {
  token: string; // jwt token
};

export type GetSelfResponse = {
  user: User;
};
