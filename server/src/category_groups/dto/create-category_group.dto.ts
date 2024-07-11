import { IsNotEmpty } from 'class-validator';

export class CreateCategoryGroupDto {
  @IsNotEmpty()
  name: string;
}
