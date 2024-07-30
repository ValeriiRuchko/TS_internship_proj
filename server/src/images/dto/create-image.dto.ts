import { IsNotEmpty } from 'class-validator';
import { Med } from '../../meds/entities/meds.entity';
import { User } from '../../users/entities/users.entity';

export class CreateImageDto {
  @IsNotEmpty()
  pathToImage: string;

  user?: User;

  med?: Med;
}
