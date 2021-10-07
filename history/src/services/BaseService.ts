import { AlwaysDenyPolicy } from 'policies/AlwaysDenyPolicy';
import { BasePolicy } from 'policies/BasePolicy';
import { Authorization } from 'types/authorization';
import { AuthorizationError } from 'types/error';

import { User } from '.prisma/client';

// T is the Prisma type.
// CT is the data required for creation with Prisma.
// For all policies, make sure to end with AlwaysAllow or AlwaysDeny.
export class BaseService<T, CT> {
  protected createPolicies: BasePolicy<CT>[] = [new AlwaysDenyPolicy()];
  protected readPolicies: BasePolicy<T>[] = [new AlwaysDenyPolicy()];
  protected updatePolicies: BasePolicy<T>[] = [new AlwaysDenyPolicy()];
  protected deletePolicies: BasePolicy<T>[] = [new AlwaysDenyPolicy()];

  protected async isAuthorized<U extends T | CT>(
    data: U,
    user: User,
    policies: BasePolicy<U>[]
  ): Promise<boolean> {
    if (user == null) {
      // Just in case check
      return false;
    }
    for (let i = 0; i < policies.length; i++) {
      const result = await policies[i].validate(data, user);
      if (result === Authorization.DENY) {
        return false;
      }
      if (result === Authorization.ALLOW) {
        return true;
      }
    }

    // Defensive authorization decision
    return false;
  }

  protected async checkCreation(data: CT, user: User): Promise<void> {
    const isAuthorized = await this.isAuthorized(
      data,
      user,
      this.createPolicies
    );
    if (!isAuthorized) {
      throw new AuthorizationError();
    }
  }

  protected async checkRead(data: T, user: User): Promise<void> {
    const isAuthorized = await this.isAuthorized(data, user, this.readPolicies);
    if (!isAuthorized) {
      throw new AuthorizationError();
    }
  }

  protected async checkUpdate(data: T, user: User): Promise<void> {
    const isAuthorized = await this.isAuthorized(
      data,
      user,
      this.updatePolicies
    );
    if (!isAuthorized) {
      throw new AuthorizationError();
    }
  }

  protected async checkDeletion(data: T, user: User): Promise<void> {
    const isAuthorized = await this.isAuthorized(
      data,
      user,
      this.deletePolicies
    );
    if (!isAuthorized) {
      throw new AuthorizationError();
    }
  }
}
