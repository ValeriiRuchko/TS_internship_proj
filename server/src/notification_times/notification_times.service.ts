import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateNotificationTimeDto } from './dto/create-notification_time.dto';
import { UpdateNotificationTimeDto } from './dto/update-notification_time.dto';
import { NotificationTime } from './entities/notification_time.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationTimesService {
  private readonly logger = new Logger(NotificationTimesService.name);

  constructor(
    @InjectRepository(NotificationTime)
    private notificationTimesRepository: Repository<NotificationTime>,
  ) {}

  async create(
    createNotificationTimeDto: CreateNotificationTimeDto,
  ): Promise<void> {
    const notificationTime = await this.notificationTimesRepository.save(
      createNotificationTimeDto,
    );
    this.logger.debug(
      'Notification times was created for notification',
      notificationTime,
    );
  }

  async findAll(notification_id: string): Promise<NotificationTime[]> {
    const notification_times = await this.notificationTimesRepository.find({
      where: {
        notification: {
          id: notification_id,
        },
      },
    });

    return notification_times;
  }

  async findOne(id: string): Promise<NotificationTime> {
    const notificationTime = await this.notificationTimesRepository.findOneBy({
      id,
    });
    if (!notificationTime) {
      throw new HttpException(
        'Notification time not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return notificationTime;
  }

  async update(
    id: string,
    updateNotificationTimeDto: UpdateNotificationTimeDto,
  ): Promise<void> {
    const notificationTime = await this.findOne(id);
    await this.notificationTimesRepository.update(
      { id: notificationTime.id },
      updateNotificationTimeDto,
    );
    this.logger.debug('Notification time was updated', notificationTime);
  }

  async remove(id: string): Promise<void> {
    const notificationTime = await this.findOne(id);
    await this.notificationTimesRepository.delete({ id: notificationTime.id });
    this.logger.debug('Notification time deleted', notificationTime);
  }
}
