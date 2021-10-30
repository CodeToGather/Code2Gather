import { StatusCodes } from 'http-status-codes';
import ApiServer from 'server';
import request from 'supertest';

import { LeaderboardData } from 'types/crud/leaderboard';
import { Fixtures, loadFixtures } from 'utils/fixtures';
import { convertDatesToJson } from 'utils/tests';

let server: ApiServer;
let fixtures: Fixtures;

beforeAll(async () => {
  server = new ApiServer();
  await server.initialize();
  fixtures = await loadFixtures();
});

afterAll(async () => {
  await fixtures.tearDown();
  await server.close();
});

describe('GET /leaderboard', () => {
  let rankedUsers: LeaderboardData[];

  beforeAll(async () => {
    await fixtures.reload();
    rankedUsers = await fixtures.generateLeaderboardUsers();
  });

  it('should return the same top 5 users for day, week and month', async () => {
    const response = await request(server.server)
      .get('/leaderboard')
      .set('Authorization', fixtures.userOne.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.day).toHaveLength(5);
    expect(response.body.day).toEqual(
      convertDatesToJson(rankedUsers.slice(0, 5)),
    );
    expect(response.body.week).toHaveLength(5);
    expect(response.body.week).toEqual(
      convertDatesToJson(rankedUsers.slice(0, 5)),
    );
    expect(response.body.month).toHaveLength(5);
    expect(response.body.month).toEqual(
      convertDatesToJson(rankedUsers.slice(0, 5)),
    );
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server).get('/leaderboard').send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server)
      .get('/leaderboard')
      .set('Authorization', '123456')
      .send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
