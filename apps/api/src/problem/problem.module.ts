import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ProblemController } from './problem.controller';
import { ProblemService } from './problem.service';

@Module({
  controllers: [ProblemController],
  providers: [ProblemService, PrismaService],
  exports: [ProblemService],
})
export class ProblemModule {}
