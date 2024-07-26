import { Module } from '@nestjs/common';
import { NotificationsConsumerService } from './notifications-consumer.service';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';

@Module({
  imports: [EmailSenderModule],
  providers: [NotificationsConsumerService],
})
export class NotificationsConsumerModule {}
