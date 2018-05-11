import { Connection } from 'typeorm/connection/Connection';

import { Client } from '../../../src/api/models/Client';
import { Factory, Seed } from '../../lib/seed/types';
import { SeedConstants } from '../SeedConstants';

export class CreateaClient implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<any> {
        const client = new Client();
        client.name = SeedConstants.defaultClient;
        client.companyEmail = 'support@lansweeper.com';
        client.createdById = 1;
        client.updatedById = 1;
        client.spaceLimit = 20000;

        const em = connection.createEntityManager();
        await em.save(client);
        return await factory(Client)().seedMany(10);
    }
}
