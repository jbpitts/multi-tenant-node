import { Connection } from 'typeorm';

import { User } from '../../../src/api/models/User';
import { Client } from '../../../src/api/models/Client';
import { Factory, Seed } from '../../lib/seed/types';
import { SeedConstants } from '../SeedConstants';

export class CreateBruce implements Seed {

    public async seed(factory: Factory, connection: Connection): Promise<User> {
        // const userFactory = factory<User, { role: string }>(User as any);
        // const adminUserFactory = userFactory({ role: 'admin' });

        // const bruce = await adminUserFactory.make();
        // console.log(bruce);

        // const bruce2 = await adminUserFactory.seed();
        // console.log(bruce2);

        // const bruce3 = await adminUserFactory
        //     .map(async (e: User) => {
        //         e.firstName = 'Bruce';
        //         return e;
        //     })
        //     .seed();
        // console.log(bruce3);

        // return bruce;

        // const connection = await factory.getConnection();
        const repo = connection.getRepository(Client);
        const client = await repo.findOne({where: {name: SeedConstants.defaultClient}});
        const em = connection.createEntityManager();

        const user = new User();
        user.firstName = 'system';
        user.lastName = 'system';
        user.email = 'system@ls.com';
        user.createdById = 1;
        user.updatedById = 1;
        user.clientId = client.id;
        await em.save(user);

        const user2 = new User();
        user2.createdById = 1;
        user2.updatedById = 1;
        user2.firstName = 'Bruce';
        user2.lastName = 'Wayne';
        user2.email = 'bruce.wayne@wayne-enterprises.com';
        user2.createdById = 1;
        user2.updatedById = 1;
        user2.clientId = client.id;
        return await em.save(user2);
    }

}
