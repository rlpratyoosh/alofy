import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { SetPublic } from 'src/common/decorators/public.decorator';
import { SubmitCodeDto, SubmitDemoCodeDto } from './dto/execution.dto';

@Controller()
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  @Post('execute')
  @HttpCode(HttpStatus.OK)
  submitCode(@Body() submitCodeDto: SubmitCodeDto) {
    return this.executionService.submitCode(submitCodeDto);
  }

  @Post('execute/demo')
  @HttpCode(HttpStatus.OK)
  @SetPublic()
  submitDemoCode(@Body() submitDemoCodeDto: SubmitDemoCodeDto) {
    return this.executionService.submitDemoCode(submitDemoCodeDto);
  }
}
