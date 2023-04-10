import { Module } from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integration } from 'src/database/entity/Integration.entity';
import { Model } from 'src/database/entity/Model.entity';
import { OpenAIDefinition } from './integrationDefinitions/OpenAIDefinition';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [TypeOrmModule.forFeature([Integration, Model]), ApiKeyModule],
  providers: [IntegrationService, OpenAIDefinition],
  controllers: [IntegrationController],
})
export class IntegrationModule {}
