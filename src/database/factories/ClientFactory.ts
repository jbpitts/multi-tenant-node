import * as Faker from 'faker';

import { Client } from '../../../src/api/models/Client';
import { define } from '../../lib/seed';

define(Client, (faker: typeof Faker) => {
    const client = new Client();
    client.name = faker.internet.domainWord();
    client.companyEmail = faker.internet.email();
    client.companyName = faker.company.companyName();
    client.companyPhone = faker.phone.phoneNumber();
    client.companyUrl = faker.internet.url();
    client.createdById = 1;
    client.updatedById = 1;
    client.spaceLimit = 20000;

    return client;
});
