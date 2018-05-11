import { Connection } from 'typeorm';

import { User } from '../../../src/api/models/User';
import { Client } from '../../../src/api/models/Client';
import { Pet } from '../../../src/api/models/Pet';

import { Factory, Seed, times } from '../../lib/seed';
import { SeedConstants } from '../SeedConstants';

export class CreatePets implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<any> {
        const em = connection.createEntityManager();
        const clientRepo = connection.getRepository(Client);
        const client = await clientRepo.findOne({where: {name: SeedConstants.defaultClient}});
        const clientId = client.id;

        const repo = connection.getRepository(User);

        const userCount = await repo.count({where: {clientId}});

        await times(10, async (n) => {
            const pet = await factory(Pet)({clientId, userCount}).seed();
            const user = await factory(User)({clientId}).make();
            user.pets = [pet];
            return await em.save(user);
        });
    }

}
