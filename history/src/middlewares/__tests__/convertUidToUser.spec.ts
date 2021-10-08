import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { StatusCodes } from 'http-status-codes';

import { convertUidToUser } from 'middlewares/convertUidToUser';
import { createTestUser } from 'utils/tests';

import { User } from '.prisma/client';

let hasCalledSendStatus = false;
let mockStatusCode: number | null = null;

class MockResponse {
  locals: { user?: User } = {};

  sendStatus(code: number): this {
    hasCalledSendStatus = true;
    mockStatusCode = code;
    return this;
  }
}

class MockRequest {
  headers: { authorization?: any } = {};

  constructor(uid?: any) {
    this.headers.authorization = uid;
  }
}

describe('convertUidToUser', () => {
  let mockResponse: Response;
  let mockRequest: Request;
  let hasCalledNextFunction: boolean;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockResponse = new MockResponse() as any as Response;
    hasCalledSendStatus = false;
    mockStatusCode = null;
    hasCalledNextFunction = false;
    nextFunction = () => {
      hasCalledNextFunction = true;
    };
  });

  it('rejects when uid is undefined', async () => {
    mockRequest = new MockRequest() as any as Request;
    await convertUidToUser(mockRequest, mockResponse, nextFunction);
    expect(hasCalledSendStatus).toBe(true);
    expect(mockStatusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it('rejects when uid is not a string', async () => {
    mockRequest = new MockRequest(100) as any as Request;
    await convertUidToUser(mockRequest, mockResponse, nextFunction);
    expect(hasCalledSendStatus).toBe(true);
    expect(mockStatusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it('rejects when uid is not of an existing user', async () => {
    mockRequest = new MockRequest('fakeuid') as any as Request;
    await convertUidToUser(mockRequest, mockResponse, nextFunction);
    expect(hasCalledSendStatus).toBe(true);
    expect(mockStatusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it('accepts when given a valid uid', async () => {
    const user = await createTestUser();
    mockRequest = new MockRequest(user.id) as any as Request;
    await convertUidToUser(mockRequest, mockResponse, nextFunction);
    expect(hasCalledSendStatus).toBe(false);
    expect(hasCalledNextFunction).toBe(true);
    expect(mockResponse.locals.user).toEqual(user);
  });
});
