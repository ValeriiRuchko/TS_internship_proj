import { Test, TestingModule } from '@nestjs/testing';
import { NotifJobSetupService } from './notif-job-setup.service';
import { Notification } from '../notifications/entities/notifications.entity';
import { NotificationTime } from '../notification_times/entities/notification_time.entity';
import { CronPattern } from './types/cronPattern';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Med } from 'src/meds/entities/meds.entity';

describe('NotifJobSetupService', () => {
  let service: NotifJobSetupService;
  let queue1: Queue;

  const notification = new Notification();
  notification.id = '1';
  notification.start_date = new Date('2023-01-01');
  notification.reminderDays = '1010110'; // Example bit string for days
  notification.intakePillsAmount = 2;
  notification.notificationMsg = 'Take your medication';

  const med = new Med();
  med.name = 'Random med';

  notification.med = med;

  const notificationTime1 = new NotificationTime();
  notificationTime1.id = '2';
  notificationTime1.time = '12:43:00';

  const notificationTime2 = new NotificationTime();
  notificationTime2.id = '3';
  notificationTime2.time = '23:05:00';

  notification.notificationTimes = [notificationTime1, notificationTime2];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifJobSetupService],
      imports: [
        BullModule.registerQueue({
          name: 'notifications',
        }),
      ],
    })
      .overrideProvider(getQueueToken('notifications'))
      .useValue({
        add: jest.fn(),
      })
      .compile();

    service = module.get<NotifJobSetupService>(NotifJobSetupService);
    queue1 = module.get(getQueueToken('notifications'));
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

  it('must be called with specified params', async () => {
    const mockF = jest.spyOn(service, 'setupCronJobsForNotification');
    const patterns = service.generateCronExpression(notification);
    const email = 'hello@gmail.com';
    const res = await service.setupCronJobsForNotification(
      email,
      patterns,
      notification,
    );
    expect(mockF).toHaveBeenCalledWith(
      'hello@gmail.com',
      [
        { notificationTimeId: '2', cronPattern: '0 43 12 * * 2,3,5,7' },
        { notificationTimeId: '3', cronPattern: '0 5 23 * * 2,3,5,7' },
      ],
      notification,
    );
  });
});
