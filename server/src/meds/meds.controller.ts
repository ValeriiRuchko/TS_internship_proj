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
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  UseFilters,
} from '@nestjs/common';
import { MedsService } from './meds.service';
import { CreateMedDto } from './dto/create-med.dto';
import { UpdateMedDto } from './dto/update-med.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilteredMedDto } from './dto/find-filtered.dto';
import { ReqWithToken } from '../types_&_interfaces/request.interface';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileRejectedErrorFilter } from './helpers/meds.filter';

@Controller('meds')
@UseGuards(AuthGuard('jwt'))
export class MedsController {
  constructor(private readonly medsService: MedsService) { }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('files'))
  @UseFilters(FileRejectedErrorFilter)
  createImagesForMed(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
        fileIsRequired: false,
      }),
    )
    files: Array<Express.Multer.File>,
    @Param('id')
    id: string,
  ) {
    return this.medsService.createImagesForMed(files, id);
  }

  @Post()
  create(@Body() createMedDto: CreateMedDto, @Req() req: ReqWithToken) {
    return this.medsService.create(createMedDto, req.user.sub);
  }

  @Get()
  findAllByFilters(
    @Body() filteredMedDto: FilteredMedDto,
    @Req() req: ReqWithToken,
  ) {
    return this.medsService.findAllByFilters(filteredMedDto, req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedDto: UpdateMedDto) {
    return this.medsService.update(id, updateMedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medsService.remove(id);
  }
}
