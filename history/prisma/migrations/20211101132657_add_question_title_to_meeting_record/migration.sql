/*
  Warnings:

  - Added the required column `questionTitle` to the `MeetingRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeetingRecord" ADD COLUMN     "questionTitle" TEXT NOT NULL;
