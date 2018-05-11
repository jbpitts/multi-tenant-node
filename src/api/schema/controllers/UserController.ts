
import { Controller, Query, Mutation, ArgsValidator, Authorized } from 'vesper';
import { FindManyOptions, DeepPartial } from 'typeorm';

import { Logger, LoggerInterface } from '../../../decorators/Logger';
import { UserService } from '../../services/UserService';
import { User } from '../../models/User';
import { UsersArgs } from '../args/UsersArgs';
import { UsersArgsValidator } from '../args/UsersArgsValidator';
import { NotAuthorized } from '../../errors/NotAuthorized';

@Controller()
export class UserController {

    constructor(private currentUser: User,
                private userService: UserService,
                @Logger(__filename) private log: LoggerInterface) {
    }

    // serves "users" requests
    @Query()
    @ArgsValidator(UsersArgsValidator)
    @Authorized()
    public users(args: UsersArgs, context: any, info: any): Promise<User[]> {
        this.log.info('GraphQL users');

        const findOptions: FindManyOptions = {};
        if (args.limit) {
            findOptions.take = args.limit;
        }
        if (args.offset) {
            findOptions.skip = args.offset;
        }
        if (args.order === 'last') {
            findOptions.order = {id: 'DESC'};
        }
        if (args.order === 'firstName') {
            findOptions.order = {firstName: 'ASC'};
        }
        if (args.order === 'lastName') {
            findOptions.order = {lastName: 'ASC'};
        }
        if (args.order === 'email') {
            findOptions.order = {email: 'ASC'};
        }

        // todo: don't think this check is needed, @Authorized solves this issue
        if (!this.currentUser) {
            throw new NotAuthorized();
        }

        return this.userService.find(this.currentUser, findOptions);
    }

    // serves "user" requests
    @Query()
    @Authorized()
    public user(arg: { id: number }): Promise<User> {
        if (!this.currentUser) {
            throw new NotAuthorized();
        }

        return this.userService.findOne(this.currentUser, arg.id);
    }

    // serves "userSave" requests
    @Mutation()
    @Authorized()
    public userSave(args: DeepPartial<User>): Promise<User> {
        if (!this.currentUser) {
            throw new NotAuthorized();
        }

        return this.userService.createFrom(this.currentUser, args);
    }

    // serves "userDelete" requests
    @Mutation()
    @Authorized()
    public userDelete(arg: { id: number }): Promise<boolean> {
        if (!this.currentUser) {
            throw new NotAuthorized();
        }

        return this.userService.remove(this.currentUser, arg.id);
    }
}
