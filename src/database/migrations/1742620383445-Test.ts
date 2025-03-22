import { MigrationInterface, QueryRunner } from 'typeorm';

export class Test1742620383445 implements MigrationInterface {
  name = 'Test1742620383445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."package_status_enum" AS ENUM('1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "package" ("package_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "duration" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."package_status_enum" NOT NULL DEFAULT '1', CONSTRAINT "PK_1ff0914c1f178aea0726df298bf" PRIMARY KEY ("package_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."issues_status_enum" AS ENUM('pending', 'resolved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "issues" ("report_id" SERIAL NOT NULL, "reporter_id" integer NOT NULL, "reason_title" character varying NOT NULL, "reason_description" text, "status" "public"."issues_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ed053abd3cb52b6e89650ca93ac" PRIMARY KEY ("report_id"))`,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."rooms_privacy_enum"`);
    await queryRunner.query(`DROP TABLE "issues"`);
    await queryRunner.query(`DROP TYPE "public"."issues_status_enum"`);
    await queryRunner.query(`DROP TABLE "package"`);
    await queryRunner.query(`DROP TYPE "public"."package_status_enum"`);
  }
}
