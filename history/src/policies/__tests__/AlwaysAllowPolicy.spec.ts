import { AlwaysAllowPolicy } from 'policies/AlwaysAllowPolicy';
import { Authorization } from 'types/authorization';
import { mockTestUser } from 'utils/tests';

import { User } from '.prisma/client';

let user: User;

// Approach taken: whitebox testing

beforeAll(async () => {
  user = mockTestUser();
});

describe('AlwaysAllowPolicy', () => {
  it('always allows', async () => {
    const userPolicy = new AlwaysAllowPolicy<User>();
    const userResult = await userPolicy.validate(user, user);
    expect(userResult).toBe(Authorization.ALLOW);

    const nullPolicy = new AlwaysAllowPolicy<null>();
    const nullResult = await nullPolicy.validate(null, user);
    expect(nullResult).toBe(Authorization.ALLOW);

    const numberPolicy = new AlwaysAllowPolicy<number>();
    const numberResult = await numberPolicy.validate(100, user);
    expect(numberResult).toBe(Authorization.ALLOW);
  });
});
