import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { ApiKeyService } from './api-key.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';

@ApiTags('api-key')
@ApiBearerAuth()
@Controller('api-key')
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) {}

  @Post('/new')
  async newApiKey(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.apiKeyService.create(authContext);
  }

  @Get('/all')
  async getAll(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.apiKeyService.getAllObfuscated(authContext);
  }

  @Delete('/:id')
  async deleteById(@Request() req, @Param('id') id: string) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.apiKeyService.deleteById(authContext, id);
  }
}
