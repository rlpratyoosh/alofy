import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SetPublic } from 'src/common/decorators/public.decorator';
import { AllowedRole } from 'src/common/decorators/roles.decorator';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { ProblemService } from './problem.service';

@Controller('problem')
export class ProblemController {
  constructor(private readonly problemService: ProblemService) {}

  @AllowedRole('ADMIN')
  @Post()
  create(@Body() createProblemDto: CreateProblemDto) {
    return this.problemService.create(createProblemDto);
  }

  @SetPublic()
  @Get()
  findAll(@Query('difficulty') difficulty?: string) {
    return this.problemService.findAll(difficulty);
  }

  @SetPublic()
  @Get('random')
  getRandomProblem(@Query('difficulty') difficulty?: string) {
    return this.problemService.getRandomProblem(difficulty);
  }

  @SetPublic()
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.problemService.findBySlug(slug);
  }

  @SetPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.problemService.findOne(id);
  }

  @AllowedRole('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProblemDto: UpdateProblemDto) {
    return this.problemService.update(id, updateProblemDto);
  }

  @AllowedRole('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.problemService.remove(id);
  }
}
