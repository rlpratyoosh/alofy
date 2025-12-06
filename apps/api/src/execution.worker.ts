import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('code-execution-queue', {limiter: {duration: 10000, max: 20} })
export class CodeExecutor extends WorkerHost {
  private readonly logger = new Logger(CodeExecutor.name);

  async process(job: Job) {
    const { language, code, input } = job.data;
    this.logger.log(`Executing Job Id: ${job.id}`)

    const response = await fetch(`${process.env.PISTON_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        version: '*',
        files: [{ content: code }],
        stdin: input
      }),
    });

    if (!response.ok)
      throw new Error(`Something went wrong while processing job: ${job.id}`);

    const result = await response.json();
    console.log(result);

    this.logger.log(`Execution completed for Job Id: ${job.id}`)
    return result;
  }
}
