import { LeaderboardApiResponse } from 'types/api/leaderboard';

import BaseApi from './baseApi';

class LeaderboardApi extends BaseApi {
  async getLeaderboard(): Promise<LeaderboardApiResponse> {
    return this.get(
      'history/leaderboard',
      (res: LeaderboardApiResponse) => res,
    );
  }
}

export default new LeaderboardApi();
