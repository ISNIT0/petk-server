import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from 'src/dataSource';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceConfig)],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
