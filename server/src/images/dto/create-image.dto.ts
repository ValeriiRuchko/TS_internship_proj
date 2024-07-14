import { IsNotEmpty } from 'class-validator';
import { Med } from 'src/meds/entities/meds.entity';
import { User } from 'src/users/entities/users.entity';

export class CreateImageDto {
  @IsNotEmpty()
  pathToImage: string;

  user?: User;

  med?: Med;
}
