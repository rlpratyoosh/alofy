import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { EncryptionModule } from 'src/common/encryption/encryption.module';

@Module({
  imports: [EncryptionModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
