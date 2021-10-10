import { AllowIfUserIsBotPolicy } from 'policies/AllowIfUserIsBotPolicy';
import { Authorization } from 'types/authorization';
import { botUser } from 'utils/botUser';
import { mockTestUser } from 'utils/tests';

import { User } from '.prisma/client';

let user: User;

// Approach taken: whitebox testing

beforeAll(async () => {
  user = mockTestUser();
});

describe('AllowIfUserIsBotPolicy', () => {
  it('allows bots', async () => {
    const userPolicy = new AllowIfUserIsBotPolicy<User>();
    const userResult = await userPolicy.validate(user, botUser);
    expect(userResult).toBe(Authorization.ALLOW);

    const nullPolicy = new AllowIfUserIsBotPolicy<null>();
    const nullResult = await nullPolicy.validate(null, botUser);
    expect(nullResult).toBe(Authorization.ALLOW);

    const numberPolicy = new AllowIfUserIsBotPolicy<number>();
    const numberResult = await numberPolicy.validate(100, botUser);
    expect(numberResult).toBe(Authorization.ALLOW);
  });

  it('skips non-bots', async () => {
    const userPolicy = new AllowIfUserIsBotPolicy<User>();
    const userResult = await userPolicy.validate(user, user);
    expect(userResult).toBe(Authorization.SKIP);

    const nullPolicy = new AllowIfUserIsBotPolicy<null>();
    const nullResult = await nullPolicy.validate(null, user);
    expect(nullResult).toBe(Authorization.SKIP);

    const numberPolicy = new AllowIfUserIsBotPolicy<number>();
    const numberResult = await numberPolicy.validate(100, user);
    expect(numberResult).toBe(Authorization.SKIP);
  });
});
