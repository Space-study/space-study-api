import { MigrationInterface, QueryRunner } from 'typeorm';

export class Resolve1742626871403 implements MigrationInterface {
  name = 'Resolve1742626871403';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_154d144c8029d668a1cd17fd3f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "roomsId" TO "roomId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ADD "invite_link" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_03cca096abac73a0d7264a9b10e" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_03cca096abac73a0d7264a9b10e"`,
    );
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "invite_link"`);
    await queryRunner.query(
      `ALTER TABLE "project" RENAME COLUMN "roomId" TO "roomsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_154d144c8029d668a1cd17fd3f5" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
