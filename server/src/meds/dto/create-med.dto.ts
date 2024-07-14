import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';

// TODO: adjust all validations and uncomment commented

export class CreateMedDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  pillsAmount: number;

  @IsNotEmpty()
  @IsDate()
  expirationDate: Date;

  categories: Category[];

  notifications: Notification[];
}
