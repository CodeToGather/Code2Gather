import { StatusCodes } from 'http-status-codes';
import ApiServer from 'server';
import request from 'supertest';
import { Fixtures, loadFixtures } from 'utils/fixtures';
import { createTestRating, createTestUser, mockTestRating } from 'utils/tests';

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

describe('POST /rating', () => {
  let rating: number;
  let ratingUserId: string;
  let ratedUserId: string;

  beforeAll(async () => {
    await fixtures.reload();
  });

  beforeEach(() => {
    const mockRatingData = mockTestRating(
      fixtures.userOne.id,
      fixtures.userTwo.id,
    );
    rating = mockRatingData.rating;
    ratingUserId = mockRatingData.ratingUserId as string;
    ratedUserId = mockRatingData.ratedUserId;
  });

  it('should create a rating', async () => {
    const response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating,
        ratingUserId,
        ratedUserId,
      });
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.rating).toBe(rating);
    expect(response.body.ratingUserId).toBe(ratingUserId);
    expect(response.body.ratedUserId).toBe(ratedUserId);
    const createdRating = await prisma.rating.findUnique({
      where: { id: response.body.id },
    });
    expect(createdRating).toBeDefined();
  });

  it('should not allow missing rating user id', async () => {
    const response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating,
        ratedUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The rating must have a valid rating user ID!',
    );
  });

  it('should not allow missing rated user id', async () => {
    const response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The rating must have a valid rated user ID!',
    );
  });

  it('should not allow missing rating value', async () => {
    const response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        ratedUserId,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The rating must have a valid rating value!',
    );
  });

  it('should not allow rating user id of non-string types', async () => {
    const response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating,
        ratedUserId,
        ratingUserId: 100,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The rating must have a valid rating user ID!',
    );
  });

  it('should not allow rated user id of non-string types', async () => {
    const response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating,
        ratedUserId: ['hello'],
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The rating must have a valid rated user ID!',
    );
  });

  it('should not allow rating value of non-number types', async () => {
    const response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating: '1',
        ratedUserId,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'The rating must have a valid rating value!',
    );
  });

  it('should not allow a user to rate themselves', async () => {
    const response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating,
        ratedUserId: ratingUserId,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('A user cannot rate themselves!');
  });

  it('should not allow a user to create a rating by others', async () => {
    let response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratedUserId) // not rating user!
      .send({
        rating,
        ratedUserId,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.FORBIDDEN);
    const unrelatedUser = await createTestUser();
    response = await request(server.server)
      .post('/rating')
      .set('Authorization', unrelatedUser.id) // not rating user!
      .send({
        rating,
        ratedUserId,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.FORBIDDEN);
  });

  it('checks that ratings are valid', async () => {
    let response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating: 0,
        ratedUserId,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'Rating must be between 1 to 5, both inclusive!',
    );

    response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating: 6,
        ratedUserId,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe(
      'Rating must be between 1 to 5, both inclusive!',
    );

    response = await request(server.server)
      .post('/rating')
      .set('Authorization', ratingUserId)
      .send({
        rating: 4.5,
        ratedUserId,
        ratingUserId,
      });
    expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
    expect(response.body.error).toBe('Rating must be discrete!');
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server).post('/rating').send({
      ratedUserId,
      ratingUserId,
      rating,
    });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server)
      .post('/rating')
      .set('Authorization', '123456')
      .send({
        ratedUserId,
        ratingUserId,
        rating,
      });
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});

describe('GET /rating', () => {
  beforeAll(async () => {
    await fixtures.reload();
  });

  it('should return a single rating for user with one rating', async () => {
    const response = await request(server.server)
      .get('/rating')
      .set('Authorization', fixtures.userOne.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.average).toBe(fixtures.ratingFromTwoToOne.rating);
    expect(response.body.count).toBe(1);
  });

  it('should return 0s for user with no ratings', async () => {
    const newUser = await createTestUser();
    const response = await request(server.server)
      .get('/rating')
      .set('Authorization', newUser.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.average).toBe(0);
    expect(response.body.count).toBe(0);
  });

  it('should return an average rating for user with multiple ratings', async () => {
    const newUser = await createTestUser();
    await createTestRating({ ratedUserId: newUser.id, rating: 1 });
    await createTestRating({ ratedUserId: newUser.id, rating: 2 });
    await createTestRating({ ratedUserId: newUser.id, rating: 3 });
    const response = await request(server.server)
      .get('/rating')
      .set('Authorization', newUser.id)
      .send();
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.average).toBe(2);
    expect(response.body.count).toBe(3);
  });

  it('should not allow invalid uid', async () => {
    let response = await request(server.server).get('/rating').send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    response = await request(server.server)
      .get('/rating')
      .set('Authorization', '123456')
      .send();
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
