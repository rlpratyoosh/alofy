import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { EventsGateway } from './events.gateway';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';

@QueueEventsListener('code-execution-queue')
export class JobEventListener extends QueueEventsHost {
  constructor(private readonly eventsGateway: EventsGateway) {
    super();
  }
  logger = new Logger('CodeExecutionQueue');

  @OnQueueEvent('added')
  onAdded(job: Job) {
    this.logger.log(`Job ${job.id} has been added to the queue `);
  }

  @OnQueueEvent('completed')
  onCompleted({ jobId, returnvalue }: { jobId: string; returnvalue: any }) {
    this.logger.log(`Job ${jobId} has been completed`);
    this.eventsGateway.notifyJobCompleted(jobId, returnvalue);
  }

  @OnQueueEvent('failed')
  onFailed({ jobId, failedReason }: { jobId: string; failedReason: string }) {
    this.logger.log(`Job ${jobId} has failed`);
    this.eventsGateway.notifyJobCompleted(jobId, { error: failedReason });
  }
}
