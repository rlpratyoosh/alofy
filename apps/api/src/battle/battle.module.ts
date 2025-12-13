import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';

@Module({
  controllers: [BattleController],
  providers: [BattleService, PrismaService],
  exports: [BattleService],
})
export class BattleModule {}
