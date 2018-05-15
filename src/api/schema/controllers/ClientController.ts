
import { Controller, Query, Mutation, Authorized } from 'vesper';
import { FindManyOptions, DeepPartial } from 'typeorm';

import { ClientService } from '../../services/ClientService';
import { User } from '../../models/User';
import { Client } from '../../models/Client';

export interface ClientArgs {
    limit?: number;
    offset?: number;
    order?: string;
}

@Controller()
export class ClientController {

    constructor(private currentUser: User,
                private clientService: ClientService) {
    }

    @Query()
    @Authorized()
    public clients(args: ClientArgs): Promise<Client[]> {
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
        if (args.order === 'name') {
            findOptions.order = {name: 'ASC'};
        }

        return this.clientService.find(this.currentUser, findOptions);
    }

    @Query()
    @Authorized()
    public client(arg: { id: number }): Promise<Client> {
        return this.clientService.findOne(this.currentUser, arg.id);
    }

    @Mutation()
    public clientCreate(args: DeepPartial<Client>): Promise<Client> {
        return this.clientService.createFrom(this.currentUser, args);
    }

    @Mutation()
    @Authorized()
    public clientDelete(arg: { id: number }): Promise<boolean> {
        return this.clientService.remove(this.currentUser, arg.id);
    }
}
