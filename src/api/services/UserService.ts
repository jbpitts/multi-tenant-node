import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { FindManyOptions, DeepPartial } from 'typeorm';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { events } from '../subscribers/events';

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
        options.where['clientId'] = currentUser.clientId;
        if (!options.relations) {
            options.relations = [];
        }
        options.relations.push('pets');
        options.relations.push('createdBy');
        options.relations.push('updatedBy');
        return this.userRepository.find(options);
    }

    public findOne(currentUser: User, id: number): Promise<User | undefined> {
        this.log.info('Find A user');
        return this.userRepository.findOne({ where: {clientId: currentUser.clientId, id}});
    }

    public async create(currentUser: User, user: User): Promise<User> {
        user.clientId = currentUser.clientId;
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
