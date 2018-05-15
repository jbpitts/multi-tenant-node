
import { MigrationInterface, QueryRunner } from 'typeorm';
import { CreateClientRoot } from '../seeds/prod/CreateClientRoot';
import { CreateUserSystem } from '../seeds/prod/CreateUserSystem';

export class AddSystem1511115183653 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const createClientRoot = new CreateClientRoot();
        await createClientRoot.seed(queryRunner.manager);

        const createUserSystem = new CreateUserSystem();
        await createUserSystem.seed(queryRunner.manager);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
    }

}
