import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ToolService } from './tool.service';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tool')
@ApiBearerAuth()
@Controller('tool')
@UseGuards(JwtAuthGuard)
export class ToolController {
  constructor(private toolService: ToolService) {}
  @Get('/all')
  async getAll(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.toolService.getAll(authContext);
  }

  @Get('/provider/all')
  async getAllProviders(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.toolService.getAllProviders(authContext);
  }

  @Get('/provider/:providerId')
  async getProvierById(
    @Request() req,
    @Param('providerId') providerId: string,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.toolService.getProviderById(authContext, providerId);
  }

  @Post('/:providerId')
  async updateToolById(
    @Request() req,
    @Param('providerId') providerId: string,
    @Body() body: { toolType: string; config: any },
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.toolService.updateToolById(authContext, providerId, body);
  }
}
