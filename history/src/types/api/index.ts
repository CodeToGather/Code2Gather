import { User } from '.prisma/client';

export interface UserLocals {
  user: User;
}

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  success: boolean;
  id?: number;
}
