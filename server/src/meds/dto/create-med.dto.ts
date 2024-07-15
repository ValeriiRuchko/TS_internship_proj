import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';

// TODO: adjust all validations and uncomment commented

export class CreateMedDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  pillsAmount: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  expirationDate: Date;

  categories: Category[];

  notifications: Notification[];
}
