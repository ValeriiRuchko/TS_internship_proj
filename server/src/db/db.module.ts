import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOpts } from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOpts)],
})
export class DbModule {}
