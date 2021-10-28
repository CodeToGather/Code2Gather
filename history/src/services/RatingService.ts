import { AlwaysDenyPolicy } from 'policies/AlwaysDenyPolicy';
import { AllowIfUserIsRatedUserPolicy } from 'policies/rating/AllowIfUserIsRatedUserPolicy';
import { AllowIfUserIsRatingUserPolicy } from 'policies/rating/AllowIfUserIsRatingUserPolicy';
import { RatingCreateData, RatingUpdateData } from 'types/crud/rating';
import { InvalidDataError } from 'types/error';

import prisma from 'lib/prisma';

import { BaseService } from './BaseService';
import { Rating, User } from '.prisma/client';

class RatingService extends BaseService<Rating, RatingCreateData> {
  protected override createPolicies = [
    new AllowIfUserIsRatingUserPolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected override readPolicies = [
    new AllowIfUserIsRatedUserPolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected override updatePolicies = [
    new AllowIfUserIsRatingUserPolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected override deletePolicies = [
    new AllowIfUserIsRatingUserPolicy(),
    new AlwaysDenyPolicy(),
  ];

  async create(data: RatingCreateData, user: User): Promise<Rating> {
    this.checkRep(data, true);
    await this.checkCreation(data, user);
    return await prisma.rating.create({
      data,
    });
  }

  // async read(ratingId: number, user: User): Promise<Rating> {
  //   const foundRating = await prisma.rating.findUnique({
  //     where: {
  //       id: ratingId,
  //     },
  //   });
  //   if (foundRating == null) {
  //     throw new ResourceNotFoundError();
  //   }
  //   await this.checkRead(foundRating, user);
  //   return foundRating;
  // }

  async readAverageRatingForRatedUser(
    ratedUserId: string,
    user: User,
  ): Promise<{ average: number; count: number }> {
    const ratings = await prisma.rating.findMany({
      where: {
        ratedUserId,
      },
    });
    // We reject upon finding any rating that the user is not allowed to read
    await Promise.all(ratings.map((r) => this.checkRead(r, user)));
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }
    return {
      average: ratings.reduce((a, b) => a + b.rating, 0) / ratings.length,
      count: ratings.length,
    };
  }

  // async update(
  //   ratingId: number,
  //   data: RatingUpdateData,
  //   user: User
  // ): Promise<Rating> {
  //   const currentRating = await this.read(ratingId, user);
  //   this.checkRep(data, false);
  //   await this.checkUpdate(currentRating, user);
  //   const updatedRating = await prisma.rating.update({
  //     where: {
  //       id: ratingId,
  //     },
  //     data: data,
  //   });
  //   return updatedRating;
  // }

  // async delete(ratingId: number, user: User): Promise<void> {
  //   const currentRating = await this.read(ratingId, user);
  //   await this.checkDeletion(currentRating, user);
  //   await prisma.rating.delete({
  //     where: {
  //       id: ratingId,
  //     },
  //   });
  // }

  private checkRep(
    data: RatingCreateData | RatingUpdateData,
    isCreate: boolean,
  ): void {
    if (
      (isCreate && !('ratingUserId' in data)) ||
      ('ratingUserId' in data &&
        (typeof data.ratingUserId !== 'string' ||
          data.ratingUserId.length === 0))
    ) {
      throw new InvalidDataError(
        'The rating must have a valid rating user ID!',
      );
    }
    if (
      (isCreate && !('ratedUserId' in data)) ||
      ('ratingUserId' in data &&
        (typeof data.ratedUserId !== 'string' || data.ratedUserId.length === 0))
    ) {
      throw new InvalidDataError('The rating must have a valid rated user ID!');
    }
    if (
      (isCreate && !('rating' in data)) ||
      (data.rating && typeof data.rating !== 'number')
    ) {
      throw new InvalidDataError('The rating must have a valid rating value!');
    }
    if ('ratingUserId' in data && 'ratedUserId' in data) {
      if (data.ratingUserId === data.ratedUserId) {
        throw new InvalidDataError('A user cannot rate themselves!');
      }
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new InvalidDataError(
        'Rating must be between 1 to 5, both inclusive!',
      );
    }
    if (data.rating !== Math.round(data.rating)) {
      throw new InvalidDataError('Rating must be discrete!');
    }
  }
}

const ratingService = new RatingService();

export default ratingService;
