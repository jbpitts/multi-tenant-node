import { Connection } from 'typeorm/connection/Connection';

import { User } from '../../../../src/api/models/User';
import { Client } from '../../../../src/api/models/Client';

import { Factory, Seed } from '../../../lib/seed/types';
import { SeedConstants } from '../SeedConstants';

export class CreateClientUsers implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<any> {
        const repo = connection.getRepository(Client);
        const client = await repo.findOne({where: {name: SeedConstants.defaultClient}});
        await factory(User)({clientId: client.id}).seedMany(10);
    }

}
