import { Test, TestingModule } from '@nestjs/testing';
import { NotifJobSetupService } from './notif-job-setup.service';
import { Notification } from '../notifications/entities/notifications.entity';
import { NotificationTime } from '../notification_times/entities/notification_time.entity';
import { CronPattern } from './types/cronPattern';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from 'src/notifications/notifications.service';

describe('NotifJobSetupService', () => {
  let service: NotifJobSetupService;
  let notification: Notification;
  let notificationTime1: NotificationTime;
  let notificationTime2: NotificationTime;

  // const mockNotificationsService = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifJobSetupService,
        {
          provide: NotificationsService,
          useValue: {},
        },
      ],
      imports: [NotificationsModule],
    }).compile();

    service = module.get<NotifJobSetupService>(NotifJobSetupService);

    notification = new Notification();
    notification.id = '1';
    notification.start_date = new Date('2023-01-01');
    notification.reminderDays = '1010110'; // Example bit string for days
    notification.intakePillsAmount = 2;
    notification.notificationMsg = 'Take your medication';

    notificationTime1 = new NotificationTime();
    notificationTime1.id = '2';
    notificationTime1.time = '12:43:00';

    notificationTime2 = new NotificationTime();
    notificationTime1.id = '3';
    notificationTime2.time = '23:05:00';

    notification.notificationTimes.push(notificationTime1);

    notification.notificationTimes.push(notificationTime2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('must return array of cron patterns according to times and days', () => {
    const expectedResult: CronPattern[] = [
      { notificationTimeId: '2', cronPattern: '0 43 12 * * 2,3,5,7' },
      { notificationTimeId: '3', cronPattern: '0 5 23 * * 2,3,5,7' },
    ];
    expect(service.generateCronExpression(notification)).toEqual(
      expectedResult,
    );
  });
});
