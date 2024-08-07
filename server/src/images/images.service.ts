import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { FilteredImageDto } from './dto/find-filtered.dto';
import { unlink } from 'fs/promises';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(
    @InjectRepository(Image) private imagesRepository: Repository<Image>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<void> {
    const image = await this.imagesRepository.save(createImageDto);
    this.logger.debug('Image was created', image);
  }

  async findAllForMed(filteredImageDto: FilteredImageDto): Promise<Image[]> {
    const images = await this.imagesRepository.find({
      where: {
        med: filteredImageDto.med,
      },
    });
    return images;
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.imagesRepository.findOneBy({ id });
    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    return image;
  }

  async findOneByUser(user_id: string): Promise<Image> {
    const image = await this.imagesRepository.findOne({
      where: {
        user: {
          id: user_id,
        },
      },
    });
    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
    return image;
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);
    this.logger.debug('Current dir', process.cwd());
    const pathToFile = process.cwd() + `/${image.pathToImage}`;
    try {
      await unlink(pathToFile);
      console.log('Successfully deleted:', pathToFile);
    } catch (error) {
      console.error('There was an error:', error.message);
    }
    await this.imagesRepository.delete({ id: image.id });
    this.logger.debug('Image was deleted', image);
  }
}
