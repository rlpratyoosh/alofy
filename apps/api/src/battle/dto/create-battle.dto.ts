import { BattleStatus } from '@prisma/client';

export class CreateBattleDto {
  problemId: string;
  player1Id: string;
  player2Id: string;
  status?: BattleStatus;
}
