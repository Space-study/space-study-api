import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEnumIssue1742639385246 implements MigrationInterface {
  name = 'AddEnumIssue1742639385246';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."issue_status_enum" RENAME TO "issue_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."issue_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ALTER COLUMN "status" TYPE "public"."issue_status_enum" USING "status"::"text"::"public"."issue_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ALTER COLUMN "status" SET DEFAULT 'OPEN'`,
    );
    await queryRunner.query(`DROP TYPE "public"."issue_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."issue_status_enum_old" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ALTER COLUMN "status" TYPE "public"."issue_status_enum_old" USING "status"::"text"::"public"."issue_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ALTER COLUMN "status" SET DEFAULT 'OPEN'`,
    );
    await queryRunner.query(`DROP TYPE "public"."issue_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."issue_status_enum_old" RENAME TO "issue_status_enum"`,
    );
  }
}
