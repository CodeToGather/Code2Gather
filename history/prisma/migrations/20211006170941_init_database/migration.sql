-- CreateEnum
CREATE TYPE "Language" AS ENUM ('PYTHON', 'JAVA', 'JAVASCRIPT');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "githubUsername" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "ratingUserId" TEXT,
    "ratedUserId" TEXT NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingRecord" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "interviewerId" TEXT,
    "intervieweeId" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "questionId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "codeWritten" TEXT NOT NULL,
    "isSolved" BOOLEAN NOT NULL,
    "feedbackToInterviewee" TEXT NOT NULL,

    CONSTRAINT "MeetingRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubUsername_key" ON "User"("githubUsername");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_ratingUserId_fkey" FOREIGN KEY ("ratingUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_ratedUserId_fkey" FOREIGN KEY ("ratedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingRecord" ADD CONSTRAINT "MeetingRecord_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingRecord" ADD CONSTRAINT "MeetingRecord_intervieweeId_fkey" FOREIGN KEY ("intervieweeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
