import { connectionSource } from './datasource';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forRoot(connectionSource.options), DatabaseModule],
})
export class DatabaseModule {}
