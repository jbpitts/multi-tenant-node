import { Service } from 'typedi';

import { UsersArgs } from './UsersArgs';

@Service()
export class UsersArgsValidator {

    public validate(args: UsersArgs): void {
        if (args.limit !== undefined && args.limit > 100) {
            throw new Error(`Limit cannot be more then 100.`);
        }
        if (args.limit !== undefined && args.limit < 1) {
            throw new Error(`Limit cannot be less then 1.`);
        }
        if (args.offset !== undefined && args.offset < 0) {
            throw new Error(`Offset cannot be less then zero.`);
        }
        if (args.order && args.order !== 'name' && args.order !== 'last') {
            throw new Error(`Sort can only be by name or by last`);
        }
    }

}
