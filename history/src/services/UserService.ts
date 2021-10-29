import { AllowIfUserIsBotPolicy } from 'policies/AllowIfUserIsBotPolicy';
import { AlwaysDenyPolicy } from 'policies/AlwaysDenyPolicy';
import { AllowIfUserIsSelfPolicy } from 'policies/user/AllowIfUserIsSelfPolicy';
import { UserCreateData, UserUpdateData } from 'types/crud/user';
import { InvalidDataError, ResourceNotFoundError } from 'types/error';

import prisma from 'lib/prisma';

import { BaseService } from './BaseService';
import { User } from '.prisma/client';

class UserService extends BaseService<User, UserCreateData> {
  protected override createPolicies = [
    new AllowIfUserIsBotPolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected override readPolicies = [
    new AllowIfUserIsSelfPolicy(),
    new AllowIfUserIsBotPolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected override updatePolicies = [
    new AllowIfUserIsSelfPolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected override deletePolicies = [
    new AllowIfUserIsSelfPolicy(),
    new AlwaysDenyPolicy(),
  ];

  // The user create method is the only exception that does not
  // require a user object to continue.
  async create(data: UserCreateData, user: User): Promise<User> {
    this.checkRep(data, true);
    await this.checkCreation(data, user);
    return await prisma.user.create({
      data,
    });
  }

  async read(userId: string, user: User): Promise<User> {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (foundUser == null) {
      throw new ResourceNotFoundError();
    }
    await this.checkRead(foundUser, user);
    return foundUser;
  }

  async update(
    userId: string,
    data: UserUpdateData,
    user: User,
  ): Promise<User> {
    const currentUser = await this.read(userId, user);
    this.checkRep(data, false);
    await this.checkUpdate(currentUser, user);
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: data,
    });
    return updatedUser;
  }

  async delete(userId: string, user: User): Promise<void> {
    const currentUser = await this.read(userId, user);
    await this.checkDeletion(currentUser, user);
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  private checkRep(
    data: UserCreateData | UserUpdateData,
    isCreate: boolean,
  ): void {
    if (
      (isCreate && !('id' in data)) ||
      ('id' in data && (typeof data.id !== 'string' || data.id.length === 0))
    ) {
      throw new InvalidDataError(
        'The user must have a valid ID string from Firebase!',
      );
    }
    if (
      (isCreate && !('githubUsername' in data)) ||
      ('githubUsername' in data &&
        (typeof data.githubUsername !== 'string' ||
          data.githubUsername.length === 0))
    ) {
      throw new InvalidDataError('The user must have a valid GitHub username!');
    }
    if (
      (isCreate && !('photoUrl' in data)) ||
      ('photoUrl' in data &&
        (typeof data.photoUrl !== 'string' || data.photoUrl.length === 0))
    ) {
      throw new InvalidDataError('The user must have a valid photo URL!');
    }
  }
}

const userService = new UserService();

export default userService;
