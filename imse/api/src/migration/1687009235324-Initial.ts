import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1687009235324 implements MigrationInterface {
    name = 'Initial1687009235324'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recipe_comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "recipe_id" uuid NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cuisine" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_d4c1e9427b94335350fecaf238e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_ingredient" ("recipe_id" uuid NOT NULL, "ingredient_id" uuid NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_87d66f3132a5cac4c048892f618" PRIMARY KEY ("recipe_id", "ingredient_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_friend" ("initiator_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "is_accepted" boolean NOT NULL, CONSTRAINT "PK_3ea605eea0eb9a850c5fab14aec" PRIMARY KEY ("initiator_id", "receiver_id"))`);
        await queryRunner.query(`CREATE TABLE "recipe_cuisines_cuisine" ("recipe_id" uuid NOT NULL, "cuisine_id" uuid NOT NULL, CONSTRAINT "PK_481499a13526c8e6b4517ce7b1c" PRIMARY KEY ("recipe_id", "cuisine_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_34c2ed27b57c6922ff84715dd4" ON "recipe_cuisines_cuisine" ("recipe_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fbc1d7c77e86d623e8a787a4eb" ON "recipe_cuisines_cuisine" ("cuisine_id") `);
        await queryRunner.query(`CREATE TABLE "users_liked_cuisines_cuisine" ("user_id" uuid NOT NULL, "cuisine_id" uuid NOT NULL, CONSTRAINT "PK_eceb892c6aa88e15a8924c2eb0b" PRIMARY KEY ("user_id", "cuisine_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ba78af3b0e7ab83d72fb2a20e6" ON "users_liked_cuisines_cuisine" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_47ac17d04f5bf623d89e909a86" ON "users_liked_cuisines_cuisine" ("cuisine_id") `);
        await queryRunner.query(`ALTER TABLE "recipe_comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_comment" ADD CONSTRAINT "FK_419a340a4ab516dd2536981e01e" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_256c22ec24d2d590b39e11a3ee4" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" ADD CONSTRAINT "FK_e1948973c93c7cabca7522b6ff3" FOREIGN KEY ("ingredient_id") REFERENCES "ingredient"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_06703b32502a601888eea7ec396" FOREIGN KEY ("initiator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_friend" ADD CONSTRAINT "FK_efe785236cae1caa3c541ea53cf" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recipe_cuisines_cuisine" ADD CONSTRAINT "FK_34c2ed27b57c6922ff84715dd4d" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "recipe_cuisines_cuisine" ADD CONSTRAINT "FK_fbc1d7c77e86d623e8a787a4ebf" FOREIGN KEY ("cuisine_id") REFERENCES "cuisine"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_liked_cuisines_cuisine" ADD CONSTRAINT "FK_ba78af3b0e7ab83d72fb2a20e63" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_liked_cuisines_cuisine" ADD CONSTRAINT "FK_47ac17d04f5bf623d89e909a86e" FOREIGN KEY ("cuisine_id") REFERENCES "cuisine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_liked_cuisines_cuisine" DROP CONSTRAINT "FK_47ac17d04f5bf623d89e909a86e"`);
        await queryRunner.query(`ALTER TABLE "users_liked_cuisines_cuisine" DROP CONSTRAINT "FK_ba78af3b0e7ab83d72fb2a20e63"`);
        await queryRunner.query(`ALTER TABLE "recipe_cuisines_cuisine" DROP CONSTRAINT "FK_fbc1d7c77e86d623e8a787a4ebf"`);
        await queryRunner.query(`ALTER TABLE "recipe_cuisines_cuisine" DROP CONSTRAINT "FK_34c2ed27b57c6922ff84715dd4d"`);
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_efe785236cae1caa3c541ea53cf"`);
        await queryRunner.query(`ALTER TABLE "user_friend" DROP CONSTRAINT "FK_06703b32502a601888eea7ec396"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_e1948973c93c7cabca7522b6ff3"`);
        await queryRunner.query(`ALTER TABLE "recipe_ingredient" DROP CONSTRAINT "FK_256c22ec24d2d590b39e11a3ee4"`);
        await queryRunner.query(`ALTER TABLE "recipe_comment" DROP CONSTRAINT "FK_419a340a4ab516dd2536981e01e"`);
        await queryRunner.query(`ALTER TABLE "recipe_comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47ac17d04f5bf623d89e909a86"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba78af3b0e7ab83d72fb2a20e6"`);
        await queryRunner.query(`DROP TABLE "users_liked_cuisines_cuisine"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fbc1d7c77e86d623e8a787a4eb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34c2ed27b57c6922ff84715dd4"`);
        await queryRunner.query(`DROP TABLE "recipe_cuisines_cuisine"`);
        await queryRunner.query(`DROP TABLE "user_friend"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "recipe_ingredient"`);
        await queryRunner.query(`DROP TABLE "recipe"`);
        await queryRunner.query(`DROP TABLE "ingredient"`);
        await queryRunner.query(`DROP TABLE "cuisine"`);
        await queryRunner.query(`DROP TABLE "recipe_comment"`);
    }

}
