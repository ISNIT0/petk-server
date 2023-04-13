import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { InferenceService } from './inference.service';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { SessionService } from 'src/session/session.service';
import { Session } from 'src/database/entity/Session.entity';

export class RawInferenceDTO {
  @ApiProperty() modelId: string;
  @ApiProperty() prompt: string;
  @ApiProperty() maxTokens: number;
  @ApiProperty() temperature: number;
  @ApiProperty() stopSequence?: string;
  @ApiPropertyOptional() templateId?: string;
  @ApiPropertyOptional() templateMergeData?: Record<string, any>;
}

@Controller('inference/:sessionType/:sessionId')
@ApiTags('inference')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InferenceController {
  constructor(
    private inferenceService: InferenceService,
    private sessionService: SessionService,
  ) {}

  @Post('/infer')
  @ApiParam({ name: 'sessionType', enum: ['chat', 'instruction'] })
  @ApiParam({ name: 'id', description: 'Can be "new" or a valid sessionId' })
  @ApiBody({ type: RawInferenceDTO })
  async infer(
    @Request() req,
    @Param('sessionType') sessionType: 'chat' | 'instruction',
    @Param('sessionId') sessionId: string,
    @Body() rawInference: RawInferenceDTO,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    let session: Session;

    if (sessionId === 'new') {
      session = await this.sessionService.createSession(
        authContext,
        sessionType,
        'playground',
      );
    } else {
      session = await this.sessionService.getSessionById(
        authContext,
        sessionId,
        true,
      );
    }

    return this.inferenceService.rawInfer(
      req.authContext,
      rawInference,
      session,
    );
  }
}
