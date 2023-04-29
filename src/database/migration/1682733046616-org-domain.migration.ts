import { MigrationInterface, QueryRunner } from "typeorm";

export class OrgDomain1682733046616 implements MigrationInterface {
    name = 'OrgDomain1682733046616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "org" ADD "emailDomain" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "org" DROP COLUMN "emailDomain"`);
    }

}
