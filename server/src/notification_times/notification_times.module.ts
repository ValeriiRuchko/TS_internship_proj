import { Module } from '@nestjs/common';
import { NotificationTimesService } from './notification_times.service';
import { NotificationTimesController } from './notification_times.controller';

@Module({
  controllers: [NotificationTimesController],
  providers: [NotificationTimesService],
})
export class NotificationTimesModule {}
