import 'dotenv/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const applicationUrl = new URL(process.env.DATABASE_URL);
const useSsl = !!process.env.DATABASE_USE_SSL;

export const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: applicationUrl.hostname,
  port: Number(applicationUrl.port),
  username: applicationUrl.username,
  password: applicationUrl.password,
  database: applicationUrl.pathname.replace('/', ''),
  synchronize: false,
  logging: false,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '**', '*migration.{ts,js}')],
  subscribers: ['src/database/subscriber/**/*.ts'],
  extra: {
    ssl: useSsl
      ? {
          rejectUnauthorized: false,
        }
      : false,
  },
};

export const Source = new DataSource(dataSourceConfig);
