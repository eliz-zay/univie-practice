import { MigrationInterface, QueryRunner } from "typeorm";

export class Analytics1686066331068 implements MigrationInterface {
    name = 'Analytics1686066331068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "analytics" ("event_id" integer NOT NULL, "feedback_count" integer NOT NULL, "feedback_rating" integer NOT NULL, "attendee_count" integer NOT NULL, CONSTRAINT "PK_29d5b2021997dfc387aa5a05ae6" PRIMARY KEY ("event_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "analytics"`);
    }

}
