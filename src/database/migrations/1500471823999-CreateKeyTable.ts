import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateKeyTable1500471823999 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table(
            {
                name: 'key',
                columns: [
                    {
                        name: 'client_id',
                        type: 'int',
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: false,
                    }, {
                        name: 'pet',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                        default: '(0)',
                    }, {
                        name: 'user',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                        default: '(0)',
                    },
                ],
            });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('key');
    }
}
