
import { EntityManager } from 'typeorm';

export interface ProdSeed {
    seed(em: EntityManager): Promise<any>;
}
