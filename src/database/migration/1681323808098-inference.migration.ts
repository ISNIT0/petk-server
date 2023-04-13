import { MigrationInterface, QueryRunner } from "typeorm";

export class Inference1681323808098 implements MigrationInterface {
    name = 'Inference1681323808098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inference_tools_tool" ("inferenceId" uuid NOT NULL, "toolId" uuid NOT NULL, CONSTRAINT "PK_b2712689b6b8bcd94b1b7eb672b" PRIMARY KEY ("inferenceId", "toolId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4a7c28de65b9649d5c503e6f63" ON "inference_tools_tool" ("inferenceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3610622e12a9ea9b03d44a7b5f" ON "inference_tools_tool" ("toolId") `);
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD "orgId" uuid`);
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD "modelId" uuid`);
        await queryRunner.query(`ALTER TABLE "inference" ALTER COLUMN "response" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD CONSTRAINT "FK_10f22fce6abb58bd85714da94f0" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference_warning" ADD CONSTRAINT "FK_cfe5d5e07bbeccc817770269559" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inference_tools_tool" ADD CONSTRAINT "FK_4a7c28de65b9649d5c503e6f631" FOREIGN KEY ("inferenceId") REFERENCES "inference"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inference_tools_tool" ADD CONSTRAINT "FK_3610622e12a9ea9b03d44a7b5f0" FOREIGN KEY ("toolId") REFERENCES "tool"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inference_tools_tool" DROP CONSTRAINT "FK_3610622e12a9ea9b03d44a7b5f0"`);
        await queryRunner.query(`ALTER TABLE "inference_tools_tool" DROP CONSTRAINT "FK_4a7c28de65b9649d5c503e6f631"`);
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP CONSTRAINT "FK_cfe5d5e07bbeccc817770269559"`);
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP CONSTRAINT "FK_10f22fce6abb58bd85714da94f0"`);
        await queryRunner.query(`ALTER TABLE "inference" ALTER COLUMN "response" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP COLUMN "modelId"`);
        await queryRunner.query(`ALTER TABLE "inference_warning" DROP COLUMN "orgId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3610622e12a9ea9b03d44a7b5f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a7c28de65b9649d5c503e6f63"`);
        await queryRunner.query(`DROP TABLE "inference_tools_tool"`);
    }

}
