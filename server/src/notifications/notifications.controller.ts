import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReqWithToken } from '../types_&_interfaces/request.interface';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @Req() req: ReqWithToken,
  ) {
    return this.notificationsService.create(
      createNotificationDto,
      req.user.sub,
    );
  }

  @Get(':med_id')
  findAllForMed(@Param('med_id') med_id: string) {
    return this.notificationsService.findAllForMed(med_id);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @Req() req: ReqWithToken,
  ) {
    console.log(id);
    return this.notificationsService.update(
      id,
      updateNotificationDto,
      req.user.sub,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
