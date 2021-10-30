import { StatusCodes } from 'http-status-codes';
import ApiServer from 'server';
import request from 'supertest';

import prisma from 'lib/prisma';
import { Fixtures, loadFixtures } from 'utils/fixtures';
import { convertDatesToJson, mockTestUser } from 'utils/tests';

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
  let photoUrl: string;
  let profileUrl: string;

  beforeAll(async () => {
    await fixtures.reload();
  });

  beforeEach(() => {
    const mockUserData = mockTestUser();
    id = mockUserData.id;
    githubUsername = mockUserData.githubUsername;
    photoUrl = mockUserData.photoUrl;
    profileUrl = mockUserData.profileUrl;
  });

  it('should create a user', async () => {
    const response = await request(server.server).post('/user').send({
      id,
      githubUsername,
      photoUrl,
      profileUrl,
    });
    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.id).toBe(id);
    expect(response.body.githubUsername).toBe(githubUsername);
    expect(response.body.photoUrl).toBe(photoUrl);
    expect(response.body.profileUrl).toBe(profileUrl);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    expect(user).toBeDefined();
  });

  it('should not allow missing github username', async () => {
    const response = await request(server.server).post('/user').send({
      id,
      photoUrl,
      profileUrl,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toEqual(
      'The user must have a valid GitHub username!'
    );
  });

  it('should not allow missing id', async () => {
    const response = await request(server.server).post('/user').send({
      githubUsername,
      photoUrl,
      profileUrl,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toEqual(
      'The user must have a valid ID string from Firebase!'
    );
  });

  it('should not allow missing photo url', async () => {
    const response = await request(server.server).post('/user').send({
      id,
      githubUsername,
      profileUrl,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('The user must have a valid photo URL!');
  });

  it('should not allow missing profile url', async () => {
    const response = await request(server.server).post('/user').send({
      id,
      githubUsername,
      photoUrl,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('The user must have a valid profile URL!');
  });

  it('should not allow id of non-string types', async () => {
    const response = await request(server.server).post('/user').send({
      id: 123456,
      githubUsername,
      photoUrl,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toEqual(
      'The user must have a valid ID string from Firebase!'
    );
  });

  it('should not allow github username of non-string types', async () => {
    const response = await request(server.server)
      .post('/user')
      .send({
        id,
        githubUsername: { hello: 'world' },
        photoUrl,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toEqual(
      'The user must have a valid GitHub username!'
    );
  });

  it('should not allow photo url of non-string types', async () => {
    const response = await request(server.server)
      .post('/user')
      .send({
        id,
        githubUsername,
        photoUrl: ['hello!'],
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('The user must have a valid photo URL!');
  });

  it('should not allow profile url of non-string types', async () => {
    const response = await request(server.server).post('/user').send({
      id,
      githubUsername,
      photoUrl,
      profileUrl: true,
    });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('The user must have a valid profile URL!');
  });

  it('should update the user with an existing id', async () => {
    const response = await request(server.server).post('/user').send({
      id: fixtures.userOne.id,
      githubUsername,
      photoUrl,
      profileUrl,
    });

    expect(response.status).toEqual(StatusCodes.OK);
    expect(response.body.id).toBe(fixtures.userOne.id);
    expect(response.body.githubUsername).toBe(githubUsername);
    expect(response.body.photoUrl).toBe(photoUrl);
    expect(response.body.profileUrl).toBe(profileUrl);
    const user = await prisma.user.findUnique({
      where: { id: fixtures.userOne.id },
    });
    expect(user).toBeDefined();
    expect(user!.githubUsername).toBe(githubUsername);
    expect(user!.photoUrl).toBe(photoUrl);
    expect(user!.profileUrl).toBe(profileUrl);
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
  let photoUrl: string;
  let profileUrl: string;

  beforeEach(async () => {
    await fixtures.reload();
  });

  beforeEach(() => {
    const mockUserData = mockTestUser();
    githubUsername = mockUserData.githubUsername;
    photoUrl = mockUserData.photoUrl;
    profileUrl = mockUserData.profileUrl;
  });

  it('should update user', async () => {
    const response = await request(server.server)
      .put('/user')
      .set('Authorization', fixtures.userOne.id)
      .send({ githubUsername, photoUrl, profileUrl });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(
      convertDatesToJson({
        ...fixtures.userOne,
        githubUsername,
        photoUrl,
        profileUrl,
        updatedAt: response.body.updatedAt,
      })
    );
  });

  it('should handle update with invalid github username', async () => {
    const response = await request(server.server)
      .put('/user')
      .set('Authorization', fixtures.userOne.id)
      .send({ githubUsername: 12345, photoUrl, profileUrl });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The user must have a valid GitHub username!'
    );
  });

  it('should handle update with invalid photo url', async () => {
    const response = await request(server.server)
      .put('/user')
      .set('Authorization', fixtures.userOne.id)
      .send({ githubUsername, photoUrl: 92845, profileUrl });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('The user must have a valid photo URL!');
  });

  it('should handle update with invalid profile url', async () => {
    const response = await request(server.server)
      .put('/user')
      .set('Authorization', fixtures.userOne.id)
      .send({ githubUsername, photoUrl, profileUrl: 12345 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('The user must have a valid profile URL!');
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server)
      .put('/user')
      .send({ githubUsername, photoUrl, profileUrl });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server)
      .put('/user')
      .set('Authorization', '123456')
      .send({ githubUsername, photoUrl, profileUrl });
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
