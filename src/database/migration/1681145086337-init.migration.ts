import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1681145086337 implements MigrationInterface {
    name = 'Init1681145086337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "avatarUrl" character varying NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_3825121222d5c17741373d8ad13" UNIQUE ("email"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tool" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "modelName" character varying NOT NULL, "modelDescription" character varying NOT NULL, "webhookUrl" character varying NOT NULL, "orgId" uuid, CONSTRAINT "PK_3bf5b1016a384916073184f99b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prompt_template_instance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "prompt" character varying NOT NULL, "stopSequence" character varying, "maxTokens" integer NOT NULL DEFAULT '1000', "temperature" integer NOT NULL DEFAULT '0', "orgId" uuid, "templateId" uuid, CONSTRAINT "PK_63e20c423e8a0fd67f039d2ff24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prompt_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "promptType" character varying NOT NULL, "orgId" uuid, CONSTRAINT "PK_01a2960dbe949ac6990b0882f90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "org" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "defaultChatModelId" uuid, "defaultChatTemplateId" uuid, "defaultInstructionModelId" uuid, "defaultInstructionTemplateId" uuid, CONSTRAINT "REL_5a506bae71ce332fa24bd5c78f" UNIQUE ("defaultChatModelId"), CONSTRAINT "REL_a42f4a460e7d31633fe03527e6" UNIQUE ("defaultChatTemplateId"), CONSTRAINT "REL_495c4415cf2394d49857f8657a" UNIQUE ("defaultInstructionModelId"), CONSTRAINT "REL_6b3901a9ebb97a3f02800518a2" UNIQUE ("defaultInstructionTemplateId"), CONSTRAINT "PK_703783130f152a752cadf7aa751" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "integration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "provider" character varying NOT NULL, "config" text NOT NULL, "safetyConfig" text NOT NULL, "orgId" uuid, CONSTRAINT "PK_f348d4694945d9dc4c7049a178a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" character varying NOT NULL, "description" character varying, "provider" character varying NOT NULL, "config" text NOT NULL DEFAULT '{}', "safetyConfig" text NOT NULL DEFAULT '{}', "orgId" uuid, "integrationId" uuid, CONSTRAINT "PK_d6df271bba301d5cc79462912a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying, "description" character varying, "type" character varying NOT NULL, "source" character varying NOT NULL, "orgId" uuid, "profileId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "prompt" character varying NOT NULL, "response" character varying NOT NULL, "type" character varying NOT NULL, "modelId" uuid, "promptTemplateInstanceId" uuid, "previousInferenceId" uuid, "sessionId" uuid, "profileId" uuid, CONSTRAINT "PK_816b92bfeef33d378bc6f00fa20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inference_rating" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "rating" integer NOT NULL, "inferenceId" uuid, "profileId" uuid, CONSTRAINT "PK_4bdc8227266ee80f8755c818088" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api_key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "profileId" uuid, "orgId" uuid, CONSTRAINT "PK_b1bd840641b8acbaad89c3d8d11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inference_warning" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "detail" character varying NOT NULL, "inferenceId" uuid, CONSTRAINT "PK_de494ecfbd4a99e230e896dc44a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "prompt_template_instance_tools_tool" ("promptTemplateInstanceId" uuid NOT NULL, "toolId" uuid NOT NULL, CONSTRAINT "PK_3dc8869de340eb450dc0ab7b063" PRIMARY KEY ("promptTemplateInstanceId", "toolId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1b80785e76e4e81e2c023abbd9" ON "prompt_template_instance_tools_tool" ("promptTemplateInstanceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cabc7fb975eb7e4f9b6def684f" ON "prompt_template_instance_tools_tool" ("toolId") `);
        await queryRunner.query(`CREATE TABLE "org_org_users_profile" ("orgId" uuid NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "PK_e430482fa488866b2b1d7c5786a" PRIMARY KEY ("orgId", "profileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e506365fa76bc2d939e2ba209d" ON "org_org_users_profile" ("orgId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a9addfdcd08f26710343888bba" ON "org_org_users_profile" ("profileId") `);
        await queryRunner.query(`ALTER TABLE "tool" ADD CONSTRAINT "FK_a12eab6d46e04b982cd53461667" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prompt_template_instance" ADD CONSTRAINT "FK_e8e2e8c6833f17f0d71123c06c3" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prompt_template_instance" ADD CONSTRAINT "FK_0e1d160415e12cd8103ba2bc4ba" FOREIGN KEY ("templateId") REFERENCES "prompt_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prompt_template" ADD CONSTRAINT "FK_09142cd9e5685367994fa2874ee" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "org" ADD CONSTRAINT "FK_5a506bae71ce332fa24bd5c78fc" FOREIGN KEY ("defaultChatModelId") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "org" ADD CONSTRAINT "FK_a42f4a460e7d31633fe03527e63" FOREIGN KEY ("defaultChatTemplateId") REFERENCES "prompt_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "org" ADD CONSTRAINT "FK_495c4415cf2394d49857f8657ab" FOREIGN KEY ("defaultInstructionModelId") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "org" ADD CONSTRAINT "FK_6b3901a9ebb97a3f02800518a2c" FOREIGN KEY ("defaultInstructionTemplateId") REFERENCES "prompt_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "integration" ADD CONSTRAINT "FK_77994a36053a75b6a6563578902" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "model" ADD CONSTRAINT "FK_1db87fc12e8985d26e2bb35a6e7" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "model" ADD CONSTRAINT "FK_42135506b311a29a50df3ac0efd" FOREIGN KEY ("integrationId") REFERENCES "integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_ca4a617948222d38d22f8c82c0f" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_1d93e7137d3924bd95fc94d3b07" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference" ADD CONSTRAINT "FK_d2c3580172aa03f0a5abbe08081" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference" ADD CONSTRAINT "FK_ebcabdd6e4d96ffbecb34acfa52" FOREIGN KEY ("promptTemplateInstanceId") REFERENCES "prompt_template_instance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference" ADD CONSTRAINT "FK_1dd531dbed574488f5965bebfcf" FOREIGN KEY ("previousInferenceId") REFERENCES "inference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference" ADD CONSTRAINT "FK_9ac108bcbc28450a4ece5e7ced0" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference" ADD CONSTRAINT "FK_2bce2f40a83e356b517800b287f" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference_rating" ADD CONSTRAINT "FK_43cd9455c372403a977523f61b8" FOREIGN KEY ("inferenceId") REFERENCES "inference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference_rating" ADD CONSTRAINT "FK_f623b3a378bb4c862dc84a9105e" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_key" ADD CONSTRAINT "FK_9d479b9b2ebbdec2c94b4d5bd09" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_key" ADD CONSTRAINT "FK_2fd573c41327b77139cbc08a517" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD CONSTRAINT "FK_f9367014852fd7071778fae4e4f" FOREIGN KEY ("inferenceId") REFERENCES "inference"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "prompt_template_instance_tools_tool" ADD CONSTRAINT "FK_1b80785e76e4e81e2c023abbd9d" FOREIGN KEY ("promptTemplateInstanceId") REFERENCES "prompt_template_instance"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "prompt_template_instance_tools_tool" ADD CONSTRAINT "FK_cabc7fb975eb7e4f9b6def684f1" FOREIGN KEY ("toolId") REFERENCES "tool"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "org_org_users_profile" ADD CONSTRAINT "FK_e506365fa76bc2d939e2ba209de" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "org_org_users_profile" ADD CONSTRAINT "FK_a9addfdcd08f26710343888bba0" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "org_org_users_profile" DROP CONSTRAINT "FK_a9addfdcd08f26710343888bba0"`);
        await queryRunner.query(`ALTER TABLE "org_org_users_profile" DROP CONSTRAINT "FK_e506365fa76bc2d939e2ba209de"`);
        await queryRunner.query(`ALTER TABLE "prompt_template_instance_tools_tool" DROP CONSTRAINT "FK_cabc7fb975eb7e4f9b6def684f1"`);
        await queryRunner.query(`ALTER TABLE "prompt_template_instance_tools_tool" DROP CONSTRAINT "FK_1b80785e76e4e81e2c023abbd9d"`);
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP CONSTRAINT "FK_f9367014852fd7071778fae4e4f"`);
        await queryRunner.query(`ALTER TABLE "api_key" DROP CONSTRAINT "FK_2fd573c41327b77139cbc08a517"`);
        await queryRunner.query(`ALTER TABLE "api_key" DROP CONSTRAINT "FK_9d479b9b2ebbdec2c94b4d5bd09"`);
        await queryRunner.query(`ALTER TABLE "inference_rating" DROP CONSTRAINT "FK_f623b3a378bb4c862dc84a9105e"`);
        await queryRunner.query(`ALTER TABLE "inference_rating" DROP CONSTRAINT "FK_43cd9455c372403a977523f61b8"`);
        await queryRunner.query(`ALTER TABLE "inference" DROP CONSTRAINT "FK_2bce2f40a83e356b517800b287f"`);
        await queryRunner.query(`ALTER TABLE "inference" DROP CONSTRAINT "FK_9ac108bcbc28450a4ece5e7ced0"`);
        await queryRunner.query(`ALTER TABLE "inference" DROP CONSTRAINT "FK_1dd531dbed574488f5965bebfcf"`);
        await queryRunner.query(`ALTER TABLE "inference" DROP CONSTRAINT "FK_ebcabdd6e4d96ffbecb34acfa52"`);
        await queryRunner.query(`ALTER TABLE "inference" DROP CONSTRAINT "FK_d2c3580172aa03f0a5abbe08081"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_1d93e7137d3924bd95fc94d3b07"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_ca4a617948222d38d22f8c82c0f"`);
        await queryRunner.query(`ALTER TABLE "model" DROP CONSTRAINT "FK_42135506b311a29a50df3ac0efd"`);
        await queryRunner.query(`ALTER TABLE "model" DROP CONSTRAINT "FK_1db87fc12e8985d26e2bb35a6e7"`);
        await queryRunner.query(`ALTER TABLE "integration" DROP CONSTRAINT "FK_77994a36053a75b6a6563578902"`);
        await queryRunner.query(`ALTER TABLE "org" DROP CONSTRAINT "FK_6b3901a9ebb97a3f02800518a2c"`);
        await queryRunner.query(`ALTER TABLE "org" DROP CONSTRAINT "FK_495c4415cf2394d49857f8657ab"`);
        await queryRunner.query(`ALTER TABLE "org" DROP CONSTRAINT "FK_a42f4a460e7d31633fe03527e63"`);
        await queryRunner.query(`ALTER TABLE "org" DROP CONSTRAINT "FK_5a506bae71ce332fa24bd5c78fc"`);
        await queryRunner.query(`ALTER TABLE "prompt_template" DROP CONSTRAINT "FK_09142cd9e5685367994fa2874ee"`);
        await queryRunner.query(`ALTER TABLE "prompt_template_instance" DROP CONSTRAINT "FK_0e1d160415e12cd8103ba2bc4ba"`);
        await queryRunner.query(`ALTER TABLE "prompt_template_instance" DROP CONSTRAINT "FK_e8e2e8c6833f17f0d71123c06c3"`);
        await queryRunner.query(`ALTER TABLE "tool" DROP CONSTRAINT "FK_a12eab6d46e04b982cd53461667"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a9addfdcd08f26710343888bba"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e506365fa76bc2d939e2ba209d"`);
        await queryRunner.query(`DROP TABLE "org_org_users_profile"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cabc7fb975eb7e4f9b6def684f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1b80785e76e4e81e2c023abbd9"`);
        await queryRunner.query(`DROP TABLE "prompt_template_instance_tools_tool"`);
        await queryRunner.query(`DROP TABLE "inference_warning"`);
        await queryRunner.query(`DROP TABLE "api_key"`);
        await queryRunner.query(`DROP TABLE "inference_rating"`);
        await queryRunner.query(`DROP TABLE "inference"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "model"`);
        await queryRunner.query(`DROP TABLE "integration"`);
        await queryRunner.query(`DROP TABLE "org"`);
        await queryRunner.query(`DROP TABLE "prompt_template"`);
        await queryRunner.query(`DROP TABLE "prompt_template_instance"`);
        await queryRunner.query(`DROP TABLE "tool"`);
        await queryRunner.query(`DROP TABLE "profile"`);
    }

}
