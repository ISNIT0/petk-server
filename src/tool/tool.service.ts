import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Tool } from 'src/database/entity/Tool.entity';
import { Repository } from 'typeorm';
import { ToolProviderService } from './tools/tool-provider.service';
import { ToolIntegration } from 'src/database/entity/ToolIntegration.entity';
import { Org } from 'src/database/entity/Org.entity';

@Injectable()
export class ToolService {
  constructor(
    @InjectRepository(Tool)
    private toolRepository: Repository<Tool>,
    @InjectRepository(ToolIntegration)
    private toolIntegrationRepository: Repository<ToolIntegration>,
    private toolProviderService: ToolProviderService,
  ) {}

  async getAll(authContext: IAuthenticatedContext) {
    return this.toolRepository.find({
      where: { org: { id: authContext.org.id } },
    });
  }

  async getAllProviders(authContext: IAuthenticatedContext) {
    return this.toolIntegrationRepository.find({});
  }

  async executeTool(
    authContext: IAuthenticatedContext,
    toolName: string,
    input: string,
  ) {
    const tool = await this.toolRepository.findOneOrFail({
      where: {
        integration: { modelName: toolName },
        org: { id: authContext.org.id },
      },
    });
    const toolProvider = this.toolProviderService.getTool(
      tool.integration.type,
    );

    if (!toolProvider) {
      return { result: `Tool ${toolName} is not valid` };
    }

    console.info(`Executing too ${toolName} with input [${input}]`);
    const result = await toolProvider.exec(authContext, tool.config, input);
    return { result, tool };
  }

  async getProviderById(
    authContext: IAuthenticatedContext,
    providerId: string,
  ) {
    return this.toolIntegrationRepository.findOneOrFail({
      where: { type: providerId as any },
    });
  }

  async updateToolById(
    authContext: IAuthenticatedContext,
    toolId: string,
    body: { toolType: string; config: any },
  ) {
    let tool: Tool;
    console.log(toolId, body);
    if (toolId === 'new') {
      const toolIntegration =
        await this.toolIntegrationRepository.findOneOrFail({
          where: { type: body.toolType as any },
        });

      console.log(toolIntegration);

      tool = new Tool();
      tool.integration = toolIntegration;
    } else {
      tool = await this.toolRepository.findOneOrFail({
        where: { id: toolId as any, org: { id: authContext.org.id } },
      });
    }

    tool.config = body.config;
    tool.org = { id: authContext.org.id } as Org;

    tool = await this.toolRepository.save(tool);
    return tool;
  }
}
