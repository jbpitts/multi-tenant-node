import { Connection } from 'typeorm/connection/Connection';

import { Client } from '../../../src/api/models/Client';
import { Factory, Seed } from '../../lib/seed/types';
import { SeedConstants } from '../SeedConstants';

export class CreateaClient implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<any> {

        const repo = connection.getRepository(Client);
        const clientCheck = await repo.findOne({where: {name: SeedConstants.defaultClient}});
        if (clientCheck === undefined) {
            const client = new Client();
            client.name = SeedConstants.defaultClient;
            client.companyEmail = 'support@lansweeper.com';
            client.createdById = 1;
            client.updatedById = 1;
            client.spaceLimit = 20000;

            const em = connection.createEntityManager();
            return await em.save(client);
        }
        return clientCheck;
    }
}
