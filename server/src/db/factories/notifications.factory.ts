// @/src/db/seeding/factories/notification.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Notification } from 'src/notifications/entities/notifications.entity';

export const NotificationFactory = setSeederFactory(Notification, (faker) => {
  const notification = new Notification();
  notification.start_date = faker.date.recent({ days: 3 });
  notification.reminderDays = '1010100';
  notification.notificationMsg = faker.lorem.sentence();
  notification.intakePillsAmount = faker.number.int({ min: 1, max: 3 });
  return notification;
});
