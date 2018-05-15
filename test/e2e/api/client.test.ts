
import * as request from 'supertest';

import { User } from '../../../src/api/models/User';
import { runSeed } from '../../../src/lib/seed';
import { closeDatabase } from '../../utils/database';
import { BootstrapSettings } from '../utils/bootstrap';
import { prepareServer } from '../utils/server';

describe('/api/users', () => {

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

        expect(response.body.length).toBe(1); // root
        done();
    });

});
