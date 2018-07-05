
import { Resolver, Resolve } from 'vesper';
import { Client } from '../../models/Client';
import { User } from '../../models/User';
import { UserLoader } from '../dataloaders/UserLoader';

@Resolver(Client)
export class ClientResolver {

    constructor(private currentUser: User) {
    }

    @Resolve()
    public updatedBy(entities: Client, args: any, context: any): Promise<User> {
        const userLoader: UserLoader = UserLoader.getUserLoader(this.currentUser, context);
        return userLoader.load(entities.updatedById);
    }

    @Resolve()
    public createdBy(entities: Client, args: any, context: any): Promise<User> {
        const userLoader: UserLoader = UserLoader.getUserLoader(this.currentUser, context);
        return userLoader.load(entities.createdById);
    }
}