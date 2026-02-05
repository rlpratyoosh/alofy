-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_characterId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_profileId_fkey";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "characterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
