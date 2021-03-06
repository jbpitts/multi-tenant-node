
import { Resolver, Resolve } from 'vesper';
import { User } from '../../models/User';
import { UserLoader } from '../dataloaders/UserLoader';

@Resolver(User)
export class UserResolver {

    constructor(private currentUser: User) {
    }

    @Resolve()
    public updatedBy(entities: User, args: any, context: any): Promise<User> | User {
        if (entities.updatedBy) {
            return entities.updatedBy;
        } else {
            const userLoader: UserLoader = UserLoader.getUserLoader(this.currentUser);
            return userLoader.load(entities.updatedById);
        }
    }

    @Resolve()
    public createdBy(entities: User, args: any, context: any): Promise<User> | User {
        if (entities.createdBy) {
            return entities.createdBy;
        } else {
            const userLoader: UserLoader = UserLoader.getUserLoader(this.currentUser);
            return userLoader.load(entities.createdById);
        }
    }
}
