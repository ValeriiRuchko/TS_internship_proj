import { Module } from '@nestjs/common';
import { NotificationTimesService } from './notification_times.service';
import { NotificationTimesController } from './notification_times.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTime } from './entities/notification_time.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationTime])],
  controllers: [NotificationTimesController],
  providers: [NotificationTimesService],
  exports: [NotificationTimesService],
})
export class NotificationTimesModule {}
