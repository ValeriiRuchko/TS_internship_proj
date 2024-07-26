import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Resend } from 'resend';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { WeekDay } from 'src/notifications/enums/weekday.enum';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  private readonly MAX_REMINDERDAYS_LENGTH = 7;

  constructor(
    private configService: ConfigService,

    @Inject(forwardRef(() => NotificationsService))
    private notificationsService: NotificationsService,

    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  // NOTE: main starter of notifications on app startup
  @Cron(new Date(Date.now() + 5 * 1000), { name: 'EMAIL_SEND_CRON' })
  async setupNotificationsOnStart() {
    const notifications = await this.notificationsService.findAll();
    for (let i = 0; i <= notifications.length - 1; i++) {
      this.addCronJobForNotification(
        notifications[i].med.user.email,
        notifications[i],
      );
    }
  }

  async addCronJobForNotification(email: string, notification: Notification) {
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

    const daysCronPattern = daysCronPatternArray.join(',');

    const reminderTimes = notification.notificationTimes;

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

    for (const cronJob of finalCrons) {
      // adding job to BullMQ queue
      const job = await this.notificationsQueue.add(
        'set-up-notification',
        {
          email: email,
          notificationMsg: notification.notificationMsg,
          medName: notification.med.name,
        },
        {
          repeat: {
            pattern: cronJob,
          },
        },
      );

      this.logger.debug('Notification will execute at: ', finalCrons);

      this.logger.debug(
        `Job ${job.name} for notification with days: ${notification.reminderDays} was set up`,
      );

      this.logger.debug('Times for job: ', notification.notificationTimes);
    }
  }

  async sendNotificationEmail(message: string, email: string, medName: string) {
    const key = this.configService.get('RESEND_API_KEY');
    const resend = new Resend(key);

    // NOTE: field from has test email suitable for testing of different things, might change it to
    // my domain later
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [`${email}`],
      subject: `Reminder to take your med: ${medName}`,
      html: `<p>${message}</p>`,
    });

    if (error) {
      this.logger.error('Email sending failed, what the hell', error);
      return;
    }

    this.logger.debug('Email sent with following data: ', data);
  }
}
