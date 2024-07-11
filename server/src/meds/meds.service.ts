import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { UsersService } from 'src/users/users.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateMedDto } from './dto/create-med.dto';
import { FilteredMedDto } from './dto/find-filtered.dto';
import { UpdateMedDto } from './dto/update-med.dto';
import { Med } from './entities/meds.entity';

@Injectable()
export class MedsService {
  constructor(
    @InjectRepository(Med) private medsRepository: Repository<Med>,
    private userService: UsersService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createMedDto: CreateMedDto, user_id: string) {
    /* const user = await this.userService.findOneById(user_id) */
    // TODO: change implementation of adding new categories

    const categories = await this.categoriesService.findAll(
      createMedDto.categories,
    );
    // TODO: need to add notifications too but first have to implement corresponding service

    // saving med with related categories, also assigning the user and filling other options
    const med = await this.medsRepository.save({
      ...createMedDto,
      categories,
      user: { id: user_id },
    });
    console.log('Med was created', med);
  }

  async findAllByFilters(filteredMedDto: FilteredMedDto): Promise<Med[]> {
    // constructing criteria-object related to categories
    const categoryFindOptions: FindOptionsWhere<Category>[] = [];

    filteredMedDto.categories?.forEach((elem) => {
      categoryFindOptions.push({ name: elem });
    });

    // actual query
    const meds = await this.medsRepository.find({
      where: [
        {
          categories: [...categoryFindOptions],
        },
      ],
      relations: {
        categories: true,
        user: true,
      },
    });
    return meds;
  }

  async findOne(id: string): Promise<Med> {
    const res = await this.medsRepository.findOneBy({ id });
    if (!res) {
      throw new HttpException('Med not found', HttpStatus.NOT_FOUND);
    }
    return res;
  }

  async update(id: string, updateMedDto: UpdateMedDto) {
    const med = await this.medsRepository.findOneBy({ id });
    if (!med) {
      throw new HttpException('Med not found', HttpStatus.NOT_FOUND);
    }
    const categories = await this.categoriesService.findAll(
      updateMedDto?.categories ? updateMedDto.categories : [],
    );

    await this.medsRepository.update(
      { id },
      {
        ...updateMedDto,
        categories,
      },
    );
    console.log('Med updated');
  }

  async remove(id: string) {
    const med = await this.medsRepository.findOneBy({ id });
    if (!med) {
      throw new HttpException('Med not found', HttpStatus.NOT_FOUND);
    }
    await this.medsRepository.delete({ id });
    console.log('Med deleted');
  }
}
