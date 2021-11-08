import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import meetingRecordService from 'services/MeetingRecordService';
import { ErrorResponse } from 'types/api';
import { Difficulty, Language } from 'types/crud/enums';
import { MeetingRecordCreateData } from 'types/crud/meetingRecord';
import { AuthorizationError } from 'types/error';

import { MeetingRecord } from '.prisma/client';

/**
 * Creates a meeting record. This should be triggered by the interviewer,
 * i.e. the auth-resolved UID must be that of the interviewer.
 *
 * @param request Request with body of type MeetingRecordCreateData
 * @param response Response with body of type MeetingRecord or { error: string }
 */
export async function createMeetingRecord(
  request: Request<unknown, unknown, MeetingRecordCreateData>,
  response: Response<ErrorResponse | MeetingRecord>,
): Promise<void> {
  const { user } = response.locals;
  try {
    const meetingRecordCreateData = request.body;
    const createdMeetingRecord = await meetingRecordService.create(
      {
        ...meetingRecordCreateData,
        duration: meetingRecordCreateData.duration ?? 0,
        questionDifficulty:
          meetingRecordCreateData.questionDifficulty ?? Difficulty.EASY,
        language: meetingRecordCreateData.language ?? Language.PYTHON,
        codeWritten: meetingRecordCreateData.codeWritten ?? '',
        isSolved: meetingRecordCreateData.isSolved ?? false,
        feedbackToInterviewee:
          meetingRecordCreateData.feedbackToInterviewee ?? '',
      },
      user,
    );
    response.status(StatusCodes.OK).json(createdMeetingRecord);
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      response.status(StatusCodes.FORBIDDEN).json({
        error: 'You do not have permissions to create a meeting record!',
      });
      return;
    }
    response.status(StatusCodes.BAD_REQUEST).json({
      error: error?.message ?? 'Something went wrong. Please try again!',
    });
  }
}

/**
 * Reads the meeting records of the user, where the user is the interviewee.
 *
 * This should be triggered by the user themselves, i.e. the auth-resolved
 * UID must be that of the interviewee.
 *
 * Possible extension: To generalise this function and allow an id to be
 * provided. This may allow e.g. an admin role in the future to be able to
 * read meeting records of other users.
 *
 * @param request No requirement for request format
 * @param response Response with body of type MeetingRecord[] or { error: string }
 */
export async function readMeetingRecordsForSelf(
  _request: Request<unknown, unknown, unknown>,
  response: Response<ErrorResponse | MeetingRecord[]>,
): Promise<void> {
  const { user } = response.locals;
  try {
    const meetingRecords = await meetingRecordService.readAllForInterviewee(
      user.id,
      user,
    );
    response.status(StatusCodes.OK).json(meetingRecords);
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      response.status(StatusCodes.FORBIDDEN).json({
        error: 'You do not have permissions to read the meeting records!',
      });
      return;
    }
    response.status(StatusCodes.BAD_REQUEST).json({
      error: error?.message ?? 'Something went wrong. Please try again!',
    });
  }
}
