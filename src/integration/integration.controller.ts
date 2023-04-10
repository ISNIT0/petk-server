import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { IntegrationService } from './integration.service';

@Controller('integration')
@UseGuards(JwtAuthGuard)
export class IntegrationController {
  constructor(private integrationService: IntegrationService) {}

  @Get('/all')
  async getAll(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.integrationService.getAll(authContext);
  }

  @Post('/:provider')
  async update(
    @Request() req,
    @Param('provider') provider: string,
    @Body() update: any,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.integrationService.updateByProvider(
      authContext,
      provider,
      update,
    );
  }

  @Post('/:provider/refresh')
  async refreshByProvider(@Request() req, @Param('provider') provider: string) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.integrationService.refreshByProvider(authContext, provider);
  }
}
