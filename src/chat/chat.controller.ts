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
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { IInferenceRequest, SessionService } from 'src/session/session.service';

@Controller('/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {}
