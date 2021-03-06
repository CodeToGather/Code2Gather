import { Authorization } from 'types/authorization';

import { BasePolicy } from './BasePolicy';
import { User } from '.prisma/client';

export class AlwaysAllowPolicy<T> extends BasePolicy<T> {
  public override async validate(
    _item: T,
    _user: User,
  ): Promise<Authorization> {
    return Authorization.ALLOW;
  }
}
