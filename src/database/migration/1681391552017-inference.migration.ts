import { MigrationInterface, QueryRunner } from "typeorm";

export class Inference1681391552017 implements MigrationInterface {
    name = 'Inference1681391552017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference" ADD "maxTokensOverride" integer`);
        await queryRunner.query(`ALTER TABLE "inference" ADD "temperatureOverride" integer`);
        await queryRunner.query(`ALTER TABLE "inference" ADD "stopSequenceOverride" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference" DROP COLUMN "stopSequenceOverride"`);
        await queryRunner.query(`ALTER TABLE "inference" DROP COLUMN "temperatureOverride"`);
        await queryRunner.query(`ALTER TABLE "inference" DROP COLUMN "maxTokensOverride"`);
    }

}
