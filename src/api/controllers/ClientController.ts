import {
    Authorized, Body, CurrentUser, Delete, Get, JsonController, OnUndefined, Param, Post, Put
} from 'routing-controllers';

import { ClientNotFoundError } from '../errors/ClientNotFoundError';
import { User } from '../models/User';
import { Client } from '../models/Client';
import { ClientService } from '../services/ClientService';

@JsonController('/clients')
export class ClientController {

    constructor(
        private clientService: ClientService
    ) { }

    @Get()
    @Authorized()
    public find( @CurrentUser({required: true}) currentUser: User): Promise<Client[]> {
        return this.clientService.find(currentUser);
    }

    @Get('/:id')
    @Authorized()
    @OnUndefined(ClientNotFoundError)
    public one( @CurrentUser({required: true}) currentUser: User, @Param('id') id: number): Promise<Client | undefined> {
        return this.clientService.findOne(currentUser, id);
    }

    @Post()
    public create(@CurrentUser({required: false}) currentUser: User,  @Body() client: Client): Promise<Client> {
        return this.clientService.create(currentUser, client);
    }

    @Put('/:id')
    @Authorized()
    public update( @CurrentUser({required: true}) currentUser: User, @Param('id') id: number, @Body() client: Client): Promise<Client> {
        return this.clientService.update(currentUser, id, client);
    }

    @Delete('/:id')
    @Authorized()
    public remove( @CurrentUser({required: true}) currentUser: User, @Param('id') id: number): Promise<boolean> {
        return this.clientService.remove(currentUser, id);
    }

}
