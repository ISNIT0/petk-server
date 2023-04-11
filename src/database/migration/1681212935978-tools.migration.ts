import { MigrationInterface, QueryRunner } from "typeorm";

export class Tools1681212935978 implements MigrationInterface {
    name = 'Tools1681212935978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference" ADD "toolProfile" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference" DROP COLUMN "toolProfile"`);
    }

}
