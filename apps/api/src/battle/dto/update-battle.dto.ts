import { PartialType } from '@nestjs/mapped-types';
import { BattleStatus } from '@prisma/client';
import { CreateBattleDto } from './create-battle.dto';

export class UpdateBattleDto extends PartialType(CreateBattleDto) {
  status?: BattleStatus;
  winnerId?: string;
  player1TimeMs?: number;
  player2TimeMs?: number;
  snapshotUrl?: string;
  finishedAt?: Date;
}
