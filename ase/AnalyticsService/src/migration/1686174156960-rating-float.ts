import { MigrationInterface, QueryRunner } from "typeorm";

export class RatingFloat1686174156960 implements MigrationInterface {
    name = 'RatingFloat1686174156960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "feedback_rating"`);
        await queryRunner.query(`ALTER TABLE "analytics" ADD "feedback_rating" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "feedback_rating"`);
        await queryRunner.query(`ALTER TABLE "analytics" ADD "feedback_rating" integer NOT NULL`);
    }

}
