import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroupsService } from '../category_groups/category_groups.service';
import { CategoryGroup } from '../category_groups/entities/category_group.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private categoryGroupsService: CategoryGroupsService,
    // private userService: UsersService,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    const categoryGroup = await this.categoryGroupsService.findOne(
      createCategoryDto.categoryGroup.id,
    );
    const res = await this.categoriesRepository.save({
      ...createCategoryDto,
      categoryGroup,
    });
    this.logger.debug('Category was created', res);
  }

  async findAll(
    categoryGroup: CategoryGroup,
    user_id: string,
  ): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({
      where: {
        categoryGroup: {
          id: categoryGroup.id,
          user: {
            id: user_id,
          },
        },
      },
    });

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({
      id,
    });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.update(
      { id: category.id },
      updateCategoryDto,
    );
    this.logger.debug('Category was updated', category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.delete({ id: category.id });
    this.logger.debug('Category was deleted', category);
  }
}
