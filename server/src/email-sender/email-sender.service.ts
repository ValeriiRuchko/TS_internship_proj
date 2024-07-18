import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { Resend } from 'resend';

@Injectable()
export class EmailSenderService {
  private readonly logger = new Logger(EmailSenderService.name);

  constructor(private configService: ConfigService) {}

  // @Cron(CronExpression.EVERY_MINUTE, { name: 'EMAIL_SEND_CRON' })
  async sendNotificationEmail() {
    const key = this.configService.get('RESEND_API_KEY');
    const resend = new Resend(key);

    // NOTE: field from has test email suitable for testing of different things, might change it to
    // my domain later
    //
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['maxcaulfield710@gmail.com'],
      subject: 'I am trying to change it',
      html: '<strong>It works!</strong>',
    });

    if (error) {
      this.logger.error('Email sending failed, what the hell', error);
    }

    this.logger.debug('Email sent with following data: ', data);
  }
}
