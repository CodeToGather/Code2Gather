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

  it('should return the top 10 users', async () => {
    const response = await request(server.server)
      .get('/leaderboard')
      .set('Authorization', fixtures.userOne.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveLength(10);
    expect(response.body).toEqual(convertDatesToJson(rankedUsers.slice(0, 10)));
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
