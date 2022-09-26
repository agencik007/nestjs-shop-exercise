import { dbConfig } from '../../db.config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'mysql',
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
  username: dbConfig.DB_USERNAME,
  password: dbConfig.DB_PASSWORD,
  database: dbConfig.DB_NAME,
  entities: [
    'dist/**/**/**/*.entity{.ts,.js}',
    'dist/**/**/*.entity{.ts,.js}',
    'dist/**/*.entity{.ts,.js}',
  ],
  bigNumberStrings: false,
  logging: true,
  migrations: ['dist/migration/*.js'],
  synchronize: true,
  autoLoadEntities: true,
  extra: {
    decimalNumbers: true,
  },
  cli: {
    migrationsDir: 'migration',
  },
} as DataSourceOptions);
