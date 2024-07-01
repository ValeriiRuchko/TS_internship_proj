import { Module } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedsController } from './meds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Med } from './entities/meds.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Med])],
  controllers: [MedsController],
  providers: [MedsService],
})
export class MedsModule {}
