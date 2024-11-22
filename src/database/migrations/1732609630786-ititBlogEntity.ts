import { MigrationInterface, QueryRunner } from "typeorm";

export class ItitBlogEntity1732609630786 implements MigrationInterface {
    name = 'ItitBlogEntity1732609630786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" character varying NOT NULL, "author" character varying NOT NULL, CONSTRAINT "PK_a47f5df4eee558a88031ed72821" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "blog_entity"`);
    }

}
