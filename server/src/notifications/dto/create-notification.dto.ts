import { IsDateString, IsNumber } from 'class-validator';
import { Med } from '../../meds/entities/meds.entity';
import { NotificationTime } from '../../notification_times/entities/notification_time.entity';
import { WeekDay } from '../enums/weekday.enum';

export type reminderDays = {
  Mondays: WeekDay.Monday | null;
  Tuesdays: WeekDay.Tuesday | null;
  Wednesday: WeekDay.Wednesday | null;
  Thursday: WeekDay.Thursday | null;
  Friday: WeekDay.Friday | null;
  Saturday: WeekDay.Saturday | null;
  Sunday: WeekDay.Sunday | null;
};

// NOTE: How it will look like actually:
// Monday: 0b0000001 | null,
// Thursday: 0b0000010 | null
// ...

export class CreateNotificationDto {
  @IsDateString()
  start_date: Date;

  reminderDays: reminderDays;

  @IsNumber()
  intakePillsAmount: number;

  notificationMsg: string;

  med: Med;

  notificationTimes: NotificationTime[];
}
