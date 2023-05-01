import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Model } from 'src/database/entity/Model.entity';
import { Org } from 'src/database/entity/Org.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private modelRepository: Repository<Model>,
    @InjectRepository(Org)
    private orgRepository: Repository<Org>,
  ) {}

  async getDefault(authContext: IAuthenticatedContext) {
    const { defaultChatModel, defaultInstructionModel } =
      await this.orgRepository.findOneOrFail({
        where: { id: authContext.org.id },
        relations: { defaultChatModel: true, defaultInstructionModel: true },
      });

    return { defaultChatModel, defaultInstructionModel };
  }

  async getAll(authContext: IAuthenticatedContext) {
    const defaultModels = await this.getDefault(authContext);
    const models = await this.modelRepository.find({
      where: {
        org: { id: authContext.org.id },
      },
    });

    return models.map((model) => {
      const isDefault =
        model.id === defaultModels.defaultChatModel?.id ||
        model.id === defaultModels.defaultInstructionModel?.id;

      model.isDefault = isDefault;
      return model;
    });
  }

  async getById(authContext: IAuthenticatedContext, modelId: string) {
    const defaultModels = await this.getDefault(authContext);
    const model = await this.modelRepository.findOneOrFail({
      where: {
        org: { id: authContext.org.id },
        id: modelId,
      },
      select: this.modelRepository.metadata.columns.map(
        (c) => c.propertyName,
      ) as any[],
    });

    const isDefault =
      model.id === defaultModels.defaultChatModel?.id ||
      model.id === defaultModels.defaultInstructionModel?.id;

    model.isDefault = isDefault;

    return model;
  }
}
