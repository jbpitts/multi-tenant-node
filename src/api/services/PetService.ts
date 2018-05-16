import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { FindManyOptions } from 'typeorm';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Pet } from '../models/Pet';
import { User } from '../models/User';
import { PetRepository } from '../repositories/PetRepository';
import { events } from '../subscribers/events';
import { constants } from '../common/constants';
import { NotAuthorized } from '../errors/NotAuthorized';

@Service()
export class PetService {

    constructor(
        @OrmRepository() private petRepository: PetRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(currentUser: User, options?: FindManyOptions): Promise<Pet[]> {
        this.log.info('Find all pets');
        if (!options) {
            options = {};
        }
        if (!options.where) {
            options.where = {};
        }
        if (!currentUser || currentUser.clientId === undefined) {
            throw new NotAuthorized();
        }
        options.where['clientId'] = currentUser.clientId;

        return this.petRepository.find(options);
    }

    public findByUser(currentUser: User, user: User): Promise<Pet[]> {
        this.log.info('Find all pets of the user', user.toString());
        return this.petRepository.find({
            where: {
                userId: user.id,
                clientId: currentUser.clientId,
            },
        });
    }

    public findOne(currentUser: User, id: number): Promise<Pet | undefined> {
        this.log.info('Find all pets');
        return this.petRepository.findOne({ where: {clientId: currentUser.clientId, id}});
    }

    public async create(currentUser: User, pet: Pet): Promise<Pet> {
        if (currentUser.id !== constants.system.userId || pet.clientId === undefined) {
            pet.clientId = currentUser.clientId;
        }

        pet.createdById = currentUser.id;
        pet.updatedById = currentUser.id;

        this.log.info('Create a new pet => ', pet.toString());
        const newPet = await this.petRepository.save(pet);
        this.eventDispatcher.dispatch(events.pet.created, newPet);
        return newPet;
    }

    public update(currentUser: User, id: number, pet: Pet): Promise<Pet> {
        this.log.info('Update a pet');
        pet.id = id;
        pet.clientId = currentUser.clientId;
        pet.updatedById = currentUser.id;
        return this.petRepository.save(pet);
    }

    public delete(currentUser: User, id: number): Promise<Pet> {
        this.log.info('Delete a pet');
        return new Promise((resolve, reject) => {
            this.findOne(currentUser, id).then( (pet: Pet) => {
                this.petRepository.remove(pet).then(resolve, reject);
            }, reject);
        });
    }

}
