import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, CurrentUser
} from 'routing-controllers';

import { PetNotFoundError } from '../errors/PetNotFoundError';
import { Pet } from '../models/Pet';
import { User } from '../models/User';
import { PetService } from '../services/PetService';

@Authorized()
@JsonController('/pets')
export class PetController {

    constructor(
        private petService: PetService
    ) { }

    @Get()
    public find(@CurrentUser({required: true}) currentUser: User): Promise<Pet[]> {
        return this.petService.find(currentUser);
    }

    @Get('/:id')
    @OnUndefined(PetNotFoundError)
    public one(@CurrentUser({required: true}) currentUser: User, @Param('id') id: number): Promise<Pet | undefined> {
        return this.petService.findOne(currentUser, id);
    }

    @Post()
    public create(@CurrentUser({required: true}) currentUser: User, @Body() pet: Pet): Promise<Pet> {
        return this.petService.create(currentUser, pet);
    }

    @Put('/:id')
    public update(@CurrentUser({required: true}) currentUser: User, @Param('id') id: number, @Body() pet: Pet): Promise<Pet> {
        return this.petService.update(currentUser, id, pet);
    }

    @Delete('/:id')
    public delete(@CurrentUser({required: true}) currentUser: User, @Param('id') id: number): Promise<any> {
        return this.petService.delete(currentUser, id);
    }

}
