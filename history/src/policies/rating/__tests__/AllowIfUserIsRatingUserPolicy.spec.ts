import { Authorization } from 'types/authorization';
import { RatingCreateData } from 'types/crud/rating';
import { mockTestRating, mockTestUser } from 'utils/tests';

import { AllowIfUserIsRatingUserPolicy } from '../AllowIfUserIsRatingUserPolicy';

import { Rating, User } from '.prisma/client';

let ratingUser: User;
let ratedUser: User;
let unrelatedUser: User;
let rating: Rating;
let ratingCreateData: RatingCreateData;

beforeAll(() => {
  ratingUser = mockTestUser();
  ratedUser = mockTestUser();
  rating = mockTestRating(ratingUser.id, ratedUser.id);
  unrelatedUser = mockTestUser();
  ratingCreateData = {
    ratingUserId: ratingUser.id,
    ratedUserId: ratedUser.id,
    rating: 3,
  };
});

describe('AllowIfUserIsRatingPolicy', () => {
  it('allows if user is rating user', async () => {
    const policy = new AllowIfUserIsRatingUserPolicy();
    const resultOne = await policy.validate(rating, ratingUser);
    const resultTwo = await policy.validate(ratingCreateData, ratingUser);
    expect(resultOne).toBe(Authorization.ALLOW);
    expect(resultTwo).toBe(Authorization.ALLOW);
  });

  it('skips if user is rated user', async () => {
    const policy = new AllowIfUserIsRatingUserPolicy();
    const resultOne = await policy.validate(rating, ratedUser);
    const resultTwo = await policy.validate(rating, ratedUser);
    expect(resultOne).toBe(Authorization.SKIP);
    expect(resultTwo).toBe(Authorization.SKIP);
  });

  it('skips if user is unrelated', async () => {
    const policy = new AllowIfUserIsRatingUserPolicy();
    const resultOne = await policy.validate(rating, unrelatedUser);
    const resultTwo = await policy.validate(rating, unrelatedUser);
    expect(resultOne).toBe(Authorization.SKIP);
    expect(resultTwo).toBe(Authorization.SKIP);
  });
});
