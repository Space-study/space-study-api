import { MigrationInterface, QueryRunner } from 'typeorm';

export class All1743521538645 implements MigrationInterface {
  name = 'All1743521538645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_e16675fae83bc603f30ae8fbdd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_fb6add83b1a7acc94433d385692"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_93a28d680f3f131dea7415e0bf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e16675fae83bc603f30ae8fbdd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb6add83b1a7acc94433d38569"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."report_issues_status_enum" AS ENUM('pending', 'resolved', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "report_issues" ("report_id" SERIAL NOT NULL, "reporter_id" integer NOT NULL, "reason_title" character varying NOT NULL, "reason_description" text, "status" "public"."report_issues_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bb3d9a812a46ba355cc4e93d68b" PRIMARY KEY ("report_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."package_status_enum" AS ENUM('1', '2')`,
    );
    await queryRunner.query(
      `CREATE TABLE "package" ("package_id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "duration" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."package_status_enum" NOT NULL DEFAULT '1', CONSTRAINT "PK_1ff0914c1f178aea0726df298bf" PRIMARY KEY ("package_id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" SERIAL NOT NULL, "orderCode" integer NOT NULL, "email" character varying NOT NULL, "status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending', "key" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a19117689f1569f622cc7acd853" UNIQUE ("orderCode"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "issue_label" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_51db7526ac10f50336e3dc48e8f" UNIQUE ("name"), CONSTRAINT "PK_0d9ee0fe31a85d59e134e332099" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."issue_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "issue" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "status" "public"."issue_status_enum" NOT NULL DEFAULT 'OPEN', "timeEstimate" integer NOT NULL DEFAULT '0', "timeSpent" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "reporterId" integer, "assigneeId" integer, "projectId" integer, CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" integer, "roomId" integer, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "issue_participants" ("issueId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_c139054d2dcb9fbbe073c67169d" PRIMARY KEY ("issueId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9deeb6ed1a2d105931109d015f" ON "issue_participants" ("issueId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ecb98ec9e9f632561c8f40d6bb" ON "issue_participants" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "issue_issue_labels" ("issueId" integer NOT NULL, "issueLabelId" integer NOT NULL, CONSTRAINT "PK_32645a7905c12341c65f3742dcd" PRIMARY KEY ("issueId", "issueLabelId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_94f15ca86e4da2fa7f85ac07fa" ON "issue_issue_labels" ("issueId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd89d8d2aa75bcd450db5b854e" ON "issue_issue_labels" ("issueLabelId") `,
    );
    await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "chatId"`);
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "PK_d3101b19215e8540d891f98c065"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "PK_fb6add83b1a7acc94433d385692" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP COLUMN "chatId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "PK_fb6add83b1a7acc94433d385692"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP COLUMN "userId"`,
    );
    await queryRunner.query(`ALTER TABLE "rooms" ADD "owner_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD "message_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "PK_4b4cf89c1da3632aee62f4f8eaa" PRIMARY KEY ("message_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD "room_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "PK_4b4cf89c1da3632aee62f4f8eaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "PK_d3fcd639637c08c159538230891" PRIMARY KEY ("message_id", "room_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "invite_link" DROP NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_19d7362db248a3df27fc29b507" ON "message" ("createdAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b4cf89c1da3632aee62f4f8ea" ON "chat_participants" ("message_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_28ec40b32953b1424a57386ba1" ON "chat_participants" ("room_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ADD CONSTRAINT "FK_668ba5ace621b4afbb808f2af48" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ADD CONSTRAINT "FK_d92e4c455673ad050d998bb2c56" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" ADD CONSTRAINT "FK_be30b91466b730c5e25f1181f79" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_03cca096abac73a0d7264a9b10e" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_4b4cf89c1da3632aee62f4f8eaa" FOREIGN KEY ("message_id") REFERENCES "message"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_28ec40b32953b1424a57386ba13" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue_participants" ADD CONSTRAINT "FK_9deeb6ed1a2d105931109d015f1" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue_participants" ADD CONSTRAINT "FK_ecb98ec9e9f632561c8f40d6bb4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue_issue_labels" ADD CONSTRAINT "FK_94f15ca86e4da2fa7f85ac07fae" FOREIGN KEY ("issueId") REFERENCES "issue"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue_issue_labels" ADD CONSTRAINT "FK_fd89d8d2aa75bcd450db5b854ec" FOREIGN KEY ("issueLabelId") REFERENCES "issue_label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "issue_issue_labels" DROP CONSTRAINT "FK_fd89d8d2aa75bcd450db5b854ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue_issue_labels" DROP CONSTRAINT "FK_94f15ca86e4da2fa7f85ac07fae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue_participants" DROP CONSTRAINT "FK_ecb98ec9e9f632561c8f40d6bb4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue_participants" DROP CONSTRAINT "FK_9deeb6ed1a2d105931109d015f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_28ec40b32953b1424a57386ba13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_4b4cf89c1da3632aee62f4f8eaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_03cca096abac73a0d7264a9b10e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_9884b2ee80eb70b7db4f12e8aed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" DROP CONSTRAINT "FK_be30b91466b730c5e25f1181f79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" DROP CONSTRAINT "FK_d92e4c455673ad050d998bb2c56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "issue" DROP CONSTRAINT "FK_668ba5ace621b4afbb808f2af48"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_28ec40b32953b1424a57386ba1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b4cf89c1da3632aee62f4f8ea"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_19d7362db248a3df27fc29b507"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" ALTER COLUMN "invite_link" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "PK_d3fcd639637c08c159538230891"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "PK_4b4cf89c1da3632aee62f4f8eaa" PRIMARY KEY ("message_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP COLUMN "room_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "PK_4b4cf89c1da3632aee62f4f8eaa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP COLUMN "message_id"`,
    );
    await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "owner_id"`);
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "PK_fb6add83b1a7acc94433d385692" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD "chatId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" DROP CONSTRAINT "PK_fb6add83b1a7acc94433d385692"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "PK_d3101b19215e8540d891f98c065" PRIMARY KEY ("chatId", "userId")`,
    );
    await queryRunner.query(`ALTER TABLE "message" ADD "chatId" uuid`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd89d8d2aa75bcd450db5b854e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_94f15ca86e4da2fa7f85ac07fa"`,
    );
    await queryRunner.query(`DROP TABLE "issue_issue_labels"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ecb98ec9e9f632561c8f40d6bb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9deeb6ed1a2d105931109d015f"`,
    );
    await queryRunner.query(`DROP TABLE "issue_participants"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TABLE "issue"`);
    await queryRunner.query(`DROP TYPE "public"."issue_status_enum"`);
    await queryRunner.query(`DROP TABLE "issue_label"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    await queryRunner.query(`DROP TABLE "package"`);
    await queryRunner.query(`DROP TYPE "public"."package_status_enum"`);
    await queryRunner.query(`DROP TABLE "report_issues"`);
    await queryRunner.query(`DROP TYPE "public"."report_issues_status_enum"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_fb6add83b1a7acc94433d38569" ON "chat_participants" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e16675fae83bc603f30ae8fbdd" ON "chat_participants" ("chatId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93a28d680f3f131dea7415e0bf" ON "message" ("chatId", "createdAt") `,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_fb6add83b1a7acc94433d385692" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_e16675fae83bc603f30ae8fbdd5" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
