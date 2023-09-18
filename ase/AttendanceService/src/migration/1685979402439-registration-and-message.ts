import { MigrationInterface, QueryRunner } from "typeorm";

export class RegistrationAndMessage1685979402439 implements MigrationInterface {
    name = 'RegistrationAndMessage1685979402439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "registration" ("attendee_id" integer NOT NULL, "event_id" integer NOT NULL, CONSTRAINT "PK_ce76bb02d5fea2ade207feab83a" PRIMARY KEY ("attendee_id", "event_id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "event_id" integer NOT NULL, "sender_id" integer NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "registration"`);
    }

}
