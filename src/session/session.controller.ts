import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Session } from 'src/database/entity/Session.entity';
import { InferenceService } from 'src/inference/inference.service';
import { InstructionService } from 'src/instruction/instruction.service';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { IInferenceRequest, SessionService } from 'src/session/session.service';

@Controller('/session/:sessionType')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(
    @Inject(forwardRef(() => SessionService))
    private sessionService: SessionService,
    @Inject(forwardRef(() => InferenceService))
    private inferenceService: InferenceService,
    private instructionService: InstructionService,
  ) {}

  @Get('/all')
  async getAll(
    @Request() req,
    @Param('sessionType') sessionType: 'chat' | 'instruction',
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.sessionService.getSessions(authContext, sessionType);
  }

  @Get('/:id')
  async getById(@Request() req, @Param('id') sessionId: string) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.sessionService.getSessionById(authContext, sessionId, true);
  }

  @Post('/:id/transcript')
  async getTranscriptById(
    @Request() req,
    @Param('id') sessionId: string,
    @Body() inferenceRequest: IInferenceRequest,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    const session = await this.sessionService.getSessionById(
      authContext,
      sessionId,
      true,
    );

    const compiledPrompt = await this.inferenceService.getPrompt(
      authContext,
      inferenceRequest,
      session,
    );

    return { transcript: compiledPrompt };
  }

  @Post('/:id')
  async infer(
    @Request() req,
    @Param('sessionType') sessionType: 'chat' | 'instruction',
    @Param('id') sessionId: string,
    @Body() inferenceRequest: IInferenceRequest,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    let session: Session;

    console.log({ sessionId, sessionType, inferenceRequest });

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

    if (sessionType === 'instruction') {
      const inferences = this.instructionService.infer(
        authContext,
        { ...inferenceRequest, type: 'user' },
        session,
      );
      return {
        sessionId: session.id,
        inferences,
      };
    } else {
      const inference = await this.inferenceService.infer(
        authContext,
        { ...inferenceRequest, type: 'user' },
        session,
      );

      return {
        sessionId: session.id,
        inferences: [inference],
      };
    }
  }
}
