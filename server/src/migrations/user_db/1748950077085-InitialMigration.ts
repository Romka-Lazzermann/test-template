import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1748950077085 implements MigrationInterface {
    name = 'InitialMigration1748950077085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`role\` enum ('admin') NOT NULL DEFAULT 'admin', \`login\` varchar(100) NOT NULL, \`hash\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
