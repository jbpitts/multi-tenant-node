import * as Faker from 'faker';

import { Pet } from '../../../src/api/models/Pet';
import { define } from '../../lib/seed';

define(Pet, (faker: typeof Faker, settings: { clientId: number, userCount: number }) => {
    const gender = faker.random.number(1);
    const name = faker.name.firstName(gender);

    const pet = new Pet();
    pet.name = name;
    pet.age = faker.random.number();
    pet.createdById = faker.random.number({min: 1, max: settings.userCount});
    pet.updatedById = faker.random.number({min: 1, max: settings.userCount});
    pet.clientId = settings.clientId;
    return pet;
});
