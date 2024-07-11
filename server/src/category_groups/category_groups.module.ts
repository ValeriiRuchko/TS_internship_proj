import { Module } from '@nestjs/common';
import { CategoryGroupsService } from './category_groups.service';
import { CategoryGroupsController } from './category_groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryGroup } from './entities/category_group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryGroup])],
  controllers: [CategoryGroupsController],
  providers: [CategoryGroupsService],
  exports: [TypeOrmModule, CategoryGroupsService],
})
export class CategoryGroupsModule {}
