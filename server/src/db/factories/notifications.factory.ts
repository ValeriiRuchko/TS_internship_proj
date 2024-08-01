
import { setSeederFactory } from 'typeorm-extension';
import { Notification } from '../../notifications/entities/notifications.entity';

export const NotificationFactory = setSeederFactory(Notification, (faker) => {
  const notification = new Notification();
  notification.start_date = faker.date.recent({ days: 3 });
  notification.reminderDays = '1111111';
  notification.notificationMsg = faker.lorem.sentence();
  notification.intakePillsAmount = faker.number.int({ min: 1, max: 3 });
  return notification;
});
