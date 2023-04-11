import { Injectable } from '@nestjs/common';
import { IToolProvider } from './tool-provider.service';
import { getJson } from 'serpapi';
import { IAuthenticatedContext } from 'src/auth/auth.service';

interface SerpapiToolConfig {
  apiKey: string;
}

@Injectable()
export class SerpapiToolProvider implements IToolProvider<SerpapiToolConfig> {
  async exec(
    authContext: IAuthenticatedContext,
    config: SerpapiToolConfig,
    input: string,
  ) {
    const response = await getJson('google', {
      api_key: config.apiKey,
      q: input,
    });

    return (
      response.answer_box?.answer ||
      response.answer_box?.snippet ||
      response.answer_box?.snippet_highlighted_words ||
      response.sports_results?.game_spotlight ||
      response.knowledge_graph?.description ||
      response.organic_results?.snippet ||
      'No good search result found'
    );
  }
}
