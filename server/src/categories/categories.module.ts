import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
// import { APP_GUARD } from '@nestjs/core';
// import { PremiumGuard } from '../auth/premium.guard';
import { AuthModule } from '../auth/auth.module';
import { CategoryGroupsModule } from '../category_groups/category_groups.module';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    AuthModule,
    CategoryGroupsModule,
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    // { provide: APP_GUARD, useClass: PremiumGuard },
  ],
  exports: [TypeOrmModule, CategoriesService],
})
export class CategoriesModule { }
