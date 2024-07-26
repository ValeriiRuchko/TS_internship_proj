import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreateNotificationDto,
  reminderDays,
} from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notifications.entity';
import { Repository } from 'typeorm';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private readonly MAX_REMINDERDAYS_LENGTH = 7;

  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private emailSenderService: EmailSenderService,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    // initial value which means notification has no day to repeat
    const emptyReminderDays = 0b0000000;

    const reminderDaysInString = this.generateWeekdaysString(
      emptyReminderDays,
      createNotificationDto.reminderDays,
    );

    const notification = await this.notificationsRepository.save({
      ...createNotificationDto,
      reminderDays: reminderDaysInString,
    });

    this.logger.debug('Notification was created', notification);

    // // NOTE: adding new cron job
    // await this.emailSenderService.addCronJobForNotification(
    //   notification.id,
    //   notification,
    // );

    return notification;
  }

  async findAllForMed(med_id: string): Promise<Notification[]> {
    const notifications = await this.notificationsRepository.find({
      where: {
        med: {
          id: med_id,
        },
      },
      relations: {
        notificationTimes: true,
      },
    });

    return notifications;
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.notificationsRepository.find({
      relations: {
        notificationTimes: true,
        med: {
          user: true,
        },
      },
      select: {
        id: true,
        notificationMsg: true,
        reminderDays: true,
        notificationTimes: {
          id: true,
          time: true,
        },
        med: {
          id: true,
          name: true,
          user: {
            id: true,
            email: true,
          },
        },
      },
    });

    return notifications;
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id: id },
      relations: {
        notificationTimes: true,
      },
    });
    if (!notification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }

    return notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<void> {
    const notification = await this.findOne(id);

    // NOTE: parsing our string which is in byte representation back, which implies that we have to use base
    // of 2
    const notificationReminderDays: number = parseInt(
      notification.reminderDays,
      2,
    );

    const reminderDaysInString = this.generateWeekdaysString(
      notificationReminderDays,
      updateNotificationDto.reminderDays!,
    );

    await this.notificationsRepository.update(notification, {
      ...updateNotificationDto,
      reminderDays: reminderDaysInString,
    });

    this.logger.debug('Notification was updated', notification);
  }

  async remove(id: string): Promise<void> {
    const notification = await this.findOne(id);
    await this.notificationsRepository.delete({ id });
    this.logger.debug('Notification was deleted', notification);
  }

  // NOTE: HELPER FUNCTION TO WORK WITH OUR DAYS REPRESENTATION
  generateWeekdaysString(
    startDays: number,
    updateValues: reminderDays,
  ): string {
    let resultDays = startDays;
    for (const [key, value] of Object.entries(updateValues)) {
      this.logger.debug('Current weekday array', key, value);
      // checking if value wasn't nullified (switch button was press odd amount of times)
      if (value) {
        // XOR operation
        resultDays = resultDays ^ value;
      }
    }

    // NOTE: converting to string of format 0000100 to store properly in DB as now it is just 'number' value
    let reminderDaysInString = resultDays.toString(2);
    this.logger.debug('Reminder days before padding', reminderDaysInString);

    // NOTE: padding resulting string to neccessary length so that everything is stored in the same format
    reminderDaysInString = reminderDaysInString.padStart(
      this.MAX_REMINDERDAYS_LENGTH,
      '0',
    );
    this.logger.debug('Reminder days generated', reminderDaysInString);

    return reminderDaysInString;
  }
}
