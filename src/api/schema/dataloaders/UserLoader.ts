
import { UserService } from '../../services/UserService';
import { User } from '../../models/User';

import { Container } from 'typedi';
import DataLoader = require('dataloader');

export class UserLoader extends DataLoader<number, User> {
    public static getUserLoader(currentUser: User): UserLoader {
        let userLoader: UserLoader;
        if (currentUser && currentUser.dl && currentUser.dl.User) {
            userLoader = currentUser.dl.User;
        } else {
            userLoader = new UserLoader(currentUser, Container.get(UserService));
            if (!currentUser.dl) {
                currentUser.dl = {};
            }
            currentUser.dl.User = userLoader;
        }
        return userLoader;
    }

    constructor(currentUser: User, userService: UserService, options?: DataLoader.Options<number, User>) {
        super((ids: any[]) => {
            return userService.findByIds(currentUser, ids);
        }, options);
    }
}
