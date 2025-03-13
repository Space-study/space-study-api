import { MigrationInterface, QueryRunner } from 'typeorm';

export class FeatPlan1741805788159 implements MigrationInterface {
  name = 'FeatPlan1741805788159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "issue_label" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_51db7526ac10f50336e3dc48e8f" UNIQUE ("name"), CONSTRAINT "PK_0d9ee0fe31a85d59e134e332099" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."issue_status_enum" AS ENUM('OPEN', 'IN_PROGRESS', 'DONE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "issue" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "status" "public"."issue_status_enum" NOT NULL DEFAULT 'OPEN', "timeEstimate" integer NOT NULL DEFAULT '0', "timeSpent" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "reporterId" integer, "assigneeId" integer, "projectId" integer, CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "ownerId" integer, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
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
  }
}
