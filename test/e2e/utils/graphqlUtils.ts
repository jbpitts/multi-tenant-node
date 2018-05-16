
import * as request from 'supertest';
import { BootstrapSettings } from './bootstrap';

export const deleteClient = async (id: number, settings:BootstrapSettings): Promise<boolean> => {
    const mutation = {
        mutation: `
                mutation {
                  clientDelete(id: ${id})
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

    return response.body;
};

export const findClient =  async (name: string, settings:BootstrapSettings): Promise<Client> => {
    const query = {
        query: `
                query {
                  client(name: "${name}") {
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

    if (response.body && response.body.data.client) {
        return response.body.data.client;
    }
    return undefined;
};