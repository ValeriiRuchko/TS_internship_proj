import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationTimesService } from './notification_times.service';
import { CreateNotificationTimeDto } from './dto/create-notification_time.dto';
import { UpdateNotificationTimeDto } from './dto/update-notification_time.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('notification-times')
@UseGuards(AuthGuard('jwt'))
export class NotificationTimesController {
  constructor(
    private readonly notificationTimesService: NotificationTimesService,
  ) {}

  @Post()
  create(@Body() createNotificationTimeDto: CreateNotificationTimeDto) {
    return this.notificationTimesService.create(createNotificationTimeDto);
  }

  @Get()
  findAll() {
    return this.notificationTimesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationTimesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationTimeDto: UpdateNotificationTimeDto,
  ) {
    return this.notificationTimesService.update(id, updateNotificationTimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationTimesService.remove(id);
  }
}
