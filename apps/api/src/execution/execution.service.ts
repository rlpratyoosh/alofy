import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { SubmitCodeDto, SubmitDemoCodeDto } from './dto/execution.dto';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectQueue('executionQueue')
    private readonly eq: Queue,
    @InjectQueue('demoExecutionQueue')
    private readonly deq: Queue,
  ) {}

  private logger: Logger = new Logger('ExecutionJob');

  async submitCode(submitCodeDto: SubmitCodeDto) {
    const job = await this.eq.add(
      'executionJob',
      { submitCodeDto },
      {
        priority: 1,
      },
    );
    this.logger.log(
      `New Job Added: ${job.id} from socket ${submitCodeDto.socketId}`,
    );
    return job.id;
  }

  async submitDemoCode(submitDemoCodeDto: SubmitDemoCodeDto) {
    const job = await this.deq.add(
      'demoExecutionJob',
      { submitDemoCodeDto },
      { priority: 1 },
    );
    this.logger.log(
      `New Demo Job Added: ${job.id} from socket ${submitDemoCodeDto.socketId}`,
    );
    return job.id;
  }
}
