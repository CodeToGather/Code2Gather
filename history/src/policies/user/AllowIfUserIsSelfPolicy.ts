import { Authorization } from 'types/authorization';
import { UserCreateData } from 'types/crud/user';

import { BasePolicy } from '../BasePolicy';

import { User } from '.prisma/client';

// Checks that the user is the owner of the post before
// allowing for mutations to said post.
export class AllowIfUserIsSelfPolicy extends BasePolicy<User | UserCreateData> {
  public async validate(
    item: User | UserCreateData,
    user: User
  ): Promise<Authorization> {
    if (item.id === user.id) {
      return Authorization.ALLOW;
    }
    return Authorization.SKIP;
  }
}
