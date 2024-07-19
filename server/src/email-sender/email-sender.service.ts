import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Resend } from 'resend';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { WeekDay } from 'src/notifications/enums/weekday.enum';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  private readonly MAX_REMINDERDAYS_LENGTH = 7;

  constructor(
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  // NOTE: can declare cron job which executes once at the start of the app, iterates over existing
  // notifications and adds all notifications execution to scheduleRegistry
  // --
  // and then only add new cron jobs to registry on notifications creation
  async addCronJobForNotification(name: string, notification: Notification) {
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
      // NOTE: at is like charAt, except it allows as to take items starting from the and of string too

      if (notification.reminderDays.at(-i) === '1') {
        daysForCron.push(WeekdaysTuple[i - 1]);
      }
    }

    const daysCronPatternArray: string[] = [];

    for (const weekday of daysForCron) {
      switch (weekday) {
        case WeekDay.Monday:
          daysCronPatternArray.push('mon');
          break;
        case WeekDay.Tuesday:
          daysCronPatternArray.push('tue');
          break;
        case WeekDay.Wednesday:
          daysCronPatternArray.push('wed');
          break;
        case WeekDay.Thursday:
          daysCronPatternArray.push('thu');
          break;
        case WeekDay.Friday:
          daysCronPatternArray.push('fri');
          break;
        case WeekDay.Saturday:
          daysCronPatternArray.push('sat');
          break;
        case WeekDay.Sunday:
          daysCronPatternArray.push('sun');
          break;
        default:
          this.logger.debug('No pattern found');
          break;
      }
    }

    const daysCronPattern = daysCronPatternArray.join(',');

    this.logger.debug('Cron pattern for days:', daysCronPattern);

    const reminderTimes = notification.notificationTimes;

    this.logger.debug('Reminder times got from the parameter', reminderTimes);

    const reminderTimesCronPatternHoursArray: string[] = [];
    const reminderTimesCronPatternMinutesArray: string[] = [];

    for (const reminderTime of reminderTimes) {
      const timeParts = reminderTime.time.split(':') as [
        string,
        string,
        string,
      ];

      reminderTimesCronPatternHoursArray.push(
        parseInt(timeParts[0]).toString(),
      );
      reminderTimesCronPatternMinutesArray.push(
        parseInt(timeParts[1]).toString(),
      );
    }

    const finalCrons: string[] = [];

    for (let i = 0; i <= reminderTimesCronPatternHoursArray.length - 1; i++) {
      const cronString = `0 ${reminderTimesCronPatternMinutesArray[i]} ${reminderTimesCronPatternHoursArray[i]} * * ${daysCronPattern}`;
      finalCrons.push(cronString);
    }

    this.logger.debug(
      'reminderTimesCronPatternMinutes: ',
      reminderTimesCronPatternMinutesArray,
    );
    this.logger.debug(
      'reminderTimesCronPatternHours: ',
      reminderTimesCronPatternHoursArray,
    );

    this.logger.debug('Cron will execute at: ', finalCrons);

    for (const cronJob of finalCrons) {
      const job = new CronJob(cronJob, () => {
        this.logger.debug(`Job has fired set-up`);
        this.sendNotificationEmail(notification.notificationMsg);
      });

      // WARN: just random identification for test, change to notificationTimes.id later
      const timeOfStart = Date.now();

      this.schedulerRegistry.addCronJob(`${timeOfStart}-${name}`, job);
      job.start();

      this.logger.warn('Job features: ', job.nextDates(2));

      this.logger.debug(
        `Job ${name} added for days ${notification.reminderDays} & times ${JSON.stringify(notification.notificationTimes)}`,
      );
    }
  }

  // @Cron(CronExpression.EVERY_5_MINUTES, { name: 'EMAIL_SEND_CRON' })
  async sendNotificationEmail(message: string) {
    const key = this.configService.get('RESEND_API_KEY');
    const resend = new Resend(key);

    // NOTE: field from has test email suitable for testing of different things, might change it to
    // my domain later
    //
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['maxcaulfield710@gmail.com'],
      subject: 'I am trying to change it',
      html: `<strong>${message}</strong>`,
    });

    if (error) {
      this.logger.error('Email sending failed, what the hell', error);
    }

    this.logger.debug('Email sent with following data: ', data);
  }
}
