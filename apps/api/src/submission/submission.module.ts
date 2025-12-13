import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService, PrismaService],
  exports: [SubmissionService],
})
export class SubmissionModule {}
