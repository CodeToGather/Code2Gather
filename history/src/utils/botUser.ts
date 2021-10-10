import { User } from '.prisma/client';

export const botUser: User = {
  id: 'bot',
  createdAt: new Date(),
  updatedAt: new Date(),
  githubUsername: 'bot',
};
