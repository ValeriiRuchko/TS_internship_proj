import { Module } from '@nestjs/common';
import { NotificationsConsumerService } from './notifications-consumer.service';
import { NotifJobSetupModule } from 'src/notif-job-setup/notif-job-setup.module';

@Module({
  imports: [NotifJobSetupModule],
  providers: [NotificationsConsumerService],
})
export class NotificationsConsumerModule {}
