import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import leaderboardService from 'services/LeaderboardService';
import { ErrorResponse } from 'types/api';
import { LeaderboardApiResponse } from 'types/api/leaderboard';
import { AuthorizationError } from 'types/error';

/**
 * Reads the leaderboard data. Any user can do this.
 *
 * @param _request No requirement for request format.
 * @param response Response with body of type LeaderboardData[] or { error: string }
 */
export async function readLeaderboard(
  _request: Request<unknown, unknown, unknown>,
  response: Response<ErrorResponse | LeaderboardApiResponse>,
): Promise<void> {
  const { user } = response.locals;
  try {
    const day = await leaderboardService.read(user);
    const week = await leaderboardService.read(
      user,
      10,
      new Date(new Date().setDate(new Date().getDate() - 7)),
    );
    const month = await leaderboardService.read(
      user,
      10,
      // We'll just use 30 days for month query
      new Date(new Date().setDate(new Date().getDate() - 30)),
    );
    response.status(StatusCodes.OK).json({ day, week, month });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      response.status(StatusCodes.FORBIDDEN).json({
        error: 'You do not have permissions to read the leaderboard!',
      });
      return;
    }
    response.status(StatusCodes.BAD_REQUEST).json({
      error: error?.message ?? 'Something went wrong. Please try again!',
    });
  }
}
