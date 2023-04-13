import { MigrationInterface, QueryRunner } from "typeorm";

export class Inference1681391245098 implements MigrationInterface {
    name = 'Inference1681391245098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference" ADD "promptMergeData" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference" DROP COLUMN "promptMergeData"`);
    }

}
