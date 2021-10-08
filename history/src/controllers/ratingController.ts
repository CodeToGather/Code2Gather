import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import ratingService from 'services/RatingService';
import { ErrorResponse, UserLocals } from 'types/api';
import { RatingCreateData } from 'types/crud/rating';
import { AuthorizationError, ResourceNotFoundError } from 'types/error';

import { Rating } from '.prisma/client';

/**
 * Creates a rating by interviewee to interviewer. This should be triggered
 * by the rating user, not the rated user, i.e. the auth-resolved UID must
 * be that of the user rating the other user.
 *
 * @param request Request with body of type RatingCreateData
 * @param response Response with body of type Rating or { error: string }
 */
export async function createRating(
  request: Request<unknown, unknown, RatingCreateData>,
  response: Response<ErrorResponse | Rating>
): Promise<void> {
  const { user } = response.locals;
  try {
    const ratingCreateData = request.body;
    const createdRating = await ratingService.create(ratingCreateData, user);
    response.status(StatusCodes.OK).json(createdRating);
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      response
        .status(StatusCodes.FORBIDDEN)
        .json({ error: 'You do not have permissions to create a rating!' });
      return;
    }
    response.status(StatusCodes.BAD_REQUEST).json({
      error: error?.message ?? 'Something went wrong. Please try again!',
    });
  }
}

/**
 * Reads the average rating for a specific user.
 *
 * Although this seems like a general operation, for confidentiality reasons,
 * we will only allow this to be read by the rated user themselves. In other
 * words, if the pairing service requires the rating from this endpoint, it
 * will need to provide the auth-resolved UID that is of the user that is
 * being queried here.
 *
 * @param request No requirement for request format
 * @param response Response with body { average: number, count: number }
 *                 or { error: string }
 */
export async function readAverageRatingForSelf(
  _request: Request<unknown, unknown, unknown>,
  response: Response<
    ErrorResponse | { average: number; count: number },
    UserLocals
  >
): Promise<void> {
  const { user } = response.locals;
  try {
    const stats = await ratingService.readAverageRatingForRatedUser(
      user.id,
      user
    );
    response.status(StatusCodes.OK).json(stats);
  } catch (error: any) {
    if (error instanceof ResourceNotFoundError) {
      response
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User cannot be found!' });
      return;
    } else if (error instanceof AuthorizationError) {
      response.status(StatusCodes.FORBIDDEN).json({
        error: "You do not have permissions to read this user's ratings!",
      });
      return;
    }
    response.status(StatusCodes.BAD_REQUEST).json({
      error: error?.message ?? 'Something went wrong. Please try again!',
    });
  }
}
