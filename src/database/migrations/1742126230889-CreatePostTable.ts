import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostTable1742126230889 implements MigrationInterface {
  name = 'CreatePostTable1742126230889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rooms" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "privacy" "public"."rooms_privacy_enum" NOT NULL DEFAULT 'public', "max_members" integer NOT NULL, "image_url" character varying NOT NULL, "category" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."rooms_status_enum" NOT NULL DEFAULT 'pending', "invite_link" character varying NOT NULL, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rooms"`);
  }
}
