import { Injectable } from '@nestjs/common';
import { CreateNotificationTimeDto } from './dto/create-notification_time.dto';
import { UpdateNotificationTimeDto } from './dto/update-notification_time.dto';

@Injectable()
export class NotificationTimesService {
  create(createNotificationTimeDto: CreateNotificationTimeDto) {
    return 'This action adds a new notificationTime';
  }

  findAll() {
    return `This action returns all notificationTimes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notificationTime`;
  }

  update(id: number, updateNotificationTimeDto: UpdateNotificationTimeDto) {
    return `This action updates a #${id} notificationTime`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificationTime`;
  }
}
