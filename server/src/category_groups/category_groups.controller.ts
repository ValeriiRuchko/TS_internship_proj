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
import { CategoryGroupsService } from './category_groups.service';
import { CreateCategoryGroupDto } from './dto/create-category_group.dto';
import { UpdateCategoryGroupDto } from './dto/update-category_group.dto';
import { AuthGuard } from '@nestjs/passport';
import { ReqWithToken } from '../types_&_interfaces/request.interface';

@Controller('category-groups')
@UseGuards(AuthGuard('jwt'))
export class CategoryGroupsController {
  constructor(private readonly categoryGroupsService: CategoryGroupsService) { }

  @Post()
  create(
    @Body() createCategoryGroupDto: CreateCategoryGroupDto,
    @Req() req: ReqWithToken,
  ) {
    return this.categoryGroupsService.create(
      createCategoryGroupDto,
      req.user.sub,
    );
  }

  @Get()
  findAll(@Req() req: ReqWithToken) {
    return this.categoryGroupsService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryGroupsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryGroupDto: UpdateCategoryGroupDto,
  ) {
    return this.categoryGroupsService.update(id, updateCategoryGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryGroupsService.remove(id);
  }
}
