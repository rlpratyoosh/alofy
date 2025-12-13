import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import validateOrThrow from 'src/common/helper/zod-validation.helper';
import { PrismaService } from 'src/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { CreateSubmissionSchema } from './schemas/create-submission.schema';
import { UpdateResultSchema } from './schemas/update-result.schema';
import { UpdateSubmissionSchema } from './schemas/update-submission.schema';

@Injectable()
export class SubmissionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubmissionDto: CreateSubmissionDto) {
    const validatedData = validateOrThrow(
      CreateSubmissionSchema,
      createSubmissionDto,
    );
    try {
      // Initialize with PENDING status and default values
      const submission = await this.prisma.submission.create({
        data: {
          ...validatedData,
          status: 'PENDING',
          executionTime: 0,
          memoryUsed: 0,
        },
        include: {
          battle: true,
          player: true,
          problem: true,
        },
      });
      return submission;
    } catch (error) {
      if (error.code === 'P2003')
        throw new BadRequestException('Invalid battle, player, or problem ID!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async findAll() {
    return await this.prisma.submission.findMany({
      include: {
        battle: {
          select: { id: true, status: true },
        },
        player: {
          select: { id: true, fullName: true },
        },
        problem: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        battle: true,
        player: true,
        problem: true,
      },
    });

    if (!submission) throw new NotFoundException('Submission not found!');
    return submission;
  }

  async findByBattle(battleId: string) {
    return await this.prisma.submission.findMany({
      where: { battleId },
      include: {
        player: {
          select: { id: true, fullName: true },
        },
        problem: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMySubmissions(profileId: string) {
    return await this.prisma.submission.findMany({
      where: { playerId: profileId },
      include: {
        battle: {
          select: { id: true, status: true },
        },
        problem: {
          select: { id: true, title: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateSubmissionDto: UpdateSubmissionDto) {
    const data = validateOrThrow(UpdateSubmissionSchema, updateSubmissionDto);
    try {
      const submission = await this.prisma.submission.update({
        where: { id },
        data,
      });
      return submission;
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Submission not found!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async updateResult(
    id: string,
    resultData: {
      status: string;
      passedTests: number;
      totalTests: number;
      executionTime: number;
      memoryUsed: number;
      aiFeedback?: string;
    },
  ) {
    const data = validateOrThrow(UpdateResultSchema, resultData);
    try {
      return await this.prisma.submission.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Submission not found!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.submission.delete({ where: { id } });
      return { message: 'Submission deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Submission not found!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async getPlayerStats(profileId: string) {
    const submissions = await this.prisma.submission.findMany({
      where: { playerId: profileId },
    });

    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter(
      (s) => s.status === 'ACCEPTED',
    ).length;
    const avgExecutionTime =
      submissions.reduce((acc, s) => acc + s.executionTime, 0) /
        totalSubmissions || 0;

    return {
      totalSubmissions,
      acceptedSubmissions,
      acceptanceRate:
        totalSubmissions > 0
          ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(2)
          : 0,
      avgExecutionTime: avgExecutionTime.toFixed(2),
    };
  }
}
