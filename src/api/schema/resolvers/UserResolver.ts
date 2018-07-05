
import { Resolver, Resolve } from 'vesper';
import { User } from '../../models/User';
import { UserLoader } from '../dataloaders/UserLoader';

@Resolver(User)
export class UserResolver {

    constructor(private currentUser: User) {
    }

    @Resolve()
    public updatedBy(entities: User, args: any, context: any): Promise<User> {
        const userLoader: UserLoader = UserLoader.getUserLoader(this.currentUser, context);
        return userLoader.load(entities.updatedById);
    }

    @Resolve()
    public createdBy(entities: User, args: any, context: any): Promise<User> {
        const userLoader: UserLoader = UserLoader.getUserLoader(this.currentUser, context);
        return userLoader.load(entities.createdById);
    }
}
