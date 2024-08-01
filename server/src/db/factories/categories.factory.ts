import { setSeederFactory } from 'typeorm-extension';
import { Category } from '../../categories/entities/category.entity';

export const CategoryFactory = setSeederFactory(Category, (faker) => {
  const category = new Category();
  category.name = faker.word.noun();
  return category;
});
