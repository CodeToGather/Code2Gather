import { Authorization } from 'types/authorization';

import { BasePolicy } from './BasePolicy';
import { User } from '.prisma/client';

export class AlwaysDenyPolicy<T> extends BasePolicy<T> {
  public async validate(_item: T, _user: User): Promise<Authorization> {
    return Authorization.DENY;
  }
}
