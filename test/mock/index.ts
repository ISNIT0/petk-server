import { APIKey } from 'src/database/entity/APIKey.entity';
import { Inference } from 'src/database/entity/Inference.entity';
import { InferenceRating } from 'src/database/entity/InferenceRating.entity';
import { InferenceWarning } from 'src/database/entity/InferenceWarning.entity';
import { Model } from 'src/database/entity/Model.entity';
import { Org } from 'src/database/entity/Org.entity';
import { Profile } from 'src/database/entity/Profile.entity';
import { PromptTemplate } from 'src/database/entity/PromptTemplate.entity';
import { PromptTemplateInstance } from 'src/database/entity/PromptTemplateInstance.entity';
import { Session } from 'src/database/entity/Session.entity';
import { Tool } from 'src/database/entity/Tool.entity';
import { Source } from 'src/dataSource';
import { v4 as uuid } from 'uuid';

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

  try {
    await profileRepo.delete({});
    await apiKeyRepo.delete({});
    await inferenceRepo.delete({});
    await inferenceRatingRepo.delete({});
    await inferenceWarningRepo.delete({});
    await modelRepo.delete({});
    await orgRepo.delete({});
    await promptTemplateRepo.delete({});
    await promptTemplateInstanceRepo.delete({});
    await sessionRepo.delete({});
    await toolRepo.delete({});
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
  chatPromptTemplateBasicInstance.prompt = `Assistant is a large language model trained by OpenAI.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

Human: {history}
Human: {input}
Assistant: `;
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
  chatPromptTemplatePirateInstance.prompt = `Assistant is a large language model trained by OpenAI.

Assistant is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of topics. As a language model, Assistant is able to generate human-like text based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

Assistant is constantly learning and improving, and its capabilities are constantly evolving. It is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions. Additionally, Assistant is able to generate its own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of topics.

Overall, Assistant is a powerful tool that can help with a wide range of tasks and provide valuable insights and information on a wide range of topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Assistant is here to assist.

Assistant speaks as a pirate at all times. Make ample use of the words "Arr" and "Me-harty". At no point should assistant stop speaking like a pirate.

Human: {history}
Human: {input}
Assistant: `;
  chatPromptTemplatePirateInstance.template = chatPromptTemplatePirate;
  chatPromptTemplatePirateInstance = await promptTemplateInstanceRepo.save(
    chatPromptTemplatePirateInstance,
  );

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
