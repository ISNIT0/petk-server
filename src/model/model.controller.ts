import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ModelService } from './model.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('model')
@ApiBearerAuth()
@Controller('model')
@UseGuards(JwtAuthGuard)
export class ModelController {
  constructor(private modelService: ModelService) {}
  @Get('/all')
  async getModels(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.modelService.getAll(authContext);
  }
}
