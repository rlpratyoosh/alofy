import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@repo/db';
import { PrismaClientKnownRequestError } from 'node_modules/@repo/db/dist/generated/prisma/internal/prismaNamespace';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class CharacterService {
  async new(userId: string, createCharacterDto: CreateCharacterDto) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: {
          id: true,
        },
      });
      if (!profile)
        throw new BadRequestException(
          'Could not find profile attached with the user account',
        );

      const data = {
        ...createCharacterDto,
        profileId: profile.id,
      };

      await prisma.character.create({
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to create character');
    }
  }

  async delete(userId: string, characterId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      if (!profile)
        throw new BadRequestException('No profile attached with the user');

      const character = await prisma.character.findUnique({
        where: { id: characterId, profileId: profile.id },
      });
      if (!character) throw new NotFoundException('Character not found');

      await prisma.character.delete({
        where: { id: characterId, profileId: profile.id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      )
        throw new NotFoundException('Character not found');
      throw new InternalServerErrorException('Failed to delete character');
    }
  }

  async get(userId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      if (!profile)
        throw new BadRequestException(
          'Could not find profile attached with the user account',
        );

      return await prisma.character.findMany({
        where: { profileId: profile.id },
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch characters');
    }
  }

  async getWithId(userId: string, id: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      if (!profile)
        throw new BadRequestException(
          'Could not find profile attached with the user account',
        );

      const character = await prisma.character.findUnique({
        where: { id, profileId: profile.id },
      });
      if (!character) throw new NotFoundException('Character not found');

      return character;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch character');
    }
  }
}
