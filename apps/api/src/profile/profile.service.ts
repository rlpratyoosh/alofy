import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import validateOrThrow from 'src/common/helper/zod-validation.helper';
import { PrismaService } from 'src/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileSchema } from './schema/create-profile.schema';
import { UpdateProfileSchema } from './schema/update-profile.schema';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    const data = validateOrThrow(CreateProfileSchema, createProfileDto);
    try {
      const profile = await this.prisma.profile.create({
        data,
      });
    } catch (er) {
      if (er.code === 'P2002')
        throw new BadRequestException(
          'A profile already exists on the specified user!',
        );
      throw new InternalServerErrorException('Unknown error occured!');
    }

    return 'Successfully added new Profile';
  }

  async findAll() {
    return await this.prisma.profile.findMany();
  }

  async findOne(id: string) {
    let profile = await this.prisma.profile.findUnique({
      where: { userId: id },
    });

    if (!profile) throw new BadRequestException("Profile Doesn't Exist");

    return profile;
  }

  async findOneAdmin(id: string) {
    let profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) throw new BadRequestException("Profile Doesn't Exist");

    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const data = validateOrThrow(UpdateProfileSchema, updateProfileDto);
    try {
      await this.prisma.profile.update({
        where: { userId: id },
        data,
      });
    } catch (er) {
      if (er.code === 'P2025')
        throw new NotFoundException('Profile not found!');
      throw new InternalServerErrorException('Unknown error occured!');
    }

    return 'Successfully updated profile';
  }

  async updateAdmin(id: string, updateProfileDto: UpdateProfileDto) {
    const data = validateOrThrow(UpdateProfileSchema, updateProfileDto);
    try {
      await this.prisma.profile.update({
        where: { id },
        data,
      });
    } catch (er) {
      if (er.code === 'P2025')
        throw new NotFoundException('Profile not found!');
      throw new InternalServerErrorException('Unknown error occured!');
    }

    return 'Successfully updated profile';
  }

  async remove(id: string) {
    try {
      await this.prisma.profile.delete({
        where: { id },
      });
    } catch (er) {
      if (er.code === 'P2025')
        throw new NotFoundException('Profile not found!');
      throw new InternalServerErrorException('Unknown error occured!');
    }

    return 'Successfully deleted profile';
  }
}
