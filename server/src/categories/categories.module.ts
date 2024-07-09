import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { APP_GUARD } from '@nestjs/core';
import { PremiumGuard } from 'src/auth/premium.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: APP_GUARD, useClass: PremiumGuard },
  ],
})
export class CategoriesModule {}
