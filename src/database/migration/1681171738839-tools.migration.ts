import { MigrationInterface, QueryRunner } from "typeorm";

export class Tools1681171738839 implements MigrationInterface {
    name = 'Tools1681171738839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tool_integration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "iconUrl" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "modelName" character varying NOT NULL, "modelDescription" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_22ace73ca68e4d5fc80a3bdedac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tool" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "tool" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "tool" DROP COLUMN "modelName"`);
        await queryRunner.query(`ALTER TABLE "tool" DROP COLUMN "modelDescription"`);
        await queryRunner.query(`ALTER TABLE "tool" DROP COLUMN "webhookUrl"`);
        await queryRunner.query(`ALTER TABLE "tool" ADD "config" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tool" ADD "integrationId" uuid`);
        await queryRunner.query(`ALTER TABLE "tool" ADD CONSTRAINT "FK_9e9773615358957b8a04ca373be" FOREIGN KEY ("integrationId") REFERENCES "tool_integration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tool" DROP CONSTRAINT "FK_9e9773615358957b8a04ca373be"`);
        await queryRunner.query(`ALTER TABLE "tool" DROP COLUMN "integrationId"`);
        await queryRunner.query(`ALTER TABLE "tool" DROP COLUMN "config"`);
        await queryRunner.query(`ALTER TABLE "tool" ADD "webhookUrl" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tool" ADD "modelDescription" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tool" ADD "modelName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tool" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tool" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "tool_integration"`);
    }

}
