import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JobEventListener } from './job-event.listener';

@Module({
    providers: [EventsGateway, JobEventListener]
})
export class EventsModule {}
