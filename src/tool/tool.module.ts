import { Module } from '@nestjs/common';
import { ToolController } from './tool.controller';
import { ToolService } from './tool.service';
import { ApiKeyModule } from 'src/api-key/api-key.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from 'src/database/entity/Tool.entity';
import { ToolProviderService } from './tools/tool-provider.service';
import { CalculatorToolProvider } from './tools/CalculatorTool.provider';
import { EmailToolProvider } from './tools/EmailTool.provider';
import { SerpapiToolProvider } from './tools/SerpapiTool.provider';
import { WebhookToolProvider } from './tools/WebhookTool.provider';
import { ToolIntegration } from 'src/database/entity/ToolIntegration.entity';

@Module({
  imports: [ApiKeyModule, TypeOrmModule.forFeature([Tool, ToolIntegration])],
  controllers: [ToolController],
  providers: [
    ToolService,
    ToolProviderService,
    WebhookToolProvider,
    SerpapiToolProvider,
    EmailToolProvider,
    CalculatorToolProvider,
  ],
  exports: [ToolService],
})
export class ToolModule {}
