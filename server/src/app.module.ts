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
import { AuthModule } from './auth/auth.module';

// that's the place where we essentially describe what providers (services) a controller can have
// helps with DI
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT')!,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/*.entity.js'],
        // need to set to FALSE synchronize in prod in order not to recreate schema every time
        synchronize: true,
        logging: false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    //------
    MedsModule,
    NotificationsModule,
    UsersModule,
    ImagesModule,
    CategoryGroupsModule,
    CategoriesModule,
    NotificationTimesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // eslint-disable-next-line prettier/prettier
  constructor(private dataSource: DataSource) {}
}
