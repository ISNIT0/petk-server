import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Org } from 'src/database/entity/Org.entity';
import { OrgService } from './org.service';
import { PromptTemplate } from 'src/database/entity/PromptTemplate.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Org, PromptTemplate, PromptTemplateInstance]),
  ],
  providers: [OrgService],
  exports: [OrgService],
})
export class OrgModule {}
