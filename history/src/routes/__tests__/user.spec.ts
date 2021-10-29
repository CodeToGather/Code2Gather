import { StatusCodes } from 'http-status-codes';
import ApiServer from 'server';
import request from 'supertest';
import { Fixtures, loadFixtures } from 'utils/fixtures';
import { convertDatesToJson, mockTestUser } from 'utils/tests';

import prisma from 'lib/prisma';

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

describe('POST /user', () => {
  let id: string;
  let githubUsername: string;

  beforeAll(async () => {
    await fixtures.reload();
  });

  beforeEach(() => {
    const mockUserData = mockTestUser();
    id = mockUserData.id;
    githubUsername = mockUserData.githubUsername;
  });

  it('should create a user', async () => {
    const response = await request(server.server).post('/user').send({
      id,
      githubUsername,
    });
    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.id).toBe(id);
    expect(response.body.githubUsername).toBe(githubUsername);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    expect(user).toBeDefined();
  });

  it('should not allow missing github username', async () => {
    const response = await request(server.server).post('/user').send({
      id,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The user must have a valid GitHub username!',
    );
  });

  it('should not allow missing id', async () => {
    const response = await request(server.server).post('/user').send({
      githubUsername,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The user must have a valid ID string from Firebase!',
    );
  });

  it('should not allow id of non-string types', async () => {
    const response = await request(server.server).post('/user').send({
      id: 123456,
      githubUsername,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The user must have a valid ID string from Firebase!',
    );
  });

  it('should not allow github username of non-string types', async () => {
    const response = await request(server.server)
      .post('/user')
      .send({
        id,
        githubUsername: { hello: 'world' },
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The user must have a valid GitHub username!',
    );
  });

  it('should not allow creation of a user with an existing github username', async () => {
    const response = await request(server.server).post('/user').send({
      id,
      githubUsername: fixtures.userOne.githubUsername,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'A user with this Firebase ID or GitHub username already exists!',
    );
  });

  it('should update the user with an existing id and update the username', async () => {
    const response = await request(server.server).post('/user').send({
      id: fixtures.userOne.id,
      githubUsername,
    });
    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.id).toBe(fixtures.userOne.id);
    expect(response.body.githubUsername).toBe(githubUsername);
    const user = await prisma.user.findUnique({
      where: { id: fixtures.userOne.id },
    });
    expect(user).toBeDefined();
    expect(user!.githubUsername).toBe(githubUsername);
  });
});

describe('GET /user', () => {
  beforeAll(async () => {
    await fixtures.reload();
  });
  it('should return self when valid uid is provided', async () => {
    const response = await request(server.server)
      .get('/user')
      .set('Authorization', fixtures.userOne.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(convertDatesToJson(fixtures.userOne));
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server).get('/user').send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server)
      .get('/user')
      .set('Authorization', '123456')
      .send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('PUT /user', () => {
  let githubUsername: string;

  beforeEach(async () => {
    await fixtures.reload();
  });

  beforeEach(() => {
    const mockUserData = mockTestUser();
    githubUsername = mockUserData.githubUsername;
  });

  it('should update user', async () => {
    const response = await request(server.server)
      .put('/user')
      .set('Authorization', fixtures.userOne.id)
      .send({ githubUsername });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(
      convertDatesToJson({
        ...fixtures.userOne,
        githubUsername,
        updatedAt: response.body.updatedAt,
      }),
    );
  });

  it('should handle update with invalid github username', async () => {
    const response = await request(server.server)
      .put('/user')
      .set('Authorization', fixtures.userOne.id)
      .send({ githubUsername: 12345 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The user must have a valid GitHub username!',
    );
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server)
      .put('/user')
      .send({ githubUsername });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server)
      .put('/user')
      .set('Authorization', '123456')
      .send({ githubUsername });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('DELETE /user', () => {
  beforeEach(async () => {
    await fixtures.reload();
  });

  it('should delete self successfully', async () => {
    const response = await request(server.server)
      .delete('/user')
      .set('Authorization', fixtures.userOne.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.success).toBe(true);
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server).delete('/user').send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server)
      .delete('/user')
      .set('Authorization', '123456')
      .send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
