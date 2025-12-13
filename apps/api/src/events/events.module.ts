import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import authConfig from 'src/config/auth.config';
import { EventsGateway } from './events.gateway';
import { JobEventListener } from './job-event.listener';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  providers: [EventsGateway, JobEventListener],
})
export class EventsModule {}
