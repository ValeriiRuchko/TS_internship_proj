import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedsModule } from './meds/meds.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from './notifications/notifications.module';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { CategoryGroupsModule } from './category_groups/category_groups.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationTimesModule } from './notification_times/notification_times.module';
// import { DbModule } from './db/db.module';

// that's the place where we essentially describe what providers (services) a controller can have
// helps with DI
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: new ConfigService().get<string>('DB_HOST'),
      port: +new ConfigService().get<string>('DB_PORT')!,
      username: new ConfigService().get<string>('DB_USERNAME'),
      password: new ConfigService().get<string>('DB_PASSWORD'),
      database: new ConfigService().get<string>('DB_NAME'),
      entities: ['dist/**/*.entity.js'],
      // need to set to FALSE synchronize in prod in order not to recreate schema every time
      synchronize: true,
      logging: false,
      autoLoadEntities: true,
    }),
    //------
    MedsModule,
    NotificationsModule,
    UsersModule,
    ImagesModule,
    CategoryGroupsModule,
    CategoriesModule,
    NotificationTimesModule,
    // DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // eslint-disable-next-line prettier/prettier
  constructor(private dataSource: DataSource) {}
}
