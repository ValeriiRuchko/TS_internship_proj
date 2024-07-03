// @/src/seed.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { dataSourceOpts } from './data-source';

const dataSource = new DataSource(dataSourceOpts);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
