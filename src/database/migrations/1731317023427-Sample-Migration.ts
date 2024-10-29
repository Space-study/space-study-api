import { MigrationInterface, QueryRunner } from "typeorm";

export class SampleMigration1731317023427 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sample" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_6a0d5651705f6862c3e1ca7e67d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sample"`);
    }

}
