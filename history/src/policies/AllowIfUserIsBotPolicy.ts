import { Authorization } from 'types/authorization';

import { BasePolicy } from './BasePolicy';
import { User } from '.prisma/client';

export class AllowIfUserIsBotPolicy<T> extends BasePolicy<T> {
  public async validate(_item: T, user: User): Promise<Authorization> {
    return user.id === 'bot' && user.githubUsername === 'bot'
      ? Authorization.ALLOW
      : Authorization.SKIP;
  }
}
