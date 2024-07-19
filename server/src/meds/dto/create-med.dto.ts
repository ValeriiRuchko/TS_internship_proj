import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { reminderDays } from 'src/notifications/dto/create-notification.dto';
import { Notification } from 'src/notifications/entities/notifications.entity';

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
