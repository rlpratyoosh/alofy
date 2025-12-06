import { InjectQueue } from '@nestjs/bullmq';
import { Body, Controller, Post } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SetPublic } from './common/decorators/public.decorator';

@SetPublic()
@Controller()
export class CodeExecutorController {
  constructor(
    @InjectQueue('code-execution-queue')
    private readonly executionQueue: Queue,
  ) {}

  @Post('execute')
  async executeCode(@Body() body: { language: string; code: string, input: string }) {
    const result = await this.executionQueue.add('executor', {
      language: body.language,
      code: body.code,
      input: body.input
    });

    return {
      message: 'Job added succefully to the queue',
      jobId: result.id,
    };
  }
}
