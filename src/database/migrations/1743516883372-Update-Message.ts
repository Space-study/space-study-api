import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMessage1743516883372 implements MigrationInterface {
  name = 'UpdateMessage1743516883372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "message_rooms" ("message_id" uuid NOT NULL, "room_id" integer NOT NULL, CONSTRAINT "PK_7f895ae9fc992e9e9d203d3b900" PRIMARY KEY ("message_id", "room_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2feb37a2e13d3b27fbef5699a2" ON "message_rooms" ("message_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_76f1562cc2f0a95eb9abdf1e46" ON "message_rooms" ("room_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD "isAiGenerated" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_rooms" ADD CONSTRAINT "FK_2feb37a2e13d3b27fbef5699a2f" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_rooms" ADD CONSTRAINT "FK_76f1562cc2f0a95eb9abdf1e463" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message_rooms" DROP CONSTRAINT "FK_76f1562cc2f0a95eb9abdf1e463"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_rooms" DROP CONSTRAINT "FK_2feb37a2e13d3b27fbef5699a2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP COLUMN "isAiGenerated"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_76f1562cc2f0a95eb9abdf1e46"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2feb37a2e13d3b27fbef5699a2"`,
    );
    await queryRunner.query(`DROP TABLE "message_rooms"`);
  }
}
