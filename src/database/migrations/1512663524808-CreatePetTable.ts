import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePetTable1512663524808 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table(
            {
                name: 'pet',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                    }, {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: false,
                    }, {
                        name: 'age',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                    }, {
                        name: 'user_id',
                        type: 'int',
                        isPrimary: false,
                        isNullable: true,
                    }, {
                        name: 'key',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                        isGenerated: false,
                    }, {
                        name: 'client_id',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                        isGenerated: false,
                    }, {
                        name: 'created_by',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                    }, {
                        name: 'updated_by',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                    }, {
                        name: 'created_at',
                        type: 'timestamp',
                        length: '6',
                        isPrimary: false,
                        isNullable: false,
                        default: 'now()',
                    }, {
                        name: 'updated_at',
                        type: 'timestamp',
                        length: '6',
                        isPrimary: false,
                        isNullable: false,
                        default: 'now()',
                    }, {
                        name: 'epoch',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                    },
                ],
                uniques: [
                    {
                        columnNames: [
                            'client_id',
                            'key',
                        ],
                    },
                ],
            });
        await queryRunner.createTable(table);
        await queryRunner.query(`CREATE OR REPLACE FUNCTION pet_fnkey() returns trigger
	        language plpgsql
            as $$
                BEGIN
                  IF NEW.key IS NULL THEN
                    UPDATE key set "pet" = "pet" + 1 WHERE client_id = NEW.client_id RETURNING "pet" into NEW.key;
                  ELSE
                    UPDATE key set "pet" = NEW.key WHERE "pet" < NEW.key and client_id = NEW.client_id;
                  END IF;
                  RETURN NEW;
                END
            $$`);
        await queryRunner.query(`CREATE TRIGGER pet_key BEFORE INSERT ON "pet"
                            FOR EACH ROW EXECUTE PROCEDURE pet_fnkey()`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('pet');
        await queryRunner.query(`DROP FUNCTION IF EXISTS pet_fnkey()`);
    }

}
