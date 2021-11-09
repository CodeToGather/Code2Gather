/**
 * Shared states and props
 */
import { LeaderboardData } from 'types/crud/leaderboard';
import { MeetingRecord } from 'types/crud/meetingRecord';

export interface LeaderboardState {
  day: LeaderboardData[];
  week: LeaderboardData[];
  month: LeaderboardData[];
  isLoading: boolean;
  isError: boolean;
}

export interface PracticeHistoryState {
  records: MeetingRecord[];
  page: number;
  isLastPage: boolean;
  isLoading: boolean;
  isError: boolean;
}
