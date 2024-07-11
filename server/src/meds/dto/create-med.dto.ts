import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

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

  categories: string[];
}
