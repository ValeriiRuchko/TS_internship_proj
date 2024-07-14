import { Med } from 'src/meds/entities/meds.entity';
import { User } from 'src/users/entities/users.entity';

export class FilteredImageDto {
  user?: User;
  med?: Med;
}
