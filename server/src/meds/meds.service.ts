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
import { Notification } from 'src/notifications/entities/notifications.entity';

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
    let notification: Notification | undefined;
    // TODO: rewrite completely to only find already created notification by id
    if (createMedDto.notification) {
      const temp = await this.notificationsService.create(
        createMedDto.notification,
        user_id,
      );
      notification = temp;
    }
    // saving med with related categories, also assigning the user and filling other options
    const med = await this.medsRepository.save({
      ...createMedDto,
      notification,
      user: { id: user_id },
    });

    // TODO: understand how to save notification so that it is related to med

    this.logger.debug('Med was created', med);

    return med;
  }

  // TODO: currently works as OR, maybe should work as AND??
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

    // TODO: almost correct one, need to make dynamic now and with many andWhere clauses for multiple categories
    const medsBuilder = await this.medsRepository
      .createQueryBuilder('meds')
      .innerJoinAndSelect('meds.categories', 'categories')
      .where('categories.name = :name', { name: 'everyday' })
      .getMany();

    console.log(medsBuilder);
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

  // TODO: write this method to utilize this.notificationsService.update()
  // maybe also change to upsert :D
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
