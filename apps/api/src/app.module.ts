import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import envValidation from './config/env.validation';
import mailConfig from './config/mail.config';
import { UserModule } from './user/user.module';
import { BullModule } from '@nestjs/bullmq';
import { CodeExecutorController } from './executor.controller';
import { CodeExecutor } from './execution.worker';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    EventsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validate: envValidation,
      load: [mailConfig],
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.host'),
          port: configService.get('mail.port'),
          secure: true,
          auth: {
            user: configService.get('mail.username'),
            pass: configService.get('mail.password'),
          },
        },
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      },
      defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false
      },
    }),
    BullModule.registerQueue({
      name: 'code-execution-queue',
    }),
  ],
  controllers: [AppController, CodeExecutorController],
  providers: [
    AppService,
    CodeExecutor,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
