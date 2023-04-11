import { MigrationInterface, QueryRunner } from "typeorm";

export class Toolintegration1681215294785 implements MigrationInterface {
    name = 'Toolintegration1681215294785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tool_integration" ADD "configFields" text NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tool_integration" DROP COLUMN "configFields"`);
    }

}
