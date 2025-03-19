import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePackageTable1741624566478 implements MigrationInterface {
  name = 'CreatePackageTable1741624566478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."package_status_enum" AS ENUM('1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "package" ("package_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "duration" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."package_status_enum" NOT NULL DEFAULT '1', CONSTRAINT "PK_1ff0914c1f178aea0726df298bf" PRIMARY KEY ("package_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "package"`);
    await queryRunner.query(`DROP TYPE "public"."package_status_enum"`);
  }
}
