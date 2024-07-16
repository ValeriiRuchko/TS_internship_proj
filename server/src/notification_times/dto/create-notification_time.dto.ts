import { IsMilitaryTime } from 'class-validator';
import { Notification } from 'src/notifications/entities/notifications.entity';

export class CreateNotificationTimeDto {
  @IsMilitaryTime()
  time: string;

  notification: Notification;
}
