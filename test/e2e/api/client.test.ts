
import * as request from 'supertest';

import { User } from '../../../src/api/models/User';
import { runSeed } from '../../../src/lib/seed';
import { closeDatabase } from '../../utils/database';
import { BootstrapSettings } from '../utils/bootstrap';
import { prepareServer } from '../utils/server';

import { deleteClient, findClient } from '../utils/graphqlUtils';

describe('/api/clients', () => {

    let bruce: User;
    let settings: BootstrapSettings;

    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async () => {
        settings = await prepareServer({ migrate: true });
    });

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(async () => {
        await closeDatabase(settings.connection);
    });

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    test('GET: / should return a list of clients', async (done) => {
        const response = await request(settings.app)
            .get('/api/clients')
            .set('Authorization', `Bearer 1`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toContainEqual(
            expect.objectContaining({ name: 'root', id: expect.anything() })
        );
        done();
    });

    test('GraphQL: should return list of clients', async (done) => {
        const query = {
            query: `
                query {
                  clients {
                    id,
                    name
                  }
                }
            `,
        };

        const response = await request(settings.app)
            .post('/graphql')
            .set('Authorization', `Bearer 1`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .send(query);

        expect(response.body.data.clients).toContainEqual(
            expect.objectContaining({ name: 'root', id: expect.anything() })
        );
        done();
    });

    test('GraphQL: query none existing client', async (done) => {
        const client = await findClient('does not exist', settings);
        expect(client).toBeUndefined();
        done();
    });

    test('GraphQL: should create a client', async (done) => {
        const testClient = 'testclientname';
        const client = await findClient(testClient, settings);
        if (client) {
            // shouldn't be found because rebuild database everytime
            await deleteClient(client.id, settings);
        }

        const mutation = {
            query: `
                mutation {
                  clientCreate(name: "${testClient}") {
                    name
                  } 
                }
            `,
        };

        const response = await request(settings.app)
            .post('/graphql')
            .set('Authorization', `Bearer 1`)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .send(mutation);

        expect(response.body.data.clientCreate).toEqual(
            expect.objectContaining({ name: testClient })
        );

        const find = await findClient(testClient, settings);
        expect(find).toEqual(expect.objectContaining({ name: testClient }));
        done();
    });



});
