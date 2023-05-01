import { MigrationInterface, QueryRunner } from "typeorm";

export class RlhfContext1682891421327 implements MigrationInterface {
    name = 'RlhfContext1682891421327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference_rating" RENAME COLUMN "ratingContext" TO "context"`);
        await queryRunner.query(`ALTER TABLE "inference_rating" ALTER COLUMN "context" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference_rating" ALTER COLUMN "context" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inference_rating" RENAME COLUMN "context" TO "ratingContext"`);
    }

}
