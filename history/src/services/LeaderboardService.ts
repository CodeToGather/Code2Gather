import { AlwaysAllowPolicy } from 'policies/AlwaysAllowPolicy';
import { DenyIfUserIsBotPolicy } from 'policies/DenyIfUserIsBotPolicy';
import { LeaderboardData } from 'types/crud/leaderboard';

import prisma from 'lib/prisma';

import { BaseService } from './BaseService';
import { User } from '.prisma/client';

class LeaderboardService extends BaseService<LeaderboardData[], void> {
  protected override readPolicies = [
    new DenyIfUserIsBotPolicy(),
    new AlwaysAllowPolicy(),
  ];

  async read(user: User, top = 10): Promise<LeaderboardData[]> {
    const users = await prisma.$queryRaw<LeaderboardData[]>`
    SELECT
      u.*,
      (SELECT COUNT(*) FROM "public"."MeetingRecord" m WHERE m."intervieweeId" = u.id AND m."questionDifficulty" = 'EASY') AS "numEasyQuestions",
      (SELECT COUNT(*) FROM "public"."MeetingRecord" m WHERE m."intervieweeId" = u.id AND m."questionDifficulty" = 'MEDIUM') AS "numMediumQuestions",
      (SELECT COUNT(*) FROM "public"."MeetingRecord" m WHERE m."intervieweeId" = u.id AND m."questionDifficulty" = 'HARD') AS "numHardQuestions"
    FROM
      "public"."User" u
    ORDER BY
      "numHardQuestions" DESC,
      "numMediumQuestions" DESC,
      "numEasyQuestions" DESC,
      u."githubUsername" DESC
    LIMIT
      ${top}
    `;
    await this.checkRead(users, user);
    return users.map((u) => ({
      ...u,
      createdAt: new Date(u.createdAt),
      updatedAt: new Date(u.updatedAt),
    }));
  }
}

const leaderboardService = new LeaderboardService();

export default leaderboardService;
