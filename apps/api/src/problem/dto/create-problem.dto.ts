import { Difficulty, Prisma } from '@prisma/client';

export class CreateProblemDto {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  starterCode?: string;
  testCases?: Prisma.InputJsonValue;
}
