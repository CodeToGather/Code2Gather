import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import prisma from 'lib/prisma';

export const convertUidToUser = async (
  request: Request<any>,
  response: Response<any>,
  next: NextFunction
): Promise<void> => {
  const uid = request.headers.authorization;
  if (uid == null || typeof uid !== 'string') {
    response.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    },
  });
  if (user == null) {
    response.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }

  response.locals.user = user;
  next();
};
