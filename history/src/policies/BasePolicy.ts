import { Authorization } from 'types/authorization';
import { MissingImplementationError } from 'types/error';

import { User } from '.prisma/client';

// Authorization checks for reads, updates and deletions.
export class BasePolicy<T> {
  public async validate(_item: T, _user: User): Promise<Authorization> {
    throw new MissingImplementationError(
      'You need to override the validate method!'
    );
  }
}
