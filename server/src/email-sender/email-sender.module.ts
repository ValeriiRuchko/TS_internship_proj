import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [NotificationsModule, ScheduleModule.forRoot()],
  providers: [EmailSenderService],
})
export class EmailSenderModule {}
