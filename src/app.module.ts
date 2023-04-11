import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

import { DatabaseModule } from './database/database.module';
import { dataSourceConfig } from './dataSource';
import { ProfileModule } from './profile/profile.module';
import { RedisModule } from './redis/redis.module';
import { ChatModule } from './chat/chat.module';
import { ModelModule } from './model/model.module';
import { InstructionModule } from './instruction/instruction.module';
import { SessionModule } from './session/session.module';
import { InferenceModule } from './inference/inference.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { OrgModule } from './org/org.module';
import { PromptTemplateModule } from './prompt-template/prompt-template.module';
import { ModelProviderModule } from './model-provider/model-provider.module';
import { IntegrationModule } from './integration/integration.module';
import { ToolModule } from './tool/tool.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forRoot(dataSourceConfig),
    AuthModule,
    ProfileModule,
    // RedisModule,
    ChatModule,
    ModelModule,
    InstructionModule,
    SessionModule,
    InferenceModule,
    ApiKeyModule,
    OrgModule,
    PromptTemplateModule,
    ModelProviderModule,
    IntegrationModule,
    ToolModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
