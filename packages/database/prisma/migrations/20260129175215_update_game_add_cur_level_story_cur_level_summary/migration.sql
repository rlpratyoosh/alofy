/*
  Warnings:

  - You are about to drop the column `lastParagraph` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "lastParagraph",
ADD COLUMN     "curLevelStory" TEXT,
ADD COLUMN     "curLevelSummary" TEXT;
