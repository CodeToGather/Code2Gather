import ratingService from 'services/RatingService';
import { AuthorizationError, InvalidDataError } from 'types/error';
import { Fixtures, loadFixtures } from 'utils/fixtures';
import { createTestRating, createTestUser, mockTestRating } from 'utils/tests';

import prisma from 'lib/prisma';

let fixtures: Fixtures;

beforeAll(async () => {
  fixtures = await loadFixtures();
});

afterAll(async () => {
  await fixtures.tearDown();
});

describe('RatingService', () => {
  let rating: number;

  describe('create', () => {
    beforeEach(async () => {
      await fixtures.reload();
      const mockRatingData = mockTestRating(
        fixtures.userOne.id,
        fixtures.userTwo.id,
      );
      rating = mockRatingData.rating;
    });

    it('creates a rating', async () => {
      const createdRating = await ratingService.create(
        {
          ratingUserId: fixtures.userOne.id,
          ratedUserId: fixtures.userTwo.id,
          rating,
        },
        fixtures.userOne,
      );
      expect(createdRating.rating).toBe(rating);
      expect(createdRating.ratingUserId).toBe(fixtures.userOne.id);
      expect(createdRating.ratedUserId).toBe(fixtures.userTwo.id);
      expect(
        await prisma.rating.findUnique({ where: { id: createdRating.id } }),
      ).toBeTruthy();
    });

    it('checks for rating value', async () => {
      await expect(
        ratingService.create(
          {
            ratingUserId: fixtures.userOne.id,
            ratedUserId: fixtures.userTwo.id,
            rating: 0,
          },
          fixtures.userOne,
        ),
      ).rejects.toThrow(InvalidDataError);
      await expect(
        ratingService.create(
          {
            ratingUserId: fixtures.userOne.id,
            ratedUserId: fixtures.userTwo.id,
            rating: 6,
          },
          fixtures.userOne,
        ),
      ).rejects.toThrow(InvalidDataError);
      await expect(
        ratingService.create(
          {
            ratingUserId: fixtures.userOne.id,
            ratedUserId: fixtures.userTwo.id,
            rating: 4.5,
          },
          fixtures.userOne,
        ),
      ).rejects.toThrow(InvalidDataError);
    });

    it('checks for self-ratings', async () => {
      await expect(
        ratingService.create(
          {
            ratingUserId: fixtures.userOne.id,
            ratedUserId: fixtures.userOne.id,
            rating: 4.5,
          },
          fixtures.userOne,
        ),
      ).rejects.toThrow(InvalidDataError);
    });

    it('prevents non-rating users from creating ratings', async () => {
      const unrelatedUser = await createTestUser();
      await expect(
        ratingService.create(
          {
            ratingUserId: fixtures.userOne.id,
            ratedUserId: fixtures.userTwo.id,
            rating: 4,
          },
          fixtures.userTwo,
        ),
      ).rejects.toThrow(AuthorizationError);
      await expect(
        ratingService.create(
          {
            ratingUserId: fixtures.userOne.id,
            ratedUserId: fixtures.userTwo.id,
            rating: 4,
          },
          unrelatedUser,
        ),
      ).rejects.toThrow(AuthorizationError);
    });
  });

  describe('readAverageRatingForRatedUser', () => {
    it('user can read their average rating', async () => {
      const { average, count } =
        await ratingService.readAverageRatingForRatedUser(
          fixtures.userOne.id,
          fixtures.userOne,
        );
      expect(average).toEqual(fixtures.ratingFromTwoToOne.rating);
      expect(count).toBe(1);
    });

    it("unrelated user cannot read another user's average rating", async () => {
      await expect(
        ratingService.readAverageRatingForRatedUser(
          fixtures.userOne.id,
          fixtures.userTwo,
        ),
      ).rejects.toThrow(AuthorizationError);
    });

    it('handles when user has no ratings', async () => {
      const newUser = await createTestUser();
      const { average, count } =
        await ratingService.readAverageRatingForRatedUser(newUser.id, newUser);
      expect(average).toBe(0);
      expect(count).toBe(0);
    });

    it('correctly computes the average', async () => {
      const newUser = await createTestUser();
      await createTestRating({ ratedUserId: newUser.id, rating: 1 });
      await createTestRating({ ratedUserId: newUser.id, rating: 2 });
      await createTestRating({ ratedUserId: newUser.id, rating: 3 });
      const { average, count } =
        await ratingService.readAverageRatingForRatedUser(newUser.id, newUser);
      expect(average).toBe(2);
      expect(count).toBe(3);
    });
  });
});
