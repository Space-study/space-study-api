import { MigrationInterface, QueryRunner } from 'typeorm';

export class BlogAndRoomTable1741797221384 implements MigrationInterface {
  name = 'BlogAndRoomTable1741797221384';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."blogs_status_enum" AS ENUM('accepted', 'not accepted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs" ("blog_id" SERIAL NOT NULL, "author_id" integer NOT NULL, "category_id" integer NOT NULL, "title" character varying NOT NULL, "content" text, "thumbnail_path" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."blogs_status_enum" NOT NULL DEFAULT 'not accepted', CONSTRAINT "PK_9728ee7386486ed6752b06983e8" PRIMARY KEY ("blog_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_comments" ("comment_id" SERIAL NOT NULL, "blog_id" integer NOT NULL, "user_id" integer NOT NULL, "comment" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "blogBlogId" integer, CONSTRAINT "PK_24135b0058cd4746eff854a0a96" PRIMARY KEY ("comment_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("category_id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "icon_path" character varying, CONSTRAINT "PK_51615bef2cea22812d0dcab6e18" PRIMARY KEY ("category_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rooms_privacy_enum" AS ENUM('public', 'private')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rooms_status_enum" AS ENUM('active', 'ban', 'pending')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rooms" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "privacy" "public"."rooms_privacy_enum" NOT NULL DEFAULT 'public', "max_members" integer NOT NULL, "image_url" character varying NOT NULL, "category" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."rooms_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_a948969820d32147f5cf4d3a2ab" FOREIGN KEY ("blogBlogId") REFERENCES "blogs"("blog_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_a948969820d32147f5cf4d3a2ab"`,
    );
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."rooms_privacy_enum"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "blog_comments"`);
    await queryRunner.query(`DROP TABLE "blogs"`);
    await queryRunner.query(`DROP TYPE "public"."blogs_status_enum"`);
  }
}
