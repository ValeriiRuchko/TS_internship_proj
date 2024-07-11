// src/db/seeds/user.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { CategoryGroup } from 'src/category_groups/entities/category_group.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Med } from 'src/meds/entities/meds.entity';
import { User } from 'src/users/entities/users.entity';
import { Image } from 'src/images/entities/image.entity';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { NotificationTime } from 'src/notification_times/entities/notification_time.entity';
// ---
import { faker } from '@faker-js/faker';

// await dataSource.query('TRUNCATE "category_groups";');

const category_groups_mock = ['body-parts', 'target'];
const categories_mock = [
  'head',
  'limbs',
  'tummy',
  'vitamins',
  'everyday',
  'painkillers',
];

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // 0 - Getting repositories to save data with:
    const categoryGroupsRepository = dataSource.getRepository(CategoryGroup);
    const categoriesRepository = dataSource.getRepository(Category);
    const notificationTimesRepository =
      dataSource.getRepository(NotificationTime);
    const medsRepository = dataSource.getRepository(Med);
    const imagesRepository = dataSource.getRepository(Image);

    // 1 - Getting all factories to work with:
    const categoryGroupsFactory = factoryManager.get(CategoryGroup);
    const categoriesFactory = factoryManager.get(Category);
    const medsFactory = factoryManager.get(Med);
    const usersFactory = factoryManager.get(User);
    const imagesFactory = factoryManager.get(Image);
    const notificationsFactory = factoryManager.get(Notification);
    const notificationTimesFactory = factoryManager.get(NotificationTime);
    ///
    const user = await usersFactory.save();

    // 2 - Generating our most distant in scheme-graph entities + their relations:
    //
    // CATEGORIES + CATEGORY_GROUPS
    const categoryGroups = await Promise.all(
      category_groups_mock.map(async (elem) => {
        const made = await categoryGroupsFactory.make({
          name: elem,
          user: user,
        });
        return made;
      }),
    );
    await categoryGroupsRepository.save(categoryGroups);

    const categories = await Promise.all(
      categories_mock.map(async (elem) => {
        const made = await categoriesFactory.make({
          name: elem,
          categoryGroup: faker.helpers.arrayElement(categoryGroups),
        });
        return made;
      }),
    );
    await categoriesRepository.save(categories);

    // NOTIFICATIONS + NOTIFICATION TIMES
    const notifications = await notificationsFactory.saveMany(24);
    const notificationTimes = await Promise.all(
      Array(72)
        .fill('')
        .map(async () => {
          const made = await notificationTimesFactory.make({
            notification: faker.helpers.arrayElement(notifications),
          });
          return made;
        }),
    );
    await notificationTimesRepository.save(notificationTimes);

    //MEDS
    const meds = await Promise.all(
      notifications.map(async (elem) => {
        const made = await medsFactory.make({
          user: user,
          notification: elem,
          categories: faker.helpers.arrayElements(categories, {
            min: 1,
            max: 3,
          }),
        });
        return made;
      }),
    );
    await medsRepository.save(meds);

    // IMAGES
    const images = await Promise.all(
      Array(24)
        .fill('')
        .map(async () => {
          const made = await imagesFactory.make({
            med: faker.helpers.arrayElement(meds),
          });
          return made;
        }),
    );
    await imagesRepository.save(images);

    // saving one dummy image which acts as a profile image
    const dummyProfileImage = await imagesFactory.make({ user: user });
    await imagesRepository.save(dummyProfileImage);
  }
}
