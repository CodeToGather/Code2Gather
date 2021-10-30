import leaderboardService from 'services/LeaderboardService';
import { LeaderboardData } from 'types/crud/leaderboard';
import { AuthorizationError } from 'types/error';
import { botUser } from 'utils/botUser';
import { Fixtures, loadFixtures } from 'utils/fixtures';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixtures();
});

afterAll(async () => {
  await fixtures.tearDown();
});

describe('LeaderboardService', () => {
  let rankedUsers: LeaderboardData[];

  beforeAll(async () => {
    await fixtures.reload();
    rankedUsers = await fixtures.generateLeaderboardUsers();
  });

  it('reads top 10 users correctly', async () => {
    const leaderboard = await leaderboardService.read(fixtures.userOne);
    expect(leaderboard).toEqual(rankedUsers.slice(0, 10));
  });

  it('reads a specified number of people', async () => {
    const leaderboard = await leaderboardService.read(fixtures.userOne, 5);
    expect(leaderboard).toEqual(rankedUsers.slice(0, 5));
  });

  it('does not allow a bot to read', async () => {
    await expect(leaderboardService.read(botUser)).rejects.toThrow(
      AuthorizationError,
    );
  });
});
