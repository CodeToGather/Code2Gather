import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import userService from 'services/UserService';
import { ErrorResponse, SuccessResponse, UserLocals } from 'types/api';
import { UserCreateData, UserUpdateData } from 'types/crud/user';
import { AuthorizationError, ResourceNotFoundError } from 'types/error';
import { botUser } from 'utils/botUser';

import { User } from '.prisma/client';

/**
 * Creates a user. This can be triggered by anybody, i.e. no need to have
 * an existing user to create a new user (which doesn't really make sense).
 *
 * @param request Request with body of type UserCreateData
 * @param response Response with body of type User or { error: string }
 */
export async function createUser(
  request: Request<unknown, unknown, UserCreateData>,
  response: Response<ErrorResponse | User>,
): Promise<void> {
  try {
    const userCreateData = request.body;
    const createdUser = await userService.create(userCreateData, botUser);
    response.status(StatusCodes.OK).json(createdUser);
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        response.status(StatusCodes.BAD_REQUEST).json({
          error:
            'A user with this Firebase ID or GitHub username already exists!',
        });
        return;
      }
    }
    response.status(StatusCodes.BAD_REQUEST).json({
      error: error?.message ?? 'Something went wrong. Please try again!',
    });
  }
}

/**
 * Reads the user that is associated with the UID that comes with the
 * request (as resolved by the auth handler).
 *
 * @param _request No requirement for request format
 * @param response Response with body of type User
 */
export async function readSelf(
  _request: Request<unknown, unknown, unknown>,
  response: Response<User, UserLocals>,
): Promise<void> {
  const { user } = response.locals;
  response.status(200).json(user);
}

/**
 * Updates the information of the user. Primarily used to keep the
 * GitHub username updated. Other fields should be more or less immutable.
 *
 * This should be triggered by the user themselves, i.e. the auth-resolved
 * UID must be that of the user being updated.
 *
 * Possible extension: To generalise this function and allow an id to be
 * provided. This may allow e.g. an admin role in the future to be able to
 * update other users.
 *
 * @param request Request with body of type UserUpdateData
 * @param response Response with body of type User or { error: string }
 */
export async function updateSelf(
  request: Request<unknown, unknown, UserUpdateData>,
  response: Response<ErrorResponse | User, UserLocals>,
): Promise<void> {
  const { user } = response.locals;
  try {
    const userUpdateData = request.body;
    const updatedUser = await userService.update(user.id, userUpdateData, user);
    response.status(StatusCodes.OK).json(updatedUser);
  } catch (error: any) {
    // TODO: Handle unique constraint violation Prisma error.
    if (error instanceof ResourceNotFoundError) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User cannot be found!' });
      return;
    } else if (error instanceof AuthorizationError) {
      response
        .status(StatusCodes.FORBIDDEN)
        .json({ error: 'You do not have permissions to update this user!' });
      return;
    }
    response.status(StatusCodes.BAD_REQUEST).json({
      error: error?.message ?? 'Something went wrong. Please try again!',
    });
  }
}

/**
 * Deletes the user, which will also cascade delete all related information.
 * This should be triggered by the user themselves, i.e. the auth-resolved
 * UID must be that of the user being deleted.
 *
 * Possible extension: To generalise this function and allow an id to be
 * provided. This may allow e.g. an admin role in the future to be able to
 * delete other users.
 *
 * @param request No requirement for request format
 * @param response Response with body { success: boolean } or { error: string }
 */
export async function deleteSelf(
  _request: Request<unknown, unknown, unknown>,
  response: Response<ErrorResponse | SuccessResponse, UserLocals>,
): Promise<void> {
  const { user } = response.locals;
  try {
    await userService.delete(user.id, user);
    response.status(200).json({ success: true });
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User cannot be found!' });
      return;
    } else if (error instanceof AuthorizationError) {
      response
        .status(StatusCodes.FORBIDDEN)
        .json({ error: 'You do not have permissions to delete this user!' });
      return;
    }
    response.status(StatusCodes.BAD_REQUEST).json({
      error: error?.message ?? 'Something went wrong. Please try again!',
    });
  }
}
