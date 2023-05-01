import {
  Body,
  Controller,
  Delete,
  Get,
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
import { InferenceRatingService } from 'src/inference-rating/inference-rating.service';

export class InferenceRatingDTO {
  @ApiProperty({
    description:
      'A numeric rating to be used in fine-tuning in future. Recommended values are [-1, 0, 1]',
  })
  rating: number;
  @ApiPropertyOptional({
    description:
      'Context about the rating. Recommended types of information: end-user, reason',
  })
  context?: Record<string, any>;
}

export class RawInferenceDTO {
  @ApiProperty() modelId: string;
  @ApiProperty() prompt: string;
  @ApiProperty() maxTokens: number;
  @ApiProperty() temperature: number;
  @ApiProperty() stopSequence?: string;
  @ApiPropertyOptional() templateId?: string;
  @ApiPropertyOptional() templateMergeData?: Record<string, any>;
}

@Controller('/inference')
@ApiTags('inference')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InferenceController {
  constructor(
    private inferenceService: InferenceService,
    private inferenceRatingService: InferenceRatingService,
    private sessionService: SessionService,
  ) {}

  @Post('/:sessionType/:sessionId/infer')
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
        'api',
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

  @Post('/:inferenceId/ratings')
  @ApiBody({ type: InferenceRatingDTO })
  async rateInference(
    @Request() req,
    @Param('inferenceId') inferenceId: string,
    @Body() body: InferenceRatingDTO,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.inferenceRatingService.rateInference(
      authContext,
      inferenceId,
      body,
    );
  }

  @Delete('/:inferenceId/ratings/:ratingId')
  async deleteRating(
    @Request() req,
    @Param('inferenceId') inferenceId: string,
    @Param('ratingId') ratingId: string,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.inferenceRatingService.deleteRating(
      authContext,
      inferenceId,
      ratingId,
    );
  }

  @Get('/:inferenceId/ratings')
  async getRatingsForInference(
    @Request() req,
    @Param('inferenceId') inferenceId: string,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.inferenceRatingService.getRatingsForInference(
      authContext,
      inferenceId,
    );
  }
}
