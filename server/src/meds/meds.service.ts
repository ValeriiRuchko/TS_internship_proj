import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateMedDto } from './dto/create-med.dto';
import { FilteredMedDto } from './dto/find-filtered.dto';
import { UpdateMedDto } from './dto/update-med.dto';
import { Med } from './entities/meds.entity';
import { ImagesService } from 'src/images/images.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class MedsService {
  private readonly logger = new Logger(MedsService.name);

  constructor(
    @InjectRepository(Med) private medsRepository: Repository<Med>,
    private imagesService: ImagesService,
    private notificationsService: NotificationsService,
    private categoriesService: CategoriesService,
  ) {}

  async create(
    createMedDto: CreateMedDto,
    user_id: string,
    files: Array<Express.Multer.File>,
  ) {
    this.logger.debug('CreateMedDto: ', JSON.stringify(createMedDto));

    // saving med with related categories, also assigning the user and filling other options
    const med = await this.medsRepository.save({
      ...createMedDto,
      user: { id: user_id },
    });

    // TODO: add notifications appropriately
    // TODO: add categories appropriately
    if (createMedDto.notifications) {
      // creating new notifications and relationg them to the created med
      createMedDto.notifications.forEach(async (elem) => {
        this.logger.warn('AAAAA');
        await this.notificationsService.create({ ...elem, med });
      });
    }

    // creating image files and relating them to the created med
    files.forEach(async (elem) => {
      await this.imagesService.create({ med, pathToImage: elem.path });
    });
    this.logger.debug('Med was created', JSON.stringify(med));
  }

  async findAllByFilters(filteredMedDto: FilteredMedDto): Promise<Med[]> {
    // actual query
    const meds = await this.medsRepository.find({
      where: [
        {
          categories: filteredMedDto.categories,
        },
      ],
      relations: {
        categories: true,
        images: true,
      },
    });
    return meds;
  }

  async findOne(id: string): Promise<Med> {
    const res = await this.medsRepository.findOne({
      where: { id },
      relations: {
        categories: true,
        images: true,
      },
    });
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

    await this.medsRepository.update(
      { id },
      {
        ...updateMedDto,
      },
    );
    this.logger.debug('Med updated', JSON.stringify(med));
  }

  async remove(id: string) {
    const med = await this.medsRepository.findOneBy({ id });
    if (!med) {
      throw new HttpException('Med not found', HttpStatus.NOT_FOUND);
    }
    await this.medsRepository.delete({ id });
    this.logger.debug('Med deleted', JSON.stringify(med));
  }
}
