import { User } from '.prisma/client';

export type UserLocals = {
  user: User;
};

export type ErrorResponse = {
  error: string;
};

export type SuccessResponse = {
  success: boolean;
  id?: number;
};
