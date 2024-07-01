import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationTimeDto } from './create-notification_time.dto';

export class UpdateNotificationTimeDto extends PartialType(CreateNotificationTimeDto) {}
