import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ExecutionController } from './execution.controller';
import { ExecutionService } from './execution.service';
import { ExecutionWorker } from './execution.worker';
import { EventsModule } from 'src/events/events.module';
import { DemoExecutionWorker } from './demo.worker';

@Module({
  imports: [
    EventsModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue(
      {
        name: 'executionQueue',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
        },
      },
      {
        name: 'demoExecutionQueue',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
        },
      },
    ),
  ],
  controllers: [ExecutionController],
  providers: [ExecutionService, ExecutionWorker, DemoExecutionWorker],
  exports: [BullModule],
})
export default class ExecutionModule {}
