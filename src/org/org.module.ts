import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Org } from 'src/database/entity/Org.entity';
import { OrgService } from './org.service';

@Module({
  imports: [TypeOrmModule.forFeature([Org])],
  providers: [OrgService],
  exports: [OrgService],
})
export class OrgModule {}
