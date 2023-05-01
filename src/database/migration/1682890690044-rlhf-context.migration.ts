import { MigrationInterface, QueryRunner } from "typeorm";

export class RlhfContext1682890690044 implements MigrationInterface {
    name = 'RlhfContext1682890690044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference_rating" ADD "ratingContext" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference_rating" DROP COLUMN "ratingContext"`);
    }

}
