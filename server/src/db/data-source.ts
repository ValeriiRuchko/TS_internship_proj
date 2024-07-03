// src/db/data-source.ts
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';

config();

export const dataSourceOpts: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity.js'],
  // need to set to FALSE synchronize in prod in order not to recreate schema every time
  synchronize: true,
  logging: false,
  factories: ['dist/db/factories/**/*.js'],
  seeds: ['dist/db/seeds/**/*.js'],
};
