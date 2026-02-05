-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ENDED');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'NOT_STARTED';
