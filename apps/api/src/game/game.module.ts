import { Module } from '@nestjs/common';
import { AiModule } from 'src/ai/ai.module';
import { EncryptionModule } from 'src/common/encryption/encryption.module';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [AiModule, EncryptionModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
