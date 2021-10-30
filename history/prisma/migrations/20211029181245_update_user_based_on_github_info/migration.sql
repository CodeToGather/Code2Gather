/*
  Warnings:

  - Added the required column `photoUrl` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_githubUsername_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photoUrl" TEXT NOT NULL;
