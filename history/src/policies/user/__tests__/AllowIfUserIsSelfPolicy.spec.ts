import { Authorization } from 'types/authorization';
import { mockTestUser } from 'utils/tests';

import { AllowIfUserIsSelfPolicy } from '../AllowIfUserIsSelfPolicy';

import { User } from '.prisma/client';

let user: User;
let anotherUser: User;

// Approach taken: whitebox testing

beforeAll(() => {
  user = mockTestUser();
  anotherUser = mockTestUser();
});

describe('AllowIfUserIsSelfPolicy', () => {
  it('allows if user is self', async () => {
    const policy = new AllowIfUserIsSelfPolicy();
    const result = await policy.validate(user, user);
    expect(result).toBe(Authorization.ALLOW);
  });

  it('skips if user is not self', async () => {
    const policy = new AllowIfUserIsSelfPolicy();
    const result = await policy.validate(user, anotherUser);
    expect(result).toBe(Authorization.SKIP);
  });
});
