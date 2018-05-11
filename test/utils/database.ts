import { Container } from 'typedi';
import { Connection, createConnection, useContainer } from 'typeorm';

import { env } from '../../src/env';

export const createDatabaseConnection = async (): Promise<Connection> => {
    useContainer(Container);
    const connection = await createConnection({
        type: env.db.type as any, // See createConnection options for valid types
        host: env.db.host,
        port: env.db.port,
        username: env.db.username,
        password: env.db.password,
        database: env.db.database,
        synchronize: env.db.synchronize,
        logging: env.db.logging,
        entities: env.app.dirs.entities,
        migrations: env.app.dirs.migrations,
        subscribers: env.app.dirs.subscribers,
    });
    return connection;
};

export const synchronizeDatabase = async (connection: Connection) => {
    await connection.dropDatabase();
    return connection.synchronize(true);
};

export const migrateDatabase = async (connection: Connection) => {
    await connection.dropDatabase();
    return connection.runMigrations();
};

export const closeDatabase = (connection: Connection) => {
    return connection.close();
};
