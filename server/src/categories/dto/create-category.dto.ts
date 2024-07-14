import { IsNotEmpty } from 'class-validator';
import { CategoryGroup } from 'src/category_groups/entities/category_group.entity';
// import { CategoryGroup } from 'src/category_groups/entities/category_group.entity';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  categoryGroup: CategoryGroup;
}
