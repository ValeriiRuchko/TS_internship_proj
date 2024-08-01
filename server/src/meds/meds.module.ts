import { Module } from '@nestjs/common';
import { MedsService } from './meds.service';
import { MedsController } from './meds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Med } from './entities/meds.entity';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { ImagesModule } from '../images/images.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Med]),
    MulterModule.register({
      dest: './upload',
      fileFilter(req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpeg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(
            new Error(
              'File type is not appropriate, must be image/png, image/jpg, image/jpeg ',
            ),
            false,
          );
        } else {
          cb(null, true);
        }
      },
      storage: multer.diskStorage({
        destination: './upload',
        filename: function (req, file, cb) {
          const ext = path.extname(file.originalname);
          // console.log('Extension', ext);
          const originalName = path.basename(file.originalname, ext);
          // console.log('Original name', originalName);
          const newName = Date.now() + '-' + originalName + ext;
          // console.log('New name', newName);
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
export class MedsModule { }
