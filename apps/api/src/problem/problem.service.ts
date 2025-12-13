import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import validateOrThrow from 'src/common/helper/zod-validation.helper';
import { PrismaService } from 'src/prisma.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { CreateProblemSchema } from './schemas/create-problem.schema';
import { UpdateProblemSchema } from './schemas/update-problem.schema';

@Injectable()
export class ProblemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProblemDto: CreateProblemDto) {
    const data = validateOrThrow(CreateProblemSchema, createProblemDto);
    try {
      const problem = await this.prisma.problem.create({
        data,
      });
      return problem;
    } catch (error) {
      if (error.code === 'P2002')
        throw new BadRequestException('Problem with this slug already exists!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async findAll(difficulty?: string) {
    const where = difficulty ? { difficulty: difficulty as any } : {};
    return await this.prisma.problem.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { id },
    });

    if (!problem) throw new NotFoundException('Problem not found!');
    return problem;
  }

  async findBySlug(slug: string) {
    const problem = await this.prisma.problem.findUnique({
      where: { slug },
    });

    if (!problem) throw new NotFoundException('Problem not found!');
    return problem;
  }

  async update(id: string, updateProblemDto: UpdateProblemDto) {
    const data = validateOrThrow(UpdateProblemSchema, updateProblemDto);
    try {
      const problem = await this.prisma.problem.update({
        where: { id },
        data,
      });
      return problem;
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Problem not found!');
      if (error.code === 'P2002')
        throw new BadRequestException('Problem with this slug already exists!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.problem.delete({
        where: { id },
      });
      return { message: 'Problem deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025')
        throw new NotFoundException('Problem not found!');
      throw new InternalServerErrorException('Unknown error occurred!');
    }
  }

  async getRandomProblem(difficulty?: string) {
    const where = difficulty ? { difficulty: difficulty as any } : {};
    const count = await this.prisma.problem.count({ where });

    if (count === 0) throw new NotFoundException('No problems found!');

    const skip = Math.floor(Math.random() * count);
    const problems = await this.prisma.problem.findMany({
      where,
      skip,
      take: 1,
    });

    return problems[0];
  }
}
