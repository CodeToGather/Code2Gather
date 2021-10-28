import { BasePolicy } from 'policies/BasePolicy';
import { MissingImplementationError } from 'types/error';
import { mockTestUser } from 'utils/tests';

import { User } from '.prisma/client';

let user: User;

// Approach taken: whitebox testing

beforeAll(async () => {
  user = mockTestUser();
});

describe('Base Policy', () => {
  it('throws an error for validate', async () => {
    const policy = new BasePolicy<User>();
    await expect(policy.validate(user, user)).rejects.toThrow(
      MissingImplementationError,
    );
  });

  it('throws an error for subclasses that did not override validate', async () => {
    class SubBasePolicy extends BasePolicy<User> {}
    const policy = new SubBasePolicy();
    await expect(policy.validate(user, user)).rejects.toThrow(
      MissingImplementationError,
    );
  });
});
