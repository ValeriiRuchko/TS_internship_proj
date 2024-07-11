import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroupsService } from 'src/category_groups/category_groups.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private categoryGroupsService: CategoryGroupsService,
    // private userService: UsersService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<void> {
    const categoryGroup = await this.categoryGroupsService.findOne(
      createCategoryDto.categoryGroup,
    );
    const res = await this.categoriesRepository.save({
      ...createCategoryDto,
      categoryGroup,
    });
    console.log('Category was created', res);
  }

  async findAll(category_names: string[]): Promise<Category[]> {
    // TODO: rewrite to use ID's, not names
    const categoryFindOptions: FindOptionsWhere<Category>[] = [];

    category_names.forEach((elem) => {
      categoryFindOptions.push({ name: elem });
    });

    const categories = await this.categoriesRepository.find({
      where: [...categoryFindOptions],
    });

    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category ${updateCategoryDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
