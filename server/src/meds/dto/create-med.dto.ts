import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
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

  notifications: Notification[];
}
