import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { FindManyOptions } from 'typeorm';

import { EventDispatcher, EventDispatcherInterface } from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Pet } from '../models/Pet';
import { User } from '../models/User';
import { PetRepository } from '../repositories/PetRepository';
import { events } from '../subscribers/events';

@Service()
export class PetService {

    constructor(
        @OrmRepository() private petRepository: PetRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) { }

    public find(options?: FindManyOptions): Promise<Pet[]> {
        this.log.info('Find all pets');
        return this.petRepository.find(options);
    }

    public findByUser(user: User): Promise<Pet[]> {
        this.log.info('Find all pets of the user', user.toString());
        return this.petRepository.find({
            where: {
                userId: user.id,
            },
        });
    }

    public findOne(id: number): Promise<Pet | undefined> {
        this.log.info('Find all pets');
        return this.petRepository.findOne({where: {id}});
    }

    public async create(pet: Pet): Promise<Pet> {
        this.log.info('Create a new pet => ', pet.toString());
        const newPet = await this.petRepository.save(pet);
        this.eventDispatcher.dispatch(events.pet.created, newPet);
        return newPet;
    }

    public update(id: number, pet: Pet): Promise<Pet> {
        this.log.info('Update a pet');
        pet.id = id;
        return this.petRepository.save(pet);
    }

    public delete(id: number): Promise<Pet> {
        this.log.info('Delete a pet');
        return new Promise((resolve, reject) => {
            this.findOne(id).then( (pet: Pet) => {
                this.petRepository.remove(pet).then(resolve, reject);
            }, reject);
        });
    }

}
