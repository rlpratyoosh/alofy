import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BattleStatus } from '@prisma/client';
import validateOrThrow from 'src/common/helper/zod-validation.helper';
import { PrismaService } from 'src/prisma.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { UpdateBattleDto } from './dto/update-battle.dto';
import { CompleteBattleSchema } from './schemas/complete-battle.schema';
import { CreateBattleSchema } from './schemas/create-battle.schema';
import { UpdateBattleSchema } from './schemas/update-battle.schema';

@Injectable()
export class BattleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBattleDto: CreateBattleDto) {
    const data = validateOrThrow(CreateBattleSchema, createBattleDto);
    try {
      const battle = await this.prisma.battle.create({
        data,
        include: {
          problem: true,
          player1: true,
          player2: true,
        },
      });
      return battle;
    } catch (error) {
      if (error.code === 'P2003')
        throw new BadRequestException('Invalid player or problem ID!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async findAll(status?: BattleStatus) {
    const where = status ? { status } : {};
    return await this.prisma.battle.findMany({
      where,
      include: {
        problem: {
          select: { id: true, title: true, slug: true, difficulty: true },
        },
        player1: {
          select: { id: true, fullName: true, rating: true },
        },
        player2: {
          select: { id: true, fullName: true, rating: true },
        },
        winner: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const battle = await this.prisma.battle.findUnique({
      where: { id },
      include: {
        problem: true,
        player1: true,
        player2: true,
        winner: true,
        submissions: true,
      },
    });

    if (!battle) throw new NotFoundException('Battle not found!');
    return battle;
  }

  async findMyBattles(profileId: string, status?: BattleStatus) {
    const where: any = {
      OR: [{ player1Id: profileId }, { player2Id: profileId }],
    };
    if (status) where.status = status;

    return await this.prisma.battle.findMany({
      where,
      include: {
        problem: {
          select: { id: true, title: true, slug: true, difficulty: true },
        },
        player1: {
          select: { id: true, fullName: true, rating: true },
        },
        player2: {
          select: { id: true, fullName: true, rating: true },
        },
        winner: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateBattleDto: UpdateBattleDto) {
    const data = validateOrThrow(UpdateBattleSchema, updateBattleDto);
    try {
      const battle = await this.prisma.battle.update({
        where: { id },
        data,
        include: {
          problem: true,
          player1: true,
          player2: true,
          winner: true,
        },
      });
      return battle;
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Battle not found!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async completeBattle(
    id: string,
    completeBattleData: {
      winnerId: string;
      player1TimeMs: number;
      player2TimeMs: number;
    },
  ) {
    const data = validateOrThrow(CompleteBattleSchema, completeBattleData);
    const battle = await this.prisma.battle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('Battle not found!');
    if (battle.status !== BattleStatus.ONGOING)
      throw new BadRequestException('Battle is not ongoing!');

    return await this.prisma.battle.update({
      where: { id },
      data: {
        status: BattleStatus.COMPLETED,
        winnerId: data.winnerId,
        player1TimeMs: data.player1TimeMs,
        player2TimeMs: data.player2TimeMs,
        finishedAt: new Date(),
      },
    });
  }

  async abortBattle(id: string, userId: string) {
    const battle = await this.prisma.battle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('Battle not found!');

    if (battle.player1Id !== userId && battle.player2Id !== userId)
      throw new ForbiddenException('You are not part of this battle!');

    if (battle.status === BattleStatus.COMPLETED)
      throw new BadRequestException('Battle is already completed!');

    return await this.prisma.battle.update({
      where: { id },
      data: {
        status: BattleStatus.ABORTED,
        finishedAt: new Date(),
      },
    });
  }

  async startBattle(id: string) {
    const battle = await this.prisma.battle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('Battle not found!');
    if (battle.status !== BattleStatus.PENDING)
      throw new BadRequestException('Battle cannot be started!');

    return await this.prisma.battle.update({
      where: { id },
      data: { status: BattleStatus.ONGOING },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.battle.delete({ where: { id } });
      return { message: 'Battle deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Battle not found!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }
}
