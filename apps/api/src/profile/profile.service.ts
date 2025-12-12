import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfileDto: CreateProfileDto) {
    try {
      const profile = this.prisma.profile.create({
        data: createProfileDto,
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

  findAll() {
    return this.prisma.profile.findMany();
  }

  findOne(id: string) {
    let profile = this.prisma.profile.findUnique({
      where: { userId: id },
    });

    if (!profile) throw new BadRequestException("Profile Doesn't Exist");

    return profile;
  }

  findOneAdmin(id: string) {
    let profile = this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) throw new BadRequestException("Profile Doesn't Exist");

    return profile;
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    try {
      this.prisma.profile.update({
        where: { userId: id },
        data: updateProfileDto,
      });
    } catch (er) {
      if (er.code === 'P2025')
        throw new NotFoundException('Profile not found!');
      throw new InternalServerErrorException('Unknown error occured!');
    }

    return 'Successfully updated profile';
  }

  updateAdmin(id: string, updateProfileDto: UpdateProfileDto) {
    try {
      this.prisma.profile.update({
        where: { id },
        data: updateProfileDto,
      });
    } catch (er) {
      if (er.code === 'P2025')
        throw new NotFoundException('Profile not found!');
      throw new InternalServerErrorException('Unknown error occured!');
    }

    return 'Successfully updated profile';
  }

  remove(id: string) {
    try {
      this.prisma.profile.delete({
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
