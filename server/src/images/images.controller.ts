import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilteredImageDto } from './dto/find-filtered.dto';
import { ReqWithToken } from 'src/types_&_interfaces/request.interface';

@Controller('images')
@UseGuards(AuthGuard('jwt'))
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
  }

  @Get()
  findAllForMed(@Body() filteredImageDto: FilteredImageDto) {
    return this.imagesService.findAllForMed(filteredImageDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  @Get('profile-img')
  findOneByUser(@Req() req: ReqWithToken) {
    return this.imagesService.findOneByUser(req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
}
