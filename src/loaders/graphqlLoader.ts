import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { bootstrap } from 'vesper';

import { User } from '../api/models/User';
import { Pet } from '../api/models/Pet';
// import { PetRepository } from '../api/repositories/PetRepository';
// import { UserRepository } from '../api/repositories/UserRepository';
import { UserController } from '../api/schema/controllers/UserController';
import { PetController } from '../api/schema/controllers/PetController';
import { env } from '../env';
// import { createDataLoader, createGraphQLServer } from '../lib/graphql';
import { Logger } from '../lib/logger';
import { currentUserVesper } from '../auth/currentUserChecker';
import { authorizationCheckerVesper } from '../auth/authorizationChecker';

export const graphqlLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    if (settings && env.graphql.enabled) {
        const expressApp = settings.getData('express_app');
        const log = new Logger(__filename);
        const connection = settings.getData('connection');

        bootstrap({
            port: 3000,
            expressApp,
            controllers: [
                UserController,
                PetController,
            ],
            entities: [
                User,
                Pet,
            ],
            schemas: [
                __dirname + '/../api/schema/models/**/*.graphql',
            ],
            typeorm: {
                connectionName: 'vesper',
            },
            graphIQLRoute: true,
            setupContainer: currentUserVesper(connection),
            authorizationChecker: authorizationCheckerVesper(connection),
        }).then(() => {
            log.info('graphql is available at /graphql or /graphiql. ' +
                'Playground in development mode at /playground');
        }, error => {
            log.error(error.stack ? error.stack : error);
        });

        // createGraphQLServer(expressApp, {
        //     route: env.graphql.route,
        //     editorEnabled: env.graphql.editor,
        //     queries: env.app.dirs.queries,
        //     mutations: env.app.dirs.mutations,
        //     dataLoaders: {
        //         user: createDataLoader(UserRepository),
        //         pet: createDataLoader(Pet),
        //         petsByUserIds: createDataLoader(PetRepository, {
        //             method: 'findByUserIds',
        //             key: 'userId',
        //             multiple: true,
        //         }),
        //     },
        // });

    }
};
