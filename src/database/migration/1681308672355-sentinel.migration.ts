import { MigrationInterface, QueryRunner } from "typeorm";

export class Sentinel1681308672355 implements MigrationInterface {
    name = 'Sentinel1681308672355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sentinel_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "description" character varying NOT NULL, "promptPiiConfig" text, "responsePiiConfig" text, CONSTRAINT "PK_209a970a66a1ac158761146ac68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "model" ADD "sentinelSettingId" uuid`);
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD "warningOn" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD "actionTaken" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD "badString" character varying`);
        await queryRunner.query(`ALTER TABLE "model" ADD CONSTRAINT "FK_ad2150b56643e2536cd549f733a" FOREIGN KEY ("sentinelSettingId") REFERENCES "sentinel_setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "model" DROP CONSTRAINT "FK_ad2150b56643e2536cd549f733a"`);
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP COLUMN "badString"`);
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP COLUMN "actionTaken"`);
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP COLUMN "warningOn"`);
        await queryRunner.query(`ALTER TABLE "model" DROP COLUMN "sentinelSettingId"`);
        await queryRunner.query(`DROP TABLE "sentinel_setting"`);
    }

}
