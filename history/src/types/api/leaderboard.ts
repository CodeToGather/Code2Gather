import { LeaderboardData } from '../crud/leaderboard';

export interface LeaderboardApiResponse {
  day: LeaderboardData[];
  week: LeaderboardData[];
  month: LeaderboardData[];
}
