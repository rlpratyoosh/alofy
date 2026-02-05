/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Problem_title_key";

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- CreateIndex
CREATE INDEX "Problem_title_idx" ON "Problem"("title");
