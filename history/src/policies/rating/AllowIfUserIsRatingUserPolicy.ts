import { Authorization } from 'types/authorization';
import { RatingCreateData } from 'types/crud/rating';

import { BasePolicy } from '../BasePolicy';

import { Rating, User } from '.prisma/client';

// Checks that the user is the owner of the post before
// allowing for mutations to said post.
export class AllowIfUserIsRatingUserPolicy extends BasePolicy<
  Rating | RatingCreateData
> {
  public override async validate(
    item: Rating | RatingCreateData,
    user: User,
  ): Promise<Authorization> {
    if (item.ratingUserId === user.id) {
      return Authorization.ALLOW;
    }
    return Authorization.SKIP;
  }
}
