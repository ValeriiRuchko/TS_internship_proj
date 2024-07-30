import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationJobData } from './types_&_interfaces/job-data';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Cron } from '@nestjs/schedule';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifJobSetupService } from 'src/notif-job-setup/notif-job-setup.service';

@Processor('notifications')
@Injectable()
export class NotificationsConsumerService extends WorkerHost {
  private readonly logger = new Logger(NotificationsConsumerService.name);

  constructor(
    private configService: ConfigService,
    private notificationsService: NotificationsService,
    private notifsJobSetupService: NotifJobSetupService,
  ) {
    super();
  }

  async process(job: Job<NotificationJobData, any, string>): Promise<any> {
    this.sendNotificationEmail(
      job.data.notificationMsg,
      job.data.email,
      job.data.medName,
    );

    this.logger.debug(
      `Processing this job: ${JSON.stringify(job)} at time: ${new Date(job.timestamp).toLocaleString()}`,
    );
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

  // NOTE: main starter of notifications on app startup
  @Cron(new Date(Date.now() + 5 * 1000), { name: 'EMAIL_SEND_CRON' })
  async setupNotificationsOnStart() {
    const notifications = await this.notificationsService.findAll();
    for (let i = 0; i <= notifications.length - 1; i++) {
      const generatedCronPatterns =
        this.notifsJobSetupService.generateCronExpression(notifications[i]);
      await this.notifsJobSetupService.setupCronJobsForNotification(
        notifications[i].med.user.email,
        generatedCronPatterns,
        notifications[i],
      );
    }
  }
}
