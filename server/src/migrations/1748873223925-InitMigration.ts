import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitMigration1748873223925 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "category",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "title", type: "varchar", isNullable: true },
          { name: "name", type: "varchar", isNullable: true },
          { name: "status", type: "int" },
          { name: "time_create", type: "timestamp" },
          { name: "description", type: "varchar", isNullable: true },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "blog",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "category_id", type: "int" },
          { name: "name", type: "varchar", isNullable: true },
          { name: "status", type: "int" },
          { name: "time_create", type: "timestamp" },
          { name: "title", type: "varchar", isNullable: true },
          { name: "description", type: "varchar", isNullable: true },
          { name: "sub_description", type: "varchar", isNullable: true },
          { name: "img", type: "varchar", isNullable: true },
          { name: "keywords", type: "varchar", isNullable: true },
          { name: "view", type: "int" },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "blog",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "category",
        onDelete: "NO ACTION",
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "channel",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "channel_key", type: "varchar", length: "100", isNullable: true },
          { name: "channel_value", type: "varchar", length: "100", isNullable: true },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "style",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "style_key", type: "varchar", length: "100", isNullable: true },
        ],
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "combination",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "channel_id", type: "int" },
          { name: "style_id", type: "int" },
        ],
      })
    );

    await queryRunner.createForeignKeys("combination", [
      new TableForeignKey({
        columnNames: ["channel_id"],
        referencedTableName: "channel",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["style_id"],
        referencedTableName: "style",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable("combination");
      await queryRunner.dropTable("style");
      await queryRunner.dropTable("channel");
      await queryRunner.dropForeignKey("blog", "FK_blog_category_id"); // optional: use actual foreign key name
      await queryRunner.dropTable("blog");
      await queryRunner.dropTable("category");
    }

}
