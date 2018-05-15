
import { EntityManager } from 'typeorm';

import { Client } from '../../../../src/api/models/Client';
import { Key } from '../../../../src/api/models/Key';
import { ProdSeed } from './ProdSeed';
import { SeedConstants } from '../SeedConstants';

export class CreateClientRoot implements ProdSeed {

    public async seed(em: EntityManager): Promise<any> {

        const repo = em.getRepository(Client);
        const clientCheck = await repo.findOne({where: {name: SeedConstants.rootClient}});
        if (clientCheck === undefined) {
            const client = new Client();
            client.id = 0; // this is ignored just call insert statement
            client.name = SeedConstants.rootClient;
            client.companyEmail = SeedConstants.rootEmail;
            client.createdById = 1;
            client.updatedById = 1;

            // const newClient = await em.save(client);
            em.query('insert into client (id, name, company_email, created_by, updated_by, epoch) values (0, \'' +
                SeedConstants.rootClient + '\', \'' + SeedConstants.rootEmail + '\', 1, 1, 1)');

            // subscribers are turned off during migrations
            const key = new Key();
            key.clientId = client.id;

            await em.save(key);
            return client;
        }
        return clientCheck;
    }
}
