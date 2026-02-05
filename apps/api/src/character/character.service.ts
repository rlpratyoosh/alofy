import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { prisma } from '@repo/db';

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
          'Could not find profile attatched with the user account',
        );

      const data = {
        ...createCharacterDto,
        profileId: profile.id,
      };

      await prisma.character.create({
        data,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (er) {
      throw new InternalServerErrorException();
    }
  }

  async delete(userId: string, characterId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      if (!profile)
        throw new BadRequestException('No profile attached with the user');
      await prisma.character.delete({
        where: { id: characterId, profileId: profile.id },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (er) {
      throw new InternalServerErrorException();
    }
  }

  async get(userId: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      if (!profile)
        throw new BadRequestException(
          'Could not find profile attatched with the user account',
        );

      return await prisma.character.findMany({
        where: { profileId: profile.id },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (er) {
      throw new InternalServerErrorException();
    }
  }

  async getWithId(userId: string, id: string) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
      });
      if (!profile)
        throw new BadRequestException(
          'Could not find profile attatched with the user account',
        );

      return await prisma.character.findUnique({
        where: { id, profileId: profile.id },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (er) {
      throw new InternalServerErrorException();
    }
  }
}
