import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { Pet } from '../../src/api/models/Pet';
import { PetService } from '../../src/api/services/PetService';
import { Client } from '../../src/api/models/Client';
import { ClientService } from '../../src/api/services/ClientService';
import { User } from '../../src/api/models/User';
import { UserService } from '../../src/api/services/UserService';
import { closeDatabase, createDatabaseConnection, migrateDatabase } from '../utils/database';

describe('PetService', () => {

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    let connection: Connection;
    beforeAll(async () => connection = await createDatabaseConnection());
    beforeEach(() => migrateDatabase(connection));

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(() => closeDatabase(connection));

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    test('should create a new pet in the database', async (done) => {
        const system = new User();
        system.id = 1;
        system.clientId = 1;

        const client = new Client();
        client.name = 'test';
        const clientService = Container.get<ClientService>(ClientService);
        const clientResult = await clientService.create(system, client);
        expect(clientResult.name).toBe(client.name);

        const user = new User();
        user.firstName = 'Tester';
        user.lastName = 'Tester';
        user.email = 'tester@tester.com';
        user.clientId = clientResult.id;
        const userService = Container.get<UserService>(UserService);
        const userResult = await userService.create(system, user);
        expect(userResult.email).toBe(userResult.email);

        const pet = new Pet();
        pet.name = 'test';
        pet.age = 1;
        pet.clientId = userResult.clientId;
        pet.createdById = userResult.id;
        pet.updatedById = userResult.id;
        const service = Container.get<PetService>(PetService);
        const resultCreate = await service.create(pet);
        expect(resultCreate.name).toBe(pet.name);
        expect(resultCreate.age).toBe(pet.age);

        const resultFind = await service.findOne(resultCreate.id);
        if (resultFind) {
            expect(resultFind.name).toBe(pet.name);
            expect(resultFind.age).toBe(pet.age);
        } else {
            fail('Could not find pet');
        }
        done();
    });

});
