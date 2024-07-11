import { Module } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedsController } from './meds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Med } from './entities/meds.entity';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Med]), UsersModule, CategoriesModule],
  controllers: [MedsController],
  providers: [MedsService],
})
export class MedsModule {}
