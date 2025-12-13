import { PartialType } from '@nestjs/mapped-types';
import { CreateSubmissionDto } from './create-submission.dto';

export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) {
  status?: string;
  passedTests?: number;
  totalTests?: number;
  executionTime?: number;
  memoryUsed?: number;
  aiFeedback?: string;
}
