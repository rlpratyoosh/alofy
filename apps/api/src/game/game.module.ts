import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
