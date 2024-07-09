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
import { MedsService } from './meds.service';
import { CreateMedDto } from './dto/create-med.dto';
import { UpdateMedDto } from './dto/update-med.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('meds')
@UseGuards(AuthGuard('jwt'))
export class MedsController {
  constructor(private readonly medsService: MedsService) {}

  @Post()
  create(@Body() createMedDto: CreateMedDto) {
    return this.medsService.create(createMedDto);
  }

  @Get()
  findAll() {
    return this.medsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedDto: UpdateMedDto) {
    return this.medsService.update(+id, updateMedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medsService.remove(+id);
  }
}
