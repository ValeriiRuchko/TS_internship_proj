// src/db/seeds/user.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { CategoryGroup } from 'src/category_groups/entities/category_group.entity';

export default class CategoryGroupSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // await dataSource.query('TRUNCATE "category_groups";');

    const categoryGroupsFactory = factoryManager.get(CategoryGroup);
    await categoryGroupsFactory.save();
  }
}
