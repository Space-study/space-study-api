import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBlog1741586379706 implements MigrationInterface {
  name = 'CreateBlog1741586379706';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "blogs" ("blog_id" SERIAL NOT NULL, "author_id" integer NOT NULL, "category_id" integer NOT NULL, "title" character varying NOT NULL, "content" text, "thumbnail_path" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."blogs_status_enum" NOT NULL DEFAULT 'not accepted', CONSTRAINT "PK_9728ee7386486ed6752b06983e8" PRIMARY KEY ("blog_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_comments" ("comment_id" SERIAL NOT NULL, "blog_id" integer NOT NULL, "user_id" integer NOT NULL, "comment" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "blogBlogId" integer, CONSTRAINT "PK_24135b0058cd4746eff854a0a96" PRIMARY KEY ("comment_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_a948969820d32147f5cf4d3a2ab" FOREIGN KEY ("blogBlogId") REFERENCES "blogs"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_a948969820d32147f5cf4d3a2ab"`,
    );
    await queryRunner.query(`DROP TABLE "blog_comments"`);
    await queryRunner.query(`DROP TABLE "blogs"`);
  }
}
