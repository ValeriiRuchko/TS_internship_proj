import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { WeekDay } from 'src/notifications/enums/weekday.enum';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CronPattern, CronPatternPart } from './types/cronPattern';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  private readonly MAX_REMINDERDAYS_LENGTH = 7;

  constructor(
    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,

    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  // NOTE: main starter of notifications on app startup
  @Cron(new Date(Date.now() + 5 * 1000), { name: 'EMAIL_SEND_CRON' })
  async setupNotificationsOnStart() {
    const notifications = await this.notificationsService.findAll();
    for (let i = 0; i <= notifications.length - 1; i++) {
      const generatedCronPatterns = this.generateCronExpression(
        notifications[i],
      );
      this.setupCronJobsForNotification(
        notifications[i].med.user.email,
        generatedCronPatterns,
        notifications[i],
      );
    }
  }

  generateCronExpression(notification: Notification): CronPattern[] {
    // tuple with defined position of elements of enum Weekday
    const WeekdaysTuple = [
      WeekDay.Monday,
      WeekDay.Tuesday,
      WeekDay.Wednesday,
      WeekDay.Thursday,
      WeekDay.Friday,
      WeekDay.Saturday,
      WeekDay.Sunday,
    ] as const;

    const daysForCron: WeekDay[] = [];

    for (let i = 1; i <= this.MAX_REMINDERDAYS_LENGTH; i++) {
      if (notification.reminderDays.at(-i) === '1') {
        daysForCron.push(WeekdaysTuple[i - 1]);
      }
    }

    const daysCronPatternArray: string[] = [];

    for (const weekday of daysForCron) {
      switch (weekday) {
        case WeekDay.Monday:
          daysCronPatternArray.push('1');
          break;
        case WeekDay.Tuesday:
          daysCronPatternArray.push('2');
          break;
        case WeekDay.Wednesday:
          daysCronPatternArray.push('3');
          break;
        case WeekDay.Thursday:
          daysCronPatternArray.push('4');
          break;
        case WeekDay.Friday:
          daysCronPatternArray.push('5');
          break;
        case WeekDay.Saturday:
          daysCronPatternArray.push('6');
          break;
        case WeekDay.Sunday:
          daysCronPatternArray.push('7');
          break;
        default:
          this.logger.debug('No pattern found');
          break;
      }
    }

    // day part of cron pattern
    const daysCronPattern = daysCronPatternArray.join(',');

    // getting time where notification should fire up
    const cronPatternParts: CronPatternPart[] = [];

    for (const reminderTime of notification.notificationTimes) {
      const timeParts = reminderTime.time.split(':') as [
        string,
        string,
        string,
      ];

      cronPatternParts.push({
        cronPatternHours: parseInt(timeParts[0]).toString(),
        cronPatternMinutes: parseInt(timeParts[1]).toString(),
        notificationTimeId: reminderTime.id,
      });
    }

    const cronsForJob: CronPattern[] = [];

    for (let i = 0; i <= cronPatternParts.length - 1; i++) {
      const cronString = `0 ${cronPatternParts[i].cronPatternMinutes} ${cronPatternParts[i].cronPatternHours} * * ${daysCronPattern}`;
      cronsForJob.push({
        cronPattern: cronString,
        notificationTimeId: cronPatternParts[i].notificationTimeId,
      });
    }

    // this.logger.debug('Notification times: ', notification.notificationTimes);
    // this.logger.debug('Notification days-pattern: ', notification.reminderDays);
    // this.logger.warn('Ready crons:', cronsForJob);

    return cronsForJob;
  }

  async setupCronJobsForNotification(
    email: string,
    cronPatterns: CronPattern[],
    notification: Notification,
  ) {
    for (const cronJob of cronPatterns) {
      // adding job to BullMQ queue
      const job = await this.notificationsQueue.add(
        `${notification.id}`,
        {
          email: email,
          notificationMsg: notification.notificationMsg,
          medName: notification.med.name,
        },
        {
          repeat: {
            pattern: cronJob.cronPattern,
            key: cronJob.notificationTimeId,
          },
          removeOnComplete: true,
        },
      );
      this.logger.warn(
        'All times for current notification: ',
        notification.notificationTimes,
      );

      this.logger.debug('Notification will execute at: ', cronJob);

      this.logger.debug(
        `Job ${job.name} for notification with days: ${notification.reminderDays} was set up`,
      );
    }
  }
}