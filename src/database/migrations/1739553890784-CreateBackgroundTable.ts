import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBackgroundTable1739553890784 implements MigrationInterface {
    name = 'CreateBackgroundTable1739553890784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "background" ("background_id" SERIAL NOT NULL, "user_create_id" integer NOT NULL, "category_id" integer NOT NULL, "thumbnail_path" character varying, "title" character varying NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c9c43a33fbc2130475df8e30a1" PRIMARY KEY ("background_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "background"`);
    }

}
