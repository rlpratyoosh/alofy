/*
  Warnings:

  - Added the required column `validationType` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ValidationType" AS ENUM ('EXACT', 'UNORDERED');

-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "validationType" "ValidationType" NOT NULL;
