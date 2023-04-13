import { MigrationInterface, QueryRunner } from "typeorm";

export class InferenceWarning1681392524137 implements MigrationInterface {
    name = 'InferenceWarning1681392524137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD "source" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP COLUMN "source"`);
    }

}
