import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import validateOrThrow from 'src/common/helper/zod-validation.helper';
import { PrismaService } from 'src/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupSchema } from './schemas/create-group.schema';
import { UpdateGroupSchema } from './schemas/update-group.schema';
import { UpdateMemberRoleSchema } from './schemas/update-member-role.schema';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto, creatorProfileId: string) {
    const data = validateOrThrow(CreateGroupSchema, createGroupDto);
    try {
      const group = await this.prisma.group.create({
        data,
      });

      // Add creator as admin
      await this.prisma.profileGroup.create({
        data: {
          profileId: creatorProfileId,
          groupId: group.id,
          role: 'ADMIN',
        },
      });

      return group;
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException(
          'Group with this name or slug already exists!',
        );
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async findAll() {
    return await this.prisma.group.findMany({
      include: {
        _count: {
          select: { profiles: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        profiles: {
          include: {
            profile: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!group) throw new NotFoundException('Group not found!');
    return group;
  }

  async findBySlug(slug: string) {
    const group = await this.prisma.group.findUnique({
      where: { slug },
      include: {
        profiles: {
          include: {
            profile: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!group) throw new NotFoundException('Group not found!');
    return group;
  }

  async getMyGroups(profileId: string) {
    const memberships = await this.prisma.profileGroup.findMany({
      where: { profileId },
      include: {
        group: {
          include: {
            _count: {
              select: { profiles: true },
            },
          },
        },
      },
    });

    return memberships.map((m) => ({
      ...m.group,
      role: m.role,
    }));
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const data = validateOrThrow(UpdateGroupSchema, updateGroupDto);
    try {
      const group = await this.prisma.group.update({
        where: { id },
        data,
      });
      return group;
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Group not found!');
      if (error.code === 'P2002')
        throw new BadRequestException(
          'Group with this name or slug already exists!',
        );
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async joinGroup(groupId: string, profileId: string) {
    try {
      await this.prisma.profileGroup.create({
        data: {
          groupId,
          profileId,
          role: 'MEMBER',
        },
      });
      return { message: 'Successfully joined the group' };
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Already a member of this group!');
      if (error.code === 'P2003')
        throw new NotFoundException('Group not found!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async leaveGroup(groupId: string, profileId: string) {
    try {
      await this.prisma.profileGroup.delete({
        where: {
          profileId_groupId: {
            profileId,
            groupId,
          },
        },
      });
      return { message: 'Successfully left the group' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Not a member of this group!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async updateMemberRole(
    groupId: string,
    targetProfileId: string,
    roleData: { role: string },
    requesterId: string,
  ) {
    const { role } = validateOrThrow(UpdateMemberRoleSchema, roleData);
    // Check if requester is an admin
    const requesterMembership = await this.prisma.profileGroup.findUnique({
      where: {
        profileId_groupId: {
          profileId: requesterId,
          groupId,
        },
      },
    });

    if (!requesterMembership || requesterMembership.role !== 'ADMIN')
      throw new ForbiddenException('Only group admins can change roles!');

    try {
      await this.prisma.profileGroup.update({
        where: {
          profileId_groupId: {
            profileId: targetProfileId,
            groupId,
          },
        },
        data: { role },
      });
      return { message: 'Role updated successfully' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Member not found in this group!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async removeMember(
    groupId: string,
    targetProfileId: string,
    requesterId: string,
  ) {
    // Check if requester is an admin
    const requesterMembership = await this.prisma.profileGroup.findUnique({
      where: {
        profileId_groupId: {
          profileId: requesterId,
          groupId,
        },
      },
    });

    if (!requesterMembership || requesterMembership.role !== 'ADMIN')
      throw new ForbiddenException('Only group admins can remove members!');

    if (targetProfileId === requesterId)
      throw new BadRequestException(
        'Cannot remove yourself. Use leave instead.',
      );

    try {
      await this.prisma.profileGroup.delete({
        where: {
          profileId_groupId: {
            profileId: targetProfileId,
            groupId,
          },
        },
      });
      return { message: 'Member removed successfully' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Member not found in this group!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.group.delete({ where: { id } });
      return { message: 'Group deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Group not found!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async getLeaderboard(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        profiles: {
          include: {
            profile: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                rating: true,
                streak: true,
              },
            },
          },
        },
      },
    });

    if (!group) throw new NotFoundException('Group not found!');

    return group.profiles
      .map((p) => p.profile)
      .sort((a, b) => b.rating - a.rating);
  }
}
