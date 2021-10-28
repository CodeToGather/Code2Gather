import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import leaderboardService from 'services/LeaderboardService';
import { ErrorResponse } from 'types/api';
import { LeaderboardData } from 'types/crud/leaderboard';
import { AuthorizationError } from 'types/error';

/**
 * Reads the leaderboard data. Any user can do this.
 *
 * @param _request No requirement for request format.
 * @param response Response with body of type LeaderboardData[] or { error: string }
 */
export async function readLeaderboard(
  _request: Request<unknown, unknown, unknown>,
  response: Response<ErrorResponse | LeaderboardData[]>,
): Promise<void> {
  const { user } = response.locals;
  try {
    const leaderboardData = await leaderboardService.read(user);
    response.status(StatusCodes.OK).json(leaderboardData);
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
