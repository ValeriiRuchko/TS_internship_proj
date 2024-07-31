import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '../notifications/entities/notifications.entity';
import { WeekDay } from '../notifications/enums/weekday.enum';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CronPattern, CronPatternPart } from './types/cronPattern';

@Injectable()
export class NotifJobSetupService {
  private readonly logger = new Logger(NotifJobSetupService.name);

  private readonly MAX_REMINDERDAYS_LENGTH = 7;

  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

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

      // this.logger.debug(
      //   `Job ${job.name} for notification with days: ${notification.reminderDays} was set up`,
      // );
    }
  }

  async deleteCronJobsForNotification(notification: Notification) {
    for (const notificationTime of notification.notificationTimes) {
      // NOTE: from first testing seems to work but if bugs occur might look here to add pattern too
      const jobDeleted = await this.notificationsQueue.removeRepeatable(
        notification.id,
        {
          key: notificationTime.id,
        },
      );
      this.logger.debug(
        `Job for notification ${notification.id} with time ${notificationTime} was deleted: ${jobDeleted}`,
      );
    }
  }
}
