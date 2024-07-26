import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { NotificationJobData } from './types_&_interfaces/job-data';

@Processor('notifications')
@Injectable()
export class NotificationsConsumerService extends WorkerHost {
  constructor(private emailSenderService: EmailSenderService) {
    super();
  }

  async process(job: Job<NotificationJobData, any, string>): Promise<any> {
    this.emailSenderService.sendNotificationEmail(
      job.data.notificationMsg,
      job.data.email,
      job.data.medName,
    );

    console.log(
      `Processing this job: ${JSON.stringify(job)} at time: ${new Date(job.timestamp).toLocaleString()}`,
    );
  }
}
