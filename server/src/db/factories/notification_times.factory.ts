// @/src/db/seeding/factories/notification.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { NotificationTime } from 'src/notification_times/entities/notification_time.entity';

export const NotificationTimeFactory = setSeederFactory(
  NotificationTime,
  (faker) => {
    const notification_time = new NotificationTime();
    const randHour = Math.floor(Math.random() * 23 + 1);
    const randMinutes = Math.floor(Math.random() * 59);
    const customTime = faker.date.recent();
    customTime.setHours(randHour);
    customTime.setMinutes(randMinutes);
    customTime.setSeconds(0);

    const timeInString = customTime.toLocaleTimeString();
    notification_time.time = timeInString;
    return notification_time;
  },
);
