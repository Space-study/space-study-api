import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatRelation1743347103284 implements MigrationInterface {
  name = 'ChatRelation1743347103284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_93a28d680f3f131dea7415e0bf"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "orderCode" integer NOT NULL, "email" character varying NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending', "key" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a19117689f1569f622cc7acd853" UNIQUE ("orderCode"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_participants" ("message_id" uuid NOT NULL, "room_id" integer NOT NULL, CONSTRAINT "PK_d3fcd639637c08c159538230891" PRIMARY KEY ("message_id", "room_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b4cf89c1da3632aee62f4f8ea" ON "chat_participants" ("message_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28ec40b32953b1424a57386ba1" ON "chat_participants" ("room_id") `,
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "chatId"`);
    await queryRunner.query(
      `ALTER TABLE "package" ALTER COLUMN "price" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19d7362db248a3df27fc29b507" ON "message" ("createdAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_4b4cf89c1da3632aee62f4f8eaa" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_28ec40b32953b1424a57386ba13" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_28ec40b32953b1424a57386ba13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_4b4cf89c1da3632aee62f4f8eaa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_19d7362db248a3df27fc29b507"`,
    );
    await queryRunner.query(
      `ALTER TABLE "package" ALTER COLUMN "price" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "message" ADD "chatId" uuid`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28ec40b32953b1424a57386ba1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b4cf89c1da3632aee62f4f8ea"`,
    );
    await queryRunner.query(`DROP TABLE "chat_participants"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_93a28d680f3f131dea7415e0bf" ON "message" ("chatId", "createdAt") `,
    );
  }
}
