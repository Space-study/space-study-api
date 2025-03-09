import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomTable1741511796962 implements MigrationInterface {
  name = 'CreateRoomTable1741511796962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."rooms_status_enum" RENAME TO "rooms_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rooms_status_enum" AS ENUM('active', 'ban', 'pending')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "status" TYPE "public"."rooms_status_enum" USING "status"::"text"::"public"."rooms_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "status" SET DEFAULT 'pending'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rooms_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rooms_status_enum_old" AS ENUM('active', 'ban')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "status" TYPE "public"."rooms_status_enum_old" USING "status"::"text"::"public"."rooms_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "status" SET DEFAULT 'active'`,
    );
    await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."rooms_status_enum_old" RENAME TO "rooms_status_enum"`,
    );
  }
}
