import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { InferenceRatingService } from './inference-rating.service';

@Controller('/inference-rating')
@ApiTags('inference')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class InferenceRatingController {
  constructor(private inferenceRatingService: InferenceRatingService) {}
  @Get('/')
  getAllRatings(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.inferenceRatingService.getAll(authContext);
  }
}
