import { forwardRef, Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => NotificationsModule),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
