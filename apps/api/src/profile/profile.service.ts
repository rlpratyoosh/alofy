import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@repo/db';
import Redis from 'ioredis';
import { PrismaClientKnownRequestError } from 'node_modules/@repo/db/dist/generated/prisma/internal/prismaNamespace';
import { EncryptionService } from 'src/common/encryption/encryption.service';
import { REDIS_CLIENT } from 'src/common/redis/redis.module';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    private readonly encryptionService: EncryptionService,
  ) {}

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      if (updateProfileDto.apiKey) {
        const encryptedKey = await this.encryptionService.encrypt(
          updateProfileDto.apiKey,
        );
        updateProfileDto = {
          ...updateProfileDto,
          apiKey: encryptedKey,
        };
      }
      await prisma.profile.update({
        where: { userId },
        data: updateProfileDto,
      });
      await this.redis.del(`user:${userId}`);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      )
        throw new NotFoundException('Profile associated with user not found');

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
