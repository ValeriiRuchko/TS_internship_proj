import { setSeederFactory } from 'typeorm-extension';
import { CategoryGroup } from '../../category_groups/entities/category_group.entity';

export const CategoryGroupFactory = setSeederFactory(CategoryGroup, (faker) => {
  const category_group = new CategoryGroup();

  // return one random value from array
  category_group.name = faker.word.noun();
  return category_group;
});
