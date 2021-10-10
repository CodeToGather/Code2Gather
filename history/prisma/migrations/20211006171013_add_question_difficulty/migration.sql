/*
  Warnings:

  - Added the required column `questionDifficulty` to the `MeetingRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeetingRecord" ADD COLUMN     "questionDifficulty" "Difficulty" NOT NULL;
