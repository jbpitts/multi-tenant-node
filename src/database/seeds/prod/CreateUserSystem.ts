
import { EntityManager } from 'typeorm';

import { Client } from '../../../../src/api/models/Client';
import { User } from '../../../../src/api/models/User';
import { ProdSeed } from './ProdSeed';
import { SeedConstants } from '../SeedConstants';

export class CreateUserSystem implements ProdSeed {

    public async seed(em: EntityManager): Promise<any> {

        const repo = em.getRepository(Client);
        const clientCheck = await repo.findOne({where: {name: SeedConstants.rootClient}});

        const user = new User();
        user.firstName = 'system';
        user.lastName = 'system';
        user.email = 'system@system.com';
        user.createdById = 1;
        user.updatedById = 1;
        user.clientId = clientCheck.id;

        return await em.save(user);
    }
}
