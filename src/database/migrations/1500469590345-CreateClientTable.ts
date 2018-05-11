import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class CreateClientTable1500469590345 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table(
            {
                name: 'client',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
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
                        name: 'space_used',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                        default: '(0)',
                    }, {
                        name: 'space_limit',
                        type: 'int',
                        isPrimary: false,
                        isNullable: false,
                        default: '(0)',
                    }, {
                        name: 'database_name',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: true,
                    }, {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: false,
                        isUnique: true,
                    }, {
                        name: 'company_name',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: true,
                    }, {
                        name: 'company_url',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: true,
                    }, {
                        name: 'company_phone',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: true,
                    }, {
                        name: 'company_email',
                        type: 'varchar',
                        length: '255',
                        isPrimary: false,
                        isNullable: true,
                    },
                ],
            });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('client');
    }

}
