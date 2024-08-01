import { IsMilitaryTime } from 'class-validator';
import { Notification } from '../../notifications/entities/notifications.entity';

export class CreateNotificationTimeDto {
  @IsMilitaryTime()
  time: string;

  notification: Notification;
}
