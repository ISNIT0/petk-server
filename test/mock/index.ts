import { APIKey } from 'src/database/entity/APIKey.entity';
import { Inference } from 'src/database/entity/Inference.entity';
import { InferenceRating } from 'src/database/entity/InferenceRating.entity';
import { InferenceWarning } from 'src/database/entity/InferenceWarning.entity';
import { Integration } from 'src/database/entity/Integration.entity';
import { Model } from 'src/database/entity/Model.entity';
import { Org } from 'src/database/entity/Org.entity';
import { Profile } from 'src/database/entity/Profile.entity';
import { PromptTemplate } from 'src/database/entity/PromptTemplate.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { Tool } from 'src/database/entity/Tool.entity';
import { ToolIntegration } from 'src/database/entity/ToolIntegration.entity';
import { Source } from 'src/dataSource';
import {
  chatPrompt,
  instructionPrompt,
  pirateChatPrompt,
} from 'src/fixtures/prompts';

async function run() {
  const connection = await Source.initialize();
  console.info('Deleting existing data');
  const profileRepo = connection.getRepository(Profile);
  const apiKeyRepo = connection.getRepository(APIKey);
  const inferenceRepo = connection.getRepository(Inference);
  const inferenceRatingRepo = connection.getRepository(InferenceRating);
  const inferenceWarningRepo = connection.getRepository(InferenceWarning);
  const modelRepo = connection.getRepository(Model);
  const orgRepo = connection.getRepository(Org);
  const promptTemplateRepo = connection.getRepository(PromptTemplate);
  const promptTemplateInstanceRepo = connection.getRepository(
    PromptTemplateInstance,
  );
  const sessionRepo = connection.getRepository(Session);
  const toolRepo = connection.getRepository(Tool);
  const toolIntegrationRepo = connection.getRepository(ToolIntegration);
  const integrationRepo = connection.getRepository(Integration);

  try {
    await apiKeyRepo.delete({});
    await inferenceRepo.delete({});
    await inferenceRatingRepo.delete({});
    await inferenceWarningRepo.delete({});
    await modelRepo.delete({});
    await promptTemplateInstanceRepo.delete({});
    await promptTemplateRepo.delete({});
    await sessionRepo.delete({});
    await toolRepo.delete({});
    await toolIntegrationRepo.delete({});
    await integrationRepo.delete({});
    await orgRepo.delete({});
    await profileRepo.delete({});

    console.info(`Deleted existing data`);
  } catch (err) {
    console.error(`Failed to delete existing data`);
    throw err;
  }

  console.info(`Creating mockdata...`);

  let org = new Org();
  org.id = 'f0169756-b346-4884-9c80-fe8d8e5c1e07';
  org.name = 'Joe Org';
  org = await orgRepo.save(org);

  let chatPromptTemplateBasic = new PromptTemplate();
  chatPromptTemplateBasic.name = 'Chat Basic';
  chatPromptTemplateBasic.org = org;
  chatPromptTemplateBasic.promptType = 'chat';
  chatPromptTemplateBasic.description = 'A basic chat prompt';
  chatPromptTemplateBasic = await promptTemplateRepo.save(
    chatPromptTemplateBasic,
  );

  let chatPromptTemplateBasicInstance = new PromptTemplateInstance();
  chatPromptTemplateBasicInstance.org = org;
  chatPromptTemplateBasicInstance.maxTokens = 1000;
  chatPromptTemplateBasicInstance.stopSequence = null;
  chatPromptTemplateBasicInstance.temperature = 0;
  chatPromptTemplateBasicInstance.description = 'Standard Chat Prompt';
  chatPromptTemplateBasicInstance.template = chatPromptTemplateBasic;
  chatPromptTemplateBasicInstance.prompt = chatPrompt;
  chatPromptTemplateBasicInstance = await promptTemplateInstanceRepo.save(
    chatPromptTemplateBasicInstance,
  );

  let chatPromptTemplatePirate = new PromptTemplate();
  chatPromptTemplatePirate.name = 'Chat Pirate';
  chatPromptTemplatePirate.org = org;
  chatPromptTemplatePirate.promptType = 'chat';
  chatPromptTemplatePirate.description = 'A Pirate chat prompt';
  chatPromptTemplatePirate = await promptTemplateRepo.save(
    chatPromptTemplatePirate,
  );

  let chatPromptTemplatePirateInstance = new PromptTemplateInstance();
  chatPromptTemplatePirateInstance.org = org;
  chatPromptTemplatePirateInstance.maxTokens = 1000;
  chatPromptTemplatePirateInstance.stopSequence = null;
  chatPromptTemplatePirateInstance.temperature = 0;
  chatPromptTemplatePirateInstance.description =
    'Standard Chat Prompt, but a Pirate';
  chatPromptTemplatePirateInstance.prompt = pirateChatPrompt;
  chatPromptTemplatePirateInstance.template = chatPromptTemplatePirate;
  chatPromptTemplatePirateInstance = await promptTemplateInstanceRepo.save(
    chatPromptTemplatePirateInstance,
  );

  let instructionPromptTemplate = new PromptTemplate();
  instructionPromptTemplate.name = 'Standard Tool-Using Bot';
  instructionPromptTemplate.org = org;
  instructionPromptTemplate.promptType = 'instruction';
  instructionPromptTemplate.description = 'A standard tool-using bot';
  instructionPromptTemplate = await promptTemplateRepo.save(
    instructionPromptTemplate,
  );

  let instructionPromptTemplateInstance = new PromptTemplateInstance();
  instructionPromptTemplateInstance.org = org;
  instructionPromptTemplateInstance.maxTokens = 1000;
  instructionPromptTemplateInstance.stopSequence = null;
  instructionPromptTemplateInstance.temperature = 0;
  instructionPromptTemplateInstance.description = 'Standard Tool-Using Bot';
  instructionPromptTemplateInstance.prompt = instructionPrompt;
  instructionPromptTemplateInstance.template = instructionPromptTemplate;
  instructionPromptTemplateInstance = await promptTemplateInstanceRepo.save(
    instructionPromptTemplateInstance,
  );

  let serpapiIntegration = new ToolIntegration();
  serpapiIntegration.name = 'SerpAPI';
  serpapiIntegration.iconUrl =
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F53%2FGoogle_%2522G%2522_Logo.svg%2F1024px-Google_%2522G%2522_Logo.svg.png&f=1&nofb=1&ipt=7d30cdf659f6c59ca254400865db1b3a2f08dd2b14baea92b8f2f9fa2b2fb612&ipo=images';
  serpapiIntegration.description = 'SerpAPI.com';
  serpapiIntegration.modelName = 'Search';
  serpapiIntegration.modelDescription =
    'useful for when you need to answer questions about current events. only ask for one thing at a time, no compound questions';
  serpapiIntegration.type = 'serpapi';
  serpapiIntegration.configFields = [
    { name: 'apiKey', label: 'API Key', type: 'text' },
  ];
  serpapiIntegration = await toolIntegrationRepo.save(serpapiIntegration);

  let emailIntegration = new ToolIntegration();
  emailIntegration.name = 'Email Me';
  emailIntegration.iconUrl =
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Forig00.deviantart.net%2F3780%2Ff%2F2015%2F190%2Fa%2F4%2Fmail_icon_by_cortexcerebri-d90ks8v.png&f=1&nofb=1&ipt=02a63c39efda2a27948ce9122f86cedec5da5aeda62c1cdbfa5eabd0628ab57f&ipo=images';
  emailIntegration.description = 'Emails you';
  emailIntegration.modelName = 'Email';
  emailIntegration.modelDescription =
    'useful for when you need to send an email to someone, input format is [email body]';
  emailIntegration.type = 'email';
  emailIntegration.configFields = [
    { label: 'From Email', name: 'fromEmail', type: 'email' },
  ];
  emailIntegration = await toolIntegrationRepo.save(emailIntegration);

  let calculatorIntegration = new ToolIntegration();
  calculatorIntegration.name = 'Calculator';
  calculatorIntegration.iconUrl =
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.iconfinder.com%2Fdata%2Ficons%2Fbanking-and-finance-2-4%2F128%2F89-512.png&f=1&nofb=1&ipt=1d1cb492732baf1d4fd76508a0da8b2f6d64240133095d7165761b7f2a97e814&ipo=images';
  calculatorIntegration.description =
    'Evaluates various mathematical formulas with MathJS';
  calculatorIntegration.modelName = 'Calculator';
  calculatorIntegration.modelDescription =
    'useful for performing mathematical expressions, input format is the MathJS Expression Syntax';
  calculatorIntegration.type = 'calculator';
  calculatorIntegration.configFields = [];
  calculatorIntegration = await toolIntegrationRepo.save(calculatorIntegration);

  let profile = new Profile();
  profile.id = '38877683-c588-4e6d-aa14-bb8be7441b0a';
  profile.name = 'Joe Reeve';
  profile.email = 'joseph@simmsreeve.com';
  profile.avatarUrl =
    'https://pbs.twimg.com/profile_images/1493249029198782468/yER316Vj_400x400.jpg';
  profile.orgs = [org];
  profile = await profileRepo.save(profile);

  let apiKey = new APIKey();
  apiKey.key = 'key-123';
  apiKey.profile = profile;
  apiKey.org = org;
  apiKey = await apiKeyRepo.save(apiKey);

  console.info(`Created mockdata`);
}

run().then(
  () => console.log(`Executed successfully`),
  (err) => {
    console.error(`Failed to create developer mockdata`);
    throw err;
  },
);
