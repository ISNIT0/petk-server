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
import { ITestInferenceRequest } from 'src/session/session.service';
import { PromptTemplateService } from './prompt-template.service';

@Controller('prompt-template')
@UseGuards(JwtAuthGuard)
export class PromptTemplateController {
  constructor(private promptTemplateService: PromptTemplateService) {}
  @Get('/all')
  async getAll(@Request() req) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.promptTemplateService.getAll(authContext);
  }

  @Post('/test')
  async testTemplate(
    @Request() req,
    @Body() inferenceRequest: ITestInferenceRequest,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.promptTemplateService.testInfer(authContext, inferenceRequest);
  }

  @Get('/:templateId')
  async getById(@Request() req, @Param('templateId') templateId: string) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.promptTemplateService.getTemplateById(authContext, templateId);
  }

  @Post('/:templateId')
  async updateById(
    @Request() req,
    @Param('templateId') templateId: string,
    @Body() update: any,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;

    if (templateId === 'new') {
      return this.promptTemplateService.createTemplate(authContext, update);
    } else {
      return this.promptTemplateService.updateTemplateById(
        authContext,
        templateId,
        update,
      );
    }
  }

  @Get('/:templateId/:variantId')
  async getVariantById(
    @Request() req,
    @Param('templateId') templateId: string,
    @Param('variantId') variantId: string,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    const variant = await this.promptTemplateService.getVariantById(
      authContext,
      templateId,
      variantId,
    );

    return variant;
  }

  @Post('/:templateId/:variantId')
  async updateVariantById(
    @Request() req,
    @Param('templateId') templateId: string,
    @Param('variantId') variantId: string,
    @Body() update: any,
  ) {
    const authContext: IAuthenticatedContext = req.authContext;
    return this.promptTemplateService.updateVariantById(
      authContext,
      templateId,
      variantId,
      update,
    );
  }
}
