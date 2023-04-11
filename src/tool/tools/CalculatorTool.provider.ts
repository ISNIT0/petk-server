/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@nestjs/common';
import { IToolProvider } from './tool-provider.service';
import { IAuthenticatedContext } from 'src/auth/auth.service';
import * as math from 'mathjs';

interface CalculatorToolConfig {}

@Injectable()
export class CalculatorToolProvider
  implements IToolProvider<CalculatorToolConfig>
{
  async exec(
    authContext: IAuthenticatedContext,
    config: CalculatorToolConfig,
    input: string,
  ) {
    const output = math.evaluate(input);

    return output;
  }
}
