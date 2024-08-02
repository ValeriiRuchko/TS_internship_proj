import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './entities/notifications.entity';
import { Med } from 'src/meds/entities/meds.entity';
import { NotificationTime } from 'src/notification_times/entities/notification_time.entity';
import { NotifJobSetupService } from 'src/notif-job-setup/notif-job-setup.service';
import { UsersService } from 'src/users/users.service';
import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { User } from 'src/users/entities/users.entity';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const user = new User();
  user.email = 'test@gmail.com';
  user.id = '11';

  const notification = new Notification();
  notification.id = '1';
  notification.start_date = new Date('2023-01-01');
  notification.intakePillsAmount = 2;
  notification.notificationMsg = 'Take your medication';
  notification.reminderDays = '0100100';

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
      providers: [
        NotificationsService,
        {
          provide: getRepositoryToken(Notification),
          useValue: {
            find: jest.fn().mockResolvedValue(notification),
            findOneBy: jest.fn().mockResolvedValue(notification),
            findOne: jest.fn().mockResolvedValue(notification),
            create: jest.fn().mockResolvedValue(notification),
            save: jest.fn().mockResolvedValue(notification),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
        NotifJobSetupService,
        {
          provide: UsersService,
          useValue: {
            findOneById: jest.fn().mockResolvedValue(user),
          },
        },
      ],
      imports: [
        BullModule.registerQueue({
          name: 'notifications',
        }),
      ],
    })
      .overrideProvider(getQueueToken('notifications'))
      .useValue({
        add: jest.fn(),
        removeRepeatable: jest.fn().mockResolvedValue(true),
      })
      .compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateWeekdaysString', () => {
    it('must return string in format of zeroes and ones', async () => {
      const serviceSpy = jest.spyOn(service, 'generateWeekdaysString');
      const emptyDays = 0b0000000;
      const notEmptyDays = 0b1001001;

      const generatedString = service.generateWeekdaysString(emptyDays, {
        Mondays: 1,
        Tuesdays: null,
        Wednesday: null,
        Thursday: 8,
        Friday: null,
        Saturday: null,
        Sunday: null,
      });

      const generatedString2 = service.generateWeekdaysString(notEmptyDays, {
        Mondays: 1,
        Tuesdays: null,
        Wednesday: null,
        Thursday: 8,
        Friday: null,
        Saturday: null,
        Sunday: null,
      });

      expect(serviceSpy).toHaveReturnedTimes(2);
      expect(serviceSpy).toHaveBeenCalledTimes(2);
      expect(generatedString).toEqual('0001001');
      expect(generatedString2).toEqual('1000000');
    });
  });

  describe('create notification', () => {
    it('should be called 1 time', async () => {
      const serviceSpy = jest.spyOn(service, 'create');
      const notif = await service.create(
        {
          ...notification,
          reminderDays: {
            Mondays: null,
            Tuesdays: null,
            Wednesday: 4,
            Thursday: null,
            Friday: null,
            Saturday: 32,
            Sunday: null,
          },
        },
        '11',
      );

      expect(serviceSpy).toHaveBeenCalledTimes(1);
      expect(notif).toEqual({ ...notification, reminderDays: '0100100' });
    });
  });
});
