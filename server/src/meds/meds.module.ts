import { Module } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedsController } from './meds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Med } from './entities/meds.entity';
import { UsersModule } from 'src/users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { ImagesModule } from 'src/images/images.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Med]),
    MulterModule.register({
      dest: './upload',
      storage: multer.diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
          const ext = path.extname(file.originalname);
          console.log('Extension', ext);
          const originalName = path.basename(file.originalname, ext);
          console.log('Original name', originalName);
          const newName = Date.now() + '-' + originalName + ext;
          console.log('New name', newName);
          cb(null, newName);
        },
      }),
    }),
    UsersModule,
    ImagesModule,
    NotificationsModule,
    CategoriesModule,
  ],
  controllers: [MedsController],
  providers: [MedsService],
})
export class MedsModule {}
