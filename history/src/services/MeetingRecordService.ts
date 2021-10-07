import prisma from 'lib/prisma';
import { AlwaysDenyPolicy } from 'policies/AlwaysDenyPolicy';
import { AllowIfUserIsIntervieweePolicy } from 'policies/meetingRecord/AllowIfUserIsIntervieweePolicy';
import { AllowIfUserIsInterviewerPolicy } from 'policies/meetingRecord/AllowIfUserIsInterviewerPolicy';
import { Difficulty, Language } from 'types/crud/enums';
import {
  MeetingRecordCreateData,
  MeetingRecordUpdateData,
} from 'types/crud/meetingRecord';
import { InvalidDataError } from 'types/error';

import { BaseService } from './BaseService';
import { MeetingRecord, User } from '.prisma/client';

class MeetingRecordService extends BaseService<
  MeetingRecord,
  MeetingRecordCreateData
> {
  protected createPolicies = [
    new AllowIfUserIsInterviewerPolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected readPolicies = [
    new AllowIfUserIsIntervieweePolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected updatePolicies = [
    new AllowIfUserIsInterviewerPolicy(),
    new AllowIfUserIsIntervieweePolicy(),
    new AlwaysDenyPolicy(),
  ];
  protected deletePolicies = [
    new AllowIfUserIsInterviewerPolicy(),
    new AllowIfUserIsIntervieweePolicy(),
    new AlwaysDenyPolicy(),
  ];

  // The user create method is the only exception that does not
  // require a user object to continue.
  async create(
    data: MeetingRecordCreateData,
    user: User
  ): Promise<MeetingRecord> {
    this.checkRep(data, true);
    await this.checkCreation(data, user);
    return await prisma.meetingRecord.create({
      data,
    });
  }

  // async read(meetingRecordId: number, user: User): Promise<MeetingRecord> {
  //   const foundMeetingRecord = await prisma.meetingRecord.findUnique({
  //     where: {
  //       id: meetingRecordId,
  //     },
  //   });
  //   if (foundMeetingRecord == null) {
  //     throw new ResourceNotFoundError();
  //   }
  //   await this.checkRead(foundMeetingRecord, user);
  //   return foundMeetingRecord;
  // }

  async readAllForInterviewee(
    intervieweeId: string,
    user: User
  ): Promise<MeetingRecord[]> {
    const meetingRecords = await prisma.meetingRecord.findMany({
      where: {
        intervieweeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // TODO: Add logic to query for question content for these meeting records
    // We reject upon finding any meeting record that the user is not allowed to read
    await Promise.all(meetingRecords.map((m) => this.checkRead(m, user)));
    return meetingRecords;
  }

  // async update(
  //   meetingRecordId: number,
  //   data: MeetingRecordUpdateData,
  //   user: User
  // ): Promise<MeetingRecord> {
  //   const currentMeetingRecord = await this.read(meetingRecordId, user);
  //   this.checkRep(data, false);
  //   await this.checkUpdate(currentMeetingRecord, user);
  //   const updatedMeetingRecord = await prisma.meetingRecord.update({
  //     where: {
  //       id: meetingRecordId,
  //     },
  //     data: data,
  //   });
  //   return updatedMeetingRecord;
  // }

  // async delete(meetingRecordId: number, user: User): Promise<void> {
  //   const currentMeetingRecord = await this.read(meetingRecordId, user);
  //   await this.checkDeletion(currentMeetingRecord, user);
  //   await prisma.meetingRecord.delete({
  //     where: {
  //       id: meetingRecordId,
  //     },
  //   });
  // }

  private checkRep(
    data: MeetingRecordCreateData | MeetingRecordUpdateData,
    isCreate: boolean
  ): void {
    if (
      (isCreate && !('intervieweeId' in data)) ||
      (data.intervieweeId != null &&
        (typeof data.intervieweeId !== 'string' ||
          data.intervieweeId.length === 0))
    ) {
      throw new InvalidDataError(
        'The meeting record must have a valid interviewee ID!'
      );
    }
    if (
      (isCreate && !('interviewerId' in data)) ||
      (data.interviewerId &&
        (typeof data.interviewerId !== 'string' ||
          data.interviewerId.length === 0))
    ) {
      throw new InvalidDataError(
        'The meeting record must have a valid interviewer ID!'
      );
    }
    if (
      (isCreate && !('duration' in data)) ||
      (data.duration &&
        (typeof data.duration !== 'number' || data.duration < 0))
    ) {
      throw new InvalidDataError(
        'The meeting record must have a valid non-negative duration (in seconds)!'
      );
    }
    if (
      (isCreate && !('questionId' in data)) ||
      (data.questionId &&
        (typeof data.questionId !== 'string' || data.questionId.length === 0))
    ) {
      throw new InvalidDataError(
        'The meeting record must have a valid question ID!'
      );
    }
    if (
      (isCreate && !('questionDifficulty' in data)) ||
      (data.questionDifficulty &&
        (typeof data.questionDifficulty !== 'string' ||
          !Object.values(Difficulty).includes(data.questionDifficulty)))
    ) {
      throw new InvalidDataError(
        'The meeting record must have a valid question difficulty!'
      );
    }
    if (
      (isCreate && !('language' in data)) ||
      (data.language &&
        (typeof data.language !== 'string' ||
          !Object.values(Language).includes(data.language)))
    ) {
      throw new InvalidDataError(
        'The meeting record must have a valid programming language!'
      );
    }
    if (
      (isCreate && !('codeWritten' in data)) ||
      (data.codeWritten && typeof data.codeWritten !== 'string')
    ) {
      throw new InvalidDataError(
        'The meeting record must have valid code written!'
      );
    }
    if (
      (isCreate && !('isSolved' in data)) ||
      (data.isSolved != null && typeof data.isSolved !== 'boolean')
    ) {
      throw new InvalidDataError(
        'The meeting record must have valid is solved state!'
      );
    }
    if (
      (isCreate && !('feedbackToInterviewee' in data)) ||
      (data.feedbackToInterviewee != null &&
        typeof data.feedbackToInterviewee !== 'string')
    ) {
      throw new InvalidDataError(
        'The meeting record must have valid feedback to interviewee!'
      );
    }
    if (
      data.intervieweeId &&
      data.interviewerId &&
      data.intervieweeId === data.interviewerId
    ) {
      throw new InvalidDataError('A user cannot interview themselves!');
    }
  }
}

const meetingRecordService = new MeetingRecordService();

export default meetingRecordService;
