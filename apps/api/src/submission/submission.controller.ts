import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AllowedRole } from 'src/common/decorators/roles.decorator';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { SubmissionService } from './submission.service';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @AllowedRole('ADMIN')
  @Get('all')
  findAll() {
    return this.submissionService.findAll();
  }

  @Get('my')
  findMySubmissions(@Req() req) {
    return this.submissionService.findMySubmissions(req.user.profileId);
  }

  @Get('stats')
  getMyStats(@Req() req) {
    return this.submissionService.getPlayerStats(req.user.profileId);
  }

  @AllowedRole('ADMIN')
  @Get('stats/:profileId')
  getPlayerStats(@Param('profileId') profileId: string) {
    return this.submissionService.getPlayerStats(profileId);
  }

  @Get('battle/:battleId')
  findByBattle(@Param('battleId') battleId: string) {
    return this.submissionService.findByBattle(battleId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @AllowedRole('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
  ) {
    return this.submissionService.update(id, updateSubmissionDto);
  }

  @Post(':id/result')
  updateResult(
    @Param('id') id: string,
    @Body()
    body: {
      status: string;
      passedTests: number;
      totalTests: number;
      executionTime: number;
      memoryUsed: number;
      aiFeedback?: string;
    },
  ) {
    return this.submissionService.updateResult(id, body);
  }

  @AllowedRole('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}
