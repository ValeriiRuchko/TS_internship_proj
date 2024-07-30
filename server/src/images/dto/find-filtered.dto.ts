import { Med } from '../../meds/entities/meds.entity';
import { User } from '../../users/entities/users.entity';

export class FilteredImageDto {
  user?: User;
  med?: Med;
}
