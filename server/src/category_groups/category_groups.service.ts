import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryGroupDto } from './dto/create-category_group.dto';
import { UpdateCategoryGroupDto } from './dto/update-category_group.dto';
import { CategoryGroup } from './entities/category_group.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryGroupsService {
  constructor(
    @InjectRepository(CategoryGroup)
    private categoryGroupsRepository: Repository<CategoryGroup>,
  ) {}

  async create(
    createCategoryGroupDto: CreateCategoryGroupDto,
    user_id: string,
  ): Promise<void> {
    const categoryGroup = await this.categoryGroupsRepository.save({
      name: createCategoryGroupDto.name,
      user: {
        id: user_id,
      },
    });
    console.log('Category group is created', categoryGroup);
  }

  async findAll(user_id: string): Promise<CategoryGroup[]> {
    // all category_groups related to user
    const categoryGroups = await this.categoryGroupsRepository.find({
      where: {
        user: {
          id: user_id,
        },
      },
    });

    return categoryGroups;
  }

  async findOne(id: string): Promise<CategoryGroup> {
    const categoryGroup = await this.categoryGroupsRepository.findOneBy({
      id,
    });
    if (!categoryGroup) {
      throw new HttpException('Category group not found', HttpStatus.NOT_FOUND);
    }
    return categoryGroup;
  }

  async update(
    id: string,
    updateCategoryGroupDto: UpdateCategoryGroupDto,
  ): Promise<void> {
    const categoryGroup = await this.categoryGroupsRepository.findOneBy({ id });
    if (!categoryGroup) {
      throw new HttpException('Category group not found', HttpStatus.NOT_FOUND);
    }
    await this.categoryGroupsRepository.update({ id }, updateCategoryGroupDto);
    console.log('Category_group update');
  }

  async remove(id: string): Promise<void> {
    const categoryGroup = await this.categoryGroupsRepository.findOneBy({ id });
    if (!categoryGroup) {
      throw new HttpException('Category group not found', HttpStatus.NOT_FOUND);
    }
    await this.categoryGroupsRepository.delete({ id });
    console.log('Category_group deleted');
  }
}
