import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlog1741183781796 implements MigrationInterface {
  name = 'CreateBlog1741183781796';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blogs" ("blog_id" SERIAL NOT NULL, "author_id" integer NOT NULL, "category_id" integer NOT NULL, "title" character varying NOT NULL, "content" text, "thumbnail_path" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" character varying NOT NULL, CONSTRAINT "PK_9728ee7386486ed6752b06983e8" PRIMARY KEY ("blog_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "blogs"`);
  }
}
