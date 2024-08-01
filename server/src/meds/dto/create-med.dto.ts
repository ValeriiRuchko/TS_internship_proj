import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { reminderDays } from '../../notifications/dto/create-notification.dto';
import { Notification } from '../../notifications/entities/notifications.entity';

export class CreateMedDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsInt()
  pillsAmount: number;

  @IsNotEmpty()
  @IsDateString()
  expirationDate: Date;

  categories: Category[];

  notification: Notification & {
    reminderDays: reminderDays;
  };
}
