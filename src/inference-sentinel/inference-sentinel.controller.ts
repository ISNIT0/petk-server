import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { InferenceSentinelService } from './inference-sentinel.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('warnings')
@ApiBearerAuth()
@Controller('inference-sentinel')
@UseGuards(JwtAuthGuard)
export class InferenceSentinelController {
  constructor(private inferenceSentinelService: InferenceSentinelService) {}

  @Get('/warning/all')
  async getAllWarnings(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.inferenceSentinelService.getAllWarnings(authContext);
  }

  @Get('/warning/:warningId')
  async getWarningById(@Request() req, @Param('warningId') warningId: string) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.inferenceSentinelService.getWarningById(authContext, warningId);
  }
}
