import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMusicTable1739288519730 implements MigrationInterface {
  name = 'CreateMusicTable1739288519730';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "music" ("music_id" SERIAL NOT NULL, "user_create_id" integer NOT NULL, "category_id" integer NOT NULL, "path" character varying NOT NULL, "title" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f2dbe1289ab447c387bdd36f7c6" PRIMARY KEY ("music_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "music"`);
  }
}
