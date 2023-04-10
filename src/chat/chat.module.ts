import { forwardRef, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { InferenceModule } from 'src/inference/inference.module';
import { SessionModule } from 'src/session/session.module';
import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [SessionModule, forwardRef(() => InferenceModule), ApiKeyModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
