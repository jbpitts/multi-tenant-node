import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { buildVesperSchema, vesper } from 'vesper';
import * as bodyParser from 'body-parser';
import { default as expressPlayground } from 'graphql-playground-middleware-express';

import { User } from '../api/models/User';
import { Pet } from '../api/models/Pet';
import { Client } from '../api/models/Client';
import { UserController } from '../api/schema/controllers/UserController';
import { PetController } from '../api/schema/controllers/PetController';
import { ClientController } from '../api/schema/controllers/ClientController';
import { env } from '../env';
import { currentUserVesper } from '../auth/currentUserChecker';
import { authorizationCheckerVesper } from '../auth/authorizationChecker';

// const apolloUploadExpress = require('apollo-upload-server').apolloUploadExpress;

export const graphqlLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.graphql.enabled) {
        const expressApp = settings.getData('express_app');
        const connection = settings.getData('connection');

        const graphQLRoute = env.graphql.route || '/graphql';
        const schema = await buildVesperSchema({
            controllers: [
                UserController,
                PetController,
                ClientController,
            ],
            entities: [
                User,
                Pet,
                Client,
            ],
            schemas: [
                __dirname + '/../api/schema/models/**/*.graphql',
            ],
            typeorm: {
                connectionName: 'vesper',
            },
            setupContainer: currentUserVesper(connection),
            authorizationChecker: authorizationCheckerVesper(connection),
        });

        expressApp.use(graphQLRoute, bodyParser.json(), /* apolloUploadExpress(), */vesper(schema));

        // const hasSubscriptions = getMetadataArgsStorage().actions.filter(action => action.type === 'subscription');
        if (env.graphql.editor === true ||
            process.env.NODE_ENV !== 'prod') {
            const playgroundRoute = (env.graphql.playground && typeof env.graphql.playground === 'string') ? env.graphql.playground : '/playground';
            const graphIOptions: any = { endpoint: graphQLRoute };
            // if (hasSubscriptions) {
            //    graphIOptions.subscriptionsEndpoint = `ws://localhost:${env.app.port}/subscriptions`;
            // }
            expressApp.use(playgroundRoute, expressPlayground(graphIOptions));
        }

        settings.setData('schema', schema);
        // not sure how to close connection
        // settings.onShutdown(() => {
        //     if (middleware && middleware.connection) {
        //         middleware.connection.close();
        //     }
        // });

    }
};
