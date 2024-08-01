import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificationJobData } from './types_&_interfaces/job-data';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Processor('notifications')
@Injectable()
export class NotificationsConsumerService extends WorkerHost {
  private readonly logger = new Logger(NotificationsConsumerService.name);

  constructor(private configService: ConfigService) {
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
}
