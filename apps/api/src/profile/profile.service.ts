import {
  HttpException,
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

  async hasApiKey(userId: string): Promise<{ hasApiKey: boolean }> {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: { apiKey: true },
      });
      return { hasApiKey: !!profile?.apiKey };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to check API key status');
    }
  }

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
      if (error instanceof HttpException) throw error;
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      )
        throw new NotFoundException('Profile associated with user not found');

      throw new InternalServerErrorException('Failed to update profile');
    }
  }
}
