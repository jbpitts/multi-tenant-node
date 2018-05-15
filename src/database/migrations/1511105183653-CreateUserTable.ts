import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1511105183653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table(
            {
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
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
                    }, {
                        name: 'first_name',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: false,
                    }, {
                        name: 'last_name',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: false,
                    }, {
                        name: 'email',
                        type: 'varchar',
                        length: '255',
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
        await queryRunner.query(`CREATE OR REPLACE FUNCTION user_fnkey() returns trigger
	        language plpgsql
            as $$
                BEGIN
                  IF NEW.key IS NULL THEN
                    UPDATE key set "user" = "user" + 1 WHERE client_id = NEW.client_id RETURNING "user" into NEW.key;
                  ELSE
                    UPDATE key set "user" = NEW.key WHERE "user" < NEW.key and client_id = NEW.client_id;
                  END IF;
                  RETURN NEW;
                END
            $$`);
        await queryRunner.query(`CREATE TRIGGER user_key BEFORE INSERT ON "user"
                            FOR EACH ROW EXECUTE PROCEDURE user_fnkey()`);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('user');
        await queryRunner.query(`DROP FUNCTION IF EXISTS user_fnkey()`);
    }

}
