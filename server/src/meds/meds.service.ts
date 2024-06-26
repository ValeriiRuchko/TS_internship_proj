import { Injectable } from '@nestjs/common';
import { CreateMedDto } from './dto/create-med.dto';
import { UpdateMedDto } from './dto/update-med.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Med } from './entities/meds.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedsService {
  constructor(@InjectRepository(Med) private medsRepository: Repository<Med>) {}

  create(createMedDto: CreateMedDto) {
    return 'This action adds a new med';
  }

  findAll() {
    return `This action returns all meds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} med`;
  }

  update(id: number, updateMedDto: UpdateMedDto) {
    return `This action updates a #${id} med`;
  }

  remove(id: number) {
    return `This action removes a #${id} med`;
  }
}
