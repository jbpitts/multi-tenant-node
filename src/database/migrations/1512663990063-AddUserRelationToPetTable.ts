import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class AddUserRelationToPetTable1512663990063 implements MigrationInterface {

    private tableForeignKey = new TableForeignKey(
        {
            name: 'FK_PET_TO_USER',
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
        });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey('pet', this.tableForeignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('pet', this.tableForeignKey);
    }

}
