
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { FindManyOptions, DeepPartial } from 'typeorm';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { Client } from '../models/Client';
import { ClientRepository } from '../repositories/ClientRepository';
import { events } from '../subscribers/events';
import { constants } from '../common/constants';
import { NotAuthorized } from '../errors/NotAuthorized';

@Service()
export class ClientService {

    constructor(
        @OrmRepository() private clientRepository: ClientRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(currentUser: User, options?: FindManyOptions): Promise<Client[]> {
        this.log.info('Find all clients');
        if (!options) {
            options = {};
        }
        if (!options.where) {
            options.where = {};
        }
        if (!currentUser || currentUser.clientId === undefined) {
            throw new NotAuthorized();
        }

        // SYSTEM can view anything
        if (currentUser.id !== constants.system.userId) {
            options.where['id'] = currentUser.clientId;
        }

        // removed because wanted to use DataLoader
        // if (!options.relations) {
        //    options.relations = [];
        // }
        // options.relations.push('createdBy');
        // eager load nested options.relations.push('createdBy.createdBy');
        // options.relations.push('updatedBy');
        return this.clientRepository.find(options);
    }

    public findOne(currentUser: User, id: number, name?: string): Promise<Client | undefined> {
        this.log.info('Find A client');
        const findOptions: any = {where: {clientId: currentUser.clientId}};
        if (id !== undefined) {
            findOptions.where.id = id;
        }
        if (name) {
            findOptions.where.name = name;
        }
        return this.clientRepository.findOne(findOptions);
    }

    public async create(currentUser: User, client: Client): Promise<Client> {
        // do not need to set clientId, user.clientId = currentUser.clientId;
        if (currentUser) {
            client.createdById = currentUser.id;
            client.updatedById = currentUser.id;
        } else {
            client.createdById = constants.system.userId;
            client.updatedById = constants.system.userId;
        }

        this.log.info('Create a new client => ', client.toString());
        const newClient = await this.clientRepository.save(client);
        this.eventDispatcher.dispatch(events.client.created, newClient);
        return newClient;
    }

    public createFrom(currentUser: User, args: DeepPartial<Client>): Promise<Client> {
        const client: Client = this.clientRepository.create(args);
        return this.create(currentUser, client);
    }

    public update(currentUser: User, id: number, client: Client): Promise<Client> {
        this.log.info('Update a Client');

        // todo need something other then user, should be part of a group
        if (currentUser.id === constants.system.userId) {
            client.id = id;
        } else {
            client.id = currentUser.clientId;
        }
        client.updatedById = currentUser.id;
        return this.clientRepository.save(client);
    }

    public remove(currentUser: User, id: number): Promise<boolean> {
        this.log.info('Delete a client');
        return new Promise((resolve, reject) => {
            this.findOne(currentUser, id).then( (client: Client) => {
                this.clientRepository.remove(client).then(() => {
                    resolve(true);
                }, reject);
            }, reject);
        });
    }

}
