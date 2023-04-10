import { Injectable } from '@nestjs/common';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import { Integration } from 'src/database/entity/Integration.entity';
import { Model } from 'src/database/entity/Model.entity';

@Injectable()
export class IIntegrationDefinition {
  createModels(
    authContext: IAuthenticatedContext,
    integration: Integration,
  ): Promise<Model[]> {
    throw new Error('Not implemented');
  }
}
