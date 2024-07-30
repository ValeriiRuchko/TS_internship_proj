import { Module } from '@nestjs/common';
import { NotificationsConsumerService } from './notifications-consumer.service';
import { NotifJobSetupModule } from '../notif-job-setup/notif-job-setup.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [NotifJobSetupModule, NotificationsModule, NotifJobSetupModule],
  providers: [NotificationsConsumerService],
})
export class NotificationsConsumerModule {}
