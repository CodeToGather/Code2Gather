import { LeaderboardData } from 'types/crud/leaderboard';

export interface LeaderboardApiResponse {
  day: LeaderboardData[];
  week: LeaderboardData[];
  month: LeaderboardData[];
}
