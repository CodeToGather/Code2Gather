import { AlwaysDenyPolicy } from 'policies/AlwaysDenyPolicy';
import { Authorization } from 'types/authorization';
import { mockTestUser } from 'utils/tests';

import { User } from '.prisma/client';

let user: User;

// Approach taken: whitebox testing

beforeAll(async () => {
  user = mockTestUser();
});

describe('AlwaysDenyPolicy', () => {
  it('always denies', async () => {
    const userPolicy = new AlwaysDenyPolicy<User>();
    const userResult = await userPolicy.validate(user, user);
    expect(userResult).toBe(Authorization.DENY);

    const nullPolicy = new AlwaysDenyPolicy<null>();
    const nullResult = await nullPolicy.validate(null, user);
    expect(nullResult).toBe(Authorization.DENY);

    const numberPolicy = new AlwaysDenyPolicy<number>();
    const numberResult = await numberPolicy.validate(100, user);
    expect(numberResult).toBe(Authorization.DENY);
  });
});
