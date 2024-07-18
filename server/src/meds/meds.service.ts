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

@Injectable()
export class MedsService {
  private readonly logger = new Logger(MedsService.name);

  constructor(
    @InjectRepository(Med) private medsRepository: Repository<Med>,
    private imagesService: ImagesService,
    private notificationsService: NotificationsService,
    private categoriesService: CategoriesService,
  ) {}

  async createImagesForMed(
    files: Array<Express.Multer.File>,
    med_id: string,
  ): Promise<void> {
    this.logger.warn(med_id);
    const med = await this.findOne(med_id);

    this.logger.debug('Files added to med', files);

    // creating image files and relating them to the created med
    for (let i = 0; i <= files.length - 1; i++) {
      await this.imagesService.create({
        med,
        pathToImage: files[i].path,
      });
    }

    this.logger.debug('Images for med were created', med);
  }

  // WARN: creation of med without images, so after calling this service you need to call the one above
  // with proper med_id
  async create(createMedDto: CreateMedDto, user_id: string): Promise<Med> {
    // saving med with related categories, also assigning the user and filling other options
    const med = await this.medsRepository.save({
      ...createMedDto,
      user: { id: user_id },
    });

    // TODO: add notifications appropriately
    if (createMedDto.notifications) {
      // creating new notifications and relating them to the created med
      for (let i = 0; i <= createMedDto.notifications.length - 1; i++) {
        this.logger.warn('AAAAA');
        // await this.notificationsService.create({ noti createMedDto.notifications[i], med });
      }
    }
    this.logger.debug('Med was created', med);

    return med;
  }

  // currently it works like with OR - some category or some other category
  async findAllByFilters(
    filteredMedDto: FilteredMedDto,
    user_id: string,
  ): Promise<Med[]> {
    // actual query
    const meds = await this.medsRepository.find({
      where: {
        user: {
          id: user_id,
        },
        categories: filteredMedDto.categories,
      },
      relations: {
        categories: true,
        notification: true,
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
    this.logger.debug('Med updated', med);
  }

  async remove(id: string) {
    const med = await this.findOne(id);
    await this.medsRepository.delete({ id: med.id });
    this.logger.debug('Med deleted', med);
  }
}
