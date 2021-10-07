import { DenyIfUserIsBotPolicy } from 'policies/DenyIfUserIsBotPolicy';
import { Authorization } from 'types/authorization';
import { botUser } from 'utils/botUser';
import { mockTestUser } from 'utils/tests';

import { User } from '.prisma/client';

let user: User;

// Approach taken: whitebox testing

beforeAll(async () => {
  user = mockTestUser();
});

describe('DenyIfUserIsBotPolicy', () => {
  it('denies bots', async () => {
    const userPolicy = new DenyIfUserIsBotPolicy<User>();
    const userResult = await userPolicy.validate(user, botUser);
    expect(userResult).toBe(Authorization.DENY);

    const nullPolicy = new DenyIfUserIsBotPolicy<null>();
    const nullResult = await nullPolicy.validate(null, botUser);
    expect(nullResult).toBe(Authorization.DENY);

    const numberPolicy = new DenyIfUserIsBotPolicy<number>();
    const numberResult = await numberPolicy.validate(100, botUser);
    expect(numberResult).toBe(Authorization.DENY);
  });

  it('skips non-bots', async () => {
    const userPolicy = new DenyIfUserIsBotPolicy<User>();
    const userResult = await userPolicy.validate(user, user);
    expect(userResult).toBe(Authorization.SKIP);

    const nullPolicy = new DenyIfUserIsBotPolicy<null>();
    const nullResult = await nullPolicy.validate(null, user);
    expect(nullResult).toBe(Authorization.SKIP);

    const numberPolicy = new DenyIfUserIsBotPolicy<number>();
    const numberResult = await numberPolicy.validate(100, user);
    expect(numberResult).toBe(Authorization.SKIP);
  });
});
