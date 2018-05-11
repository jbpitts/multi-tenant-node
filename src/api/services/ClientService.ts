
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
            options.where['clientId'] = currentUser.clientId;
        }

        if (!options.relations) {
            options.relations = [];
        }
        options.relations.push('createdBy');
        options.relations.push('updatedBy');
        return this.clientRepository.find(options);
    }

    public findOne(currentUser: User, id: number): Promise<Client | undefined> {
        this.log.info('Find A client');
        return this.clientRepository.findOne({ where: {clientId: currentUser.clientId, id}});
    }

    public async create(currentUser: User, client: Client): Promise<Client> {
        // do not need to set clientId, user.clientId = currentUser.clientId;
        client.createdById = currentUser.id;
        client.updatedById = currentUser.id;
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
        client.id = id;
        client.clientId = currentUser.clientId;
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
