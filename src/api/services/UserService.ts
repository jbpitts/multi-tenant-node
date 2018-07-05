import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { FindManyOptions, DeepPartial } from 'typeorm';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { events } from '../subscribers/events';
import { constants } from '../common/constants';
import { NotAuthorized } from '../errors/NotAuthorized';

@Service()
export class UserService {

    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(currentUser: User, options?: FindManyOptions): Promise<User[]> {
        this.log.info('Find all users');
        if (!options) {
            options = {};
        }
        if (!options.where) {
            options.where = {};
        }
        if (!currentUser || currentUser.clientId === undefined) {
            throw new NotAuthorized();
        }
        options.where['clientId'] = currentUser.clientId;
        if (!options.relations) {
            options.relations = [];
        }
        options.relations.push('pets');
        // options.relations.push('updatedBy');
        return this.userRepository.find(options);
    }

    public findOne(currentUser: User, id: number): Promise<User | undefined> {
        this.log.info('Find A user');
        return this.userRepository.findOne({ where: {clientId: currentUser.clientId, id}});
    }

    public findByIds(currentUser: User, ids: any[]): Promise<User[] | undefined> {
        this.log.info('Find user by ids');
        return this.userRepository.findByIds( ids, { where: {clientId: currentUser.clientId}});
    }

    public async create(currentUser: User, user: User): Promise<User> {
        if (currentUser.id !== constants.system.userId || user.clientId === undefined) {
            user.clientId = currentUser.clientId;
        }

        user.createdById = currentUser.id;
        user.updatedById = currentUser.id;
        this.log.info('Create a new user => ', user.toString());
        const newUser = await this.userRepository.save(user);
        this.eventDispatcher.dispatch(events.user.created, newUser);
        return newUser;
    }

    public createFrom(currentUser: User, args: DeepPartial<User>): Promise<User> {
        const user: User = this.userRepository.create(args);
        return this.create(currentUser, user);
    }

    public update(currentUser: User, id: number, user: User): Promise<User> {
        this.log.info('Update a user');
        user.id = id;
        user.clientId = currentUser.clientId;
        user.updatedById = currentUser.id;
        return this.userRepository.save(user);
    }

    public remove(currentUser: User, id: number): Promise<boolean> {
        this.log.info('Delete a user');
        return new Promise((resolve, reject) => {
            this.findOne(currentUser, id).then( (user: User) => {
                this.userRepository.remove(user).then(() => {
                    resolve(true);
                }, reject);
            }, reject);
        });
    }

}
